import datetime

from core import db
from core.helpers import slugify
from user.models import User


class Article(db.Document):
    title = db.StringField(required=True)
    content = db.StringField(required=True)
    creation_date = db.DateTimeField(default=datetime.datetime.utcnow)
    slug = db.StringField(required=True)
    author = db.ReferenceField(User)
    language = db.StringField(min_length=2, max_length=2, default='en')

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.creation_date = datetime.datetime.utcnow()
        self.slug = slugify(self.title)
