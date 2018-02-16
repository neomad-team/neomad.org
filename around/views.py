from flask import render_template

from core import app
from user.models import User


@app.route('/around/')
def around():
    users = User.objects(allow_community=True)
    return render_template('around/map.html', users=users)
