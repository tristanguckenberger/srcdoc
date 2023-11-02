// @ts-nocheck
/**
 * @typedef {Object} FileObject
 * @property {string} name - The name of the file.
 * @property {string} type - The type of the file (e.g., 'folder', 'html', 'css', 'js').
 * @property {number} id - The ID of the file.
 * @property {number} parentFileId - The ID of the parent file.
 * @property {string} content - The content of the file.
 *
 * @typedef {Object} LibraryObject
 * @property {string} name - The name of the library.
 * @property {string} type - The type of the library (e.g., 'css', 'js').
 * @property {string} url - The hosted URL of the library.
 *
 *
 * @typedef {Object} ErrorObject
 * @property {string} errorMessage - The error message.
 *
 * <script>(function(){function handle_message(ev) {let { action, cmd_id } = ev.data;const send_message = (payload) => parent.postMessage( { ...payload }, ev.origin);const send_reply = (payload) => send_message({ ...payload, cmd_id });const send_ok = () => send_reply({ action: 'cmd_ok' });const send_error = (message, stack) => send_reply({ action: 'cmd_error', message, stack });if (action === 'eval') {try {const { script } = ev.data.args;eval(script);send_ok();} catch (e) {send_error(e.message, e.stack);}}if (action === 'catch_clicks') {try {const top_origin = ev.origin;document.body.addEventListener('click', event => {if (event.which !== 1) return;if (event.metaKey || event.ctrlKey || event.shiftKey) return;if (event.defaultPrevented) return;let el = event.target;while (el && el.nodeName !== 'A') el = el.parentNode;if (!el || el.nodeName !== 'A') return;if (el.hasAttribute('download') || el.getAttribute('rel') === 'external' || el.target) return;event.preventDefault();if (el.href.startsWith(top_origin)) {const url = new URL(el.href);if (url.hash[0] === '#') {window.location.hash = url.hash;return;}}window.open(el.href, '_blank');});send_ok();} catch(e) {send_error(e.message, e.stack);}}}window.addEventListener('message', handle_message, false);window.onerror = function (msg, url, lineNo, columnNo, error) {parent.postMessage({ action: 'error', value: error }, '*');};window.addEventListener(\"unhandledrejection\", event => {parent.postMessage({ action: 'unhandledrejection', value: event.reason }, '*');});}).call(this);let previous = { level: null, args: null };['clear', 'log', 'info', 'dir', 'warn', 'error'].forEach((level) => {const original = console[level];console[level] = (...args) => {if (previous.level === level &&previous.args.length === args.length &&previous.args.every((a, i) => a === args[i])) {parent.postMessage({ action: 'console', level, duplicate: true }, '*');} else {previous = { level, args };try {parent.postMessage({ action: 'console', level, args }, '*');} catch (err) {parent.postMessage({ action: 'console', level: 'unclonable' }, '*');}}original(...args);}})<\/script>
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

	return (
		files.filter((file) => file.parentFileId === parentId) ?? {
			errorMessage: `No children found for file with id ${parentId}!`
		}
	);
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
const resolveDependencies = (file, files) => {
	if (!file) {
		return {
			errorMessage: 'No file provided!'
		};
	}

	let content = file.content;
	if (content) {
		files.forEach((dependency) => {
			if (content.includes(dependency.name)) {
				content = content.replace(dependency.name, dependency.content);
			}
		});
	}

	return content;
};

/**
 * This function generates the srcdoc
 *
 * @param {FileObject[]} files
 * @param {LibraryObject[]} libraries
 *
 * @returns {string|ErrorObject}
 */
const generateSrcDoc = (files, libraries) => {
	if (!files || files.length === 0) {
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

		if (file.type === 'html') {
			htmlContent += resolvedContent;
		} else if (file.type === 'css') {
			cssContent += `<style>${resolvedContent}</style>`;
		} else if (file.type === 'js') {
			jsContent += `<script>${resolvedContent}</script>`;
		}
	});

	libraries?.forEach((library) => {
		if (library.type === 'css') {
			cssContent += `<link rel="stylesheet" href="${library.url}">`;
		} else if (library.type === 'js') {
			jsContent += `<script src="${library.url}"></script>`;
		} else if (library.type === 'module') {
			jsContent += `<script type="module" src="${library.url}"></script>`;
		}
	});

	// get all assets and build a lookup table
	const assetLookupString = () => {
		const assetLookup = {};
		files.forEach((file) => {
			if (file.type === 'image' || file.type === 'audio' || file.type === 'png') {
				assetLookup[`${file.name}.${file.type}`] = file.content;
			}
		});

		return JSON.stringify(assetLookup);
	};

	const customLoadImageString = `
	<script>
		function customLoadImage(scene, key, url) {
			const assetLookup = ${assetLookupString()};
			const actualUrl = assetLookup[url] || url;
			scene?.load?.image(key, actualUrl);
		}
	</script>
	`;

	const jsContentWithCustomLoadImage = `
		${customLoadImageString}
		${jsContent}
	`;

	return `
	  <!DOCTYPE html>
	  <html>
	  <head>
	  <script src="//cdn.jsdelivr.net/npm/phaser@3.11.0/dist/phaser.js"></script>
		${cssContent}
	  </head>
	  <body>
		${htmlContent}
		${jsContentWithCustomLoadImage}
	  </body>
	  </html>
	`;
};

/**
 * This function builds the srcdoc
 *
 * @param {FileObject[]} files
 * @param {number} rootId
 *
 * @returns {string}
 *
 */
const buildDynamicSrcDoc = (files, rootId) => {
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

	return generateSrcDoc(relevantFiles);
};

export default buildDynamicSrcDoc;
