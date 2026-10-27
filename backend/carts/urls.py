from django.urls import path
from .views import *

urlpatterns = [
    path("cart/", CartItemListCreateView.as_view(), name="cart"),
    path("cart/new-item/", CartItemListCreateView.as_view(), name="new-item"),
    path("cart/delete/", CartDeleteView.as_view(), name="cart-delete"),
    path("cart/item/<int:pk>/", CartItemUpdateDeleteView.as_view(), name="item-update-delete"),
]
