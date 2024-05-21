from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', signup, name='signup'),
    path('signin/', signin, name='signin'),
]