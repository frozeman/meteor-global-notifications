/**
Packages module

@module packages
**/

/**
The GlobalNotification package

Either with a plain text to display as a info or with the following structure:

    // types GlobalNotification.info, GlobalNotification.warning, GlobalNotification.success, GlobalNotification.error
    GlobalNotification.info({
        title: 'My Title',
        content: 'My Text',
        duration: 2 // duration the notification should stay in seconds
    });


@class [package] notifications
@constructor
**/
GlobalNotification = {
    info: function(notification){
        return addNotification(notification, 'info');
    },
    warning: function(notification){
        return addNotification(notification, 'warning');
    },
    success: function(notification){
        return addNotification(notification, 'success');
    },
    error: function(notification){
        return addNotification(notification, 'error');
    },
    hideAll: function(){
        Tracker.nonreactive(function(){
            var notes = Notifications.get();

            _.each(notes, function(note, key){
                if(note.closeable)
                    delete notes[key];
            });

            // set the new document, without the closable false ones
            Notifications.set(notes);
        });
    },
    hide: function(notificationId){
        removeFromNotifications(notificationId);
    },
}
GlobalNotifications = GlobalNotification;

/**
The reactive var used to add and remove notifications

@property Notifications
*/
var Notifications = new ReactiveVar({});

/**
Adds a notification

@method ((addNotification))
@param {String} notification the notifaction string or object
@param {String} the type of notification
@return {String} the notification id
*/
var addNotification = function(notification, type){
    var notes;

    Tracker.nonreactive(function(){
        notes = Notifications.get();
    });

    // transform notification
    if(_.isString(notification))
        notification = {
            type: type,
            content: notification
        };
    // add an artificial id to the new notification
    notification._id = Random.id();

    if(!notification.type)
        notification.type = type;

    // make not closeable if an ok or cancel function was passed
    if(_.isUndefined(notification.closeable) && (_.isFunction(notification.ok) || _.isFunction(notification.cancel)))
        notification.closeable = false;
    else if(_.isUndefined(notification.closeable))
        notification.closeable = true;


    if(!_.isObject(notes))
        notes = {};

    notes[notification._id] = notification;

    Notifications.set(notes);

    return notification._id;
};


/**
Remove itself from the parent notifications list

@method ((removeFromNotifications))
@param {String} notificationId the id of the current notification
*/
var removeFromNotifications = function(notificationId) {
    Tracker.nonreactive(function(){
        // remove itself from the notifications array
        var notes = Notifications.get();
        delete notes[notificationId];

        // update the list
        Notifications.set(notes);
    });
};



/**
The notifications template

@class [template] Notifications_notification
@constructor
**/



Template['GlobalNotifications'].helpers({
    /**
    The notification helper, gets the notifications

    @method ((listNotifications))
    */
    'listNotifications': function() {
        var notes = Notifications.get();

        if(!_.isEmpty(notes)) {

            // transform to array
            notes = _.map(notes, function(notification) {
                return notification;
            });

            return notes;
        }
    },
    /**
    Set the class of the notification wrapperClass box

    @method ((wrapperClass))
    */
    'wrapperClass': function() {
        return this.wrapperClass || 'global-notifications';
    },
});


/**
The notification template

@class [template] Notifications_notification
@constructor
**/


Template['GlobalNotifications_notification'].destroyed = function(){
    this._runningTimeout = null;
};



Template['GlobalNotifications_notification'].helpers({
    /**
    The notification helper, makes sure the notifcation will get removed after duration ends

    @method ((notification))
    */
    'notification': function() {
        var template = Template.instance();

        // localize message if TAPi18n is avalable
        if(this.title && this.title.indexOf('i18n:') !== -1 && typeof TAPi18n !== 'undefined')
            this.title = TAPi18n.__(this.title.replace('i18n:',''));
        if(this.content && this.content.indexOf('i18n:') !== -1 && typeof TAPi18n !== 'undefined')
            this.content = TAPi18n.__(this.content.replace('i18n:',''));

        // limit the notification visibility duration
        if(_.isFinite(this.duration) && !template._runningTimeout) {
            template._runningTimeout = Meteor.setTimeout(function(){
                removeFromNotifications(template.data._id);
            }, this.duration * 1000);
        }

        return this;
    },
    /**
    Set the class of the notification box

    @method ((class))
    */
    'class': function() {
        return Template.parentData(2).class || 'global-notification';
    },
    /**
    Show OK button?

    @method ((ok))
    */
    'ok': function() {
        return _.isFunction(this.ok);
    },
    /**
    Show Cancel button?

    @method ((cancel))
    */
    'cancel': function() {
        return _.isFunction(this.cancel);
    },
    /**
    OK text

    @method ((okText))
    */
    'okText': function() {
        return this.okText || 'OK';
    },
    /**
    Cancel text

    @method ((cancelText))
    */
    'cancelText': function() {
        return this.cancelText || 'Cancel';
    }
});


Template['GlobalNotifications_notification'].events({
    /**
    Hide the notification on click

    @event click > div
    */
    'click > div': function(e, template){
        if(template.data.closeable)
            removeFromNotifications(template.data._id);
    },
    /**
    Execute the ok function

    @event click button.ok
    */
    'click button.ok': function(e, template){

        if(_.isFunction(template.data.ok)) {
            e.stopPropagation();
            if(template.data.ok())
                removeFromNotifications(template.data._id);
        }
    },
    /**
    Execute the cancel function

    @event click button.cancel
    */
    'click button.cancel': function(e, template){

        if(_.isFunction(template.data.cancel)) {
            e.stopPropagation();
            if(template.data.cancel())
                removeFromNotifications(template.data._id);
        }
    }
});