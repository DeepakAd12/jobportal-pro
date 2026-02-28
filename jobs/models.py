from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Job(models.Model):

    title = models.CharField(max_length=255)

    description = models.TextField()

    salary = models.IntegerField()

    location = models.CharField(max_length=255)

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title