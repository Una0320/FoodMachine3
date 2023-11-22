from django.contrib import admin
from .models import growthOUT

class growthOUTAdmin(admin.ModelAdmin):
	list_display = ('id','timestamp', 'airtemp', 'watertemp', 'waterlevel', 'ph', 'ec', 'allboxes')
	
	def allboxes(self, obj):
		return ", ".join([str(box.id) for box in obj.boxid.all()])
		
admin.site.register(growthOUT, growthOUTAdmin)
# Register your models here.
