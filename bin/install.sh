#!/bin/bash

export DB_PORT=27018 # Please ensure that this value is the same in install.sh

make install_files

make title text="Installing your Python environment"
(python3 -m venv venv)
echo "/venv/" >> `pwd`/.git/info/exclude

source ./venv/bin/activate
pip3 install -r requirements.txt

make title text="Installing your dabase"
docker pull mongo:latest
docker run -d --expose 27017 -p ${DB_PORT}:27017 --name=neomadorg_db_1 -v ${PWD}/data:/data -v ${PWD}/data/db:/data/db mongo:latest mongod

make fixtures

make start
