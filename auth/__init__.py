from flask_login import LoginManager

from core import app
from user.models import User

from . import views


login_manager = LoginManager(app)


@login_manager.user_loader
def load_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None
