from django.db import models

# Create your models here.
from django.contrib.auth.models import User

# Create your models here.
class Question(models.Model):
    question = models.CharField(max_length=500)
    
    option1=models.CharField(max_length=200)
    option2=models.CharField(max_length=200)
    option3=models.CharField(max_length=200)
    option4=models.CharField(max_length=200)
    answer=models.CharField(max_length=200)
    

class Log(models.Model):
    user = models.ForeignKey(to=User, null=False, blank=False, on_delete=models.CASCADE)
    question = models.ForeignKey(to=Question, null=False, blank=False, on_delete=models.CASCADE)
    response = models.CharField(null=False, blank=False,max_length=200)
    attempt_time = models.DateTimeField(auto_now_add=True)