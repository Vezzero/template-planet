from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from memes.views import MemeTemplateViewSet
from memes.views import MemeTemplateViewSet, TagViewSet

# Configurazione Router API
router = DefaultRouter()
router.register(r'templates', MemeTemplateViewSet)
router.register(r'tags', TagViewSet) # Ora i tag sono su /api/tags/

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

# Serve per vedere le immagini caricate in fase di sviluppo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)