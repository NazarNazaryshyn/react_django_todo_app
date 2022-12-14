from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from api.models import Task
from api.serializers import TaskSerializer, UserSerializer, RegisterSerializer
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenViewBase
from api.serializers import TokenObtainLifetimeSerializer, TokenRefreshLifetimeSerializer
import datetime


class CustomTokenObtainPairView(TokenViewBase):
    serializer_class = TokenObtainLifetimeSerializer


class CustomTokenRefreshView(TokenViewBase):
    serializer_class = TokenRefreshLifetimeSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated, )


class GetUserViewSet(generics.ListAPIView):
    def get_queryset(self):

        queryset = User.objects.all()
        return queryset
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, )


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny, )


class GetCompletedTasks(APIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        queryset = Task.objects.all()
        return queryset


    def get(self, request, *args, **kwargs):
        try:
            id = request.query_params["id"]
            if id is not None:
                user = User.objects.filter(id=id).first()
                if user is None:
                    return Response({"detail": f"there is no user with id {id}"})

                tasks = Task.objects.filter(owner_id=id, is_done=True).order_by("-created_at").all()
                serializer = TaskSerializer(tasks, many=True)
        except:
            return Response({'detail': f"something went wrong"})

        return Response(serializer.data)


class GetWithMissedDeadline(APIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        queryset = Task.objects.all()
        return queryset

    def get(self, request, *args, **kwargs):
        try:
            id = request.query_params["id"]
            if id is not None:
                user = User.objects.filter(id=id).first()
                if user is None:
                    return Response({"detail": f"there is no user with id {id}"})

                tasks = Task.objects.filter(owner_id=id).order_by("-created_at").all()

                tasks_with_missed_deadlines = []

                for item in tasks:
                    subtraction = datetime.datetime.strptime(str(item.deadline), "%Y-%m-%d") - datetime.datetime.strptime((datetime.datetime.now()).strftime("%Y-%m-%d"), "%Y-%m-%d")
                    if str(subtraction)[0] == "-" or str(subtraction)[0] == "0":
                        tasks_with_missed_deadlines.append(item)

                serializer = TaskSerializer(tasks_with_missed_deadlines, many=True)
        except Exception as error:
            return Response({'detail': f"{error}"})

        return Response(serializer.data)


class GetUserTasks(APIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        tasks = Task.objects.all()
        return tasks

    def get(self, request, *args, **kwargs):
        try:
            id = request.query_params["id"]

            if id is not None:
                user = User.objects.filter(id=id).first()
                if user is None:
                    return Response({"detail": f"there is no user with id {id}"})

                tasks = Task.objects.filter(owner_id=id).order_by("-created_at")
                serializer = TaskSerializer(tasks, many=True)
        except:
            return Response({'detail': f"something went wrong"})

        return Response(serializer.data)


class ChangeIsDone(APIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        tasks = Task.objects.all()
        return tasks

    def get(self, request, *args, **kwargs):
        try:
            id = request.query_params["id"]
            boolean = False if (str(request.query_params["checked"])).capitalize() == "True" else True
            if id is not None:
                task = Task.objects.get(id=id)
                task.is_done = boolean
                task.save()
                if task is None:
                    return Response({"detail": f"there is no task with id {id}"})
                serializer = TaskSerializer(task)
        except:
            return Response({'detail': f"something went wrong"})

        return Response(serializer.data)


class ChangeTitle(APIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        tasks = Task.objects.all()
        return tasks

    def get(self, request, *args, **kwargs):
        try:
            task_id = request.query_params["task_id"]
            new_title = request.query_params["new_title"]
            if task_id is not None:
                task = Task.objects.get(id=task_id)
                task.title = new_title
                task.save()
                if task is None:
                    return Response({"detail": f"there is no task with id {id}"})
                serializer = TaskSerializer(task)
        except:
            return Response({"detail": "something went wrong"})

        return Response(serializer.data)
