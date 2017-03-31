import base64
import re
from io import BytesIO

from flask import render_template, request, abort
from flask_login import current_user, login_required
from PIL import Image

from core import app
from blog.models import Article
from .models import User


@app.route('/@<string:username>')
def profile(username):
    try:
        user = User.objects.get(slug=username)
    except User.DoesNotExist:
        abort(404)
    return render_template('user/profile.html', user=user,
                           articles=Article.objects(author=user),
                           edit=(user == current_user))


# cannot use _patch_ method, nginx does not accept it
@app.route('/profile/patch', methods=['post'])
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


# cannot use _patch_ method, nginx does not accept it
@app.route('/profile/patch/avatar', methods=['post'])
@login_required
def profile_edit_avatar():
    try:
        user = User.objects.get(id=current_user.id)
    except User.DoesNotExist:
        abort(404)
    meta, data = request.json['data'].split(',')
    try:
        format_ = re.findall('data:\w+/(\w+);base64', meta)[0]
    except KeyError:
        format_ = 'jpeg'
    image_data = BytesIO(base64.b64decode(data))
    image = Image.open(image_data)
    image.thumbnail((200, 200))
    image.save('{}/{}'.format(app.config.get('AVATARS_PATH'), user.id),
               format=format_)
    return user.avatar, 201
