import GameObject from './gameObject.svelte';
class DynamicObject extends GameObject implements DynamicObjectInterface {
	type: 'dynamic';
	velocity: { x: number; y: number };
	acceleration: { x: number; y: number };
	mass: number;
	physicsEnabled: boolean;

	constructor(props: Partial<DynamicObjectInterface>) {
		super(props);
		this.type = 'dynamic'; // Identifier for dynamic objects
		this.velocity = { x: 0, y: 0 };
		this.acceleration = { x: 0, y: 0 };
		this.mass = props.mass || 1; // Default mass
		this.physicsEnabled = props.physicsEnabled || false; // Enable/disable physics
	}

	update(deltaTime: number) {
		if (this.physicsEnabled) {
			this.velocity.x += this.acceleration.x * deltaTime;
			this.velocity.y += this.acceleration.y * deltaTime;
			this.x += this.velocity.x * deltaTime;
			this.y += this.velocity.y * deltaTime;
		}
	}
}

export default DynamicObject;
