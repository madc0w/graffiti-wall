#!/bin/bash

cd /home/mad/git/graffiti-wall/.deploy

git pull

# must run as root!
mup setup
mup deploy
