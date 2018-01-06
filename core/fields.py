from mongoengine.fields import GeoPointField as BaseGeoPointField


class GeoPointField(BaseGeoPointField):
    def __str__(self):
        return self._data.join(',') if self._data else ''
