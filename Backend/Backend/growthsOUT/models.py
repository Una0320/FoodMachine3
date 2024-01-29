from django.db import models
from boxes.models import box

class growthOUT(models.Model):
	timestamp = models.DateTimeField()
	
	# 8 個環境參數欄位
	watertemp = models.FloatField(null=True,blank=True)# 水溫（攝氏度）
	waterlevel= models.FloatField(null=True, blank=True) # 水位（％）
	airtemp   = models.FloatField(null=True, blank=True)# 空氣溫度（攝氏度）
	humidity  = models.FloatField(null=True, blank=True)# 濕度（百分比）
	oxygen    = models.FloatField(null=True, blank=True)# 氧氣濃度（百分比）
	co2       = models.FloatField(null=True, blank=True)# 二氧化碳濃度（ppm）
	ec        = models.FloatField(null=True, blank=True)# 電導度(dS/m)
	ph        = models.FloatField(null=True, blank=True)

	# ForeignKey
	boxid     = models.ManyToManyField(box, null=True, related_name='whichboxes')
	
	def __str__(self):
		return str(self.id)
# Create your models here.
