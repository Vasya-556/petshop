from rest_framework.routers import DefaultRouter
from core.api.urls import core_router
from django.urls import path, include

router = DefaultRouter()

router.registry.extend(core_router.registry)

urlpatterns = [
    path('', include(router.urls)),
]