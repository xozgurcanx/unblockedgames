var ScreenMain = function(config)
{
  config.sizeType = 'relative';
  config.widthRelative = 1;
  config.heightRelative = 1;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.state = 'menu';
  // this.visible = false;
  // this.interactiveChildren = false;
  // this.alpha = 0;

  // console.log(assetsManager.getTexture('texture_atlas'));
  this.panelLogo = new Gui.BasePanel({name: 'panel_logo', parentPanel: this, width: 809, height: 201, positionType: 'center-top', yRelative: -2});
  var logo = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/logo.png'));
  this.panelLogo.addChild(logo);
  logo.anchor.set(0.5, 0.5);

  this.carouselContainer = new PIXI.Container();
  this.addChild(this.carouselContainer);

  this.currentField = null;
  this.initCarousel(13);

  this.buttonPlay = Gui.createSimpleButton({name: 'button_play', parentPanel: this, width: 347, height: 122, positionType: 'center-bot', yRelative: -20},
  {
    pathToSkin: 'Gui/button_play.png',
    onClick: function()
    {
      if(self.state != 'menu') return;
      self.tween({name: 'to_game'});

      app.apiCallback('start', null);
    }
  });  
  this.buttonPlay.isClickTween = false;

  this.buttonArrowRight = Gui.createSimpleButton({name: 'button_arrow_right', parentPanel: this, width: 87, height: 123, x: 319, y: 24},
  {
    pathToSkin: 'Gui/button_arrow_right.png',
    onClick: function()
    {
      if(self.state != 'menu') return;
      self.rollCarousel('right');
    }
  }); 
  this.buttonArrowLeft = Gui.createSimpleButton({name: 'button_arrow_left', parentPanel: this, width: 87, height: 123, x: -319, y: 24},
  {
    pathToSkin: 'Gui/button_arrow_left.png',
    onClick: function()
    {
      if(self.state != 'menu') return;
      self.rollCarousel('left');
    }
  }); 

  this.buttonHelp = Gui.createSimpleButton({name: 'button_help', parentPanel: this, width: 187, height: 111, positionType: 'left-bot', xRelative: -55, yRelative: -25},
  {
    pathToSkin: 'Gui/button_help.png',
    onClick: function()
    {
      self.panelHelp.tween({name: 'show_anim'});
    }
  });   

  this.buttonBack = Gui.createSimpleButton({name: 'button_help', parentPanel: this, width: 187, height: 111, positionType: 'left-top', xRelative: -55-150, yRelative: 25},
  {
    pathToSkin: 'Gui/button_back.png',
    onClick: function()
    {
      if(!(self.state == 'game' && self.currentField.state == 'normal')) return;
      self.tween({name: 'to_menu'});
    }
  });
  this.buttonBack.isClickTween = false;

  this.buttonUndo = Gui.createSimpleButton({name: 'button_undo', parentPanel: this, width: 187, height: 111, positionType: 'right-top', xRelative: 55+150, yRelative: 25},
  {
    pathToSkin: 'Gui/button_undo.png',
    onClick: function()
    {
      if(!(self.state == 'game' && self.currentField.state == 'normal')) return;
      self.currentField.undoMove();
    }
  });
  this.buttonUndo.isClickSound = false;

  this.buttonAudio = new Gui.ButtonAudio({name: 'button_audio', parentPanel: this, width: 187, height: 111, positionType: 'right-bot', xRelative: 55, yRelative: -25});

  this.panelGameEnd = new PanelGameEnd({name: 'panel_game_end', parentPanel: this.parentPanel});
  this.panelHelp = new PanelHelp({name: 'panel_help', parentPanel: this.parentPanel});

  guiManager.addListener('game_resize', function(data)
  {
    var hK = data.height/960;

    // console.log(hK);

    // hK*=0.7;
    if(hK<1) hK = 1;
    if(hK>1.6) hK = 1.6;

    this.buttonPlay.scale.x = this.buttonPlay.scale.y = hK;
    this.buttonPlay.width = 347 * hK;
    this.buttonPlay.height = 122 * hK;
  }, this);
  // console.log(field.width*field.scale.x);
}
ScreenMain.prototype = Object.create(Gui.BasePanel.prototype);
ScreenMain.prototype.constructor = ScreenMain;

