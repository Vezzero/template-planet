from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
# Rimuovi google_login dagli import
from memes.views import MemeTemplateViewSet, TagViewSet

router = DefaultRouter()
router.register(r'templates', MemeTemplateViewSet, basename='memetemplate')
router.register(r'tags', TagViewSet, basename='tag')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # path('api/auth/google/', google_login), <--- RIMOSSO/COMMENTATO
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)