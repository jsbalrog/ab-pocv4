/**
 * Controller that defines actions to list, create, edit, and delete contacts.
 */
Ext.regController('ContactController', {

	/**
	 * Default action on app startup.
	 */
	index : function() {

		// Set up a contactListPanel from the get-go, to be re-used for displaying the list.
		this.contactListPanel = this.render({
			xtype		: 'contactListPanel',
			listeners	: {
				scope			: this,
				addTap			: this.addContact,
				editContact 	: this.editContact,
				deleteContact 	: this.deleteContact
				// It's a good idea to destroy the panels you're not using anymore,
				// otherwise they clutter up the DOM.
//				deactivate	: function(contactListPanel) {
//					contactListPanel.destroy();
//				}
			}
		});

		// Set up a contactFormPanel from the get-go, to be re-used for both an "add contact"
		// and an "edit contact" situation.
		this.contactFormPanel = this.render({
			xtype : 'contactFormPanel',
			listeners	: {
				scope			: this,
				backToList		: this.goBackToList,
				save			: this.create,
				showMap			: this.showMap,
				showDirections	: this.showDirections,
				// On form activation, de-select any list items on the list panel
				activate: function() {
					this.contactListPanel.list.getSelectionModel().deselectAll();
				}
//				deactivate	: function(contactFormPanel) {
//					contactFormPanel.destroy();
//				}
			}
		});

		this.application.viewport.setActiveItem(this.contactListPanel);
	},

	/**
	 * Called when "backToList" custom event is fired in ContactFormPanel.
	 */
	goBackToList : function() {
		console.log(this.contactListPanel.list);
		this.application.viewport.setActiveItem(this.contactListPanel, {type:'slide', direction:'right'});
	},

	/**
	 * Called when "addTap" custom event is fired in ContactListPanel.
	 *
	 * @param cmp
	 * @param evt
	 */
	addContact : function(cmp, evt) {
		console.log("In ContactListController.addContact()");
		var model = this.genNewModel();
		this.contactFormPanel.loadRecord(model);
		// If there is a map button on the form, remove it, since this is an "add".
		if(this.contactFormPanel.getComponent('contactFormToolbar').getComponent('mapButton')) {
			this.contactFormPanel.getComponent('contactFormToolbar').remove('mapButton');
		}
		this.contactFormPanel.getComponent('contactFormToolbar').doLayout();
		this.application.viewport.setActiveItem(this.contactFormPanel, {type:'slide', direction:'left'});
	},

	create: function(cmp, evt) {
		console.log("In ContactController.create()");
		// Get either the model used to populate the form panel OR if none (i.e. on an add), a brand new model
		var toBeSavedRecord = Ext.ModelMgr.create(this.contactFormPanel.getValues(), "Contacts.Contact");
		console.log(toBeSavedRecord);
		// Create a model instance with the current values of the form
//		this.contactFormPanel.updateRecord(currentRecord);
		// Validate the retrieved record
		var errors = toBeSavedRecord.validate(),message = "";
		if(errors.isValid()) {
			console.log("valid");
			// Save/update the retrieved record, and reload the store to get changes
			var currentRecord = this.contactFormPanel.getRecord();
			this.contactFormPanel.updateRecord(currentRecord);
			console.log(currentRecord);
			currentRecord.save();
			this.contactListPanel.store.load();
			this.contactListPanel.store.sort();
			this.application.viewport.setActiveItem(this.contactListPanel, {type:'slide', direction:'right'});
		} else {
			// If validation errors, show a message
			console.log("invalid");
			Ext.each(errors.items,function(rec,i){
				message += rec.message+"<br>";
			});
			Ext.Msg.alert("Validate", message, function(){});
			return false;
		}
    },

	/**
	 * Called when "editContact" custom event is fired in ContactListPanel.
	 * 
	 * @param model
	 */
	editContact : function(model) {
		console.log("In ContactController.editContact()");
		this.contactFormPanel.loadRecord(model);
//		this.contactFormPanel.setModel(model);
		// If there is no map button already, then create it!
		if(!this.contactFormPanel.getComponent('contactFormToolbar').getComponent('mapButton')) {
			var myToolbar = this.contactFormPanel.getComponent('contactFormToolbar');
			var mapButton = new Ext.Button({
				itemId		: 'mapButton',
				text 		: 'Map',
				ui   		: 'forward'
			});
			var directionsButton = new Ext.Button({
				itemId		: 'directionsButton',
				text		: 'Directions',
				ui			: 'forward'
			});
			mapButton.addListener('tap', this.contactFormPanel.displayMap, this.contactFormPanel);
			myToolbar.add(mapButton);
			directionsButton.addListener('tap', this.contactFormPanel.displayDirections, this.contactFormPanel);
			myToolbar.add(directionsButton);
			myToolbar.doLayout();
		}
		this.application.viewport.setActiveItem(this.contactFormPanel, {type:'slide', direction:'left'});
	},

	/**
	 * Called when "deleteContact"  custom event is fired in ContactFormPanel.
	 *
	 * @param model
	 */
	deleteContact : function(model) {
		console.log("In ContactController.deleteContact()");
		modelStore = model.store;

		// If no model in the list is selected, just return
		if(!model) {
			return;
		}

		var confirmText = 'Do you want to remove ' + model.get('firstName') + ' ' + model.get('lastName') + "?";

		Ext.Msg.confirm(
			'Please confirm',
			confirmText,
			function(btn) {
				if(btn === 'yes') {
					modelStore.remove(model);
					modelStore.sync();
				}
			}
		);
	},

	/**
	 * Called when "showMap" custom event is fired in ContactFormPanel.
	 *
	 * @param cmp
	 * @param evt
	 */
	showMap : function(cmp, evt) {
		console.log("In ContactController.showMap()");
		var model = this.contactFormPanel.getRecord();
		var contactMapPanel = new Contacts.ContactMapPanel(model);
		// Add a listener to the panel
		contactMapPanel.addListener({
			scope			: this,
			backToDetails 	: this.backToDetails
		});
		this.application.viewport.setActiveItem(contactMapPanel, {type:'slide', direction:'left'});
	},

	showDirections : function(cmp, evt) {
		var model = this.contactFormPanel.getRecord();
		var contactDrivePanel = new Contacts.ContactDrivePanel(model);
		contactDrivePanel.addListener({
			scope			: this,
			backToDetails	: this.backToDetails
		}),
		this.application.viewport.setActiveItem(contactDrivePanel, {type:'slide', direction:'left'});
	},

	/**
	 * Called when "backToDetails custom event is fired in
	 * @param model
	 */
	backToDetails : function(model) {
		console.log("In ContactController.backToDetails()");
		this.contactFormPanel.loadRecord(model);
		this.application.viewport.setActiveItem(this.contactFormPanel, {type:'slide', direction:'right'});
	},

	// ------------------------------------- Helper Methods ---------------------------------------
	/** Utility method to create a new contact */
	genNewModel : function() {
		return Ext.ModelMgr.create({
			id : new Date().format('U')
		}, 'Contacts.Contact');
	}
});
