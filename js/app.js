Ext.regApplication('Contacts', {
	name : 'Contacts',

	launch: function() {
		this.viewport = new Contacts.Viewport({
			application: this
		});
		Ext.dispatch({
			controller	: 'ContactController',
			action		: 'index'
		});
	}
});
