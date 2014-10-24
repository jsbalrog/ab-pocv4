/**
 * @class Contacts.ContactFormPanel
 * @extends Ext.Panel
 *
 * This panel is a form for adding or editing a contact.
 */
Contacts.ContactFormPanel = Ext.extend(Ext.form.FormPanel, {
	defaultType:'textfield',  // This is so we don't have to specify type on all of the fields
	scroll     :'vertical', // If there's any overflow, scroll vertically
	defaults   :{
		labelWidth:65
	},

	model: null,

	initComponent : function () {
		console.log("initializing ContactFormPanel");
		this.items = this.buildItems();
		this.dockedItems = this.buildEditToolbars();

		Contacts.ContactFormPanel.superclass.initComponent.call(this);
	},

	buildItems : function() {
		return [
			{
				label:'First',
				name :'firstName',
				itemId:'firstName'
			},
			{
				label:'Last',
				name :'lastName',
				itemId : 'lastName'
			},
			{
				label:'Street',
				name :'address',
				itemId : 'address'
			},
			{
				label:'City',
				name :'city',
				itemId : 'city'
			},
			{
				label:'State',
				name :'state',
				itemId : 'state'
			},
			{
				label:'Zip',
				name :'zip',
				itemId : 'zip'
			},
			{
				label:'Phone',
				name :'phone',
				itemId : 'phone'
			}
		]
	},

	buildEditToolbars : function() {
		return [
			{
				itemId: 'contactFormToolbar',
				xtype : 'toolbar',
				dock  : 'top',
				title: 'Edit Contact',
				items : [
					{
						text : 'Back',
						ui   : 'back',
						listeners : {
							scope : this,
							tap : this.back
						}
					},
					{ xtype : 'spacer' }
				]
			},
			{
				xtype : 'toolbar',
				dock  : 'bottom',
				items : [
					{
						text   : 'Done',
						itemId : 'done',
						listeners : {
							scope : this,
							tap : this.save
						}
					},
					{
						text   : 'Cancel',
						itemId : 'cancel',
						listeners : {
							scope : this,
							tap : this.back
						}
					}
				]
			}
		]
	},

	setModel : function(model) {
		this.model = model;
	},

	getModel : function() {
		return this.model;
	},

	displayMap : function(btn, evt) {
		console.log("In ContactFormPanel.displayMap()");
		this.fireEvent('showMap', btn, evt);
	},

	displayDirections : function(btn, evt) {
		console.log("In ContactFormPanel.displayDirections()");
		this.fireEvent('showDirections', btn, evt);
	},

	save : function(btn, evt) {
		console.log("In ContactFormPanel.save()");
		this.fireEvent('save', btn, evt, this);
	},

	back : function(btn, evt) {
		console.log("In ContactFormPanel.back()");
		this.fireEvent('backToList', btn, evt);
	}
});

// So that lazy instantiation may be used in creating ContactFormPanels
Ext.reg('contactFormPanel', Contacts.ContactFormPanel);
