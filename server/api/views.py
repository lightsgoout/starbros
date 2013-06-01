import json
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from backend.helpers import user_has_games


def error(reason):
    return dict(
        error=reason,
    )


def api(function):
    def wrapper(request):
        if 'json' in request.GET:
            return HttpResponse(
                json.dumps(function(request)),
                mimetype='application/json',
            )
    return wrapper


@api
def create_game(request):
    if user_has_games(request.user):
        return error('User already runs a game')



