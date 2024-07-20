#!/bin/bash

# Ensure the script is run from the project root
if [ ! -f package.json ]; then
    echo "Error: package.json not found. Please run this script from the client project root."
    exit 1
fi

# Prompt the user for input
read -p "Enter the server URL: " SERVER_URL
read -p "Enter the WebSocket server URL: " VITE_WEBSOCKET_SERVER_URL

# Check if the user provided all necessary inputs
if [[ -z "$SERVER_URL" || -z "$VITE_WEBSOCKET_SERVER_URL" ]]; then
    echo "Error: You must provide both the server URL and the WebSocket server URL."
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
SERVER_URL=$SERVER_URL
VITE_WEBSOCKET_SERVER_URL=$VITE_WEBSOCKET_SERVER_URL
EOL

echo "Client setup complete. Starting client..."

npm run dev