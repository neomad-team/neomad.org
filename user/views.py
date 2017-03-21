from flask import render_template, redirect, url_for, request, abort, Markup
from flask_login import current_user, login_required

from core import app
from user.models import User
from blog.models import Article
from .models import User


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
            user.about = Markup(data['about']).striptags()
        user.save()
        if picture:
            picture.save('{}/{}'.format(app.config.get('AVATARS_PATH'),
                         user.id))
        return redirect(request.url)
    articles = Article.objects(author=user)
    return render_template('user/profile.html', user=user, articles=articles,
                           edit=True)
