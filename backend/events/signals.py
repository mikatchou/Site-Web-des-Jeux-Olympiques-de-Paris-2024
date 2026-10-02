import os
from django.core.files import File
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.conf import settings

from .models import Discipline

BASE_DISCIPLINES = {
    "Athlétisme": "Pictogramme_athlétisme_JO_2024.svg.png",
    "Aviron": "Pictogramme_aviron_JO_2024.svg.png",
    "Badminton": "Pictogramme_badminton_JO_2024.svg.png",
    "Basketball": "Pictogramme_basketball_JO_2024.svg.png",
    "Beachvolley": "Pictogramme_beachvolley_JO_2024.svg.png",
    "Bmx freestyle": "Pictogramme_BMX_freestyle_JO_2024.svg.png",
    "Boxe": "Pictogramme_boxe_JO_2024.svg.png",
    "Breakdance": "Pictogramme_breakdance_JO_2024.svg.png",
    "Canoë slalom": "Pictogramme_canoë_slalom_JO_2024.svg.png",
    "Cyclisme sur piste": "Pictogramme_cyclisme_sur_piste_JO_2024.svg.png",
    "Cyclisme sur route": "Pictogramme_cyclisme_sur_route_JO_2024.svg.png",
    "Escalade": "Pictogramme_escalade_JO_2024.svg.png",
    "Escrime": "Pictogramme_escrime_JO_2024.svg.png",
    "Football": "Pictogramme_football_JO_2024.svg.png",
    "Golf": "Pictogramme_golf_JO_2024.svg.png",
    "Gymnastique artistique": "Pictogramme_gymnastique_artistique_JO_2024.svg.png",
    "Gymnastique rythmique": "Pictogramme_gymnastique_rythmique_JO_2024.svg.png",
    "Haltérophilie": "Pictogramme_haltérophilie_JO_2024.svg.png",
    "Handball": "Pictogramme_handball_JO_2024.svg.png",
    "Hockey": "Pictogramme_hockey_JO_2024.svg.png",
    "Judo": "Pictogramme_judo_JO_2024.svg.png",
    "Lutte": "Pictogramme_lutte_JO_2024.svg.png",
    "Natation": "Pictogramme_natation_JO_2024.svg.png",
    "Pentathlon moderne": "Pictogramme_pentathlon_moderne_JO_2024.svg.png",
    "Rugby": "Pictogramme_rugby_JO_2024.svg.png",
    "Skateboard": "Pictogramme_skateboard_JO_2024.svg.png",
    "Surf": "Pictogramme_surf_JO_2024.svg.png",
    "Taekwondo": "Pictogramme_taekwondo_JO_2024.svg.png",
    "Tennis de table": "Pictogramme_tennis_de_table_JO_2024.svg.png",
    "Tennis": "Pictogramme_tennis_JO_2024.svg.png",
    "Tir": "Pictogramme_tir_JO_2024.svg.png",
    "Tir à l'arc": "Pictogramme_tir_à_l_arc_JO_2024.svg.png",
    "Trampoline": "Pictogramme_trampoline_JO_2024.svg.png",
    "Triathlon": "Pictogramme_triathlon_JO_2024.svg.png",
    "Voile": "Pictogramme_voile_JO_2024.svg.png",
    "Volleyball": "Pictogramme_volleyball_JO_2024.svg.png",
    "Vtt": "Pictogramme_VTT_JO_2024.svg.png",
    "Équitation saut d obstacle": "Pictogramme_équitation_saut_d_obstacle_JO_2024.svg.png",
}


@receiver(post_migrate)
def create_disciplines(sender, **kwargs):
    if sender.label != "events":
        return

    static_dir = os.path.join(
        settings.BASE_DIR, 
        "events", 
        "static", 
        "events", 
        "images"
    )

    for name, filename in BASE_DISCIPLINES.items():
        obj, created = Discipline.objects.get_or_create(name=name)

        if created:
            image_path = os.path.join(static_dir, filename)
            if os.path.exists(image_path):
                with open(image_path, "rb") as f:
                    obj.image.save(filename, File(f), save=True)
