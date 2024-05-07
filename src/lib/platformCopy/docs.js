// @ts-nocheck
// // Home Page (/games)
// import PlayEngineCircleIcon from '$lib/assets/PlayEngineCircleIcon.svg';
// import sideBarToggleClosed from '$lib/assets/sideBarToggleClosed.png';
// import sideBarToggleOpened from '$lib/assets/sideBarToggleOpened.png';
// import createNewGame from '$lib/assets/createNewGame.png';
// import actionMenuDark from '$lib/assets/actionMenuDark.png';

// Play Page (/game/:id/play)
// import playPageHome from '$lib/assets/playPageHome.png';
// import playPageCogIcon from '$lib/assets/playPageCogIcon.png';
// import playPageEditorIcon from '$lib/assets/playPageEditorIcon.png';
// import playPageLeaderBoardIcon from '$lib/assets/playPageLeaderBoardIcon.png';
// import playPageCommentIcon from '$lib/assets/playPageCommentIcon.png';
// import playPageFavoriteIcon from '$lib/assets/playPageFavoriteIcon.png';
// import playPageAddToPlaylistIcon from '$lib/assets/playPageAddToPlaylistIcon.png';
// import playPagePlayIcon from '$lib/assets/playPagePlayIcon.png';
// import playPagePauseIcon from '$lib/assets/playPagePauseIcon.png';
// import playPageSwipeIcon from '$lib/assets/playPageSwipeIcon.svg';
// import playPageArrowKeyNavIcons from '$lib/assets/playPageArrowKeyNavIcons.jpg';
// import playPageButtonNavIcons from '$lib/assets/playPageButtonNavIcons.png';

// Editor Page (/game/:id/engine)
// import editorPage from '$lib/assets/editorPage.png';
// import editorPageActionBar from '$lib/assets/editorPageActionBar.png';
import editorPageFileExplorer from '$lib/assets/editorPageFileExplorer.png';
import editorPageFileExplorerActions from '$lib/assets/editorPageFileExplorerActions.png';
import editorPageResizablePanes from '$lib/assets/editorPageResizablePanes.png';
import editorPageCodePanes from '$lib/assets/editorPageCodePanes.png';
import editorPageGamePreview from '$lib/assets/editorPageGamePreview.png';
import pixilogo from '$lib/assets/pixilogo.svg';

