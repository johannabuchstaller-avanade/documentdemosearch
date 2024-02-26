import requests
from datetime import datetime, timedelta
import http.client
import os
import ssl
import certifi
import json
hak="hllo"
class ApiClient:
    def __init__(self, tenant_id, client_id, client_secret, base_url):
        self.base_url = base_url
        self.tenant_id = tenant_id
        self.client_id = client_id
        self.client_secret = client_secret
        self.token = None
        self.token_expiry = datetime.now()

    def fetch_token(self):
        """Fetch the API access token."""
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
        return datetime.now() < self.token_expiry

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
        request_body={
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
