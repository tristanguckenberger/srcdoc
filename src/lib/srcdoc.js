// /**
//  * Build srcdoc for editor output`
//  * @param {string} html
//  * @param {string} css
//  * @param {string} js
//  */
// export default function buildDoc(html = '', css = '', js = '') {
// 	return `
// 		<head>
// 			<style>html{height: 100%;}${css}</style>
// 			<script>(function(){function handle_message(ev) {let { action, cmd_id } = ev.data;const send_message = (payload) => parent.postMessage( { ...payload }, ev.origin);const send_reply = (payload) => send_message({ ...payload, cmd_id });const send_ok = () => send_reply({ action: 'cmd_ok' });const send_error = (message, stack) => send_reply({ action: 'cmd_error', message, stack });if (action === 'eval') {try {const { script } = ev.data.args;eval(script);send_ok();} catch (e) {send_error(e.message, e.stack);}}if (action === 'catch_clicks') {try {const top_origin = ev.origin;document.body.addEventListener('click', event => {if (event.which !== 1) return;if (event.metaKey || event.ctrlKey || event.shiftKey) return;if (event.defaultPrevented) return;let el = event.target;while (el && el.nodeName !== 'A') el = el.parentNode;if (!el || el.nodeName !== 'A') return;if (el.hasAttribute('download') || el.getAttribute('rel') === 'external' || el.target) return;event.preventDefault();if (el.href.startsWith(top_origin)) {const url = new URL(el.href);if (url.hash[0] === '#') {window.location.hash = url.hash;return;}}window.open(el.href, '_blank');});send_ok();} catch(e) {send_error(e.message, e.stack);}}}window.addEventListener('message', handle_message, false);window.onerror = function (msg, url, lineNo, columnNo, error) {parent.postMessage({ action: 'error', value: error }, '*');};window.addEventListener(\"unhandledrejection\", event => {parent.postMessage({ action: 'unhandledrejection', value: event.reason }, '*');});}).call(this);let previous = { level: null, args: null };['clear', 'log', 'info', 'dir', 'warn', 'error'].forEach((level) => {const original = console[level];console[level] = (...args) => {if (previous.level === level &&previous.args.length === args.length &&previous.args.every((a, i) => a === args[i])) {parent.postMessage({ action: 'console', level, duplicate: true }, '*');} else {previous = { level, args };try {parent.postMessage({ action: 'console', level, args }, '*');} catch (err) {parent.postMessage({ action: 'console', level: 'unclonable' }, '*');}}original(...args);}})<\/script>
// 		</head>
// 		<body style="
// 		height: 100%;
// 		margin: 0;
// 		top: 0;
// 		position: relative;
// 	">
// 			${html ?? '<div></div>'}
// 			<script>${js ?? ''}</script>
// 		</body>
// 	`;
// }
// @ts-nocheck

// Utility function to find a file by its ID in the files object
const findFileById = (files, id) => files?.find((file) => file.id === id);

// Utility function to find children of a folder in the files object
const findChildren = (files, parentId) => files.filter((file) => file.parentFileId === parentId);

// Function to recursively collect all relevant files starting from a root file
const collectFiles = (files, rootId, collected = []) => {
	console.log('collectFiles::', files);
	const rootFile = findFileById(files, rootId);
	if (!rootFile) return;

	collected = [...collected, rootFile];

	if (rootFile.type === 'folder') {
		const children = findChildren(files, rootId);
		children.forEach((child) => collectFiles(files, child.id, collected));
	}

	console.log('collectFiles::', collected);

	return collected;
};

// Function to resolve dependencies in a file's content
const resolveDependencies = (file, files) => {
	// For now, we assume that files refer to other files using a simple string match.
	// In a more advanced version, you could use regular expressions to accurately
	// identify import or link statements.

	console.log('resolveDependencies::', files);

	let content = file.content;

	files.forEach((dependency) => {
		if (content.includes(dependency.name)) {
			content = content.replace(dependency.name, dependency.content);
		}
	});

	return content;
};

// Function to generate the srcdoc string
const generateSrcDoc = (files) => {
	let htmlContent = '';
	let cssContent = '';
	let jsContent = '';

	console.log('generateSrcDoc::', files);

	files.forEach((file) => {
		const resolvedContent = resolveDependencies(file, files);

		if (file.type === 'html') {
			htmlContent += resolvedContent;
		} else if (file.type === 'css') {
			cssContent += `<style>${resolvedContent}</style>`;
		} else if (file.type === 'js') {
			jsContent += `<script>${resolvedContent}</script>`;
		}
	});

	return `
	  <!DOCTYPE html>
	  <html>
	  <head>
		${cssContent}
	  </head>
	  <body>
		${htmlContent}
		${jsContent}
	  </body>
	  </html>
	`;
};

// Main function to build dynamic srcdoc
const buildDynamicSrcDoc = (files, rootId) => {
	console.log('buildDynamicSrcDoc::', files);
	const relevantFiles = collectFiles(files, rootId);

	if (!relevantFiles) return '';

	return generateSrcDoc(relevantFiles);
};

export default buildDynamicSrcDoc;
