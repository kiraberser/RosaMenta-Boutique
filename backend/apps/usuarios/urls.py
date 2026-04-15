from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import EmailOrUsernameTokenObtainPairSerializer
from .views import DireccionViewSet, LogoutView, MeView, RegisterView, UsuariosListView


class EmailOrUsernameLoginView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer


router = DefaultRouter()
router.register(r"direcciones", DireccionViewSet, basename="direcciones")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", EmailOrUsernameLoginView.as_view(), name="auth-login"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("users/", UsuariosListView.as_view(), name="auth-users"),
    path("", include(router.urls)),
]
