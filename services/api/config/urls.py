from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/products/", include("products.urls")),
    path("api/customers/", include("customers.urls")),
    path("api/sales/", include("sales.urls")),
]