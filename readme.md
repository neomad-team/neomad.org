# Neomad website

Neomad is a open-source community project for nomad workers and people
willing to _nomadize_ themselves.

[![View continuous tests results](https://circleci.com/gh/neomad-team/neomad.org.svg?style=shield)](https://circleci.com/gh/neomad-team/neomad.org)


## Requirements

- Git
- Python3.6 or above
- [Docker](https://docs.docker.com/get-docker/)

> If you don't have/want to use docker, you can process to the
> [Manual installation section](#manual-installation).


## Installation

    git clone git@github.com:neomad-team/neomad.org.git neomad
    cd neomad

The next steps are also simple. Choose your story:

- for lazy developers: go to [Lazy developer install](#lazy-developer-installation)
- for developers who want to keep control: read the [Manual installation](#manual-installation)

### Lazy developer installation

    make install

You're done. It's called _lazy_ for a reason!
Open your browser at http://localhost:5000/login.

Lazy you!

Next times you want to run your project, you can do the following:

    make start


### Manual installation

Are you a Python warrior willing to take full control of your environment?

View the _makefile_ file in the _install_ section and tweak your commands.
It's been made to be easily readable.

Note that you can either have your own _MongoDB_ or use Docker.

> You may then want to insert dummy data running `make fixtures`.


## Configuring

In the previous commands you created a file called _settings.py_ at the root of
the project.
Tune your settings there.

`DB_PORT` is an environment variable where your Mongo instance is running. The default for a native install (27017) is preserved. _Lazy installation_ runs on 27018 by default.


## Running test

Activate your python virtual environment (with `source venv/bin/activate`).
Then launch your test with `python -m unittest`.


## Deploying

Deployment is processed through the SSH command `ssh neomad`.
You should ensure that your ssh_config is configured prior to continue.

Run the following task to deploy in _preprod_:
```sh
make prepare-deploy env=preprod
make deploy preprod
```

replace `preprod` with `prod` for running in production.
