import logging
import azure.functions as func
import os
import http
import json
from new_class_24 import ApiClient



tenant_id = "705d07a3-2eea-4f3b-ab59-65ca29abeb26"
client_id = "7bd4c8a5-fddf-4c44-9042-7b77aff69932"
client_secret = "U5z8Q~Qi3jt3eGPgIVu4I5EBLYHG6Yt6IfnLBaPx&scope=api%3A%2F%2F8b75aa22-29f8-459b-a52b-6b23fb653003%2F.default"
base_url='https://webapp-msfwex23-30-gpt-api-qa.azurewebsites.net'

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