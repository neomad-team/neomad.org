import datetime

from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

from core import db, app
from core.helpers import slugify


class User(UserMixin, db.Document):
    email = db.EmailField(unique=True)
    password = db.StringField(required=True, min_length=32, max_length=120)
    creation_date = db.DateTimeField(default=datetime.datetime.utcnow)
    username = db.StringField()
    about = db.StringField()
    slug = db.StringField()

    def set_password(self, password):
        self.password = generate_password_hash(password)
        return self

    def check_password(self, password):
        return check_password_hash(self.password, password)

    @property
    def avatar(self):
        return '{}/{}'.format(app.config.get('AVATARS_URL'), self.id)

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        self.slug = slugify(self.username)
        return super().save(*args, **kwargs)
