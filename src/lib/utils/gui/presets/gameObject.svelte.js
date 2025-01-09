//@ts-nocheck
class GameObject {
	constructor({ id, x = 0, y = 0, width = 50, height = 50, color = '#000' }) {
		this.id = id || `object-${Date.now()}`;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}

	/**
	 *
	 * @param {CanvasRenderingContext2D} context
	 */
	draw(context) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
}

export default GameObject;
