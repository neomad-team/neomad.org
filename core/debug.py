from . import app


try:
    from flask_debugtoolbar import DebugToolbarExtension
    DebugToolbarExtension(app)
except:
    pass
