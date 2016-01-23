#!/usr/bin/env bash

./bundle-deps.sh;
./bundle-app.sh;
firebase deploy;
