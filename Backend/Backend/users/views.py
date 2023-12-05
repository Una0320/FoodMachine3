import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import render, redirect
from .models import user

@require_http_methods(["GET"])
@csrf_exempt
def UserList(request):
    try:
        user_dbdata = user.objects.all()
        
        data = [{'id': user.id, 
                 'username': user.username, 
                 'userfeedback': user.userfeedback} 
                 for user in user_dbdata]
        
        return JsonResponse(data, safe=False)
    
    except user.DoesNotExist:
        return JsonResponse({'message': 'User Empty.'})
    # Test
    # return HttpResponse(f"this is {boxname}")
# Create your views here.
