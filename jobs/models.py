from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Job(models.Model):

    title = models.CharField(max_length=255)

    description = models.TextField()

    salary = models.IntegerField()

    location = models.CharField(max_length=255)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Bookmark(models.Model):
     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
     job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='bookmarked_by')
     created_at = models.DateTimeField(auto_now_add=True)

     class Meta:
        unique_together = ['user', 'job']