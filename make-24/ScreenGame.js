var ScreenGame = function(config)
{
  config.sizeType = 'relative';
  config.widthRelative = 1;
  config.heightRelative = 1;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.initBlockInputBg(1000, 1000, function()
  {
    
  });
  this.invisibleBg.interactive = false;

  this.state = 'hide';
  this.visible = false;

  this.gamePhase = 'none';
  this.pausePhase = 'off';
  this.blitzPhase = 'off';

  this.isCheatBlitz = false;
  this.isCheatMake24 = false;

  this.containerBoard = new PIXI.Container();
  this.addChild(this.containerBoard);

  this.containerField = new PIXI.Container();
  this.containerBoard.addChild(this.containerField);

  // this.boardOver.alpha = 0.0;

  this.field = new Field({parentPanel: this, layer: this.containerField, x: 0, y: 0});

  this.panelGameControls = new PanelGameControls({parentPanel: this, x: 0, y: -900/2+300/2-10, width: 300, height: 300, field: this.field});
  this.panelGameControls.panelTimer.on('times_up', this.requestTimesUp, this);

  this.isTimesUp = false;

  this.field.on('game_start', function()
  {
    self.onGameStart();
  });
  this.field.on('game_ended', function(data)
  {
    self.onGameEnded(data);
  });
  // this.field.on('no_turns', function()
  // {
  //   self.panelGameControls.undoBlink();
  // });

  

  this.boardOver = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'board_over.png'));
  this.containerBoard.addChild(this.boardOver);
  this.boardOver.anchor.set(0.5, 0.5);
  this.boardOver.alpha = 0.0;

  this.panelSolution = new PanelSolution({parentPanel: this, layer: this.containerBoard, x: 0, y: 0});

  this.panelGameResult = new PanelGameResult({parentPanel: this, layer: this.containerBoard, x: 0, y: 0});

  this.panelDialog = new PanelDialog({parentPanel: this, layer: this.containerBoard, x: 0, y: 0});
  this.panelStartMassage = new PanelStartMassage({parentPanel: this, layer: this.containerBoard, x: 0, y: 0});

  this.containerMassage = new PIXI.Container();
  this.containerBoard.addChild(this.containerMassage);

  this.containerPulse = new PIXI.Container();
  this.containerBoard.addChildAt(this.containerPulse, 0);
  this.pulseBgNormal = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'pulse_bg_normal.png'));
  this.containerPulse.addChild(this.pulseBgNormal);
  this.pulseBgNormal.anchor.set(0.5, 0.5);  
  this.pulseBgBlitz = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'pulse_bg_blitz.png'));
  this.containerPulse.addChild(this.pulseBgBlitz);
  this.pulseBgBlitz.anchor.set(0.5, 0.5);
  this.pulseBgNormal.visible = false;
  this.pulseBgBlitz.visible = false;

  this.blitzBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'blitz_bg.png'));
  this.containerBoard.addChildAt(this.blitzBg, 0);
  this.blitzBg.anchor.set(0.5, 0.5);
  this.blitzBg.alpha = 0.0;

  this.labelMassage = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'label_massage_blitz.png'));
  this.containerMassage.addChild(this.labelMassage);
  this.labelMassage.anchor.set(0.5, 0.5);
  this.containerMassage.visible = false;
  // this.labelBlitz.alpha = 0.0;

  // this.labelBlitz = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'label_blitz.png'));
  // this.containerMassage.addChild(this.labelBlitz);
  // this.labelBlitz.anchor.set(0.5, 0.5);
  // this.labelBlitz.alpha = 0.0;

  // this.labelTimesUp = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'title_times_up.png'));
  // this.containerMassage.addChild(this.labelTimesUp);
  // this.labelTimesUp.anchor.set(0.5, 0.5);
  // this.labelTimesUp.alpha = 0.0;

  // this.labelTimesUp = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'title_times_up.png'));
  // this.containerMassage.addChild(this.labelTimesUp);
  // this.labelTimesUp.anchor.set(0.5, 0.5);
  // this.labelTimesUp.alpha = 0.0;

  this.score = 0;
  this.isHighScoreUp = false;
  this.isHighScoreEqual = false;

  this.containerSalut = new PIXI.Container();
  this.containerField.addChildAt(this.containerSalut, 0);
  this.containerSalut.visible = false;

  this.salutPhase = 'off';
  this.saluts = [];
  for(var i = 0; i < 5; i++)
  {
    var salut = new StarsSplash({type: 'circle', starsCount: Util.randomRangeInt(8, 16)});
    this.containerSalut.addChild(salut);

    this.saluts.push(salut);
  }

  if(app.isCheats)
  {
    var key = Util.keyboard('Q'.charCodeAt(0));
    key.press = function()
    {
      if(self.state == 'show') 
      {
        self.isCheatBlitz = !self.isCheatBlitz;
        console.log('Cheat Blitz:', self.isCheatBlitz);
      }
      // console.log('Q');
    };

    var key = Util.keyboard('W'.charCodeAt(0));
    key.press = function()
    {
      if(self.state == 'show')
      {
        self.isCheatMake24 = !self.isCheatMake24;
        console.log('Cheat Make24:', self.isCheatMake24);
      }
      // console.log('Q');
    };

    var key = Util.keyboard('E'.charCodeAt(0));
    key.press = function()
    {
      if(self.salutPhase == 'off') self.playSalut(7, true);
      // console.log('Q');
    };

    var key = Util.keyboard('R'.charCodeAt(0));
    key.press = function()
    {
      if(self.state == 'show') 
      {
        // if(!self.panelGameControls.panelTimer.visible) return;
        console.log('asdsa', self.panelGameControls.panelTimer);
        self.panelGameControls.panelTimer.addTime(-60);
      }
      // console.log('Q');
    };
  }

  // var key = Util.keyboard('Q'.charCodeAt(0));
  // key.press = function()
  // {
  //   if(self.state == 'show') self.initGame();
  //   // console.log('Q');
  // };

  // var key = Util.keyboard('W'.charCodeAt(0));
  // key.press = function()
  // {
  //   if(self.state == 'show') self.startGame();
  //   // console.log('Q');
  // };

  // key = Util.keyboard('E'.charCodeAt(0));
  // key.press = function()
  // {
  //   // console.log('W');
  //   if(self.state == 'show') self.endGame();
  // };

  guiManager.on('orientation_change', this.onOrientationChange, this);
  guiManager.on('game_resize', this.onGameResize, this);

  app.addForUpdate(this.update, this);
}
ScreenGame.prototype = Object.create(Gui.BasePanel.prototype);
ScreenGame.prototype.constructor = ScreenGame;

ScreenGame.prototype.onOrientationChange = function(data)
{
  var orientation = data.orientation;

  if(orientation == 'portrait')
  { 
    this.containerBoard.x = 0;
    this.containerBoard.y = 300/2;
  }  
  if(orientation == 'landscape')
  {
    this.containerBoard.x = 300/2;
    this.containerBoard.y = 0;
  }
}

ScreenGame.prototype.onGameResize = function(data)
{
  var orientation = guiManager.orientation;
  // console.log(data.width, data.height);

  var boardWidth;
  var boardheight;

  if(orientation == 'landscape')
  {
    boardWidth = 920;
    boardheight = data.height;
  }
  else if(orientation == 'portrait')
  {
    boardWidth = data.width;
    boardheight = 920;
  }

  this.boardOver.width = boardWidth;
  this.boardOver.height = boardheight;

  this.blitzBg.width = boardWidth;
  this.blitzBg.height = boardheight;

  this.pulseBgNormal.width = boardWidth;
  this.pulseBgNormal.height = boardheight;
  this.pulseBgBlitz.width = boardWidth;
  this.pulseBgBlitz.height = boardheight;

  this.containerMassage.y = -boardheight/2 + 141/2;
}

ScreenGame.prototype.hideSalut = function(time)
{
  if(!this.containerSalut.visible) return;

  if(time == undefined) time = 8/30;
  var self = this;

  TweenMax.to(this.containerSalut, time, { alpha: 0, ease: Power2.easeOut, onComplete: function()
  {
    self.containerSalut.visible = false;

    for(var i = 0; i < self.saluts.length; i++)
    {
      if(self.saluts[i].visible)
      {
        self.saluts[i].clear();
      }
    }
  }});
}

