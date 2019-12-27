from flask import render_template
from flask_login import login_required, current_user

from core import app
from user.models import User


@app.route('/around/')
def around():
    users = User.objects(allow_community=True)
    return render_template('around/map.html', users=users)


@app.route('/around/spot')
def form_spot():
    users = User.objects(allow_community=True)
    return render_template('around/form_spot.html', users=users)
