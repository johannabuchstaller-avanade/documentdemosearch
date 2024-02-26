import os
from dotenv import load_dotenv


load_dotenv()

class Settings:
    AZURE_API_URL: str = os.getenv("AZURE_API_URL", "")
    DEFAULT_MODEL: str = os.getenv("DEFAULT_MODEL", "gpt-35-turbo")
    DEFAULT_MAX_TOKENS: int = int(os.getenv("DEFAULT_MAX_TOKENS", 400))
    DEFAULT_TEMPERATURE: float = float(os.getenv("DEFAULT_TEMPERATURE", 0.5))
    AZURE_API_KEY_COMPLETION: str = os.getenv("AZURE_API_KEY_COMPLETION", "")
    AZURE_API_URL_COMPLETION: str = os.getenv("AZURE_API_URL_COMPLETION", "")
    AZURE_ENVIRONMENT: str = os.getenv("AZURE_ENVIRONMENT", "dev")
    AZURE_API_REGION: str = os.getenv("AZURE_API_REGION", "swedencentral")

    azure_keys_and_endpoints = [
        {"key": os.getenv("REACT_APP_OPENAI_API_KEY_CHAT", ""), "endpoint": os.getenv("REACT_APP_OPENAI_API_BASE_CHAT", ""), "environment": AZURE_ENVIRONMENT, "region": "swedencentral", "api-version": "2023-07-01-preview",  "models": ["gpt-4-turbo", "gpt-35-turbo"]},
    ]

settings = Settings()
