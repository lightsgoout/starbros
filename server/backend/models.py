from django.conf import settings
from django.db import models

PLANET_SIZE_SMALL = 10
PLANET_SIZE_MEDIUM = 20
PLANET_SIZE_LARGE = 30
PLANET_SIZES = (
    (PLANET_SIZE_SMALL, 'small'),
    (PLANET_SIZE_MEDIUM, 'medium'),
    (PLANET_SIZE_LARGE, 'large')
)

PLANET_COUNTS = (
    (3, 'Three planets'),
    (6, 'Six planets'),
    (9, 'Nine planets'),
)

PLANET_POOR = 10
PLANET_MEDIUM = 20
PLANET_RICH = 30
RICHNESS_CHOICES = (
    (PLANET_POOR, 'Poor'),
    (PLANET_MEDIUM, 'Medium'),
    (PLANET_RICH, 'Rich'),
)


class StarSystem(models.Model):
    player = models.ForeignKey(settings.AUTH_USER_MODEL)
    planets_count = models.PositiveSmallIntegerField(choices=PLANET_COUNTS)


class Planet(models.Model):
    star = models.ForeignKey(StarSystem)
    size = models.SmallIntegerField(choices=PLANET_SIZES)
    speed = models.FloatField()
    richness = models.PositiveSmallIntegerField(choices=RICHNESS_CHOICES)
    order = models.PositiveSmallIntegerField()

    class Meta:
        unique_together = ('star', 'order',)


class Game(models.Model):

    created_at = models.DateTimeField(
        auto_now_add=True,
    )
    finished_at = models.DateTimeField(
        null=True,
        blank=True,
    )
    left_star = models.ForeignKey(StarSystem, related_name='game_left')
    right_star = models.ForeignKey(StarSystem, related_name='game_right')



