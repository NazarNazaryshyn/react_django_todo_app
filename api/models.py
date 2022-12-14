import datetime
from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    deadline = models.DateField()
    is_done = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=datetime.datetime.now())
    updated_at = models.DateField(auto_now_add=datetime.datetime.now())

    def __str__(self):
        return f"{self.owner} - {self.title}"


