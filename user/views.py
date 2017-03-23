import datetime

from flask import render_template, redirect, url_for, request, abort, Markup
from flask_login import current_user, login_required

from core import app
from core.utils import distance
from user.models import User
from blog.models import Article
from .models import User, UserLocation


@app.route('/@<string:username>', methods=['get'])
def profile(username):
    try:
        user = User.objects.get(slug=username)
    except User.DoesNotExist:
        abort(404)
    return render_template('user/profile.html', user=user,
                           articles=Article.objects(author=user))


@app.route('/profile', methods=['get', 'post'])
@login_required
def profile_edit():
    user = User.objects.get(id=current_user.id)
    if request.method == 'POST':
        data = request.form
        picture = request.files.get('picture')
        if 'username' in data:
            user.username = Markup(data['username']).striptags()
        if 'about' in data:
            user.about = (Markup(data['about'].replace('<br>', '\^n^'))
                          .striptags().replace('\^n^', '\n'))
        user.save()
        if picture:
            picture.save('{}/{}'.format(app.config.get('AVATARS_PATH'),
                         user.id))
        return redirect(request.url)
    articles = Article.objects(author=user)
    return render_template('user/profile.html', user=user, articles=articles,
                           edit=True)


@app.route('/profile/edit/localize', methods=['patch'])
def profile_edit_localize():
    user = User.objects.get(id=current_user.id)
    user.allow_localization = bool(request.json)
    user.save()
    return '', 200


@app.route('/localize/add', methods=['post'])
@login_required
def localize_add():
    user = User.objects.get(id=current_user.id)
    user_position = request.json
    new_location = False
    if user.locations:
        index = user.locations.count() - 1
        latest_location = user.locations[index]
        # user is still in the same area
        if distance(latest_location.position, user_position) < 25:
            duration = ((datetime.datetime.utcnow() - latest_location.date)
                        .seconds)
            latest_location.duration += duration
            user.locations[index] = latest_location
    if new_location:
        user.locations.append(UserLocation(position=user_position))
    user.save()
    return ''
