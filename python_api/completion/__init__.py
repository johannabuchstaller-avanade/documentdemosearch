import logging
import azure.functions as func
import os
import http
import json
from new_class_24 import ApiClient

from dotenv import load_dotenv
load_dotenv()


tenant_id = os.getenv("tenant_id")
client_id =os.getenv("client_id")
client_secret =os.getenv("client_secret")
base_url=os.getenv("base_url")
#client=ApiClient(tenant_id, client_id, client_secret, base_url)

#context = os.environ["SAMPLE_ENVIRONMENT"]
context ="context"

# def main(req: func.HttpRequest) -> func.HttpResponse:
#     logging.info('Python HTTP trigger function processed a request.')

#     # Get the user input from the request's query parameters or the request body
#     try:
#         req_body = req.get_json()
#     except ValueError:
#         return func.HttpResponse("Invalid request body. Please provide a valid JSON object.", status_code=400)

#     user_input = req_body.get('input')
        
#     if user_input:
#         # Call the GPT deployment with the user input
        
#         gpt_output = user_input + " " + context

#         # Return the output as an HTTP response
#         return func.HttpResponse(gpt_output, status_code=200)
#     else:
#         return func.HttpResponse(
#             "Please pass an input in the query string or in the request body.",
#             status_code=400
#         )

def main(req: func.HttpRequest) -> func.HttpResponse:
    client=ApiClient(tenant_id, client_id, client_secret, base_url)
    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse("Invalid request body. Please provide a valid JSON object.", status_code=400)
    
    # Extract request parameters
    model = req_body.get("Model")
    messages = req_body.get("Messages")
    max_tokens = req_body.get("MaxTokens")
    temperature = req_body.get("Temperature")
    top_p = req_body.get("TopP")
    presence_penalty = req_body.get("PresencePenalty")
    frequency_penalty = req_body.get("FrequencyPenalty")

    # Make the API call with the extracted parameters
    response = client.get_chat_completion({
        "Model": model,
        "Messages": messages,
        "MaxTokens": max_tokens,
        "Temperature": temperature,
        "TopP": top_p,
        "PresencePenalty": presence_penalty,
        "FrequencyPenalty": frequency_penalty
    })
    response_json = json.dumps(response)

    # Return the response
    return func.HttpResponse(response_json, status_code=200)