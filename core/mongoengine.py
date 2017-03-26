from mongoengine import *

MongoDocument = Document


class Document(MongoDocument):
    meta = {'allow_inheritance': True}

    def clean(self):
        for field in self._changed_fields:
            method = 'clean_{}'.format(field)
            if hasattr(self, method):
                getattr(self, method)()
