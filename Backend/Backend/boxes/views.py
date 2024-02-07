import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404
from django.db.models import Count
from datetime import datetime

from .models import box
from devices.models import device
from growthsOUT.models import growthOUT
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
        return JsonResponse([])
        # return JsonResponse({'message': timestamp + ', Box with UserID_' + user_id + ' not found.'})

@require_http_methods(["GET"])
@csrf_exempt
def BoxGrowthsIN(request, box_id):
    try:
        '''
        # 找到特定的 box
        targetBox = box.objects.get(id=box_id)
        # 獲取 box 中的 growthIN
        growth_records = targetBox.whichbox.all()
        '''

        growth_in_results = box.objects.get(id=box_id).whichbox.filter(boxid__id=box_id)

        # 獲取日期範圍
        start_date = request.GET.get('start_date', None)
        end_date = request.GET.get('end_date', None)

        # 過濾不符合時間條件的growthreocrd資料
        if start_date:
            growth_in_results = growth_in_results.filter(timestamp__range=[start_date, '2999-12-31 23:59:59'])

        if end_date:
            growth_in_results = growth_in_results.filter(timestamp__range=['1970-01-01 00:00:00', end_date])

         # 反向排序，最近的時間在前面
        growth_in_results = growth_in_results.order_by('-timestamp')

        # 獲取要返回的屬性列表，如果 attributes 未提供，則默認返回所有屬性
        attributes_param = request.GET.get('attributes', None)
        # 如果沒有指定 attributes 參數，預設會傳回所有屬性
        attributes = attributes_param.split(',') if attributes_param else [
            'timestamp', 'airtemp', 'humidity', 'luminance', 'ledrgb', 'sunlong', 'cur_Image'
        ]

        # 將 growthrecords 序列化為 JSON 格式，只包含指定屬性
        # growth_records_data = list(growth_in_results.values())
        # 將 growthrecords 序列化為 JSON 格式
        indata = []
        for record in list(growth_in_results.values()):
            # print(record)
            r = {}
            for attr in attributes:
                r[attr] = record[attr]
            indata.append(r)

        return JsonResponse(indata, safe=False)
    except box.DoesNotExist:
        return JsonResponse({'message': 'Box with ID not found'}, status=404)


@require_http_methods(["GET"])
@csrf_exempt
def BoxGrowthsOUT(request):
    try:
        box_ids = request.GET.get('box_id', None).split(",")
        
        growth_out_results = (
            growthOUT.objects
            .filter(boxid__id__in=box_ids)
            .values('id', 'timestamp', 'watertemp', 'waterlevel', 'airtemp', 'humidity', 'oxygen', 'co2', 'ec', 'ph')
            .annotate(box_count=Count('boxid'))
            .filter(box_count=len(box_ids))  # 过滤匹配所有 box_id 的记录
        )

        # 獲取日期範圍
        start_date = request.GET.get('start_date', None)
        end_date   = request.GET.get('end_date', None)

        # 過濾不符合時間條件的growthreocrd資料
        if start_date:
            growth_out_results = growth_out_results.filter(timestamp__range=[start_date, '2999-12-31 23:59:59'])

        if end_date:
            growth_out_results = growth_out_results.filter(timestamp__range=['1970-01-01 00:00:00', end_date])

        growth_out_results = growth_out_results.order_by('-timestamp')
        
        # 獲取要返回的屬性列表，如果 attributes 未提供，則默認返回所有屬性
        attributes_param = request.GET.get('attributes', None)
        # 如果沒有指定 attributes 參數，預設會傳回所有屬性
        attributes = attributes_param.split(',') if attributes_param else [
            'id', 'timestamp', 'watertemp', 'airtemp', 'humidity', 'oxygen', 'co2', 'ec', 'ph', 'waterlevel']

        # 將 growthrecords 序列化為 JSON 格式
        outdata = []
        for record in list(growth_out_results.values()):
            # print(record)
            r = {}
            for attr in attributes:
                r[attr] = record[attr]
            outdata.append(r)

        return JsonResponse(outdata, safe=False)
    except box.DoesNotExist:
        return JsonResponse({'message': 'Box with ID not found'}, status=404)
    

@require_http_methods(["POST"])
@csrf_exempt
def NewBox(request):
    newBox_json = json.loads(request.body)
    print(newBox_json['boxname'])
    newBox = box()
    newBox.save()
    for key, value in newBox_json.items():
        # 如果使用者沒有命名，則預設 boxname = 'box'+id
        if key == 'boxname':
            if newBox_json['boxname']:
                newBox.boxname = newBox_json['boxname']
            else:
                if box.objects.latest('id'):
                    lastest_id = box.objects.latest('id').id
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

    # # Set closeTime for the device (if provided in the JSON)
    # if newBox_json['closeTime']:
    #     default_device = device(devicename='LED', devicestatus='active', boxid=newBox, closeTime=datetime.strptime(newBox_json['closeTime'], "%Y-%m-%d %H:%M:%S"))
    # else:
    #     default_device = device(devicename='LED', devicestatus='active', boxid=newBox)

    # default_device.openTime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Set openTime to the box's timestamp
    # default_device.save()

    return JsonResponse({'message':True}, safe=False)

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