Ext.regModel('Contacts.Contact', {
	// Register the local storage proxy
	proxy: {
		type: 'localstorage',
		id: 'contacts'
	},

	fields: [
		'id',
		'firstName',
		'lastName',
		'address',
		'city',
		'state',
		'zip',
		'phone'
	],

	validations: [
		{type: 'presence', name: 'firstName', message: 'Please enter a first name'},
		{type: 'presence', name: 'lastName', message: 'Please enter a last name'},
		{type: 'presence', name: 'address', message: 'Please enter an address'},
		{type: 'presence', name: 'city', message: 'Please enter a city'},
		{type: 'presence', name: 'state', message: 'Please enter a state'},
		{type: 'presence', name: 'zip', message: 'Please enter a zip'},
		{type: 'presence', name: 'phone', message: 'Please enter a phone'}
	]
});

// Register a data store by passing a config object with the model to be used and a storeId
//Ext.regStore({
//	model : 'MyApp.Contact',
//	storeId: 'MyApp.ListStore'
//});
