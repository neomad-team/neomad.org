# Neomad website

## Installation

The project requires your OS to have the following working:

- Python3.5 or above
- [MongoDB](http://mongodb.com/) 3.4 or above,  or [Docker-compose](https://docs.docker.com/compose/)


To install the project, run the following:

    python3.5 -m venv ./venv
    source ./venv/bin/activate
    pip install -r requirements.txt
    cp settings.example.py settings.py

### Configuring

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
To do so, open a python shell `ipython` and run the following:

    from user.models import User
    User(username='johndoe', email='my@email.com').set_password('mypass').save()

You can now log on http://localhost/5000/login with "_my@email.com_" email
and "_mypass_" as password.
