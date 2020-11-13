import random
import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User

from .models import Question, Log

# Create your views here.
def startquiz(request):
    questions=Question.objects.all()
    quiz=[]
    for question in questions:
        quiz.append({'q_id': question.id, 'question':question.question,'options':[question.option1,question.option2,question.option3,question.option4],'answer':question.answer})
        #print(quiz)
        jsonQuestions = json.dumps(quiz)
    
    return render(request,'quiz.html',{'quizQandA': jsonQuestions})

@csrf_exempt
def saveAttempts(request):
    if request.method != 'POST':
        return redirect("/")
    if not request.user.is_authenticated:
        return redirect("/")
    json_s = request.body.decode()
    attempts = json.loads(json_s)
    # clear all logs of that user
    logs = Log.objects.filter(user=request.user)
    logs._raw_delete(logs.db)
    
    for attempt in attempts:
        question = Question.objects.filter(id=attempt['q_id'])
        if not question.exists():
            continue
        Log.objects.create(user=request.user,question=question.last(), response=attempt['attempt'])
    return JsonResponse({'status': 1, 'text': 'Saved Successfully'})
