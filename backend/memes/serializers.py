from rest_framework import serializers
from .models import MemeTemplate, Tag

# 1. Serializer semplice per elencare i tag disponibili
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

# 2. Aggiorniamo il serializer dei Meme
class MemeTemplateSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True) # Per LEGGERE (mostra nomi)
    
    # Per SCRIVERE: Accetta una lista di ID (es: [1, 5, 8])
    # PrimaryKeyRelatedField controlla automaticamente che l'ID esista nel DB!
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Tag.objects.all(), 
        write_only=True,
        source='tags' # Dice a Django di salvare questi ID nel campo 'tags' del modello
    )

    class Meta:
        model = MemeTemplate
        fields = ['id', 'title', 'image', 'tags', 'tag_ids', 'created_at']

    # Non serve più il metodo create() personalizzato! 
    # Django gestisce da solo il salvataggio delle relazioni ManyToMany se usiamo PrimaryKeyRelatedField.