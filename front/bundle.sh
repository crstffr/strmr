#!/usr/bin/env bash

jspm bundle angular ./bundle/angular.min.js -mi;
jspm bundle ./style/style.js ./bundle/style.min.js -mi;
jspm bundle ./app/strmr.js - angular ./bundle/strmr.min.js -mi;
