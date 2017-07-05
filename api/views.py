import json

from flask import request, Response
from flask_login import current_user

from core import app
from around.models import Spot


def create_json_response(spot):
    json_response = {
        'id': str(spot.id),
        'name': spot.name,
        'wifi': spot.wifi_quality,
        'user': str(spot.user.id),
        'location': {'latitude': spot.location[0],
                     'longitude': spot.location[1]},
        'power': spot.power_available,
        'type': spot.category,
        'comment': spot.comments,
        'date': spot.creation_date.strftime("%Y-%m-%d")
    }
    return json_response


@app.route('/api/spots')
def spots():
    spots = [create_json_response(spot) for spot in Spot.objects.all()]
    return Response(spots, mimetype='application/json')


@app.route('/api/spot', methods=['post'])
def spot_create():
    response = request.get_json()
    spot = Spot(
        name=response.get('name'),
        wifi=response.get('wifi'),
        user=current_user.id,
        location=response.get('coordinates'),
        power=response.get('power'),
        category=response.get('type'),
        comments=[response.get('comment')]
    ).save()
    return json.dumps(create_json_response(spot)), 201
