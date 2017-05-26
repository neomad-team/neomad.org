git_update=git fetch origin prod && git reset --hard FETCH_HEAD
goto_src=cd ~/src

help:
	return "Make tasks for deployment. Checkout the makefile content."

server_update:
	@make title text="Fetching prod branch and updating sources."
	ssh neomad "${goto_src} && ${git_update}"

server_reload:
	@make title text="Recreating the server."
	ssh neomad "${goto_src} && docker-compose restart web"

deploy: server_update server_reload

install:
	bash -c "bin/install.sh"

start:
	bash -c "bin/start.sh"

create_user:  # arguments: email="" password=""
	@make title text="Creating a user. Email: $(email), password: $(password)"
	@python3 -c "from user.models import User;\
	User(email='$(email)').set_password('$(password)').save()"

title:
	@echo "\n\033[92m>>> $(text)\033[0m"

install_files:
	@make title text="Creating uploads dir"
	mkdir -p static/uploads/avatars
	chmod -R 777 static/uploads

	@make title text="Creating your config file"
	test -e settings.py || cp settings.example.py settings.py

fixtures:
	@make title text="Inserting fixtures data"
	bash -c "source ./venv/bin/activate && python3 bin/fixtures.py"
