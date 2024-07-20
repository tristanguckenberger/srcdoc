#!/bin/bash
# Set's up the playengine project


# 1. Setup and run the db
echo 'Running db setup...'
./setup-postgreSQL.sh

# 2. Setup and run the server
echo 'Running server setup...'
./setup-server.sh

# 3. Setup and run the client
echo 'Running client setup...'
./setup-client.sh