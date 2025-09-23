// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var ConstsManager = function()
{
  this.gameWidth = 720;
  this.gameHeight = 720;
  this.gameMinWidth = 720;
  this.gameMinHeight = 720;

  this.storage = {};

  this.storage['text_configs'] = 
  {
    field_name_text: {font: '69px CO_69', align: 'center', tint:0xFCD1B7},
    pegs_left_text: {font: '94px CO_69', align: 'center', tint:0xFF8254},
    field_score_text: {font: '53px CO_53', align: 'center', tint:0xFFFFFF}
  };

  this.storage.audio_info = 
  {
    sounds:
    {
      path: 'assets/audio/',

      files:
      {
        
        sound_click: {volume: 0.8},
        sound_victory: {volume: 0.6},
        sound_lose: {volume: 0.5},
        sound_peg_tap: {volume: 1},
        sound_peg_select: {volume: 1},
        sound_wrong: {volume: 1}
      },

      formats: ['m4a', 'ogg']
      // formats: ['wav']
    },

    audio: {}
  };
}

ConstsManager.prototype.init = function()
{

}

ConstsManager.prototype.getData = function(path)
{
  var keys = path.split('/');
  if(keys.length == 0) return null;

  var data = this.storage[keys[0]];
  for(var i = 1; i < keys.length; i++)
  {
    var key = keys[i];
    if(key == null || data == null) return null;
    data = data[key];
  }

  return data;
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
document.addEventListener("DOMContentLoaded", function()
{
  String.prototype.splice = function(idx, rem, str) {
      return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
  };

  init();
});

window.onfocus = function()
{
  if(app) app.focusChange(true);
};
window.onblur = function()
{
  if(app) app.focusChange(false);
};

var renderer;
var stage;
var app;

var assetsManager;
var soundsManager;
var guiManager;
var constsManager;

var interaction;

function init()
{
  renderer = PIXI.autoDetectRenderer(720, 720, {antialias: true, transparent: false, resolution: 1, autoResize: false, roundPixels: false});
  document.getElementById('game').appendChild(renderer.view);

  renderer.backgroundColor = 0x0084C8;
  renderer.view.style.position = "absolute";
  renderer.view.style.top = "0px";
  renderer.view.style.left = "0px";

  interaction = new PIXI.interaction.InteractionManager(renderer);

  constsManager = new ConstsManager();
  constsManager.init();

  assetsManager = new AssetsManager(PIXI.loader);

  // assetsManager.addAssetToLoad('boot', {name:'preloader_bar', url:'assets/preloader/preloader_bar.png'});
  assetsManager.addAssetToLoad('boot', {name:'progress_bar', url:'assets/preloader/progress_bar.png'});
  assetsManager.addAssetToLoad('boot', {name:'progress_label', url:'assets/preloader/label.png'});
  // assetsManager.addAssetToLoad('boot', {name:'bg_gradient_2', url:'assets/preloader/bg_gradient_2.png'});

  assetsManager.addAssetToLoad('load', {name:'texture_atlas', url:'assets/texture_atlas.json'});
  // assetsManager.addAssetToLoad('load', {name:'texture_atlas_2', url:'assets/texture_atlas_2.json'});
  // assetsManager.addAssetToLoad('load', {name:'data_info', url:'assets/data.json'});
  assetsManager.addAssetToLoad('load', {name: 'CO_53', url:'assets/fonts/CO_53.fnt'});
  assetsManager.addAssetToLoad('load', {name: 'CO_69', url:'assets/fonts/CO_69.fnt'});
  // assetsManager.addAssetToLoad('load', {name: 'KomikaI_15', url:'assets/fonts/KomikaI_15.fnt'});
  // assetsManager.addAssetToLoad('load', {name: 'KomikaI_20', url:'assets/fonts/KomikaI_20.fnt'});
  // assetsManager.addAssetToLoad('load', {name: 'Sniglet_15', url:'assets/fonts/Sniglet_15.fnt'});
  // assetsManager.addAssetToLoad('load', {name: 'Sniglet_20', url:'assets/fonts/Sniglet_20.fnt'});
  // assetsManager.addAssetToLoad('load', {name: 'Foo_34', url:'assets/fonts/Foo_34.fnt'});
  // assetsManager.addFontToLoad({fontFamily:'Sniglet-Regular', url:'assets/fonts/Sniglet-Regular.ttf'});
  // assetsManager.addFontToLoad({fontFamily:'Foo-My', url:'assets/fonts/foo_regular.ttf'});

  soundsManager = new SoundsManager();

  stage = new PIXI.Container();

  guiManager = new Gui.GuiManager(stage);

  renderer.render(stage);

  app = new App();

  new StateBoot();

  window.addEventListener('resize', resize);
  resize();
  for(var i = 1; i <= 10; i++)
  {
    setTimeout(function()
    {
      resize();
    }, 200*i);
  }

  requestAnimationFrame(app.loop);
};

function resize()
{
  var viewWidth = screen.width;
  var viewHeight = screen.height;

  var gameWidth = 0;
  var gameHeight = 0;

  var size = calculateGameSize(window.innerWidth, window.innerHeight);
  gameWidth = size.width;
  gameHeight = size.height;

  ratio = Math.min(window.innerWidth/gameWidth, window.innerHeight/gameHeight);

  var shiftX = (window.innerWidth - Math.ceil(gameWidth * ratio)) / 2;
  var shiftY = (window.innerHeight - Math.ceil(gameHeight * ratio)) / 2;
  renderer.view.style.left = shiftX+"px";
  renderer.view.style.top = shiftY+"px";

  var width = Math.ceil(gameWidth * ratio);
  var height = Math.ceil(gameHeight * ratio);

  renderer.view.style.width = width + "px";
  renderer.view.style.height = height + "px";

  renderer.resize(gameWidth, gameHeight);

  guiManager.resize(gameWidth, gameHeight);
};

function calculateGameSize(screenWidth, screenHeight)
{
  // var gameWidth = constsManager.gameWidth;
  // var gameHeight = constsManager.gameHeight;

  // var ratio = screenWidth/screenHeight;
  // var hhh = screenWidth*constsManager.gameWidth/screenHeight;
  // if(hhh > 720) hhh = 720;
  // if(hhh < 540) hhh = 540;

  // var minW = 800;
  // var minH = 720;
  // var maxH = 960;
  // var maxW = 960;

  // var wK = 1;
  // var hK = 1;

  // if(screenHeight < minH) 
  // {
  //   wK = minH / screenHeight;
  //   screenHeight = minH;
  // }
  // if(screenHeight > maxH) 
  // {
  //   wK = maxH / screenHeight;
  //   screenHeight = maxH;
  // } 

  // if(screenWidth < minW) 
  // {
  //   hK = minW / screenWidth;
  //   screenWidth = minW;
  // }
  // if(screenWidth > maxW) 
  // {
  //   hK = maxW / screenWidth;
  //   screenWidth = maxW;
  // }

  // return {width: screenWidth*wK, height: screenHeight*hK};

  var sizeWH = 960;

  var s = (screenWidth > screenHeight)?'w':'h';

  var wK = 1;
  var hK = 1;

  if(s == 'w')
  {
    var k = screenHeight / sizeWH;
    wK = screenWidth / (sizeWH*k);
  }
  if(s == 'h')
  {
    var k = screenWidth / sizeWH;
    hK = screenHeight / (sizeWH*k);
  }

  return {width: sizeWH * wK, height: sizeWH * hK};

  // var 
}
