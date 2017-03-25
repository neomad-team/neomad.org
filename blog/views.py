import datetime

from flask import (
    Flask, request, render_template, redirect, url_for, abort, Markup
)
from flask_login import current_user, login_required

from core import app, db
from core.helpers import url_for_article
from user.models import User
from .models import Article


@app.route('/@<string:author>/<string:slug>-<string:id>', methods=['get'])
def article(author, slug, id):
    try:
        author = User.objects.get(slug=author)
        article = Article.objects.get(author=author, slug=slug, id=id)
    except Article.DoesNotExist:
        abort(404)
    return render_template('blog/article.html', article=article,
                           edit=author==current_user)


@app.route('/article/new', methods=['get', 'post'])
@login_required
def article_create():
    article = Article(content='')
    article.author = User.objects.get(id=current_user.id)
    if request.method == 'POST':
        article.title = Markup(request.form.get('title')).striptags()
        article.content = request.form.get('content')
        article.save()
    return render_template('blog/article.html', article=article, edit=True)


@app.route('/article/<string:id>/edit', methods=['post'])
@login_required
def article_edit(id):
    user = User.objects.get(id=current_user.id)
    try:
        article = Article.objects.get(author=user, id=id)
    except Article.DoesNotExist:
        abort(404)
    article.title = Markup(request.form.get('title')).striptags()
    article.content = request.form.get('content')
    article.save()
    return redirect(url_for_article(article))
