from flask import redirect, render_template
from flask_login import current_user

from user.models import User
from . import app
from .helpers import url_for_user


@app.route('/')
def home():
    return render_template('home.html')
