
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied

from businesses.models import Business
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class BusinessQuerysetMixin:
    def get_business(self):
        business = Business.objects.filter(
            owner=self.request.user,
            active=True,
        ).first()

        if business is None:
            raise PermissionDenied(
                "No tienes un negocio activo asociado a tu usuario."
            )

        return business


class CategoryListCreateView(
    BusinessQuerysetMixin,
    generics.ListCreateAPIView,
):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(
            business=self.get_business()
        )

    def perform_create(self, serializer):
        serializer.save(business=self.get_business())


class CategoryDetailView(
    BusinessQuerysetMixin,
    generics.RetrieveUpdateDestroyAPIView,
):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(
            business=self.get_business()
        )


class ProductListCreateView(
    BusinessQuerysetMixin,
    generics.ListCreateAPIView,
):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(
            business=self.get_business()
        )

    def perform_create(self, serializer):
        serializer.save(business=self.get_business())


class ProductDetailView(
    BusinessQuerysetMixin,
    generics.RetrieveUpdateDestroyAPIView,
):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(
            business=self.get_business()
        )
