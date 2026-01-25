from django.db import models

# 1. Nuovo Modello Tag
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# 2. Aggiorniamo MemeTemplate
class MemeTemplate(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='memes/')
    created_at = models.DateTimeField(auto_now_add=True)
    # Collegamento ai Tag (può essere lasciato vuoto)
    tags = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return self.title