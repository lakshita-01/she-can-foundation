from django.urls import path
from .views import (
    InternDashboardView, 
    LeaderboardView, 
    InternStatsView,
    CreateInternView,
    TestAPIView
)

urlpatterns = [
    path('test/', TestAPIView.as_view(), name='test-api'),
    path('intern/<int:id>/dashboard/', InternDashboardView.as_view(), name='intern-dashboard'),
    path('intern/<int:id>/stats/', InternStatsView.as_view(), name='intern-stats'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('intern/create/', CreateInternView.as_view(), name='create-intern'),
]