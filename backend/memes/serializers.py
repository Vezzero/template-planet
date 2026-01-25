from rest_framework import serializers
from .models import MemeTemplate

class MemeTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemeTemplate
        fields = ['id', 'title', 'image']