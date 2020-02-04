#!/bin/bash

export DB_PORT=27018 # Edit with the wanted port

make title text="Running your database"
docker container start neomadorg_db_1

make title text="Running your project. Open your browser at http://localhost:5000"
source ./venv/bin/activate
python app.py
