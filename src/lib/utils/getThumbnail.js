import htmlToImage from 'html-to-image';

/**
 * This function retrieves the root file ID.
 *
 * @param {HTMLElement} srcdoc - the srcdoc of the iframe.
 * @returns {Promise<string|null>} - The base64 string of the thumbnail image or null if it fails.
 */
export const getThumbnail = async (srcdoc) => {
	let thumbnail;
	await htmlToImage?.toPng(srcdoc).then(function (dataUrl) {
		thumbnail = dataUrl;
	});

	return thumbnail || null;
};
