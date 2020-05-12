goto_src=cd ~/$(env) && source ./venv/bin/activate
git_update=git fetch origin $(env) && git checkout $(env) && git reset --hard FETCH_HEAD

help:
	@echo "Make tasks for deployment. Checkout the makefile content."

logs:  # type=error|access
	@${remote} "${goto_src} && tail -f ./log/${type}.log"

server_update:  # env=prod|preprod
	@make title text="Fetching prod branch and updating sources."
	ssh neomad "${goto_src} && ${git_update}"
	ssh neomad "${goto_src} && pip install -r requirements.txt"

server_reload:  # env=prod|preprod
	@make title text="Restarting the service."
	ssh neomad "sudo systemctl restart neomad"

prepare-deploy:  # env=prod|preprod
	git checkout $(env)
	git fetch origin
	git merge origin/master
	git push origin $(env)

deploy: server_update server_reload  # env=prod|preprod

backup_db:
	# rsync -avz neomad:~/prod/data/db ./backups/prod-`(date +%s)`
	ssh neomad "./scripts/dbbackup.sh"
	rsync -avz neomad:scripts/dump/ ./backups/

install:
	bash -c "bin/install.sh"

start:
	bash -c "bin/start.sh"

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
