from django.urls import path

from . import views

urlpatterns = [
    path('Quiz/',views.startquiz,name='startquiz'),
    #path('getNextQuestion/', views.getNextQuestion, name='getNextQuestion')
    path('saveAttempts/', views.saveAttempts, name='saveAttempts')
]