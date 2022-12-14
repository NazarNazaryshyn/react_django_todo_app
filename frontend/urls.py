from django.urls import path
from frontend.views import main

urlpatterns = [
    path('', main),
    path("login/", main)
]
