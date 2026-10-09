
from getpass import getpass

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import connection


class Command(BaseCommand):
    help = "Crea un usuario de aplicación en PostgreSQL."

    def handle(self, *args, **options):
        if connection.vendor != "postgresql":
            raise CommandError(
                "Cancelado: la conexión no es PostgreSQL."
            )

        User = get_user_model()
        username = input("Nombre de usuario: ").strip()

        if not username:
            raise CommandError("El usuario no puede estar vacío.")

        if User.objects.filter(username=username).exists():
            raise CommandError("Ese usuario ya existe.")

        password = getpass("Nueva contraseña: ")
        confirmation = getpass("Confirma la contraseña: ")

        if not password or password != confirmation:
            raise CommandError(
                "Las contraseñas están vacías o no coinciden."
            )

        User.objects.create_user(
            username=username,
            password=password,
            is_active=True,
            is_staff=False,
            is_superuser=False,
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Usuario creado correctamente: {username}"
            )
        )
