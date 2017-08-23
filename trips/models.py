import datetime

from core import db


class UserLocation(db.EmbeddedDocument):
    date = db.DateTimeField(default=datetime.datetime.utcnow)
    position = db.GeoPointField()
    duration = db.IntField(default=0)

    def __str__(self):
        return str(self.position.join(','))
