# server/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import food_entry_ai, food_entry_views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'food-entries', food_entry_views.FoodEntryViewSet, basename='foodentry')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('check-ollama/', food_entry_ai.check_ollama, name='check-ollama'),
    path('check-model/', food_entry_ai.check_model, name='check-model'),
    path('process-food-input/', food_entry_ai.FoodEntryFromAI.as_view(), name='process-food-input'),
]