ScreenGame.prototype.playSalut = function(count, isStopLast)
{
  var self = this;

  this.containerSalut.alpha = 1.0;
  this.containerSalut.visible = true;

  this.salutPhase = 'on';

  if(count == undefined) count = 7;
  var delay = 0;

  var stopCount = -1;
  if(isStopLast) stopCount = 3;

  for(var i = 0; i < count; i++)
  {
    // var isStop = false;
    // if(stopCount != -1 && i >= count - stopCount) 
    // {
    //   isStop = true;
    //   // console.log('stop!');
    // }
    // salutSplash(delay, { isStopLast: isStop });
    if(isStopLast && i == 4)
    {
      salutSplash(delay, { x: -395, y: -250, scaleXY: 0.5, isStopLast: true });
    }    
    else if(isStopLast && i == 5)
    {
      salutSplash(delay, { x: -120, y: 205, isStopLast: true });
    }
    else if(isStopLast && i == 6)
    {
      salutSplash(delay, { x: 240, y: -135, isStopLast: true });
    }
    else salutSplash(delay, { isStopLast: false });

    delay += Util.randomRange(4, 12) / 30;
  }

  function salutSplash(delay, data)
  {
    TweenMax.delayedCall(delay, function()
    {
      self.salutSplash(data);
    })
  }

  TweenMax.delayedCall(delay + 12/30, function()
  {
    self.salutPhase = 'off';
  });

  // this.salutSplash();
}

ScreenGame.prototype.salutSplash = function(data)
{
  var salut = null;
  var avaiable = [];
  for(var i = 0; i < this.saluts.length; i++)
  {
    if(!this.saluts[i].visible)
    {
      avaiable.push(this.saluts[i]);
    }
  }

  if(avaiable.length > 0) salut = Util.randomElement(avaiable);

  if(salut != null)
  {
    salut.x = (data.x != undefined)?data.x:Util.randomRangeInt(-this.containerBoard.width/2, this.containerBoard.width/2);
    salut.y = (data.y != undefined)?data.y:Util.randomRangeInt(-this.containerBoard.height/2, this.containerBoard.height/2);

    if(data.scaleXY == undefined) salut.scale.x = salut.scale.y = Util.randomRange(0.6, 0.8);
    else salut.scale.x = salut.scale.y = data.scaleXY;    

    salut.play(data);
  }

  // TweenMax.delayedCall(Util.randomRangeInt(20, 40)/30, this.salutSplash, [], this);

  // console.log('salut splash!');
}

ScreenGame.prototype.showMassage = function(massage)
{
  var self = this;

  var massageTexture;

  if(massage == 'blitz') massageTexture = assetsManager.getTexture('texture_atlas_2', 'label_massage_blitz.png');
  else if(massage == 'new_high_score') massageTexture = assetsManager.getTexture('texture_atlas_2', 'label_massage_high_score.png');
  else if(massage == 'times_up') 
  {
    // if(this.blitzPhase == 'on') massageTexture = assetsManager.getTexture('texture_atlas_2', 'label_massage_times_up_blitz.png');
    // else if(this.blitzPhase == 'off') massageTexture = assetsManager.getTexture('texture_atlas_2', 'label_massage_times_up_normal.png');

    massageTexture = assetsManager.getTexture('texture_atlas_2', 'label_massage_times_up_normal.png');
  }

  this.containerMassage.visible = true;

  this.labelMassage.texture = massageTexture;

  this.labelMassage.y = -150/2;
  this.labelMassage.alpha = 0;

  TweenMax.to(this.labelMassage, 10/30, { y: 0, alpha: 1.0, ease: Power1.easeOut, onComplete: function()
  {
    TweenMax.to(self.labelMassage, 10/30, { y: -150/2, alpha: 0.0, ease: Power1.easeOut, delay: 30/30, onComplete: function()
    {
      self.containerMassage.visible = false;
    }});
  }});
}

ScreenGame.prototype.clear = function()
{
  this.panelGameControls.panelScore.clear();

  this.isTimesUp = false;

  this.isCheatBlitz = false;
  // this.isCheatMake24 = false;

  this.pausePhase = 'off';
  this.blitzPhase = 'off';

  this.score = 0;

  this.containerPulse.visible = false;

  this.panelGameControls.clear();
  // this.panelGameControls.hideTwoButtons();

  this.board = null;
}

ScreenGame.prototype.toGame = function(from)
{
  var self = this;

  if(from == undefined) from = 'none'; 

  this.score = 0;

  this.panelGameControls.panelScore.init();
  if(from == 'from_main_menu') 
  {
    this.panelGameControls.hideTwoButtons();
  }

  if(app.gameData.gmode == 'practice' && app.gameData.isTutorial)
  {
    this.tween({name: 'show_anim'}, function()
    {
      app.panelTutorial.show('in_game', function()
      {
        // console.log('Start game');

        startGame();
      });
    });

    this.field.alpha = 0;
    this.field.panelOperations.alpha = 0;
  }
  else if(app.gameData.gmode == 'arcade')
  {
    var startMassage = 'solve_max';
    // if(app.getHighScore() >= 5) startMassage = 'solve_max';

    if(app.gameData.isTutorial)
    {
      this.tween({name: 'show_anim'}, function()
      {
        app.panelTutorial.show('in_game', function()
        {
          self.panelStartMassage.tween({name: 'show_anim', type: startMassage, go: function()
          {
            // console.log('Start game');

            startGame();
          }});
        });
      });
    }
    else
    {
      this.tween({name: 'show_anim'}, function()
      {
        self.panelStartMassage.tween({name: 'show_anim', type: startMassage, go: function()
        {
          // console.log('Start game');

          startGame();
        }});
      });
    }

    // this.tween({name: 'show_anim'}, function()
    // {
    //   app.panelTutorial.show('in_game', function()
    //   {
    //     console.log('Start game');
    //   });

      // self.panelStartMassage.tween({name: 'show_anim', type: startMassage, go: function()
      // {
      //   self.initGame();
      //   self.panelGameControls.showAnimTwoButtons();
        
      //   self.field.tween({name: 'show_anim'}, function()
      //   {
      //     self.startGame();
      //   });
      // }});
    // });

    this.field.alpha = 0;
    this.field.panelOperations.alpha = 0;
  }
  else
  {
    this.tween({name: 'show_anim'});

    startGame();
  }

  function startGame()
  {
    self.initGame();
    self.panelGameControls.showAnimTwoButtons();
    
    self.field.tween({name: 'show_anim'}, function()
    {
      self.startGame();
    });
  }
}

ScreenGame.prototype.leave = function()
{
  if(app.screenMainMenu.state != 'hide' || this.state != 'show') return;

  var self = this;

  // this.panelGameControls.panelTimer.stop();

  this.tween({name: 'hide_anim'}, function()
  {
    self.clear();

    app.screenMainMenu.tween({name: 'show_anim'});
  });

  if(this.gamePhase == 'playing')
  {
    this.field.tween({name: 'hide_anim'});

    app.apiCallback('statistics', { out: 'home', boardNumbers: this.board.numbers });
  }

  if(this.panelSolution.state == 'show') this.panelSolution.tween({name: 'hide_anim'});
  if(this.panelGameResult.state == 'show') this.panelGameResult.tween({name: 'hide_anim'});

  if(this.panelGameControls.panelTimer.state == 'show') this.panelGameControls.panelTimer.tween({name: 'hide'});
  if(this.panelGameControls.panelScore.state == 'show') this.panelGameControls.panelScore.tween({name: 'hide'});

  if(this.blitzPhase == 'on')
  {
    TweenMax.to(this.blitzBg, 8/30, { alpha: 0, ease: Power1.easeOut});
    this.panelGameControls.panelTimer.bg.visible = true;
    TweenMax.to(this.panelGameControls.panelTimer.bgBlitz, 8/30, { alpha: 0, ease: Power1.easeOut, onComplete: function()
    {
      // self.panelGameControls.panelTimer.bg.visible = false;
    }});
  }

  // app.apiCallback('statistics', { out: 'home', boardNumbers: this.board.numbers });

  // if(this.gamePhase == 'playing')
  // {

  // }
}

ScreenGame.prototype.requestLeave = function()
{
  if(this.state != 'show' || this.panelDialog.state != 'hide' || this.field.turnPhase != 'normal') return;

  if(this.gamePhase == 'playing')
  {
    this.pauseGame();

    this.panelDialog.tween({name: 'show_anim', type: 'leave'});

    // this.panelGameControls.buttonHome.interactive = false;
    // this.panelGameControls.buttonSurrender.interactive = false;
    // this.panelGameControls.buttonUndo.interactive = false;
  }
  else if(this.panelSolution.state == 'show')
  {
    this.leave();
  }  
  else if(this.panelGameResult.state == 'show')
  {
    this.leave();
  }
}

ScreenGame.prototype.surrender = function()
{
  if(app.screenMainMenu.state != 'hide' || this.state != 'show') return;

  var self = this;

  this.gamePhase = 'surrender';

  this.field.endGame('surrender');
  this.field.tween({name: 'surrender'}, function()
  {
    self.panelSolution.tween({name: 'show_anim', type: 'surrender', solution: self.board});
  });  

  if(this.panelGameControls.panelTimer.state == 'show') this.panelGameControls.panelTimer.tween({name: 'hide'});
  if(this.panelGameControls.panelScore.state == 'show') this.panelGameControls.panelScore.tween({name: 'hide'});

  this.panelGameControls.hideGameButtons();

  app.boardComplete(app.gameData.dificulty, this.board);

  app.apiCallback('statistics', { out: 'surrender', boardNumbers: this.board.numbers });
}

