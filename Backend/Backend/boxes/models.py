from django.db import models
from users.models import user
from categories.models import category

class box(models.Model):
	#Django會自動設定id主鍵，所以我先沒有打
	boxname = models.TextField(null=True, blank=True)
	boximag = models.ImageField(upload_to='image/', null=True, blank=True)
	
	# 建立外鍵關聯，一個箱子對應一個使用者
	users = models.ManyToManyField(user, default='root_test', null=True, blank=True, related_name='used_by_users')
	plant = models.ManyToManyField(category, blank=True, null=True, related_name = 'which_plant')
	
	# 因為boxname可以沒有名字，所以要考慮一個可顯示的回傳
	def __str__(self):
		return self.boxname if self.boxname else str(self.pk)
	    # 返回模型的一個可讀的名稱
# Create your models here.
