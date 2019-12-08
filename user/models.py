import datetime
import re

from flask import Markup
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from core import db, app
from core.helpers import slugify
from core.fields import GeoPointField

from trips.models import UserLocation


def uniquify_username(username):
    try:
        # We stop when the exception is caught
        while True:
            str_number = re.match('.*?([0-9]*)$', username).group(1)
            if str_number == '':
                username = username + '1'
            else:
                number = int(str_number) + 1
                username = re.sub(r'\d+$', '', username)
                username = username + str(number)
            User.objects.get(username=username)
    except User.DoesNotExist:
        pass
    return username


class User(UserMixin, db.Document):
    email = db.EmailField(unique=True)
    password = db.StringField(required=True, min_length=32, max_length=120)
    creation_date = db.DateTimeField(default=datetime.datetime.utcnow)
    username = db.StringField(unique=True, required=True)
    about = db.StringField()
    slug = db.StringField(unique=True)
    locations = db.EmbeddedDocumentListField(UserLocation, default=[])
    allow_community = db.BooleanField()
    current_location = GeoPointField()
    socials = db.DictField()
    image_path = db.ImageField(size=(600, 400), thumbnail=(200, 200))

    def set_password(self, password):
        self.password = generate_password_hash(password)
        return self

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @property
    def avatar(self):
        return '{}/{}'.format(app.config.get('AVATARS_URL'), self.id)

    @property
    def has_avatar(self):
        return bool(self.image_path)

    def clean_about(self):
        self.about = (Markup(self.about.replace('<br>', '\^n^'))
                      .striptags().replace('\^n^', '\n'))

    def __str__(self):
        return str(self.username or 'Unknown')

    def to_dict(self):
        data = self.to_mongo()
        data['id'] = str(self.id)
        del data['_id']
        del data['password']
        return data

    def save(self, *args, **kwargs):
        if self.slug is None:
            try:
                User.objects.get(username=self.username)
                # If the code above is reach on the block try, it means that
                # there is a duplicate
                self.username = uniquify_username(self.username)
            except User.DoesNotExist:
                pass
        self.slug = slugify(self.username)
        return super().save(*args, **kwargs)

    meta = {'ordering': ['-creation_date']}
