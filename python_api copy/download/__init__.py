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

# def main(req: func.HttpRequest) -> func.HttpResponse:
#     client=ApiClient(tenant_id, client_id, client_secret, base_url)
#     try:
#         req_body = req.get_json()
#         document_id = req_body.get('DocumentId')
        
#         if not document_id:
#             return func.HttpResponse(
#                 "Please pass a DocumentId in the request body.",
#                 status_code=400
#             )
#         download_path = client.download_document(document_id)
#         download_path = json.loads(download_path)
#         print(download_path)
#         if download_path:
#             return func.HttpResponse(body=download_path.body, status_code=200, headers=download_path.headers)
#         else:
#             return func.HttpResponse("Failed to download document.", status_code=500)
#     except Exception as e:
#         return func.HttpResponse(f"An error occurred: {str(e)}", status_code=500)


# def main(req: func.HttpRequest) -> func.HttpResponse:
#     client = ApiClient(tenant_id, client_id, client_secret, base_url)
#     try:
#         req_body = req.get_json()
#         document_id = req_body.get('DocumentId')
        
#         if not document_id:
#             return func.HttpResponse(
#                 "Please pass a DocumentId in the request body.",
#                 status_code=400
#             )
        
#         # Download the document content
#         document_content = client.download_document(document_id)
        
#         # Set the content type and attachment filename for the response
#         headers = {
#             'Content-Type': 'application/octet-stream',
#             'Content-Disposition': f'attachment; filename=document_{document_id}.pdf'
#         }
        
#         # Return the document content as an attachment
#         return func.HttpResponse(body=document_content, status_code=200, headers=headers)
#     except Exception as e:
#         return func.HttpResponse(f"An error occurred: {str(e)}", status_code=500)



##working giving back binary contents
# def main(req: func.HttpRequest) -> func.HttpResponse:
#     client = ApiClient(tenant_id, client_id, client_secret, base_url)
#     try:
#         req_body = req.get_json()
#         document_id = req_body.get('DocumentId')
        
#         if not document_id:
#             return func.HttpResponse(
#                 "Please pass a DocumentId in the request body.",
#                 status_code=400
#             )
#         download_content = client.download_document(document_id)
        
#         if download_content:
#             filename = f"document{document_id}.pdf"
#             content_disposition = f"attachment; filename={filename}"
#             return func.HttpResponse(
#                 body=download_content,
#                 status_code=200,
#                 headers={"Content-Disposition": content_disposition, "Content-Type": "application/pdf"}
#             )
#         else:
#             return func.HttpResponse("Failed to download document.", status_code=500)
#     except Exception as e:
#         return func.HttpResponse(f"An error occurred: {str(e)}", status_code=500)



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
