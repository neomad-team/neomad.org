#!/bin/bash

# Add extra system dependencies
apk --update add nodejs

if [ -e requirements.txt ]; then
	pip3 install -r requirements.txt
fi

npm install && npm run build

gunicorn --workers 4 app:app -b :80 --name app
