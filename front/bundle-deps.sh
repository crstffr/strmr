#!/usr/bin/env bash

jspm bundle lodash ./bundle/lodash.min.js -mi;
jspm bundle angular ./bundle/angular.min.js -mi;
jspm bundle ./style/style.js ./bundle/style.min.js -mi;

