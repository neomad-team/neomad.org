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
    spot = Spot(
        name=response.get('name'),
        wifi_quality=response.get('wifi'),
        user=current_user.id,
        location=response.get('coordinates'),
        power_available=response.get('power'),
        category=response.get('type'),
        comments=[response.get('comment')]
    ).save()
    return spot.to_json(), 201
