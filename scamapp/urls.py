from django.urls import path
from scamapp import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('capture/', views.capture, name='capture'),
]