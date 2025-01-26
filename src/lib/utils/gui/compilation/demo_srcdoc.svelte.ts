import BaseScreenLVL from '../presets/projectObject.svelte.ts';
import GameObject from '../presets/gameObject.svelte.ts';
import StaticObject from '../presets/staticObject.svelte.ts';
import DynamicObject from '../presets/dynamicObject.svelte.ts';

import { minify } from 'terser';

const minifySrcDoc = async (srcdoc: string): Promise<string> => {
	try {
		const minified = await minify(srcdoc, {
			mangle: true,
			compress: true,
			format: { comments: false }
		});
		return minified.code || srcdoc; // Fallback to original if no minified code
	} catch (error) {
		console.error('Error during srcdoc minification:', error);
		return srcdoc; // Fallback to unminified srcdoc on error
	}
};

/**
 * Serializes a function definition into a string.
 * @param funcDef - The func definition
 * @returns The serialized func as a string
 */
const serializeFunc = async (funcDef: Function): Promise<string> => {
	const funcCode = funcDef.toString();

	try {
		const minified = await minify(funcCode, {
			mangle: true, // Shortens variable and function names
			compress: true // Removes unnecessary spaces and lines
		});

		if (minified.code) {
			return minified.code;
		} else {
			throw new Error('Minification failed: No output code');
		}
	} catch (error) {
		console.error('Error during minification:', error);
		return funcCode; // Fallback to the unminified code
	}
};

/**
 *
 * @param config
 * @param gameId
 * @param parentFileId
 * @param fileId
 * @returns {FileObject}
 */
function generateClassFileFromJSON(
	config: ClassTemplate,
	gameId: number,
	parentFileId: number,
	fileId: number
): FileObject {
	const { className, baseClass, properties, methods } = config;

	// Build the properties
	const propertyCode = Object.entries(properties)
		.map(([key, value]) => {
			const defaultValue = typeof value === 'string' ? `'${value}'` : value;
			return `this.${key} = props.${key} || ${defaultValue};`;
		})
		.join('\n\t\t');

	// Build the methods
	const methodCode = Object.entries(methods)
		.map(([methodName, method]) => {
			const {
				params = [],
				body,
				static: isStatic = false,
				getter = false,
				setter = false
			} = method;

			// Build getter
			if (getter) {
				return `
    get ${methodName}() {
      ${body}
    }
        `;
			}

			// Build setter
			if (setter) {
				const paramList = params.join(', '); // Usually one parameter, e.g., ["value"]
				return `
    set ${methodName}(${paramList}) {
      ${body}
    }
        `;
			}

			// Build static or regular methods
			const paramList = params.join(', ');
			return `
		  ${isStatic ? 'static ' : ''}${methodName}(${paramList}) {
			${body}
		  }
			  `;
		})
		.join('\n');

	// Generate the class code
	const classCode = `
	class ${className} extends ${baseClass} {
	  constructor(props) {
		super({ ...props });
		${propertyCode}
	  }
	  ${methodCode}
	}
	`;

	// Return the object in the desired format
	return {
		id: fileId, // Pass in the file ID
		game_id: gameId, // The project ID
		parent_file_id: parentFileId, // Parent file ID (root folder)
		name: className.toLowerCase(), // Use the class name as the file name, in lowercase
		type: 'js', // File type
		content: classCode.trim().replace(/\n/g, '\\n'), // Flatten the class code with '\n',
		created_at: null,
		updated_at: null
	};
}

/**
 * This function retrieves a file by its ID.
 *
 * @param files - Array of FileObject
 * @param id - ID of the file to retrieve
 * @returns A FileObject or an ErrorObject
 */
const findFileById = (files: FileObject[], id: number): FileObject | ErrorObject => {
	if (!files || files.length === 0) {
		return { errorMessage: 'No files found!' };
	}

	if (!id) {
		return { errorMessage: 'No id provided!' };
	}

	return files.find((file) => file.id === id) ?? { errorMessage: `No file found with id ${id}!` };
};

/**
 * This function retrieves the children belonging to a file using its ID.
 *
 * @param files - Array of FileObject
 * @param parentId - ID of the parent file
 * @returns An array of FileObject or an ErrorObject
 */
