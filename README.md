A simple global notification system


Installation
============

    $ meteor add frozeman:global-notifications

Usage
=====

Add the notifications helper to your layout template, somehwere in the body

    {{> GlobalNotifications}}

Then show notification use it like this:

    // types Notifications.info, Notifications.warning, Notifications.success, Notifications.error
    GlobalNotification.info({
        title: 'My Title',
        content: 'My Text',
        duration: 2 // duration the notification should stay in seconds
    });

You can also just pass a string, then it will simply show that text:

    GlobalNotification.warning('My Text');

Additionally you can localize your message if you have the `tap:i18n` package add to your app by just passing the localization string:

    GlobalNotification.error({
        title: 'i18n:my.localized.title',
        content: 'i18n:my.localized.text'
    });

Hide Notifications
==================

The `GlobalNotification` function returns the ID of the notification, which you can use to hide this specific notification programatically:

    var myNotificationId = GlobalNotification.warning('My Text');
    // ...
    GlobalNotification.hide(myNotificationId);

To hide all notifications call:

    GlobalNotifications.hideAll();

*Note:* You can use `GlobalNotification` or `GlobalNotifications`, they are interchangeable and for your convienience.

You can also pass the `closeable: false` option, to prevent that the user can close the notification.
Though if you don't pass a `duration` as well the notification will never disappear, until you hide it programatically!

    var myNotificationId = GlobalNotification.info({
        content: 'Loading...',
        closeable: false
    });

    // do something

    GlobalNotification.hide(myNotificationId);

Order of appearance
===================

To change the order of appearance of the notifications pass `reverse=true`:

    {{> GlobalNotifications reverse=true}}


User action buttons
===================

You can add ok and cancel button, which execute custom functions.
The ok or cancel buttons will only be shown if you pass a function for the `ok` or `cancel` property.
You can also specify the text of those buttons either when creating the GlobalNotifications helper, or when displayin a notification:

    {{> GlobalNotifications okText="Agree" cancelText="×"}}

If the `ok` or `cancel` functions returns `true` the notification will hide on click when the buttons are clicked.
When you pass any ok or cancel function the notification will not hide when clicked, except you pass explicitly `closeable: true`.
This allows you to control the disappearance.

    GlobalNotification.warning({
        content: 'You really want to delete this',
        ok: function(){
            // do something
            return true;
        },
        okText: 'Delete all', // default is "OK"
        cancel: function(){
            // do something
            return true;
        },
        cancelText: 'Do nothing' // default is "Cancel"
    });


Styling
=======
You can either overwrite the default `.global-notifications` for the wrapper and `.global-notification` class for each notification,
or give the wrapper and notification your own classes, when you put the GlobalNotifications helper in you layout template:

{{> GlobalNotifications wrapperClass="notification-box" class="notification"}}


By default the container position fixed on the bottom right.

The `.animate` class on each notification element controls the animation. If its add the element is "off-screen", if removed its visible.

The HTML structure is as follows:

```
<div class="{{wrapperClass}}">
    <div class="{{class}} {{type}} animate">
        <h1>Title</h1>
        <p>Content</p>

        <button class="ok">OK</button>
        <button class="cancel">Cancel</button>
    </div>
</div>
```

The `type` class is either "info", "warning", "error" or "success".

**The default styles are**:

```
@margin: 10px;
@padding: 10px;
@animationSpeed: 200ms;

@colorRed: #ef0009;
@colorYellow: #fecc09;
@colorBlue: #127cff;
@colorGreen: #23f113;
@colorWhite: #fff;


.global-notifications {
    z-index: 100;
    position: absolute;
    bottom: @margin;
    right: @margin;


    .global-notification {
        max-width: 400px;
        padding: @padding*2 @padding*3;
        margin-top: @margin;
        
        &.error {
            background-color: @colorRed;
            color: @colorWhite;
        }
        &.warning {
            background-color: @colorYellow;
        }
        &.info {
            background-color: @colorBlue;
            color: @colorWhite;
        }
        &.success {
            background-color: @colorGreen;
            color: @colorWhite;
        }

        // ANIMATION
         -webkit-transition: transform @animationSpeed linear, transform 0.4s 0.2s ease;
         -moz-transition: transform @animationSpeed linear, transform 0.4s 0.2s ease;
         -o-transition: transform @animationSpeed linear, transform 0.4s 0.2s ease;
         transition: transform @animationSpeed linear, transform 0.4s 0.2s ease;

        &.animate {
            -webkit-transform: translateX(1000px);
            -moz-transform: translateX(1000px);
            -ms-transform: translateX(1000px);
            -o-transform: translateX(1000px);
            transform: translateX(1000px);
        }

        h1 {
            margin: 0;
            margin-bottom: @margin;
            padding: 0;
        }
        p {
            margin: 0;
        }
    }
}
```