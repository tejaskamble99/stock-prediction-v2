from django.urls import path 
from . import views

urlpatterns = [
    # Auth APIs (For React Login/Signup)
    path('api/signup/', views.api_signup, name='api_signup'),
    path('api/login/', views.api_login, name='api_login'),

    # Prediction API (For React Dashboard)
    path('api/search/<str:se>/<str:stock_symbol>/', views.search_api, name='search_api'),
]