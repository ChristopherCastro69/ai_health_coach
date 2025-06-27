"""
This module provides utility functions for interacting with the Ollama AI service. I had to host locally since api calls are expensive in production when using API keys like OpenAI. I used gemma model for lightweight services because doing React Native or any other APP ide with locally hosted ai model and docker is not enough for my 12 GB RAM. It's gonna take a long time. Looking forward to implementing for AI features in the future.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.utils import timezone
import dateparser

from ..models import FoodEntry
from ..serializers import FoodEntrySerializer
from ..prompts.ai_prompts import HEALTH_COACH_PROMPT
from ..utils.ollama import (
    check_ollama_service_running,
    check_model_available,
    generate_ai_response,
    extract_json_from_response,
)

@api_view(['GET'])
@permission_classes([AllowAny])
def check_ollama(request):
    """Checks if the Ollama service is running and accessible."""
    return Response({'message': check_ollama_service_running()})



@api_view(['GET'])
@permission_classes([AllowAny])
def check_model(request):
    """Checks if the default AI model is available in Ollama."""
    return Response({'message': check_model_available()})



class FoodEntryFromAI(APIView):
    """
    Creates food entries from a natural language user input string.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        print("\n=== Starting Food Entry Processing ===")
        user_input = request.data.get("message")
        print(f"Received user input: {user_input}")
        
        if not user_input:
            print("Error: No message provided")
            return Response({"error": "No message provided."}, status=status.HTTP_400_BAD_REQUEST)

        current_date_str = timezone.now().strftime('%Y-%m-%d')
        prompt = HEALTH_COACH_PROMPT.format(
            user_input=user_input,
            current_date=current_date_str
        )
        print(f"Generated prompt with current date: {current_date_str}")

        print("Calling AI service...")
        ai_response_text = generate_ai_response(prompt)
        if not ai_response_text:
            return Response({"error": "Failed to get a response from the AI service."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        ai_data = extract_json_from_response(ai_response_text)
        if not ai_data:
            return Response({"error": "AI response was not valid JSON.", "raw_text": ai_response_text}, status=status.HTTP_400_BAD_REQUEST)
        print(f"Extracted JSON data: {ai_data}")

        foods = ai_data.get("foods")
        consumed_date_str = ai_data.get("consumed_date")

        if not foods or not consumed_date_str:
            return Response({"error": "AI response was missing 'foods' or 'consumed_date'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            consumed_at = dateparser.parse(consumed_date_str).date()
        except (ValueError, AttributeError):
            return Response({"error": f"Invalid date '{consumed_date_str}' from AI."}, status=status.HTTP_400_BAD_REQUEST)

        created_entries = []
        for food_item in foods:
            food_name = food_item.get("name")
            calories = food_item.get("calories")
            if not food_name or calories is None:
                print(f"Skipping invalid food item: {food_item}")
                continue

            entry = FoodEntry.objects.create(
                food_name=food_name,
                calories=calories,
                consumed_at=consumed_at
            )
            created_entries.append(entry)
            print(f"Created entry: {food_name} - {calories} calories")

        serializer = FoodEntrySerializer(created_entries, many=True)
        print("\n=== Food Entry Processing Complete ===")
        return Response(serializer.data, status=status.HTTP_201_CREATED)

