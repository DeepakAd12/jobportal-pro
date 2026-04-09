from rest_framework import serializers
from .models import Application
from jobs.models import Job
from jobs.serializers import JobSerializer


class ApplicationSerializer(serializers.ModelSerializer):

    # for reading (shows full job details)
    job = JobSerializer(read_only=True)

    # for writing (accepts job id from requests)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(),
        write_only=True,
        source='job'
    )

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_id', 'user', 'resume', 'applied_at', 'status']
        read_only_fields = ['id', 'user', 'applied_at', 'status']
        extra_kwargs = {'resume': {'required': False}}
