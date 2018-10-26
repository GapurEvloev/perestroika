#!/bin/sh
cd /etc/nginx/
j2 nginx.conf.j2 > nginx.conf

cd /usr/share/nginx/html/assets/
j2 /config.js.j2 > config.js

nginx
