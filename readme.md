# Neomad website

Neomad is a open-source community project for nomad workers and people
willing to _nomadize_ themselves.

[![View continuous tests results](https://circleci.com/gh/neomad-team/neomad.org.svg?style=shield)](https://circleci.com/gh/neomad-team/neomad.org)


## Requirements

- Git
- Python3.6 or above
- [Docker-compose](https://docs.docker.com/compose/)

> If you don't have/want to use docker, you can process to the
> [Manual installation section](#manual-installation).


## Installation

    git clone git@github.com:neomad-team/neomad.org.git neomad
    cd neomad

The next steps are also simple. Choose your story:

- for lazy developers: go to [lazy developer install](#lazy-developer-installation)
- for lazy testers: choose the [full-docker install](#full-docker-installation)
- for developers who want to keep control: read the [Manual installation](#manual-installation)

> You may then want to insert dummy data use `make fixtures`.

### Lazy developer installation

    make install

You're done. It's called _lazy_ for a reason!
Open your browser at http://localhost:5000/login.

Lazy you!

Next times you want to run your project, you can do the following:

    make start


### Full-Docker Installation

First of all you should create your required files: `make install_files`.

In the _settings.py_ file, set the `DATABASE = {…, 'host': 'db', …}` to
connect the server to the database (`'db'` is the actual name you want as
_host_, it is the name of the docker _link_).

Then run `docker-compose up` and open your browser at http://localhost:5000.

> You can access your python server machine with
> `docker-compose exec -it web` (you may need it to create a user for example).
>
> The sources in your docker server are in the _/app_ folder (`cd /app`).


### Manual installation

Are you a Python warrior willing to take full control of your environment?

View the _makefile_ file in the _install_ section and tweak your commands.
It's been made to be easily readable.

Note that you can either have your own _MongoDB_ or use Docker even if it's only
for running a database: `docker-compose up -d db`.


## Configuring

In the previous commands you created a file called _settings.py_ at the root of
the project.
Tune your settings there.


## Running test

Activate your python virtual environment (with `source venv/bin/activate`).
Then launch your test with `python -m unittest`.


## Extra commands

### Work on around page

Displaying _/around/_ page depends on [Preact](https://preactjs.com/).
You may build the assets running `npm run watch` when developing or `npm run build` for running the project.
