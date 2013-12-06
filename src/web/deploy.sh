#!/bin/bash

### EXECUTAR PARA FAZER DEPLOYMENT DA APLICACAO

user=$1
target_host=$2

# Remove the old cafeeiro.zip
rm cafeeiro.zip

# Zip all the cafeeiro directory
zip -r cafeeiro.zip cafeeiro

# Copy the zipped cafeeiro web dir to the home directory of the "user" in the "target_host"
scp cafeeiro.zip ${user}@${target_host}:~/

# IN the "target_host": Remove the previous cafeeiro web files and add the new ones
ssh ${user}@${target_host} "cd /var/www/; rm -rf cafeeiro/*; unzip ~/cafeeiro.zip -d ."

# Remove the created cafeeiro.zip file
rm -rf cafeeiro.zip
