from rest_framework import serializers
from .models import MemeTemplate, Tag

class MemeTemplateSerializer(serializers.ModelSerializer):
    # 'tags' serve per LEGGERE (output): restituisce ["gatto", "cane"]
    tags = serializers.StringRelatedField(many=True, read_only=True)
    
    # 'tags_input' serve per SCRIVERE (input): accetta "gatto, cane"
    tags_input = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = MemeTemplate
        fields = ['id', 'title', 'image', 'tags', 'tags_input', 'created_at']

    # Sovrascriviamo il metodo create per gestire i tag manuali
    def create(self, validated_data):
        # Estraiamo la stringa dei tag (se c'è) e la rimuoviamo dai dati del meme
        tags_string = validated_data.pop('tags_input', None)
        
        # Creiamo il meme
        meme = MemeTemplate.objects.create(**validated_data)

        # Se ci sono tag, li splittiamo e li creiamo/colleghiamo
        if tags_string:
            tag_names = [name.strip() for name in tags_string.split(',')]
            for name in tag_names:
                if name: # Evita stringhe vuote
                    # get_or_create restituisce (oggetto, creato_booleano)
                    tag, _ = Tag.objects.get_or_create(name=name)
                    meme.tags.add(tag)
        
        return meme