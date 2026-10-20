
from django.db import migrations, models
import django.db.models.deletion


def assign_existing_business(apps, schema_editor):
    Business = apps.get_model("businesses", "Business")
    Customer = apps.get_model("customers", "Customer")

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

    Customer.objects.using(database).filter(
        business__isnull=True
    ).update(business=business)


class Migration(migrations.Migration):
    dependencies = [
        ("businesses", "0001_initial"),
        ("customers", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="customer",
            name="business",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="customers",
                to="businesses.business",
            ),
        ),
        migrations.RunPython(
            assign_existing_business,
            migrations.RunPython.noop,
        ),
    ]
