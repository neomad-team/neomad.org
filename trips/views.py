import datetime

from flask import request, render_template
from flask_login import login_required, current_user

from core import app
from user.models import User
from .models import UserLocation
from .utils import distance


@app.route('/@<string:user>/trips')
def trips(user):
    try:
        user = User.objects.get(slug=user)
    except User.DoesNotExist:
        abort(404)
    return render_template('trips/map.html',
                           user=user,
                           locations=user.locations)


@app.route('/trips/add', methods=['post'])
@login_required
def trips_add():
    user = User.objects.get(id=current_user.id)
    user_position = request.json
    if not user.locations:
        user.locations = [UserLocation(position=user_position)]
        user.save()
        return '', 201

    index = user.locations.count() - 1
    latest_location = user.locations[index]
    # user is still in the same area
    if distance(latest_location.position, user_position) < 25:
        duration = ((datetime.datetime.utcnow() - latest_location.date)
                    .seconds)
        latest_location.duration += duration
        user.locations[index] = latest_location
        status = 202
    # user has moved consistently
    else:
        user.locations.append(UserLocation(position=user_position))
        status = 201
    user.save()
    return '', status
