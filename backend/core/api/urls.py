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
    path('delete_product/<int:product_id>/', delete_product, name='delete_product'),
    path('product/<int:product_id>/', single_product, name='single_product'),
    path('user/<int:user_id>/', user_data, name='user_data'),
    path('add_product/', add_product, name='add_product'),
    path('search/', search_products, name='search_products'),
    path('get_rating/<int:product_id>/', get_rating, name='get_rating'),
    path('get_comments/<int:product_id>/', get_comments, name='get_comments'),
    path('get_cart_items/<int:user_id>/', get_cart_items, name='get_cart_items'),
    path('get_all_users_cart_items/', get_all_users_cart_items, name='get_all_users_cart_items'),
    path('purchase_product/', purchase_product, name='purchase_product'),
    path('add_to_cart/', add_to_cart, name='add_to_cart'),
]