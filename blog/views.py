import datetime

from flask import (
    Flask, request, render_template, redirect, url_for, abort, Markup
)

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
    return render_template('blog/article.html', article=article)
