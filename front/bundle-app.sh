#!/usr/bin/env bash

jspm bundle strmr-common - angular - lodash ./bundle/common.min.js -mi;
jspm bundle ./app/app.js - angular - lodash - strmr-common ./bundle/strmr.min.js -mi;
jspm bundle ./app/routes/index.route.js - angular - lodash - strmr-common ./bundle/route.index.min.js -mi;
jspm bundle ./app/routes/auth/auth.route.js - angular - lodash - strmr-common ./bundle/route.auth.min.js -mi;
jspm bundle ./app/routes/auth/login/auth.login.route.js - angular - lodash - strmr-common ./bundle/route.auth.login.min.js -mi;
jspm bundle ./app/routes/library/library.route.js - angular - lodash - strmr-common ./bundle/route.library.min.js -mi;
