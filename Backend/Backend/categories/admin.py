from django.contrib import admin
from .models import category

class categoryAdmin(admin.ModelAdmin):
	list_display = ('id', 'name', 'method', 'b_airtemp',
			 'b_humidity', 'b_oxygen', 'b_co2', 'b_ec', 'b_ph', 'b_watertemp')
			 
admin.site.register(category, categoryAdmin)

# Register your models here.
