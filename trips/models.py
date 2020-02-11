import datetime

from core import db
from core.fields import GeoPointField


class UserLocation(db.EmbeddedDocument):
    date = db.DateTimeField(default=datetime.datetime.utcnow)
    position = GeoPointField()
    duration = db.IntField(default=0)

    def __str__(self):
        return str(self.position)
