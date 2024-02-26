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


def main(req: func.HttpRequest) -> func.HttpResponse:
    client=ApiClient(tenant_id, client_id, client_secret, base_url)
    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse("Invalid request body. Please provide a valid JSON object.", status_code=400)
    document_id = req_body.get("DocumentId")
    response = client.download_document(document_id)
    response_json=json.dumps(response)
    return func.HttpResponse(response_json, status_code=200)