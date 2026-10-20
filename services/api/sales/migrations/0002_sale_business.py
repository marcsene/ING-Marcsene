
import django.db.models.deletion
from django.db import migrations, models


def assign_existing_business(apps, schema_editor):
    Business = apps.get_model("businesses", "Business")
    Sale = apps.get_model("sales", "Sale")

    database = schema_editor.connection.alias

    business = (
        Business.objects.using(database)
        .filter(
            owner__username="ing.marcsene",
            name="ING.Marcsene",
        )
        .first()
    )

    if business is None:
        raise RuntimeError(
            "No existe el negocio ING.Marcsene "
            "del usuario ing.marcsene."
        )

    Sale.objects.using(database).filter(
        business__isnull=True
    ).update(business=business)


class Migration(migrations.Migration):
    dependencies = [
        ("businesses", "0001_initial"),
        ("sales", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="sale",
            name="business",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="sales",
                to="businesses.business",
            ),
        ),
        migrations.RunPython(
            assign_existing_business,
            migrations.RunPython.noop,
        ),
    ]
