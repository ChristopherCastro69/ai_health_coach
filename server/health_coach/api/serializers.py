"""
Serializers for the Health Coach API.
"""
from rest_framework import serializers
from .models import FoodEntry

class FoodEntrySerializer(serializers.ModelSerializer):
    """
    Serializer for the FoodEntry model.
    """
    class Meta:
        model = FoodEntry
        fields = '__all__'
        read_only_fields = ['id', 'created_at'] 