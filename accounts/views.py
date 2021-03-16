from django.shortcuts import render, redirect
from django.contrib import messages
from accounts.models import Member
import hashlib


# Create your views here.

# Login page loading
def loginPage(request):
    return render(request, 'login.html')


# Login action
def login(request):
    if (request.session.has_key('username')):
        # print("Already in session")
        return redirect('home')

    if request.method == 'POST':
        username = request.POST.get('username')
        password = hashlib.md5(request.POST.get('password').encode())
        user = Member.objects.filter(username=username, password=password.hexdigest())
        if user:
            userDetails = Member.objects.get(username=username)
            request.session['id'] = userDetails.id
            request.session['username'] = userDetails.username
            request.session['fullname'] = userDetails.fullname
            request.session['role'] = userDetails.role
            return redirect('home')
        else:
            messages.error(request, "Invalid username or password.")
            return redirect('loginPage')


# Logout action
def logout(request):
    if request.session.has_key('username'):
        request.session.flush()
        messages.success(request, "Logged out successfully!")
        return redirect("loginPage")
