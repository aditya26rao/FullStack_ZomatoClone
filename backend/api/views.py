from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Category, FoodItem, Order
from .serializers import (
    CategorySerializer,
    FoodItemSerializer,
    OrderDisplaySerializer,
    OrderSerializer,
)


class FoodItemListView(generics.ListAPIView):
    serializer_class = FoodItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = FoodItem.objects.select_related('category').all()
        category_name = self.request.query_params.get('category')

        if category_name and category_name != 'All':
            queryset = queryset.filter(category__name__iexact=category_name)

        return queryset.order_by('id')


class PlaceOrderView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as validation_error:
            return Response({'error': validation_error.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            return Response({'error': f'Internal Server Error: {error}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')

    if not username or not email or not password:
        return Response(
            {'error': 'Username, email, and password are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
    )

    return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_categories(request):
    categories = Category.objects.all().order_by('name')
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def previous_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderDisplaySerializer(orders, many=True)
    return Response(serializer.data)
