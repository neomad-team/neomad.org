import os

from flask import Flask, render_template

from . import mongoengine as db


PROJECT_PATH = os.path.abspath(os.path.dirname(__file__) + '/..')
os.environ.setdefault('SETTINGS', PROJECT_PATH + '/settings.py')

app = Flask('neomad')
app.config.from_envvar('SETTINGS')

db.connect(**app.config['DATABASE'])
