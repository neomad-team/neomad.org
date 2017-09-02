from flask import redirect, render_template
from flask_login import current_user

from blog.models import Article
from user.models import User
from . import app
from .helpers import url_for_user



@app.route('/')
def home():
    articles = Article.objects.all()[:3]
    users = User.objects.all()[:12]
    return render_template('home.html', articles=articles, users=users)