ScreenMain.prototype.initCarousel = function()
{
  var count = 13;
  this.carouselInfo = 
  {
    levels: 
    [
      {shiftX: 0, scaleXY: 0.57, alpha: 1, tintAlpha: 0.0}, 
      {shiftX: 130*1.33, scaleXY: 0.43, alpha: 1, tintAlpha: 0.5}, 
      {shiftX: 209*1.33, scaleXY: 0.32, alpha: 1, tintAlpha: 0.75}, 
      {shiftX: 180*1.33, scaleXY: 0.32, alpha: 1, tintAlpha: 1.0}
    ]
  };

  this.fields = [];

  this.carouselSize = count;
  this.carouselN = 0;

  var i = 0;
  for(var key in app.fieldsData)
  {
    // console.log(key);
    var fieldInfo = app.fieldsData[key];
    var field = new Field({name: 'field', parentPanel: this, layer: this.carouselContainer, y: 23}, fieldInfo);
    var params = this.getCarouselParams(i, this.carouselN);

    fieldInfo.field = field;

    field.x = 0 + params.shiftX;
    field.scale.x = field.scale.y = params.scaleXY;
    field.alpha = params.alpha;
    field.zIndex = params.zIndex;
    field.tint.alpha = params.tintAlpha;
    field.visible = params.visible;

    this.fields.push(field);

    field.tween({name: 'hide_info'});
    if(i == this.carouselN) 
    {
      field.tween({name: 'show_info'});
      this.currentField = field;
      field.interactive = true;
      field.buttonMode = true;
    }

    i++;
  }

  // console.log(this.fields.length);

  this.sortCarouselContainer();
}

ScreenMain.prototype.sortCarouselContainer = function()
{
  this.carouselContainer.children.sort(function(a,b) {
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return b.zIndex - a.zIndex
    });
}

ScreenMain.prototype.getCarouselParams = function(n, centerN)
{
  var shiftN = n - centerN;

  if(shiftN > this.carouselInfo.levels.length)
  {
    shiftN = (n-this.carouselSize) - centerN;
  }
  if(shiftN < -this.carouselInfo.levels.length)
  {
    shiftN = (n+this.carouselSize) - centerN;
  }

  var sign = (shiftN < 0)?-1:1;
  var level = Math.abs(shiftN);

  if(level > this.carouselInfo.levels.length-1) level = this.carouselInfo.levels.length-1;

  var params = Util.clone(this.carouselInfo.levels[level]);
  params.shiftX*=sign;
  params.zIndex = level;
  params.visible = Math.abs(shiftN) <= this.carouselInfo.levels.length-1;


  // console.log(level, params);
  return params;
}

ScreenMain.prototype.rollCarousel = function(dir)
{
  var self = this;

  this.currentField.tween({name: 'hide_info_anim'});
  this.currentField.interactive = false;
  this.currentField.buttonMode = false;

  if(dir == 'left')
  {
    if(this.carouselN - 1 >= 0) this.carouselN --;
    else this.carouselN = this.carouselSize-1;
  } 
  if(dir == 'right') 
  {
    if(this.carouselN + 1 <= this.carouselSize-1) this.carouselN ++;
    else this.carouselN = 0;
  }

  this.currentField = this.fields[this.carouselN];
  this.currentField.tween({name: 'show_info_anim'});
  this.currentField.interactive = true;
  this.currentField.buttonMode = true;

  for(var i = 0; i < this.fields.length; i++)
  {
    var field = this.fields[i];
    var params = this.getCarouselParams(i, this.carouselN);

    field.visible = params.visible;

    if(!field.visible) continue;

    var time = 15/30;
    var ease = Power2.easeOut;

    TweenMax.to(field.scale, time, {x: params.scaleXY, y: params.scaleXY, ease: ease});
    TweenMax.to(field.tint, time, {alpha: params.tintAlpha, ease: ease});
    TweenMax.to(field, time, {x: 0+params.shiftX, alpha: params.alpha, zIndex: params.zIndex, visible: params.visible, ease: ease, onUpdate: function()
    {
      self.sortCarouselContainer();
    }});
  }

}

// ScreenMain.prototype.

