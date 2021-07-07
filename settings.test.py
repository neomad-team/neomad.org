import os

DEBUG = True
HOST = '0.0.0.0'
PORT = 5000

# MongoDB connection settings
DATABASE = {
  'db': 'neomad_test',
  'username': 'root',
  'host': 'localhost',
  'password': '',
  'port': int(os.environ.get('DB_PORT', 27017))
}

PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))
UPLOAD_PATH = '{}/static/uploads'.format(PROJECT_PATH)
AVATARS_PATH = '{}/avatars'.format(UPLOAD_PATH)
AVATARS_URL = '/static/uploads/avatars'
ARTICLE_IMG_PATH = '{}/articles'.format(UPLOAD_PATH)
ARTICLE_IMG_URL = '/static/uploads/articles'

DEBUG_TB_ENABLED = DEBUG

DEBUG_TB_PANELS = (
    'flask_debugtoolbar.panels.versions.VersionDebugPanel',
    'flask_debugtoolbar.panels.timer.TimerDebugPanel',
    'flask_debugtoolbar.panels.headers.HeaderDebugPanel',
    'flask_debugtoolbar.panels.request_vars.RequestVarsDebugPanel',
    'flask_debugtoolbar.panels.template.TemplateDebugPanel',
    'flask_debugtoolbar.panels.logger.LoggingPanel',
    'flask_debugtoolbar.panels.route_list.RouteListDebugPanel',
    'flask_mongoengine.panels.MongoDebugPanel',
)

DEBUG_TB_INTERCEPT_REDIRECTS = False

SECRET_KEY = 'mysecretkey'
