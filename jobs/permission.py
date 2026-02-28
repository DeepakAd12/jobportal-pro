from rest_framework.permissions import BasePermission


class IsRecruiter(BasePermission):

    def has_permission(self, request, view):

        if request.method == 'POST':
            return request.user.role == 'recruiter'

        return True