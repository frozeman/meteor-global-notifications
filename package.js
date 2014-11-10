Package.describe({
    name: 'frozeman:global-notifications',
    summary: 'Simple global toaster notifications',
    version: '0.1.3',
    git: 'http://github.com/frozeman/meteor-global-notifications'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0');

    api.use('templating', 'client');
    api.use('less', 'client');
    api.use('underscore', 'client');
    api.use('reactive-var', 'client');
    api.use('frozeman:animation-helper@0.2.3', 'client');

    api.export(['GlobalNotification','GlobalNotifications']);

    api.addFiles('notifications.html', 'client');
    api.addFiles('notifications.less', 'client');
    api.addFiles('notifications.js', 'client');
});

Package.onTest(function(api) {
    // api.use('tinytest');
    // api.use('notifications');
    // api.addFiles('notifications-tests.js');
});
