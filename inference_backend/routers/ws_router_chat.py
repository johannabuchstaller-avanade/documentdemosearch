import json
import random
import aiohttp
from aiohttp import ClientError
from core.logging import logger
import logging
# from itertools import cycle

from typing import Dict
from core.config import settings
from fastapi import WebSocket, WebSocketDisconnect


#TO DO: Error handling helper class / function [for phase 2, 1.3.0]
#TO DO: Traversing regions in a specific order [for phase 2, 1.3.0]
def get_key_and_endpoint(modelname):

    filtered_endpoints = [entry for entry in settings.azure_keys_and_endpoints if modelname in entry["models"]] # should be in the preferred order based on latency

    if not filtered_endpoints:
        return None

    return filtered_endpoints, random.choice(filtered_endpoints)

#TO DO:
async def post_to_azure_api(session, headers, payload, endpoint):
    try:
        resp = await session.post(endpoint, json=payload, headers=headers)
        return resp
    except ClientError as e:
        logger.error(f"AIOHTTP error occurred: {e}")
        return None



'''
Asynchronous function that streams a chat conversation using a WebSocket connection.

Parameters:

prompt (str): The initial prompt for the chat conversation.
websocket (WebSocket): The WebSocket connection used for communication.
maxtoken (int, optional): Maximum number of tokens allowed in the generated response. Default is 400.
modelname (str, optional): Name of the model to use for generating responses. Default is "gpt-35-turbo".
temperature (float, optional): Temperature parameter for controlling the randomness of the generated responses. Default is 0.
This function streams the chat conversation between the Python program and the client, sending the prompt and receiving generated responses until the WebSocket connection is closed.
'''
async def chatgpt_stream(prompt: str, websocket: WebSocket, maxtoken: int = 400, modelname: str = "gpt-35-turbo-16k", temperature: float = 0, history: list = []):

    filtered_endpoints, azure_info = get_key_and_endpoint(modelname)

    
    if azure_info is None:
        error_message = f"Cannot find model {modelname}."
        logger.error(error_message)
        await websocket.send_json({"status": "error", "message": error_message, "code": 500})
        return
    
    AZURE_API_KEY = azure_info["key"]
    AZURE_API_CHAT_URL = azure_info["endpoint"]
    AZURE_API_VERSION = azure_info["api-version"]
    region = azure_info["region"]
    environment = azure_info["environment"]
   
    
    async with aiohttp.ClientSession() as session:     
        headers = {
            "api-key": AZURE_API_KEY,
            "Content-Type": "application/json"
        }
        
        messages = history + [{"role": "user", "content": prompt}]
        payload = {
            "messages": messages,
            "max_tokens": maxtoken,
            "temperature": temperature,
            "stream": True
        }
        logger.debug(f"DEBUG: headers: {headers}")
        logger.debug(f"DEBUG: payload: {payload}")

        endpoint = f"{AZURE_API_CHAT_URL}openai/deployments/{modelname}/chat/completions?api-version={AZURE_API_VERSION}"
        # print(f"DEBUG: endpoint: {endpoint}")
      
        resp = await post_to_azure_api(session, headers, payload, endpoint)

        # TO DO: Failover to another region only when rate limiting 429 is received
        if (resp is None or resp.status != 200) and azure_info["region"] != settings.AZURE_API_REGION :
     
            # Failover to another region
            current_region = next((reg for reg in filtered_endpoints if reg["region"] == settings.AZURE_API_REGION), None)
            print(f"FAIL SAFE: current_region: {current_region}")
            logger.info(f"FAIL SAFE: current_region: {current_region}")
            if current_region is None:
                error_message = f"Cannot find region {settings.AZURE_API_REGION} in filtered_endpoints"
                logger.error(error_message)
                await websocket.send_json({"status": "error", "message": error_message, "code": 500})
                return
            AZURE_API_KEY = current_region["key"]
            AZURE_API_CHAT_URL = current_region["endpoint"]
            AZURE_API_VERSION = current_region["api-version"]
            region = current_region["region"]
            environment = current_region["environment"]

            headers["api-key"] = AZURE_API_KEY
            endpoint = f"{AZURE_API_CHAT_URL}openai/deployments/{modelname}/chat/completions?api-version={AZURE_API_VERSION}"
         
            resp = await post_to_azure_api(session, headers, payload, endpoint)

        if resp is None:
            error_message = f"[IA] Cannot connect to Azure API"
            logger.error(error_message)
            await websocket.send_json({"status": "error", "message": error_message, "code": 500})
            return
  
        if resp.status != 200:
            error_message = f"{resp.reason}"
            logger.error(resp)
            await websocket.send_json({"status": "error", "message": error_message, "code": resp.status, "region": region, "endpoint": endpoint, "model": modelname, "payload": payload})
            resp.close()
            return
        
        completion_tokens = "" 
        current_token = ""
        finish_reason = ""

        async for line in resp.content:
            line_decoded = line.decode("utf-8")
            # print(f"{line_decoded}")
            if line_decoded.startswith("data:"):
                json_str = line_decoded[6:].strip()
                logger.debug(f"DEBUG: json_str: {json_str}")
                if json_str == "[DONE]":
                    logger.debug("Received [DONE] from Azure API")
                    break  # Exit the loop when [DONE] is received
                if json_str:
                    try:
                        data = json.loads(json_str)
                        
                        choices = data.get("choices", [])
                        if choices:
                            content_dict = choices[0].get("delta", {})
                            finish_reason = choices[0].get("finish_reason", "")
                            if content_dict.get("content"):
                                current_token = content_dict["content"] 
                                completion_tokens += current_token
                               
                                response_data = {
                                    "text": current_token,
                                    "status": "success"	,
                                    "model": modelname,
                                    "environment": environment,
                                    "region": region,
                                    "finish_reason": finish_reason
                                }  
                                await websocket.send_json(response_data)
                    except ClientError as e:
                        logger.error(f"AIOHTTP error occurred: {e}")
                        await websocket.send_json({"status": "error", "message": f"[IA] Backend communication error: {e}", "code": 502})
                    except json.JSONDecodeError as e:
                        logger.debug(f"Attempting to decode JSON string: {json_str}")
                        print(f"Attempting to decode JSON string: {json_str}")
                        logger.error(f"Error decoding JSON: {e}")
                        await websocket.send_json({"status": "error", "message": f"[IA] Backend JSON decoding error: {e}","code": 400, "region": region, "endpoint": endpoint, "model": modelname, "payload": payload})
                    except Exception as e:
                        logger.error(f"Unexpected error occurred: {e}")
                        await websocket.send_json({"status": "error", "message": f"[IA] (Inside) Unexpected error occurred: {e}", "code": 500})
        response_data = {
                        "text": "",
                        "status": "done",
                        "model": modelname,
                        "environment": environment,
                        "region": region,
                        "finish_reason": finish_reason
                    }
        await websocket.send_json(response_data)
           

