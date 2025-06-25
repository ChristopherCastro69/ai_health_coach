from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db import models
from datetime import datetime
from ..models import FoodEntry
from ..serializers import FoodEntrySerializer
from django.db.models import Sum, F


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
    
    @action(detail=False, methods=['get'])
    def total_history(self, request):
        """
        Get historical daily calorie totals.
        Returns a list of dates and the total calories for each day.
        """
        # Default to the last 30 days if no date range is provided
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)

        # Allow for custom date ranges via query parameters
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')
        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        if end_date_str:
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()

        daily_totals = (
            FoodEntry.objects
            .filter(consumed_at__range=[start_date, end_date])
            .values('consumed_at')
            .annotate(total_calories=Sum('calories'))
            .order_by('-consumed_at')
        )
        
        return Response(daily_totals)