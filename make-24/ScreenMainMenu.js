var ScreenMainMenu = function(config)
{
  config.sizeType = 'relative';
  config.widthRelative = 1;
  config.heightRelative = 1;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;
  // this.alpha = 0;

  // this.containerLogo = new PIXI.Container();
  // this.addChild(this.containerLogo);

  // this.tweenContainerLogo = new PIXI.Container();
  // this.containerLogo.addChild(this.tweenContainerLogo);

  // this.logo = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'logo.png'));
  // this.containerLogo.addChild(this.logo);
  // this.logo.anchor.set(0.5, 0.5);
  // this.logo.y = -310;
  // logo.visible = false;

  this.panelLogo = new PanelLogo({parentPanel: this, layer: this.tweenContainerLogo, positionType: 'center-top', xRelative: 0, yRelative: 0});

  this.bgLogo = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'color_rect_blue_light.png'));
  this.panelLogo.addChildAt(this.bgLogo, 0);
  this.bgLogo.anchor.set(0.5, 0.5);
  this.bgLogo.height = 285;

  this.containerMenus = new PIXI.Container();
  this.addChild(this.containerMenus);
  // this.containerMenus.y = 30;
  // this.containerMenus.y = 30;
  this.containerMenus.scale.x = this.containerMenus.scale.y = 1.1;

  this.tweenContainerMenus = new PIXI.Container();
  this.containerMenus.addChild(this.tweenContainerMenus);

  var menuInfo;

  this.titleGameMode = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_gmode_title.png'));
  this.tweenContainerMenus.addChild(this.titleGameMode);
  this.titleGameMode.anchor.set(0.5, 0.5);
  this.titleGameMode.x = 0;
  this.titleGameMode.y = -110;

  // this.containerButtonHelp = new PIXI.Container();
  // this.addChild(this.containerButtonHelp);
  // this.containerButtonHelp.x = -450;

  this.containerButtonHelp = new Gui.BasePanel({parentPanel: this, width: 210, height: 98, positionType: 'left-bot', xRelative: 10, yRelative: -10});

  this.buttonHelp = Gui.createSimpleButton({name: 'button_help', parentPanel: this.containerButtonHelp, width: 210, height: 98, x: 0, y: 0},
  {
    pathToSkin: 'button_help.png',
    onClick: function()
    {
      // console.log('Help');
      if(app.panelTutorial.state != 'hide') return;

      app.panelTutorial.show('in_main_menu');
    }
  }); 

  this.containerButtonAudio = new Gui.BasePanel({parentPanel: this, width: 90, height: 90, positionType: 'right-bot', xRelative: -10, yRelative: -10});

  this.buttonAudio = new Gui.ButtonAudio({name: 'button_audio', parentPanel: this.containerButtonAudio, width: 90, height: 90});
  this.buttonAudio.on('button_click', function(data)
  {
      var skin = self.buttonAudio.skin;

      skin.scale.x = skin.scale.y = 1;
      // TweenMax.killTweensOf(text.scale);
      TweenMax.to(skin.scale, 3/30, {x: 0.8, y: 0.8, ease: Power2.easeOut, onComplete: function()
      {
        TweenMax.to(skin.scale, 3/30, {x: 1, y: 1, ease: Power2.easeOut, onComplete: function()
        {

        }});
      }});
  });
  this.buttonAudio.isClickTween = false;

  this.buttonAudio.isNeedMouseOverOut = true;

  this.buttonAudioBgMO = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'button_audio_bg_over.png'));
  this.buttonAudio.addChildAt(this.buttonAudioBgMO, 0);
  this.buttonAudioBgMO.anchor.set(0.5, 0.5);
  this.buttonAudioBgMO.alpha = 0;

  this.buttonAudio.on('mouse_over', function(d)
  {
    this.buttonAudioBgMO.alpha = 1;
  }, this);
  this.buttonAudio.on('mouse_out', function(d)
  {
    this.buttonAudioBgMO.alpha = 0;

    // console.log('aaaa');
  }, this);

  // this.undoBgMOLandscape.interactive = false;

  menuInfo = 
  {
    size: 582,
    segment_size: 291,
    segment_shift: 0,

    bg: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_gmode_bg.png')),
    selector: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_gmode_selector.png')),
    segments: 
    [
      {name: "practice", label_white: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_gmode_label_1_white.png')), label_gray: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_gmode_label_1_gray.png'))},
      {name: "arcade", label_white: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_gmode_label_2_white.png')), label_gray: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_gmode_label_2_gray.png'))}
    ]
  };
  this.menuGameMode = new PanelLinearMenu({parentPanel: this, layer: this.tweenContainerMenus, width: 582, height: 81, x: 0, y: -40, info: menuInfo});  
  this.menuGameMode.setTo(app.gameData.gmode);
  this.menuGameMode.on('segment_setted', function(segmentName)
  {
    app.gameData.gmode = segmentName;
    // app.save();
    // console.log(': ' + segmentName);
  });

  this.titleChallenge = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_challenge_title.png'));
  this.tweenContainerMenus.addChild(this.titleChallenge);
  this.titleChallenge.anchor.set(0.5, 0.5);
  this.titleChallenge.y = 55;

  menuInfo = 
  {
    size: 582,
    segment_size: 194,
    segment_shift: 0,

    bg: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_challenge_bg.png')),
    selector: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_challenge_selector.png')),
    segments: 
    [
      {name: "easy", label_white: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_challenge_label_1_white.png')), label_gray: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_challenge_label_1_gray.png'))},
      {name: "medium", label_white: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_challenge_label_2_white.png')), label_gray: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_challenge_label_2_gray.png'))},
      {name: "hard", label_white: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_challenge_label_3_white.png')), label_gray: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_challenge_label_3_gray.png'))}
    ]
  };
  this.menuChallenge = new PanelLinearMenu({parentPanel: this, layer: this.tweenContainerMenus, width: 582, height: 81, x: 0, y: 125, info: menuInfo});  
  this.menuChallenge.setTo(app.gameData.dificulty);
  this.menuChallenge.on('segment_setted', function(segmentName)
  {
    app.gameData.dificulty = segmentName;
    // app.save();
    // console.log('SegmentSetted: ' + segmentName);
  });

  this.containerButtonPlay = new PIXI.Container();
  this.addChild(this.containerButtonPlay);

  this.tweenContainerButtonPlay = new PIXI.Container();
  this.containerButtonPlay.addChild(this.tweenContainerButtonPlay);

  this.buttonPlay = Gui.createSimpleButton({name: 'button_play', parentPanel: this, layer: this.tweenContainerButtonPlay, width: 396, height: 144, x: 0, y: 0},
  {
    pathToSkin: 'button_play_0001.png',
    onClick: function()
    {
      // console.log('Play');
      if(self.state == 'show' && app.screenGame.state == 'hide')
      {
        TweenMax.delayedCall(6/30, function()
        {
          self.toGame();
        });

        app.playAudio('sounds', 'sound_play_button');

        app.apiCallback('start', null);
      }
    }
  }); 
  // this.buttonPlay.isClickTween = false;
  this.buttonPlay.isClickSound = false;
  app.setButtonHover(this.buttonPlay, assetsManager.getTexture('texture_atlas', 'button_play_0001.png'), assetsManager.getTexture('texture_atlas', 'button_play_0002.png'));


  // console.log('X:', Util.gcd(12, 7));

  // console.log('F:', math.fraction(-2));

  guiManager.on('orientation_change', this.onOrientationChange, this);
  guiManager.on('game_resize', this.onGameResize, this);
}
ScreenMainMenu.prototype = Object.create(Gui.BasePanel.prototype);
ScreenMainMenu.prototype.constructor = ScreenMainMenu;

