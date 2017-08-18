import os
import sys
from flask import Flask

from . import mongoengine as db


settings_file = 'settings.py'
if 'unittest' in sys.argv[0]:
    settings_file = 'settings.test.py'

PROJECT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('SETTINGS', os.path.join(PROJECT_PATH, settings_file))

app = Flask('neomad')
app.config.from_envvar('SETTINGS')

db.connect(**app.config['DATABASE'])