ScreenMain.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'to_menu' && this.state == 'game')
  {
    this.state = 'to_menu';

    this.currentField.deactivate();

    TweenMax.to(this.panelLogo, 15/30, {yRelative: -2, ease: Power2.easeOut});
    TweenMax.to(this.buttonArrowLeft, 15/30, {x: -319, alpha: 1, ease: Power2.easeOut});
    TweenMax.to(this.buttonArrowRight, 15/30, {x: 319, alpha: 1, ease: Power2.easeOut});
    TweenMax.to(this.buttonPlay, 15/30, {yRelative: -10, ease: Power2.easeOut});

    TweenMax.to(this.buttonBack, 15/30, {xRelative: -55-150, ease: Power2.easeOut});
    TweenMax.to(this.buttonUndo, 15/30, {xRelative: 55+150, ease: Power2.easeOut});

    for(var i = 0; i < this.fields.length; i++)
    {
      var field = this.fields[i];
      var params = this.getCarouselParams(i, this.carouselN);

      field.visible = params.visible;

      if(!field.visible) continue;

      var time = 15/30;
      var ease = Power2.easeOut;

      TweenMax.to(field.scale, time, {x: params.scaleXY, y: params.scaleXY, ease: ease});
      TweenMax.to(field.tint, time, {alpha: params.tintAlpha, ease: ease});
      TweenMax.to(field, time, {x: 0+params.shiftX, y: 23, alpha: params.alpha, zIndex: params.zIndex, visible: params.visible, ease: ease, onUpdate: function()
      {
        self.sortCarouselContainer();
      }});

      if(field == this.currentField) field.tween({name: 'to_menu'});
    }

    TweenMax.delayedCall(16/30, function()
    {
      self.state = 'menu';
    });
  }

  if(data.name == 'to_game' && this.state == 'menu')
  {
    this.state = 'to_game';

    TweenMax.to(this.panelLogo, 15/30, {yRelative: -200, ease: Power2.easeOut});
    TweenMax.to(this.buttonArrowLeft, 15/30, {x: -319-160, alpha: 0, ease: Power2.easeOut});
    TweenMax.to(this.buttonArrowRight, 15/30, {x: 319+160, alpha: 0, ease: Power2.easeOut});
    TweenMax.to(this.buttonPlay, 15/30, {yRelative: -10 + 200, ease: Power2.easeOut});

    TweenMax.to(this.buttonBack, 15/30, {xRelative: -55, ease: Power2.easeOut});
    TweenMax.to(this.buttonUndo, 15/30, {xRelative: 55, ease: Power2.easeOut});

    for(var i = 0; i < this.fields.length; i++)
    {
      var field = this.fields[i];
      if(field != this.currentField && field.visible)
      {
        TweenMax.to(field, 15/30, {x: 0, ease: Power2.easeOut});
      }
    }

    this.currentField.tween({name: 'to_game'});

    TweenMax.delayedCall(16/30, function()
    {
      self.state = 'game';

      self.currentField.activate();
    });
  }

  if(data.name == 'from_preloader')
  {
    this.state = 'from_preloader';

    var blueOver = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/bg_blue_rect.png'));
    this.addChild(blueOver);
    blueOver.width = 3000;
    blueOver.height = 3000;
    blueOver.anchor.set(0.5, 0.5);

    TweenMax.to(blueOver, 30/30, {alpha: 0, ease: Power1.easeInOut, delay: 5/30, onComplete: function()
    {
      blueOver.destroy();
      self.state = 'menu';
    }});
  }

  // if(data.name == 'show' && this.state != 'show')
  // {
  //   this.state = 'show';
  //   this.visible = true;
  //   this.interactiveChildren = true;

  //   if(callback) callback();
  // }
  // if(data.name == 'hide' && this.state != 'hide')
  // {
  //   this.state = 'hide';
  //   this.visible = false;
  //   this.interactiveChildren = false;

  //   if(callback) callback();
  // }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelGameEnd = function(config)
{
  config.sizeType = 'absolute';
  config.width = 605;
  config.height = 202;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;

  this.initBlockInputBg(3000, 3000, function()
  {
    
  });

  this.bgRect = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/dark_bg_rect.png'));
  this.addChild(this.bgRect);
  this.bgRect.width = this.bgRect.height = 3000;
  this.bgRect.anchor.set(0.5, 0.5);
  this.bgRect.interactiveChildren = true;

  this.loseBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/panel_lose_bg.png'));
  this.addChild(this.loseBg);
  this.loseBg.anchor.set(0.5, 0.5);

  this.victoryBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/panel_victory_bg.png'));
  this.addChild(this.victoryBg);
  this.victoryBg.anchor.set(0.5, 0.5);

  // this.labelNoMoves = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/label_no_moves.png'));
  // this.addChild(this.labelNoMoves);
  // this.labelNoMoves.anchor.set(0.5, 0.5);
  // this.labelNoMoves.x = 0;
  // this.labelNoMoves.y = -40;
  // this.labelNoMoves.visible = false;

  // this.labelWin = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/label_victory.png'));
  // this.addChild(this.labelWin);
  // this.labelWin.anchor.set(0.5, 0.5);
  // this.labelWin.x = 0;
  // this.labelWin.y = -25;
  // this.labelWin.visible = false;

  this.pegsText = Util.setParams(new Gui.TextBmp('11',  constsManager.getData('text_configs/pegs_left_text')), {parent: this, aX:0.5, aY:0.5, x: 180, y: -3});

  this.buttonBack = Gui.createSimpleButton({name: 'button_back', parentPanel: this, width: 86, height: 66, x: -255, y: 105},
  {
    pathToSkin: 'Gui/button_back_2.png',
    onClick: function()
    {
      self.tween({name: 'hide_anim'}, function()
      {
        app.screenMain.tween({name: 'to_menu'});
      });
    }
  });
  this.buttonTryAgain = Gui.createSimpleButton({name: 'button_try_again', parentPanel: this, width: 273, height: 66, x: 90, y: 105},
  {
    pathToSkin: 'Gui/button_try_again.png',
    onClick: function()
    {
      var field = self.field;
      self.tween({name: 'hide_anim'}, function()
      {
        field.resetField();
        app.apiCallback('replay', field.fieldInfo.name);
      });
    }
  }); 

  this.buttonClose = Gui.createSimpleButton({name: 'button_close', parentPanel: this, width: 59, height: 59, x: 380, y: -125},
  {
    pathToSkin: 'Gui/button_close.png',
    onClick: function()
    {
      var field = self.field;
      self.tween({name: 'hide_anim'}, function()
      {
        field.state = 'normal';
        field.tween({name: 'show_anim_button_replay'});
      });
    }
  });

  this.field = null;
}
PanelGameEnd.prototype = Object.create(Gui.BasePanel.prototype);
PanelGameEnd.prototype.constructor = PanelGameEnd;

