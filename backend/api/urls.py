from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import FoodItemListView, PlaceOrderView, get_categories, previous_orders, register_user

urlpatterns = [
    path('api/foods/', FoodItemListView.as_view(), name='food-list'),
    path('api/orders/', PlaceOrderView.as_view(), name='place-order'),
    path('api/categories/', get_categories, name='get_categories'),
    path('api/previous-orders/', previous_orders, name='previous-orders'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register_user, name='register'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
