"""
This module provides utility functions for interacting with the Ollama AI service. I had to host locally since api calls are expensive in production when using API keys like OpenAI. I used gemma model for lightweight services because doing React Native or any other APP ide with locally hosted ai model and docker is not enough for my 12 GB RAM. It's gonna take a long time. Looking forward to implementing for AI features in the future.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from ..utils.ollama import (
    check_ollama_installed,
    check_model_available,
)

@api_view(['GET'])
@permission_classes([AllowAny])
def check_ollama(request):
    """Checks if Ollama is installed and available in the system's PATH."""
    return Response({'message': check_ollama_installed()})


@api_view(['GET'])
@permission_classes([AllowAny])
def check_model(request):
    """Checks if the default AI model is available in Ollama."""
    return Response({'message': check_model_available()})