from django.urls import path, include
from api.views import TaskViewSet, GetUserTasks, GetUserViewSet, RegisterView, GetCompletedTasks, GetWithMissedDeadline, \
    ChangeIsDone, ChangeTitle, CustomTokenObtainPairView, CustomTokenRefreshView
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'task', TaskViewSet)



urlpatterns = [
    path("", include(router.urls)),
    path("register/", RegisterView.as_view()),
    path("user/", GetUserViewSet.as_view()),
    path("user_tasks/", GetUserTasks.as_view()),
    path("get_completed/", GetCompletedTasks.as_view()),
    path("missed_deadline/", GetWithMissedDeadline.as_view()),
    path("change_is_done/", ChangeIsDone.as_view()),
    path("change_title/", ChangeTitle.as_view()),
    path('custom_token/obtain/', CustomTokenObtainPairView.as_view(), name='token-obtain'),
    path('custom_token/refresh/', CustomTokenRefreshView.as_view(), name='token-refresh'),
]
