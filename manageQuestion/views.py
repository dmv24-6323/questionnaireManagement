from django.shortcuts import render, redirect
from manageQuestion.models import QuestionList, Questions
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError


# Create your views here.

# Home page loading
def home(request):
    # If not logged in, redirect to login page.
    if not (request.session.has_key('username')):
        return redirect('loginPage')

    if (request.session['role'] == 'a'):
        role = 'Admin'
    else:
        role = 'Medical Representative'

    # Passing data to html template.

    # Storing user details from session
    userDetails = {
        'id': request.session['id'],
        'name': request.session['fullname'],
        'username': request.session['username'],
        'role': role,
    }

    # Storing default question list details from database
    defaultListDetails = QuestionList.objects.get(userId=0)
    if defaultListDetails:
        defaultList = {
            'id': defaultListDetails.id,
            'name': defaultListDetails.listName
        }

    # Storing user's question lists details from database
    questionLists = QuestionList.objects.filter(userId=userDetails['id']).order_by('listName')
    if questionLists:
        listQuestions = list(questionLists.values())
    else:
        listQuestions = {}

    # Storing active question list details and its questions of user from database.
    activeList = QuestionList.objects.filter(userId=userDetails['id'], active="1").values('id', 'listName')
    activeList = list(activeList)
    # print(activeList[0]['listName'])

    if activeList:
        activeListQuestions = Questions.objects.filter(qlistId=activeList[0]['id'], qStatus="e")
    else:
        activeListQuestions = Questions.objects.filter(qlistId=1, qStatus="e")
    activeListQuestions = list(activeListQuestions.values())
    # print(activeListQuestions)

    if activeList:
        listName = {
            'id': activeList[0]['id'],
            'listName': activeList[0]['listName'],
            'count': len(activeListQuestions)
        }
    else:
        listName = {
            'listName': "Default"
        }

    for x in activeListQuestions:
        if x['qType'] == "t":
            x['qType'] = "Text box"
        elif x['qType'] == "r":
            x['qType'] = "Radio button"
        elif x['qType'] == "c":
            x['qType'] = "Check box"
        elif x['qType'] == "s":
            x['qType'] = "Slider"

    # Render home page with data
    return render(request, 'home.html',
                  {'userDetails': userDetails, 'default': defaultList, 'listQuestions': listQuestions,
                   'activeQuestions': activeListQuestions, 'listName': listName})


# Retrieving questions based on question list from database.
@csrf_exempt
def questions(request):
    qId = request.POST.get('id', None)
    questions = Questions.objects.filter(qlistId=qId, qStatus='e')
    if questions:
        response = list(questions.values())
    else:
        response = {}
    queCount = len(response)
    return JsonResponse({'data': response, 'count': queCount})


# Update questions and its type based on uestion list in database
@csrf_exempt
def updateQuestion(request):
    id = request.POST.get('id', None)
    question = request.POST.get('question', None)
    questionType = request.POST.get('questionType', None)
    updateResult = Questions.objects.filter(id=id).update(question=question, qType=questionType)
    if updateResult:
        details = Questions.objects.filter(id=id, qStatus="e")
        if details:
            response = {
                'result': "success",
                'id': details[0].id,
                'question': details[0].question,
                'questionType': details[0].qType
            }
    return JsonResponse(response)


# Delete question based on question lists in database. Only for admin
@csrf_exempt
def deleteQuestion(request):
    id = request.POST.get('id', None)
    updateResult = Questions.objects.filter(id=id).update(qStatus="d")
    if updateResult:
        response = {
            'result': "success",
            'id': id
        }
    return JsonResponse(response)


# Add question based on question list in database
@csrf_exempt
def addQuestion(request):
    id = request.POST.get('qlistId', None)
    question = request.POST.get('question', None)
    questionType = request.POST.get('questionType', None)
    data = Questions(
        qlistId=id,
        question=question,
        qType=questionType,
        qStatus="e",
    )
    try:
        data.full_clean()
    except ValidationError as e:
        pass
    data.save()
    response = {
        'result': "success",
    }
    return JsonResponse(response)


# Activating a question list in database
@csrf_exempt
def activate(request):
    id = request.POST.get('id', None)
    preActive = QuestionList.objects.filter(active="1", userId=request.session['id'])
    if preActive:
        updateResult = QuestionList.objects.filter(active="1", userId=request.session['id']).update(active="0")

    currActive = QuestionList.objects.filter(id=id).update(active="1")
    if currActive:
        response = {
            'result': "success",
        }
    return JsonResponse(response)


# Creating copy of a question list in database
@csrf_exempt
def addQueList(request):
    wkName = request.POST.get('wkName', None)
    copyId = request.POST.get('copyId', None)

    check = QuestionList.objects.filter(userId=request.session['id'], listName=wkName).values('id')
    if check:
        response = {
            'result': "exists",
        }
    else:
        data = QuestionList(
            userId=request.session['id'],
            listName=wkName,
            active="0",
        )
        try:
            data.full_clean()
        except ValidationError as e:
            pass
        data.save()
        latestId = QuestionList.objects.latest('id')
        latestId = latestId.id
        queDetails = Questions.objects.filter(qlistId=copyId, qStatus="e")

        if queDetails:
            insertData = list(queDetails.values())
            for x in insertData:
                data = Questions(
                    qlistId=latestId,
                    question=x['question'],
                    qType=x['qType'],
                    qStatus=x['qStatus']
                )
                try:
                    data.full_clean()
                except ValidationError as e:
                    pass
                data.save()

        response = {
            'result': "success",
        }

    return JsonResponse(response)


# Reorder questions based on question list in database
@csrf_exempt
def reorderList(request):
    listId = request.POST.get('listId', None)
    questions = request.POST.getlist('questions[]')
    questionTypes = request.POST.getlist('qTypes[]')

    listQuestions = Questions.objects.filter(qlistId=listId, qStatus="e")
    if listQuestions:
        listQuestions = list(listQuestions.values('id', 'question', 'qType'))
        # print(listQuestions)
        count = 0
        for x in listQuestions:
            x['question'] = questions[count]
            x['qType'] = questionTypes[count]
            count = count + 1
        # print(listQuestions)

        for x in listQuestions:
            reorderList = Questions.objects.filter(id=x['id']).update(question=x['question'], qType=x['qType'])

    response = {
        'result': "success",
    }
    return JsonResponse(response)
