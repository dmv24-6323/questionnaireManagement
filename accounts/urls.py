from django.urls import path
from accounts.views import loginPage, login, logout

# Setting routes
urlpatterns = [
    path('', loginPage, name='loginPage'),
    path('login', login, name='login'),
    path("logout", logout, name="logout"),
]
