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


# def main(req: func.HttpRequest) -> func.HttpResponse:
#     client=ApiClient(tenant_id, client_id, client_secret, base_url)
#     try:
#         req_body = req.get_json()
#     except ValueError:
#         return func.HttpResponse("Invalid request body. Please provide a valid JSON object.", status_code=400)
#     document_id = req_body.get("DocumentId")
#     response = client.download_document(document_id)
#     response_json=json.dumps(response)
#     return func.HttpResponse(response_json, status_code=200)



def main(req: func.HttpRequest) -> func.HttpResponse:
    client=ApiClient(tenant_id, client_id, client_secret, base_url)
    try:
        # Parse request body for document_id
        req_body = req.get_json()
        document_id = req_body.get('DocumentId')
        
        if not document_id:
            return func.HttpResponse(
                "Please pass a DocumentId in the request body.",
                status_code=400
            )
        
        # Call the download_document function
        download_path = client.download_document(document_id)
        
        # Check the response from download_document and return appropriate response
        if download_path == "Document not found":
            return func.HttpResponse("Document not found", status_code=404)
        elif isinstance(download_path, str):  # Assuming successful download returns the path
            return func.HttpResponse(f"Document downloaded successfully: {download_path}", status_code=200)
        else:
            return func.HttpResponse("Failed to download document.", status_code=500)
    except Exception as e:
        return func.HttpResponse(f"An error occurred: {str(e)}", status_code=500)