PanelGameEnd.prototype.init = function(type)
{
    this.loseBg.visible = false;
    this.victoryBg.visible = false;
    this.pegsText.visible = false;
    this.buttonClose.visible = false;

    if(type == 'victory') 
    {
      this.victoryBg.visible = true;

      this.buttonClose.visible = true;
      this.buttonClose.x = 375;
      this.buttonClose.y = -120;

      this.buttonTryAgain.y = this.buttonBack.y = 65;
    }
    else if(type == 'lose') 
    {
      this.loseBg.visible = true;

      this.pegsText.visible = true;
      this.pegsText.text = this.field.score;

      this.buttonTryAgain.y = this.buttonBack.y = 105;

      this.buttonClose.visible = true;
      this.buttonClose.x = 375;
      this.buttonClose.y = -155;
    }
}

PanelGameEnd.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim')
  {
    this.state = 'show_anim';

    this.field = data.field;

    this.init(data.type);

    this.visible = true;
    this.alpha = 0;
    this.y = -80;

    TweenMax.to(this, 10/30, {alpha: 1, y: 0, ease: Power2.easeOut, onComplete: function()
    {
      self.tween({name: 'show'}, callback);
    }});
  }

  if(data.name == 'hide_anim')
  {
    this.state = 'hide_anim';

    TweenMax.to(this, 10/30, {alpha: 0, y: -80, ease: Power2.easeOut, onComplete: function()
    {
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

    this.field = null;

    if(callback) callback();
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelHelp = function(config)
{
  config.sizeType = 'absolute';
  config.width = 605;
  config.height = 346;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;

  this.initBlockInputBg(3000, 3000, function()
  {
    
  });

  this.bgRect = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/dark_bg_rect.png'));
  this.addChild(this.bgRect);
  this.bgRect.width = this.bgRect.height = 3000;
  this.bgRect.anchor.set(0.5, 0.5);
  this.bgRect.interactiveChildren = true;

  var bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/panel_help_bg.png'));
  this.addChild(bg);
  bg.anchor.set(0.5, 0.5);

  this.animContainer = new PIXI.Container();
  this.addChild(this.animContainer);
  this.animContainer.y = -130;

  this.animLeftLight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'field_cell_light.png'));
  this.animContainer.addChild(this.animLeftLight);
  this.animLeftLight.anchor.set(0.5, 0.5);
  this.animLeftLight.x = -80; 

  this.animRightLight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'field_cell_light.png'));
  this.animContainer.addChild(this.animRightLight);
  this.animRightLight.anchor.set(0.5, 0.5);
  this.animRightLight.x = 80;

  this.animRightLight.visible = this.animLeftLight.visible = false;

  var animBg1 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'field_cell.png'));
  this.animContainer.addChild(animBg1);
  animBg1.anchor.set(0.5, 0.5);
  var animBg2 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'field_cell.png'));
  this.animContainer.addChild(animBg2);
  animBg2.anchor.set(0.5, 0.5); 
  animBg2.x = -80; 
  var animBg3 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'field_cell.png'));
  this.animContainer.addChild(animBg3);
  animBg3.anchor.set(0.5, 0.5);
  animBg3.x = 80;

  this.animEatPeg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'peg.png'));
  this.animContainer.addChild(this.animEatPeg);
  this.animEatPeg.anchor.set(0.5, 0.5);

  this.animPeg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'peg.png'));
  this.animContainer.addChild(this.animPeg);
  this.animPeg.anchor.set(0.5, 0.5);

  this.buttonPlay = Gui.createSimpleButton({name: 'button_play', parentPanel: this, width: 273, height: 66, x: -1, y: 120},
  {
    pathToSkin: 'Gui/button_ok.png',
    onClick: function()
    {
      self.tween({name: 'hide_anim'}, function()
      {
      });
    }
  });
  this.buttonPlay.isClickTween = false;

  this.field = null;
}
PanelHelp.prototype = Object.create(Gui.BasePanel.prototype);
PanelHelp.prototype.constructor = PanelHelp;

