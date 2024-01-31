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
from django.conf import settings
from django.urls import include, path
from django.conf.urls.static import static

from users.views import UserList, newUser, loginout
from boxes.views import BoxInfo, BoxListInfo, BoxGrowthsIN, BoxGrowthsOUT, NewBox, UpdateBox
from growthsOUT.views import NGrowthOUT
from growthsIN.views import NGrowthIN
from devices.views import DeviceInfo, UpdateDevice

urlpatterns = [
    path('admin/', admin.site.urls),

    path("userlist/", UserList),
    path("newuser/", newUser),
    path('login/', loginout),
    path('boxinfo/<box_id>', BoxInfo),
    path('boxlist/<user_id>', BoxListInfo),
    path('updatebox/<updateBox_id>/', UpdateBox),
    path('boxgrowin/<box_id>/', BoxGrowthsIN),
    path('boxgrowout/', BoxGrowthsOUT),
    path('newbox/', NewBox),

    path('ngrowout/', NGrowthOUT),

    path('ngrowin/', NGrowthIN),

    path('editdevice/<box_id>/<device_id>/', UpdateDevice),
    path('deviceinfo/<box_id>', DeviceInfo),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
