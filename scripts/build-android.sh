#!/bin/bash

git pull

rm -r ~/wallator-build/

meteor build --verbose ~/wallator-build --server=http://www.wallator.com

cd ~/wallator-build/android/project/build/outputs/apk/release

jarsigner -verbose -sigalg SHA1withRSA -tsa http://timestamp.digicert.com -digestalg SHA1 android-release-unsigned.apk wallator

$ANDROID_HOME/build-tools/23.0.1/zipalign 4 android-release-unsigned.apk signed.apk

