# Create your views here.
from django.contrib.auth.models import AbstractBaseUser, UserManager, PermissionsMixin
from django.db import models
from backend.bot import BOT_DIFFICULTIES


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=16, unique=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateField(auto_now_add=True)
    is_bot = models.BooleanField(default=False)
    bot_difficulty = models.CharField(
        null=True,
        blank=True,
        choices=BOT_DIFFICULTIES,
        max_length=15,
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.is_bot and not self.bot_difficulty:
            raise ValidationError('Please specify bot difficulty')
