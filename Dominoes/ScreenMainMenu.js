var ScreenMainMenu = function(config)
{
  config.sizeType = 'relative';
  config.widthRelative = 1;
  config.heightRelative = 1;
  Gui.BasePanel.call(this, config);


  var self = this;


  this.initBlockInputBg(2000, 2000, function()
  {
    for(var i = 0; i < self.ddMenus.length; i++)
    {
      var m = self.ddMenus[i];
      if(m.menuState == 'open') m.close();
    }
  });
  // this.invisibleBg.interactive = false; 

  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;
  // this.alpha = 0;

  this.containerContent = new PIXI.Container();
  this.addChild(this.containerContent);
  this.containerContent.x = 0;
  this.containerContent.y = 78;

  this.logo = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'logo_1.png'));
  this.containerContent.addChild(this.logo);
  this.logo.anchor.set(0.5, 0.5);

  this.logoPositionY = -200-this.logo.height/2;

  this.logo.y = this.logoPositionY;
  // this.logo.y = -330;
  // logo.visible = false;

  this.containerMenus = new PIXI.Container();
  this.containerContent.addChild(this.containerMenus);

  var checkOpenFunction = function()
  {
    return self.state == 'show' && 
           (self.ddMenuGame.menuState == 'normal' || self.ddMenuGame.menuState == 'open') &&
           (self.ddMenuPlayers.menuState == 'normal' || self.ddMenuPlayers.menuState == 'open') &&
           (self.ddMenuDificulty.menuState == 'normal' || self.ddMenuDificulty.menuState == 'open');
  }

  this.ddMenuGame = new PanelDropDownMenu({parentPanel: this, layer: this.containerMenus, x: 0, y: -80, info:
                                          {
                                            type: 'main',

                                            icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_game_icon.png')),

                                            items:
                                            [
                                              {name: 'draw', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_game_item_1.png'))},
                                              {name: 'all_fives', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_game_item_2.png'))},
                                              {name: 'block', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_game_item_3.png'))}
                                            ],

                                            checkOpenFunction: checkOpenFunction
                                          }});
  this.ddMenuGame.on('set_to', function(data)
  {
    app.setRules(data.name);

    app.gameData.menu.game = data.name;

    app.save();
  });

  this.ddMenuPlayers = new PanelDropDownMenu({parentPanel: this, layer: this.containerMenus, x: 0, y: 0, info:
                                          {
                                            type: 'main',

                                            icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_players_icon.png')),

                                            items:
                                            [
                                              {name: '1v1', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_players_item_1.png'))},
                                              {name: '1v2', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_players_item_2.png'))},
                                              {name: '1v3', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_players_item_3.png'))},
                                              {name: '2v2', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_players_item_4.png'))}
                                            ],

                                            checkOpenFunction: checkOpenFunction
                                          }});
  this.ddMenuPlayers.on('set_to', function(data)
  {
    app.setPlayers(data.name);

    app.gameData.menu.players = data.name;

    app.save();
  });

  this.ddMenuDificulty = new PanelDropDownMenu({parentPanel: this, layer: this.containerMenus, x: 0, y: 80, info:
                                          {
                                            type: 'main',

                                            icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_dificulty_icon.png')),

                                            items:
                                            [
                                              {name: 'normal', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_dificulty_item_1.png'))},
                                              {name: 'hard', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_dificulty_item_2.png'))}
                                            ],

                                            checkOpenFunction: checkOpenFunction
                                          }});
  this.ddMenuDificulty.on('set_to', function(data)
  {
    app.setDificulty(data.name);

    app.gameData.menu.dificulty = data.name;

    app.save();
  });

  this.ddMenuGame.setTo(app.gameData.menu.game);
  this.ddMenuPlayers.setTo(app.gameData.menu.players);
  this.ddMenuDificulty.setTo(app.gameData.menu.dificulty);

  this.ddMenus = [this.ddMenuGame, this.ddMenuPlayers, this.ddMenuDificulty];
  for(var i = 0; i < this.ddMenus.length; i++)
  {
    var menu = this.ddMenus[i];
    addMenuBehaviour(menu);
  }

  function addMenuBehaviour(menu)
  {
    menu.on('open_start', function()
    {
      var toClose = [];
      for(var i = 0; i < self.ddMenus.length; i++)
      {
        var m = self.ddMenus[i];
        if(m == menu) continue;

        
        if(m.menuState == 'open') toClose.push(m);    
        // else TweenMax.to(m, 10/30, { pixi: {colorize: '#000000', colorizeAmount: 0.3 } });    
      }

      for(var i = 0; i < toClose.length; i++)
      {
        var m = toClose[i];
        m.close();
      }

      for(var i = 0; i < self.ddMenus.length; i++)
      {
        var m = self.ddMenus[i];
        if(m == menu) continue;

        TweenMax.to(m, 10/30, { pixi: {colorize: '#000000', colorizeAmount: 0.4 } });    
      }

      TweenMax.to(menu, 10/30, { pixi: {colorize: '#000000', colorizeAmount: 0.0 } });
    }, self);

    menu.on('close_start', function()
    {
      for(var i = 0; i < self.ddMenus.length; i++)
      {
        var m = self.ddMenus[i];
        if(m == menu) continue;

        TweenMax.to(m, 10/30, { pixi: {colorize: '#000000', colorizeAmount: 0.0 } });
      }
    }, self);
  }

  this.buttonHelp = Gui.createSimpleButton({name: 'button_help', parentPanel: this, layer: this.containerMenus, width: 50, height: 50, x: 253, y: -80},
  {
    pathToSkin: 'main_menu_button_help_1.png',
    onClick: function()
    {
      if(self.state != 'show' || app.panelHelp.state != 'hide' || app.panelSettings.state != 'hide') return;

      app.panelHelp.tween({ type: 'big', name: 'show_anim'})
    }
  }); 

  this.buttonPlayPositionY = 200+117/2;

  this.buttonPlay = Gui.createSimpleButton({name: 'button_play', parentPanel: this, layer: this.containerContent, width: 390, height: 117, x: 0, y: this.buttonPlayPositionY},
  {
    pathToSkin: 'button_play.png',
    onClick: function()
    {
      // console.log('Play');
      if(self.state == 'show' && app.screenGame.state == 'hide' && checkOpenFunction() && app.popupSave.state == 'hide')
      {
        for(var i = 0; i < self.ddMenus.length; i++)
        {
          var m = self.ddMenus[i];
          if(m.menuState == 'open') m.close();
        }

        TweenMax.delayedCall(6/30, function()
        {
          self.toGame();
        });

        app.playAudio('sounds', 'sound_button_play');
      }
    }
  }); 
  // this.buttonPlay.isClickTween = false;
  this.buttonPlay.isClickSound = false;

  this.buttonAchievements = Gui.createSimpleButton({name: 'button_achievements', parentPanel: this, width: 85, height: 85, positionType: 'left-bot', xRelative: 10, yRelative: -10},
  {
    pathToSkin: 'button_achievements_1.png',
    onClick: function()
    {
      if(self.state == 'show' && app.screenGame.state == 'hide' && checkOpenFunction())
      {
        self.toAchievements();
      }
    }
  }); 

  this.buttonSettings = Gui.createSimpleButton({name: 'button_settings', parentPanel: this, width: 50, height: 50, positionType: 'left-top', xRelative: 10, yRelative: 10},
  {
    pathToSkin: 'button_settings_1.png',
    onClick: function()
    {
      if(app.screenMainMenu.state == 'show' && app.panelSettings.state == 'hide') app.panelSettings.tween({name: 'show_anim'});
    }
  });  

  // TweenMax.delayedCall(0.5, function()
  // {
  //   self.ddMenuGame.open();
  // });

  // TweenMax.delayedCall(2.5, function()
  // {
  //   self.ddMenuGame.close(self.ddMenuGame.items[2]);
  // });


  guiManager.on('game_resize', this.onResize, this);
  guiManager.on('orientation_change', this.onOrientationChange, this);

  app.on('board_style_setted', function(boardStyle)
  {
    if(boardStyle == 'minimalistic')
    {
      this.logo.texture = assetsManager.getTexture('texture_atlas', 'logo_1.png');
      this.buttonHelp.skin.texture = assetsManager.getTexture('texture_atlas', 'main_menu_button_help_1.png');
      this.buttonAchievements.skin.texture = assetsManager.getTexture('texture_atlas', 'button_achievements_1.png');

      this.buttonSettings.skin.texture = assetsManager.getTexture('texture_atlas', 'button_settings_1.png');
    }
    else if(boardStyle == 'realistic')
    {
      this.logo.texture = assetsManager.getTexture('texture_atlas', 'logo_2.png');
      this.buttonHelp.skin.texture = assetsManager.getTexture('texture_atlas', 'main_menu_button_help_2.png');
      this.buttonAchievements.skin.texture = assetsManager.getTexture('texture_atlas', 'button_achievements_2.png');

      this.buttonSettings.skin.texture = assetsManager.getTexture('texture_atlas', 'button_settings_2.png');
    }
  }, this);
}
ScreenMainMenu.prototype = Object.create(Gui.BasePanel.prototype);
ScreenMainMenu.prototype.constructor = ScreenMainMenu;

ScreenMainMenu.prototype.onResize = function(data)
{
  // var bounds = this.containerContent.getLocalBounds();
  // var p = this.toLocal(this.containerContent.toGlobal(new PIXI.Point(bounds.width/2, bounds.width/2)));
  // this.containerContent.x = 0;
  // this.containerContent.y = 78;
}
ScreenMainMenu.prototype.onOrientationChange = function(data)
{
  var orientation = data.orientation;

  if(orientation == 'portrait')
  {

  }  
  if(orientation == 'landscape')
  {

  }
}

ScreenMainMenu.prototype.checkSaveGame = function()
{
  var self = this;
  // console.log('checkSaveGame');
  var activeGame = app.loadActiveGame(app.gameData.rules, app.gameData.players, app.gameData.dificulty);
  if(activeGame != null)
  {
    app.popupSave.show(function()
    {
     app.popupSave.tween({name: 'hide_anim'}, function()
     {
       // console.log('Selected: Yes');
       self.toGame(activeGame);
     });
    },
    function()
    {
     app.popupSave.tween({name: 'hide_anim'}, function()
     {
       // console.log('Selected: No');
     });
    });
  }

  console.log('Active game:', activeGame);
}

ScreenMainMenu.prototype.toGame = function(activeGame)
{
  if(activeGame == undefined) activeGame = null;

  this.tween({name: 'hide_anim'}, function()
  {

  });

  TweenMax.delayedCall(8/30, function()
  {
    // app.screenGame.tween({name: 'show_anim'});
    app.screenGame.initGameFromMainMenu(activeGame);
  });
}

ScreenMainMenu.prototype.toAchievements = function()
{
  this.tween({name: 'hide_anim'}, function()
  {

  });

  TweenMax.delayedCall(8/30, function()
  {
    app.screenAchievements.tween({name: 'show_anim'});
  });
}

ScreenMainMenu.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim' && this.state == 'hide')
  {
    this.state = 'show_anim';
    this.visible = true;

    var time = 14 / 30;

    this.alpha = 1;

    this.logo.alpha = 0;
    // this.logo.x = -100;
    this.logo.y = this.logoPositionY - 80;
    TweenMax.to(this.logo, time, { alpha: 1, x: 0, y: this.logoPositionY, ease: Power2.easeOut });
    
    this.containerMenus.alpha = 0;
    // this.containerMenus.x = 100;
    this.containerMenus.y = 80;
    TweenMax.to(this.containerMenus, time, { alpha: 1, x: 0, y: 0, ease: Power2.easeOut, delay: 0/30 });    

    this.buttonPlay.alpha = 0;
    // this.buttonPlay.x = -100;
    this.buttonPlay.y = this.buttonPlayPositionY + 80;
    TweenMax.to(this.buttonPlay, time, { alpha: 1, x: 0, y: this.buttonPlayPositionY, ease: Power2.easeOut, delay: 0/30 });    

    this.buttonAchievements.xRelative = 10 - 100;
    TweenMax.to(this.buttonAchievements, time, { alpha: 1, xRelative: 10, ease: Power2.easeOut, delay: 0/30 });

    this.buttonSettings.alpha = 0;
    this.buttonSettings.yRelative = -50;
    TweenMax.to(this.buttonSettings, time, { alpha: 1, yRelative: 10, ease: Power2.easeOut});

    // TweenMax.to(this, time, {alpha: 1, x: 0, y: 0, ease: Power2.easeOut});

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

    // TweenMax.to(this, time, {alpha: 0, x: 0, y: 0, ease: Power2.easeOut});

    // this.logo.alpha = 0;
    // this.logo.x = -100;
    // this.logo.y = this.logoPositionY - 80;
    TweenMax.to(this.logo, time, { alpha: 0, x: 0, y: this.logoPositionY-80, ease: Power1.easeOut });
    
    // this.containerMenus.alpha = 0;
    // this.containerMenus.x = 100;
    // this.containerMenus.y = - 80;
    TweenMax.to(this.containerMenus, time, { alpha: 0, x: 0, y: 80, ease: Power1.easeOut, delay: 0/30 });    

    // this.buttonPlay.alpha = 0;
    // this.buttonPlay.x = -100;
    // this.buttonPlay.y = this.buttonPlayPositionY + 80;
    TweenMax.to(this.buttonPlay, time, { alpha: 0, x: 0, y: this.buttonPlayPositionY+80, ease: Power1.easeOut, delay: 0/30 });

    TweenMax.to(this.buttonAchievements, time, { alpha: 1, xRelative: 10 - 100, ease: Power2.easeOut, delay: 0/30 });

    TweenMax.to(this.buttonSettings, time, { alpha: 1, yRelative: -50, ease: Power2.easeOut});

    TweenMax.delayedCall(time, function()
    {
      self.tween({name: 'hide'}, callback);
    });
  }

  if(data.name == 'show_from_preloader')
  {
    this.tween({name: 'show_anim'}, function()
    {
      // self.checkSaveGame();
      if(callback) callback();
    });

    // this.checkSaveGame();
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
var PanelSettings = function(config)
{
  config.width = 496;
  config.height = 562;
  Gui.BasePanel.call(this, config);


  var self = this;


  this.initBlockInputBg(4000, 2000, function()
  {
    if(self.state != 'show') return;
    
    for(var i = 0; i < self.ddMenus.length; i++)
    {
      var m = self.ddMenus[i];
      if(m.menuState == 'open') m.close();
    }

    self.tween({name: 'hide_anim'});
  });
  // this.invisibleBg.interactive = false; 
  this.invisibleBg.texture = assetsManager.getTexture('texture_atlas', 'Util/black_rect.png');
  this.invisibleBg.alpha = 0.6;

  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;
  // this.alpha = 0;

  // this.darkBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Util/black_rect.png'));
  // this.addChild(this.darkBg);
  // this.darkBg.anchor.set(0.5, 0.5);
  // this.darkBg.width = 2000;
  // this.darkBg.height = 2000;
  // this.darkBg.alpha = 0.6;

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_settings_bg_1.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);
  // this.logo.y = - 300;
  // logo.visible = false;

  this.containerMenus = new PIXI.Container();
  this.addChild(this.containerMenus);
  this.containerMenus.y = -120;

  var checkOpenFunction = function()
  {
    return self.state == 'show' && 
           (self.ddMenuBoard.menuState == 'normal' || self.ddMenuBoard.menuState == 'open') &&
           (self.ddMenuPiece.menuState == 'normal' || self.ddMenuPiece.menuState == 'open') &&
           (self.ddMenuDots.menuState == 'normal' || self.ddMenuDots.menuState == 'open');
  }

  this.ddMenuBoard = new PanelDropDownMenu({parentPanel: this, layer: this.containerMenus, x: 0, y: 0, info:
                                          {
                                            type: 'settings',

                                            icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_board_icon.png')),

                                            items:
                                            [
                                              {name: 'minimalistic', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_settings_item_blue.png'))},
                                              {name: 'realistic', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_settings_item_green.png'))}
                                            ],

                                            checkOpenFunction: checkOpenFunction
                                          }});

  this.ddMenuPiece = new PanelDropDownMenu({parentPanel: this, layer: this.containerMenus, x: 0, y: this.ddMenuBoard.y + 80, info:
                                          {
                                            type: 'settings',

                                            icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_piece_icon.png')),

                                            items:
                                            [
                                              {name: 'minimalistic', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_settings_item_realistic.png'))},
                                              {name: 'realistic', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_settings_item_minimalistic.png'))}
                                            ],
                                            
                                            checkOpenFunction: checkOpenFunction
                                          }});  
  this.ddMenuDots = new PanelDropDownMenu({parentPanel: this, layer: this.containerMenus, x: 0, y: this.ddMenuPiece.y + 80, info:
                                          {
                                            type: 'settings',

                                            icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_dots_icon.png')),

                                            items:
                                            [
                                              {name: 'colorized', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_dots_item_1.png'))},
                                              {name: 'black', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_dots_item_2.png'))}
                                            ],
                                            
                                            checkOpenFunction: checkOpenFunction
                                          }}); 

  this.llMenuAutoDraw = new PanelLinearMenu({parentPanel: this, layer: this.containerMenus, x: 0, y: this.ddMenuDots.y + 80, info:
                                          {
                                            type: 'settings',

                                            icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'll_menu_auto_draw_icon.png')),

                                            items:
                                            [
                                              {name: 'on', selectorColor: '#37A635', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'll_menu_settings_item_on.png'))},
                                              {name: 'off', selectorColor: '#F3523E', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'll_menu_settings_item_off.png'))}
                                            ]
                                          }});  
  this.llMenuSounds = new PanelLinearMenu({parentPanel: this, layer: this.containerMenus, x: 0, y: this.llMenuAutoDraw.y + 80, info:
                                          {
                                            type: 'settings',

                                            icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'll_menu_sounds_icon.png')),

                                            items:
                                            [
                                              {name: 'on', selectorColor: '#37A635', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'll_menu_settings_item_on.png'))},
                                              {name: 'off', selectorColor: '#F3523E', icon: new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'll_menu_settings_item_off.png'))}
                                            ]
                                          }});

  this.ddMenus = [this.ddMenuBoard, this.ddMenuPiece, this.ddMenuDots];
  for(var i = 0; i < this.ddMenus.length; i++)
  {
    var menu = this.ddMenus[i];
    addMenuBehaviour(menu);
  }

  function addMenuBehaviour(menu)
  {
    menu.on('open_start', function()
    {
      var toClose = [];
      for(var i = 0; i < self.ddMenus.length; i++)
      {
        var m = self.ddMenus[i];
        if(m == menu) continue;

        
        if(m.menuState == 'open') toClose.push(m);    
        // else TweenMax.to(m, 10/30, { pixi: {colorize: '#000000', colorizeAmount: 0.3 } });    
      }

      for(var i = 0; i < toClose.length; i++)
      {
        var m = toClose[i];
        m.close();
      }

      for(var i = 0; i < self.ddMenus.length; i++)
      {
        var m = self.ddMenus[i];
        if(m == menu) continue;

        TweenMax.to(m, 10/30, { pixi: {colorize: '#000000', colorizeAmount: 0.4 } });    
      }

      TweenMax.to(menu, 10/30, { pixi: {colorize: '#000000', colorizeAmount: 0.0 } });

      TweenMax.to(self.llMenuAutoDraw, 10/30, { pixi: {colorize: '#000000', colorizeAmount: 0.4 } });
      TweenMax.to(self.llMenuSounds, 10/30, { pixi: {colorize: '#000000', colorizeAmount: 0.4 } });
    }, self);

    menu.on('close_start', function()
    {
      for(var i = 0; i < self.ddMenus.length; i++)
      {
        var m = self.ddMenus[i];
        if(m == menu) continue;

        TweenMax.to(m, 10/30, { pixi: {colorize: '#000000', colorizeAmount: 0.0 } });
      }

      TweenMax.to(self.llMenuAutoDraw, 10/30, { pixi: {colorize: '#000000', colorizeAmount: 0 } });  
      TweenMax.to(self.llMenuSounds, 10/30, { pixi: {colorize: '#000000', colorizeAmount: 0 } });  
    }, self);
  }

  this.ddMenuBoard.on('set_to', function(data)
  {
    // console.log('board set:', data.name);
    app.setBoardStyle(data.name);
  });
  this.ddMenuPiece.on('set_to', function(data)
  {
    // console.log('piece set:', data.name);
    app.setTilesStyle(data.name);
  });  
  this.ddMenuDots.on('set_to', function(data)
  {
    // console.log('piece set:', data.name);
    app.setDotsStyle(data.name);
  });
  this.llMenuAutoDraw.on('switching_to', function(data)
  {
    // console.log('auto_draw set:', data.name);
    app.setAutoDraw(data.name == 'on'?true:false);
  });
  this.llMenuSounds.on('switching_to', function(data)
  {
    // console.log('sounds set:', data.name);
    app.setAudioState(data.name);
  });

  this.buttonClose = Gui.createSimpleButton({name: 'button_close', parentPanel: this, width: 46, height: 46, x: this.width/2-46/2, y: -this.height/2+46/2},
  {
    pathToSkin: 'panel_settings_button_close.png',
    onClick: function()
    {
      if(self.state == 'show' && checkOpenFunction())
      {
        for(var i = 0; i < self.ddMenus.length; i++)
        {
          var m = self.ddMenus[i];
          if(m.menuState == 'open') m.close();
        }

        self.tween({name: 'hide_anim'});
      }
    }
  }); 
  // this.buttonClose.isClickTween = false;

  this.ddMenuBoard.setTo('minimalistic');
  this.ddMenuPiece.setTo('minimalistic');
  this.llMenuAutoDraw.setTo('off');
  this.llMenuSounds.setTo('on');

  app.on('board_style_setted', function(boardStyle)
  {
    if(boardStyle == 'minimalistic')
    {
      this.bg.texture = assetsManager.getTexture('texture_atlas', 'panel_settings_bg_1.png');
    }
    else if(boardStyle == 'realistic')
    {
      this.bg.texture = assetsManager.getTexture('texture_atlas', 'panel_settings_bg_2.png');
    }
  }, this);
}
PanelSettings.prototype = Object.create(Gui.BasePanel.prototype);
PanelSettings.prototype.constructor = PanelSettings;

PanelSettings.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim' && this.state == 'hide')
  {
    this.state = 'show_anim';
    this.visible = true;

    this.alpha = 0;
    this.y = -50;

    var time = 12 / 30;

    TweenMax.pauseAll();

    TweenMax.to(this, time, {alpha: 1, x: 0, y: 0, ease: Power3.easeOut, onComplete: function()
    {
      self.tween({name: 'show'}, callback);
    }});
  }

  if(data.name == 'hide_anim' && this.state == 'show')
  {
    this.state = 'hide_anim';
    this.interactiveChildren = false;

    var time = 12 / 30;

    TweenMax.to(this, time, {alpha: 0, x: 0, y: -50, ease: Power3.easeOut, onComplete: function()
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
var PanelDropDownMenu = function(config)
{
  // config.width = 438;
  // config.height = 68;  

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

  this.type = config.info.type;

  this.checkOpenFunction = info.checkOpenFunction;

  if(this.type == 'main')
  {
    this.width = 438;
    this.height = 68;

    this.itemWidth = 262;
    this.itemHeight = 52;

    this.bgTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_main_bg_1.png');
    this.bgItemTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_main_item_bg_1.png');
    this.bgItemDownTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_main_item_bg_down_1.png');
    this.splitterTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_item_splitter_1.png');
  }
  else if(this.type == 'settings')
  {
    this.width = 428;
    this.height = 58;

    this.itemWidth = 260;
    this.itemHeight = 48;

    this.bgTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_settings_bg_1.png');
    this.bgItemTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_settings_item_bg_1.png');
    this.bgItemDownTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_settings_item_bg_down_1.png');
    this.splitterTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_item_splitter_1.png');
  }

  app.on('board_style_setted', function(boardStyle)
  {
    if(boardStyle == 'minimalistic')
    {
      if(this.type == 'main')
      {
        this.bgTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_main_bg_1.png');
        this.bgItemTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_main_item_bg_1.png');
        this.bgItemDownTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_main_item_bg_down_1.png');
      }   
      else if(this.type == 'settings')
      {
        this.bgTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_settings_bg_1.png');
        this.bgItemTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_settings_item_bg_1.png');
        this.bgItemDownTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_settings_item_bg_down_1.png');
      }
      this.splitterTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_item_splitter_1.png');
    }
    else if(boardStyle == 'realistic')
    {
      if(this.type == 'main')
      {
        this.bgTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_main_bg_2.png');
        this.bgItemTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_main_item_bg_2.png');
        this.bgItemDownTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_main_item_bg_down_2.png');
      }
      else if(this.type == 'settings')
      {
        this.bgTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_settings_bg_2.png');
        this.bgItemTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_settings_item_bg_2.png');
        this.bgItemDownTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_settings_item_bg_down_2.png');
      }
      this.splitterTexture = assetsManager.getTexture('texture_atlas', 'dd_menu_item_splitter_2.png');
    }

    this.bg.texture = this.bgTexture;

    for(var i = 0; i < this.items.length; i++)
    {
      this.items[i].bg.texture = this.bgItemTexture;
      this.items[i].splitter.texture = this.splitterTexture;
    }
  }, this);

  // this.size = info.size;
  // this.segmentSize = info.segment_size;

  this.items = [];
  this.item = null;

  this.bg = new PIXI.Sprite(this.bgTexture);
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  // this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_bg.png'));
  // this.addChild(this.bg);
  // this.bg.anchor.set(0.5, 0.5);

  this.icon = info.icon;
  this.addChild(this.icon);
  this.icon.anchor.set(0.5, 0.5);
  this.icon.x = -this.width/2 + this.icon.width/2;

  this.containerItems = new PIXI.Container();
  this.addChild(this.containerItems);
  this.containerItems.x = this.width/2 - this.itemWidth/2;

  // this.containerItem = new PIXI.Container();
  // this.addChild(this.containerItem);
  // this.containerItem.x = this.width/2 - 262/2;

  for(var i = 0; i < info.items.length; i++)
  {
    var itemInfo = info.items[i];

    var item = this.createItem(itemInfo, i);
    this.items.push(item);
  }

  this.arrow = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_arrow.png'));
  this.addChild(this.arrow);
  this.arrow.anchor.set(0.5, 0.4);
  this.arrow.x = this.width/2 - 30;

  var interactiveBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'white_rect.png'));
  this.addChild(interactiveBg);
  interactiveBg.width = this.width;
  interactiveBg.height = this.height;
  interactiveBg.anchor.set(0.5, 0.5);
  interactiveBg.alpha = 0;

  interactiveBg.interactive = true;
  interactiveBg.buttonMode = true;

  var onCl = function()
  {
    if(self.menuState == 'normal')
    {
      app.playAudio('sounds', 'sound_click');
      self.open();
    }
    else if(self.menuState == 'open')
    {
      // app.playAudio('sounds', 'sound_click');
      self.close();
    }
  }
  interactiveBg.on('tap', onCl, this);
  interactiveBg.on('click', onCl, this);

  this.setTo(this.items[0].name);
}
PanelDropDownMenu.prototype = Object.create(Gui.BasePanel.prototype);
PanelDropDownMenu.prototype.constructor = PanelDropDownMenu;

PanelDropDownMenu.prototype.getItem = function(d)
{
  if(typeof d == 'number') return this.items[d];

  if(typeof d == 'string')
  {
    for(var i = 0; i < this.items.length; i++)
    {
      if(this.items[i].name == d) return this.items[i];
    }
  }

  return null;
}

PanelDropDownMenu.prototype.setTo = function(d)
{
  this.menuState = 'normal';

  var item = this.getItem(d);

  if(this.item != null) 
  {
    this.item.container.visible = false;
    // this.containerItems.addChild(this.item.container);
  }

  this.item = item;

  // this.containerItem.addChild(this.item.container);
  this.item.container.visible = true;
  this.item.splitter.alpha = 0;

  this.emit('set_to', { name: this.item.name });
}

PanelDropDownMenu.prototype.createItem = function(info, n)
{
  var self = this;

  var item = { name: info.name, icon: info.icon };

  var container = new PIXI.Container();
  this.containerItems.addChild(container);
  item.container = container;

  item.bg = new PIXI.Sprite(this.bgItemTexture);
  item.container.addChild(item.bg);
  item.bg.anchor.set(0.5, 0.5);

  item.splitter = new PIXI.Sprite(this.splitterTexture);
  item.container.addChild(item.splitter);
  item.splitter.anchor.set(0.5, 0.5);
  item.splitter.width = this.itemWidth;
  item.splitter.y = this.itemHeight/2;

  container.addChild(item.icon);
  item.icon.anchor.set(0.5, 0.5);

  if(this.type == 'settings') item.icon.x = -20;
  // item.icon.x = -20;

  item.tween = function(data, callback)
  {
    if(data.name == 'open')
    {
      var targetY = data.targetY;
      var n = data.n;

      item.container.visible = true;

      item.container.y = 0;
      item.container.alpha = 1;

      item.bg.alpha = 1;

      item.splitter.alpha = 0;
      if(data.n != data.totalN) TweenMax.to(item.splitter, 12/30, {alpha: 1, ease: Power2.easeOut});

      TweenMax.to(item.container, 12/30, {y: targetY, ease: Power2.easeOut});

      if(n == data.totalN)
      {
        item.bg.texture = self.bgItemDownTexture;
      }
      else
      {
        item.bg.texture = self.bgItemTexture;
      }
    }   

    if(data.name == 'close')
    {
      var targetY = data.targetY;
      var n = data.n;

      // item.container.visible = true;

      // item.container.y = 0;
      // item.container.alpha = 1;
      // item.bg.alpha = 0;

      // item.splitter.alpha = 0;
      TweenMax.to(item.splitter, 12/30, {alpha: 0, ease: Power2.easeOut});

      TweenMax.to(item.container, 12/30, {y: targetY, alpha: 0, ease: Power2.easeOut});
    }

    if(data.name == 'switch_hide')
    {
      item.bg.alpha = 0;

      TweenMax.to(item.container, 10/30, {y: -20, alpha: 0, ease: Power2.easeOut, onComplete: function()
      {
        item.container.visible = false;
        // item.bg.alpha = 1;
        // self.containerItems.addChild(item.container);

        if(callback) callback();
      }});
    }

    if(data.name == 'switch_show')
    {
      // self.containerItem.addChild(item.container);

      TweenMax.to(item.splitter, 12/30, {alpha: 0, ease: Power2.easeOut});
      TweenMax.to(item.container, 12/30, {y: 0, ease: Power2.easeOut, onComplete: function()
      {
        if(callback) callback();
      }});
    }
  }

  var interactiveBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'white_rect.png'));
  item.container.addChild(interactiveBg);
  interactiveBg.width = this.itemWidth;
  interactiveBg.height = this.itemHeight;
  interactiveBg.anchor.set(0.5, 0.5);
  interactiveBg.alpha = 0;

  interactiveBg.interactive = true;
  interactiveBg.buttonMode = true;

  var onCl = function()
  {
    if(self.menuState == 'open') 
    {
      self.close(item);
      app.playAudio('sounds', 'sound_click');
    }
  }
  interactiveBg.on('tap', onCl, item);
  interactiveBg.on('click', onCl, item);

  item.container.visible = false;

  return item;
}

PanelDropDownMenu.prototype.open = function()
{
  var self = this;

  if(!this.checkOpenFunction()) return;

  this.menuState = 'opening';

  this.parent.setChildIndex(this, this.parent.children.length-1);

  var avaiableItems = [];
  for(var i = 0; i < this.items.length; i++)
  {
    if(this.items[i] != this.item) avaiableItems.push(this.items[i]);
  }

  for(var i = 0; i < avaiableItems.length; i++)
  {
    var item = avaiableItems[i];

    // console.log(avaiableItems.length-1-i);

    this.containerItems.setChildIndex(item.container, avaiableItems.length-1-i);

    var targetY = this.itemHeight + this.itemHeight*i;
    item.tween({name: 'open', targetY: targetY, n: i, totalN: avaiableItems.length-1});
  }

  this.containerItems.setChildIndex(this.item.container, avaiableItems.length);

  // console.log(this.containerItems.getChildIndex(this.item.container));

  TweenMax.to(this.item.splitter, 12/30, {alpha: 1, ease: Power2.easeOut});

  TweenMax.to(this.arrow, 10/30, { rotation: 180*Util.TO_RADIANS, ease: Power1.easeOut});

  TweenMax.delayedCall(14/30, function()
  {
    self.menuState = 'open';

    self.emit('open_complete');
  });

  this.emit('open_start');
  // console.log(avaiableItems);
}

PanelDropDownMenu.prototype.close = function(selectedItem)
{
  if(selectedItem == undefined) selectedItem = null;

  var self = this;

  this.menuState ='closing';

  var avaiableItems = [];
  for(var i = 0; i < this.items.length; i++)
  {
    if(this.items[i] != this.item && (selectedItem == null || this.items[i] != selectedItem)) avaiableItems.push(this.items[i]);
  }

  for(var i = 0; i < avaiableItems.length; i++)
  {
    var item = avaiableItems[i];

    // this.containerItems.setChildIndex(item.container, avaiableItems.length-1-i);

    var targetY = 0;
    item.tween({name: 'close', targetY: targetY, n: i});
  }

  if(selectedItem != null)
  {
    this.containerItems.setChildIndex(selectedItem.container, this.items.length-1);

    this.item.tween({name: 'switch_hide'});
    selectedItem.tween({name: 'switch_show'});
  }
  else
  {
    TweenMax.to(this.item.splitter, 12/30, {alpha: 0, ease: Power2.easeOut});
  }

  TweenMax.to(this.arrow, 10/30, { rotation: 0*Util.TO_RADIANS, ease: Power1.easeOut});

  TweenMax.delayedCall(14/30, function()
  {
    if(selectedItem == null) self.menuState = 'normal';
    else self.setTo(selectedItem.name);

    self.emit('close_complete', selectedItem);
  });

  this.emit('close_start', selectedItem);
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelLinearMenu = function(config)
{
  // config.width = 438;
  // config.height = 68;  

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

  this.type = config.info.type;

  if(this.type == 'settings')
  {
    this.width = 428;
    this.height = 58;

    // this.itemsWidth = 158;

    this.itemWidth = 79;
    this.itemHeight = 58;

    this.selectorWidth = 80;

    this.bgTexture = assetsManager.getTexture('texture_atlas', 'll_menu_settings_bg_1.png');
    this.bgItemsTexture = assetsManager.getTexture('texture_atlas', 'll_menu_settings_items_bg_1.png');
    this.selectorTexture = assetsManager.getTexture('texture_atlas', 'll_menu_settings_selector.png');
  }

  app.on('board_style_setted', function(boardStyle)
  {
    if(boardStyle == 'minimalistic')
    {
      if(this.type == 'settings')
      {
        this.bgTexture = assetsManager.getTexture('texture_atlas', 'll_menu_settings_bg_1.png');
        this.bgItemsTexture = assetsManager.getTexture('texture_atlas', 'll_menu_settings_items_bg_1.png');
      }
      // app.bgGradient.texture = assetsManager.getTexture('texture_atlas', 'bg_gradient_1.png');
    }
    else if(boardStyle == 'realistic')
    {
      if(this.type == 'settings')
      {
        this.bgTexture = assetsManager.getTexture('texture_atlas', 'll_menu_settings_bg_2.png');
        this.bgItemsTexture = assetsManager.getTexture('texture_atlas', 'll_menu_settings_items_bg_2.png');
      }
    }

    this.bg.texture = this.bgTexture;
    this.bgItems.texture = this.bgItemsTexture;
  }, this);
  // this.size = info.size;
  // this.segmentSize = info.segment_size;

  this.items = [];
  this.item = null;

  this.bg = new PIXI.Sprite(this.bgTexture);
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  // this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dd_menu_bg.png'));
  // this.addChild(this.bg);
  // this.bg.anchor.set(0.5, 0.5);

  this.icon = info.icon;
  this.addChild(this.icon);
  this.icon.anchor.set(0.5, 0.5);
  this.icon.x = -this.width/2 + this.icon.width/2;

  this.containerItems = new PIXI.Container();
  this.addChild(this.containerItems);
  this.containerItems.x = this.width/2 - (this.itemWidth*info.items.length)/2;

  this.bgItems = new PIXI.Sprite(this.bgItemsTexture);
  this.containerItems.addChild(this.bgItems);
  this.bgItems.anchor.set(0.5, 0.5);

  this.selector = new PIXI.Sprite(this.selectorTexture);
  this.containerItems.addChild(this.selector);
  this.selector.anchor.set(0.5, 0.5);

  for(var i = 0; i < info.items.length; i++)
  {
    var itemInfo = info.items[i];

    var item = this.createItem(itemInfo, i);
    this.items.push(item);
  }

  var interactiveBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'white_rect.png'));
  this.addChild(interactiveBg);
  interactiveBg.width = this.width;
  interactiveBg.height = this.height;
  interactiveBg.anchor.set(0.5, 0.5);
  interactiveBg.alpha = 0;

  interactiveBg.interactive = true;
  interactiveBg.buttonMode = true;

  var onCl = function()
  {
    if(self.item.name == 'on') self.switchTo('off');
    else if(self.item.name == 'off') self.switchTo('on');
  }
  interactiveBg.on('tap', onCl, this);
  interactiveBg.on('click', onCl, this);

  // this.setTo(this.items[0].name);
}
PanelLinearMenu.prototype = Object.create(Gui.BasePanel.prototype);
PanelLinearMenu.prototype.constructor = PanelLinearMenu;

