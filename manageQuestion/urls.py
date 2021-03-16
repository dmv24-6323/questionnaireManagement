from django.urls import path
from manageQuestion.views import home, questions, updateQuestion, deleteQuestion, addQuestion, activate, addQueList, \
    reorderList

# Setting routes
urlpatterns = [
    path('home', home, name='home'),
    path('questions', questions, name='questions'),
    path('addQuestion', addQuestion, name='addQuestion'),
    path('updateQuestion', updateQuestion, name='updateQuestion'),
    path('deleteQuestion', deleteQuestion, name='deleteQuestion'),
    path('activate', activate, name='activate'),
    path('addQueList', addQueList, name='addQueList'),
    path('reorderList', reorderList, name='reorderList'),
]
