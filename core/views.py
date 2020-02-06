from flask import redirect, render_template
from flask_login import current_user
from werkzeug.exceptions import NotFound, Gone, InternalServerError

from blog.models import Article
from user.models import User
from .helpers import url_for_user
from . import app


@app.route('/')
def home(): 
    articles = Article.objects(published=True)[:3]
    users = User.objects.all()[:6]
    return render_template('home.html', articles=articles, users=users)
 

@app.errorhandler(NotFound)
def error_404(e):
    return render_template('error.html', code=404), 404

@app.errorhandler(Gone)
def error_410(e):
    return render_template('error.html', code=410), 410

@app.errorhandler(InternalServerError)
def error_500(e):
    return render_template('error.html', code=500), 500
