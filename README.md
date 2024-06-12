# Welcome to Play Engine's client repo!
## Visit Play Engine [Visit Play Engine](https://playengine.xyz)

🚀 Our Mission: We're on a quest to demystify game development and blend the worlds of gaming and creation. Whether you're a seasoned developer or a gaming aficionado, Play Engine is your new playground.

💡 Innovate & Play: Dive into a platform where you can both create and enjoy games. With features like a semi-traditional coding environment, game-leaderboard integration, and TikTok-like game navigation, we're making sure everyone can get in on the fun.

🌱 Community at Heart: Join a burgeoning community of creators and gamers. Share your creations, get feedback, and discover your next favorite game—all in one place.

🛠 What's Next: Think multiplayer support, live code pairing, game controller integration, and even no-code options for the aspiring developer in all of us. Plus, a mobile app to keep the community thriving on the go.

# Play Engine Road Map
## MVP Beta

### Todo
- Simplified Review System
- User Points System
- Activity Feeds
- Direct Messaging
- Feedback & Voting System
- Friend System
- Notifications
- Simplified Game Profile & Management
- Hosting Setup
    - Register “play” subdomain for srcdoc.io, setup hosting for play.srcdoc.io
    - Determine hosting architecture (vercel sveltekit, heroku server + database, at home, etc.)

## MVP Alpha

### Todo
- Handle Tech Debt
- Robust Authentication with redis
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

