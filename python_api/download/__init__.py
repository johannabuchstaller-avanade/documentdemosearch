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
    client = ApiClient(tenant_id, client_id, client_secret, base_url)
    try:
        req_body = req.get_json()
        document_id = req_body.get('DocumentId')
        
        if not document_id:
            return func.HttpResponse(
                "Please pass a DocumentId in the request body.",
                status_code=400
            )
        download_content = client.download_document(document_id)
        
        if download_content:
            filename = f"document{document_id}.pdf"
            content_disposition = f"attachment; filename={filename}"
            return func.HttpResponse(
                body=download_content,
                status_code=200,
                headers={"Content-Disposition": content_disposition, "Content-Type": "application/pdf"}
            )
        else:
            return func.HttpResponse("Failed to download document.", status_code=500)
    except Exception as e:
        return func.HttpResponse(f"An error occurred: {str(e)}", status_code=500)
