from flask import render_template, redirect, url_for, request, abort
from flask_login import current_user, login_required

from core import app
from user.models import User
from .models import User


@app.route('/@<string:username>', methods=['get'])
def profile(username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        abort(404)
    # articles = db.articles.search(Q.author == username)
    return render_template('user/profile.html', user=user, articles=[])


@login_required
@app.route('/profile', methods=['get', 'post'])
def profile_edit():
    user = User.objects.get(id=current_user.id)
    if request.method == 'POST':
        data = request.form
        if 'username' in data:
            user.username = data['username']
        if 'about' in data:
            user.about = data['about']
        user.save()
        return redirect(url_for('profile', username=user.username or ''))
    return render_template('user/profile.html', user=user, edit=True)
