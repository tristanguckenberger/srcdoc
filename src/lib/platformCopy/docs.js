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
// import editorPageFileExplorerActions from '$lib/assets/editorPageFileExplorerActions.png';
// import editorPageResizablePanes from '$lib/assets/editorPageResizablePanes.png';
// import editorPageCodePanes from '$lib/assets/editorPageCodePanes.png';
// import editorPageGamePreview from '$lib/assets/editorPageGamePreview.png';
// import pixilogo from '$lib/assets/pixilogo.svg';

export const docs = [
	{
		title: 'Getting Started',
		content: `
        <p>
            Welcome to the editor documentation! Here you will find all the 
            information you need to get started with the editor. As well as 
            a reference to all the features and options available to you.
        </p>
        <br>
        <h2>File Explorer</h2>
        <p>
            Use the file explorer to navigate through the folders and files 
            in your game. You can right click on a file or folder for actions 
            within the file explorer.
        </p>
        <img src="${editorPageFileExplorer}" alt="Editor Page File Explorer">
        `
	},
	{
		title: 'Basic Concepts',
		content: 'Basic concepts content goes here'
	},
	{
		title: 'Advanced Concepts',
		content: 'Advanced concepts content goes here'
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

                <pre>
                    <code>
                        getAsset(path: string): Asset Name e.g. "playerSprite.png", but just pass the name: getAsset("playerSprite"), Note: path is relative to the assets folder, ensure you include the file extension.
                    </code>
                </pre>
            </p>
        `
	},
	{
		title: 'Gotchas',
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
