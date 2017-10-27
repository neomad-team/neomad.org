import json

from unittest import TestCase

from core import app
from user.models import User
from blog.models import Article

from blog import views  # noqa: F401
from trips import views  # noqa: F401, F811
from user import views  # noqa: F401, F811
from auth import views  # noqa: F401, F811
from around import views  # noqa: F401, F811


def login_user(self):
    data = {
        'email': 'emailtest@test.com',
        'password': 'testtest',
    }
    self.client.post('/login/', data=data, follow_redirects=True)


class UserTest(TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.user = (User(email='emailtest@test.com', allow_community=True)
                     .set_password('testtest').save())
        self.lat_lng = [3.5, 42.0]

    def tearDown(self):
        User.drop_collection()
        Article.drop_collection()

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
        self.assertEqual(user.locations.count(), 1)
        url = '/privacy/{}/delete/'.format(user.locations[0].date.timestamp())
        result = self.client.post(url, content_type='application/json')
        self.assertEqual(result.status_code, 204)
        user = User.objects.first()  # DB was updated.
        self.assertEqual(user.locations.count(), 0)

    def test_unpublished_articles_does_not_appears_if_the_author_not_logged(
            self):
        Article(title='Article that must not appear',
                content='<p>content</p>', author=self.user,
                publication_date=None).save()
        result = self.client.get('/@emailtest/')
        self.assertNotIn(b'Article That Must Not Appear', result.data)
        self.assertEqual(result.status_code, 200)

    def test_unpublished_articles_does_appears_if_the_author_is_logged(self):
        login_user(self)
        Article(title='Article that must appear',
                content='<p>content</p>', author=self.user).save()
        result = self.client.get('/@emailtest/')
        self.assertIn(b'Article That Must Appear', result.data)
        self.assertEqual(result.status_code, 200)
