# Neomad website

## Installation

Choose between a manual installation (best for dev) or a _docker_ installation
(easy for testing or deploying).

In both case, create an _uploads_ folder:

    mkdir -p static/uploads/avatars
    chmod -R 777 static/uploads

and as settings.py file:

    cp settings.example.py settings.py


### Manual server installation

Manual installation of the server is ideal for development.

Requires:

- Python3.5 or above
- [MongoDB](http://mongodb.com/) 3.4 or above,  or [Docker-compose](https://docs.docker.com/compose/)


To install the project, run the following:

    python3.5 -m venv ./venv
    source ./venv/bin/activate
    pip install -r requirements.txt

If don't have a MongoDB running you can seamlessly run one with
`docker-compose up -d db`.

You should now be able to run your server with `python app.py`.
Open your browser at http://localhost:5000


### Full Docker Installation

You can run both the database and the server with Docker.
In which case you don't need to do any of the steps above; you won't need
anything like Python nor a virtualenv.

In the _settings.py_ file, set the `DATABASE = {…, 'host': 'db', …}` to
connect the server to the database (`'db'` is the actual name you want as
_host_, it is the name of the docker _link_).

Then run `docker-compose up` and open your browser at http://localhost:5000.

> You can access your python server machine with
> `docker-compose exec -it web` (you may need it to create a user for example).
>
> The sources in your docker server are in the _/app_ folder (`cd /app`).


## Configuring

In the previous commands you created a file called _settings.py_ at the root of
the project.
Tune your settings there.


## Extra commands

### Creating a user

Users must currently be created by hand.
To do so, open a python shell with the _virtualenv_ activated:

    source ./venv/bin/activate
    python3  # or python, or python3.5

then in the _python_ shell, run the following:

    from user.models import User
    User(username='johndoe', email='my@email.com').set_password('mypass').save()

You can now log on http://localhost/5000/login with "_my@email.com_" email
and "_mypass_" as password.