ScreenGame.prototype.requestSurrender = function()
{
  if(this.state != 'show' || this.panelDialog.state != 'hide' || this.gamePhase != 'playing' || this.field.turnPhase != 'normal') return;

  this.pauseGame();

  this.panelDialog.tween({name: 'show_anim', type: 'surrender'});
}

ScreenGame.prototype.requestTimesUp = function()
{
  this.isTimesUp = true;

  this.timesUp();
}

ScreenGame.prototype.timesUp = function()
{
  if(this.state != 'show' || this.panelDialog.state != 'hide' || !(this.gamePhase == 'playing' || this.gamePhase == 'win') || this.field.turnPhase != 'normal') return;

  var self = this;

  this.isTimesUp = false;

  var isBlitz = this.blitzPhase == 'on';

  this.field.endGame('times_up');

  this.showMassage('times_up');

  app.playAudio('sounds', 'sound_times_up');

  TweenMax.delayedCall(40/30, function()
  {
    if(self.panelGameControls.panelTimer.state == 'show') self.panelGameControls.panelTimer.tween({name: 'hide'});
    if(self.panelGameControls.panelScore.state == 'show') self.panelGameControls.panelScore.tween({name: 'hide'});
    self.panelGameControls.hideGameButtons();

    self.field.tween({name: 'surrender'}, function()
    {
      self.panelGameResult.tween({name: 'show_anim', type: 'first', score: self.score, highScore: app.getHighScore()});
        // self.panelSolution.tween({name: 'show_anim', type: 'times_up', solution: self.board.solution, isBlitz: isBlitz});
      });  
  });

  if(this.blitzPhase == 'on')
  {
    TweenMax.to(this.blitzBg, 8/30, { alpha: 0, ease: Power1.easeOut});
    this.panelGameControls.panelTimer.bg.visible = true;
    TweenMax.to(this.panelGameControls.panelTimer.bgBlitz, 8/30, { alpha: 0, ease: Power1.easeOut, onComplete: function()
    {
      // self.panelGameControls.panelTimer.bg.visible = false;
    }});
  }

  app.apiCallback('statistics', { out: 'times_out', boardNumbers: this.board.numbers });

  // this.field.tween({name: 'surrender'}, function()
  // {
    // self.panelSolution.tween({name: 'show_anim', type: 'times_up', solution: self.board.solution, isBlitz: isBlitz});
  // });  

  // console.log('Times Up!');
}

ScreenGame.prototype.update = function()
{
  if(this.isTimesUp) this.timesUp();
}

ScreenGame.prototype.activateBlitz = function(callback)
{
  // console.log('Activate blitz!');

  var self = this;

  this.blitzPhase = 'on';

  // this.labelBlitz.alpha = 0;
  // this.labelBlitz.y = -550;
  // TweenMax.to(this.labelBlitz, 8/30, { y: -400, alpha: 1.0, ease: Power1.easeOut, onComplete: function()
  // {
  //   TweenMax.to(self.labelBlitz, 8/30, { y: -550, alpha: 0.0, ease: Power1.easeOut, delay: 22/30 });
  // }});
  this.showMassage('blitz');

  TweenMax.to(this.blitzBg, 14/30, { alpha: 1, ease: Power1.easeOut, delay: 14/30});

  TweenMax.to(this.panelGameControls.panelTimer.bgBlitz, 14/30, { alpha: 1, ease: Power1.easeOut, delay: 14/30, onComplete: function()
  {
    self.panelGameControls.panelTimer.bg.visible = false;
  }});

  TweenMax.delayedCall(60/30, function()
  {
    if(callback) callback();
  });
}

ScreenGame.prototype.initGame = function(type)
{
  if(type == undefined) type = 'new_game';

  this.gamePhase = 'waiting_start';

  this.isTimesUp = false;

  if(this.panelGameControls.panelScore.state == 'hide') this.panelGameControls.panelScore.tween({name: 'show'});

  this.board = app.getBoard();
  this.field.initGame(this.board);

  if(type == 'new_game')
  {
    this.isHighScoreUp = false;
    this.isHighScoreEqual = false;

    this.panelGameControls.panelScore.init(); 

    this.panelGameControls.showGameButtons();
  }

  if(app.gameData.gmode == 'arcade' && type == 'new_game') 
  {
    var isAnim = this.state == 'show'?true:false;
    isAnim = false;

    this.panelGameControls.panelTimer.init(app.getBaseTime(), isAnim);
    if(this.panelGameControls.panelTimer.state == 'hide') this.panelGameControls.panelTimer.tween({name: 'show'});
  }
}

ScreenGame.prototype.startGame = function()
{
  var self = this;

  this.field.tween({name: 'start_game'}, function()
  {
    self.gamePhase = 'playing';

    self.field.startGame();

    self.isTimesUp = false;

    if(app.gameData.gmode == 'arcade') self.panelGameControls.panelTimer.start();
  });
}

ScreenGame.prototype.endGame = function()
{
  this.gamePhase = 'end';

  this.field.endGame();
}

ScreenGame.prototype.nextGame = function()
{
  this.initGame('next_game');
  this.startGame();
}

ScreenGame.prototype.playAgain = function()
{
  if(this.state != 'show' || this.panelDialog.state != 'hide' || !(this.gamePhase == 'surrender' || this.gamePhase == 'times_up') || this.field.turnPhase != 'normal') return;

  var self = this;

  if(this.panelSolution.state == 'show')
  {
    this.panelSolution.tween({name: 'hide_anim'}, function()
    {
      self.clear();   
      // self.panelGameControls.panelScore.init(); 
      self.initGame();

      self.field.tween({name: 'show_anim'}, function()
      {
        self.startGame();
      });
    });
  }
  else if(this.panelGameResult.state == 'show')
  {
    this.panelGameResult.tween({name: 'hide_anim'}, function()
    {
      self.clear();   
      // self.panelGameControls.panelScore.init();  
      self.initGame();

      self.field.tween({name: 'show_anim'}, function()
      {
        self.startGame();
      });
    });
  }


  // this.panelGameControls.panelScore.tween({name: 'hide'});

  // if(this.blitzPhase == 'on')
  // {
  //   TweenMax.to(this.blitzBg, 8/30, { alpha: 0, ease: Power1.easeOut});
  //   this.panelGameControls.panelTimer.bg.visible = true;
  //   TweenMax.to(this.panelGameControls.panelTimer.bgBlitz, 8/30, { alpha: 0, ease: Power1.easeOut, onComplete: function()
  //   {
  //     // self.panelGameControls.panelTimer.bg.visible = false;
  //   }});
  // }
}

ScreenGame.prototype.pauseGame = function()
{
  if(this.gamePhase != 'playing') return;

  // this.gamePhase = 'pause';
  this.pausePhase = 'on';

  this.field.interactive = false;
  this.field.interactiveChildren = false;

  if(app.gameData.gmode == 'arcade') this.panelGameControls.panelTimer.stop();

  // console.log('Game Paused!');
}
ScreenGame.prototype.continueGame = function()
{
  if(this.gamePhase != 'playing') return;

  // this.gamePhase = 'playing';
  this.pausePhase = 'off';

  this.field.interactive = true;
  this.field.interactiveChildren = true;

  if(app.gameData.gmode == 'arcade') this.panelGameControls.panelTimer.start();

  // console.log('Game Comtinue!');
}

ScreenGame.prototype.onGameStart = function()
{
  var self = this;

  // if(app.gameData.gmode == 'arcade') this.panelGameControls.panelTimer.start();

  // TweenMax.delayedCall(10/30, function()
  // {
  //   self.panelSolution.tween({name: 'show_anim', type: 'times_up', solution: self.board.solution});
  //   // self.panelSolution.tween({name: 'show_anim', type: 'surrender', solution: self.board.solution});
  // });
}

ScreenGame.prototype.onGameEnded = function(data)
{
  var self = this;

  this.gamePhase = data.type;

  if(data.type == 'win')
  {
    this.score ++;

    if(app.gameData.gmode == 'arcade')
    {
      if(this.score > app.getHighScore()) app.setHighScore(this.score);
    }

    this.isTimesUp = false;

    this.panelGameControls.panelScore.tween({ name: 'add_card', card24: data.card24}, function()
    {
      var isActivateBlitz = app.gameData.gmode == 'arcade' && self.panelGameControls.panelScore.score == app.getBlitzStartScore();
      if(self.isCheatBlitz) 
      {
        isActivateBlitz = true;
        self.isCheatBlitz = false;
      }

      if(isActivateBlitz && self.blitzPhase == 'off')
      {
        self.activateBlitz(function()
        {
          self.initGame('next_game');
          self.startGame();
        });
      }
      else
      {
        if(app.gameData.gmode == 'practice' || (app.gameData.gmode == 'arcade' && self.panelGameControls.panelTimer.time > 0))
        {
          self.initGame('next_game');
          self.startGame();
        }
        else 
        {
          // console.log(self.gamePhase, self.field.turnPhase);
          self.timesUp();
        }
      }
    });

    if(app.gameData.gmode == 'arcade')
    {
      this.panelGameControls.panelTimer.stop();
      if(this.blitzPhase == 'off') this.panelGameControls.panelTimer.addTime(app.getBonusTime());
    }

    app.boardComplete(app.gameData.dificulty, this.board);
  }
}

