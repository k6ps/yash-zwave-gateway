#!/usr/bin/env bash

DEPLOY_HOST=git.balena-cloud.com
DEPLOY_USER=gh_k6ps

mkdir -p ~/.ssh
ssh-keyscan -t ssh-rsa $DEPLOY_HOST >> ~/.ssh/known_hosts
git remote add balena $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_USER/yash.git
git push resin master
