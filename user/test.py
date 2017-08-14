import json
from unittest import TestCase

from core import app
from blog import views
from user.models import User
from trips import views
from user import views
from auth import views


def login_user(self):
    data = {
        'email': 'emailtest@test.com',
        'password': 'testtest',
    }
    self.client.post('/login/', data=data, follow_redirects=True)


class UserTest(TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.user = (User(email='emailtest@test.com',
                          allow_localization=True)
                     .set_password('testtest').save())
        self.lat_lng = [3.5, 42.0]

    def tearDown(self):
        User.objects.delete()

    def test_user_page_that_does_not_exist(self):
        result = self.client.get('/@doesnotexist/')
        self.assertEqual(result.status_code, 404)

    def test_privacy_page_unauthorized(self):
        result = self.client.get('/privacy/')
        self.assertEqual(result.status_code, 401)

    def test_privacy_page_access(self):
        login_user(self)
        result = self.client.get('/privacy/')
        self.assertEqual(result.status_code, 200)

    def test_delete_trip(self):
        login_user(self)
        lat_lng = [10, 10]
        self.client.post('/trips/add/', data=json.dumps(lat_lng),
                         content_type='application/json')
        user = User.objects.first()
        url = '/privacy/{}/delete/'.format(user.locations[0].date.timestamp())
        result = self.client.delete(url, content_type='application/json')
        user = User.objects.first()
        self.assertEqual(user.locations.count(), 0)
        self.assertEqual(result.status_code, 204)
