import datetime
import json

from core import db

from user.models import User


class Spot(db.Document):
    name = db.StringField(required=True)
    user = db.ReferenceField(User)
    location = db.GeoPointField(required=True)
    wifi = db.IntField(min_value=0, max_value=5)
    power = db.BooleanField()
    category = db.StringField()
    comments = db.ListField(db.StringField())
    creation_date = db.DateTimeField(default=datetime.datetime.utcnow)
    user_url = db.StringField()

    meta = {
        'ordering': ['-creation_date']
    }

    def __str__(self):
        return self.name

    def to_dict(self):
        data = self.to_mongo()
        data['creation_date'] = str(self.creation_date.timestamp())
        data['id'] = str(self.id)
        del data['_id']
        data['user'] = str(data['user'])
        return data

    def to_json(self):
        return json.dumps(self.to_dict())
