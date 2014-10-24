/**
 * @class Contacts.ContactDrivePanel
 * @extends Ext.Panel
 *
 * This panel displays a contact's mapped address.
*/
Contacts.ContactDrivePanel = Ext.extend(Ext.Panel, {
	layout: 'fit',

	address: "",

	model: null,

	constructor : function(model) {
		this.model = model;
		this.address = model.data.address  + ' ' +
				model.data.city + ' ' +
				model.data.state + ' ' +
				model.data.zip;
		console.log(this.model);
		console.log('address: ' + this.address);

		// Drill through the prototype chain to make a "super" call
		Contacts.ContactFormPanel.superclass.constructor.apply(this);
	},

	initComponent : function () {
		console.log("initializing ContactDrivePanel");
		this.dockedItems = this.buildToolbars();
		var map = new Ext.Map({
		    title: 'Map',
		    mapOptions: {
			    zoom: 12
		    }
	    });
	    this.items = [map];

		var start = '915 4th st, modesto, ca';
		var end = this.address;
		var request = {
			origin		: start,
			destination	: end,
			travelMode	: google.maps.DirectionsTravelMode.DRIVING
		};

		var directionsDisplay = new google.maps.DirectionsRenderer();
		var directionsService = new google.maps.DirectionsService();
		var geocoder = new google.maps.Geocoder();

		directionsService.route(request, function(results, status) {
			if(status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(results);
				directionsDisplay.setMap(map.map);
        	} else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });

		Contacts.ContactFormPanel.superclass.initComponent.call(this);
	},

	buildToolbars : function() {
		return [
			{
				xtype : 'toolbar',
				dock  : 'top',
				title: 'Map Contact Address',
				items : [
					{
						text : 'Back',
						ui   : 'back',
						handler : this.back,
						scope: this // This is necessary for scoping the object's model object correctly
					}
				]
			}
		]
	},

	back : function(btn, evt) {
		console.log('Model in the back function: ' + this.model);
		this.fireEvent('backToDetails', this.model);
	},
	setModel : function(model) {
		this.model = model;
	}

});

// So that lazy instantiation may be used in creating ContactMapPanels
Ext.reg('contactMapPanel', Contacts.ContactDrivePanel);
