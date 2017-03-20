import datetime
import re
import unicodedata

from flask import url_for

from . import app


@app.template_filter('datetime')
def filter_datetime(date, fmt=None):
    return date.strftime('%d-%m-%Y')


@app.template_filter()
def slugify(value):
    value = (unicodedata.normalize('NFKD', value).encode('ascii', 'ignore')
             .decode('ascii'))
    value = re.sub('[^\w\s-]', '', value).strip().lower()
    return re.sub('[-\s]+', '-', value)


@app.template_filter()
def boolean(value):
    return str(bool(value)).lower()


@app.context_processor
def utility_processor():
    def url_for_user(user):
        return url_for('profile', username=user.slug).replace('%40', '@')
    return dict(url_for_user=url_for_user)
