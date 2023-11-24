import json
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

        # new one growthIN
        new_record = growthIN(
            timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            airtemp=growth_data['airtemp'],
            humidity=growth_data['humidity'],
            luminance = growth_data['luminance'],
            ledrgb = growth_data['ledrgb'],
            sunlong = growth_data['sunlong'],

            boxid_id=growth_data['boxid'] # 使用外鍵名 + _id

            # Current Fixed boxid = 2
        )
        
        new_record.save()
        # new_record.boxid.set(growth_data['boxid'])
        

        return JsonResponse({'message': 'Data saved successfully'}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)