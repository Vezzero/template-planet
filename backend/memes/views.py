from rest_framework import viewsets
from .models import MemeTemplate
from .serializers import MemeTemplateSerializer

class MemeTemplateViewSet(viewsets.ModelViewSet):
    queryset = MemeTemplate.objects.all().order_by('-created_at')
    serializer_class = MemeTemplateSerializer