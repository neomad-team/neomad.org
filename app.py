import os

from core import app
from core.helpers import *
from core.views import *
from user.views import *
from auth.views import *
from blog.views import *
from trips.views import *
if app.config['DEBUG']:
    from core.debug import *

# wsgi
application = app

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], host=app.config.get('HOST'),
            port=app.config.get('PORT'))
