from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import TokenVerifyView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', signup, name='signup'),
    path('signin/', signin, name='signin'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('products/', product_list, name='product_list'),
    path('product/<int:product_id>/', delete_product, name='delete_product'),
]