from django.urls import path

from .views import CategoryListCreateView, ProductListCreateView


urlpatterns = [
    path(
        "categories/",
        CategoryListCreateView.as_view(),
        name="category-list-create",
    ),
    path(
        "",
        ProductListCreateView.as_view(),
        name="product-list-create",
    ),
]