import re
import json

from flask import request, render_template

from core import app
from user.models import User
from blog.models import Article


@app.route('/search')
def search():
    regex = re.compile('.*{}.*'.format(request.args.get('q')))
    users = User.objects(slug=regex)[:10]
    articles = Article.objects(content=regex)[:10]
    return render_template('search/list.html', users=users,
                           articles=articles)
