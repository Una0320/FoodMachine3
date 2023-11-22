from django.contrib import admin
from .models import box

class boxesAdmin(admin.ModelAdmin):
	list_display = ('id', 'boxname', 'boximag', 'allusers', 'plants_in', 'devices_in')
	
	def allusers(self, obj):
		return ", ".join([user.username for user in obj.users.all()])
	def plants_in(self, obj):
		return " ".join([p.name for p in obj.plant.all()])
	def devices_in(self, obj):
		return " ".join([str(d.id) + " " + d.devicename for d in obj.inwhichbox.all()])
		
	allusers.short_description = 'AllUsers'
	plants_in.short_description = 'PlantName'
	#devices_in.short_description = 'DeviceName'
		
admin.site.register(box, boxesAdmin)
# Register your models here.
