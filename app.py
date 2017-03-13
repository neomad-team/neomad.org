import os

from core import app
from auth import *
from core.helpers import *
if app.config['DEBUG']:
    from core.debug import *

# wsgi
application = app

if __name__ == '__main__':
    app.run(debug=app.config.get('DEBUG'), port=app.config.get('PORT'))
