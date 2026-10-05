from rest_framework import serializers
from .models import Category, Country, Discipline, Offer, Player, Team, Venue, Event

class DisciplineSerializer (serializers.ModelSerializer) :
    class Meta:
        model = Discipline
        fields = "__all__"
        extra_kwargs = {
            "name": {
                "error_messages": {
                    "required": "Le nom est obligatoire.",
                    "blank": "Le nom ne peut pas être vide.",
                    "invalid": "Format invalide pour le nom."
                }
            },
            "image": {
                "error_messages": {
                    "invalid": "L'image doit être un fichier valide.",
                }
            },
        }


class VenueSerializer (serializers.ModelSerializer) :
    class Meta :
        model = Venue
        fields = "__all__"
        

class CategorySerializer (serializers.ModelSerializer) :
    class Meta :
        model = Category
        fields = "__all__"
        
class CountrySerializer (serializers.ModelSerializer) :
    class Meta :
        model = Country
        fields = "__all__"

class OfferSerializer (serializers.ModelSerializer) :
    class Meta :
        model = Offer
        fields = "__all__"

class TeamSerializer (serializers.ModelSerializer) :
    class Meta :
        model = Team
        fields = "__all__"

class PlayerSerializer (serializers.ModelSerializer) :
    class Meta :
        model = Player
        fields = "__all__"
        
class SearchCountrySerializer (serializers.ModelSerializer) :
    class Meta :
        model = Country
        fields = ["name", "code"]

class SearchVenueSerializer (serializers.ModelSerializer) :
    class Meta :
        model = Venue
        fields = ["name", "city"]
        
class SearchTeamSerializer (serializers.ModelSerializer) :
    country = SearchCountrySerializer()
    class Meta :
        model = Team
        fields = ["country"]

class SearchPlayerSerializer (serializers.ModelSerializer) :
    country = SearchCountrySerializer()
    class Meta :
        model = Player
        fields = ["country"]

class SearchOfferSerializer (serializers.ModelSerializer) :
    class Meta :
        model = Offer
        fields = ["price"]

class SearchCategorySerializer (serializers.ModelSerializer) :
    offers = SearchOfferSerializer(many=True)
    class Meta :
        model = Category
        fields = ["offers"]

class SearchEventSerializer (serializers.ModelSerializer) :
    discipline = DisciplineSerializer()
    venue = SearchVenueSerializer()
    teams = SearchTeamSerializer(many=True)
    players = SearchPlayerSerializer(many=True)
    categories = SearchCategorySerializer(many=True)
    class Meta :
        model = Event
        fields = ["date", "discipline", "venue", "teams", "players", "categories"]


