var ScreenAchievements = function(config)
{
  config.sizeType = 'relative';
  config.widthRelative = 1;
  config.heightRelative = 1;
  Gui.BasePanel.call(this, config);


  var self = this;


  // this.initBlockInputBg(2000, 2000, function()
  // {
  //   for(var i = 0; i < self.ddMenus.length; i++)
  //   {
  //     var m = self.ddMenus[i];
  //     if(m.menuState == 'open') m.close();
  //   }
  // });
  // this.invisibleBg.interactive = false; 

  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;
  // this.alpha = 0;

  this.containerItems = new PIXI.Container();
  this.addChild(this.containerItems);

  this.containerItems.y = - 200;

  this.logo = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'achievements_logo.png'));
  this.addChild(this.logo);
  this.logo.anchor.set(0.5, 0.5);

  this.buttonBack = Gui.createSimpleButton({name: 'button_back', parentPanel: this, width: 163, height: 77, positionType: 'left-bot', xRelative: 10, yRelative: -10},
  {
    pathToSkin: 'button_back.png',
    onClick: function()
    {
      if(self.state != 'show') return;

      self.toMainMenu();
    }
  }); 

  this.items = [];
  for(var i = 0; i < app.gameData.achievements.items.length; i++)
  {
    var item = new AchievementItem({n: i, info: app.gameData.achievements.items[i], screenAchievements: this});

    this.items.push(item);
  }

  this.achievementsCompleteList = [];

  // TweenMax.delayedCall(0.5, function()
  // {
  //   self.ddMenuGame.open();
  // });

  // TweenMax.delayedCall(2.5, function()
  // {
  //   self.ddMenuGame.close(self.ddMenuGame.items[2]);
  // });

  app.on('achievement_complete', function(data)
  {
    self.achievementsCompleteList.push(data.item);
    self.checkAchievementsCompleteList();
  });


  guiManager.on('game_resize', this.onResize, this);
  guiManager.on('orientation_change', this.onOrientationChange, this);

  app.on('board_style_setted', function(boardStyle)
  {
    if(boardStyle == 'realistic')
    {
      this.logo.texture = assetsManager.getTexture('texture_atlas', 'achievements_logo_green.png');
    }
    else 
    {
      this.logo.texture = assetsManager.getTexture('texture_atlas', 'achievements_logo.png');
    }
  }, this);
}
ScreenAchievements.prototype = Object.create(Gui.BasePanel.prototype);
ScreenAchievements.prototype.constructor = ScreenAchievements;

ScreenAchievements.prototype.onResize = function(data)
{
  // var bounds = this.containerContent.getLocalBounds();
  // var p = this.toLocal(this.containerContent.toGlobal(new PIXI.Point(bounds.width/2, bounds.width/2)));
  // this.containerContent.x = 0;
  // this.containerContent.y = 78;
}
ScreenAchievements.prototype.onOrientationChange = function(data)
{
  var orientation = data.orientation;

  if(orientation == 'portrait')
  {

  }  
  if(orientation == 'landscape')
  {

  }
}

ScreenAchievements.prototype.toMainMenu = function()
{
  this.tween({name: 'hide_anim'}, function()
  {

  });

  TweenMax.delayedCall(8/30, function()
  {
    app.screenMainMenu.tween({name: 'show_anim'});
  });
}

ScreenAchievements.prototype.checkAchievementsCompleteList = function()
{
  if(this.achievementsCompleteList.length == 0 || app.panelAchievementComplete.state != 'hide') return;

  var self = this;

  var item = this.achievementsCompleteList[0];
  var panelAchievement = null;
  for(var i = 0; i < this.items.length; i++)
  {
    if(this.items[i].info == item)
    {
      panelAchievement = this.items[i];
      break;
    }
  }

  if(panelAchievement != null && item != null)
  {
    app.panelAchievementComplete.showAchievementComplete(panelAchievement, function()
    {
      self.checkAchievementsCompleteList();
    });

    this.achievementsCompleteList.splice(0, 1);
  }
}

