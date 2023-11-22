from django.contrib import admin
from .models import user

class userAdmin(admin.ModelAdmin):
	#管理頁面中，要顯示的欄位
	list_display = ('id', 'username', 'userfeedback')

admin.site.register(user, userAdmin)
# Register your models here.
