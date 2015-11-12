#!/usr/bin/env bash

/usr/local/bin/goaccess -f /var/log/nginx/access.log -o html > /home/ubuntu/strmr/nginx/public/logs/index.html

