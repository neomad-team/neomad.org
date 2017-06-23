import json
from datetime import datetime

from flask import render_template, request, abort
from flask_login import current_user, login_required

from core import app
from core.utils import save_base64_image
from blog.models import Article
from .models import User


@app.route('/@<string:username>')
def profile(username):
    try:
        user = User.objects.get(slug=username)
        if user == current_user:
            articles = Article.objects(author=user)
        else:
            articles = Article.objects(author=user, is_published__ne=False)
    except User.DoesNotExist:
        abort(404)
    return render_template('user/profile.html', user=user,
                           articles=articles,
                           edit=(user == current_user))


@app.route('/privacy', methods=['get'])
@login_required
def privacy():
    user = User.objects.get(id=current_user.id)
    return render_template('user/privacy.html',
                           user=user,
                           locations=user.locations)


@app.route('/privacy/<string:timestamp>/delete', methods=['delete'])
@login_required
def privacy_delete_trip(timestamp):
    user = User.objects.get(id=current_user.id)
    trip = user.locations
    trip_list = trip.remove(
        user.locations.get(date=datetime.fromtimestamp(float(timestamp))))
    user.locations = trip_list
    user.save()
    return render_template('user/privacy.html',
                           user=user,
                           locations=user.locations), 204


@app.route('/profile', methods=['patch'])
@login_required
def profile_edit():
    data = request.json
    permitted_fields = ['username', 'about', 'allow_localization', 'socials']
    user = User.objects.get(id=current_user.id)
    for field, value in data.items():
        if not field in permitted_fields:
            return '', 403
        setattr(user, field, value)
    user.save()
    return '', 204


@app.route('/profile/avatar', methods=['patch'])
@login_required
def profile_edit_avatar():
    try:
        user = User.objects.get(id=current_user.id)
    except User.DoesNotExist:
        abort(404)
    save_base64_image(request.json['data'],
                      '{}/{}'.format(app.config.get('AVATARS_PATH'), user.id),
                      (200, 200))
    return user.avatar, 201
