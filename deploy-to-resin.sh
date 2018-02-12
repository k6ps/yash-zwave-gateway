#!/usr/bin/env bash

DEPLOY_HOST=git.resin.io
DEPLOY_USER=g_taavi_t_navsuu

ssh-keyscan -t ssh-rsa $DEPLOY_HOST >> ~/.ssh/known_hosts
git remote add resin $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_USER/yashopenzwavegateway.git
git push resin master