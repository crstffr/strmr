#!/usr/bin/env bash

cd public;
# jspm bundle angular ./bundle/angular.min.js -mi;
jspm bundle ./app/strmr.js - angular ./bundle/strmr.min.js -mi;
cd ../
