import datetime
import hashlib
import os
import shutil

from flask import Markup
from bs4 import BeautifulSoup
from langdetect import detect

from core import db, app
from core.helpers import slugify
from core.utils import (
    is_base64, save_base64_image, clean_html as base_clean_html
)
from user.models import User

ALLOWED_TAGS = {
        'a': ('href', 'name', 'target', 'title'), 'img': ('src', 'title'),
        'h2': ('id'), 'h3': ('id'), 'strong': (), 'em': (), 'i': (), 'b': (),
         'p': (), 'br': (), 'blockquote': (),
}


def clean_html(html, *args, **kwargs):
    html = base_clean_html(html, *args, **kwargs)
    parser = BeautifulSoup(html, 'html.parser')
    for i in parser.find_all('i'):
        i.name = 'em'
    for b in parser.find_all('b'):
        b.name = 'strong'
    return str(parser)


class Article(db.Document):
    title = db.StringField(required=True)
    content = db.StringField(required=True)
    creation_date = db.DateTimeField(default=datetime.datetime.utcnow)
    slug = db.StringField(required=True, default='no-title')
    author = db.ReferenceField(User)
    language = db.StringField(min_length=2, max_length=2, default='en')
    images = db.ListField()

    def __str__(self):
        return str(self.title)

    def extract_images(self):
        """
        Extract images from the content, resize and save them locally if they
        are base64 encoded.
        Saves the list of images into the images list property.
        """
        html = BeautifulSoup(self.content, 'html.parser')
        images = []
        try:
            os.makedirs(self.get_images_path())
        except FileExistsError:
            pass
        for img in html.find_all('img'):
            data = img.get('src')
            if is_base64(data):
                m = hashlib.md5()
                m.update(data.encode('utf-8'))
                img_name = m.hexdigest()
                img_path = '{}/{}'.format(self.get_images_path(), img_name)
                img_url = '{}/{}'.format(self.get_images_url(), img_name)
                save_base64_image(data, img_path, (1000, 800))
                img['src'] = img_url
                images.append(img_url)
            else:
                images.append(data)
        for outdated_image in set(self.images) - set(images):
            os.remove(os.path.join(self.get_images_path(),
                                   os.path.basename(outdated_image)))
        self.images = images

    def get_images_path(self):
        return '{}/{}'.format(app.config['ARTICLE_IMG_PATH'], self.id)

    def get_images_url(self):
        return '{}/{}'.format(app.config['ARTICLE_IMG_URL'], self.id)

    @property
    def image(self):
        if len(self.images):
            return self.images[0]

    def delete(self, *args, **kwargs):
        parent = super(Article, self).delete(*args, **kwargs)
        path = self.get_images_path()
        shutil.rmtree(path)
        return parent

    def save(self, *args, **kwargs):
        if not self.creation_date:
            self.creation_date = datetime.datetime.utcnow()
        self.slug = slugify(self.title)
        is_new = not self.id
        # when new, the id must exist before extracting images
        if is_new:
            super(Article, self).save(*args, **kwargs)
        self.extract_images()
        self.title = Markup(self.title).striptags()
        self.content = clean_html(self.content, ALLOWED_TAGS)
        self.language = detect(self.content)
        return super(Article, self).save(*args, **kwargs)

    meta = {
        'ordering': ['-creation_date']
    }
