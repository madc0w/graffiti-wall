#!/bin/bash

cd /home/mad/git/graffiti-wall/.deploy

git pull
sudo -i mup setup
sudo -i mup deploy