ScreenGame.prototype.tween = function(data, callback)
{
  var self = this;

  var elemsShift = 200;

  if(data.name == 'show_anim' && this.state == 'hide')
  {
    this.state = 'show_anim';

    this.visible = true;
    this.alpha = 1;

    var time = 15/30;
    var showDelay = 0/30;

    if(guiManager.orientation == 'landscape')
    {
      this.panelGameControls.x = - 1200/2 + 300/2 - 10 - elemsShift;
      this.panelGameControls.y = 0;
      this.panelGameControls.alpha = 0;
      TweenMax.to(this.panelGameControls, time, {alpha: 1, x: - 1200/2 + 300/2 - 10, ease: Power2.easeOut});

      // this.field.x = elemsShift;
      // this.field.y = 0;
      // this.field.alpha = 0;
      // TweenMax.to(this.field, time, {alpha: 1, x: 0, ease: Power2.easeOut});
    }
    else
    {
      this.panelGameControls.x = 0;
      this.panelGameControls.y = -1200/2 + 300/2 - 10 - elemsShift;
      this.panelGameControls.alpha = 0;
      TweenMax.to(this.panelGameControls, time, {alpha: 1, y: -1200/2 + 300/2 - 10, ease: Power2.easeOut});

      // this.field.x = 0;
      // this.field.y = elemsShift;
      // this.field.alpha = 0;
      // TweenMax.to(this.field, time, {alpha: 1, y: 0, ease: Power2.easeOut});
    }

    // this.field.tween({name: 'show_anim'});

    // TweenMax.delayedCall(6/30, function()
    // {
    //   self.startGame();
    // });

    this.panelGameControls.prepareToGome();

    TweenMax.to(this, time, {alpha: 1, x: 0, y: 0, ease: Power2.easeOut, delay: showDelay, onComplete: function()
    {
      self.tween({name: 'show'}, callback);
    }});
  }

  if(data.name == 'hide_anim' && this.state == 'show')
  {
    this.state = 'hide_anim';
    this.interactiveChildren = false;

    var time = 15/30;
    var showDelay = 0/30;

    if(guiManager.orientation == 'landscape')
    {
      TweenMax.to(this.panelGameControls, time, {alpha: 0, x: - 1200/2 + 300/2 - 10 - elemsShift, ease: Power2.easeOut});
      // TweenMax.to(this.field, time, {alpha: 0, x: 300/2 + elemsShift, ease: Power2.easeOut});
    }
    else
    {
      TweenMax.to(this.panelGameControls, time, {alpha: 0, y: -1200/2 - 300/2 - 10 - elemsShift, ease: Power2.easeOut});
      // TweenMax.to(this.field, time, {alpha: 0, y: 300/2 + elemsShift, ease: Power2.easeOut});
    }

    // this.field.tween({name: 'hide_anim'});

    TweenMax.to(this, time, {alpha: 1, x: 0, y: 0, ease: Power2.easeOut, delay: showDelay, onComplete: function()
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

    this.field.clear();

    // this.panelGameControls.resetButtons();

    if(callback) callback();
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelGameControls = function(config)
{
  Gui.BasePanel.call(this, config);


  var self = this;

  // this.initBlockInputBg(5000, 5000, bind(function()
  // {

  // }, this));

  this.state = 'show';

  this.field = config.field;

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'color_rect_blue_light.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);
  this.bg.width = 500;
  this.bg.height = 300;

  this.buttonHome = Gui.createSimpleButton({name: 'button_play', parentPanel: this, width: 138, height: 138},
  {
    pathToSkin: 'button_home_0001.png',
    // pathToMouseOverBg: 'button_regular_over_bg.png',
    onClick: function()
    {
      if(!(app.screenGame.state == 'show' && app.screenGame.panelDialog.state == 'hide' && self.buttonHome.isCanClick)) return;

      var skin = self.buttonHome.skin;

      skin.scale.x = skin.scale.y = 1;
      // TweenMax.killTweensOf(text.scale);
      TweenMax.to(skin.scale, 3/30, {x: 0.8, y: 0.8, ease: Power2.easeOut, onComplete: function()
      {
        TweenMax.to(skin.scale, 3/30, {x: 1, y: 1, ease: Power2.easeOut, onComplete: function()
        {
          self.buttonHome.isCanClick = true;
        }});
      }});

      self.buttonHome.isCanClick = false;

      app.screenGame.requestLeave();

      app.playAudio('sounds', 'sound_click');
    }
  }); 
  this.buttonHome.isCanClick = true;
  this.buttonHome.isClickTween = false;
  this.buttonHome.isClickSound = false;
  // this.buttonHome.isNeedMouseOverOut = true;
  app.setButtonHover(this.buttonHome, assetsManager.getTexture('texture_atlas', 'button_home_0001.png'), assetsManager.getTexture('texture_atlas', 'button_home_0002.png'));

  this.buttonSurrender = Gui.createSimpleButton({name: 'button_surrender', parentPanel: this, width: 138, height: 138},
  {
    pathToSkin: 'button_surrender_0001.png',
    // pathToMouseOverBg: 'button_regular_over_bg.png',
    onClick: function()
    {
      if(!(app.screenGame.state == 'show' && app.screenGame.panelDialog.state == 'hide' && app.screenGame.panelSolution.state == 'hide' && self.buttonSurrender.isCanClick)) return;

      var skin = self.buttonSurrender.skin;

      skin.scale.x = skin.scale.y = 1;
      // TweenMax.killTweensOf(text.scale);
      TweenMax.to(skin.scale, 3/30, {x: 0.8, y: 0.8, ease: Power2.easeOut, onComplete: function()
      {
        TweenMax.to(skin.scale, 3/30, {x: 1, y: 1, ease: Power2.easeOut, onComplete: function()
        {
          self.buttonSurrender.isCanClick = true;
        }});
      }});

      app.playAudio('sounds', 'sound_click');

      self.buttonSurrender.isCanClick = false;

      app.screenGame.requestSurrender();
    }
  }); 
  this.buttonSurrender.isCanClick = true;
  this.buttonSurrender.isClickTween = false;
  this.buttonSurrender.isClickSound = false;
  app.setButtonHover(this.buttonSurrender, assetsManager.getTexture('texture_atlas', 'button_surrender_0001.png'), assetsManager.getTexture('texture_atlas', 'button_surrender_0002.png'));

  // var buttonOverBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'button_regular_over_bg.png'));
  // this.buttonHome.addChildAt(buttonOverBg, 0);
  // buttonOverBg.anchor.set(0.5, 0.5);
  // buttonOverBg.visible = false;

  this.panelScore = new PanelScore({name: 'panel_score', parentPanel: this, width: 168, height: 132});

  this.containerUndo = new PIXI.Container();
  this.addChild(this.containerUndo);

  this.buttonUndo = Gui.createSimpleButton({name: 'button_undo', parentPanel: this, layer: this.containerUndo, width: 216, height: 300},
  {
    pathToSkin: 'button_undo.png',
    // pathToMouseOverBg: 'color_rect_undo_bg.png',
    onClick: function()
    {
      if(!(app.screenGame.state == 'show' && app.screenGame.panelDialog.state == 'hide' && app.screenGame.panelSolution.state == 'hide' && self.buttonUndo.isCanClick)) return;
      self.field.undo();

      var skin = self.buttonUndo.skin;

      skin.scale.x = skin.scale.y = 1;
      // TweenMax.killTweensOf(text.scale);
      TweenMax.to(skin.scale, 3/30, {x: 0.8, y: 0.8, ease: Power2.easeOut, onComplete: function()
      {
        TweenMax.to(skin.scale, 3/30, {x: 1, y: 1, ease: Power2.easeOut, onComplete: function()
        {
          self.buttonUndo.isCanClick = true;
        }});
      }});

      app.playAudio('sounds', 'sound_click');

      self.buttonUndo.isCanClick = false;
    }
  }); 
  this.buttonUndo.isCanClick = true;
  this.buttonUndo.isClickTween = false;
  this.buttonUndo.isClickSound = false;
  this.buttonUndo.skin.interactive = false;
  this.buttonUndo.isNeedMouseOverOut = true;

  this.undoBlinkLandscape = new PanelsBlink({ mask: assetsManager.getTexture('texture_atlas', 'button_undo_bg_landscape.png') });
  this.buttonUndo.addChildAt(this.undoBlinkLandscape, 0);
  this.undoBlinkPortait = new PanelsBlink({ mask: assetsManager.getTexture('texture_atlas', 'button_undo_bg_portait.png') });
  this.buttonUndo.addChildAt(this.undoBlinkPortait, 0);

  this.undoBorder = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'button_undo_border.png'));
  this.buttonUndo.addChildAt(this.undoBorder, 0);
  this.undoBorder.anchor.set(0.5, 0.5);
  this.undoBorder.visible = false;

  this.undoLightOver = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'bg_undo_light_over.png'));
  this.buttonUndo.addChildAt(this.undoLightOver, 0);
  this.undoLightOver.anchor.set(0.5, 0.5);
  this.undoLightOver.visible = false;

  this.undoLight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'button_undo_light.png'));
  this.buttonUndo.addChildAt(this.undoLight, 0);
  this.undoLight.anchor.set(0.5, 0.5);
  this.undoLight.visible = false;

  this.buttonUndoMOContainer = new PIXI.Container();
  this.buttonUndo.addChildAt(this.buttonUndoMOContainer, 0);
  this.buttonUndo.on('mouse_over', function(d)
  {
    // console.log('AAA');
    this.buttonUndoMOContainer.visible = true;
  }, this);
  this.buttonUndo.on('mouse_out', function(d)
  {
    this.buttonUndoMOContainer.visible = false;
  }, this);
  this.buttonUndoMOContainer.visible = false;

  this.undoBgMOLandscape = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'button_undo_bg_landscape_over.png'));
  this.buttonUndoMOContainer.addChild(this.undoBgMOLandscape);
  this.undoBgMOLandscape.anchor.set(0.5, 0.5);
  this.undoBgMOLandscape.visible = false;
  this.undoBgMOLandscape.interactive = false;

  this.undoBgLandscape = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'button_undo_bg_landscape.png'));
  this.buttonUndo.addChildAt(this.undoBgLandscape, 0);
  this.undoBgLandscape.anchor.set(0.5, 0.5);
  // this.undoBgLandscape.width = 300;
  // this.undoBgLandscape.height = 216;

  this.undoBgPortait = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'button_undo_bg_portait.png'));
  this.buttonUndo.addChildAt(this.undoBgPortait, 0);
  this.undoBgPortait.anchor.set(0.5, 0.5);
  // this.undoBgPortait.width = 216;
  // this.undoBgPortait.height = 300;
  this.undoBgPortait.alpha = 0.0;

  this.panelTimer = new PanelTimer({name: 'panel_timer', parentPanel: this, width: 165, height: 200});

  // function ttt()
  // {
  //   self.undoBlinkLandscape.play({time: 14/30});
  //   TweenMax.delayedCall(30/30, ttt);
  // }
  // ttt();


  // this.undoBgRect = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'color_rect_undo_bg.png'));
  // this.buttonUndo.addChildAt(this.undoBgRect, 0);
  // this.undoBgRect.anchor.set(0.5, 0.5);

  this.field.on('no_turns', function()
  {
    TweenMax.killDelayedCallsTo(self.tweenNoTurns);
    self.tweenNoTurns();
  });
  this.field.on('undo', function()
  {
    self.resetTweenNoTurns();
  });

  // this.field.on('undo', function()
  // {
  //   self.tweenNoTurns();
  // });

  guiManager.on('orientation_change', this.onOrientationChange, this);
  guiManager.on('game_resize', this.onGameResize, this);
}
PanelGameControls.prototype = Object.create(Gui.BasePanel.prototype);
PanelGameControls.prototype.constructor = PanelGameControls;

