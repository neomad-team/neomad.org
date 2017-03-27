from mongoengine import *

MongoDocument = Document


class Document(MongoDocument):
    meta = {
        'abstract': True,
    }

    def clean(self):
        for field in self._get_changed_fields():
            method = 'clean_{}'.format(field)
            if hasattr(self, method):
                getattr(self, method)()
