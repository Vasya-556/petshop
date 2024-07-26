from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets
from ..models import *
from .serializers import *
from django.conf import settings
from django.http import Http404, JsonResponse
from rest_framework.permissions import AllowAny
from django.db.models import Avg

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    hashed_password = make_password(password)

    user = CustomUser(username=username, email=email, password=hashed_password)
    user.save()

    cart = Cart(user=user)
    cart.save()

    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def signin(request):
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        user = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        return Response({'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if check_password(password, user.password):
        refresh = RefreshToken.for_user(user)
        return Response({
            'user_id': user.id,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['GET'])
def product_list(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Product.DoesNotExist:
        return Response({'message': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def single_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)
    data = {
        'id': product.id,
        'p_name': product.p_name,
        'description': product.description,
        'product_image': product.product_image.url if product.product_image else None,
        'price': str(product.price),
        'stock': product.stock,
        'category': product.category.name
    }
    return JsonResponse(data)

@api_view(['GET'])
def user_data(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        serializer = CustomUserDetailSerializer(user)
        return Response(serializer.data)
    except CustomUser.DoesNotExist:
        raise Http404("User does not exist")

@api_view(['POST'])
def add_product(request):
    category_id = request.data.get('category_id')
    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        product = serializer.save(category=category)  
        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def search_products(request):
    query_params = request.query_params
    search_query = query_params.get('q', '')
    
    products = Product.objects.filter(
        models.Q(p_name__icontains=search_query) | models.Q(description__icontains=search_query)
    )
    
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_rating(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        avg_rating = Rating.objects.filter(product_id=product).aggregate(Avg('rating'))['rating__avg']
        avg_rating = avg_rating if avg_rating is not None else 0
        return JsonResponse({'product_id': product_id, 'average_rating': avg_rating}, status=200)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)

@api_view(['GET']) 
def get_comments(request, product_id):
    try:
        comments = Comment.objects.filter(product_id=product_id)
        serializer = CommentSerializer(comments, many=True)
        return JsonResponse(serializer.data, safe=False)
    except Comment.DoesNotExist:
        return JsonResponse({'error': 'Comments not found'}, status=404)
    
@api_view(['GET'])
def get_cart_items(request, user_id):
    try:
        cart = Cart.objects.get(user_id=user_id)
        cart_items = CartItem.objects.filter(cart=cart)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return JsonResponse({'error': 'Cart not found'}, status=404)
    
@api_view(['GET'])
def get_all_users_cart_items(request):
    try:
        cart_items = CartItem.objects.all()
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def purchase_product(request):
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity')

    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if quantity <= 0:
        return Response({'error': 'Invalid quantity'}, status=status.HTTP_400_BAD_REQUEST)

    if product.stock < quantity:
        return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)

    product.stock -= quantity
    product.save()

    return Response({'message': 'Purchase successful', 'remaining_stock': product.stock}, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_to_cart(request):
    user_id = request.data.get('user_id')
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity')

    try:
        # Retrieve user cart
        cart = Cart.objects.get(user_id=user_id)
        product = Product.objects.get(id=product_id)

        if quantity > product.stock:
            return Response({'error': 'Not enough stock available'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the product is already in the cart
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            # If the item already exists, update the quantity
            cart_item.quantity += quantity
            cart_item.save()
        else:
            # If it's a new item, set the quantity
            cart_item.quantity = quantity
            cart_item.save()

        return Response({'message': 'Product added to cart successfully'}, status=status.HTTP_201_CREATED)

    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found for this user'}, status=status.HTTP_404_NOT_FOUND)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)