PanelGameControls.prototype.hideTwoButtons = function()
{
  // if(this.buttonUndo.alpha == 0) return;

  this.buttonHome.alpha = 0;
  this.buttonSurrender.alpha = 0;
  this.buttonUndo.alpha = 0;

  this.buttonHome.visible = false;
  this.buttonSurrender.visible = false;
  this.buttonUndo.visible = false;

  // TweenMax.to(this.buttonUndo, 8/30, { alpha: 0, ease: Power2.easeOut });
  // TweenMax.to(this.buttonSurrender, 8/30, { alpha: 0, ease: Power2.easeOut });
}
PanelGameControls.prototype.showAnimTwoButtons = function()
{
  // if(this.buttonUndo.alpha == 1) return;

  this.buttonHome.visible = true;
  this.buttonSurrender.visible = true;
  this.buttonUndo.visible = true;

  TweenMax.to(this.buttonHome, 8/30, { alpha: 1, ease: Power2.easeOut });
  TweenMax.to(this.buttonSurrender, 8/30, { alpha: 1, ease: Power2.easeOut });
  TweenMax.to(this.buttonUndo, 8/30, { alpha: 1, ease: Power2.easeOut });
}

PanelGameControls.prototype.hideGameButtons = function()
{
  if(this.buttonUndo.alpha == 0) return;

  TweenMax.to(this.buttonUndo, 8/30, { alpha: 0, ease: Power2.easeOut });
  TweenMax.to(this.buttonSurrender, 8/30, { alpha: 0, ease: Power2.easeOut });
}
PanelGameControls.prototype.showGameButtons = function()
{
  if(this.buttonUndo.alpha == 1) return;

  TweenMax.to(this.buttonUndo, 8/30, { alpha: 1, ease: Power2.easeOut });
  TweenMax.to(this.buttonSurrender, 8/30, { alpha: 1, ease: Power2.easeOut });
}

PanelGameControls.prototype.tweenNoTurns = function()
{
  if(!(app.screenGame.state == 'show' && this.field.turnN == 3 && app.screenGame.panelSolution.state == 'hide' && app.screenGame.panelGameResult.state == 'hide')) return;

  var self = this;

  this.undoBlinkLandscape.play({ time: 20/30 });
  this.undoBlinkPortait.play({ time: 20/30 });

  this.undoBorder.visible = true;
  this.undoBorder.alpha = 0;
  TweenMax.to(this.undoBorder, 6/30, { alpha: 1, ease: Power1.easeIn, onComplete: function()
  {
    TweenMax.to(self.undoBorder, 6/30, { alpha: 0, ease: Power1.easeOut, onComplete: function()
    {
      self.undoBorder.visible = false;
    }});
  }});

  this.undoLight.visible = true;
  this.undoLight.alpha = 0;
  TweenMax.to(this.undoLight, 6/30, { alpha: 1, ease: Power1.easeIn, onComplete: function()
  {
    TweenMax.to(self.undoLight, 6/30, { alpha: 0, ease: Power1.easeOut, onComplete: function()
    {
      self.undoLight.visible = false;
    }});
  }});

      var skin = self.buttonUndo.skin;

      skin.scale.x = skin.scale.y = 1;
      // TweenMax.killTweensOf(text.scale);
      TweenMax.to(skin.scale, 6/30, {x: 1.2, y: 1.2, ease: Power2.easeOut, onComplete: function()
      {
        TweenMax.to(skin.scale, 6/30, {x: 1, y: 1, ease: Power2.easeOut, onComplete: function()
        {
          self.buttonUndo.isCanClick = true;
        }});
      }});

  this.undoLightOver.visible = true;
  this.undoLightOver.alpha = 1;

  // TweenMax.killDelayedCallsTo(this.tweenNoTurns);
  TweenMax.delayedCall(50/30, this.tweenNoTurns, [], this);
}

PanelGameControls.prototype.resetTweenNoTurns = function()
{
  this.undoLightOver.visible = false;

  TweenMax.killDelayedCallsTo(this.tweenNoTurns);
}

PanelGameControls.prototype.onOrientationChange = function(data)
{
  var orientation = data.orientation;

  if(orientation == 'portrait')
  { 
    this.height = 300;
    this.bg.height = 300;

    this.undoLightOver.width = 216;
    this.undoLightOver.height = 300;

    this.x = 0;
    this.y = -1200/2 + 300/2 - 10;
  }  
  if(orientation == 'landscape')
  {
    // this.y = -900/2 + 300/2 -10;

    this.width = 300;
    this.bg.width = 300;

    this.undoLightOver.width = 300;
    this.undoLightOver.height = 216;

    this.x =  - 1200/2 + 300/2 - 10;   
    this.y = 0;
  }

  this.setControlsPosition(orientation);
}

PanelGameControls.prototype.onGameResize = function(data)
{
  var orientation = guiManager.orientation;

  if(orientation == 'portrait')
  { 
    this.width = data.width;
    this.bg.width = data.width;
  }  
  if(orientation == 'landscape')
  {
    this.height = data.width;
    this.bg.height = data.width;
  }
}