ScreenMainMenu.prototype.onOrientationChange = function(data)
{
  var orientation = data.orientation;

  this.updateElementsPosition();
}

ScreenMainMenu.prototype.onGameResize = function(data)
{
  this.bgLogo.width = data.width+5;
  this.bgLogo.height = 285;

  this.updateElementsPosition();
  // this.bgLogo.y = -310;

  // console.log(data.width, data.height);
}

ScreenMainMenu.prototype.updateElementsPosition = function()
{
  var orientation = guiManager.orientation;

  this.containerMenusHeight = 340;
  this.buttonPlayHeight = 155;

  if(orientation == 'portrait')
  { 
    // this.containerLogo.y = -1200/2 + 285/2 -10;
  }  
  if(orientation == 'landscape')
  {
    // this.containerLogo.y = -900/2 + 285/2 -10;
  }

  var topPos = -guiManager.rootScene.height/2+this.panelLogo.height/2;
  // console.log('A:', topPos);

  var elemsHeight = this.containerMenusHeight + this.buttonPlayHeight - 35;
  var totalHeight = Math.abs(topPos + 285/2 - guiManager.rootScene.height/2);
  var shift = (totalHeight - elemsHeight) / 3;

  this.containerMenus.y = topPos + 285/2 - 35 + shift + this.containerMenusHeight/2;

  this.containerButtonPlay.y = this.containerMenus.y + this.containerMenusHeight/2 + shift + this.buttonPlayHeight/2;

  // this.containerButtonHelp.y = this.containerButtonPlay.y + 20;
}