const findChildren = (files: FileObject[], parentId: number): FileObject[] | ErrorObject => {
	if (!files || files.length === 0) {
		return { errorMessage: 'No files found!' };
	}

	if (!parentId) {
		return { errorMessage: 'No parentId provided!' };
	}

	const childrenFound = files.filter((file) => file.parent_file_id === parentId);

	return childrenFound.length > 0
		? childrenFound
		: { errorMessage: `No children found for file with id ${parentId}!` };
};

/**
 * This function recursively collects files under a root folder.
 *
 * @param files - Array of FileObject
 * @param rootId - ID of the root file
 * @param collected - Accumulator for collected files
 * @returns An array of FileObject or an ErrorObject
 */
const collectFiles = (
	files: FileObject[],
	rootId: number | null,
	collected: FileObject[] = []
): FileObject[] | ErrorObject => {
	if (!files || files.length === 0) {
		return { errorMessage: 'No files found!' };
	}

	if (!rootId) {
		return { errorMessage: 'No rootId provided!' };
	}

	const rootFile = findFileById(files, rootId);
	if ('errorMessage' in rootFile) {
		return rootFile; // Propagate the error
	}

	if (rootFile.type === 'folder') {
		const children = findChildren(files, rootId);
		if (Array.isArray(children)) {
			children.forEach((child) => collectFiles(files, child.id, collected));
		}
	}

	collected.push(rootFile);
	return collected;
};

/**
 * This function resolves dependencies in a file.
 *
 * @param file - A FileObject
 * @returns The content of the file or an ErrorObject
 */
const resolveDependencies = (file: FileObject): string | ErrorObject => {
	if (!file) {
		return { errorMessage: 'No file provided!' };
	}

	return file.content ?? '';
};

/**
 * Generates the `srcdoc` for the iframe, embedding base class definitions.
 * @param files - Array of FileObject
 * @param clientDimensions - Dimensions of the client
 * @returns A srcdoc string or an ErrorObject
 */
const generateSrcDoc = async (
	files: FileObject[],
	clientDimensions: ClientDimensionsObject
): Promise<string | ErrorObject> => {
	if (!files || files.length === 0) {
		return { errorMessage: 'No files provided!' };
	}

	let htmlContent = '';
	let cssContent = '';
	let jsContent = '';

	files.forEach((file) => {
		const resolvedContent = resolveDependencies(file);
		if (typeof resolvedContent !== 'string') return; // Skip if there's an error

		if (file.type === 'html') {
			htmlContent += resolvedContent;
		} else if (file.type === 'css') {
			cssContent += `<style>${resolvedContent}</style>`;
		} else if (file.type === 'js') {
			jsContent += `${resolvedContent}\n`;
		}
	});

	// Serialize Base Classes
	const baseClasses = `
	  ${serializeFunc(BaseScreenLVL)}
	  ${serializeFunc(GameObject)}
	  ${serializeFunc(StaticObject)}
	  ${serializeFunc(DynamicObject)}
	`;

	// Combine base classes and user JS content
	const jsContentWithBaseClasses = `
	  ${baseClasses}
	  ${jsContent}
	`;

	const getWidth = () => clientDimensions.width;
	const getHeight = () => clientDimensions.height;

	const srcdoc = `
	  <!DOCTYPE html>
	  <html>
		<head>
		  ${cssContent}
		</head>
		<body style="width: ${getWidth()}px; height: ${getHeight()}px;">
		  ${htmlContent}
		  <script>
			${jsContentWithBaseClasses}
		  </script>
		</body>
	  </html>
	`;

	return await minifySrcDoc(srcdoc.trim());
};

/**
 * This function builds the srcdoc.
 *
 * @param files - Array of FileObject
 * @param rootId - ID of the root file
 * @param clientDimensions - Dimensions of the client
 * @returns A srcdoc string or an ErrorObject
 */
const buildDynamicSrcDoc = async (
	files: FileObject[],
	rootId: number,
	clientDimensions: ClientDimensionsObject
): Promise<string | ErrorObject> => {
	if (!files || files.length === 0) {
		return { errorMessage: 'No files provided!' };
	}

	if (!rootId) {
		return { errorMessage: 'No rootId provided!' };
	}

	const relevantFiles = collectFiles(files, rootId);
	if ('errorMessage' in relevantFiles) {
		return relevantFiles; // Propagate the error
	}

	return await generateSrcDoc(relevantFiles, clientDimensions);
};

export {
	generateClassFileFromJSON,
	findFileById,
	findChildren,
	collectFiles,
	generateSrcDoc,
	buildDynamicSrcDoc
};
