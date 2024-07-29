// @ts-nocheck

/**
 * @typedef {Object} FileObject
 * @property {string} name - The name of the file.
 * @property {string} type - The type of the file (e.g., 'folder', 'html', 'css', 'js').
 * @property {number} id - The ID of the file.
 * @property {number} parentFileId - The ID of the parent file.
 * @property {string} content - The content of the file.
 *
 *
 *
 * @typedef {Object} ErrorObject
 * @property {string} errorMessage - The error message.
 *
 * <script>(function(){function handle_message(ev) {let { action, cmd_id } = ev.data;const send_message = (payload) => parent.postMessage( { ...payload }, ev.origin);const send_reply = (payload) => send_message({ ...payload, cmd_id });const send_ok = () => send_reply({ action: 'cmd_ok' });const send_error = (message, stack) => send_reply({ action: 'cmd_error', message, stack });if (action === 'eval') {try {const { script } = ev.data.args;eval(script);send_ok();} catch (e) {send_error(e.message, e.stack);}}if (action === 'catch_clicks') {try {const top_origin = ev.origin;document.body.addEventListener('click', event => {if (event.which !== 1) return;if (event.metaKey || event.ctrlKey || event.shiftKey) return;if (event.defaultPrevented) return;let el = event.target;while (el && el.nodeName !== 'A') el = el.parentNode;if (!el || el.nodeName !== 'A') return;if (el.hasAttribute('download') || el.getAttribute('rel') === 'external' || el.target) return;event.preventDefault();if (el.href.startsWith(top_origin)) {const url = new URL(el.href);if (url.hash[0] === '#') {window.location.hash = url.hash;return;}}window.open(el.href, '_blank');});send_ok();} catch(e) {send_error(e.message, e.stack);}}}window.addEventListener('message', handle_message, false);window.onerror = function (msg, url, lineNo, columnNo, error) {parent.postMessage({ action: 'error', value: error }, '*');};window.addEventListener(\"unhandledrejection\", event => {parent.postMessage({ action: 'unhandledrejection', value: event.reason }, '*');});}).call(this);let previous = { level: null, args: null };['clear', 'log', 'info', 'dir', 'warn', 'error'].forEach((level) => {const original = console[level];console[level] = (...args) => {if (previous.level === level &&previous.args.length === args.length &&previous.args.every((a, i) => a === args[i])) {parent.postMessage({ action: 'console', level, duplicate: true }, '*');} else {previous = { level, args };try {parent.postMessage({ action: 'console', level, args }, '*');} catch (err) {parent.postMessage({ action: 'console', level: 'unclonable' }, '*');}}original(...args);}})<\/script>
 *
 * @typedef {Object} ClientDimensionsObject
 * @property {number} width - The width of the client.
 * @property {number} height - The height of the client.
 *
 */

/**
 * This function retrieves a file by its ID.
 *
 * @param {FileObject[]} files
 * @param {number} id
 * @returns {FileObject|ErrorObject}
 */
const findFileById = (files, id) => {
	if (!files || files.length === 0) {
		return {
			errorMessage: 'No files found!'
		};
	}

	if (!id) {
		return {
			errorMessage: 'No id provided!'
		};
	}

	return (
		files?.find((file) => file.id === id) ?? {
			errorMessage: `No file found with id ${id}!`
		}
	);
};

/**
 * This function retrieves the children belonging to a
 * file using its ID.
 *
 * @param {FileObject[]} files
 * @param {number} parentId
 * @returns {FileObject[]|ErrorObject}
 */
const findChildren = (files, parentId) => {
	if (!files || files.length === 0) {
		return {
			errorMessage: 'No files found!'
		};
	}

	if (!parentId) {
		return {
			errorMessage: 'No parentId provided!'
		};
	}

	const childrenFound = files?.filter((file) => {
		return file?.parent_file_id === parentId;
	}) ?? {
		errorMessage: `No children found for file with id ${parentId}!`
	};

	return childrenFound;
};

/**
 * This function retrieves the children belonging to a
 * file using its ID.
 *
 * @param {FileObject[]} files
 * @param {number} rootId
 * @param {FileObject[]} collected
 *
 *
 * @returns {FileObject[]|ErrorObject}
 */
const collectFiles = (files, rootId, collected = []) => {
	if (!files || files.length === 0) {
		return {
			errorMessage: 'No files found!'
		};
	}

	if (!rootId) {
		return {
			errorMessage: 'No rootId provided!'
		};
	}

	const rootFile = findFileById(files, rootId);
	if (!rootFile) {
		return {
			errorMessage: `No file found with id ${rootId}!`
		};
	}

	if ('type' in rootFile && rootFile.type === 'folder') {
		const children = findChildren(files, rootId);
		if (Array.isArray(children)) {
			children.forEach((child) => collectFiles(files, child.id, collected));
		}
	}

	if ('type' in rootFile) {
		collected.push(rootFile);
	}
	return collected;
};

/**
 * This function resolves dependencies in a file
 *
 * @param {FileObject} file
 * @param {FileObject[]} files
 *
 * @returns {string|ErrorObject}
 */
