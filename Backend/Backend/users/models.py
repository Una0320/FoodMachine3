from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class user(models.Model):
	#Django會自動設定id主鍵，所以我先沒有打
	username = models.TextField(null=True, blank=True)
	userfeedback = models.TextField(null=True, blank=True)
	password = models.CharField(null=True, blank=True, max_length=255)  # 新增的密碼欄位

	# 在保存之前使用 make_password 加密密碼
	def save(self, *args, **kwargs):
		self.password = make_password(self.password)
		super().save(*args, **kwargs)
		
	def __str__(self):
		return str(self.username)  # 返回模型的一個可讀的名稱

# Create your models here.
