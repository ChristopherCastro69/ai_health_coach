# server/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import food_entry_views, health_insights

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'food-entries', food_entry_views.FoodEntryViewSet, basename='foodentry')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
    path('health-insight/', health_insights.HealthInsightAI.as_view(), name='health-insight'),
]