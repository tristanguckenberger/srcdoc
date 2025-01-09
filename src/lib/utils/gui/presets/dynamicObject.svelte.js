// @ts-nocheck
class DynamicObject extends GameObject {
	constructor(props) {
		super(props);
		this.type = 'dynamic'; // Identifier for dynamic objects
		this.velocity = { x: 0, y: 0 };
		this.acceleration = { x: 0, y: 0 };
		this.mass = props.mass || 1; // Default mass
		this.physicsEnabled = props.physicsEnabled || false; // Enable/disable physics
	}

	update(deltaTime) {
		if (this.physicsEnabled) {
			this.velocity.x += this.acceleration.x * deltaTime;
			this.velocity.y += this.acceleration.y * deltaTime;
			this.x += this.velocity.x * deltaTime;
			this.y += this.velocity.y * deltaTime;
		}
	}
}

export default DynamicObject;
