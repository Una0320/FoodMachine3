import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from datetime import datetime
from django.db.models import Q
from itertools import chain

from .models import box
from devices.models import device
# from users.models import user

@require_http_methods(["GET"])
@csrf_exempt
def BoxInfo(request, box_id):
    try:
        box_dbdata = box.objects.get(id=box_id)
        
        data = {"id": box_dbdata.id, "name": box_dbdata.boxname, 
            "users":[user.username for user in box_dbdata.users.all()],
            "plant":[seed.name for seed in box_dbdata.plant.all()]}
        
        return JsonResponse(data)
    
    except box.DoesNotExist:
        timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return JsonResponse({'message': 'Box with ID not found '+timestamp})
    # Test
    # return HttpResponse(f"this is {boxname}")

@require_http_methods(["GET"])
@csrf_exempt
def BoxListInfo(request, user_id):
    box_dbdata = box.objects.filter(users__id=user_id)  # Return Type is "QuerySet"
    if box_dbdata:
        data = []
        for box_data in box_dbdata:
            box_info = {"id": box_data.id, 
                        "name": box_data.boxname, 
                        "users":[user.username for user in box_data.users.all()],
                        "plant":[seed.name for seed in box_data.plant.all()],
                        "device":[str(d.id) + " " + d.devicename for d in box_data.inwhichbox.all()]

            }
            data.append(box_info)
        return JsonResponse(data, safe=False)
    else:
        timestamp=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return JsonResponse({'message': timestamp + ', Box with UserID_' + user_id + ' not found.'})

@require_http_methods(["GET"])
@csrf_exempt
def BoxGrowths(request, box_id):
    try:
        '''
        # 找到特定的 box
        targetBox = box.objects.get(id=box_id)
        # 獲取 box 中的 growthIN
        growth_records = targetBox.whichbox.all()
        '''
       
        # Separate growthIN & growthOUT
        growth_out_results = box.objects.get(id=box_id).whichboxes.filter(boxid__isnull=False)
        growth_in_results = box.objects.get(id=box_id).whichbox.filter(boxid__id=box_id)

        # Merge growthIN & growthOUT
        # combined_grow = box.objects.get(id=box_id).whichboxes.filter(Q(growthout__isnull=False) | Q(growthin__isnull=False))
        combined_grow = chain(growth_in_results, growth_out_results)

        # 獲取日期範圍
        start_date = request.GET.get('start_date', None)
        # print(start_date)
        end_date = request.GET.get('end_date', None)
        # print(end_date)

        # 過濾不符合時間條件的growthreocrd資料
        if start_date:
            # growth_records = growth_records.filter(timestamp__gte=start_date)
            # combined_grow = combined_grow.filter(timestamp__gte = start_date)
            growth_out_results = growth_out_results.filter(timestamp__gte = start_date)
            growth_in_results = growth_in_results.filter(timestamp__gte = start_date)

        if end_date:
            # growth_records = growth_records.filter(timestamp__lte=end_date)
            # combined_grow = combined_grow.filter(timestamp__lte=end_date)
            growth_out_results = growth_out_results.filter(timestamp__lte=end_date)
            growth_in_results = growth_in_results.filter(timestamp__lte=end_date)

        # 獲取要返回的屬性列表，如果 attributes 未提供，則默認返回所有屬性
        attributes_param = request.GET.get('attributes', None)
        # 如果沒有指定 attributes 參數，預設會傳回所有屬性
        attributes = attributes_param.split(',') if attributes_param else [
            'timestamp', 'watertemp', 'airtemp', 'humidity', 'oxygen', 'co2', 'ec', 'ph', 'waterlevel', 'luminance', 'ledrgb', 'sunlong'
        ]

        # 將 growthrecords 序列化為 JSON 格式，只包含指定屬性
        growth_records_data = list(growth_in_results.values())
        # growth_records_data = []
        # for record in growth_in_results:
        #     record_data = {}
        #     # for attr in attributes:
        #     for key, value in record.items():
        #         record_data[key] = getattr(record, key)
        #     growth_records_data.append(record_data)


        return JsonResponse(growth_records_data, safe=False)
    except box.DoesNotExist:
        return JsonResponse({'message': 'Box with ID not found'}, status=404)
    

