import os
import datetime

from unittest import TestCase

from user.models import User
from .models import Article
from core import app


class ArticleTest(TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.user = (User(email='emailtest@test.com', username='tester')
                     .set_password('testtest').save())

    def tearDown(self):
        User.objects.delete()
        Article.objects.delete()

    def test_articles_empty(self):
        result = self.client.get('/articles/')
        self.assertEqual(result.status_code, 200)

    def test_articles_with_an_article(self):
        Article(title='A title for article',
                content='content',
                publication_date=datetime.datetime.utcnow(),
                author=self.user).save()
        result = self.client.get('/articles/')
        self.assertIn(b'A title for article', result.data)

    def test_read_article_unauthenticated(self):
        article = Article(
            title='title',
            content='content',
            id='59db8b19e03799002216d2b9')
        article.author = self.user
        article.save()
        result = self.client.get(
            '/@emailtest/{}-{}/'.format(article.slug, str(article.id)))
        self.assertEqual(result.status_code, 301)

    def test_read_article_authenticated(self):
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        self.client.post('/login/', data=data, follow_redirects=True)
        article = Article(title='title', content='content')
        article.author = self.user
        article.save()
        result = self.client.get(
            '/@emailtest/{}-{}/'.format(article.slug, str(article.id)),
            follow_redirects=True)
        self.assertEqual(result.status_code, 200)

    def test_article_write_get(self):
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        self.client.post('/login/', data=data, follow_redirects=True)
        result = self.client.get('/article/write/')
        self.assertEqual(result.status_code, 200)

    def test_article_write_post_empty_field(self):
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        self.client.post('/login/', data=data, follow_redirects=True)
        data = {'title': '', 'content': ''}
        self.client.post('/login/', data=data, follow_redirects=True)
        result = self.client.post('/article/write/', data=data)
        self.assertEqual(result.status_code, 400)

    def test_article_write_post(self):
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        self.client.post('/login/', data=data, follow_redirects=True)
        article = Article(title='', content='')
        data = {'title': 'title', 'content': 'content'}
        result = self.client.post('/article/write/', data=data)
        self.assertEqual(article.title, 'title')
        self.assertEqual(article.content, 'content')
        self.assertEqual(result.status_code, 201)

    def test_edit_article(self):
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        article = Article(
            title='title',
            content='content',
            id='59db8b19e03799002216d2b9')
        self.client.post('/login/', data=data, follow_redirects=True)
        data = {'title': 'another title', 'content': 'another content'}
        self.client.post('/article/write/', data=data)
        result = self.client.post('/article/{}/edit/'.format(str(article.id)),
                                  data=data)
        self.assertEqual(article.title, 'another title')
        self.assertEqual(article.content, 'another content')
        self.assertEqual(result.status_code, 302)

    def test_edit_article_with_empty_data(self):
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        article = Article(
            title='',
            content='',
            id='59db8b19e03799002216d2b9')
        self.client.post('/login/', data=data, follow_redirects=True)
        data = {'title': 'title', 'content': 'content'}
        self.client.post('/article/write/', data=data)
        data = {'title': '', 'content': ''}
        result = self.client.post('/article/{}/edit/'.format(str(article.id)),
                                  data=data)
        self.assertEqual(result.status_code, 400)

    def test_delete_an_article(self):
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        article = Article(
            title='title',
            content='content',
            id='59db8b19e03799002216d2b9')
        self.client.post('/login/', data=data, follow_redirects=True)
        data = {'title': 'title', 'content': 'content'}
        self.client.post('/article/write/', data=data)
        result = self.client.get('/article/{}/delete/'.format(str(article.id)))
        self.assertEqual(Article.objects.count(), 0)
        self.assertEqual(result.status_code, 302)

    def test_title_clean_html(self):
        article = Article(title='<p>title<br></p>',
                          content='content').save()
        self.assertEqual(article.title, 'title')

    def test_content_cleaned_html(self):
        article = Article(title='', content='content').save()
        self.assertEqual(article.content, 'content')
        article = Article(title='',
                          content='<p style="font: Arial">content</p>').save()
        self.assertEqual(article.content, 'content')
        article = Article(title='',
                          content='<p><img src="/static/img"></p>').save()
        self.assertEqual(article.content, '<p><img src="/static/img"/></p>')
        article = Article(title='',
                          content='<p><i>also emphased</i></p>').save()
        self.assertEqual(article.content, '<p><em>emphased content</em></p>')

    def test_delete_article_and_folders_pictures(self):
        article = Article(title='<h1>title</h1>',
                          content='content').save()
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

    def test_article_appear_by_default_in_articles(self):
        Article(title='A title for an article', content='content',
                publication_date=datetime.datetime.utcnow(),
                author=self.user).save()
        result = self.client.get('/articles/')
        self.assertIn(b'A title for an article', result.data)

    def test_unpublished_article_does_not_appear_in_articles(self):
        Article(title='title', content='content',
                publication_date=None,
                author=self.user).save()
        result = self.client.get('/articles/')
        self.assertNotIn(b'<article class=preview>', result.data)
