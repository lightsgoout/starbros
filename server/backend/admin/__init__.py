from django.contrib import admin
from backend.admin.star_system import StarSystemAdmin
from backend.models import Game, Planet, StarSystem

admin.site.register(StarSystem, StarSystemAdmin)
admin.site.register(Planet)
admin.site.register(Game)
