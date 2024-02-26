import logging
import azure.functions as func
import os
import http
import json
from new_class_24 import ApiClient
from helpers import transform_document_data_search


tenant_id =
client_id =
client_secret =
base_url=

def main(req: func.HttpRequest) -> func.HttpResponse:
    client=ApiClient(tenant_id, client_id, client_secret, base_url)
    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse("Invalid request body. Please provide a valid JSON object.", status_code=400)
    top = req_body.get("top")
    searchkeyword = req_body.get("q")
    #llmrerank = bool(req_body.get("LlmReRank"))
    #llmrerankcontext = req_body.get("LlmReRankContext")
    #libraryids = req_body.get("LibraryIds")
    response = client.search_documents({
        "Top" : top,
        "SearchKeyword" : searchkeyword,
        "LlmReRank" : False,
        #"LlmReRankContext" : llmrerankcontext,
        "LibraryIds" : [48]
    })
    transformed_response = transform_document_data_search(response)

    # Serialize the transformed response back into a JSON-formatted string
    response_json = json.dumps(transformed_response)

    # Return the transformed response
    return func.HttpResponse(response_json, status_code=200)
    