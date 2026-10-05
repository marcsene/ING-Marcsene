from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    active = models.BooleanField(default=True)

    class Meta:
        db_table = "categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
    )
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    stock = models.PositiveIntegerField(default=0)
    image_url = models.URLField(blank=True)
    active = models.BooleanField(default=True)

    class Meta:
        db_table = "products"
        ordering = ["name"]

    def __str__(self):
        return self.name
