from rest_framework import serializers
from .models import MemeTemplate, Tag

# 1. Serializer semplice per elencare i tag disponibili
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

# 2. Aggiorniamo il serializer dei Meme
class MemeTemplateSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tag.objects.all(), write_only=True, source='tags'
    )

    class Meta:
        model = MemeTemplate
        # Aggiungi 'status' ai campi
        fields = ['id', 'title', 'image', 'tags', 'tag_ids', 'created_at', 'status']