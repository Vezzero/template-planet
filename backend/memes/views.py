from rest_framework import viewsets
from .models import MemeTemplate, Tag
from .serializers import MemeTemplateSerializer, TagSerializer

class MemeTemplateViewSet(viewsets.ModelViewSet):
    queryset = MemeTemplate.objects.all().order_by('-created_at')
    serializer_class = MemeTemplateSerializer
    authentication_classes = []
    permission_classes = []

# NUOVO: ViewSet per i Tag (solo lettura per il frontend)
class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    authentication_classes = []
    permission_classes = []