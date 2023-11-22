from django.contrib import admin
from .models import growthIN

class growthINAdmin(admin.ModelAdmin):
	list_display = ('id','timestamp', 'luminance', 'airtemp', 'sunlong', 'ledrgb', 'cur_Image', 'boxid')
	
admin.site.register(growthIN, growthINAdmin)
# Register your models here.
