export const docs = [
	{
		title: 'Getting Started',
		content: `Welcome to the editor documentation! Here you will find all the 
            information you need to get started with the editor. As well as 
            a reference to all the features and options available to you.`
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
