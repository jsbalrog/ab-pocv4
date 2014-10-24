/**
 * @class Contacts.ContactListPanel
 * @extends Ext.Panel
 *
 * This panel is a wrapper for a list and a toolbar at the top
 */
Contacts.ContactListPanel = Ext.extend(Ext.Panel, {
	layout: 'fit',

	/** This is called right after the constructor, if any exists. */
    initComponent: function() {
        this.store = new Ext.data.Store({
            autoLoad: true,
            model: 'Contacts.Contact',
            sorters: ['lastName'],
            getGroupString: function(record) {
                return record.get('lastName')[0];
            }
        });

		// dockedItems contains a toolbar
		this.dockedItems = [{
			xtype:'toolbar',
			dock :'top',
			title:'Contacts',
			items:[ // Our docked item toolbar in turn has items: a spacer and an add button
				{xtype:'spacer'},
				{
					itemId  :'addButton',
					iconCls :'add',
					iconMask:true,
					ui      :'plain',
					listeners : {
						scope : this,
						tap : this.tapAddHandler
					}
				}
			]
		}];

		// Define the list that will go in items
		this.list = new Ext.List({
			itemdId	 : 'contactList',
			itemTpl  : '{firstName} <strong>{lastName}</strong>', // This is our template for how each list item displays
			store    : this.store, // the list is bound to the store variable we have defined
			grouped  : true,
			indexBar : true,
			listeners: {
				scope   : this,
				itemtap : this.onContactListItemTap,
				itemswipe : this.onContactListItemSwipe
			}
		});

		// items contains a list
		this.items = [this.list];

		// This is basically a call to super();
		Contacts.ContactListPanel.superclass.initComponent.apply(this,arguments);
	},

	tapAddHandler : function(cmp, evt) {
		this.fireEvent('addTap', cmp, evt);
	},

	onContactListItemTap : function(ctList, itemIdx) {
		var model = ctList.store.getAt(itemIdx);
		this.fireEvent('editContact', model);
	},

	onContactListItemSwipe : function(ctList, itemIdx) {
		var model = ctList.store.getAt(itemIdx);
		this.fireEvent('deleteContact', model);
	}
});

// Sp that lazy instantiation may be used in creating ContactListPanels
Ext.reg('contactListPanel', Contacts.ContactListPanel);
