#!/bin/bash

export DB_PORT=27018 # Please ensure that this value is the same in install.sh

make title text="Running your database"
docker container start neomadorg_db_1

make title text="Running your project. Open your browser at http://localhost:5000"
source ./venv/bin/activate
python app.py
