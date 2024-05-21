import logging
import azure.functions as func
import os
import http
import json
from new_class_24 import ApiClient

tenant_id = os.environ["tenant_id"]
client_id =os.environ["client_id"]
client_secret =os.environ["client_secret"]
base_url=os.environ["base_url"]

def main(req: func.HttpRequest) -> func.HttpResponse:
    client=ApiClient(tenant_id, client_id, client_secret, base_url)
    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse("Invalid request body. Please provide a valid JSON object.", status_code=400)
    
    # Extract request parameters
    #model = req_body.get("Model")
    messages = req_body.get("messages")
    temperature=req_body.get("temperature")

    # Make the API call with the extracted parameters
    response = client.get_chat_completion_4({
        "temperature": temperature,
        "messages": messages

    })
    #response_json = json.dumps(response)
    message_content = response['choices'][0]['message']['content']

    # Return the response
    return func.HttpResponse(message_content, status_code=200)