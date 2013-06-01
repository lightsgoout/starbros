from random import randint
from django.db.models import Q
from accounts.models import User
from api.exceptions import APIException
from backend.bot import BOT_EASY, BOT_DIFFICULTIES
from backend.models import Game, StarSystem, Planet, PLANET_RICH, PLANET_MEDIUM, PLANET_POOR, PLANET_SIZE_LARGE, PLANET_SIZE_MEDIUM, PLANET_SIZE_SMALL


class MatchmakeException(APIException):
    pass


def user_has_games(user):
    return Game.objects.filter(
        Q(left_star__player__pk=user.pk) | Q(right_star__player__pk=user.pk),
        Q(finished_at__isnull=True),
    ).exists()


def find_bot(bot_difficulty=BOT_EASY):
    if bot_difficulty not in [x[0] for x in BOT_DIFFICULTIES]:
        raise APIException('Invalid bot difficulty')

    try:
        return User.objects.get(is_bot=True, bot_difficulty=bot_difficulty)
    except User.MultipleObjectsReturned:
        raise MatchmakeException('Too many bots found')
    except User.DoesNotExist:
        raise MatchmakeException('Bot not found')


def find_opponent():
    raise MatchmakeException('Currently only games with BOT available')


def create_planet_system(star, planets_count):
    """
    @type star StarSystem
    @type planets_count int
    """
    planets_count = int(planets_count)

    # keys are planet configurations
    CONFIGURATIONS = {
        3: {
            'richness': [PLANET_RICH, PLANET_MEDIUM, PLANET_POOR],
            'speed': [1.0, 0.9, 1.1],
            'size': [PLANET_SIZE_LARGE, PLANET_SIZE_MEDIUM, PLANET_SIZE_SMALL]
        },
        6: {
            'richness': [PLANET_RICH, PLANET_RICH,
                         PLANET_MEDIUM, PLANET_MEDIUM,
                         PLANET_POOR, PLANET_POOR],
            'speed': [1.0, 0.9, 1.1, 1.3, 0.7, 1.0],
            'size': [PLANET_SIZE_LARGE, PLANET_SIZE_MEDIUM, PLANET_SIZE_SMALL,
                     PLANET_SIZE_LARGE, PLANET_SIZE_MEDIUM, PLANET_SIZE_SMALL]
        },
        9: {
            'richness': [PLANET_RICH, PLANET_RICH, PLANET_RICH,
                         PLANET_MEDIUM, PLANET_MEDIUM, PLANET_MEDIUM,
                         PLANET_POOR, PLANET_POOR, PLANET_POOR],
            'speed': [1.0, 0.9, 0.8, 0.7, 1.0, 1.1, 1.2, 1.3, 1.4],
            'size': [PLANET_SIZE_LARGE, PLANET_SIZE_LARGE, PLANET_SIZE_LARGE,
                     PLANET_SIZE_MEDIUM, PLANET_SIZE_MEDIUM, PLANET_SIZE_MEDIUM,
                     PLANET_SIZE_SMALL, PLANET_SIZE_SMALL, PLANET_SIZE_SMALL]
        },
    }

    leftover = planets_count
    for i in range(1, planets_count):
        planet = Planet()
        planet.star = star
        planet.order = i

        rand = randint(0, leftover-1)

        size = CONFIGURATIONS[planets_count]['size'][rand]
        del CONFIGURATIONS[planets_count]['size'][rand]
        richness = CONFIGURATIONS[planets_count]['richness'][rand]
        del CONFIGURATIONS[planets_count]['richness'][rand]
        speed = CONFIGURATIONS[planets_count]['speed'][rand]
        del CONFIGURATIONS[planets_count]['speed'][rand]

        planet.speed = speed
        planet.richness = richness
        planet.size = size
        planet.save()
        leftover -= 1


def matchmake(user, with_bot=False, bot_difficulty=BOT_EASY, planets_count=9):
    """
    @type user User
    """
    # find an opponent
    if with_bot:
        opponent = find_bot(bot_difficulty)
    else:
        opponent = find_opponent()

    left_star = StarSystem()
    left_star.planets_count = planets_count
    left_star.player = user
    left_star.save()

    create_planet_system(left_star, planets_count)

    right_star = StarSystem()
    right_star.planets_count = planets_count
    right_star.player = opponent
    right_star.save()

    create_planet_system(right_star, planets_count)

    game = Game()
    game.left_star = left_star
    game.right_star = right_star
    game.save()

    return game
