// __mocks__/@sveltejs/kit.js
export const page = {
	subscribe: (fn) => {
		fn({
			url: new URL('http://localhost/'),
			params: {},
			route: {
				id: null
			},
			status: 200,
			error: null
		});
		return () => {};
	}
};

export const session = {
	subscribe: (fn) => {
		fn({
			id: 1
		});
		return () => {};
	}
};

export const browser = true;
export const afterNavigate = () => {};
export const beforeNavigate = () => {};