PanelGameControls.prototype.setControlsPosition = function(orientation)
{
  var gmode = app.gameData.gmode;

  if(orientation == 'portrait')
  { 
    this.buttonHome.x = -375;
    this.buttonHome.y = -150+138/2+10;   
    this.buttonSurrender.x = -375;
    this.buttonSurrender.y = 150-138/2-10;

    // this.buttonAudio.x = -375;
    // this.buttonAudio.y = 75;

    if(gmode == 'arcade')
    {
      this.panelScore.x = -170+20;
      this.panelScore.y = 20;

      this.panelTimer.x = 78+20;
      this.panelTimer.y = -7.5-10;
    }
    else if(gmode == 'practice')
    {
      this.panelScore.x = 0;
      this.panelScore.y = 20;

      // this.panelTimer.x = 78;
      // this.panelTimer.y = -7.5-10;
    }

    this.containerUndo.x = 342;
    this.containerUndo.y = 0;

    this.buttonUndo.width = 216;
    this.buttonUndo.height = 300;

    this.undoBgPortait.visible = true;
    this.undoBgLandscape.visible = false;
    this.undoBlinkPortait.visible = true;
    this.undoBlinkLandscape.visible = false;

    this.undoBgMOLandscape.visible = false;

    this.undoBorder.rotation = 90*Util.TO_RADIANS;

    // this.buttonUndo.mouseOverBg.width = 216;
    // this.buttonUndo.mouseOverBg.height = 300;
    // this.buttonUndo.mouseOverBg.alpha = 0;

    // this.undoBgRect.width = 216;
    // this.undoBgRect.height = 300;
    // this.undoBgRect.alpha = 0;

    // this.undoBg.width = 216;
    // this.undoBg.height = 300;
    // this.undoBg.alpha = 0;
  }  
  else if(orientation == 'landscape')
  { 
    this.buttonHome.x = -150+138/2+10;
    this.buttonHome.y = -375-10;
    this.buttonSurrender.x = 150-138/2-10;
    this.buttonSurrender.y = -375-10;

    // this.buttonAudio.x = 75;
    // this.buttonAudio.y = -375-10;

    if(gmode == 'arcade')
    {
      this.panelScore.x = 0;
      this.panelScore.y = -175;

      this.panelTimer.x = 0;
      this.panelTimer.y = 72;
    }
    else if(gmode == 'practice')
    {
      this.panelScore.x = 0;
      this.panelScore.y = -20;

      // this.panelTimer.x = 0;
      // this.panelTimer.y = 72;
    }

    this.buttonUndo.width = 300;
    this.buttonUndo.height = 216;

    this.containerUndo.x = 0;
    this.containerUndo.y = 342+10;

    this.undoBgPortait.visible = false;
    this.undoBgLandscape.visible = true;
    this.undoBlinkPortait.visible = false;
    this.undoBlinkLandscape.visible = true;

    this.undoBgMOLandscape.visible = true;

    this.undoBorder.rotation = 0*Util.TO_RADIANS;

    // this.undoBgRect.width = 300;
    // this.undoBgRect.height = 216;
    // this.undoBgRect.alpha = 0;

    // this.buttonUndo.mouseOverBg.width = 300;
    // this.buttonUndo.mouseOverBg.height = 216;
    // this.buttonUndo.mouseOverBg.alpha = 1;

    // this.undoBg.x = this.buttonUndo.x;
    // this.undoBg.y = this.buttonUndo.y;
    // this.undoBg.width = 300;
    // this.undoBg.height = 216;
    // this.undoBg.alpha = 0;
    // this.undoBg.alpha = 0;
  } 

  this.undoLight.width = this.buttonUndo.width;
  this.undoLight.height = this.buttonUndo.height;
}

PanelGameControls.prototype.undoBlink = function()
{
  this.undoBlinkPortait.play({time: 14/30});
  this.undoBlinkLandscape.play({time: 14/30});
}

PanelGameControls.prototype.clear = function()
{
  this.buttonUndo.alpha = 1;
  this.buttonSurrender.alpha = 1;

  this.resetTweenNoTurns();
}

PanelGameControls.prototype.prepareToGome = function()
{
  var gmode = app.gameData.gmode;
  var dificulty = app.gameData.dificulty;

  // var score = app.getScore();
  // this.panelScore.setScore(score);

  if(gmode == 'practice')
  {
    // this.panelTimer.visible = false;
  }
  else if(gmode == 'arcade')
  {
    // this.panelTimer.visible = true;
    // this.panelTimer.init();
  }

  this.resetTweenNoTurns();

  this.setControlsPosition(guiManager.orientation);
}

// PanelGameControls.prototype.resetButtons = function()
// {
//   // this.buttonHome.mouseOverBg.alpha = 0;
//   // this.buttonAudio.mouseOverBg.alpha = 0;
// }
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelScore = function(config)
{
  config.width = 168;
  config.height = 132;
  Gui.BasePanel.call(this, config);


  var self = this;

  // this.initBlockInputBg(5000, 5000, bind(function()
  // {

  // }, this));

  this.state = 'hide';

  this.container = new PIXI.Container();
  this.addChild(this.container);

  this.containerBg = new PIXI.Container();
  this.container.addChild(this.containerBg);
  // this.containerBg.x = 15;

  this.containerCards = new PIXI.Container();
  this.container.addChild(this.containerCards);

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'score_bg.png'));
  this.containerBg.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  this.textScore = Util.setParams(new Gui.TextBmp('0',  constsManager.getData('text_configs/score_text')), {parent: this.containerBg, aX:0.5, aY:0.5, x: 0, y: 10-20});

  this.textHightScore = Util.setParams(new Gui.TextBmp('High score: 0',  constsManager.getData('text_configs/label_high_score')), {parent: this.containerBg, aX:0.5, aY:0.5, x: 0, y: 100});

  this.dificultyStars = new DificultyStars();
  this.containerBg.addChild(this.dificultyStars);
  this.dificultyStars.setDificulty('easy');

  this.labelStreak = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'label_streak.png'));
  this.container.addChild(this.labelStreak);
  this.labelStreak.anchor.set(0, 0.5);
  this.labelStreak.x = -100+24;
  this.labelStreak.y = -95;

  this.labelScore = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'label_score.png'));
  this.container.addChild(this.labelScore);
  this.labelScore.anchor.set(0, 0.5);
  this.labelScore.x = -100+30;
  this.labelScore.y = -95;

  this.cardBg0 = new ScoreCard({ panelScore: this, type: 'back_0' });
  this.cardBg1 = new ScoreCard({ panelScore: this, type: 'back_1' });
  this.cardBg2 = new ScoreCard({ panelScore: this, type: 'back_2' });
  this.cardFace = new ScoreCard({ panelScore: this, type: 'face' });

  this.score = 0;


  // this.bgNewCard = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_score_bg.png'));
  // this.containerScore.addChild(this.bgNewCard);
  // this.bgNewCard.anchor.set(0.5, 0.5);

  // this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_score_bg.png'));
  // this.containerScore.addChild(this.bg);
  // this.bg.anchor.set(0.5, 0.5);

  // this.textScore = Util.setParams(new Gui.TextBmp('38',  constsManager.getData('text_configs/score_text')), {parent: this.containerScore, aX:0.5, aY:0.5, x: 14, y: 14});

  this.clear();

  this.visible = false;
}
PanelScore.prototype = Object.create(Gui.BasePanel.prototype);
PanelScore.prototype.constructor = PanelScore;

PanelScore.prototype.clear = function()
{
  this.cardBg0.visible = false;
  this.cardBg1.visible = false;
  this.cardBg2.visible = false;
  this.cardFace.visible = false;

  this.setScore(0);

  this.container.x = 0;
  this.container.y = 0;
  this.container.scale.x = this.container.scale.y = 1.0;
  this.container.alpha = 1.0;

  this.containerCards.x = 0;
}

PanelScore.prototype.init = function()
{
  this.labelStreak.visible = false;
  this.labelScore.visible = false;

  this.containerCards.x = 0;

  if(app.gameData.gmode == 'practice') 
  {
    this.labelStreak.visible = true;

    this.textHightScore.visible = false;
  }
  else if(app.gameData.gmode == 'arcade')
  {
    this.labelScore.visible = true;

    var highScore = app.getHighScore();
    if(highScore == 0) this.textHightScore.visible = false;
    else 
    {
      this.textHightScore.visible = true;
      this.textHightScore.text = 'Best: ' + highScore;
    }
  }

  if(app.gameData.dificulty == 'easy')
  {
    this.dificultyStars.visible = false;
    this.textScore.y = 15;

    this.cardFace.dificultyStars.visible = false;
    this.cardFace.textScore.y = 14;
  }
  else
  {
    this.dificultyStars.visible = true;
    this.textScore.y = 0;

    this.dificultyStars.setDificulty(app.gameData.dificulty);
    this.dificultyStars.scale.x = this.dificultyStars.scale.y = 0.7;
    this.dificultyStars.y = 40;

    this.cardFace.dificultyStars.visible = true;
    this.cardFace.dificultyStars.scale.x = this.cardFace.dificultyStars.scale.y = 0.7;
    this.cardFace.dificultyStars.y = 40;
    this.cardFace.dificultyStars.setDificulty(app.gameData.dificulty);

    this.cardFace.textScore.y = 0;
    
  }

  // this.visible = false;
}

