#!/bin/bash

sudo -i
cd /home/mad/git/graffiti-wall/.deploy
git pull
mup setup
mup deploy