PanelLinearMenu.prototype.getItem = function(d)
{
  if(typeof d == 'number') return this.items[d];

  if(typeof d == 'string')
  {
    for(var i = 0; i < this.items.length; i++)
    {
      if(this.items[i].name == d) return this.items[i];
    }
  }

  return null;
}

PanelLinearMenu.prototype.setTo = function(d)
{
  var item = this.getItem(d);

  if(this.item == item) return;

  this.menuState = 'normal';

  // if(this.item != null) 
  // {
  //   this.item.container.visible = false;
  // }

  this.item = item;

  for(var i = 0; i < this.items.length; i++)
  {
    if(this.items[i] != this.item) this.items[i].setTo('deselect');
  }
  this.item.setTo('select');

  this.selector.x = this.item.x;
  TweenMax.to(this.selector, 0, { pixi: { colorize: this.item.selectorColor, colorizeAmount: 1.0 } });

  // console.log(item);

  // this.item.container.visible = true;
  // this.item.splitter.alpha = 0;
  this.emit('set_to', { name: this.item.name });
}
PanelLinearMenu.prototype.switchTo = function(d)
{
  var self = this;

  var item = this.getItem(d);

  if(this.item == item || this.menuState != 'normal') return;

  this.menuState = 'switching';

  TweenMax.to(this.selector, 12/30, { x: item.x, pixi: { colorize: item.selectorColor, colorizeAmount: 1.0 }, ease: Power2.easeOut, onComplete: function()
  {
    self.setTo(d);
  }});

  this.item.tween({name: 'deselect'});
  item.tween({name: 'select'})

  app.playAudio('sounds', 'sound_click');

  this.emit('switching_to', { name: item.name });
}

