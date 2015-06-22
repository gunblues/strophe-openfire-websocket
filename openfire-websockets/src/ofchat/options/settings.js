window.addEvent("domready", function () {

    new FancySettings.initWithManifest(function (settings) {
        var toggleBoshService = function(effect) {
            var value = settings.manifest.custom_bosh_service.get();
            jQuery("#bosh_service").hide();
        };

        var $sensitiveElements = jQuery('.tab-content.show input:not(#signout), .tab-content.show select, .tab-content.show checkbox');
        var $signoutGroup = jQuery('#signout').closest('.group');
        var toggleProtection = function() {
            if (background.secretary.active) {
                $sensitiveElements.attr('disabled', 'disabled');
                $signoutGroup.show();
            } else {
                $sensitiveElements.removeAttr('disabled');
                $signoutGroup.hide();
            }
        };

        var toggleJid = function() {

            var value = settings.manifest.jid.get();
            if (value) {
                jQuery('#jid').removeClass('error');
            } else {
                jQuery('#jid').addClass('error');
            }
        };
        var togglePassword = function() {
            var value = settings.manifest.password.get();
            if (value) {
                jQuery('#password').removeClass('error');
            } else {
                jQuery('#password').addClass('error');
            }
        };

        var background = chrome.extension.getBackgroundPage();

        toggleBoshService();
        toggleProtection();
        toggleJid();
        togglePassword();

        settings.manifest.custom_bosh_service.addEvent("action", function() {
            var value = settings.manifest.custom_bosh_service.get();
            // check if valid url 
            var exp = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
            if (value) {
                if (value.match(exp)) {
                    jQuery('#custom_bosh_service').removeClass('error');
                } else {
                    jQuery('#custom_bosh_service').addClass('error');
                }
            } else {
                jQuery('#custom_bosh_service').removeClass('error');
            }
            background.boss.optionUpdated("CUSTOM_BOSH_SERVICE", value);
        });

        jQuery('#custom_bosh_service').bind('blur',function() {
            var value = settings.manifest.custom_bosh_service.get();

        }).bind('focus', function() {
            var value = settings.manifest.custom_bosh_service.get();
        });

        settings.manifest.jid.addEvent("action", function() {
            toggleJid();
            background.boss.optionUpdated("JID", settings.manifest.jid.get());
        });

        settings.manifest.password.addEvent("action", function() {
            togglePassword();
            background.boss.optionUpdated("PASSWORD", settings.manifest.password.get());
        });

        settings.manifest.align.addEvent("action", function() {
            background.boss.optionUpdated("ALIGN", settings.manifest.align.get());
        });

        settings.manifest.history_threads.addEvent("action", function() {
            background.boss.optionUpdated("HISTORY_THREADS", settings.manifest.history_threads.get());
        });

        settings.manifest.use_websockets.addEvent("action", function() {
            background.boss.optionUpdated("USE_WEBSOCKETS", settings.manifest.use_websockets.get());
        });
        
        settings.manifest.desktop_notification.addEvent("action", function() {
            background.boss.optionUpdated("DESKTOP_NOTIFICATION", settings.manifest.desktop_notification.get());
        });

        settings.manifest.signout.addEvent("action", function() {
            background.boss.signout();
            toggleProtection();
        });

        settings.manifest.excludes.addEvent("action", function() {
            background.boss.optionUpdated("EXCLUDES", settings.manifest.excludes.get());
        });
        
        setInterval(toggleProtection, 2000);
    });
    
});