ScreenMainMenu.prototype.hideSideButtons = function()
{
  this.containerButtonHelp.interactiveChildren = false;
  this.containerButtonAudio.interactiveChildren = false;

  TweenMax.to(this.containerButtonHelp, 10/30, { alpha: 0, ease: Power2.easeOut });
  TweenMax.to(this.containerButtonAudio, 10/30, { alpha: 0, ease: Power2.easeOut });
}
ScreenMainMenu.prototype.showSideButtons = function()
{
  TweenMax.to(this.containerButtonHelp, 10/30, { alpha: 1, ease: Power2.easeOut });
  TweenMax.to(this.containerButtonAudio, 10/30, { alpha: 1, ease: Power2.easeOut });

  this.containerButtonHelp.interactiveChildren = true;
  this.containerButtonAudio.interactiveChildren = true;
}

ScreenMainMenu.prototype.toGame = function()
{
  this.tween({name: 'hide_anim'}, function()
  {
    // app.screenGame.initGame();
    // app.screenGame.tween({name: 'show_anim'});
    app.screenGame.toGame('from_main_menu');
  });

  app.save();
}

ScreenMainMenu.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim' && this.state == 'hide')
  {
    this.state = 'show_anim';
    this.visible = true;

    var time = 15 / 30;

    // TweenMax.to(this.tweenContainerLogo, time, {alpha: 1, yRelative: 0, ease: Power2.easeOut});
    this.panelLogo.yRelative = -300;
    TweenMax.to(this.panelLogo, time, {alpha: 1, yRelative: 0, ease: Power2.easeOut});

    this.tweenContainerMenus.y = 400;
    TweenMax.to(this.tweenContainerMenus, time, {alpha: 1, y: 0, ease: Power2.easeOut});

    this.tweenContainerButtonPlay.y = 400;
    TweenMax.to(this.tweenContainerButtonPlay, time, {alpha: 1, y: 0, ease: Power2.easeOut});

    this.buttonHelp.x = -300;
    TweenMax.to(this.buttonHelp, time, {alpha: 1, x: 0, y: 0, ease: Power2.easeOut});
    this.buttonAudio.x = 300;
    TweenMax.to(this.buttonAudio, time, {alpha: 1, x: 0, y: 0, ease: Power2.easeOut});

    TweenMax.to(this, time, {alpha: 1, x: 0, y: 0, ease: Power2.easeOut, onComplete: function()
    {
      self.tween({name: 'show'}, callback);
    }});
  }

  if(data.name == 'hide_anim' && this.state == 'show')
  {
    this.state = 'hide_anim';
    this.interactiveChildren = false;

    var time = 15 / 30;

    // TweenMax.to(this.tweenContainerLogo, time, {alpha: 0, y: - 400, ease: Power2.easeOut});
    TweenMax.to(this.panelLogo, time, {alpha: 1, yRelative: -300, ease: Power2.easeOut});

    TweenMax.to(this.tweenContainerMenus, time, {alpha: 0, y: 400, ease: Power2.easeOut});

    TweenMax.to(this.tweenContainerButtonPlay, time, {alpha: 0, y: 400, ease: Power2.easeOut});

    TweenMax.to(this.buttonHelp, time, {alpha: 1, x: -300, y: 0, ease: Power2.easeOut});
    TweenMax.to(this.buttonAudio, time, {alpha: 1, x: 300, y: 0, ease: Power2.easeOut});

    TweenMax.to(this, time, {alpha: 1, x: 0, y: 0, ease: Power2.easeOut, onComplete: function()
    {
      self.tween({name: 'hide'}, callback);
    }});
  }

  if(data.name == 'show_from_preloader')
  {
    this.tween({name: 'show_anim'});
    // this.state = 'show_anim';
    // this.visible = true;

    // app.whiteOver.alpha = 1;
    // TweenMax.to(app.whiteOver, 14/30, {alpha: 0, ease: Power2.easeInOut, onComplete: function()
    // {
    //   self.tween({name: 'show'});
    // }});
  }

  if(data.name == 'show' && this.state != 'show')
  {
    this.state = 'show';
    this.visible = true;
    this.interactiveChildren = true;

    TweenMax.delayedCall(1.0, function()
    {
      if(self.state == 'show') self.panelLogo.playAnimation();
    });

    if(callback) callback();
  }
  if(data.name == 'hide' && this.state != 'hide')
  {
    this.state = 'hide';
    this.visible = false;
    this.interactiveChildren = false;

    this.panelLogo.stopAnimation();

    if(callback) callback();
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelLogo = function(config)
{
  config.width = 682;
  config.height = 285;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.positionType = 'center-top';
  this.yRelative = 0;
  this.xRelative = 0;

  // this.initBlockInputBg(5000, 5000, bind(function()
  // {

  // }, this));

  this.state = 'show';

  this.logoLabel = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'logo_label.png'));
  this.addChild(this.logoLabel);
  this.logoLabel.anchor.set(0.5, 0.5);
  this.logoLabel.x = -210*0.66;
  this.logoLabel.y = 73*0.66;

  this.containerCard = new PIXI.Container();
  this.addChild(this.containerCard);
  this.containerCard.x = 321*0.66;
  this.containerCard.y = 0*0.66;

  this.logoCardRed = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'logo_card_red.png'));
  this.containerCard.addChild(this.logoCardRed);
  this.logoCardRed.anchor.set(0.5, 0.5);

  this.logoCardYellow = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'logo_card_yellow.png'));
  this.containerCard.addChild(this.logoCardYellow);
  this.logoCardYellow.anchor.set(0.5, 0.5);
  this.logoCardYellow.alpha = 0;

  this.blink = new PanelsBlink({ mask: assetsManager.getTexture('texture_atlas', 'logo_card_red.png') });
  this.containerCard.addChild(this.blink);

  this.containerOperations = new PIXI.Container();
  this.addChild(this.containerOperations);
  this.containerOperations.x = -208*0.66;
  this.containerOperations.y = -95*0.66;

  this.operations = [];
  for(var i = 0; i < 4; i++)
  {
    var operation = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'logo_o_'+(i+1)+'.png'));
    this.containerOperations.addChild(operation);
    operation.anchor.set(0.5, 0.5);
    operation.x = -144 + 96*i;
    operation.y = 15;

    this.operations.push(operation);
  }

  this.starsSplash1 = new StarsSplash({type: 'fbf'});
  this.addChild(this.starsSplash1);
  this.starsSplash2 = new StarsSplash({type: 'fbf'});
  this.addChild(this.starsSplash2);
  this.starsSplash2.scale.x = -0.9;
  this.starsSplash2.scale.y = 0.9;
  this.starsSplash2.rotation = 45 * Util.TO_RADIANS;

  var splashK = 0.7;
  this.starsSplash1.scale.x *= splashK;
  this.starsSplash1.scale.y *= splashK;
  this.starsSplash2.scale.x *= splashK;
  this.starsSplash2.scale.y *= splashK;

  this.blinks = new FBFAnimation();
  this.addChild(this.blinks);
  this.blinks.scale.x = this.blinks.scale.y = 1.4;
  this.blinks.addSequence('star', 'texture_atlas', 'Card24Blinks/frame_', 1, 16, 30, { x: -190/2, y: -143/2, loop: false });
  this.blinks.switchSequence('star');
  this.blinks.x = this.containerCard.x;
  this.blinks.y = this.containerCard.y - 5;
  this.blinks.visible = false;

  this.starsSplash1.x = this.starsSplash2.x = this.containerCard.x;
  this.starsSplash1.y = this.starsSplash2.y = this.containerCard.y;
}
PanelLogo.prototype = Object.create(Gui.BasePanel.prototype);
PanelLogo.prototype.constructor = PanelLogo;