PanelScore.prototype.setScore = function(score)
{
  this.score = score;

  // this.cardFace.textScore.text = score + '';

  // if(score == 0) this.textScore.visible = false;
  // else this.textScore.visible = true;
}

PanelScore.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'add_card')
  {
    var card24 = data.card24;

    // console.log('Score:', this.score);
    this.setScore(this.score + 1);
    // console.log('Score + 1:', this.score);

    var card = null;
    if(this.score == 1) card = this.cardFace;
    else if(this.score == 2) card = this.cardBg2;
    else if(this.score == 3) card = this.cardBg1;
    else card = this.cardBg0;

    card.tween({name: 'adding', card24: card24}, function()
    {
      if(callback) callback();
    });

    TweenMax.delayedCall(10/30, function()
    {
      if(self.score == 1) 
      {
        self.cardFace.textScore.text = self.score + '';
        TweenMax.to(self.cardFace.textScore, 4/30, { alpha: 1, ease: Power1.easeOut });

        if(self.cardFace.dificultyStars.visible)
        {
          self.cardFace.dificultyStars.alpha = 0;
          TweenMax.to(self.cardFace.dificultyStars, 4/30, { alpha: 1, ease: Power1.easeOut });
        }
      }
      else 
      {
        self.cardFace.textScore.text = self.score + '';

        TweenMax.to(self.cardFace.textScore, 4/30, { pixi: { scaleX: 1.3, scaleY: 1.3 }, ease: Power1.easeOut, onComplete: function()
        {
          

          TweenMax.to(self.cardFace.textScore, 6/30, { pixi: { scaleX: 1.0, scaleY: 1.0 }, ease: Power1.easeIn});
        }});
      }
    });
  }

  if(data.name == 'show')
  {
    this.visible = true;
    this.container.alpha = 0;
    this.container.x = -40;
    TweenMax.to(this.container, 8/30, { x: 0, alpha: 1, ease: Power2.easeOut, onComplete: function()
    {
      self.state = 'show';

      if(callback) callback();
    }})

    // console.log('show score');
  }
  if(data.name == 'hide')
  {
    TweenMax.to(this.container, 8/30, { x: -40, alpha: 0, ease: Power2.easeOut, onComplete: function()
    {
      self.state = 'hide';
      self.visible = false;

      // console.log('hide score');

      if(callback) callback();
    }})
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var ScoreCard = function(config)
{
  PIXI.Container.call(this);


  var self = this;

  this.type = config.type;
  this.panelScore = config.panelScore;

  var bgTexture = this.type == 'face'?assetsManager.getTexture('texture_atlas', 'card_score_face.png'):assetsManager.getTexture('texture_atlas', 'card_score_yellow.png');

  this.bg = new PIXI.Sprite(bgTexture);
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  if(this.type != 'face')
  {
    this.bgDark = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_score_back.png'));
    this.addChild(this.bgDark);
    this.bgDark.anchor.set(0.5, 0.5);
    this.bgDark.alpha = 0;  
  }

  this.border = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_score_border.png'));
  this.addChild(this.border);
  this.border.anchor.set(0.5, 0.5);
  this.border.alpha = 0;

  if(this.type == 'face')
  {
    this.textScore = Util.setParams(new Gui.TextBmp('',  constsManager.getData('text_configs/score_text')), {parent: this, aX:0.5, aY:0.5, x: -4, y: 14-20});
    this.textScore.alpha = 0;

    this.dificultyStars = new DificultyStars();
    this.addChild(this.dificultyStars);
    this.dificultyStars.setDificulty('easy');
  }

  this.visible = false;
}
ScoreCard.prototype = Object.create(PIXI.Container.prototype);
ScoreCard.prototype.constructor = ScoreCard;

ScoreCard.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'adding')
  {
    var card24 = data.card24;
    card24.addChild(this);
    this.x = 0;
    this.y = 0;

    this.visible = true;
    this.alpha = 0;
    this.scale.x = this.scale.y = 1.0;

    if(self.type == 'face')
    {
      this.textScore.alpha = 0;

      if(this.dificultyStars.visible) this.dificultyStars.alpha = 0;
    }
    else 
    {
      this.bgDark.alpha = 0;
    }

    this.border.alpha = 0;

    var targetScale = 2.54;

    TweenMax.to(this, 8/30, { alpha: 1.0, pixi: { scaleX: targetScale, scaleY: targetScale }, ease: Power2.easeOut, onComplete: function()
    {
      card24.visible = false;

      var p = new PIXI.Point(self.x, self.y);
      p = self.parent.toGlobal(p);
      p = self.panelScore.containerCards.toLocal(p);

      self.panelScore.containerCards.addChildAt(self, 0);
      self.x = p.x;
      self.y = p.y;

      var targetX = 0;
      if(self.type == 'back_2') targetX = -18*1;
      if(self.type == 'back_1') targetX = -18*2;
      if(self.type == 'back_0') targetX = -18*2;
      // targetX += 18;

      TweenMax.to(self, 10/30, { x: targetX-24, y: 0, rotation: -10.7 * Util.TO_RADIANS, pixi: { scaleX: 1.1, scaleY: 1.1 }, ease: Power1.easeIn, onComplete: function()
      {
        TweenMax.to(self, 4/30, { x: targetX, y: 0, rotation: 0, pixi: { scaleX: 1.0, scaleY: 1.0 }, ease: Power1.easeOut, onComplete: function()
        {
          if(callback) callback();
        }});

        if(self.type != 'face')
        {
          TweenMax.to(self.bgDark, 4/30, { alpha: 1, ease: Power1.easeOut });
        }
      }});

      TweenMax.to(self.border, 4/30, { alpha: 1.0, ease: Power1.easeOut, delay: 6/30 });

      if(self.type == 'back_2')
      {
        TweenMax.to(self.panelScore.containerCards, 10/30, { x: 9, ease: Power1.easeOut});
      }      
      if(self.type == 'back_1')
      {
        TweenMax.to(self.panelScore.containerCards, 10/30, { x: 18, ease: Power1.easeOut});
      }

      // if(self.type == 'face')
      // {
      //   TweenMax.to(self.textScore, 4/30, { alpha: 1.0, ease: Power1.easeOut, delay: 10/30 })
      // }
    }});
  }
}

// ======================================================================================================================================== //
var DificultyStars = function(config)
{
  PIXI.Container.call(this);


  this.star1 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dificulty_star.png'));
  this.addChild(this.star1);
  this.star1.anchor.set(0.5, 0.5);

  this.star2 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dificulty_star.png'));
  this.addChild(this.star2);
  this.star2.anchor.set(0.5, 0.5);

  this.star3 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'dificulty_star.png'));
  this.addChild(this.star3);
  this.star3.anchor.set(0.5, 0.5);

  this.star1.visible = false;
  this.star2.visible = false;
  this.star3.visible = false;
}
DificultyStars.prototype = Object.create(PIXI.Container.prototype);
DificultyStars.prototype.constructor = DificultyStars;

