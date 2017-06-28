from unittest import TestCase

from blog.views import *
from .views import *
from user.views import *


class AuthTest(TestCase):
    def setUp(self):
        self.client = app.test_client()

    def tearDown(self):
        User.objects.delete()

    def test_signup_same_username_email(self):
        # Sign up a new user
        data = {
            'email': 'newtest@email.com',
            'password': 'test'
        }
        self.client.post('/signup', data=data)
        # Sign up a new user with same slug for neomad
        data = {
            'email': 'newtest@test.com',
            'password': 'test'
        }
        result = self.client.post('/signup', data=data)
        try:
            User.objects.get(username='newtest1')
        except User.DoesNotExist:
            self.fail('User does not exist')
        self.assertEqual(result.status_code, 302)
        # Sign up a new user with same slug for neomad twice in a row
        data = {
            'email': 'newtest@testagain.com',
            'password': 'test'
        }
        result = self.client.post('/signup', data=data)
        try:
            User.objects.get(username='newtest2')
        except User.DoesNotExist:
            self.fail('User does not exist')
        self.assertEqual(result.status_code, 302)
        # Sign up a new user that have a username that already exist
        data = {
            'email': 'newtest1@test.com',
            'password': 'test'
        }
        result = self.client.post('/signup', data=data)
        try:
            User.objects.get(username='newtest3')
        except User.DoesNotExist:
            self.fail('User does not exist')
        self.assertEqual(result.status_code, 302)
