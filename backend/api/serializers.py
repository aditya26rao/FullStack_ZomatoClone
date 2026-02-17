from rest_framework import serializers

from .models import Category, FoodItem, Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'image']


class FoodItemSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'price', 'image', 'description', 'category']


class OrderItemDisplaySerializer(serializers.ModelSerializer):
    food_item = FoodItemSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'food_item', 'quantity']


class OrderDisplaySerializer(serializers.ModelSerializer):
    items = OrderItemDisplaySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'subtotal', 'delivery_fee', 'total', 'items']


class OrderItemCreateSerializer(serializers.ModelSerializer):
    food_item = serializers.PrimaryKeyRelatedField(queryset=FoodItem.objects.all())

    class Meta:
        model = OrderItem
        fields = ['food_item', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'street',
            'city',
            'state',
            'zip_code',
            'country',
            'phone',
            'subtotal',
            'delivery_fee',
            'total',
            'items',
        ]
        read_only_fields = ['id']

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('Order must have at least one item.')

        for item in value:
            if not item.get('food_item') or not item.get('quantity'):
                raise serializers.ValidationError("Each item must have 'food_item' and 'quantity'.")
            if item['quantity'] <= 0:
                raise serializers.ValidationError('Quantity must be greater than zero.')
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        request = self.context.get('request')

        if not request or not request.user or not request.user.is_authenticated:
            raise serializers.ValidationError('User must be authenticated to place an order.')

        order = Order.objects.create(user=request.user, **validated_data)

        for item in items_data:
            OrderItem.objects.create(
                order=order,
                food_item=item['food_item'],
                quantity=item['quantity'],
            )

        return order
