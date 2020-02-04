#!/bin/bash

export DB_PORT=27018 # Edit with the wanted port

make install_files

make title text="Installing your Python environment"
(python3 -m venv venv)
echo "/venv/" >> `pwd`/.git/info/exclude

source ./venv/bin/activate
pip3 install -r requirements.txt

make title text="Installing your dabase"
docker pull mongo:latest
docker container create --expose 27017 -p ${DB_PORT}:27017 --name=neomadorg_db_1 -v ${PWD}/data:/data -v ${PWD}/data/db:/data/db mongo:latest mongod

make start
