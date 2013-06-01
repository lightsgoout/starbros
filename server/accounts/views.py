# Create your views here.
from django.contrib.auth.models import AbstractBaseUser
from django.db import models


class User(AbstractBaseUser):
    username = models.CharField(max_length=16, unique=True)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['username', 'email']

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username
