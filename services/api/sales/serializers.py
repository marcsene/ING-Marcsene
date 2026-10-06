from django.db import transaction
from rest_framework import serializers

from products.models import Product

from .models import Sale, SaleItem


class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    class Meta:
        model = SaleItem
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "unit_price",
            "subtotal",
        ]
        read_only_fields = [
            "id",
            "unit_price",
            "subtotal",
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "La cantidad debe ser mayor que cero."
            )

        return value


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)

    class Meta:
        model = Sale
        fields = [
            "id",
            "customer",
            "status",
            "total",
            "created_at",
            "items",
        ]
        read_only_fields = [
            "id",
            "total",
            "created_at",
        ]

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError(
                "La venta debe contener al menos un producto."
            )

        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")

        sale = Sale.objects.create(
            **validated_data,
            total=0,
        )

        total = 0

        for item_data in items_data:
            product_id = item_data["product"].id
            quantity = item_data["quantity"]

            product = Product.objects.select_for_update().get(
                id=product_id
            )

            if not product.active:
                raise serializers.ValidationError(
                    f"El producto '{product.name}' está inactivo."
                )

            if product.stock < quantity:
                raise serializers.ValidationError(
                    f"Stock insuficiente para '{product.name}'. "
                    f"Disponible: {product.stock}."
                )

            unit_price = product.price
            subtotal = unit_price * quantity

            SaleItem.objects.create(
                sale=sale,
                product=product,
                quantity=quantity,
                unit_price=unit_price,
                subtotal=subtotal,
            )

            product.stock -= quantity
            product.save(update_fields=["stock"])

            total += subtotal

        sale.total = total
        sale.save(update_fields=["total"])

        return sale