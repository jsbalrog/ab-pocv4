// The store acts as a client-side cache
MyApp.ListStore = new Ext.data.Store({
    model: 'MyApp.Contact'
	,sorters: ['lastName']  // Sort by last name
	,getGroupString : function(record) {
	    return record.get('lastName')[0];
	}
	,data: [
//        {firstName: 'Todd',     lastName: 'Giles',        address: '1920 Bryan Avenue',    city: 'Salt Lake City', state: 'UT', zip:'84109'},
    ]
});