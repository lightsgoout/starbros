from django.conf.urls import patterns, url
import api.views

urlpatterns = patterns(
    '',
    url(r'create_game/',
        api.views.create_game,
        name='api_create_game'),
)
