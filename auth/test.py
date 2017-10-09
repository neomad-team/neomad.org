from unittest import TestCase

from core import app
from user.views import User


class AuthTest(TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.user = User(email='test@email.com').set_password('test').save()

    def tearDown(self):
        User.objects.delete()

    def test_signup(self):
        data = {
            'email': 'newtest@email.com',
            'password': 'test'
        }
        result = self.client.post('/signup/', data=data)
        try:
            User.objects.get(email='newtest@email.com')
        except User.DoesNotExist:
            self.fail('User does not exist')
        self.assertEqual(result.status_code, 302)

    def test_signup_with_same_slug(self):
        data = {
            'email': 'newtest@email.com',
            'password': 'test'
        }
        self.client.post('/signup/', data=data)
        # Sign up a new user with same slug for neomad
        data = {
            'email': 'newtest@test.com',
            'password': 'test'
        }
        result = self.client.post('/signup/', data=data)
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
        result = self.client.post('/signup/', data=data)
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
        result = self.client.post('/signup/', data=data)
        try:
            User.objects.get(username='newtest3')
        except User.DoesNotExist:
            self.fail('User does not exist')
        self.assertEqual(result.status_code, 302)

    def test_login_get(self):
        result = self.client.get('/login/')
        self.assertEqual(result.status_code, 200)

    def test_login_post(self):
        data = {
            'email': 'test@email.com',
            'password': 'test',
        }
        result = self.client.post('/login/', data=data)
        self.assertEqual(result.status_code, 302)

    def test_wrong_login_post(self):
        data = {
            'email': 'wrong@email.com',
            'password': 'test',
        }
        result = self.client.post('/login/', data=data)
        self.assertEqual(result.status_code, 401)

    def test_logout(self):
        result = self.client.get('/logout/')
        self.assertEqual(result.status_code, 200)
