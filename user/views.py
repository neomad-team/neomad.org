from pathlib import Path
from datetime import datetime

from flask import render_template, request, abort, redirect, url_for
from flask_login import current_user, login_required
from mongoengine.errors import DoesNotExist

from core import app
from core.helpers import url_for_user
from core.utils import save_image
from blog.models import Article
from .models import User


@app.route('/@<string:username>/')
def profile(username):
    try:
        user = User.objects.get(slug=username)
    except User.DoesNotExist:
        abort(404)
    if user == current_user:
        articles = Article.objects(author=user)
    else:
        articles = Article.objects(author=user, published=True)
    return render_template('user/profile.html', user=user,
                           articles=articles,
                           edit=(user == current_user))


@app.route('/privacy/', methods=['get', 'post'])
@login_required
def privacy():
    if request.method == 'POST':
        try:
            user = User.objects.get(id=current_user.id)
            field = 'allow_community'
            value = request.form.get(field) == 'enable'
            setattr(user, field, value)
            user.save()
            return redirect(url_for_user(user))
        except User.DoesNotExist:
            abort(404)
    else:
        user = User.objects.get(id=current_user.id)
        return render_template('user/privacy.html',
                           user=user,
                           locations=user.locations)


@app.route('/privacy/<float:date>/delete/', methods=['post'])
@login_required
def privacy_delete_trip(date):
    user = User.objects.get(id=current_user.id)
    try:
        user.locations.remove(user.locations.get(date=datetime.fromtimestamp(date)))
        user.save()
        return redirect(url_for('privacy'))
    except DoesNotExist:
        abort(410)


@app.route('/profile/')
@login_required
def profile_edit():
    user = User.objects.get(id=current_user.id)
    articles = Article.objects(author=user)
    return render_template('user/edit.html', user=user, articles=articles)


@app.route('/profile/', methods=['post'])
@login_required
def profile_save():
    data_fields = ['username', 'about']
    user = User.objects.get(id=current_user.id)
    for field in data_fields:
        value = request.form.get(field)
        setattr(user, field, value)
    if not user.socials:
        user.socials = {}
    for field, value in request.form.items():
        if field.startswith('socials.'):
            user.socials[field[len('socials.'):]] = value
    if request.form.get('delete'):
        Path.unlink(Path(f"{app.config.get('AVATARS_PATH')}/{user.id}"))
        user.image_path = None
    if request.files.get('avatar'):
        path = f"{app.config.get('AVATARS_PATH')}/{user.id}"
        save_image(request.files['avatar'], path, (200, 200))
        user.image_path = path
    user.save()
    return redirect(url_for_user(user))


@app.route('/profile/avatar/', methods=['patch'])
@login_required
def profile_edit_avatar():
    try:
        user = User.objects.get(id=current_user.id)
        avatars_path = app.config.get('AVATARS_PATH')
        save_image(request.files['avatar'],
            f'{avatars_path}/{user.id}', (200, 200))
    except User.DoesNotExist:
        abort(404)
