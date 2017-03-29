import datetime
import re
import unicodedata

from flask import url_for
from jinja2.filters import do_mark_safe

from . import app


@app.template_filter('datetime')
def filter_datetime(date, fmt=None):
    return date.strftime('%d-%m-%Y')


@app.template_filter()
def slugify(value):
    value = (unicodedata.normalize('NFKD', str(value)).encode('ascii', 'ignore')
             .decode('ascii'))
    value = re.sub('[^\w\s-]', '', value).strip().lower()
    return re.sub('[-\s]+', '-', value)


@app.template_filter()
def boolean(value):
    return str(bool(value)).lower()


@app.template_filter()
def htmlnewline(value):
    if not value:
        return ''
    return do_mark_safe(value.replace('\n', '<br>'))


def url_for_user(user):
    return url_for('profile', username=user.slug).replace('%40', '@')


def url_for_article(article):
    return url_for('article', author=article.author.slug, slug=article.slug,
                   id=article.id).replace('%40', '@')


@app.context_processor
def utility_processor():
    return dict(
        url_for_user=url_for_user,
        url_for_article=url_for_article,
        url_for_trips=url_for_trips,
        is_debug=app.debug,
    )
