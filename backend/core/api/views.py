from rest_framework import viewsets
from ..models import Category
from .serializers import CoreSerializer

class CoreViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CoreSerializer