from urllib import request

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from utils.response import success_response
from .models import Application
from .serializers import ApplicationSerializer
from rest_framework import serializers
from rest_framework.response import Response
class ApplicationViewSet(ModelViewSet):

    serializer_class = ApplicationSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        # if recruiter → show applications for their jobs
        if user.role == 'recruiter':
            return Application.objects.filter(job__created_by=user)

        # if job seeker → show their own applications
        return Application.objects.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user
        job = serializer.validated_data.get('job')
        if Application.objects.filter(user=user, job=job).exists():
         raise serializers.ValidationError("You already applied to this job")
        serializer.save(user=user)
        from utils.response import success_response

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return success_response(response.data, "Application submitted successfully")
 
 
    def update(self, request, *args, **kwargs):
        user = request.user
    # only recruiter can update status
        if user.role != 'recruiter':
         return Response({"error": "Only recruiters can update status"}, status=403)

        return super().update(request, *args, **kwargs)