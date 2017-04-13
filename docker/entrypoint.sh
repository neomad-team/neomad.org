#!/bin/bash

if [ -e requirements.txt ]; then
	pip3 install -r requirements.txt
fi

gunicorn app:app -b :80 --name app
