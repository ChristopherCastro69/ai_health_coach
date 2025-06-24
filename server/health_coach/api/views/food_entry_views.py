from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from ..models import FoodEntry
from ..serializers import FoodEntrySerializer


class FoodEntryViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing food entries.
    Provides `list`, `create`, `retrieve`, `update`, and `destroy` actions.
    """
    queryset = FoodEntry.objects.all().order_by('-consumed_at')
    serializer_class = FoodEntrySerializer 
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """
        Get all food entries for today.
        """
        today = timezone.now().date()
        entries = FoodEntry.objects.filter(
            consumed_at=today
        ).order_by('-created_at')
        
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def copy_to_today(self, request, pk=None):
        """
        Copies an existing food entry, setting its consumed_at date to today.
        """
        original_entry = self.get_object()
        new_entry = FoodEntry.objects.create(
            food_name=original_entry.food_name,
            calories=original_entry.calories,
            consumed_at=timezone.now().date()
        )
        serializer = self.get_serializer(new_entry)
        return Response(serializer.data, status=201)