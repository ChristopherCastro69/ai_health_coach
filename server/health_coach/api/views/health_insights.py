from datetime import datetime

from django.db.models import Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import FoodEntry
from ..prompts.ai_prompts import HEALTH_INSIGHT_PROMPT
from ..utils.ollama import generate_ai_response


class HealthInsightAI(APIView):
    """
    Provides AI-powered health insights based on a day's food entries.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        print("\n=== Generating Health Insight ===")
        date_str = request.query_params.get('date', timezone.now().strftime('%Y-%m-%d'))
        print(f"Processing insight for date: {date_str}")

        try:
            specific_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            print(f"Error: Invalid date format received: {date_str}")
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)

        entries = FoodEntry.objects.filter(consumed_at=specific_date)
        if not entries.exists():
            print("No food entries found for this date. Returning default message.")
            return Response({"insight": "No food entries for this date. Start logging to get insights!"})

        print(f"Found {entries.count()} food entries.")
        food_list = list(entries.values('food_name', 'calories'))
        total_calories = entries.aggregate(total=Sum('calories'))['total'] or 0
        food_list_str = ", ".join([f"{item['food_name']} ({item['calories']} kcal)" for item in food_list])
        print(f"Total calories for the day: {total_calories}")

        prompt = HEALTH_INSIGHT_PROMPT.format(
            food_list_str=food_list_str,
            total_calories=total_calories
        )
      
        
        print("Calling AI service...")
        ai_response_text = generate_ai_response(prompt)
        if not ai_response_text:
            print("Error: No response from AI service.")
            return Response({"error": "Failed to get a response from the AI service."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            
        print(f"AI Response received:\n---\n{ai_response_text}\n---")
        print("=== Health Insight Generation Complete ===")
        return Response({"insight": ai_response_text.strip()})