DificultyStars.prototype.setDificulty = function(dificulty)
{
  this.star1.visible = false;
  this.star2.visible = false;
  this.star3.visible = false;

  if(dificulty == 'easy')
  {
    this.star1.visible = true;
    this.star1.x = 0;
    this.star1.y = 0;
  }
  if(dificulty == 'medium')
  {
    this.star1.visible = true;
    this.star1.x = -22;
    this.star1.y = 0;   

    this.star2.visible = true;
    this.star2.x = 22;
    this.star2.y = 0;
  }  
  if(dificulty == 'hard')
  {
    this.star1.visible = true;
    this.star1.x = 0;
    this.star1.y = 0;   

    this.star2.visible = true;
    this.star2.x = -44;
    this.star2.y = 0;

    this.star3.visible = true;
    this.star3.x = 44;
    this.star3.y = 0;
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelTimer = function(config)
{
  config.width = 165;
  config.height = 200;  
  Gui.BasePanel.call(this, config);


  var self = this;

  this._arc = 1.0;
  Object.defineProperty(this, 'arc',
  {
    set: function(value)
    {
      if(value < 0) value = 0;
      if(value > 1.0) value = 1.0;

      self.updateArc(value);
    },
    get: function()
    {
      return this._arc;
    }
  });
  // this.arcSteps = 30;
  this.arcSteps = 0;

  // this.initBlockInputBg(5000, 5000, bind(function()
  // {

  // }, this));

  this.state = 'hide';

  this.container = new PIXI.Container();
  this.addChild(this.container);

  this.popupTime = new PopupTime();
  this.container.addChild(this.popupTime);

  this.containerClock = new PIXI.Container();
  this.container.addChild(this.containerClock);

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_timer_bg.png'));
  this.containerClock.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  this.bgBlitz = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_timer_bg_blitz.png'));
  this.containerClock.addChild(this.bgBlitz);
  this.bgBlitz.anchor.set(0.5, 0.5);
  this.bgBlitz.alpha = 0;

  this.graphics = new PIXI.Graphics();
  this.containerClock.addChild(this.graphics);
  this.graphics.y = 15.5;

  this.blink = new PanelsBlink({ mask: assetsManager.getTexture('texture_atlas', 'panel_timer_bg.png') });
  this.container.addChild(this.blink);

  this.textTimer = Util.setParams(new Gui.TextBmp('2:00',  constsManager.getData('text_configs/timer_text')), {parent: this.container, aX:0.5, aY:0.5, x: 0, y: 135});

  this.phase = 'none';

  this.baseTime = 0;
  this.time = 0;

  this.timeTween = null;
  this.tickTween = null;

  // function ttt()
  // {
  // TweenMax.delayedCall(30/30, function()
  // {
  //   self.blink.play({time: 20/30});

  //   TweenMax.delayedCall(30/30, function()
  //   {
  //     ttt();
  //   });
  // });
  // }
  // ttt();

  // function tweenArc()
  // {
  //   self.updateArc(1.0);
  //   TweenMax.to(self, 60.0, {arc: 0.0, ease: Power0.easeNone, delay: 3.0, onComplete: tweenArc});
  // }
  // tweenArc();

  this.visible = false;
}
PanelTimer.prototype = Object.create(Gui.BasePanel.prototype);
PanelTimer.prototype.constructor = PanelTimer;

PanelTimer.prototype.init = function(baseTime, isAnim)
{
  if(isAnim == undefined) isAnim = false;

  var self = this;

  this.phase = 'init';

  this.baseTime = baseTime;

  if(!isAnim) 
  {
    this.time = this.baseTime;
    this.updateTimeView();
  }
  else
  {
    // this.time = 0;
    var targetTime = this.baseTime;

    var obj = {time: this.time};
    this.timeTween = TweenMax.to(obj, 6/30, {time: targetTime, ease: Power0.easeNone, onUpdate: function()
    {
      var seconds = Math.ceil(obj.time);
      if(self.time != seconds)
      {
        self.time = seconds;
        self.updateTimeView();
        // if(seconds < 10) self.tweenTick();
      }
    }, 
    onComplete: function()
    {
      
    }});
  }
}
PanelTimer.prototype.start = function()
{
  this.phase = 'playing';

  this.startTimeTween();
}
PanelTimer.prototype.stop = function()
{
  if(this.phase != 'playing') return;

  this.phase = 'stop';

  if(this.timeTween != null)
  {
    this.timeTween.kill();
    this.timeTween = null;
  }
}

PanelTimer.prototype.addTime = function(bonusTime)
{
  var self = this;

  var isPlay = this.phase == 'playing';
  
  if(isPlay) this.stop();

  var targetTime = this.time + bonusTime;
  if(targetTime > this.baseTime) targetTime = this.baseTime;

  // this.time += bonusTime;
  // if(this.time > this.baseTime) this.time = this.baseTime;

  // this.updateTimeView();

  this.bonusTween();
  this.blink.play({time: 14/30});
  this.popupTime.show(bonusTime); 

  if(this.tickTween != null) 
  {
    this.tickTween.kill();
    this.tickTween = null;
  }

  var obj = {time: this.time};
  this.timeTween = TweenMax.to(obj, 6/30, {time: targetTime, ease: Power0.easeNone, onUpdate: function()
  {
    var seconds = Math.ceil(obj.time);
    if(self.time != seconds)
    {
      self.time = seconds;
      self.updateTimeView();
      // if(seconds < 10) self.tweenTick();
    }
  }, 
  onComplete: function()
  {
    if(isPlay) self.start();
  }});


  // function ttt()
  // {
  //   TweenMax.delayedCall(80/30, function()
  //   {
  //     self.addTime(20);
  //     // ttt();
  //   });
  // }
  // ttt();
  

  // TweenMax.to(this.containerClock.scale, 6/30, {x: 1.15, y: 1.15, ease: Power0.easeNone, onComplete: function()
  // {
  //   TweenMax.to(self.containerClock.scale, 4/30, {x: 1, y: 1, ease: Power2.easeOut});
  // }});

  // if(isPlay) this.start();
}

PanelTimer.prototype.startTimeTween = function()
{
  var self = this;

  if(this.timeTween != null)
  {
    this.timeTween.kill();
  }

  var obj = {time: this.time};
  this.timeTween = TweenMax.to(obj, obj.time, {time: 0, ease: Power0.easeNone, onUpdate: function()
  {
    var seconds = Math.ceil(obj.time);
    if(self.time != seconds)
    {
      self.time = seconds;
      self.updateTimeView();
      if(seconds < 10) self.tweenTick();
    }
  },
  onComplete: function()
  {
    // console.log('Tween complete!');
    self.emit('times_up');
  }});
}

PanelTimer.prototype.updateTimeView = function()
{
  var minutes = Math.floor(this.time / 60);
  var seconds = this.time - minutes * 60;

  this.textTimer.text = minutes + ':'+(seconds < 10?'0'+seconds:seconds);

  this.updateArc(this.time / this.baseTime);

  // console.log('Time:', minutes, seconds);
}

PanelTimer.prototype.tweenTick = function()
{
  var self = this;

  this.tickTween = TweenMax.to(this.containerClock.scale, 4/30, {x: 1.1, y: 1.1, ease: Power2.easeIn, onComplete: function()
  {
    self.tickTween = TweenMax.to(self.containerClock.scale, 4/30, {x: 1, y: 1, ease: Power2.easeOut});
  }});

  if(this.time < 1) return;

  app.screenGame.containerPulse.visible = true;
  app.screenGame.containerPulse.alpha = 0;

  app.screenGame.pulseBgNormal.visible = false;
  app.screenGame.pulseBgBlitz.visible = false;

  if(app.screenGame.blitzPhase == 'on') app.screenGame.pulseBgBlitz.visible = true;
  else app.screenGame.pulseBgNormal.visible = true;

  TweenMax.to(app.screenGame.containerPulse, 10/30, { alpha: 1, ease: Power2.easeOut, onComplete: function()
  {
    TweenMax.to(app.screenGame.containerPulse, 10/30, { alpha: 0, ease: Power2.easeOut, onComplete: function()
    {
      app.screenGame.containerPulse.visible = false;
    }});
  }});

  // console.log(this.time);
}

PanelTimer.prototype.bonusTween = function()
{
  var self = this;

  if(this.tickTween != null) 
  {
    this.tickTween.kill();
    this.tickTween = null;
  }

  TweenMax.to(this.containerClock.scale, 4/30, {x: 1.16, y: 1.16, ease: Power1.easeIn, onComplete: function()
  {
    TweenMax.to(self.containerClock.scale, 6/30, {x: 1, y: 1, ease: Power1.easeOut});
  }});
 
  // this.popupTime.show(20); 
}

PanelTimer.prototype.updateArc = function(value)
{
  this._arc = value;

  var a;

  if(this.arcSteps > 0)
  {
    var arcStep = 360 / this.arcSteps;
    var arcAngle = Math.floor(360*(1-value) / arcStep) * arcStep;

    a = -Math.PI / 2 + (arcAngle*Util.TO_RADIANS);
  }
  else a = -Math.PI / 2 + (360*(1-value)*Util.TO_RADIANS);

  // console.log(arcAngle);

  this.graphics.clear();
  if(value > 0)
  {
    this.graphics.beginFill(0xEAECF4);
    this.graphics.lineStyle(0, 0xffffff);
    this.graphics.moveTo(0, 0);
    
    if(value == 1 || a == -Math.PI/2)
    {
      // this.graphics.drawCircle(0, 0, 130/2);
      this.graphics.arc(0, 0, 135/2, -Math.PI/2, -Math.PI/2+2*Math.PI, false);
    }
    else this.graphics.arc(0, 0, 135/2, -Math.PI/2, a, true); // cx, cy, radius, startAngle, endAngle

    this.graphics.endFill();
    // this.graphics.addHole();

    // this.graphics.moveTo(0, 0);
    // this.graphics.beginFill(0x3E384D);
    // this.graphics.drawCircle(0, 0, (110-20)/2);
    // this.graphics.moveTo(0, 0);

    this.graphics.endFill();
  }
}

PanelTimer.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show')
  {
    this.visible = true;
    this.container.alpha = 0;
    this.container.x = -40;
    TweenMax.to(this.container, 8/30, { x: 0, alpha: 1, ease: Power2.easeOut, onComplete: function()
    {
      self.state = 'show';
      // console.log('timer show');

      if(callback) callback();
    }})
  }
  if(data.name == 'hide')
  {
    TweenMax.to(this.container, 8/30, { x: -40, alpha: 0, ease: Power2.easeOut, onComplete: function()
    {
      self.state = 'hide';
      self.visible = false;

      // console.log('timer hide');

      if(callback) callback();
    }})
  }
}