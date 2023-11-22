from django.db import models

class user(models.Model):
	#Django會自動設定id主鍵，所以我先沒有打
	username = models.TextField(null=True, blank=True)
	userfeedback = models.TextField(null=True, blank=True)


	def __str__(self):
		return self.username  # 返回模型的一個可讀的名稱

# Create your models here.
