import os
from unittest import TestCase

from .models import Article
from core import app
from blog import views
from user.models import User
from user import views
from auth import views
from around import views
from trips import views


class ArticleTest(TestCase):
    def setUp(self):
        self.client = app.test_client()

    def tearDown(self):
        User.objects.delete()
        Article.objects.delete()

    @staticmethod
    def create_user():
        user = User(email='emailtest@test.com',
                    username='emailtest').set_password('testtest').save()
        return user

    def login_user(self):
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        self.client.post('/login', data=data, follow_redirects=True)

    def test_articles_empty(self):
        result = self.client.get('/articles')
        self.assertEqual(result.status_code, 200)

    def test_articles_with_an_article(self):
        article = Article(title='<h1>title</h1>', content='<p>content</p>')
        user = self.create_user()
        article.author = user
        article.save()
        result = self.client.get('/articles')
        self.assertIn(b'<article class=preview>', result.data)

    def test_read_article_unauthenticated(self):
        article = Article(title='title',
                          content='<p>content</p>',
                          author=self.create_user()).save()
        result = self.client.get('/@emailtest/{}-{}'.format(article.slug,
                                                            str(article.id)))
        self.assertEqual(result.status_code, 200)

    def test_read_article_authenticated(self):
        user = self.create_user()
        self.login_user()
        article = Article(title='title',
                          content='<p>content</p>',
                          author=user).save()
        result = self.client.get('/@emailtest/{}-{}'.format(article.slug,
                                                            str(article.id)))
        self.assertEqual(result.status_code, 200)

    def test_article_write_get(self):
        self.create_user()
        self.login_user()
        result = self.client.get('/article/write')
        self.assertEqual(result.status_code, 200)

    def test_article_write_post_empty_field(self):
        self.create_user()
        self.login_user()
        data = {'title': '', 'content': ''}
        result = self.client.post('/article/write', data=data)
        self.assertEqual(result.status_code, 400)

    def test_article_write_post(self):
        self.create_user()
        self.login_user()
        data = {'title': 'title', 'content': '<p>content</p>'}
        result = self.client.post('/article/write', data=data)
        article = Article.objects.first()
        self.assertEqual(article.title, 'title')
        self.assertEqual(article.content, '<p>content</p>')
        self.assertEqual(result.status_code, 201)

    def test_edit_article(self):
        self.create_user()
        self.login_user()
        data = {'title': 'title', 'content': 'content'}
        self.client.post('/article/write', data=data)
        article = Article.objects.first()
        data = {'title': '<p>title<br></p>', 'content': 'another content'}
        result = self.client.post('/article/{}/edit'.format(str(article.id)),
                                  data=data)
        article = Article.objects.first()
        self.assertEqual(article.content, '<p>another content</p>')
        self.assertEqual(result.status_code, 302)

    def test_edit_article_with_empty_data(self):
        self.create_user()
        self.login_user()
        data = {'title': 'title', 'content': 'content'}
        self.client.post('/article/write', data=data)
        article = Article.objects.first()
        data = {'title': '', 'content': ''}
        result = self.client.post('/article/{}/edit'.format(str(article.id)),
                                  data=data)
        self.assertEqual(result.status_code, 400)

    def test_delete_an_article(self):
        self.create_user()
        self.login_user()
        data = {'title': 'title', 'content': 'content'}
        self.client.post('/article/write', data=data)
        article = Article.objects.first()
        result = self.client.get('/article/{}/delete'.format(str(article.id)))
        self.assertEqual(Article.objects.count(), 0)
        self.assertEqual(result.status_code, 302)

    def test_title_clean_html(self):
        article = Article(title='<p>title<br></p>',
                          content='<p>content</p>').save()
        self.assertEqual(article.title, 'title')

    def test_content_cleaned_html(self):
        article = Article(title='', content='<p>content</p>').save()
        self.assertEqual(article.content, '<p>content</p>')
        article = Article(title='',
                          content='<p style="font: Arial">content</p>').save()
        self.assertEqual(article.content, '<p>content</p>')
        article = Article(title='',
                          content='<p><img src="/static/img"></p>').save()
        self.assertEqual(article.content, '<p><img src="/static/img"/></p>')
        article = Article(title='',
                          content='<p><em>emphased content</em><i>also emphased</i></p>').save()
        self.assertEqual(article.content, '<p><em>emphased content</em><em>also emphased</em></p>')

    def test_delete_article_and_folders_pictures(self):
        article = Article(title='<h1>title</h1>',
                          content='<p>content</p>').save()
        self.assertTrue(os.path.isdir(article.get_images_path()))
        Article.objects.get(id=article.id).delete()
        self.assertFalse(os.path.isdir(article.get_images_path()))

    def test_language_detection(self):
        article = Article(title='Un titre en français',
                          content='<p>Voici le contenu de l\'article qui est '
                                  'lui aussi en français</p>').save()
        self.assertEqual(article.language, 'fr')

        article = Article(title='A title in English',
                          content='<p>The content of the article is in '
                                  'English</p>').save()
        self.assertTrue(article.language, 'en')