async def parse_data(data: str) -> Dict:
    try:
        return json.loads(data)
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON: {e}")
        raise ValueError("[IA] Invalid JSON received")

'''
Asynchronous function that serves as the endpoint for the WebSocket chat communication.

Parameters:

websocket (WebSocket): The WebSocket connection used for communication.
This function is responsible for handling incoming WebSocket connections and initiating a chat conversation using the chatgpt_stream function. It receives messages from the client via the WebSocket connection and sends back generated responses.

Note: The chatgpt_stream function is called from within this function to handle the chat conversation.
'''
async def websocket_chat_endpoint(websocket: WebSocket):
    logger.debug("Inside websocket chat endpoint.")

    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # print(f"data: {data}")
            prompt = json.loads(data)["prompt"]
            maxtoken = json.loads(data)["maxtoken"]
            modelname = json.loads(data)["modelname"]
            temperature = json.loads(data)["temperature"]
            history = json.loads(data)["history"]

            await chatgpt_stream(prompt, websocket, maxtoken, modelname, temperature, history)
    except WebSocketDisconnect as e:
        logger.error(f"[IA] WebSocket disconnected with code: {e}")
    except ValueError as e:
        logger.error(f"[IA] ValueError occurred: {e}")
        await websocket.send_json({"status": "error", "message": f"[IA] {str(e)}", "code": 403})
    except RuntimeError as e:
        if "Cannot call 'send' once a close message has been sent" in str(e):
            logger.error(f"[IA] WebSocket was closed before we were done sending data: {e}")
        else:
            raise
    except Exception as e:
        logger.error(f"Unexpected error occurred: {e}")
        
        await websocket.send_json({"status": "error", "message": f"[IA] (Outside) Unexpected error occurred: {e}", "code": 500})
    # finally:
    #     await websocket.close()
