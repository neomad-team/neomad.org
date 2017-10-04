from core import app
from core import helpers  # noqa: F401, F801
from core import views  # noqa: F401, F801
from user import views  # noqa: F401, F801
from auth import views  # noqa: F401, F801
from blog import views  # noqa: F401, F801
from trips import views  # noqa: F401, F801
from around import views  # noqa: F401, F801
from api import views  # noqa: F401, F801
if app.config['DEBUG']:
    from core.debug import *

# wsgi
application = app

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], host=app.config.get('HOST'),
            port=app.config.get('PORT'))
