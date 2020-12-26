#!usr/bin/env bash

action  = $1
action2 = $2


usage() {
	echo "netdrive.sh usage:
\t run local/docker: Runs netdrive
\t configure:        Configure netdrive"
}

error() {
	echo $1
	exit 1
}

local_setup() {
	echo '# Set the path for your local cloud' > src/.env
	echo 'NETDRIVE_STORAGE="/home/user/example"' >> src/.env
	cd src
	npm i || error -e "\nERROR INSTALLING DEPENDENCIES"
	echo -e "\nSetup completed"
}

docker_setup() {
	docker-compose build &&
	docker-compose run express npm i
}

if [ $action == "run" ]; then
	if [ $action2 == "local" ]; then
		local_setup && node src/index.js
	elif [ $action2 == "docker" ]; then
		docker_setup
	fi
elif [ $action == "configure" ]; then
	vim src/.env
else

fi