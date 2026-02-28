from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Application
from .serializers import ApplicationSerializer


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
        serializer.save(user=self.request.user)