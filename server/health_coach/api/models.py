from django.db import models
from django.utils import timezone

# Create your models here.

class FoodEntry(models.Model):
    """
    Model to store food entries and their calorie estimates.
    """
    food_name = models.CharField(max_length=200)
    calories = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)
    consumed_at = models.DateField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Food entries'
    
    def __str__(self):
        return f"{self.food_name} - {self.calories} calories" 

class Message(models.Model):
    user = models.CharField(max_length=100)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    