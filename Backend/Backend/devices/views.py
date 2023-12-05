import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from datetime import datetime
from datetime import time

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
        print("PUT device\n"+data)

        # 取得與 box_id 相關的 box
        current_box = box.objects.get(id=box_id)
        current_device = current_box.inwhichbox.get(id=device_id)
        
        for key, value in data.items():
            if key == 'RGB':
                rgb_dict = {}
                rgb_dict['RGB']=value
                setattr(current_device, "parameter", rgb_dict)
            elif key == "brightness":
                setattr(current_device, "devicemode", value)
            # 如果鍵是 'opentime' 或 'closetime'，則解析列表 [小時, 分鐘] 並創建 TimeField
            # elif key == 'closetime':
            #     setattr(current_device, 'closeTime', time(*value))
            # elif key == 'opentime':
            #     setattr(current_device, 'openTime', time(*value))
            elif (key == 'opentime') or (key == 'closetime'):
                setattr(current_device, key, time(*value))
            elif key == 'boxid':
                continue
            else:
                setattr(current_device, key, value)
            current_device.save()

        return JsonResponse({'message': True}, status=200)

    except box.DoesNotExist:
        return JsonResponse({'error': 'Box not found'}, status=404)

    except device.DoesNotExist:
        return JsonResponse({'error': 'Device not found'}, status=404)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
# Create your views here.