PanelLinearMenu.prototype.createItem = function(info, n)
{
  var self = this;

  var itemX = -this.itemWidth/2 + this.itemWidth*n;

  var item = { name: info.name, icon: info.icon, x: itemX, selectorColor: info.selectorColor };

  var container = new PIXI.Container();
  this.containerItems.addChild(container);
  container.x = itemX;
  item.container = container;

  container.addChild(item.icon);
  item.icon.anchor.set(0.5, 0.5);

  var deselectAlpha = 0.2;

  item.tween = function(data, callback)
  {
    if(data.name == 'select')
    {
      item.icon.alpha = 0.2;
      TweenMax.to(item.icon, 12/30, {alpha: 1, ease: Power2.easeOut});
    }   

    if(data.name == 'deselect')
    {
      item.icon.alpha = 1;
      TweenMax.to(item.icon, 12/30, {alpha: deselectAlpha, ease: Power2.easeOut});
    }
  }

  item.setTo = function(state)
  {
    if(state == 'select')
    {
      item.icon.alpha = 1;
    }
    else if(state == 'deselect')
    {
      item.icon.alpha = deselectAlpha;
    }
  }

  var interactiveBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'white_rect.png'));
  item.container.addChild(interactiveBg);
  interactiveBg.width = this.itemWidth;
  interactiveBg.height = this.itemHeight;
  interactiveBg.anchor.set(0.5, 0.5);
  interactiveBg.alpha = 0;

  interactiveBg.interactive = true;
  interactiveBg.buttonMode = true;

  var onCl = function()
  {
    if(self.menuState == 'normal') 
    {
      if(self.item.name == 'on') self.switchTo('off');
      else if(self.item.name == 'off') self.switchTo('on');
    }
  }
  interactiveBg.on('tap', onCl, item);
  interactiveBg.on('click', onCl, item);

  // item.container.visible = false;

  return item;
}
