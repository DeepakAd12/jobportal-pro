from rest_framework import serializers
from .models import Application
from jobs.models import Job
from jobs.serializers import JobSerializer


class ApplicationSerializer(serializers.ModelSerializer):

    # for reading (shows full job details)
    job = JobSerializer(read_only=True)

    # for writing (accepts job id from Postman)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(),
        source='job',
        write_only=True
    )

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_id', 'applied_at']