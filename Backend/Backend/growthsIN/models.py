from django.db import models
from boxes.models import box


class growthIN(models.Model):
	timestamp = models.DateTimeField()
	#氣溫，濕度，偵測到的亮度，LED_RGB，日照時長
	airtemp   = models.FloatField(null=True, blank=True)# 空氣溫度（攝氏度）
	humidity  = models.FloatField(null=True, blank=True)# 濕度（百分比）
	luminance = models.FloatField(null=True, blank=True)# 亮度（lux流明）
	ledrgb    = models.JSONField(null=True,blank=True)  # LED燈RGB參數
	sunlong   = models.FloatField(null=True, blank=True)# 日照時長
	
	# 生長狀況圖片
	cur_Image = models.ImageField(upload_to='growin/', null=True, blank=True)
	
	# ForeignKey
	boxid     = models.ForeignKey(box, on_delete=models.SET_NULL, null=True, related_name='whichbox')
	
	def __str__(self):
		return str(self.id)
# Create your models here.
