import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from datetime import datetime

from boxes.models import box
from .models import device

@require_http_methods(["GET"])
@csrf_exempt
def DeviceInfo(request, box_id):
    try:
        # 取得特定box_id的相關device
        device_data = device.objects.filter(boxid__id=box_id)
        device_data = list(device_data.values())
        # print(device_data)

        return JsonResponse(device_data, status=200, safe = False)

    except box.DoesNotExist:
        return JsonResponse({'error': 'Box not found'}, status=404)

    except device.DoesNotExist:
        return JsonResponse({'error': 'Device not found'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    
@require_http_methods(["PUT"])
@csrf_exempt
def UpdateDevice(request, box_id, device_id):
    try:
        data = json.loads(request.body)
        print(data)

        # 取得與 box_id 相關的 box
        current_box = box.objects.get(id=box_id)
        current_device = current_box.inwhichbox.get(id=device_id)
        
        for key, value in data.items():
            setattr(current_device, key, value)
            current_device.save()

        return JsonResponse({'message': 'Device updated successfully'}, status=200)

    except box.DoesNotExist:
        return JsonResponse({'error': 'Box not found'}, status=404)

    except device.DoesNotExist:
        return JsonResponse({'error': 'Device not found'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
# Create your views here.
