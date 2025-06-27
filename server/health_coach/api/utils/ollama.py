"""
This module provides utility functions for interacting with the Ollama AI service. I had to host locally since api calls are expensive in production when using API keys like OpenAI. I used gemma model for lightweight services because doing React Native or any other APP ide with locally hosted ai model and docker is not enough for my 12 GB RAM. It's gonna take a long time. Looking forward to implementing for AI features in the future.
"""

import requests
import json
import re
import os

# Use an environment variable for the Ollama host.
# In Docker, this will be 'host.docker.internal'. Locally, it will default to 'localhost'.
OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "localhost")
OLLAMA_BASE_URL = f"http://{OLLAMA_HOST}:11434"

# Set your model name here to be used across the application
MODEL_NAME = "gemma2:2b"

def check_ollama_service_running():
    """Checks if the Ollama service is running by hitting its root endpoint."""
    try:
        response = requests.get(OLLAMA_BASE_URL, timeout=3)
        # Check for a successful status and if the response body contains the expected text.
        if response.status_code == 200 and "Ollama is running" in response.text:
            return True
        return False
    except requests.exceptions.RequestException:
        # Any network exception means the service is not accessible.
        return False

def check_model_available():
    """Checks if the specified MODEL_NAME is available in Ollama."""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
        response.raise_for_status()
        models_data = response.json()
        return any(model['name'] == MODEL_NAME for model in models_data.get('models', []))
    except (requests.exceptions.RequestException, json.JSONDecodeError):
        return False

def generate_ai_response(prompt):
    """
    Sends a prompt to the Ollama API and returns the AI's response text.
    Handles potential connection errors and timeouts.
    """
    try:
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            },
            # timeout=60  # Set a generous timeout
        )
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        return response.json().get("response", "")
    except requests.exceptions.RequestException as e:
        # Handle network errors (connection, timeout, etc.)
        print(f"Error connecting to Ollama service: {e}")
        return None

def extract_json_from_response(text):
    """
    Finds and extracts the first valid JSON object from a string.
    The AI model might sometimes return extra text or markdown around the JSON.
    """
    if not text:
        return None
    
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if not match:
        return None
    
    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError:
        return None 