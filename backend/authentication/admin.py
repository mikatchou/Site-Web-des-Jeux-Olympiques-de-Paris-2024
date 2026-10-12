from django.contrib import admin
from django import forms
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import CustomUser

from events.models import (
    Discipline,
    Venue,
    Event,
    Country,
    Team,
    Player,
    Category,
    Offer,
)


# ─────────────────────────────────────
# Custom User
# ─────────────────────────────────────

class CustomUserCreationForm(UserCreationForm):
    username = forms.CharField(max_length=150)

    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "birth",
            "phone",
            "country",
            "city",
            "zip_code",
            "address",
        )


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = "__all__"


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    fieldsets = UserAdmin.fieldsets + (
        ("Informations complémentaires", {
            "fields": ("birth", "phone", "country", "city", "zip_code", "address"),
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "first_name",
                "last_name",
                "birth",
                "phone",
                "country",
                "city",
                "zip_code",
                "address",
            ),
        }),
    )


# ─────────────────────────────────────
# Event → Category
# ─────────────────────────────────────

class CategoryInline(admin.TabularInline):
    model = Category
    extra = 1


# ─────────────────────────────────────
# Category → Offer
# ─────────────────────────────────────

class OfferInline(admin.TabularInline):
    model = Offer
    extra = 1


# ─────────────────────────────────────
# Event Admin
# ─────────────────────────────────────

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    inlines = [
        CategoryInline,
    ]

    list_display = (
        "name",
        "discipline",
        "venue",
        "date",
    )

    list_filter = (
        "discipline",
        "venue",
        "date",
    )

    search_fields = (
        "name",
        "information",
    )


# ─────────────────────────────────────
# Category Admin
# ─────────────────────────────────────

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    inlines = [
        OfferInline,
    ]

    list_display = (
        "name",
        "event",
        "total_seats",
        "available_seats",
    )

    list_filter = (
        "event",
    )


# ─────────────────────────────────────
# Discipline
# ─────────────────────────────────────

@admin.register(Discipline)
class DisciplineAdmin(admin.ModelAdmin):
    list_display = (
        "name",
    )

    search_fields = (
        "name",
    )


# ─────────────────────────────────────
# Venue
# ─────────────────────────────────────

@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "city",
        "zipcode",
        "street",
    )

    list_filter = (
        "city",
    )

    search_fields = (
        "name",
        "city",
        "street",
    )


# ─────────────────────────────────────
# Country
# ─────────────────────────────────────

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "code",
    )

    search_fields = (
        "name",
        "code",
    )


# ─────────────────────────────────────
# Team → player
# ─────────────────────────────────────

class PlayerInline(admin.TabularInline):
    model = Player
    extra = 1

# ─────────────────────────────────────
# Team
# ─────────────────────────────────────

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    inlines = [
        PlayerInline,
    ]

    list_display = (
        "name",
        "country",
    )

    list_filter = (
        "country",
    )

    search_fields = (
        "name",
    )


# ─────────────────────────────────────
# Player
# ─────────────────────────────────────

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "last_name",
        "team",
        "country",
    )

    list_filter = (
        "country",
        "team",
    )

    search_fields = (
        "first_name",
        "last_name",
    )
    filter_horizontal = ("events",)