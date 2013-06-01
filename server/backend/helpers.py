from django.db.models import Q
from backend.models import Game


def user_has_games(user):
    return Game.objects.filter(
        Q(left_star__player=user) | Q(right_star__player=user),
        finished_at__isnull=True,
    ).exists()