ScreenAchievements.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim' && this.state == 'hide')
  {
    this.state = 'show_anim';
    this.visible = true;

    var time = 14 / 30;

    this.logo.y = -350-100;
    TweenMax.to(this.logo, time, { y: -350, ease: Power2.easeOut });

    this.buttonBack.xRelative = 10 - 100;
    TweenMax.to(this.buttonBack, time, { xRelative: 10, ease: Power2.easeOut });

    this.containerItems.y = -200+100;
    TweenMax.to(this.containerItems, time, { y: -200, ease: Power2.easeOut });

    this.alpha = 0;
    TweenMax.to(this, time, {alpha: 1.0, ease: Power2.easeOut});

    TweenMax.delayedCall(time, function()
    {
      self.tween({name: 'show'}, callback);
    });
  }

  if(data.name == 'hide_anim' && this.state == 'show')
  {
    this.state = 'hide_anim';
    this.interactiveChildren = false;

    var time = 14 / 30;

    TweenMax.to(this.logo, time, { y: -350-100, ease: Power2.easeOut });

    TweenMax.to(this.buttonBack, time, { xRelative: 10-100, ease: Power2.easeOut });

    TweenMax.to(this.containerItems, time, { y: -200+100, ease: Power2.easeOut });

    TweenMax.to(this, time, {alpha: 0.0, ease: Power2.easeOut});

    TweenMax.delayedCall(time, function()
    {
      self.tween({name: 'hide'}, callback);
    });
  }

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
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var AchievementItem = function(config)
{
  PIXI.Container.call(this);


  var self = this;

  this.state = 'wait';

  this.num = config.n;
  this.info = config.info;
  this.screenAchievements = config.screenAchievements;
  // console.log(this.info);


  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'achievements_bg_black.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);
  this.bg.x = 0;

  this.rect = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'achievements_rect.png'));
  this.addChild(this.rect);
  this.rect.anchor.set(0.5, 0.5);
  this.rect.x = -368-30;

  this.mark = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'achievements_v.png'));
  this.addChild(this.mark);
  this.mark.anchor.set(0.5, 0.5);
  this.mark.x = -363-30;
  this.mark.y = -12;
  this.mark.visible = false;

  this.textLabel = Util.setParams(new Gui.TextBmp(this.info.label,  constsManager.getData('text_configs/achievements_label')), {parent: this, aX:0, aY:0.5, x: this.bg.x-330, y: 4});

  if(this.info.complete) this.tween({name: 'check'});
  else this.tween({name: 'uncheck'});

  // this.screenAchievements.containerItems.addChild(this);
  // this.y = 70 * this.num;
  this.placeToMainPanel();
}
AchievementItem.prototype = Object.create(PIXI.Container.prototype);
AchievementItem.prototype.constructor = AchievementItem;

AchievementItem.prototype.placeToMainPanel = function()
{
  this.screenAchievements.containerItems.addChild(this);
  this.visible = true;
  this.alpha = 1.0;

  if(this.info.complete) this.bg.texture = assetsManager.getTexture('texture_atlas', 'achievements_bg_gold.png');
  else this.bg.texture = assetsManager.getTexture('texture_atlas', 'achievements_bg_black.png')

  this.y  = 70*this.num;
}

