#!/bin/bash

git pull

rm -r ~/wallator-build/

export METEOR_ALLOW_SUPERUSER=true
meteor build --verbose ~/wallator-build --server=http://www.wallator.com

cd ~mad/git/graffiti-wall/.meteor/local/cordova-build/platforms/android/app/build/outputs/apk/release
rm signed.apk

jarsigner -verbose -sigalg SHA1withRSA -tsa http://timestamp.digicert.com -digestalg SHA1 app-release-unsigned.apk wallator

$ANDROID_HOME/build-tools/23.0.1/zipalign 4 app-release-unsigned.apk signed.apk

