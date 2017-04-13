import datetime

from flask import Markup
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from core import db, app
from core.helpers import slugify

from trips.models import UserLocation


class User(UserMixin, db.Document):
    email = db.EmailField(unique=True)
    password = db.StringField(required=True, min_length=32, max_length=120)
    creation_date = db.DateTimeField(default=datetime.datetime.utcnow)
    username = db.StringField(unique=True)
    about = db.StringField()
    slug = db.StringField(unique=True)
    locations = db.EmbeddedDocumentListField(UserLocation, default=[])
    allow_localization = db.BooleanField()
    current_location = db.GeoPointField()

    def set_password(self, password):
        self.password = generate_password_hash(password)
        return self

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @property
    def avatar(self):
        return '{}/{}'.format(app.config.get('AVATARS_URL'), self.id)

    def clean_username(self):
        self.username = Markup(self.username).striptags()

    def clean_about(self):
        self.about = (Markup(self.about.replace('<br>', '\^n^'))
                      .striptags().replace('\^n^', '\n'))

    def __str__(self):
        return str(self.username or 'Unknown')

    def save(self, *args, **kwargs):
        self.slug = slugify(self.username)
        return super().save(*args, **kwargs)
