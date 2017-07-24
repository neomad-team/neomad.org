import datetime

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

    meta = {
        'ordering': ['-creation_date']
    }

    def __str__(self):
        return self.name
