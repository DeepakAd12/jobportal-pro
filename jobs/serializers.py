from rest_framework import serializers
from .models import Job
from .models import Bookmark

class JobSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['created_by']

class BookmarkSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(),
        source='job',
        write_only=True
    )

    class Meta:
        model = Bookmark
        fields = ['id', 'job', 'job_id', 'user', 'created_at']
        read_only_fields = ['user']
