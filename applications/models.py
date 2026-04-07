from django.conf import settings
from django.db import models

from applications.validators import validate_resume
from jobs.models import Job

User = settings.AUTH_USER_MODEL


class Application(models.Model):
    STATUS_PENDING = "pending"
    STATUS_ACCEPTED = "accepted"
    STATUS_REJECTED = "rejected"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_REJECTED, "Rejected"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    resume = models.FileField(
        upload_to="resumes/",
        null=True,
        blank=True,
        validators=[validate_resume],
    )
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
    )

    class Meta:
        unique_together = ["user", "job"]

    def __str__(self):
        return f"{self.user} applied to {self.job}"
