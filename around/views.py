from flask import render_template

from core import app


@app.route('/around/')
def around():
    return render_template('around/map.html')
