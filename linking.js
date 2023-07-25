const config = {
	screens: {
		Signup: {
			path: 'Signup/:data',
			parse: {
				data: (data) => `${data}`
			}
		}
	}
};

const linking = {
	prefixes: [ 'irevu://' ], // demo://Guia/details/17
	config
};

export default linking;
