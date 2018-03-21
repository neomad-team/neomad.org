import datetime

from flask import (
    request, render_template, redirect, abort, flash
)
from flask_login import current_user, login_required

from core import app, db
from core.helpers import url_for_user, url_for_article
from user.models import User
from .models import Article, clean_html


@app.route('/articles/')
def article_list():
    articles = Article.published()
    return render_template('blog/article_list.html', articles=articles)


@app.route('/@<string:author>/<string:slug>-<string:id>/', methods=['get'])
def article(author, slug, id):
    try:
        article = Article.objects.get(id=id)
    except db.errors.ValidationError:
        abort(404)
    except Article.DoesNotExist:
        abort(404)
    if article.slug != slug or article.author.slug != author:
        return redirect(url_for_article(article), 301)
    return render_template('blog/article.html', article=article,
                           articles=Article.objects.filter(id__ne=id))


@app.route('/article/write/')
@login_required
def article_create():
    article = Article()
    return render_template('blog/edit.html', article=article)


@app.route('/article/<string:id>/')
@login_required
def article_edit(id):
    user = User.objects.get(id=current_user.id)
    try:
        article = Article.objects.get(author=user, id=id)
    except Article.DoesNotExist:
        abort(404)
    return render_template('blog/edit.html', article=article)


@app.route('/article/<string:id>/', methods=['post'])
@login_required
def article_save(id):
    user = User.objects.get(id=current_user.id)
    try:
        article = Article.objects.get(author=user, id=id)
    except Article.DoesNotExist:
        abort(404)
    article.title = request.form.get('title')
    article.content = clean_html(request.form.get('content'))
    article.publication_date = (datetime.datetime.utcnow()
                                if request.form.get('published') != ''
                                else None)
    errors = []
    if article.title == '' or clean_html(article.content) == '':
        errors.append('Please insert a title and a content')
        return render_template('blog/edit.html', article=article,
                               errors=errors), 400
    article.save()
    return redirect(url_for_article(article))


@app.route('/article/<string:id>/delete/', methods=['get'])
@login_required
def article_delete(id):
    user = User.objects.get(id=current_user.id)
    try:
        Article.objects.get(author=user, id=id).delete()
    except Article.DoesNotExist:
        abort(404)
    flash('You article was deleted.', 'success')
    return redirect(url_for_user(user))
