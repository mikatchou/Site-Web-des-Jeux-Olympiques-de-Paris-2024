import uuid
import os
from django.utils.text import slugify
from django.db import models

def discipline_image_path(instance, filename):
    ext = filename.split('.')[-1]
    name = slugify(instance.name)
    filename = f"{name}-{uuid.uuid4()}.{ext}"
    return os.path.join("disciplines", filename)

def venue_image_path(instance, filename):
    ext = filename.split('.')[-1]
    name = slugify(instance.name)
    filename = f"{name}-{uuid.uuid4()}.{ext}"
    return os.path.join("venues", filename)

class Discipline (models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to=discipline_image_path)
    def __str__(self):
        return self.name

class Venue (models.Model):
    name = models.CharField(max_length=50)
    city = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=10)
    street = models.CharField(max_length=200)
    image = models.ImageField(null=True, blank=True, upload_to=venue_image_path)
    def __str__(self):
        return self.name

class Event (models.Model) :
    name = models.CharField(max_length=100)
    information = models.TextField()
    date = models.DateTimeField(null=False, blank=False)
    discipline = models.ForeignKey(Discipline, on_delete=models.PROTECT, related_name="events")
    venue = models.ForeignKey(Venue, on_delete=models.PROTECT, related_name="events")
    def __str__(self):
        return f"{self.name} - {self.venue.name} - {self.date}"

class Country (models.Model) :
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3, unique=True)
    def __str__(self):
        return self.name

class Team (models.Model) :
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.PROTECT, related_name="teams")
    events = models.ManyToManyField(Event,blank=True, related_name="teams")
    def __str__(self):
        return self.name

class Player (models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    team = models.ForeignKey(Team, null=True, blank=True, on_delete=models.PROTECT, related_name="players")
    country = models.ForeignKey(Country, null=True, blank=True, on_delete=models.PROTECT, related_name="players")
    events = models.ManyToManyField(Event, blank=True, related_name="players")
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Category (models.Model) :
    name = models.CharField(max_length=50)
    total_seats = models.PositiveBigIntegerField()
    available_seats = models.PositiveIntegerField()
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="categories")
    def __str__(self):
        return self.name

class Offer (models.Model) :
    name = models.CharField(max_length=50)
    seat_quantity = models.PositiveBigIntegerField(default=1)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="offers")
    def __str__(self):
        return f"{self.name} - {self.category.event.name}"