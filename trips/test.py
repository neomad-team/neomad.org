import json
from unittest import TestCase

from core import app
from user.models import User


class TripTest(TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.user = User(email='emailtest@test.com').set_password('testtest')
        self.user.allow_community = True
        self.user.save()
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        self.client.post('/login/', data=data, follow_redirects=True)
        self.lat_lng = [3.5, 42.0]

    def tearDown(self):
        User.objects.delete()

    def test_add_trip(self):
        user = User.objects.first()
        self.assertEqual(user.locations, [])
        result = self.client.post('/trips/add/', data=json.dumps(self.lat_lng),
                                  content_type='application/json')
        # User has changed in the database
        user = User.objects.first()
        self.assertEqual(user.locations[0].position, self.lat_lng)
        self.assertEqual(result.status_code, 201)

    def test_trip_exactly_same_area(self):
        self.client.post('/trips/add/', data=json.dumps(self.lat_lng),
                         content_type='application/json')
        result = self.client.post('/trips/add/', data=json.dumps(self.lat_lng),
                                  content_type='application/json')
        user = User.objects.first()
        self.assertEqual(user.locations.count(), 1)
        self.assertEqual(result.status_code, 202)

    def test_trip_same_area_under_10_km(self):
        self.client.post('/trips/add/', data=json.dumps(self.lat_lng),
                         content_type='application/json')
        lat_lng = self.lat_lng
        lat_lng[0] += 0.001
        result = self.client.post('/trips/add/', data=json.dumps(lat_lng),
                                  content_type='application/json')
        user = User.objects.first()
        self.assertEqual(user.locations.count(), 1)
        self.assertEqual(result.status_code, 202)

    def test_trip_different_area(self):
        lat_lng = [10, 10]
        self.client.post('/trips/add/', data=json.dumps(self.lat_lng),
                         content_type='application/json')
        result = self.client.post('/trips/add/', data=json.dumps(lat_lng),
                                  content_type='application/json')
        user = User.objects.first()
        self.assertEqual(user.locations.count(), 2)
        self.assertEqual(user.locations[1].position, lat_lng)
        self.assertEqual(result.status_code, 201)
