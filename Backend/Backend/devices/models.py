from django.db import models
from boxes.models import box

class device(models.Model):
    devicename = models.CharField(max_length=255, default = 'LED')
    
    # 裝置狀態選擇，這裡使用 choices 定義不同的選項
    # 存儲：'active'，顯示：'Active'
    DEVICE_STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('maintenance', 'Maintenance'),
    )
    devicestatus = models.CharField(max_length=20, choices=DEVICE_STATUS_CHOICES, default='active', null=True, blank=True)
    parameter  = models.JSONField(null=True,blank=True)	# EX:LED的{'RGB':[255,255,255]}
    devicemode = models.FloatField(default = 1, null = True, blank = True)
    openTime = models.TimeField(null = True, blank = True)	# 設置開啟時間
    closeTime = models.TimeField(null = True, blank = True)	# 設置關閉時間
    boxid = models.ForeignKey(box, on_delete=models.CASCADE, related_name = 'inwhichbox')  # 外鍵關聯到 box，使用 CASCADE 進行相關刪除操作

    def __str__(self):
        return (str(self.id)+ "." + self.devicename)
        
# Create your models here.