PanelHelp.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'anim_help')
  {
    var startDelay = 30/30;

    var time = 15/30;
    var ease = Power2.easeOut;
    var delay = 7/30;

    this.animPeg.x = -80;
    this.animPeg.y = 0;
    this.animEatPeg.alpha = 1;
    this.animEatPeg.scale.x = this.animEatPeg.scale.y = 1;

    this.animRightLight.visible = this.animLeftLight.visible = false;
    TweenMax.delayedCall(startDelay, function()
    {
      if(self.state != 'show') return;

      self.animRightLight.visible = self.animLeftLight.visible = true;
      TweenMax.delayedCall(25/30, function()
      {
        if(self.state != 'show') return;

        self.animRightLight.visible = self.animLeftLight.visible = false;

        TweenMax.to(self.animEatPeg, 8/30, {alpha: 0, ease: ease, delay: delay});
        TweenMax.to(self.animEatPeg.scale, 8/30, {x: 0.4, y: 0.4, ease: ease, delay: delay, onComplete: function()
        {
          // if(callback) callback();
        }});

        TweenMax.to(self.animPeg.scale, time*0.5, {x: 1.4, y: 1.4, ease: ease, delay: 0});
        TweenMax.to(self.animPeg.scale, time*0.5, {x: 1.0, y: 1.0, ease: ease, delay: time*0.5 + 0});
        TweenMax.to(self.animPeg, time, {x: 80, ease: ease, delay: 0, onComplete: function()
        {
          TweenMax.delayedCall(30/30, function()
          {
            if(self.state == 'show') self.tween({name: 'anim_help'});
          });
        }});
      });
    });
  }

  if(data.name == 'show_anim')
  {
    this.state = 'show_anim';

    this.field = data.field;

    this.visible = true;
    this.alpha = 0;
    this.y = -80;

    this.animPeg.x = -80;
    this.animPeg.y = 0;
    this.animEatPeg.alpha = 1;
    this.animEatPeg.scale.x = this.animEatPeg.scale.y = 1;

    TweenMax.to(this, 10/30, {alpha: 1, y: 0, ease: Power2.easeOut, onComplete: function()
    {
      self.tween({name: 'anim_help'});
      self.tween({name: 'show'}, callback);
    }});
  }

  if(data.name == 'hide_anim')
  {
    this.state = 'hide_anim';

    TweenMax.to(this, 10/30, {alpha: 0, y: -80, ease: Power2.easeOut, onComplete: function()
    {
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

    this.field = null;

    TweenMax.killTweensOf(this);
    TweenMax.killTweensOf(this.animPeg);
    TweenMax.killTweensOf(this.animEatPeg);
    self.animRightLight.visible = self.animLeftLight.visible = false;

    if(callback) callback();
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelEditor = function(config, fieldInfo)
{
  config.sizeType = 'relative';
  config.widthRelative = 1;
  config.heightRelative = 1;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.fieldInfo = fieldInfo;

  var keySpace = Util.keyboard(32);
  keySpace.press = function()
  {
    self.isSpace = true;
  }
  keySpace.release = function()
  {
    self.isSpace = false;
  } 

  var keyQ = Util.keyboard(81);
  keyQ.press = function()
  {
    self.export();
  }

  var bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/field_bg.png'));
  this.addChild(bg);
  bg.anchor.set(0.5, 0.5);

  this.fieldContainer = new PIXI.Container();
  this.addChild(this.fieldContainer);

  this.initField();

  console.log(this.fieldContainer.width, this.fieldContainer.height);

  this.fieldContainer.x = -this.fieldContainer.width/2+60/2;
  this.fieldContainer.y = -this.fieldContainer.height/2+60/2;
}
PanelEditor.prototype = Object.create(Gui.BasePanel.prototype);
PanelEditor.prototype.constructor = PanelEditor;

PanelEditor.prototype.initField = function()
{
  console.log(this.fieldInfo);

  this.hexShiftX = 30;
  this.hexShiftY = 50;

  this.cells = [];

  if(this.fieldInfo.type == 'rect')
  {
    for(var j = 0; j < this.fieldInfo.height; j++)
    {
      this.cells[j] = [];
      for(var i = 0; i < this.fieldInfo.width; i++)
      {
        var cell = {i: i, j: j, type: 'none'};
        this.cells[j][i] = cell;

        this.createFieldCell(cell);
      }
    }
  }
  if(this.fieldInfo.type == 'hex')
  {
    // this.hexs = [];
    for(var i = 0; i < this.fieldInfo.width; i++)
    {
      this.cells[i] = [];
      for(var j = 0; j < this.fieldInfo.height; j+=2)
      {
        var nJ = j;
        if(i % 2 !== 0) nJ ++;

        // if(!(nJ == 0 && (i == 0 || i == this.fieldInfo.width-1)))
        // {
          var cell = {i: i, j: nJ, type: 'none'}; 
          this.cells[i][nJ] = cell;
          this.createFieldCell(cell);
          // console.log(cell);
        // }
      }
    }
  }

  // for(var j = 0; j < this.fieldInfo.height; j++)
  // {
  //   for(var i = 0; i < this.fieldInfo.width; i++)
  //   {
  //     var cell = 
  //   }
  // }
}

PanelEditor.prototype.createFieldCell = function(cell)
{
  var position = this.getCellPosition(cell);

  var fieldCell = {editor: this, cell: cell};

  var light = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'field_cell_light.png'));
  this.fieldContainer.addChild(light);
  light.anchor.set(0.5, 0.5);
  light.x = position.x;
  light.y = position.y;
  light.visible = false;
  fieldCell.light = light;

  var cellBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'field_cell.png'));
  this.fieldContainer.addChild(cellBg);
  cellBg.anchor.set(0.5, 0.5);
  cellBg.x = position.x;
  cellBg.y = position.y;

  var peg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'peg.png'));
  this.fieldContainer.addChild(peg);
  peg.anchor.set(0.5, 0.5);
  peg.x = position.x;
  peg.y = position.y;
  peg.visible = false;
  fieldCell.peg = peg;

  cellBg.interactiveChildren = true;
  cellBg.interactive = true;
  cellBg.buttonMode = true;
  cellBg.on('click', this.onClickListener, fieldCell);
  cellBg.on('tap', this.onClickListener, fieldCell);
}

