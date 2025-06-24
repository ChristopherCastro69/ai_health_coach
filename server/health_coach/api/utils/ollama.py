"""
This module provides utility functions for interacting with the Ollama AI service. I had to host locally since api calls are expensive in production when using API keys like OpenAI. I used gemma model for lightweight services because doing React Native or any other APP ide with locally hosted ai model and docker is not enough for my 12 GB RAM. It's gonna take a long time. Looking forward to implementing for AI features in the future.
"""

import requests
import subprocess
import json


def check_ollama_installed():
    """Checks if Ollama is installed and available in the system's PATH."""
    try:
        subprocess.run(['ollama', '--version'], check=True, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False 
    
    
# Set your model name here to be used across the application
MODEL_NAME = "gemma2:2b"

def check_model_available():
    """Checks if the specified MODEL_NAME is available in Ollama."""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        response.raise_for_status()
        models_data = response.json()
        return any(model['name'] == MODEL_NAME for model in models_data.get('models', []))
    except (requests.exceptions.RequestException, json.JSONDecodeError):
        return False 

