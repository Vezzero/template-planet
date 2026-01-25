from django.contrib import admin
from .models import MemeTemplate, Tag

admin.site.register(Tag)

@admin.register(MemeTemplate)
class MemeTemplateAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    filter_horizontal = ('tags',)