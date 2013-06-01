import json
from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.db import transaction
from django.http import HttpResponse
from api.exceptions import APIException
from backend import helpers


def error(reason):
    return dict(
        error=reason,
    )


def api(function):
    def wrapper(request):
        if 'json' in request.GET:

            try:
                result = function(request)
            except APIException as e:
                result = error(e.message)

            try:
                json_data = json.dumps(result)
            except TypeError:
                # maybe it is a django model
                json_data = serializers.serialize('json', [result])

            return HttpResponse(
                json_data,
                mimetype='application/json',
            )
    return wrapper


@transaction.commit_on_success()
@api
def create_game(request):

    if helpers.user_has_games(request.user):
        raise APIException('User already runs a game')

    try:
        with_bot = request.GET.get('with_bot', False)
    except KeyError:
        with_bot = False

    return helpers.matchmake(request.user, with_bot=with_bot)



