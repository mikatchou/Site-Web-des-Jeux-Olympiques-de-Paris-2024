from django.test import TestCase


# ici c'est juste pour tester github actions
import pytest

def test_dummy():
    assert True

@pytest.mark.skip(reason="example skip")
def test_skipped():
    assert False

