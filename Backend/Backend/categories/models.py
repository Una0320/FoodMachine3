from django.db import models

class category(models.Model):
    # 7 個環境參數欄位
    b_watertemp = models.JSONField(null=True,blank=True)# 水溫範圍（攝氏度）
    b_airtemp   = models.JSONField(null=True, blank=True)# 空氣溫度範圍（攝氏度）
    b_humidity  = models.JSONField(null=True, blank=True)# 濕度範圍（百分比）
    b_oxygen    = models.JSONField(null=True, blank=True)# 氧氣濃度範圍（百分比）
    b_co2       = models.JSONField(null=True, blank=True)# # 二氧化碳濃度範圍（ppm）
    b_ec        = models.JSONField(null=True, blank=True)# 電導度範圍(dS/m)
    b_ph        = models.JSONField(null=True, blank=True)
    
    # 2 個植物資訊欄位
    name   = models.TextField(null=True, blank=True) # 植物名稱
    method = models.TextField(null=True, blank=True) # 種植方法
    
    # 添加其他欄位
    
    def __str__(self):
    	return str(self.name)  # 返回模型的一個可讀的名稱
# Create your models here.
