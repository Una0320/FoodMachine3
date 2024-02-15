import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from .models import user

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import jwt

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

@require_http_methods(["POST"])
@csrf_exempt
def newUser(request):
    if request.method == 'POST':
        # 從請求中獲取使用者提供的帳號和密碼
        data = json.loads(request.body)
        regname = data.get('username', '')
        regpwd = data.get('password', '')

        # 使用 make_password 將密碼加密
        # hashed_password = make_password(regpwd)

        # 創建新使用者
        new_user = user.objects.create(username=regname, password=make_password(regpwd))

        # 儲存使用者
        new_user.save()
        print(new_user.password)
        return JsonResponse({'message': 'Registration successful'})

    # 如果不是 POST 請求，可能需要返回一些錯誤訊息
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@require_http_methods(["POST"])
@csrf_exempt
def loginout(request):
    if request.method == 'POST':
        try:
            # 從請求中獲取使用者提供的帳號和密碼
            data = json.loads(request.body)
            username = data.get('username', '')
            password = data.get('password', '')
            print(username, password)
            if not username or not password:
                return JsonResponse({'error': 'Invalid request data'}, status=400)

            # 在資料庫中找到相應的使用者
            try:
                targetUser = user.objects.get(username=username)
            except user.DoesNotExist:
                return JsonResponse({'error': 'User does not exist'}, status=404)

            # 驗證密碼是否正確
            print((targetUser.id))
            if check_password(password, targetUser.password):
                return JsonResponse({'id': targetUser.id, 'name': targetUser.username}, safe=False)
            else:
                # 密碼錯誤
                return JsonResponse({'error': 'Invalid password'}, status=401)
        except json.decoder.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

    # 如果不是 POST 請求，可能需要返回一些錯誤訊息
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@require_http_methods(["GET"])
@csrf_exempt
def checkUsername(request, judgeName):
    if request.method == 'GET':        
        try:
            existing_user = user.objects.get(username=judgeName)
            # 如果存在相同用戶名，返回用戶名已存在的訊息
            if existing_user:
                return JsonResponse({'message': True})
        except user.DoesNotExist:
            # 如果不存在相同用戶名，返回用戶名不存在的訊息
            return JsonResponse({'message': False})

    # 如果不是 POST 請求，可能需要返回一些錯誤訊息
    return JsonResponse({'error': 'Invalid request method'}, status=400)
