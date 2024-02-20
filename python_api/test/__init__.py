import logging
import azure.functions as func
import os

context = os.environ["SAMPLE_ENVIRONMENT"]


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # Get the user input from the request's query parameters or the request body
    try:
        req_body = req.get_json()
    except ValueError:
        return func.HttpResponse("Invalid request body. Please provide a valid JSON object.", status_code=400)

    user_input = req_body.get('input')
        
    if user_input:
        # Call the GPT deployment with the user input
        
        gpt_output = user_input + " " + context

        # Return the output as an HTTP response
        return func.HttpResponse(gpt_output, status_code=200)
    else:
        return func.HttpResponse(
            "Please pass an input in the query string or in the request body.",
            status_code=400
        )