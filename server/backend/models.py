from django.conf import settings
from django.db import models

PLANET_SIZES = (
    (10, 'small'),
    (20, 'medium'),
    (30, 'large')
)

PLANET_COUNTS = (
    (3, 'Three planets'),
    (6, 'Six planets'),
    (9, 'Nine planets'),
)

RICHNESS_CHOICES = (
    (10, 'Poor'),
    (20, 'Medium'),
    (30, 'Rich'),
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
    left_star = models.ForeignKey(StarSystem, related_name='left_star')
    right_star = models.ForeignKey(StarSystem, related_name='right_star')