const resolveDependencies = (file) => {
	if (!file) {
		return {
			errorMessage: 'No file provided!'
		};
	}

	let content = file?.content;
	return content;
};

/**
 * This function generates the srcdoc
 *
 * @param {FileObject[]} files
 * @param {ClientDimensionsObject} clientDimensions
 *
 * @returns {string|ErrorObject}
 */
const generateSrcDoc = (files, clientDimensions) => {
	if (!files || files?.length === 0) {
		return {
			errorMessage: 'No files provided!'
		};
	}

	// Get all asset files and make sure they are loaded first and available to the user
	// with a simple string like "assets/images/assetName.png"
	// This should do the heavy lifting for the user and make it easier to use assets
	// from the virtual file system.

	let htmlContent = '';
	let cssContent = '';
	let jsContent = '';

	files?.forEach((file) => {
		const resolvedContent = resolveDependencies(file, files);
		if (file?.type === 'html') {
			htmlContent += resolvedContent;
		} else if (file?.type === 'css') {
			cssContent += `<style>html{height:100%;}body{margin:0;height:100%;}${resolvedContent}</style>`;
		} else if (file?.type === 'js') {
			jsContent += `<script>${resolvedContent}</script>`;
		}
	});

	// get all assets and build a lookup table
	const assetLookupString = () => {
		const assetLookup = {};
		files?.forEach((file) => {
			if (
				file?.type === 'image' ||
				file?.type === 'audio' ||
				file?.type === 'ogg' ||
				file?.type === 'wav' ||
				file?.type === 'png'
			) {
				assetLookup[`${file.name}.${file.type}`] = file?.content;
			}
		});

		return JSON.stringify(assetLookup);
	};

	const getWidth = () => clientDimensions.width;
	const getHeight = () => clientDimensions.height;

	const getAsset = `
	<script>
		function getAsset(url) {
			const assetLookup = ${assetLookupString()};
			try {
				const asset = assetLookup[url] || url;
				return JSON.parse(asset);
			} catch (error) {
				return assetLookup[url] || url;
			}
		}
	</script>
	`;

	const getClientDimensions = `
	<script>
		function getClientDimensions() {
			const width = ${getWidth()};
			const height = ${getHeight()};
			return {
				width,
				height
			} || 'nothin here';
		}
	</script>
	`;

	const triggerGameSessionAction = `
	<script>
		function triggerGameSessionAction(action) {
			window.parent.postMessage({ event: 'start-game' }, '*');
		}
	</script>
	`;

	const jsContentWithCustomLoadImage = `
		${getClientDimensions}
		${triggerGameSessionAction}
		${getAsset}
		${jsContent}
	`;

	// Function to sync the user's game session score with a svelte store
	// this should be called everytime the game score changes
	function onScoreUpdate(score) {
		// Send message to parent window for game score to update
		window.parent.postMessage({ event: 'update-score', value: score }, '*');
	}

	// Function to handle game start event
	function onGameStart(update) {
		// Send message to parent window for game start event
		window.parent.postMessage({ event: 'start-game', value: update }, '*');
	}

	function onGameEnd(update) {
		// Send message to parent window for game end event
		window.parent.postMessage({ event: 'stop-game', value: update }, '*');
	}

	// Function to handle game session action events
	function onGameAction(action) {
		// Send message to parent window for game start event
		window.parent.postMessage({ event: action }, '*');
	}

	// Function to handle game pause event
	function onGamePause(update) {
		// Send message to parent window for game pause event
		window.parent.postMessage({ event: 'gamepause', value: update }, '*');
	}

	const srcdoc = `
	  <!DOCTYPE html>
	  <html style="touch-action: manipulation;">
	  <head>
		<script src="https://pixijs.download/release/pixi.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
		${cssContent}
	  </head>
	  <body style="--client_height: ${getHeight()}; --client_width: ${getWidth()};">
		<script>
			// Play Engine API Actions
			const gS = ${onGameStart};
			const gE = ${onGameEnd};
			const updateScore = ${onScoreUpdate};
			const gameAction = ${onGameAction};
			const gP = ${onGamePause};
		</script>
		${htmlContent}
		${jsContentWithCustomLoadImage}
	  </body>
	  </html>
	`;

	return srcdoc;
};

/**
 * This function builds the srcdoc
 *
 * @param {FileObject[]} files
 * @param {number} rootId
 * @param {ClientDimensionsObject} clientDimensions
 *
 * @returns {string}
 *
 */
const buildDynamicSrcDoc = (files, rootId, clientDimensions) => {
	if (!files || files.length === 0) {
		return {
			errorMessage: 'No files provided!'
		};
	}

	if (!rootId) {
		return {
			errorMessage: 'No rootId provided!'
		};
	}

	const relevantFiles = collectFiles(files, rootId);
	if (!relevantFiles) {
		return {
			errorMessage: `No files found with rootId ${rootId}!`
		};
	}

	return generateSrcDoc(relevantFiles, clientDimensions);
};

export default buildDynamicSrcDoc;
