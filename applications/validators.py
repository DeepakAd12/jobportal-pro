import os
from django.core.exceptions import ValidationError

def validate_resume(file):
    ext = os.path.splitext(file.name)[1]
    
    if ext.lower() != '.pdf':
        raise ValidationError("Only PDF files are allowed")

    if file.size > 2 * 1024 * 1024:  # 2MB
        raise ValidationError("File size must be under 2MB")