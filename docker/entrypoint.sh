#!/bin/bash

if [ -e requirements.txt ]; then
	pip3 install -r requirements.txt
fi

apk add --no-cache docker shadow
groupmod -g ${OPTARG} docker

gunicorn app:app -b :80 --name app
