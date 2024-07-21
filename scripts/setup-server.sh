#!/bin/bash

# Ensure the script is run from the project root
if [ ! -f package.json ]; then
    echo "Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Navigate to the parent directory
cd ..

# Check if srcdoc_server directory exists
if [ ! -d "srcdoc_server" ]; then
    echo "srcdoc_server directory not found. Cloning from GitHub..."
    git clone https://github.com/tristanguckenberger/srcdoc_server.git
else
    echo "srcdoc_server directory already exists."
fi

# Change to the srcdoc_server directory
cd srcdoc_server

# Ensure the script is run from the project root
if [ ! -f package.json ]; then
    echo "Error: package.json not found in srcdoc_server. Please run this script from the correct directory."
    exit 1
fi


# Prompt the user for input
read -p "Enter the database user: " DB_USER
read -p "Enter the database name: " DB_NAME
read -s -p "Enter the database password: " DB_PASSWORD
echo
read -s -p "Enter the JWT secret: " JWT_SECRET
echo
read -p "Enter the email username: " SEND_EMAIL_USERNAME
read -s -p "Enter the email API key: " SEND_EMAIL_API_KEY
echo

# Check if the user provided all necessary inputs
if [[ -z "$DB_USER" || -z "$DB_NAME" || -z "$DB_PASSWORD" || -z "$JWT_SECRET" || -z "$SEND_EMAIL_USERNAME" || -z "$SEND_EMAIL_API_KEY" ]]; then
    echo "Error: You must provide all required inputs."
    exit 1
fi

# Use nvm to set the latest node version
echo "Setting Node.js to the latest version using nvm..."
nvm install node
nvm use node

# Install node modules
echo "Installing Node.js modules..."
npm install

# Create the .env file
echo "Creating .env file..."
cat <<EOL > .env
DB_USER=$DB_USER
DB_HOST=localhost
DB_NAME=$DB_NAME
DB_PASSWORD=$DB_PASSWORD
DB_PORT=5432
JWT_SECRET=$JWT_SECRET
NODE_ENV=development
SEND_EMAIL_USERNAME=$SEND_EMAIL_USERNAME
SEND_EMAIL_API_KEY=$SEND_EMAIL_API_KEY
EOL

echo "Server setup complete. Starting the server..."

# npm run start && cd ..