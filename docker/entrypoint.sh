#!/bin/bash

# Add extra system dependencies
apk --update add nodejs
npm install yarn

if [ -e requirements.txt ]; then
	pip3 install -r requirements.txt
fi

# Build frontend assets
yarn && yarn build

gunicorn app:app -b :80 --name app
