from django.contrib import admin

# Register your models here.
from .models import Question, Log


admin.site.register(Question)
admin.site.register(Log)