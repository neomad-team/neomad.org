DEBUG = True

# MongoDB connection settings
DATABASE = {
  'db': 'neomad',
  'username': 'root',
  'password': '',
  'port': 27017,
  #'host': 'mongodb://admin:qwerty@localhost/production',
}

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

SECRET_KEY = 'mysecretkey'
