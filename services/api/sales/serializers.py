
from django.db import transaction
from rest_framework import serializers

from customers.models import Customer
from products.models import Product

from .models import Sale, SaleItem


class SaleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.none(),
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

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            fields["product"].queryset = Product.objects.filter(
                business__owner=request.user,
                business__active=True,
            )

        return fields

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "La cantidad debe ser mayor que cero."
            )
        return value


class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True)

    customer = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.none(),
    )

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

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            fields["customer"].queryset = Customer.objects.filter(
                business__owner=request.user,
                business__active=True,
            )

        return fields

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError(
                "La venta debe contener al menos un producto."
            )
        return value

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get("request")
        items_data = validated_data.pop("items")

        if request is None or not request.user.is_authenticated:
            raise serializers.ValidationError(
                "Debes iniciar sesión para registrar una venta."
            )

        business = validated_data["customer"].business

        if business is None or business.owner_id != request.user.id:
            raise serializers.ValidationError(
                "El cliente no pertenece a tu negocio."
            )

        if not business.active:
            raise serializers.ValidationError(
                "Tu negocio no está activo."
            )

        for item_data in items_data:
            product = item_data["product"]

            if product.business_id != business.id:
                raise serializers.ValidationError(
                    "Todos los productos deben pertenecer "
                    "al mismo negocio que el cliente."
                )

        sale = Sale.objects.create(
            **validated_data,
            business=business,
            total=0,
        )

        total = 0

        for item_data in items_data:
            product = Product.objects.select_for_update().get(
                id=item_data["product"].id,
                business=business,
            )
            quantity = item_data["quantity"]

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
