from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Job
from .serializers import JobSerializer
from .permission import IsRecruiter


class JobViewSet(ModelViewSet):

    serializer_class = JobSerializer

    permission_classes = [IsAuthenticated, IsRecruiter]

    def get_queryset(self):

        queryset = Job.objects.all()

        search = self.request.query_params.get('search')
        location = self.request.query_params.get('location')
        salary_min = self.request.query_params.get('salary_min')
        salary_max = self.request.query_params.get('salary_max')

        if search:
            queryset = queryset.filter(title__icontains=search)

        if location:
            queryset = queryset.filter(location__icontains=location)

        if salary_min:
            queryset = queryset.filter(salary__gte=salary_min)

        if salary_max:
            queryset = queryset.filter(salary__lte=salary_max)

        return queryset


    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)