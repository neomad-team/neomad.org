import json
from unittest import TestCase

from search import views
from user.models import User
from core import app
from blog.models import Article

class SearchTest(TestCase):
    def setUp(self):
        self.client = app.test_client()

    def tearDown(self):
        User.objects.delete()
        Article.objects.delete()

    def test_search_retrieve_several_user(self):
        User(email='doejohn@test.com',
             username='doejohn').set_password('search').save()
        User(email='johndoe@test.com',
             username='johndoe').set_password('search').save()
        response = self.client.get('/search?q=john')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'doejohn', response.get_data())
        self.assertIn(b'johndoe', response.get_data())

    def test_search_retrieve_several_article(self):
        user = User(email='john@test.com',
                    username='john').set_password('search').save()
        article = Article(title='<h1>My fries are cold<br></h1>',
                          content='Why my french fries are cold?')
        article.author = user
        article.save()
        article = Article(title='<h1>I like fries<br></h1>',
                          content='I like fries')
        article.author = user
        article.save()
        response = self.client.get('/search?q=fries')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'My Fries Are Cold', response.get_data())
        self.assertIn(b'I Like Fries', response.get_data())

    def test_search_retrieve_article_and_user(self):
        user = User(email='fries@test.com',
                    username='friesuser').set_password('search').save()
        article = Article(title='<h1>My fries are cold<br></h1>',
                          content='Why my french fries are cold ?')
        article.author = user
        article.save()
        response = self.client.get('/search?q=fries')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'My Fries Are Cold', response.get_data())
        self.assertIn(b'friesuser', response.get_data())

    def test_search_empty(self):
        response = self.client.get('/search?q=noresults')
        self.assertEqual(response.status_code, 200)
        # "noresults" appear once in the data (url)
        self.assertEqual(response.get_data().count(b'noresults'), 1)

    def test_search_maximum_10_articles(self):
        # Check that /search retrieve 10 articles among 11 articles created
        user = User(email='john@test.com',
                    username='john').set_password('search').save()
        for i in range(0, 11):
            article = Article(title='<h1>Title</h1>',
                              content='My fries are cold')
            article.author = user
            article.save()
        response = self.client.get('/search?q=fries')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_data().count(b'My fries are cold'), 10)

    def test_search_maximum_10_users(self):
        # Check that /search retrieve 10 users among 11 users created
        for i in range(0, 11):
            User(email='fries{}@test.com'.format(i),
                 username='friesuser{}'.format(i)).set_password(
                        'search').save()
        response = self.client.get('/search?q=fries')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.get_data().count(b'<h2 name=username>friesuser'), 10)

    def test_search_maximum_10_users_and_articles(self):
        # Check that /search retrieve 10 users and 10
        # articles among 11 users and articles created
        user = User(email='john@test.com',
                    username='john').set_password('search').save()
        for i in range(0, 11):
            User(email='fries{}@test.com'.format(i),
                 username='friesuser{}'.format(i)).set_password(
                        'search').save()
            Article(title='<h1>Title</h1>',
                    content='My fries are cold',
                    author=user).save()
        response = self.client.get('/search?q=fries')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.get_data().count(b'<h2 name=username>friesuser'), 10)
        self.assertEqual(response.get_data().count(b'My fries are cold'), 10)
