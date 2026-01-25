from django.db import models
from django.contrib.auth.models import User # Importiamo il modello Utente standard

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    def __str__(self): return self.name

class MemeTemplate(models.Model):
    # Definizione degli stati possibili
    STATUS_CHOICES = [
        ('pending', 'In Attesa'),
        ('approved', 'Approvato'),
        ('rejected', 'Rifiutato'),
    ]

    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='memes/')
    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.ManyToManyField(Tag, blank=True)
    
    # NUOVO: Stato del meme (default: pending)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    
    # NUOVO: Chi l'ha caricato (può essere vuoto se l'utente non è loggato per ora)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.title} ({self.status})"