// @ts-nocheck
import BaseScreenLVL from '../presets/projectObject.svelte.ts';
import GameObject from '../presets/gameObject.svelte.ts';
import StaticObject from '../presets/staticObject.svelte.ts';
import DynamicObject from '../presets/dynamicObject.svelte.ts';

/**
 * Serializes a function definition into a string.
 * @param funcDef - The func definition
 * @returns The serialized func as a string
 */
const serializeFunc = (funcDef: Function): string => {
	return funcDef.toString();
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
	game_id: number,
	parent_file_id: number,
	fileId: number | null
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

	window.addEventListener('load', () => {
		const canvas = document.getElementById('gameCanvas');
		const dpr = window.devicePixelRatio || 1;
		canvas.width = window.innerWidth * dpr;
		canvas.height = window.innerHeight * dpr;
		canvas.style.width = \`\${window.innerWidth}px\`;
		canvas.style.height = \`\${window.innerHeight}px\`;

		const game = new StarterScreen({ canvas });
		game.initialize(ctx);

		// Start the game loop
		game.startGameLoop(ctx);

	});
	`;

	// Return the object in the desired format
	return {
		id: fileId, // Pass in the file ID
		game_id: game_id, // The project ID
		parent_file_id: parent_file_id, // Parent file ID (root folder)
		name: className.toLowerCase(), // Use the class name as the file name, in lowercase
		type: 'js', // File type
		content: classCode.trim(), //.replace(/\n/g, '\\n'), // Flatten the class code with '\n',
		created_at: null,
		updated_at: null
	};
}

/**
 * Generates the base files and a starter game/screen file.
 * @returns {FileObject[]}
 */
function getBaseFiles(gameId: number, rootFileId: number): FileObject[] {
	const baseFiles: FileObject[] = [
		{
			id: null,
			game_id: gameId,
			parent_file_id: rootFileId,
			name: 'gameObject',
			type: 'js',
			content: serializeFunc(GameObject),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		},
		{
			id: null,
			game_id: gameId,
			parent_file_id: rootFileId,
			name: 'staticObject',
			type: 'js',
			content: serializeFunc(StaticObject),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		},
		{
			id: null,
			game_id: gameId,
			parent_file_id: rootFileId,
			name: 'dynamicObject',
			type: 'js',
			content: serializeFunc(DynamicObject),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		}
	];

	// Generate starter game/screen file
	const starterScreenFile: FileObject = generateClassFileFromJSON(
		{
			className: 'StarterScreen',
			baseClass: 'BaseScreenLVL',
			properties: {
				width: 800,
				height: 600,
				canvas: null,
				backgroundColor: '#000000'
			},
			methods: {
				initialize: {
					params: ['context'],
					body: `console.log('Initializing Starter Screen');`
				},
				draw: {
					params: [],
					body: `
            if (!this.canvas) {
              console.error('Canvas instance is not set.');
              return;
            }
            this.context.fillStyle = this.backgroundColor;
            this.context.fillRect(0, 0, this.width, this.height);
          `
				},
				setCanvas: {
					params: ['canvas'],
					body: `this.canvas = canvas;`
				},
				startGameLoop: {
					params: [],
					body: `
					let lastTimestamp = 0;

					const gameLoop = (timestamp) => {
						const deltaTime = (timestamp - lastTimestamp) / 1000;
						lastTimestamp = timestamp;

						this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

						this.update(deltaTime);
						this.draw();

						if (this.running) {
							requestAnimationFrame(gameLoop);
						}
					};

					requestAnimationFrame(gameLoop);
					`
				},
				update: {
					params: ['deltaTime'],
					body: `console.log('Updating Starter Screen');`
				}
			}
		},
		gameId,
		rootFileId,
		null
	);

	return [...baseFiles, starterScreenFile];
}

/**
 * Builds screen groups dynamically by associating UI screens with each "lvl" screen.
 */
const buildScreenGroup = (gameData: {
	screens: { id: number; type: string }[];
}): Record<number, number[]> => {
	const screenGroup: Record<number, number[]> = {};

	const lvlScreens = gameData?.screens?.filter((screen) => screen?.type === 'lvl');

	lvlScreens?.forEach((lvlScreen) => {
		const associatedUIScreens = gameData?.screens?.filter((screen) => screen?.type === 'ui');
		screenGroup[lvlScreen?.id] = [lvlScreen?.id, ...associatedUIScreens?.map((ui) => ui?.id)];
	});

	return screenGroup;
};

/**
 * Collects files recursively under a given root folder.
 */
const collectFiles = (
	files: FileObject[],
	rootId: number,
	collected: FileObject[] = []
): FileObject[] | ErrorObject => {
	if (!files || files.length === 0) return { errorMessage: 'No files found!' };

	const rootFile = files.find((file) => file.id === rootId);
	if (!rootFile) return { errorMessage: `No file found with id ${rootId}!` };

	if (rootFile.type === 'folder') {
		const children = files.filter((file) => file.parent_file_id === rootId);
		children.forEach((child) => collectFiles(files, child.id, collected));
	}

	collected.push(rootFile);
	return collected;
};

/**
 * Resolves dependencies in a file.
 */
const resolveDependencies = (file: FileObject): string | ErrorObject => {
	return file?.content ?? { errorMessage: 'File content not found!' };
};

/**
 * Generates the `srcdoc` for the iframe by embedding the compiled screens and their dependencies.
 */
const generateSrcDoc = (
	compiledScreen: CompiledScreen,
	clientDimensions: ClientDimensionsObject
): string => {
	console.log('IN generateSrcDoc::');

	let doc = ``,
		htmlContent = '',
		cssContent = '',
		jsContent = '';

	try {
		compiledScreen?.compiledFiles?.forEach((file) => {
			const content = resolveDependencies(file);
			if (typeof content !== 'string') return;

			if (file?.type === 'html') htmlContent += content;
			else if (file?.type === 'css') cssContent += `<style>${content}</style>`;
			else if (file?.type === 'js') jsContent += `${content}`;
		});
		console.log('htmlContent::', htmlContent);
		console.log('cssContent::', cssContent);
		console.log('jsContent::', jsContent);
		doc = `
			<!DOCTYPE html>
			<html>
			  <head>${cssContent}</head>
			  <body style="width: ${clientDimensions.width}px; height: ${clientDimensions.height}px;">
				${htmlContent}
				<script>${jsContent}</script>
			  </body>
			</html>
		  `;
		console.log('doc::', doc);
		return doc;
	} catch (error) {
		console.log('Error in generateSrcDoc::', error);
	}

	return { errorMessage: 'Error generating srcdoc!' };
};

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
 * Builds the compiled screen object from the game data and prepares it for rendering.
 */
const buildDynamicSrcDoc = (
	gameData: { screens: { id: number; type: string }[] },
	currentScreenId: number,
	files: FileObject[],
	rootId: number,
	clientDimensions: ClientDimensionsObject
): string | ErrorObject => {
	try {
		if (!files || files.length === 0) return { errorMessage: 'No files provided!' };

		const screenGroup = buildScreenGroup(gameData);

		const compiledScreens = Object.entries(screenGroup).map(([lvlScreenId, groupedScreenIds]) => {
			const screenFiles = files.filter((file) => groupedScreenIds.includes(file.screen_id));
			return { screen_id: Number(lvlScreenId), compiledFiles: screenFiles };
		});

		if (compiledScreens?.length === 0) return { errorMessage: 'No compiled screens available!' };

		console.log('compiledScreens::', compiledScreens);

		// Generate srcdoc where compiledScreens[i] is the current screen
		if (currentScreenId) {
			const currentScreen = compiledScreens?.find(
				(screen) => screen?.screen_id === currentScreenId
			);
			if (!currentScreen) return { errorMessage: `No screen found with id ${currentScreenId}!` };
			const src = generateSrcDoc(currentScreen, clientDimensions);
			console.log('src::', src);
			return src;
		}

		// If no current screen is provided, default to the first screen
		return generateSrcDoc(compiledScreens[0], clientDimensions);
	} catch (error) {
		console.log('Error in buildDynamicSrcDoc::', error);
	}
};

export {
	getBaseFiles,
	generateClassFileFromJSON,
	findFileById,
	findChildren,
	collectFiles,
	generateSrcDoc,
	buildDynamicSrcDoc,
	buildScreenGroup
};
