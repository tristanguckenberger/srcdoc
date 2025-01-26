import GameObject from './gameObject.svelte';
class StaticObject extends GameObject implements StaticObjectInterface {
	type: 'static';

	constructor(props: Partial<StaticObjectInterface>) {
		super(props);
		this.type = 'static'; // Identifier for static objects
	}
}

export default StaticObject;
