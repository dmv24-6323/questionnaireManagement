from django.db import models


# Create your models here.

# Member table
class Member(models.Model):
    username = models.CharField(max_length=50, blank=False, unique=True)
    fullname = models.CharField(max_length=50, blank=False)
    password = models.CharField(max_length=70, blank=False)
    role = models.CharField(max_length=1, blank=False)
