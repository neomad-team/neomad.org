import json

import requests
from flask import render_template

from core import app
from user.models import User


@app.route('/around')
def around():
    users = User.objects(allow_localization=True, current_location__size=2)
    return render_template('around/map.html', users=users)


@app.route('/around/spots.json')
def data_spots():
    data = requests.get('http://158.58.170.155:3030/spots')
    response = app.response_class(
        response=data.content,
        status=data.status_code,
        mimetype='application/json'
    )
    return response
