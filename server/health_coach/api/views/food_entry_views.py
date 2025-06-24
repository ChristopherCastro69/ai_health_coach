from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import models
from datetime import datetime
from ..models import FoodEntry
from ..serializers import FoodEntrySerializer


class FoodEntryViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing food entries.
    Provides `list`, `create`, `retrieve`, `update`, and `destroy` actions.
    
    Also includes custom actions for:
    - `today`: Get all food entries for the current day.
    - `daily_total`: Get the total calories for today.
    - `history`: Get food entries for a specific date.
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
    
    @action(detail=False, methods=['get'])
    def daily_total(self, request):
        """
        Get the total calories for today.
        """
        today = timezone.now().date()
        total = FoodEntry.objects.filter(
            consumed_at=today
        ).aggregate(total=models.Sum('calories'))['total'] or 0
        
        return Response({'total_calories': total})
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """
        Get food entries for a specific date.
        """
        specific_date_str = request.query_params.get('date')

        if not specific_date_str:
            return Response(
                {'error': 'A "date" query parameter is required. Use YYYY-MM-DD format.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            specific_date = datetime.strptime(specific_date_str, '%Y-%m-%d').date()
            entries = FoodEntry.objects.filter(consumed_at=specific_date).order_by('created_at')
            serializer = self.get_serializer(entries, many=True)
            return Response(serializer.data)
            
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )