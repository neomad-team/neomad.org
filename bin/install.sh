#!/bin/bash

make install_files

make title text="Installing your Python environment"
(python3 -m venv venv)
echo "/venv/" >> `pwd`/.git/info/exclude

source ./venv/bin/activate
pip3 install -r requirements.txt

make title text="Running your dabase"
docker-compose up -d db

make start
