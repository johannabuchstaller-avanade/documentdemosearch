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
#client=ApiClient(tenant_id, client_id, client_secret, base_url)

#context = os.environ["SAMPLE_ENVIRONMENT"]
context ="context"

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
    response = {"Message": {"Content": "Generative AI refers to a type of artificial intelligence that is capable of generating new and original content, such as images, text, music, or even videos. Unlike other AI models that are trained to recognize patterns or make predictions based on existing data, generative AI models are designed to create new data that resembles the patterns and characteristics of the training data.\n\nGenerative AI models are typically based on deep learning techniques, such as generative adversarial networks (GANs) or variational autoencoders (VAEs). These models consist of two main components: a generator and a discriminator. The generator is responsible for creating new data samples, while the discriminator evaluates the generated samples and tries to distinguish them from real data.\n\nDuring the training process, the generator and discriminator are trained together in a competitive manner. The generator aims to produce samples that are indistinguishable from real data, while the discriminator tries to correctly classify the samples as real or fake. This adversarial training process helps the generator improve its ability to generate more realistic and high-quality data over time.\n\nGenerative AI has various applications across different domains. For example, in computer vision, generative AI can be used to generate realistic images or videos, which can be useful in areas like virtual reality, gaming, or content creation. In natural language processing, generative AI can be used to generate human-like text, which can be applied in chatbots, language translation, or content generation.\n\nHowever, it is important to note that generative AI models can also be prone to biases or generate inappropriate content if not properly trained or supervised. Ethical considerations and responsible use of generative AI are crucial to ensure that the generated content aligns with societal norms and values.", "Role": "assistant"}, "FinishReason": "stop"}

    response_json = json.dumps(response)

    # Return the response
    return func.HttpResponse(response_json, status_code=200)