PanelEditor.prototype.onClickListener = function(e)
{
  if(this.cell.type == 'none' && this.editor.isSpace)
  {
    this.cell.type = 'free';
    this.light.visible = true;
  }
  else if(this.cell.type == 'free')
  {
    this.cell.type = 'none';
    this.light.visible = false;
  }
  else if(this.cell.type == 'none')
  {
    this.cell.type = 'peg';
    this.peg.visible = true;
  }
  else if(this.cell.type == 'peg')
  {
    this.cell.type = 'none';
    this.peg.visible = false;
  }

  console.log(this.editor.isSpace);
}

PanelEditor.prototype.getCellPosition = function(cell)
{
  // console.log(this.hexShiftX, this.hexShiftY);
  if(this.fieldInfo.type == 'rect') return {x: cell.i * 60, y: cell.j * 60};
  if(this.fieldInfo.type == 'hex') return {x: cell.i * this.hexShiftX, y: cell.j * this.hexShiftY};


}

PanelEditor.prototype.export = function()
{
  console.log('Export:');

  // var cells = this.

  var data = {name: this.fieldInfo.name, score: 0, type: this.fieldInfo.type, width: this.fieldInfo.width, height: this.fieldInfo.height, cells: this.cells};

  var string = JSON.stringify(data);
  console.log(string);
  // alert(JSON.stringify(data));
}