from flask import request, render_template, redirect, url_for
from flask_login import login_user, logout_user

from core import app
from user.models import User


@app.route('/login', methods=['get', 'post'])
def login():
    errors = []
    invalid = 'Do you have an account? Please check your email and password.'
    if request.method == 'POST':
        try:
            user = User.objects.get(email=request.form['email'])
            if user.check_password(password=request.form['password']):
                login_user(user)
                return redirect(url_for('profile_edit'))
        except User.DoesNotExist:
            errors.append(invalid)
        else:
            errors.append(invalid)
    return render_template('auth/login.html', errors=errors)


@app.route('/logout', methods=['get'])
def logout():
    logout_user()
    return render_template('auth/login.html')
