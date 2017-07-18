import os
import sys
import requests

import dateutil

sys.path.append(
    os.path.abspath(os.path.dirname(__file__) + '/..')
)

from core import db, app

db.connect(**app.config)


from around.models import Spot
from user.models import User


old_spots = requests.get('http://158.58.170.155:3030/spots').json()

for old_spot in old_spots:
    data = {}
    if not old_spot['name']:
        continue
    try:
        Spot.objects.get(name=old_spot['name'])
        continue
    except Spot.DoesNotExist:
        pass
    try:
        data['user'] = User.objects.get(slug=old_spot.get('author'))
    except User.DoesNotExist:
        data['user'] = None

    creation_date = old_spot.get('creation_date')
    if creation_date:
        creation_date = dateutil.parser.parse(creation_date)

    data['name'] = old_spot['name']
    data['wifi_quality'] = old_spot['wifiQuality']
    data['power_available'] = old_spot['powerAvailable']
    data['category'] = old_spot.get('type')
    data['location'] = [float(old_spot['position']['latitude']),
                        float(old_spot['position']['longitude'])]
    data['creation_date'] = creation_date
    data['comments'] = old_spot['comments']
    spot = Spot(**data).save()
    print(spot)
