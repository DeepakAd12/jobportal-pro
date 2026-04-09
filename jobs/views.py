from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated


from rest_framework import serializers

from utils.response import success_response
from .models import Job
from .serializers import JobSerializer
from .permission import IsRecruiter
from .pagination import JobPagination
from .models import Bookmark
from .serializers import BookmarkSerializer


class JobViewSet(ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny]
    pagination_class = JobPagination

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['location', 'salary']
    search_fields = ['title', 'description']


    def get_queryset(self):

        queryset = Job.objects.select_related('created_by').all()

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
        serializer.save(created_by=self.request.user if self.request.user.is_authenticated else None)

class BookmarkViewSet(ModelViewSet):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Bookmark.objects.filter(user=self.request.user).select_related('job', 'job__created_by')
        job = self.request.query_params.get('job')
        if job:
            queryset = queryset.filter(job=job)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        job = serializer.validated_data.get('job')

        if Bookmark.objects.filter(user=user, job=job).exists():
            raise serializers.ValidationError("Already bookmarked")

        serializer.save(user=user)
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return success_response(response.data, "Job bookmarked successfully") 