AchievementItem.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'check_anim')
  {
    this.mark.visible = true;
    this.mark.alpha = 0;
    this.mark.y = -12-10;
    TweenMax.to(this.mark, 12/30, {y: -12, alpha: 1.0, ease: Power2.easeOut, onComplete: function()
    {
      if(callback) callback();
    }});
  }

  if(data.name == 'check')
  {
    this.mark.visible = true;
    this.mark.alpha = 1.0;
    this.mark.y = -12;
  }
  if(data.name == 'uncheck')
  {
    this.mark.visible = false;
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelAchievementComplete = function(config)
{
  config.width = 840;
  config.height = 102;
  config.positionType = 'center-bot';
  Gui.BasePanel.call(this, config);


  var self = this;

  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'achievements_panel_bg.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);
}
PanelAchievementComplete.prototype = Object.create(Gui.BasePanel.prototype);
PanelAchievementComplete.prototype.constructor = PanelAchievementComplete;

PanelAchievementComplete.prototype.showAchievementComplete = function(panelAchievement, callback)
{
  var self = this;

  this.state = 'show';

  var item = panelAchievement.info;

  this.visible = true;
  this.xRelative = 0;
  this.yRelative = -10 + 100;
  this.alpha = 0;

  this.addChild(panelAchievement);
  panelAchievement.x = 0;
  panelAchievement.y = 0;

  TweenMax.to(this, 12/30, { yRelative: -10, alpha: 1.0, ease: Power2.easeOut, onComplete: function()
  {
    panelAchievement.tween({name: 'check_anim'}, function()
    {
      TweenMax.to(self, 12/30, { yRelative: -10 + 100, alpha: 0, ease: Power2.easeOut, delay: app.achievementPopupDisplayTime, onComplete: function()
      {
        self.state = 'hide';
        self.visible = false;

        panelAchievement.placeToMainPanel();

        if(callback) callback();
      }});
    });
  }});
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelHelp = function(config)
{
  config.width = 875;
  config.height = 813;
  Gui.BasePanel.call(this, config);


  var self = this;


  this.initBlockInputBg(5000, 5000, function()
  {
      if(self.state != 'show') return;

      self.tween({name: 'hide_anim'});
  });
  this.invisibleBg.texture = assetsManager.getTexture('texture_atlas', 'panel_help_dark.png');
  this.invisibleBg.alpha = 1.0;
  // this.invisibleBg.interactive = false; 

  this.state = 'hide';
  this.visible = false;

  this.bgBig = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'help_bg_big_blue.png'));
  this.addChild(this.bgBig);
  this.bgBig.anchor.set(0.5, 0.5);
  this.bgBig.interactive = true;

  this.bgSmall = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'help_bg_small_blue.png'));
  this.addChild(this.bgSmall);
  this.bgSmall.anchor.set(0.5, 0.5);
  this.bgSmall.interactive = true;

  this.textTitle = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'help_text_title.png'));
  this.addChild(this.textTitle);
  this.textTitle.anchor.set(0.5, 0.5);

  this.bgSelection = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'help_selection_blue.png'));
  this.addChild(this.bgSelection);
  this.bgSelection.anchor.set(0.5, 0.5);

  this.textClassic = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'help_text_classic.png'));
  this.addChild(this.textClassic);
  this.textClassic.anchor.set(0.5, 0.5);

  this.textAllFives = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'help_text_all_fives.png'));
  this.addChild(this.textAllFives);
  this.textAllFives.anchor.set(0.5, 0.5);

  this.textBlock = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'help_text_block.png'));
  this.addChild(this.textBlock);
  this.textBlock.anchor.set(0.5, 0.5);

  // this.buttonOk = Gui.createSimpleButton({name: 'button_ok', parentPanel: this, width: 206, height: 74, x: 0, y: 356},
  // {
  //   pathToSkin: 'panel_help_button_ok.png',
  //   onClick: function()
  //   {
  //     if(self.state != 'show') return;

  //     self.tween({name: 'hide_anim'});
  //   }
  // }); 

  this.buttonClose = Gui.createSimpleButton({name: 'button_close', parentPanel: this, width: 50, height: 50, x: this.width/2-50/2, y: -this.height/2+50/2},
  {
    pathToSkin: 'panel_help_button_close.png',
    onClick: function()
    {
      if(self.state != 'show') return;

      self.tween({name: 'hide_anim'});
    }
  }); 

  app.on('board_style_setted', function(boardStyle)
  {
    // console.log('BS:', boardStyle);
    if(boardStyle == 'minimalistic')
    {
      this.invisibleBg.texture = assetsManager.getTexture('texture_atlas', 'panel_help_dark.png');
      this.bgBig.texture = assetsManager.getTexture('texture_atlas_2', 'help_bg_big_blue.png');
      this.bgSmall.texture = assetsManager.getTexture('texture_atlas_2', 'help_bg_small_blue.png');
      this.bgSelection.texture = assetsManager.getTexture('texture_atlas_2', 'help_selection_blue.png');
      // this.titleBg.texture = assetsManager.getTexture('texture_atlas', 'panel_help_title_blue.png');
    }
    else if(boardStyle == 'realistic')
    {
      this.invisibleBg.texture = assetsManager.getTexture('texture_atlas', 'panel_help_dark_green.png');
      this.bgBig.texture = assetsManager.getTexture('texture_atlas_2', 'help_bg_big_green.png');
      this.bgSmall.texture = assetsManager.getTexture('texture_atlas_2', 'help_bg_small_green.png');
      this.bgSelection.texture = assetsManager.getTexture('texture_atlas_2', 'help_selection_green.png');
      // this.titleBg.texture = assetsManager.getTexture('texture_atlas', 'panel_help_title_green.png');
    }
  }, this);
}
PanelHelp.prototype = Object.create(Gui.BasePanel.prototype);
PanelHelp.prototype.constructor = PanelHelp;

