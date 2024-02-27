import requests
from datetime import datetime, timedelta
import http.client
import os
import ssl
import certifi
import json

# from dotenv import load_dotenv
# load_dotenv()


# tenant_id = os.getenv("tenant_id")
# client_id =os.getenv("client_id")
# client_secret =os.getenv("client_secret")
# base_url=os.getenv("base_url")
hak="hak"

class ApiClient:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(ApiClient, cls).__new__(cls)
            cls._instance._init_flag = False
        return cls._instance

    def __init__(self, tenant_id, client_id, client_secret, base_url):
        if not self._init_flag:
            self.base_url = base_url
            self.tenant_id = tenant_id
            self.client_id = client_id
            self.client_secret = client_secret
            self.token = None
            self.token_expiry = None
            self._init_flag = True

    def fetch_token(self):
        """Fetch the API access token."""
        if self.is_token_valid():
            return self.token, self.token_expiry

        ca_bundle_path = certifi.where()
        os.environ['REQUESTS_CA_BUNDLE'] = ca_bundle_path

        try:
            _create_unverified_https_context = ssl._create_unverified_context
        except AttributeError:
            pass
        else:
            ssl._create_default_https_context = _create_unverified_https_context

        # Prepare connection and request details
        conn = http.client.HTTPSConnection(f"login.microsoftonline.com")
        payload = f'client_id={self.client_id}&client_secret={self.client_secret}&grant_type=client_credentials'
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }

        # Make the request to get the token
        try:
            conn.request("POST", f"/{self.tenant_id}/oauth2/v2.0/token", payload, headers)
            res = conn.getresponse()
            data = res.read()
            token_data = data.decode("utf-8")
            token_data = json.loads(token_data)
            self.token = token_data['access_token']
            self.token_expiry = datetime.now() + timedelta(seconds=token_data['expires_in'])
            return self.token, self.token_expiry
        except Exception as e:
            return f"An error occurred: {e}"
        finally:
            conn.close()

    def is_token_valid(self):
        """Check if the current token is valid."""
        return self.token_expiry and datetime.now() < self.token_expiry

    def get_headers(self):
        """Ensure token is valid and return headers for API requests."""
        if not self.is_token_valid():
            self.fetch_token()
        return {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
    def get_chat_completion(self, request_body):
        """OpenAI call, hand over request body, to adjust model, context etc. in this format:
        {
        "Model": "Gpt35",
        "Messages": [
            {
                "Content": "You are a data science expert",
                "Role": "system"
            },
            {
                "Content": "explain generative ai",
                "Role": "user"
            }
        ],
        "MaxTokens": 3000,
        "Temperature": 0,
        "TopP": 1,
        #"Stop": [],
        "PresencePenalty": 0,
        "FrequencyPenalty": 0
        }
        """
        url = f"{self.base_url}/api/openai/chatcompletion"

        headers = self.get_headers()

        response = requests.post(url, headers=headers, json=request_body)
        if response.status_code == 200:
            return response.json()
        else:
            return None
        
    def search_documents(self, request_body):
        """Semantic search, hand over request body in json format as shown below, adjust parameters accordingly:
        {
        "top": 10,
        "q": "what is the definition of switching described in the documents",
        "LibraryIds": [
            48
        ]
        }
        """
        url=f"{self.base_url}/api/documents/search"
        headers = self.get_headers()
        response = requests.post(url, headers=headers, json=request_body)
        if response.status_code == 200:
            return response.json()
        else:
            return None
        
    # def download_document(self, document_id):
    #     """Download documents by document id. Hand over request body accordingly:
    #     {
    #     "DocumentId": 546
    #     }
    #     """
    #     url=f"{self.base_url}/api/documents/{document_id}/download"
    #     headers = self.get_headers()
    #     downloads_folder = os.path.join(os.path.expanduser("~"), "Downloads")
    #     if not os.path.exists(downloads_folder):
    #         os.makedirs(downloads_folder)
    #     filename =f"document{document_id}.pdf"
    #     full_file_path = os.path.join(downloads_folder, filename)
    #     response = requests.get(url, headers=headers, stream=True)
    #     if response.status_code == 200:
    #         with open(full_file_path, "wb") as f:
    #             for chunk in response.iter_content(chunk_size=8192):
    #                 f.write(chunk)
    #         return f"Document downloaded successfuly: {full_file_path}"
    #     elif response.status_code == 404:
    #         return "Document not found"
    #     else:
    #         return response.content
        



    def download_document(self, document_id):
        """Download documents by document id. Hand over request body accordingly:
        {
        "DocumentId": 546
        }
        """
        url = f"{self.base_url}/api/documents/{document_id}/download"
        headers = self.get_headers()
        
        # Specify the folder within your repository where you want to save the document
        save_folder = os.path.join(os.path.dirname(__file__), "downloads")
        
        if not os.path.exists(save_folder):
            os.makedirs(save_folder)
        
        filename = f"document{document_id}.pdf"
        full_file_path = os.path.join(save_folder, filename)
        
        response = requests.get(url, headers=headers, stream=True)
        
        if response.status_code == 200:
            with open(full_file_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # Return the path where the document is saved within the repository
            return full_file_path
        elif response.status_code == 404:
            return "Document not found"
        else:
            return response.content





if __name__ == "__main__":
    print("hello")