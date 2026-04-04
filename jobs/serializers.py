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
    class Meta:
        model = Bookmark
        fields = '__all__'
        read_only_fields = ['user']