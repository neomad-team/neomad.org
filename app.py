import os

from core import app
from auth import *
from core.helpers import *
from blog import *
from trips import *
if app.config['DEBUG']:
    from core.debug import *

# wsgi
application = app

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], host=app.config.get('HOST'),
            port=app.config.get('PORT'))
