from unittest import TestCase

from .models import Article


class ArticleTest(TestCase):
    def test_title_clean_html(self):
        article = Article(title='<h1>title<br></h1>', content='').save()
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