// PanelLogo.prototype.startAnim = function()
// {
//   var self = this;


//   this.playAnimation(operationsTweenComplete);
//   function operationsTweenComplete()
//   {
//     self.playAnimation(operationsTweenComplete);
//   }
// }

PanelLogo.prototype.resetAnim = function()
{
  for(var i = 0; i < this.operations.length; i++)
  {
    var operation = this.operations[i];
    operation.scale.x = operation.scale.y = 1.0;
  }

  this.logoCardYellow.alpha = 0;
  this.logoCardRed.alpha = 1;

  this.blinks.visible = false;
}

PanelLogo.prototype.playAnimation = function()
{
  var self = this;

  this.resetAnim();

  // console.log('PlayAnimation');

  for(var i = 0; i < this.operations.length; i++)
  {
    var operation = this.operations[i];

    tweenOperation(operation, 0 + i*(4/30));
  }

  function tweenOperation(operation, delay)
  {
    var pX = operation.x;

    // TweenMax.to(operation, 6/30, {x: pX + 10, delay: delay, ease: Power2.easeInOut});
    TweenMax.to(operation.scale, 5/30, {x: 1.25, y: 1.25, delay: delay, ease: Power1.easeIn, onComplete: function()
    {
      // TweenMax.to(operation, 6/30, {x: pX, ease: Power2.easeInOut});
      TweenMax.to(operation.scale, 5/30, {x: 1.0, y: 1.0, ease: Power1.easeOut, onComplete: function()
      {
        // if(callback) callback();
      }});
    }});
  }  

  var logoDelay = 16/30;

  var lX = this.containerCard.x;
  TweenMax.to(this.containerCard, 4/30, {pixi: { scaleX: 1.06, scaleY: 1.06 }, ease: Power1.easeIn, delay: logoDelay, onComplete: function()
  {
    TweenMax.to(self.containerCard, 4/30, {pixi: { scaleX: 1.0, scaleY: 1.0 }, ease: Power1.easeOut});
  }});

  TweenMax.to(this.logoCardYellow, 4/30, { alpha: 1.0, ease: Power1.easeOut, delay: logoDelay});
  TweenMax.to(this.logoCardYellow, 15/30, { alpha: 0.0, ease: Power1.easeIn, delay: logoDelay + 40/30, onComplete: function()
  {
    
  }});  

  TweenMax.delayedCall(logoDelay, function()
  {
    self.blink.play({time: 16/30});

    self.starsSplash1.play();
    TweenMax.delayedCall(3/30, function()
    {
      self.starsSplash2.play();
    });
    TweenMax.delayedCall(15/30, function()
    {
      self.blinks.visible = true;
      self.blinks.gotoAndPlay(1);
    });
  });

  TweenMax.delayedCall((90 + 60)/30, self.playAnimation, [], self);
}

