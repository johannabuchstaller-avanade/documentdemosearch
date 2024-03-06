from typing import List, Dict
def transform_document_data_search(original_data_list):
    transformed_data = { 
        "results": []
    }

    # Iterate over each document in the input list
    for original_data in original_data_list:
        score = original_data.get("Chunks", [{}])[0].get("Score", "N/A")
        document_id = str(original_data.get("Id", "N/A"))
        content = original_data.get("Chunks", [{}])[0].get("Content", "N/A")
        file_name = original_data.get("FileName", "N/A")
        title = original_data.get("Metadata", {}).get("title", "N/A")
        page_number = original_data.get("Metadata", {}).get("page_number", "N/A")
        document_link_storage = original_data.get("Metadata", {}).get("document_link_storage", "N/A")
        data_type = original_data.get("Metadata", {}).get("data_type", "N/A")
        content_html = original_data.get("Metadata", {}).get("content_html", "N/A")
        document_link = original_data.get("Metadata", {}).get("document_link", "N/A")

        document_result = {
            "score": score,
            "document": {
                "id": document_id,
                "content": content,
                "page_number": page_number,
                "document_link": document_link,
                "document_link_storage": document_link_storage, 
                "dataType": data_type, 
                "title": title,
                "content_html": content_html,  
                "content_text": content,
                "document_filename": file_name
            }
        }

        # Append the constructed document result to the results list
        transformed_data["results"].append(document_result)

    return transformed_data