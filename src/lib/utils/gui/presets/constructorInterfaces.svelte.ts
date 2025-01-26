interface MethodTemplate {
	params: string[];
	body: string;
	static?: boolean;
	getter?: boolean;
	setter?: boolean;
}

interface ClassTemplate {
	className: string;
	baseClass: string;
	properties: Record<string, any>;
	methods: Record<string, MethodTemplate>;
}

/**
 * TODO: After modifying backend & db to handle 'screens',
 * I'll need to add a screen_id field. Files will need to
 * be linked to screens, and screens linked to games.
 */
interface FileObject {
	id: number | null;
	game_id: number;
	parent_file_id: number | null;
	name: string;
	type: string;
	content: string | null;
	created_at: string | null;
	updated_at: string | null;
}

interface ErrorObject {
	errorMessage: string;
}

interface ClientDimensionsObject {
	width: number;
	height: number;
}

interface GameObjectInterface {
	id: string; // Unique identifier
	x: number; // X-coordinate position
	y: number; // Y-coordinate position
	width: number; // Width of the object
	height: number; // Height of the object
	color: string; // Color of the object

	// Method to draw the object on a canvas
	draw(context: CanvasRenderingContext2D): void;
}

interface StaticObjectInterface extends GameObjectInterface {
	type: 'static'; // Static identifier
}

interface DynamicObjectInterface extends GameObjectInterface {
	type: 'dynamic'; // Dynamic identifier
	velocity?: { x: number; y: number };
	acceleration?: { x: number; y: number };
	mass?: number;
	physicsEnabled?: boolean;
}
