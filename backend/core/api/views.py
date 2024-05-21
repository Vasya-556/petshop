from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from ..models import *
from .serializers import *

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

@api_view(['POST'])
def signup(request):
    serializer = CustomUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def signin(request):
    # Implement authentication logic here
    # For example, using Django's built-in authentication or JWT authentication
    # Return appropriate response based on authentication result
    pass