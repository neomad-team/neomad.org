# Neomad website

## Installation

> You may want to install a full-dockerized version.
> In which case you don't need Python or any of the following steps and you may
> go the the dedicated _Full Docker Installation_ section below.


### Non-docker server installation

Manual installation of the server is ideal for developement.

The project requires your OS to have the following working:

- Python3.5 or above
- [MongoDB](http://mongodb.com/) 3.4 or above,  or [Docker-compose](https://docs.docker.com/compose/)


To install the project, run the following:

    python3.5 -m venv ./venv
    source ./venv/bin/activate
    pip install -r requirements.txt
    cp settings.example.py settings.py


### Full Docker Installation

You can install the database and the server with Docker.
In which case you don't need to do any of the steps above, you won't need Python
nor a virtualenv.

Just add the server setup to your Docker Compose:

    cp docker-compose.server.yml docker-compose.override.yml

Then run `docker-compose up` and open your browser at http://localhost:5000.
You still may tune your settings with the section below.

You may then access your python service machine with
`docker-compose exec -it web` (you may need it to create a user for example).


## Configuring

In the previous commands you created a file called _settings.py_ at the root of
the project. Tune your settings there.


## Running the project

### MongoDB

If you want to use MongoDB with docker, a _docker-compose_ file is ready.
Run `docker-compose up` to install and start the database.

### Python server

Simply run `app.py` to have a running server.
You can then open [http://localhost:5000](http://localhost:5000).


### Creating a user

Users must currently be created by hand.
To do so, open a python shell with the virtualenv activated:

    source ./venv/bin/activate
    ipython

then in the _ipython_ shell, run the following:

    from user.models import User
    User(username='johndoe', email='my@email.com').set_password('mypass').save()

You can now log on http://localhost/5000/login with "_my@email.com_" email
and "_mypass_" as password.
