from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets
from .models import FoodEntry
from .serializers import FoodEntrySerializer

class FoodEntryViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing food entries.
    Provides `list`, `create`, `retrieve`, `update`, and `destroy` actions.
    """
    queryset = FoodEntry.objects.all().order_by('-consumed_at')
    serializer_class = FoodEntrySerializer