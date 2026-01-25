# 1. ADD THIS IMPORT AT THE TOP
from django.contrib.auth.models import User

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MemeTemplate, Tag
from .serializers import MemeTemplateSerializer, TagSerializer

class MemeTemplateViewSet(viewsets.ModelViewSet):
    serializer_class = MemeTemplateSerializer
    authentication_classes = [] 
    permission_classes = []

    def get_queryset(self):
        if self.action == 'list':
            return MemeTemplate.objects.filter(status='approved').order_by('-created_at')
        return MemeTemplate.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        username = self.request.data.get('username_author')
        user = None
        if username:
            # Now 'User' is defined and this line will work
            user, _ = User.objects.get_or_create(username=username)
        
        serializer.save(author=user)

    @action(detail=False, methods=['get'])
    def my_uploads(self, request):
        username = request.query_params.get('username')
        if not username:
            return Response([])
        my_memes = MemeTemplate.objects.filter(author__username=username).order_by('-created_at')
        serializer = self.get_serializer(my_memes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        pending_memes = MemeTemplate.objects.filter(status='pending').order_by('-created_at')
        serializer = self.get_serializer(pending_memes, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def moderate(self, request, pk=None):
        meme = self.get_object()
        new_status = request.data.get('status')
        if new_status in ['approved', 'rejected', 'pending']:
            meme.status = new_status
            meme.save()
            return Response({'status': 'status updated'})
        else:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    authentication_classes = []
    permission_classes = []