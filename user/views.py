import datetime
import base64

from flask import render_template, redirect, url_for, request, abort, Markup
from flask_login import current_user, login_required

from core import app
from core.utils import distance
from user.models import User
from blog.models import Article
from .models import User, UserLocation


@app.route('/@<string:username>')
def profile(username):
    try:
        user = User.objects.get(slug=username)
    except User.DoesNotExist:
        abort(404)
    return render_template('user/profile.html', user=user,
                           articles=Article.objects(author=user),
                           edit=(user == current_user))


@app.route('/profile/edit', methods=['patch'])
@login_required
def profile_edit():
    data = request.json
    permitted_fields = ['username', 'about', 'allow_localization']
    user = User.objects.get(id=current_user.id)
    for field, value in data.items():
        if not field in permitted_fields:
            return '', 403
        setattr(user, field, value)
    user.save()
    return '', 200


@app.route('/profile/edit/avatar', methods=['patch'])
@login_required
def profile_edit_avatar():
    try:
        user = User.objects.get(id=current_user.id)
    except User.DoesNotExist:
        abort(404)
    meta, data = request.json['data'].split(',')
    stream = open('{}/{}'.format(app.config.get('AVATARS_PATH'), user.id),
                  'wb')
    stream.write(base64.b64decode(data))
    stream.close()
    return user.avatar, 200


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
    return '', 200
