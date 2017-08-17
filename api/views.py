import json

from flask import request, Response, url_for
from flask_login import current_user

from user.models import User
from core import app
from around.models import Spot


@app.route('/api/spots/')
def api_spots():
    spots = []
    for spot in Spot.objects.all():
        data = spot.to_mongo()
        data['creation_date'] = str(spot.creation_date.timestamp())
        data['id'] = str(spot.id)
        del data['_id']
        data['user_url'] = url_for('api_user', id=spot.user.id)
        del data['user']
        spots.append(data)
    return Response(json.dumps(spots), mimetype='application/json')


@app.route('/api/spots/', methods=['post'])
def api_spot_create():
    response = request.json
    fields = ('name', 'wifi', 'location', 'power', 'category')
    data = [response.get(f) for f in fields]
    spot = Spot(
        **data,
        user=current_user.id,
        comments=[response.get('comment')]
    ).save()
    return spot.to_json(), 201


@app.route('/api/users/<string:id>/')
def api_user(id):
    user = User.objects.get(id=id).to_mongo()
    data = {k: user[k] for k in ('_id', 'username', 'slug', 'about',
                                 'socials')}
    data['id'] = str(data['_id'])
    del data['_id']
    if 'email' in data['socials']:
        data['socials']['email'] = 'hidden'
    return Response(json.dumps(data), mimetype='application/json')
