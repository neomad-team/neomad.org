import datetime

from flask import (
    request, render_template, redirect, abort, flash
)
from flask_login import current_user, login_required

from core import app
from core.helpers import url_for_user, url_for_article
from user.models import User
from .models import Article, clean_html


@app.route('/articles/')
def article_list():
    articles = Article.objects.filter(published=True)
    return render_template('blog/article_list.html', articles=articles)


@app.route('/@<string:author>/<string:slug>-<string:id>/')
def article(author, slug, id):
    try:
        article = Article.objects.get(id=id)
    except Article.DoesNotExist:
        abort(404)
    if article.slug != slug or article.get_author().slug != author:
        return redirect(url_for_article(article), 301)
    article = article.morph()
    return render_template('blog/article.html', article=article,
                           articles=Article.objects.filter(id__ne=id))


@app.route('/article/write/', methods=['get', 'post'])
@login_required
def article_create():
    article = Article(content='')
    article.author = User.objects.get(id=current_user.id)
    status = 200
    errors = []
    if request.method == 'POST':
        if (request.form.get('title') == ''
                or request.form.get('content') == ''):
            errors.append('Please, insert a title and a content')
            status = 400
        else:
            article.title = request.form.get('title')
            article.content = request.form.get('content')
            if bool(request.form.get('published')):
                article.published = True
                article.publication_date = datetime.datetime.utcnow()
            else:
                article.publication_date = None
                article.published = False
            article.save()
            status = 201
    return render_template('blog/edit.html', article=article,
                           errors=errors, edit=True), status


@app.route('/article/<string:id>/edit/', methods=['get', 'post'])
@login_required
def article_edit(id):
    user = User.objects.get(id=current_user.id)
    try:
        article = Article.objects.get(author=user, id=id)
    except Article.DoesNotExist:
        abort(404)
    errors = []
    if request.method == 'POST':
        article.title = request.form.get('title')
        article.content = request.form.get('content')        
        article.published = bool(request.form.get('published'))
        if article.published and not article.publication_date:
            article.publication_date = datetime.datetime.utcnow()
        if article.title != '' and clean_html(article.content) != '':
            article.save()
            return redirect(url_for_article(article))
        else:
            errors.append('Please insert a title and a content')
    return render_template('blog/edit.html', article=article,
                           errors=errors, edit=True), 400


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
