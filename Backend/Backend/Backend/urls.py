"""
URL configuration for Backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from boxes.views import BoxInfo, BoxListInfo, BoxGrowths, NewBox
from growthsOUT.views import NGrowthOUT

urlpatterns = [
    path('admin/', admin.site.urls),

    path('boxinfo/<box_id>', BoxInfo),
    path('boxlist/<user_id>', BoxListInfo),
    path('boxgrow/<box_id>/', BoxGrowths),
    path('newbox/', NewBox),

    path('ngrowout/', NGrowthOUT),
]
