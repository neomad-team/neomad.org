git_update=git fetch origin master && git reset --hard FETCH_HEAD
goto_src=cd ~/src

help:
	return "Make tasks for deployment. Checkout the makefile content."

server_update:
	ssh neomad "${goto_src} && ${git_update}"

server_reload:
	ssh neomad "${goto_src} && docker-compose stop web && docker-compose rm -f web && docker-compose up -d"

deploy: server_update server_reload
