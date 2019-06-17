#!/bin/bash

git pull

meteor reset

export METEOR_ALLOW_SUPERUSER=true
meteor build --verbose ~/wallator-build --server=http://www.wallator.com

cd ~mad/git/graffiti-wall/.meteor/local/cordova-build/platforms/android/app/build/outputs/apk/release
rm signed.apk

# keytool -genkey -alias distrochess -keyalg RSA -keysize 2048 -validity 10000
jarsigner -verbose -sigalg SHA1withRSA -tsa http://timestamp.digicert.com -digestalg SHA1 app-release-unsigned.apk wallator

$ANDROID_HOME/build-tools/23.0.1/zipalign 4 app-release-unsigned.apk signed.apk

