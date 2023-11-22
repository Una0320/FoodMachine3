from django.contrib import admin
from .models import device

class devicesAdmin(admin.ModelAdmin):
	list_display = ('id', 'devicename', 'devicestatus', 'devicemode', 'parameter', 'openTime', 'closeTime', 'in_box')
	
	def in_box(self, obj):
		return obj.boxid
	
admin.site.register(device, devicesAdmin)
# Register your models here.
