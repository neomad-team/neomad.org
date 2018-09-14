import json

from flask import request, Response, jsonify
from flask_login import current_user, login_user

from core import app
from user.models import User
from around.models import Spot


@app.route('/api/spots/')
def api_spots():
    spots = [spot.to_dict() for spot in Spot.objects.all()]
    return Response(json.dumps(spots), mimetype='application/json')


@app.route('/api/spots/', methods=['post'])
def api_spot_create():
    response = request.json
    fields = ('name', 'wifi', 'location', 'power', 'category')
    data = {f: response.get(f) for f in fields}
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


@app.route('/api/login/', methods=['post'])
def api_login():
    try:
        user = User.objects.get(email=request.form['email'])
    except User.DoesNotExist:
        return jsonify({'success': False}), 401
    if user.check_password(password=request.form['password']):
        return jsonify(user.to_dict())
    else:
        return jsonify({'success': False}), 401


@app.route('/api/position/', methods=['post'])
def api_position():
    try:
        user = User.objects.get(id=request.form['id']).to_mongo()
    except User.DoesNotExist:
        return jsonify({'success': False}), 401
    if not user.locations:
        user.locations = [UserLocation(position=request.form['position'])]
        user.save()
        return '', 201
    else:
        index = user.locations.count() - 1
        latest_location = user.locations[index]
        user.locations.append(UserLocation(position=request.form['position']))
        user.save()
        status = 201
    return '', status
