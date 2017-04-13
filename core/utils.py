import base64
import re
from io import BytesIO

from feincms_cleanse import Cleanse
from PIL import Image


def is_base64(data):
    return len(re.findall('^data:\w+/(\w+);base64,', data))

def save_base64_image(data, output, size=None):
    meta, data = data.split(',')
    try:
        format_ = re.findall('data:\w+/(\w+);base64', meta)[0]
    except KeyError:
        format_ = 'jpeg'
    image_data = BytesIO(base64.b64decode(data))
    image = Image.open(image_data)
    if size:
        image.thumbnail(size)
    return image.save(output, format=format_)


def clean_html(html, allowed_tags=None):
    cleaner = Cleanse()
    if allowed_tags:
        cleaner.allowed_tags = allowed_tags
    cleaner.empty_tags = ('br', 'img',)
    return cleaner.cleanse(html)
