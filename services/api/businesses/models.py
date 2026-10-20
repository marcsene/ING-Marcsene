
from django.conf import settings
from django.db import models


class Business(models.Model):
    LANGUAGE_CHOICES = [
        ("es", "Español"),
        ("en", "English"),
        ("fr", "Français"),
    ]

    name = models.CharField(max_length=150)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="businesses",
    )

    country = models.CharField(
        max_length=2,
        default="CL",
    )

    language = models.CharField(
        max_length=5,
        choices=LANGUAGE_CHOICES,
        default="es",
    )

    currency = models.CharField(
        max_length=3,
        default="CLP",
    )

    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        db_table = "businesses"
        ordering = ["name"]

    def __str__(self):
        return self.name
