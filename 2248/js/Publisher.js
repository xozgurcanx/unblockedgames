/**
 * MathGames SDK config. Do not change the values!
 */
var enableAds = true;
var adChannel = "hallpass_0700-2248";
var adFreq = 60;
var adId = "AD-SET";
var firstAd = "FIRST-AD";
var partner = "PARTNER";
var preroll = "PRE-SET";

/**
 * MathGames game config. Will be provided
 */
var gameName = "2248";
var gameCategory = "Puzzle";
var developerId = "0700";
var gameCode = "0700-2248";

var adFreqIngame = 180;

/**
 * Load SDK
 * NOTE: path is relative and will work only after the game is published
 */
var Ctr = 0; // ad timer for non in-game play
var adTimer = 0;
(function(w, d) {
  setInterval(function() {
    Ctr++;
    adTimer++;
  }, 1000);
  w.Booster = w.Booster || {};
  var s = d.createElement("script");
  var p = d.getElementsByTagName("script")[0];
  s.async = 1;
  s.src = "";
  s.setAttribute("id", "booster-api");
  p.parentNode.insertBefore(s, p);
})(window, document);

/**
 * Will be automatically called when SDK is loaded
 */
Booster.ready = function() {
  new Booster.Init({
    orientation: "portrait"
  });

  adSense = new Booster.Ad({
    channelID: adChannel
  });

  community = new Booster.Community({
    position: 1,
    gameCode: gameCode
  });

  analytics = new Booster.Analytics({
    gameName: gameName,
    gameId: gameCode,
    gameCategory: gameCategory,
    developer: developerId
  });

  moregames = new Booster.Moregames();

  /**
   * Start the game
   */
  Booster.onSplashFinishedEvent = function() {
    window.game = new Phaser.Game(800, 600, Phaser.AUTO, "game", {
      create: create
    });
  };

  /**
   * Add a game pause handler
   */
  Booster.onOpenTab = function() {
    if (window.game) {
      game.paused = true;
    }
  };

  /**
   * Add a game unpause handler
   */
  Booster.onCloseTab = function() {
    if (window.game) {
      game.paused = false;
    }
  };

  banner = new Booster.AdBanner({ platform: "mobile" });
  banner.show();
};
