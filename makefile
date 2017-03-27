SHELL := /bin/bash

git_update=git fetch origin master && git reset --hard FETCH_HEAD
goto_src=cd ~/src

help:
	return "Make tasks for deployment. Checkout the makefile content."

server_update:
	ssh neomad "${goto_src} && ${git_update}"

server_reload:
	ssh neomad "${goto_src} && docker-compose stop web && docker-compose rm -f web && docker-compose up -d"

deploy: server_update server_reload

title:
	echo $SHELL
	@echo "\n\033[92m>>> $(text)\033[0m"

start:
	@make title text="Running your project. Open your browser at http://localhost:5000"
	source `pwd`/venv/bin/activate
	python app.py

create_user:  # arguments: email="" password=""
	@make title text="Creating a user. Email: $(email), password: $(password)"
	@python3 -c "from user.models import User;\
	User(email='$(email)').set_password('$(password)').save()"

install_files:
	@make title text="Creating uploads dir"
	mkdir -p static/uploads/avatars
	chmod -R 777 static/uploads

	@make title text="Creating your config file"
	cp -n settings.example.py settings.py

install:
	make install_files

	@make title text="Installing your Python environment"
	python3 -m venv venv
	@echo "/venv/" >> `pwd`/.git/info/exclude
	. `pwd`/venv/bin/activate
	pip3 install -r requirements.txt

	@make title text="Running your dabase"
	docker-compose up -d db

	make create_user email="my@email.com" password="mypass"

	@make start
