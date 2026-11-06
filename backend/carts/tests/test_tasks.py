from datetime import timedelta
from django.utils import timezone
import pytest
from carts.models import Cart
from carts.tasks import check_expired_carts
from carts.tests.factories import make_cart_with_data, make_event_with_data

@pytest.fixture
def make_expired_and_valid_carts(db):
        return [ 
                make_cart_with_data(timezone.now() - timedelta(minutes=1), offer_quantity=2),
                make_cart_with_data(timezone.now() + timedelta(minutes=30), offer_quantity=1)
        ]

def test_check_expired_carts(make_expired_and_valid_carts) :
        expired_cart, expired_category = make_expired_and_valid_carts[0]
        valid_cart, valid_category = make_expired_and_valid_carts[1]
        assert Cart.objects.filter(pk=expired_cart.id).exists()
        assert Cart.objects.filter(pk=valid_cart.id).exists()
        assert expired_category.available_seats == 96
        assert expired_category.held_seats == 4
        assert valid_category.available_seats == 98
        assert valid_category.held_seats == 2
        
        check_expired_carts()
        
        valid_category.refresh_from_db()
        expired_category.refresh_from_db()
        
        assert not Cart.objects.filter(pk=expired_cart.pk).exists()
        assert valid_category.available_seats == 98
        assert valid_category.held_seats == 2
        assert expired_category.available_seats == 100
        assert expired_category.held_seats == 0 
        
        assert Cart.objects.all().count() == 1