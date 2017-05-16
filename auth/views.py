from flask import request, render_template, redirect, url_for
from flask_login import login_user, logout_user, current_user

from core import app
from user.models import User
from core.helpers import url_for_user


@app.route('/login', methods=['get', 'post'])
def login():
    try:
        user = User.objects.get(id=current_user.id)
        return redirect(url_for_user(user))
    except:
        pass
    errors = []
    invalid = 'Do you have an account? Please check your email and password.'
    if request.method == 'POST':
        try:
            user = User.objects.get(email=request.form['email'])
            if user.check_password(password=request.form['password']):
                login_user(user)
                return redirect(url_for_user(user))
        except User.DoesNotExist:
            errors.append(invalid)
        else:
            errors.append(invalid)
    return (render_template('auth/login.html', errors=errors),
            200 if not len(errors) else 401)


@app.route('/signup', methods=['get', 'post'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        user = (User(email=email, username=email.split('@')[0])
                .set_password(request.form['password']).save())
        login_user(user)
        return redirect(url_for_user(user))
    else:
        return render_template('auth/signup.html')


@app.route('/logout', methods=['get'])
def logout():
    logout_user()
    return render_template('auth/login.html')
