![Screenshot 2024-06-12 at 18 52 05](https://github.com/tristanguckenberger/srcdoc/assets/19194337/06c68fec-0418-45f2-9422-488579d3d1fa)

# Welcome to Play Engine's client repo!
## Visit Play Engine [Visit Play Engine](https://playengine.xyz)

🚀 Our Mission: We're on a quest to demystify game development and blend the worlds of gaming and creation. Whether you're a seasoned developer or a gaming aficionado, Play Engine is your new playground.

💡 Innovate & Play: Dive into a platform where you can both create and enjoy games. With features like a semi-traditional coding environment, game-leaderboard integration, and TikTok-like game navigation, we're making sure everyone can get in on the fun.

🌱 Community at Heart: Join a burgeoning community of creators and gamers. Share your creations, get feedback, and discover your next favorite game—all in one place.

🛠 What's Next: Think multiplayer support, live code pairing, game controller integration, and even no-code options for the aspiring developer in all of us. Plus, a mobile app to keep the community thriving on the go.

# Setup
Note: the setup scripts provided are for macs, if you are using another OS, you will need to update the scripts accordingly or setup manually.

1. On your computer create a folder and call it whatever you like
```
mkdir playengine
```
2. Clone the srcdoc project into that folder
```
git clone https://github.com/tristanguckenberger/srcdoc.git
```
3. Go into the srcdoc folder and run the following commands to
setup postgresql. This will install postgresql if you dont already have it and will create a fresh db for your local project with tables and all.
```
cd srcdoc

./scripts/setup-postgreSQL.sh 
```

4. Now run the servers setup script. You'll need the db info you just set. This will clone the server repo into the parent folder you created in the first step and then install node modules for you.
```
./scripts/setup-server.sh
```
Note: You will need to open config/db.js and ssl on line 12 to false, so this:
```
  ssl: {
    rejectUnauthorized: false,
    require: true,
  },
```

becomes this:
```
  ssl: false,
```

5. You can start the server with the following command from the servers root \(but wait until after running the client setup script \):
```
npm run start
```

6. Now run the client setup script
```
./scripts/setup-client.sh
```
Note: This attempts to install the latest version of node using nvm. If this part fails no biggie, just make sure you have the latest version of node before running:
```
npm install
```

7. You can start the client with this command:
```
npm run dev
```

# Contributing
- Contributions should be made to new "\[feat, fix\]::\[feature or fix\]_name_here" branches with Pull Requests on branch, "main"

# Play Engine Road Map
## MVP Beta

### Todo
- User Points System
- Direct Messaging
- Feedback & Voting System
- Mobile responsiveness overhaul

## MVP Alpha

### Todo
- Handle Tech Debt
- Robust EngineAPI w/ localStorage integration
- Simplified CommunityAPI
- Robust Game Profile & Management
- Robust Review System
- Simplified Issues Tracker

## MVP Pre-Launch

### Todo
- Handle Tech Debt
- Robust Game Publication Process w/ Docker Container Hosting
- Simplified ContainerAPI
- Robust Issues Tracker
- Robust Friend System
- Robust CommunityAPI
- Robust Game Comments & Forums
- GitHub authentication
- Simplified GitHub account linking w/ gist setup
- Google authentication
- Write Tests

## MVP Launch

### Todo
- Handle Tech Debt
- Robust ContainerAPI 
- Robust GitHub account linking w/ gist setup

## MultiplayerUpdate
Adds an API for multiplayer support in user games + InGameChat overlay w/toggle (if the multiplayerAPI is used

### Features
- Add MultiplayerAPI
- InGameChatAPI

## HangoutsUpdate
Adds Hangouts functionality. Users can invite friends to “Hangout” via a “start new hangout” button in engine’s toolbar or in play’s settings panel. 

### Engine Hangout Features
- Private Hangout (creates a Hangout that only friends or people with a code can join)
- Public Hangout (create a Hangout that is displayed on the host users profile page that anyone can access the link to)
- Live Coding (multiple users can work on a single game and see each other making edits in real time)
- Strict Mode (editor read only for non-owners, except whitelisted users)

### Play Hangout Features
- Live GamePlay Sharing, basically this will be a read only iframe that hooks into a users game container session

### General Hangout Features
-  Hangout UI accessible via a toggle-able side panel. Includes ui for:
    - Hangout Chat
    - Hangout management
        - Users management (block, kick, mute)
        - User view (current users in hangout)
        - Chat settings
            - allow chat (enabled/disabled)
            - Friend only chat
            - Follower + Friend only chat


## Mobile Client Beta Update

### Features
- Simplified react native app

## Mobile Client Alpha Update

### Features

## Mobile Client Pre-Launch Update

### Features

## Mobile Client Launch Update

### Features

