from urllib.parse import urlparse, parse_qs
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


def url_for_trips(user):
    return url_for('trips', user=user.slug).replace('%40', '@')


def _replace_embed(match):
    url = match.group().replace('embed:', '')
    youtube_id = extract_youtube_id(url)
    return f'''<iframe width=100% height=auto
        src=https://www.youtube-nocookie.com/embed/{youtube_id}
        frameborder=0 allow="autoplay; encrypted-media" allowfullscreen>
        </iframe>'''.replace('\n', ' ')


@app.template_filter()
def embed(text):
    '''
    Replace and "embed:http…" by the embeded corresponding media.
    '''
    regex = re.compile('embed:(https?://[\w\./\?=]+)')
    return regex.sub(_replace_embed, text)


@app.context_processor
def utility_processor():
    return dict(
        url_for_user=url_for_user,
        url_for_article=url_for_article,
        url_for_trips=url_for_trips,
        is_debug=app.debug,
    )


def extract_youtube_id(url):
    if url.startswith(('youtu', 'www')):
        url = 'http://' + url

    query = urlparse(url)

    if 'youtube' in query.hostname:
        if query.path == '/watch':
            return parse_qs(query.query)['v'][0]
        elif query.path.startswith(('/embed/', '/v/')):
            return query.path.split('/')[2]
    elif 'youtu.be' in query.hostname:
        return query.path[1:]
