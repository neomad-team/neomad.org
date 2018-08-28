import json
from unittest import TestCase

from core import app
from user.models import User

from . import views  # noqa: F401


class UserTest(TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.user = (User(email='emailtest@test.com',
                          username='emailtest',
                          allow_community=True)
                     .set_password('testtest').save())

    def tearDown(self):
        self.user.delete()

    def test_login_wrong_email(self):
        response = self.client.post('/api/login/',
                                    data={'email': 'wrong@example.com'})
        self.assertEqual(response.status_code, 401)

    def test_login_no_password(self):
        response = self.client.post('/api/login/',
                                    data={'email': 'emailtest@test.com'})
        self.assertEqual(response.status_code, 400)

    def test_correct_login(self):
        response = self.client.post('/api/login/',
                                    data={'email': 'emailtest@test.com',
                                          'password': 'testtest'})
        self.assertEqual(response.status_code, 200)
        user = json.loads(response.get_data())
        self.assertEqual(user['email'], 'emailtest@test.com')
