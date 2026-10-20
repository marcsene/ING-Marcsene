
from rest_framework import generics
from rest_framework.exceptions import PermissionDenied

from businesses.models import Business
from .models import Customer
from .serializers import CustomerSerializer


class CustomerBusinessMixin:
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


class CustomerListCreateView(
    CustomerBusinessMixin,
    generics.ListCreateAPIView,
):
    serializer_class = CustomerSerializer

    def get_queryset(self):
        return Customer.objects.filter(
            business=self.get_business()
        )

    def perform_create(self, serializer):
        serializer.save(business=self.get_business())


class CustomerDetailView(
    CustomerBusinessMixin,
    generics.RetrieveUpdateDestroyAPIView,
):
    serializer_class = CustomerSerializer

    def get_queryset(self):
        return Customer.objects.filter(
            business=self.get_business()
        )