@require_http_methods(["POST"])
@csrf_exempt
def NewBox(request):
    newBox_json = json.loads(request.body)
    # Test
    # tempstring = newBox_json['key1']+","+newBox_json['key2']
    # return HttpResponse(tempstring)

    newBox = box()
    newBox.save()
    for key, value in newBox_json.items():
        # 如果使用者沒有命名，則預設 boxname = 'box'+id
        if key == 'boxname':
            if newBox_json['boxname']:
                newBox.boxname = newBox_json['boxname']
            else:
                if box.objects.latest('id'):
                    lastest_id = box.objects.latest('id').id + 1
                # lastest_id 包含了最新一筆資料的 ID
                else:
                    # 處理資料表為空的情況
                    lastest_id = 1
                newBox.boxname = 'box' + str(lastest_id)
        elif key == 'users':
            if isinstance(value, list):
                newBox.users.set(value)
            else:
                # Handle the case where a single user ID is provided as an integer
                newBox.users.add(value)
        elif key == 'plant':
            if isinstance(value, list):
                newBox.plant.set(value)
            else:
                # Handle the case where a single plant ID is provided as an integer
                newBox.plant.add(value)
    newBox.save()

    # Set closeTime for the device (if provided in the JSON)
    if newBox_json['closeTime']:
        default_device = device(devicename='LED', devicestatus='active', boxid=newBox, closeTime=datetime.strptime(newBox_json['closeTime'], "%Y-%m-%d %H:%M:%S"))
    else:
        default_device = device(devicename='LED', devicestatus='active', boxid=newBox)

    default_device.openTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Set openTime to the box's timestamp
    default_device.save()

    return HttpResponse(f"Create new box, boxname = {newBox.boxname}")

@require_http_methods(["PUT"])
@csrf_exempt
def UpdateBox(request, updateBox_id):
    if request.method == 'PUT':
        try:
            updateBox = box.objects.get(pk=updateBox_id)
            updateBox_json = json.loads(request.body)

            for key, value in updateBox_json.items():
                if key == 'users':
                    user_ids = value
                    updateBox.users.clear()
                    updateBox.users.set(user_ids)  # 使用 set 方法將新用戶關聯到 box
                elif key == 'plant':
                    plant_ids = value
                    updateBox.plant.clear()
                    updateBox.plant.set(plant_ids)  # 使用 set 方法將新植物關聯到 box
                else:
                    setattr(updateBox, key, value)

            updateBox.save()
            return HttpResponse(f"Box {updateBox.id} has been updated")
        except box.DoesNotExist:
            return HttpResponse(f"Box {updateBox_id} does not exist", status=404)
        except Exception as e:
            return HttpResponse(f"An error occurred: {str(e)}", status=500)

    return HttpResponse("Invalid HTTP method. Please use PUT for updates.", status=405)

@require_http_methods(["DELETE"])
@csrf_exempt
def DeleteBox(request, deleteBox_id):
    if request.method == 'DELETE':
        try:
            deleteBox = get_object_or_404(box, id=deleteBox_id)
            # deleteBox = box.objects.get(pk=deleteBox_id)
            deleteBox.delete()

            return HttpResponse(f"Box {deleteBox.id} has been deleted")
        except box.DoesNotExist:
            return HttpResponse(f"Box {deleteBox_id} does not exist", status=404)
        except Exception as e:
            return HttpResponse(f"An error occurred: {str(e)}", status=500)

    return HttpResponse("Invalid HTTP method. Please use DELETE for deletes.", status=405)

# Create your views here.