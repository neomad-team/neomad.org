import json

from core import app
from core.test import BaseTest
from blog import views
from user.models import User
from blog.models import Article



class UserTest(BaseTest):
    def test_user_page_that_does_not_exist(self):
        result = self.client.get('/@doesnotexist/')
        self.assertEqual(result.status_code, 404)

    def test_privacy_page_unauthorized(self):
        result = self.client.get('/privacy/')
        self.assertEqual(result.status_code, 401)

    def test_privacy_page_access(self):
        self.login_user()
        result = self.client.get('/privacy/')
        self.assertEqual(result.status_code, 200)

    def test_delete_trip(self):
        self.login_user()
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