PanelHelp.prototype.setAsBig = function()
{
  this.bgSmall.visible = false;
  this.bgBig.visible = true;

  this.buttonClose.y = -813/2+50/2;

  this.textTitle.y = -243;

  this.textClassic.visible = true;
  this.textClassic.y = -17;
  this.textAllFives.visible = true;
  this.textAllFives.y = 152;
  this.textBlock.visible = true;
  this.textBlock.y = 309;

  var text = null;
  if(app.gameData.rules == 'draw') text = this.textClassic;
  else if(app.gameData.rules == 'all_fives') text = this.textAllFives;
  else if(app.gameData.rules == 'block') text = this.textBlock;

  this.bgSelection.visible = true;

  this.bgSelection.width = this.bgBig.width;
  this.bgSelection.height = text.height+10;
  this.bgSelection.y = text.y;

  // text.visible = true;
}

PanelHelp.prototype.setAsSmall = function()
{
  this.bgSmall.visible = true;
  this.bgBig.visible = false;

  this.buttonClose.y = -470/2+50/2;

  this.textTitle.y = -98;

  this.textClassic.visible = false;
  this.textAllFives.visible = false;
  this.textBlock.visible = false;

  this.bgSelection.visible = false;

  var text = null;
  if(app.gameData.rules == 'draw') text = this.textClassic;
  else if(app.gameData.rules == 'all_fives') text = this.textAllFives;
  else if(app.gameData.rules == 'block') text = this.textBlock;

  text.visible = true;
  text.y = 130;
}

PanelHelp.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim')
  {
    this.state = 'show_anim';
    this.visible = true;

    this.alpha = 0;
    this.y = -100;

    TweenMax.pauseAll();

    if(data.type == 'big') this.setAsBig();
    else if(data.type == 'small') this.setAsSmall();

    var time = 14 / 30;

    TweenMax.to(this, time, {alpha: 1, y: 0, ease: Power3.easeOut, onComplete: function()
    {
      self.tween({name: 'show'}, callback);
    }});
  }

  if(data.name == 'hide_anim' && this.state == 'show')
  {
    this.state = 'hide_anim';
    this.interactiveChildren = false;

    var time = 14 / 30;

    TweenMax.to(this, time, {alpha: 0, y: -100, ease: Power3.easeOut, onComplete: function()
    {
      TweenMax.resumeAll();
      
      self.tween({name: 'hide'}, callback);
    }});
  }

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
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //