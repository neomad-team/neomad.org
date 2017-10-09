from unittest import TestCase

from core import app
from user.models import User
from blog.models import Article
from .utils import clean_html


class BaseTest(TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.user = self.create_user()

    def tearDown(self):
        User.objects.delete()
        Article.objects.delete()

    def login_user(self):
        data = {
            'email': self.user.email,
            'password': 'testtest',
        }
        self.client.post('/login/', data=data)

    def create_user(self):
        return User(email='emailtest@test.com',
                    username='emailtest',
                    allow_localization=True).set_password('testtest').save()


class UtilsTest(TestCase):
    def test_clean_html_default(self):
        self.assertEqual(clean_html('<p>content</p>'), '<p>content</p>')
        self.assertEqual(clean_html('<style>h1{}</style>'), '')
        self.assertEqual(clean_html('<script>alert()</script>'), '')
        self.assertEqual(clean_html('<<script>script> alert() </</script>script>'), '<p>&lt;script&gt;</p>')
        self.assertEqual(clean_html('<h1 class="bigger">title</h1>'), '<p>title</p>')
        self.assertEqual(clean_html('<h2 class="bigger">title</h2>'), '<h2>title</h2>')
        self.assertEqual(clean_html('<p>&nbsp;&nbsp;</p>'), '')

    def test_clean_html_custom(self):
        allowed_tags = {'a': ('href'), 'h3': (), 'img': ('src'),}
        self.assertEqual(clean_html('<p>content</p>', allowed_tags), '<p>content</p>')
        self.assertEqual(clean_html('<h2 class="bigger">title</h2>', allowed_tags), '<p>title</p>')
        self.assertEqual(clean_html('<h3 class="bigger">title</h3>', allowed_tags), '<h3>title</h3>')
        self.assertEqual(clean_html('<img src="/myimage.jpg">', allowed_tags), '<img src="/myimage.jpg"/>')
