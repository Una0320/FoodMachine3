import json
import base64
from django.core.files.base import ContentFile
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import render, redirect
from django.http import JsonResponse
from datetime import datetime

from .models import growthIN

@require_http_methods(["POST"])
@csrf_exempt
def NGrowthIN(request):
    try:
        growth_data = json.loads(request.body)
        rgb_dict = {}
        # new one growthIN
        new_record = growthIN(
            timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            airtemp=growth_data['temperature'],
            humidity=growth_data['humidity'],
            luminance = growth_data['light'],
            sunlong = growth_data['time'],
            boxid_id=growth_data['boxid'] # 使用外鍵名 + _id

        )
        if growth_data['img']:
            img_binary = base64.b64decode(growth_data['img'])
            new_record.cur_Image.save(new_record.timestamp+'.jpg', ContentFile(img_binary), save=True)
        rgb_dict['RGB']=growth_data['RGB']
        new_record.ledrgb = rgb_dict
        new_record.save()
        

        return JsonResponse({'message': True}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)