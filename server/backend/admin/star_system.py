from django.contrib import admin
from backend.models import Planet


class PlanetInline(admin.TabularInline):
    model = Planet
    max_num = 9

    def has_add_permission(self, request):
        return True


class StarSystemAdmin(admin.ModelAdmin):
    inlines = [PlanetInline]


