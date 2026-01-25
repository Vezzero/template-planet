from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MemeTemplate, Tag
from .serializers import MemeTemplateSerializer, TagSerializer

class MemeTemplateViewSet(viewsets.ModelViewSet):
    serializer_class = MemeTemplateSerializer
    # Lasciamo pubblico per ora, ma la logica sotto filtra i risultati
    authentication_classes = [] 
    permission_classes = []

    def get_queryset(self):
        # Se l'utente è staff (Admin), vede tutto per poter moderare
        # Nota: Siccome non abbiamo ancora il login token nel frontend, 
        # per ora filtriamo tutto. Quando integreremo Google, useremo self.request.user.is_staff
        
        # PER ORA: Restituisci solo gli approvati nelle liste pubbliche
        return MemeTemplate.objects.filter(status='approved').order_by('-created_at')

    # Endpoint personalizzato per gli ADMIN per vedere i meme in attesa
    # URL: /api/templates/pending/
    @action(detail=False, methods=['get'])
    def pending(self, request):
        pending_memes = MemeTemplate.objects.filter(status='pending').order_by('-created_at')
        serializer = self.get_serializer(pending_memes, many=True)
        return Response(serializer.data)

    # Endpoint per APPROVARE/RIFIUTARE un meme
    # URL: /api/templates/{id}/moderate/
    @action(detail=True, methods=['post'])
    def moderate(self, request, pk=None):
        meme = self.get_object()
        new_status = request.data.get('status') # 'approved' o 'rejected'
        
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