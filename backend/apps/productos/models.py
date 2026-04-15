from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify


class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    padre = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.CASCADE, related_name="hijas"
    )

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ["nombre"]

    def __str__(self) -> str:
        return f"{self.padre.nombre} / {self.nombre}" if self.padre else self.nombre

    def clean(self):
        if self.padre and self.padre.padre_id is not None:
            raise ValidationError("Solo se permiten 2 niveles de categorías.")

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nombre)[:120]
        self.full_clean()
        super().save(*args, **kwargs)


class Marca(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    logo_url = models.URLField(max_length=500, blank=True)
    logo_public_id = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "Marca"
        verbose_name_plural = "Marcas"
        ordering = ["nombre"]

    def __str__(self) -> str:
        return self.nombre


class Producto(models.Model):
    class Estado(models.TextChoices):
        NUEVO = "NVO", "Nuevo"
        USADO = "UBS", "Usado"
        REACONDICIONADO = "REC", "Reacondicionado"

    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    precio_descuento = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    sku = models.CharField("Código de parte", max_length=64, unique=True)
    estado = models.CharField(max_length=3, choices=Estado.choices, default=Estado.NUEVO)

    categoria = models.ForeignKey(
        Categoria, on_delete=models.PROTECT, related_name="productos"
    )
    marca = models.ForeignKey(
        Marca, on_delete=models.PROTECT, related_name="productos"
    )

    activo = models.BooleanField(default=True)
    destacado = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["activo", "destacado"]),
            models.Index(fields=["categoria", "marca"]),
        ]

    def __str__(self) -> str:
        return f"{self.nombre} ({self.sku})"

    MIN_IMAGENES = 4

    @property
    def precio_final(self):
        return self.precio_descuento or self.precio

    @property
    def total_imagenes(self) -> int:
        return self.imagenes.count()

    def puede_publicarse(self) -> bool:
        return self.total_imagenes >= self.MIN_IMAGENES


class ProductoImagen(models.Model):
    producto = models.ForeignKey(
        Producto, on_delete=models.CASCADE, related_name="imagenes"
    )
    imagen_url = models.URLField(max_length=500)
    imagen_public_id = models.CharField(max_length=255, blank=True)
    orden = models.PositiveIntegerField(default=0)
    es_principal = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Imagen de producto"
        verbose_name_plural = "Imágenes de producto"
        ordering = ["orden", "id"]

    def save(self, *args, **kwargs):
        if self.es_principal:
            ProductoImagen.objects.filter(
                producto=self.producto, es_principal=True
            ).exclude(pk=self.pk).update(es_principal=False)
        super().save(*args, **kwargs)


class ProductoVariante(models.Model):
    producto = models.ForeignKey(
        Producto, on_delete=models.CASCADE, related_name="variantes"
    )
    talla = models.CharField(max_length=20, blank=True)
    color = models.CharField(max_length=40, blank=True)
    sku_variante = models.CharField(max_length=80, unique=True)
    precio_extra = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )

    class Meta:
        verbose_name = "Variante"
        verbose_name_plural = "Variantes"
        constraints = [
            models.UniqueConstraint(
                fields=["producto", "talla", "color"],
                name="uniq_variante_producto_talla_color",
            )
        ]

    def __str__(self) -> str:
        partes = [self.producto.nombre]
        if self.talla:
            partes.append(self.talla)
        if self.color:
            partes.append(self.color)
        return " · ".join(partes)

    @property
    def precio_final(self):
        return self.producto.precio_final + self.precio_extra
