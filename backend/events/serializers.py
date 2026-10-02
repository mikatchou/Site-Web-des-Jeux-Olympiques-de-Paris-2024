from rest_framework import serializers
from .models import Discipline

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
