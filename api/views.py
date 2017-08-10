import json

from flask import request, Response
from flask_login import current_user

from core import app
from around.models import Spot


@app.route('/api/spots')
def spots():
    spots = Spot.objects.all().to_json()
    return Response(spots, mimetype='application/json')


@app.route('/api/spot', methods=['post'])
def spot_create():
    response = request.json
    fields = ('name', 'wifi', 'location', 'power', 'category')
    data = [response.get(f) for f in fields]
    spot = Spot(
        **data,
        user=current_user.id,
        comments=[response.get('comment')]
    ).save()
    return spot.to_json(), 201
