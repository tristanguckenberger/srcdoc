# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
# srcdoc



# Play Engine Road Map
## MVP Beta

### Todo
- Basic Authentication w/ sessions & cookies
- Basic Game Creation with simplified EngineAPI
- Simplified Game Publication Process
- User Profile & Management
- Favorites
- Simplified Review System
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
- Simplified Game Comments
- Robust Review System
- Simplified Issues Tracker
- Simplified Friend System

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

