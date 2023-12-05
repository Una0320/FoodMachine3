import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import render, redirect
from django.http import JsonResponse
from datetime import datetime

from .models import growthOUT

@require_http_methods(["POST"])
@csrf_exempt
def NGrowthOUT(request):
    try:
        growth_data = json.loads(request.body)

        growth_data['watertemp']  = growth_data.get('watertemp', None)
        growth_data['waterlevel'] = growth_data.get('waterlevel', None)
        growth_data['airtemp']    = growth_data.get('airtemp', None)
        growth_data['humidity']   = growth_data.get('humidity', None)
        growth_data['oxygen'] = growth_data.get('oxygen', None)
        growth_data['co2']    = growth_data.get('co2', None)
        growth_data['ec'] = growth_data.get('ec', None)
        growth_data['ph'] = growth_data.get('ph', None)
        growth_data['boxid'] = growth_data.get('boxid', None)

        # new one growthOUT
        new_record = growthOUT(
            timestamp  = datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            watertemp  = growth_data['watertemp'],
            waterlevel = growth_data['waterlevel'],
            airtemp  = growth_data['airtemp'],
            humidity = growth_data['humidity'],
            oxygen   = growth_data['oxygen'],
            co2 = growth_data['co2'],
            ec  = growth_data['ec'],
            ph  = growth_data['ph'],

            # boxid_id=growth_data['boxid'] # 使用外鍵名 + _id

            # Current Fixed boxid = 2
        )
        
        new_record.save()
        new_record.boxid.set(growth_data['boxid'])
        

        return JsonResponse({'message': True}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)