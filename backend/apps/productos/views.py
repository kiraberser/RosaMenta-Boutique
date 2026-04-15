from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.cloudinary_utils import delete_image
from core.permissions import IsAdminOrReadOnly

from .models import Categoria, Marca, Producto, ProductoImagen, ProductoVariante
from .serializers import (
    CategoriaSerializer,
    MarcaSerializer,
    ProductoDetailSerializer,
    ProductoImagenSerializer,
    ProductoListSerializer,
    ProductoVarianteSerializer,
)


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.select_related("padre").prefetch_related("hijas")
    serializer_class = CategoriaSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ["nombre", "slug"]


class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.SearchFilter]
    search_fields = ["nombre"]

    def perform_destroy(self, instance):
        if instance.logo_public_id:
            delete_image(instance.logo_public_id)
        super().perform_destroy(instance)


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = (
        Producto.objects
        .select_related("categoria", "marca")
        .prefetch_related("imagenes", "variantes")
    )
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["categoria", "marca", "estado", "activo", "destacado"]
    search_fields = ["nombre", "descripcion", "sku"]
    ordering_fields = ["precio", "created_at"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return ProductoListSerializer
        return ProductoDetailSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return super().get_permissions()

    @action(detail=True, methods=["get"])
    def variantes(self, request, pk=None):
        producto = self.get_object()
        serializer = ProductoVarianteSerializer(producto.variantes.all(), many=True)
        return Response(serializer.data)


class ProductoImagenViewSet(viewsets.ModelViewSet):
    queryset = ProductoImagen.objects.select_related("producto")
    serializer_class = ProductoImagenSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["producto"]

    def perform_destroy(self, instance):
        if instance.imagen_public_id:
            delete_image(instance.imagen_public_id)
        super().perform_destroy(instance)


class ProductoVarianteViewSet(viewsets.ModelViewSet):
    queryset = ProductoVariante.objects.select_related("producto")
    serializer_class = ProductoVarianteSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["producto"]
    search_fields = ["sku_variante", "talla", "color"]