PanelLogo.prototype.stopAnimation = function()
{
  TweenMax.killDelayedCallsTo(this.playAnimation);
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelLinearMenu = function(config)
{
  Gui.BasePanel.call(this, config);


  var self = this;

  // this.initBlockInputBg(5000, 5000, bind(function()
  // {

  // }, this));

  this.state = 'show';

  this.menuState = 'not_init';

  // this.visible = false;
  // this.interactiveChildren = false;

  var info = config.info;

  this.size = info.size;
  this.segmentSize = info.segment_size;

  this.segments = [];
  this.segment = null;

  this.bg = info.bg;
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  this.selector = info.selector;
  this.addChild(this.selector);
  this.selector.anchor.set(0.5, 0.5);

  for(var i = 0; i < info.segments.length; i++)
  {
    var segmentInfo = info.segments[i];

    var segment = this.createSegment(segmentInfo, i);
    this.segments.push(segment);
  }

  // console.log(this.bg);

  // this.buttonClose = Gui.createSimpleButton({name: 'button_close', parentPanel: this, width: 69, height: 69, x: 900/2-40, y: -800/2+40},
  // {
  //   pathToSkin: 'button_close.png',
  //   onClick: function()
  //   {
  //     if(self.state != 'show') return;

  //     self.tween({name: 'hide_anim'}, function()
  //     {
  //       // if(app.gameData.settings.timeMode) app.screenGame.panelTime.activate();
  //     });
  //   }
  // }); 
}
PanelLinearMenu.prototype = Object.create(Gui.BasePanel.prototype);
PanelLinearMenu.prototype.constructor = PanelLinearMenu;

PanelLinearMenu.prototype.getSegment = function(d)
{
  if(typeof d == 'number') return this.segments[d];

  if(typeof d == 'string')
  {
    for(var i = 0; i < this.segments.length; i++)
    {
      if(this.segments[i].name == d) return this.segments[i];
    }
  }

  return null;
}

PanelLinearMenu.prototype.setTo = function(d)
{
  var segment = this.getSegment(d);

  this.menuState = 'normal';
  this.segment = segment;
  this.selector.x = this.segment.x;

  for(var i = 0; i < this.segments.length; i++)
  {
    if(this.segments[i] != this.segment) this.segments[i].setToHide();
  }
  this.segment.setToShow();

  this.emit('segment_setted', this.segment.name);
}

PanelLinearMenu.prototype.switchTo = function(d)
{
  if(this.menuState != 'normal') return false;

  var self = this;

  var nextSegment = this.getSegment(d);

  if(this.segment == nextSegment)
  {
    if(this.segments.length == 2)
    {
      if(this.segments[0] != this.segment) return this.switchTo(this.segments[0].name);
      else return this.switchTo(this.segments[1].name);
    }

    return false;
  }

  this.menuState = 'switching_to_' + nextSegment.name;

  var time = 0.4;

  this.segment.tween({name: 'to_hide', time: time});
  nextSegment.tween({name: 'to_show', time: time});

  TweenMax.to(this.selector, time * 1.1, {x: nextSegment.x, ease: Power2.easeOut, onComplete: function()
  {
    self.segment = nextSegment;

    self.setTo(d);
  }});

  return true;
}

PanelLinearMenu.prototype.createSegment = function(segmentInfo, n)
{
  var self = this;

  var segment = {};

  segment.name = segmentInfo.name;
  segment.state = 'normal';

  var segmentX = -this.size / 2 + this.segmentSize/2 + this.segmentSize * n;
  segment.x = segmentX;

  var container = new PIXI.Container();
  this.addChild(container);
  container.x = segmentX;
  container.y = 0;
  segment.container = container;

  var labelWhite = segmentInfo.label_white;
  container.addChild(labelWhite);
  labelWhite.anchor.set(0.5, 0.5);
  segment.labelWhite = labelWhite;

  var labelGray = segmentInfo.label_gray;
  container.addChild(labelGray);
  labelGray.anchor.set(0.5, 0.5);
  segment.labelGray = labelGray;
  
  segment.setToShow = function()
  {
    segment.labelWhite.visible = true;
    segment.labelWhite.alpha = 1.0;   

    segment.labelGray.visible = false;
    segment.labelGray.alpha = 0.0;
  };  
  segment.setToHide = function()
  {
    segment.labelWhite.visible = false;
    segment.labelWhite.alpha = 0.0;

    segment.labelGray.visible = true;
    segment.labelGray.alpha = 1.0;
  };

  segment.tween = function(data)
  {
    if(segment.state == 'normal' && data.name == 'to_show')
    {
      if(segment.container.getChildIndex(segment.labelGray) > segment.container.getChildIndex(segment.labelWhite)) segment.container.setChildIndex(segment.labelWhite, segment.container.getChildIndex(segment.labelGray));
      
      segment.state = 'to_show';

      segment.labelWhite.visible = true;
      segment.labelWhite.alpha = 0.0;

      segment.labelGray.visible = true;
      segment.labelGray.alpha = 1.0;

      TweenMax.to(segment.labelGray, data.time, {alpha: 0.0, ease: Power2.easeOut});
      TweenMax.to(segment.labelWhite, data.time, {alpha: 1.0, ease: Power2.easeOut, onComplete: function()
      {
        segment.labelGray.visible = false;

        segment.state = 'normal';
      }});
    }
    if(segment.state == 'normal' && data.name == 'to_hide')
    {
      if(segment.container.getChildIndex(segment.labelWhite) > segment.container.getChildIndex(segment.labelGray)) segment.container.setChildIndex(segment.labelGray, segment.container.getChildIndex(segment.labelWhite));
      
      segment.state = 'to_hide';

      segment.labelWhite.visible = true;
      segment.labelWhite.alpha = 1.0;

      segment.labelGray.visible = true;
      segment.labelGray.alpha = 0.0;

      TweenMax.to(segment.labelWhite, data.time, {alpha: 0.0, ease: Power2.easeOut});
      TweenMax.to(segment.labelGray, data.time, {alpha: 1.0, ease: Power2.easeOut, onComplete: function()
      {
        segment.labelWhite.visible = false;

        segment.state = 'normal';
      }});
    }
  }

  var interactiveBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'white_rect.png'));
  container.addChild(interactiveBg);
  interactiveBg.width = this.segmentSize * 0.9;
  interactiveBg.height = this.height * 0.9;
  interactiveBg.anchor.set(0.5, 0.5);
  interactiveBg.alpha = 0;

  container.interactive = true;
  container.buttonMode = true;

  var onCl = function()
  {
    var isSwitch = self.switchTo(segment.name);
    if(isSwitch) app.playAudio('sounds', 'sound_click');
    // self.switchTo(this);
  }
  container.on('tap', onCl, segment);
  container.on('click', onCl, segment);

  return segment;
}

PanelLinearMenu.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show' && this.state != 'show')
  {
    this.state = 'show';
    this.visible = true;
    this.interactiveChildren = true;

    if(callback) callback();
  }
  if(data.name == 'hide' && this.state != 'hide')
  {
    this.state = 'hide';
    this.visible = false;
    this.interactiveChildren = false;

    if(callback) callback();
  }
}