import datetime
import re
import unicodedata

from . import app


@app.template_filter()
def filter_datetime(date, fmt=None):
    dt = datetime.datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%f')
    return dt.strftime('%d-%m-%Y')


@app.template_filter()
def slugify(value):
    value = (unicodedata.normalize('NFKD', value).encode('ascii', 'ignore')
             .decode('ascii'))
    value = re.sub('[^\w\s-]', '', value).strip().lower()
    return re.sub('[-\s]+', '-', value)


@app.template_filter()
def boolean(value):
    return str(bool(value)).lower()
