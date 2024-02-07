/**
 * @typedef {Object} FileObject
 * @property {string} name - The name of the file.
 * @property {string} type - The type of the file (e.g., 'folder', 'file').
 * @property {number} id - The ID of the file.
 */

/**
 * This function retrieves the root file ID.
 *
 * @param {FileObject[]} files - An array of file objects.
 * @returns {number|null} The ID of the root file, or null if not found.
 */
export const getRootFileId = (files = []) => {
	try {
		const rootFile = files?.find((file) => {
			return file.name === 'root' && file.type === 'folder';
		});

		if (rootFile) {
			return rootFile.id;
		} else {
			console.log('No root file found! Please create a file named "index.html" and try again.');
			return null;
		}
	} catch (error) {
		console.log('getRootFileId::error::', error);
		return null;
	}
};