export const docs = [
	{
		title: 'Getting Started',
		content: `
        <h1>Getting Started</h1>
        <p>
            Welcome to the editor documentation! Here you will find all the 
            information you need to get started with the editor. As well as 
            a reference to all the features and options available to you.
        </p>
        <hr>
        <br>
        <h2>File Explorer</h2>
        <p>
            Use the file explorer to navigate through the folders and files 
            in your game. You can right click on a file or folder for actions 
            within the file explorer.
        </p>
        <img src="${editorPageFileExplorer}" alt="Editor Page File Explorer">
        <br>
        <h3>File Explorer - Actions</h3>
        <p>
            Right click on a file or folder in the file explorer to see a list 
            of actions you can take on that file or folder. You can create new 
            files, new folders, delete files, and save individual files from 
            here.
        </p>
        <img src="${editorPageFileExplorerActions}" alt="Editor Page File Explorer Actions">
        <br>
        <hr>
        <br>
        <h2>Editor Panes</h2>
        <p>
            The editor panes are where you will write your code. The editor 
            panes are resizable, so you can adjust the size of each pane to 
            your liking.
        </p>
        <br>
        <h3>Editor Panes - Resizing Editor Panes</h3>
        <p>
            You can resize the editor panes by dragging the border between 
            the panes.
        </p>
        <img src="${editorPageResizablePanes}" alt="Editor Page Resizable Panes">
        <br>
        <h3>Editor Panes - Code Editor</h3>
        <p>
            Use the code editor panes to write the code for your game. You 
            can also open up to 3 files side by side by right clicking files 
            in the file explorer and selecting the "Open in New Pane" option. 
            You can write code in JavaScript, HTML, and CSS. I recommend 
            starting with 3 primary files: index.html, index.css, and 
            index.js.
        </p>
        <img src="${editorPageCodePanes}" alt="Editor Page Code Panes">
        <br>
        <h3>Editor Panes - Game Preview</h3>
        <p>
            Use the game preview to see how your game looks and functions. You 
            can play the game in the game preview.
        </p>
        <img src="${editorPageGamePreview}" alt="Editor Page Game Preview">
        `
	},
	{
		title: 'Basic Concepts',
		content: 'Basic concepts content goes here'
	},
	{
		title: 'Advanced Concepts',
		content: `
        <h2>PIXI.js</h2>
        <p>
            Play Engine optionally provides PIXI.js as a game engine. PIXI.js is
            a 2D rendering engine that simplifies the process of creating games
            in the browser. PIXI.js uses WebGL to render graphics, but can also
            fall back to HTML5 Canvas if WebGL is not available. You can use 
            PIXI.js to create games. You can use the PIXI.js documentation to 
            learn more about PIXI.js. You can also use the PIXI.js examples to 
            learn how to use PIXI.js to simplify your development process.
        </p>
        <img src="${pixilogo}" alt="PIXI.js Logo">
        `
	},
	{
		title: 'API Reference',
		content: `
            <h2>getAsset()</h2>
            <p>
                The getAsset() function is PIXI wrapper function that 
                encapsulates PIXI's load  should be used to load image 
                assets (into a PIXI.js game) that have been uploaded to the 
                optional assets folder.
            </p>
            <p>
                getAsset(path: string): Asset Name e.g. "playerSprite.png", but just pass the name: getAsset("playerSprite"), Note: path is relative to the assets folder, ensure you include the file extension.

                <pre>
                    <code>
... Init code here ... 

// Get the PIXI loader
const Loader = PIXI.Assets;

// use getAsset to load a png image asset such as a sprite sheet
let sprite = getAsset('characterSpriteSheet.png');

... Other code here ... 

try {
    // We can now load the sprite sheet, saving it as a variable, 'texture'
    const texture = await Loader.load(sprite);
    if (!texture) {
        console.log('sprite not found...');
    }

    // Create a rectangle for the sprite sheet to use when the character is facing down
    let characterDownRectangle = new PIXI.Rectangle(0, 48, 32, 32);

    // Create a texture for the sprite sheet to use when the character is facing down, based on the rectangle
    let characterDownTexture = new PIXI.Texture(texture, characterDownRectangle);
    
    // Set the texture frame to the rectangle
    texture.frame = characterDownRectangle;


    // Create a rectangle for the sprite sheet to use when the character is facing up
    let characterUpRectangle = new PIXI.Rectangle(0, 0, 32, 32);
    
    // Create a texture for the sprite sheet to use when the character is facing up, based on the rectangle
    let characterUpTexture = new PIXI.Texture(texture, characterUpRectangle);


    // Set our character sprite to the characterUpTexture as a default
    let character = new PIXI.Sprite(characterUpTexture);
    

    // Set the character sprite's width and height
    const baseHeight = height * .13;
    character.width = baseHeight;
    character.height = baseHeight;

    
    // You can now add the sprite to the PIXI game stage
    app.stage.addChild(character);

... Remaining code here ...

                    </code>
                </pre>
            </p>
            <br>
            <h2>updateScore()</h2>
            <p>
                The updateScore() function is a Play Engine API function that should be used to update the score in a game if you want to track user game scores within a leaderboard.
            
                updateScore(score: number;): Use this function to update the user score. Note: The score param is what will be added to the existing user score and IS NOT the new total score; Play Engine will handle this for you.

                <pre>
                    <code>
                        
                    </code>
                </pre>
            </p>
            <br>
            <h2>gameAction()</h2>
            <p>
                The gameAction() function is a Play Engine API function that should be used to send game actions to the Play Engine server. For game analytics.
            </p>
            <p>
                gameAction(action: string;): Use this function for setting session activity, the action can be 'start-game', 'stop-game', 'resume-game', or 'pause-game', Note: start and stop actions can only be called once per game session.
                <pre>
                    <code>
document.getElementById('startButton').addEventListener('click', function() {
    // Trigger the start-game action when the start button is clicked
    gameAction('start-game');
    document.getElementById('gameMenu').style.display = 'none';
    document.getElementById('ship').style.display = 'block';
    
    // Variable to track if the game has started
    if (!gameStarted) {
        gameStarted = true;
    }

    // Start the game loop
    setTimeout(function() {
        ...
                    </code>
                </pre>
            </p>
            <br>
            <h2>getClientDimensions()</h2>
            <p>
                Returns the width and height of the client window in an object.
            
                getClientDimensions(): { width: number, height: number }, Note: This is the size of the client window. You can use this to make your game responsive.
                <pre>
                    <code>
                        
                    </code>
                </pre>
            </p>
        `
	},
	{
		title: 'Common Issues & Troubleshooting',
		content: `
            <h2>Save Frequently/Often</h2>
            <p>
                The editor does not save automatically. It is important to save 
                your work frequently to avoid losing any changes.
            </p>
            <br>
            <h2>Why is my content not saving?</h2>
            <p>
                Have you tried turning it off and on agian? Kidding... 
                If you run into this issue, copy the contents of the file 
                just to be safe, then close the tab that needs to be saved. 
                Refresh the page (do not hard refresh), and then try to reopen 
                the file and attempt to save the file contents again.
            </p>
            <br>
            <h3>Still having issues?</h3>
            <p>
                If you are still having issues, ensure you still have your file 
                contents copied to your clipboard, then close the tab and hard 
                refresh (Ctrl + Shift + R). Reopen the file and highlight the 
                whole thing, then replace what's there with your copied file 
                content. You should be able to save now.
            </p>
        `
	}
];
