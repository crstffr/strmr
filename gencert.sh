#!/usr/bin/env bash

mkdir cert;
openssl req -x509 -newkey rsa:2048 -keyout cert/key.pem -out cert/cert.pem -days 365;
openssl rsa -in cert/key.pem -out cert/newkey.pem && mv cert/newkey.pem cert/key.pem;
