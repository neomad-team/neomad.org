import datetime

from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

from core import db
from core.helpers import slugify


class User(UserMixin, db.Document):
    email = db.EmailField(unique=True)
    password = db.StringField(required=True, min_length=93, max_length=93)
    creation_date = db.DateTimeField(default=datetime.datetime.utcnow)
    username = db.StringField()
    about = db.StringField()
    slug = db.StringField()

    def set_password(self, password):
        self.password = generate_password_hash(password)
        return self

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        self.slug = slugify(self.username)
        return super().save(*args, **kwargs)
