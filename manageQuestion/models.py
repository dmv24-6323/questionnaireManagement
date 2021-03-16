from django.db import models


# Create your models here.

# QuestionList table
class QuestionList(models.Model):
    userId = models.IntegerField(blank=False)
    listName = models.CharField(max_length=50, blank=False)
    active = models.CharField(max_length=1, blank=False)


# Questions table
class Questions(models.Model):
    qlistId = models.IntegerField(blank=False)
    question = models.CharField(max_length=100, blank=False)
    qType = models.CharField(max_length=1, blank=False)
    qStatus = models.CharField(max_length=1, blank=False)
