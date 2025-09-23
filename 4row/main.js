/*
	ADAPTERS
 */
devgru_adapters = {
	"analytics": {
		"trackEvent": function(event, params) {

			// console.log("event: "+event);

			switch(event) {
				case "EVENT_LEVELSTART":

					window.parent.cmgGameEvent('start',""+params.levelName);

					/*
					window.top.postMessage({
						scope: window.devgru_gameID,
						event: 'start',
						level: params.levelName
					}, "*");
					*/

					break;

				case "EVENT_LEVELRESTART":

					window.parent.cmgGameEvent('replay', ""+params.levelName);

					/*
					window.top.postMessage({
						scope: window.devgru_gameID,
						event: 'restart',
						level: params.levelName
					}, "*");
					*/

					break;

				default:
					// ...
			}
		},
		"trackScreen": function(screen, pageTitle) {

			// console.log("screen: "+screen);

			switch(event) {
				case "SCREEN_HOME":
					// ...
					break;
				default:
					// ...
			}
		}
	}
};

/*
	STARTING GAME AFTER SITE LOCK CHECK
 */
var siteRegEx = /^([-a-zA-Z0-9\.]+)\coolmath-games\.com(\/|$)/;
if (false && siteRegEx.test(document.domain) === false) {
    throw new Error('not playable');
} else {
    window.devgru_gameID = "4-in-a-row";
    window.devgru_gameJS = ['js/all.js',
    	function(){
    		//
        	lime.embed ("openfl-content", 0, 0, "000000");
    	}
    ];

    (function (document, url, fgJS, firstJS) {
            fgJS = document.createElement('script');
            firstJS = document.getElementsByTagName('script')[0];
            fgJS.src = url + encodeURIComponent(document.location.href);
            firstJS.parentNode.insertBefore(fgJS, firstJS);
    })(document, 'html5games/gameapi/v1.js?e=');
}

/*
	UNLOCK ALL LEVELS
 */
window.unlockAllLevels = function() {
	// nothing to do here...
};
