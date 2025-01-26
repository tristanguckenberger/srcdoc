class GameObject implements GameObjectInterface {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;

	constructor({
		id,
		x = 0,
		y = 0,
		width = 50,
		height = 50,
		color = '#000'
	}: Partial<GameObjectInterface> & { id?: string }) {
		this.id = id || `object-${Date.now()}`;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}

	draw(context: CanvasRenderingContext2D) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
}

export default GameObject;
