import datetime

from flask import (
    Flask, request, render_template, redirect, url_for, abort, Markup
)
from flask_login import current_user

from core import app, db
from user.models import User
from .models import Article


@app.route('/@<string:author>/<string:slug>', methods=['get'])
def article(author, slug):
    try:
        author = User.objects.get(slug=author)
        article = Article.objects.get(author=author, slug=slug)
    except Article.DoesNotExist:
        abort(404)
    return render_template('blog/article.html', article=article,
                           edit=author==current_user)


@app.route('/@<string:author>/<string:slug>', methods=['post'])
def article_edit(author, slug):
    try:
        author = User.objects.get(slug=author)
        article = Article.objects.get(author=author, slug=slug)
    except Article.DoesNotExist:
        abort(404)
    article.title = Markup(request.form.get('title')).striptags()
    article.content = request.form.get('content')
    article.save()
    return redirect(request.url)
