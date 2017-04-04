from mongoengine import *
from mongoengine import Document as MongoDocument


class Document(MongoDocument):
    meta = {
        'abstract': True,
    }

    def clean(self):
        for field in self._get_changed_fields():
            method = 'clean_{}'.format(field)
            if hasattr(self, method):
                getattr(self, method)()
