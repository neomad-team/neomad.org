#!/bin/bash

# Add extra system dependencies
apk --update add nodejs

if [ -e requirements.txt ]; then
	pip3 install -r requirements.txt
fi

# Build frontend assets
npm install

gunicorn app:app -b :80 --name app
