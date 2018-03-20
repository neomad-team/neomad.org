import os
import datetime

from unittest import TestCase

from user.models import User
from .models import Article
from core import app
from blog import views
from user import views
from auth import views
from around import views
from trips import views

now = datetime.datetime.utcnow()


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
                content='<p>content</p>',
                publication_date=datetime.datetime.utcnow(),
                author=self.user).save()
        result = self.client.get('/articles/')
        self.assertIn(b'A title for article', result.data)

    def test_read_article_unauthenticated(self):
        article = Article(title='<h1>title</h1>', content='<p>content</p>')
        article.author = self.user
        article.save()
        result = self.client.get('/@emailtest/{}-{}/'.format(article.slug,
                                                            str(article.id)))
        self.assertEqual(result.status_code, 301)

    def test_read_article_authenticated(self):
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        self.client.post('/login/', data=data, follow_redirects=True)
        article = Article(title='title', content='<p>content</p>')
        article.author = self.user
        article.save()
        result = self.client.get('/@emailtest/{}-{}/'.format(article.slug,
                                                             str(article.id)),
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
        data = {'title': 'title', 'content': '<p>content</p>'}
        result = self.client.post('/article/write/', data=data)
        article = Article.objects.first()
        self.assertEqual(article.title, 'title')
        self.assertEqual(article.content, '<p>content</p>')
        self.assertEqual(result.status_code, 201)

    def test_edit_article(self):
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        self.client.post('/login/', data=data, follow_redirects=True)
        data = {'title': 'title', 'content': 'content'}
        self.client.post('/article/write/', data=data)
        article = Article.objects.first()
        data = {'title': '<p>title<br></p>', 'content': 'another content'}
        result = self.client.post('/article/{}/edit/'.format(str(article.id)),
                                  data=data)
        article = Article.objects.first()
        self.assertEqual(article.content, '<p>another content</p>')
        self.assertEqual(result.status_code, 302)

    def test_edit_article_with_empty_data(self):
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        self.client.post('/login/', data=data, follow_redirects=True)
        data = {'title': 'title', 'content': 'content'}
        self.client.post('/article/write/', data=data)
        article = Article.objects.first()
        data = {'title': '', 'content': ''}
        result = self.client.post('/article/{}/edit/'.format(str(article.id)),
                                  data=data)
        self.assertEqual(result.status_code, 400)

    def test_delete_an_article(self):
        data = {
            'email': 'emailtest@test.com',
            'password': 'testtest',
        }
        self.client.post('/login/', data=data, follow_redirects=True)
        data = {'title': 'title', 'content': 'content'}
        self.client.post('/article/write/', data=data)
        article = Article.objects.first()
        result = self.client.get('/article/{}/delete/'.format(str(article.id)))
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

    def test_article_appear_by_default_in_articles(self):
        Article(title='A title for an article', content='<p>content</p>',
                publication_date=datetime.datetime.utcnow(),
                author=self.user).save()
        result = self.client.get('/articles/')
        self.assertIn(b'A title for an article', result.data)

    def test_unpublished_article_does_not_appear_in_articles(self):
        Article(title='title', content='<p>content</p>',
                publication_date=None,
                author=self.user).save()
        result = self.client.get('/articles/')
        self.assertNotIn(b'<article class=preview>', result.data)

    def test_article_replace_embedded_video(self):
        article = Article(title='title', content='View my latest videos: '
                'https://www.youtube.com/watch?v=Fa4cRMaTDUI \n'
                'and https://youtu.be/yOuTuBeCoDe now!',
                publication_date=now,
                author=self.user).save()
        response = self.client.get(f'/@{self.user.slug}/{article.slug}-'
                                   f'{article.id}/')
        self.assertIn(
            b'src=https://www.youtube-nocookie.com/embed/Fa4cRMaTDUI',
            response.get_data()
        )
        self.assertIn(
            b'src=https://www.youtube-nocookie.com/embed/yOuTuBeCoDe',
            response.get_data()
        )
