/**
 * @class Contacts.ContactMapPanel
 * @extends Ext.Panel
 *
 * This panel displays a contact's mapped address.
*/
Contacts.ContactMapPanel = Ext.extend(Ext.Panel, {
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
		console.log("initializing ContactMapPanel");
		this.dockedItems = this.buildToolbars();
		var map = new Ext.Map({
		    title: 'Map',
		    mapOptions: {
			    zoom: 12
		    }
	    });
	    this.items = [map];

		geocoder = new google.maps.Geocoder();
	    geocoder.geocode( { 'address': this.address }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map.map,
					position: results[0].geometry.location
				});
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
Ext.reg('contactMapPanel', Contacts.ContactMapPanel);
