#!/bin/bash

cd /home/mad/git/graffiti-wall/.deploy

git pull

# must run as root!
# sudo -i
export METEOR_ALLOW_SUPERUSER=true
mup setup
mup deploy
