from flask import render_template, abort

from core import app
from user.models import User


@app.route('/@<string:user>/trips')
def trips(user):
    try:
        user = User.objects.get(slug=user)
    except User.DoesNotExist:
        abort(404)
    return render_template('trips/map.html',
                           user=user,
                           locations=user.locations)
