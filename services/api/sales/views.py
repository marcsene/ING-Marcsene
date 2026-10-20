
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied

from businesses.models import Business
from .models import Sale
from .serializers import SaleSerializer


class SaleBusinessMixin:
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


class SaleListCreateView(
    SaleBusinessMixin,
    generics.ListCreateAPIView,
):
    serializer_class = SaleSerializer

    def get_queryset(self):
        return Sale.objects.filter(
            business=self.get_business()
        )


class SaleDetailView(
    SaleBusinessMixin,
    generics.RetrieveUpdateDestroyAPIView,
):
    serializer_class = SaleSerializer

    def get_queryset(self):
        return Sale.objects.filter(
            business=self.get_business()
        )
