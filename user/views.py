from pathlib import Path
from datetime import datetime

from flask import render_template, request, abort, redirect, url_for
from flask_login import current_user, login_required

from core import app
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


@app.route('/privacy/', methods=['get'])
@login_required
def privacy():
    user = User.objects.get(id=current_user.id)
    return render_template('user/privacy.html',
                           user=user,
                           locations=user.locations)


@app.route('/privacy/<float:date>/delete/', methods=['post'])
@login_required
def privacy_delete_trip(date):
    user = User.objects.get(id=current_user.id)
    user.locations.remove(user.locations.get(date=datetime.fromtimestamp(
                                             date)))
    user.save()
    return redirect('privacy'), 204


@app.route('/profile/')
@login_required
def profile_edit():
    user = User.objects.get(id=current_user.id)
    articles = Article.objects(author=user)
    return render_template('user/edit.html', user=user, articles=articles)


@app.route('/profile/', methods=['post'])
@login_required
def profile_save():
    permitted_fields = ['username', 'about', 'allow_community', 'socials']
    user = User.objects.get(id=current_user.id)
    socials = user.socials or {}
    for field, value in request.form.items():
        if field not in permitted_fields and not field.startswith('socials.'):
            return f'Property {field} cannot be modified.', 403
        if field.startswith('socials.'):
            socials[field[len('socials.'):]] = value
        else:
            setattr(user, field, value)
    user.socials = socials
    if request.form['delete']:
        Path.unlink(user.image_path)
        user.image_path = None
    if request.files['avatar']:
        ouput = f'{app.config.get('AVATARS_PATH')}/{user.id}'
        save_image(request.files['avatar'], output, (200, 200))
        user.image_path = ouput
    user.save()
    return redirect(url_for('profile', username=user.username))


@app.route('/profile/avatar/', methods=['patch'])
@login_required
def profile_edit_avatar():
    try:
        user = User.objects.get(id=current_user.id)
    except User.DoesNotExist:
        abort(404)
    save_image(request.files['avatar'],
               f'{app.config.get('AVATARS_PATH')}/{user.id}', (200, 200))
