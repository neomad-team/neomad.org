from unittest import TestCase

from core import app
from user.models import User

from blog import views  # noqa: F401
from user import views  # noqa: F401, F811
from around import views  # noqa: F401, F811
from . import views  # noqa: F401, F811


class AuthTest(TestCase):
    def setUp(self):
        self.data = {'email': 'test@email.com', 'password': 'test'}
        self.client = app.test_client()
        self.user = (User(email=self.data['email'], username='tester')
                     .set_password(self.data['password']).save())

    def tearDown(self):
        User.objects.delete()

    def test_signup(self):
        data = {'email': 'new@neomad.org', 'username': 'newuser',
                'password': 'pass'}
        result = self.client.post('/signup/', data=data)
        try:
            User.objects.get(email=self.data['email'])
        except User.DoesNotExist:
            self.fail('User does not exist')
        self.assertEqual(result.status_code, 302)

    def test_signup_with_same_slug(self):
        data = self.data.copy()
        data['email'] = 'test2@otheremail.com'
        data['username'] = 'tester'
        result = self.client.post('/signup/', data=data)
        self.assertEqual(result.status_code, 302)

    def test_signup_with_same_email(self):
        data = self.data.copy()
        data['username'] = 'tester-new'
        result = self.client.post('/signup/', data=data)
        self.assertEqual(result.status_code, 400)
        self.assertIn('This email already exists', result.get_data().decode())

    def test_login_get(self):
        result = self.client.get('/login/')
        self.assertEqual(result.status_code, 200)

    def test_login_post(self):
        result = self.client.post('/login/', data=self.data)
        self.assertEqual(result.status_code, 302)

    def test_create_account_with_duplicate_email(self):
        result = self.client.post('/login/', data=self.data)
        self.assertEqual(result.status_code, 302)

    def test_wrong_login_post(self):
        data = {'email': 'wrong@email.com', 'password': 'test'}
        result = self.client.post('/login/', data=data)
        self.assertEqual(result.status_code, 401)

    def test_logout(self):
        result = self.client.get('/logout/')
        self.assertEqual(result.status_code, 200)
