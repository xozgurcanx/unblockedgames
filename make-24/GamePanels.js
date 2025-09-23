var PanelSolution = function(config)
{
  config.width = 800;
  config.height = 800;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.initBlockInputBg(900, 900, function()
  {
    
  });
  this.invisibleBg.interactive = true;
  // this.invisibleBg.alpha = 0.5;

  this.state = 'hide';
  this.visible = false;

  this.type = 'none';

  // this.logo.height = 285;

  // var solutionCard = new SolutionCard({ type: 'card_24' });
  // this.addChild(solutionCard);

  this.containerSteps = new PIXI.Container();
  this.addChild(this.containerSteps);

  this.tweenContainerSteps = new PIXI.Container();
  this.containerSteps.addChild(this.tweenContainerSteps);

  this.labelSolution = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'label_solution.png'));
  this.tweenContainerSteps.addChild(this.labelSolution);
  this.labelSolution.anchor.set(0.5, 0.0);
  this.labelSolution.y = -200;

  this.solutionSteps = [];
  for(var i = 0; i < 3; i++)
  {
    var solutionStep = new SolutionStep({ stepN: i, parent: this.tweenContainerSteps, y: 135 + 135 * i - 200 });
    this.solutionSteps.push(solutionStep);
  }

  this.containerFieldCards = new PIXI.Container();
  this.tweenContainerSteps.addChild(this.containerFieldCards);

  this.fieldCard1 = new SolutionCard({ parent: this.containerFieldCards, x: -137/2-5, y: -116/2-5, type: 'card_red' });
  this.fieldCard2 = new SolutionCard({ parent: this.containerFieldCards, x: 137/2+5, y: -116/2-5, type: 'card_red' });
  this.fieldCard3 = new SolutionCard({ parent: this.containerFieldCards, x: -137/2-5, y: 116/2+5, type: 'card_red' });
  this.fieldCard4 = new SolutionCard({ parent: this.containerFieldCards, x: 137/2+5, y: 116/2+5, type: 'card_red' });
  this.fieldCards = [this.fieldCard1, this.fieldCard2, this.fieldCard3, this.fieldCard4];

  this.containerFieldCards.y = -330;
  this.containerFieldCards.scale.x = this.containerFieldCards.scale.y = 0.8;

  // this.containerSteps.y = -this.containerSteps.height/2;

    // var keyCode = letter.charCodeAt(0);
    // // console.log(keyCode);

    // var key = Util.keyboard(keyCode);
    // key.press = function()
    // {
    //   // console.log('KeyPress:', keyCode + ', ' + letter)
    //   app.screenGame.tryGuessLetter(letter);
    //   // app.screenGame.solved();
    // };

  // this.containerTitle = new Gui.BasePanel({parentPanel: this, positionType: 'center-top', width: 742, height: 142, xRelative: 0, yRelative: 0});
  // this.titleTimesUp = new PIXI.Container();
  // this.containerTitle.addChild(this.titleTimesUp);

  // this.titleTimesUpLabel = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'title_times_up.png'));
  // this.titleTimesUp.addChild(this.titleTimesUpLabel);
  // this.titleTimesUpLabel.anchor.set(0.5, 0.5);

  // this.titleTimesUpLabelBlitz = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'title_times_up_blitz.png'));
  // this.titleTimesUp.addChild(this.titleTimesUpLabelBlitz);
  // this.titleTimesUpLabelBlitz.anchor.set(0.5, 0.5);
  // this.titleTimesUpLabelBlitz.visible = false;

  this.containerButtonPlayAgain = new Gui.BasePanel({parentPanel: this, positionType: 'absolute', width: 559, height: 126, positionType: 'center-bot', xRelative: 0, yRelative: -40});

  this.buttonPlayAgain = Gui.createSimpleButton({name: 'button_play_again', parentPanel: this.containerButtonPlayAgain, width: 559, height: 126, x: 0, y: 0},
  {
    pathToSkin: 'button_play_again_0001.png',
    onClick: function()
    {
      if(self.state == 'show') 
      {
        TweenMax.delayedCall(6/30, function()
        {
          app.screenGame.playAgain();
        });

        app.playAudio('sounds', 'sound_play_button');

        app.apiCallback('start', null);
      }
    }
  }); 
  // this.buttonPlayAgain.isClickTween = false;
  this.buttonPlayAgain.isClickSound = false;
  app.setButtonHover(this.buttonPlayAgain, assetsManager.getTexture('texture_atlas', 'button_play_again_0001.png'), assetsManager.getTexture('texture_atlas', 'button_play_again_0002.png'));

  this.containerButtonBack = new Gui.BasePanel({parentPanel: this, positionType: 'absolute', width: 244, height: 126, positionType: 'center-bot', xRelative: -280, yRelative: -40});
  this.buttonBack = Gui.createSimpleButton({name: 'button_back', parentPanel: this.containerButtonBack, width: 244, height: 126, x: 0, y: 0},
  {
    pathToSkin: 'button_back_0001.png',
    onClick: function()
    {
      if(self.state == 'show') 
      {
        TweenMax.delayedCall(6/30, function()
        {
          self.tween({name: 'hide_anim'}, function()
          {
            app.screenGame.panelGameResult.tween({name: 'show_anim', type: 'again', score: app.screenGame.score, highScore: app.getHighScore()});
          });
        });
      }
    }
  }); 
  // this.buttonShowSolution.isClickTween = false;
  // this.buttonShowSolution.isClickSound = false;
  app.setButtonHover(this.buttonBack, assetsManager.getTexture('texture_atlas', 'button_back_0001.png'), assetsManager.getTexture('texture_atlas', 'button_back_0002.png'));
  // this.containerButtonBack.visible = false;

  guiManager.on('orientation_change', this.onOrientationChange, this);
  guiManager.on('game_resize', this.onGameResize, this);
}
PanelSolution.prototype = Object.create(Gui.BasePanel.prototype);
PanelSolution.prototype.constructor = PanelSolution;

PanelSolution.prototype.onOrientationChange = function(data)
{
  this.updatePanelPositions();
}

PanelSolution.prototype.onGameResize = function(data)
{
  this.updatePanelPositions();
}

PanelSolution.prototype.updatePanelPositions = function()
{
  var orientation = guiManager.orientation;
  var width = guiManager.rootScene.width;
  var height = guiManager.rootScene.height;

  if(orientation == 'portrait')
  { 
    this.width = width;
    this.height = 925;
  }  
  if(orientation == 'landscape')
  {
    this.width = 925;
    this.height = height;
  }

  this.invisibleBg.width = this.width;
  this.invisibleBg.height = this.height;

  // var centerHeight = this.height;
  // var centerY = -this.containerButtonPlayAgain.height;

  // if(this.type == 'times_up')
  // {
  //   this.containerTitle.yRelative = 0;
  //   this.centerHeight -= this.containerTitle.height;
  //   this.centerY += this.containerTitle.height;
  // }

  // this.containerSteps.y = centerY-this.containerSteps.height/2;

  // this.containerButtonPlayAgain.y = this.containerSteps.y+this.containerSteps.height/2 + (this.height - (this.containerSteps.y+this.containerSteps.height))/2;

  if(this.type == 'game_end')
  {
    // this.containerTitle.yRelative = 0;
    // this.containerSteps.y = -this.containerSteps.height/2 - 40;
    // this.containerButtonPlayAgain.y = this.height/2 - this.containerButtonPlayAgain.height/2 - 30;
  }
  else if(this.type == 'surrender')
  {
    // this.containerTitle.yRelative = 0;
    // this.containerSteps.y = -this.containerSteps.height/2 - 100;
    // this.containerButtonPlayAgain.y = this.height/2 - this.containerButtonPlayAgain.height/2 - 50;
  }
}

PanelSolution.prototype.createSolutionStep = function(x, y, stepN)
{
  var solutionStep = {};

  var contaner = new PIXI.Container();
  this.addChild(contaner);
  solutionStep.contaner = contaner;

  return solutionStep;
}

PanelSolution.prototype.setSolution = function(board)
{
  var solutionInfo = board.solution;

  for(var i = 0; i < solutionInfo.steps.length; i++)
  {
    this.solutionSteps[i].setStep(solutionInfo.steps[i]);
  }

  for(var i = 0; i < board.numbers.length; i++)
  {
    this.fieldCards[i].setNumber(board.numbers[i]);
  }

  // console.log(board);
}

PanelSolution.prototype.tween = function(data, callback)
{
  var self = this;

  var elemsShift = 200;

  var orientation = guiManager.orientation;

  if(data.name == 'show_anim' && this.state == 'hide')
  {
    this.state = 'show_anim';

    this.visible = true;
    this.alpha = 1;

    this.type = data.type;
    this.updatePanelPositions();

    var time = 10/30;
    var showDelay = 0/30;

    if(this.type == 'game_end')
    {
      this.containerButtonBack.visible = true;

      this.containerButtonBack.xRelative = -280;
      this.containerButtonPlayAgain.xRelative = 150;

      this.buttonBack.y = elemsShift;
      this.buttonBack.alpha = 0;
      TweenMax.to(this.buttonBack, time, { alpha: 1, x: 0, y: 0, ease: Power2.easeOut });
    }
    else 
    {
      this.containerButtonPlayAgain.xRelative = 0;

      this.containerButtonBack.visible = false;
    }

    this.tweenContainerSteps.y = -elemsShift;
    this.tweenContainerSteps.alpha = 0;
    TweenMax.to(this.tweenContainerSteps, time, { alpha: 1, x: 0, y: 0, ease: Power2.easeOut });

    this.buttonPlayAgain.y = elemsShift;
    this.buttonPlayAgain.alpha = 0;
    TweenMax.to(this.buttonPlayAgain, time, { alpha: 1, x: 0, y: 0, ease: Power2.easeOut });

    // if(orientation == 'landscape')
    // {

    // }

    TweenMax.delayedCall(time, function()
    {
      self.tween({name: 'show'}, callback);
    });

    if(data.solution != undefined) this.setSolution(data.solution);
  }

  if(data.name == 'hide_anim' && this.state == 'show')
  {
    this.state = 'hide_anim';
    this.interactiveChildren = false;

    var time = 10/30;

    if(this.type == 'game_end')
    {
      TweenMax.to(this.buttonBack, time, { alpha: 0, x: 0, y: elemsShift, ease: Power2.easeOut });
    }

    TweenMax.to(this.tweenContainerSteps, time, { alpha: 0, x: 0, y: -elemsShift, ease: Power2.easeOut });

    TweenMax.to(this.buttonPlayAgain, time, { alpha: 0, x: 0, y: elemsShift, ease: Power2.easeOut });

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
var SolutionCard = function(config)
{
  PIXI.Container.call(this);


  var self = this;

  this.type = 'card_red';
  if(config != undefined) 
  {
    if(config.type != undefined) this.type = config.type;
    if(config.x != undefined) this.x = config.x;
    if(config.y != undefined) this.y = config.y;
    if(config.parent != undefined) config.parent.addChild(this);
  }

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_small_red.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  if(this.type == 'card_24')
  {
    this.bg.texture = assetsManager.getTexture('texture_atlas', 'card_small_24.png');
  }

  // console.log(this.type);

  this.number = new CardNumber();
  this.addChild(this.number);
  this.number.scale.x = this.number.scale.y = 0.45;

  // this.setNumber(6);
}
SolutionCard.prototype = Object.create(PIXI.Container.prototype);
SolutionCard.prototype.constructor = SolutionCard;

SolutionCard.prototype.setNumber = function(number)
{
  this.number.setNumber(new NumberData(number, 1));
}
// ======================================================================================================================================== //
var SolutionStep = function(config)
{
  PIXI.Container.call(this);


  var self = this;

  this.stepN = config.stepN;

  this.y = config.y;
  config.parent.addChild(this);

  this.cardNumber1 = new SolutionCard({ parent: this, x: -240, y: 0, type: 'card_red' });
  this.cardNumber2 = new SolutionCard({ parent: this, x: 20, y: 0, type: 'card_red' });
  this.cardNumberResult = (this.stepN == 2)?new SolutionCard({ parent: this, x: 240, y: 0, type: 'card_24' }):new SolutionCard({ parent: this, x: 240, y: 0, type: 'card_red' });

  this.operation = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'button_operation_plus_0001.png'));
  this.addChild(this.operation);
  this.operation.anchor.set(0.5, 0.5);
  this.operation.x = -110;
  this.operation.scale.x = this.operation.scale.y = 0.56;

  this.equal = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'operation_equal.png'));
  this.addChild(this.equal);
  this.equal.anchor.set(0.5, 0.5);
  this.equal.x = 129;
}
SolutionStep.prototype = Object.create(PIXI.Container.prototype);
SolutionStep.prototype.constructor = SolutionStep;

SolutionStep.prototype.setStep = function(stepInfo)
{
  // console.log(stepInfo);

  this.cardNumber1.setNumber(stepInfo.number1);
  this.cardNumber2.setNumber(stepInfo.number2);

  if(this.stepN < 2) this.cardNumberResult.setNumber(stepInfo.result);

  var operationTexture = 'none';
  if(stepInfo.operation == '+') operationTexture = 'button_operation_plus_0001.png';
  else if(stepInfo.operation == '*') operationTexture = 'button_operation_multiply_0001.png';
  else if(stepInfo.operation == '-') operationTexture = 'button_operation_minus_0001.png';
  else if(stepInfo.operation == '/') operationTexture = 'button_operation_divide_0001.png';

  this.operation.texture = assetsManager.getTexture('texture_atlas', operationTexture);

  // this.number.setNumber(new NumberData(number, 1));
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelGameResult = function(config)
{
  Gui.BasePanel.call(this, config);


  var self = this;

  this.state = 'hide';

  // this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_tutorial_bg.png'));
  // this.addChild(this.bg);
  // this.bg.anchor.set(0.5, 0.5);

  this.containerTitle = new Gui.BasePanel({parentPanel: this, positionType: 'center-top', width: 742, height: 142, xRelative: 0, yRelative: 0});

  this.title = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'label_end_new_record.png'));
  this.containerTitle.addChild(this.title);
  this.title.anchor.set(0.5, 0.5);
  this.title.scale.x = this.title.scale.y = 1.15;

  this.scoreStackYou = new ScoreStack({type: 'you'});
  this.addChild(this.scoreStackYou);
  this.scoreStackYou.x = -150;
  this.scoreStackYou.y = -60;

  this.scoreStackHigh = new ScoreStack({type: 'high'});
  this.addChild(this.scoreStackHigh);
  this.scoreStackHigh.x = 190;
  this.scoreStackHigh.y = 150;

  this.containerButtonPlayAgain = new Gui.BasePanel({parentPanel: this, positionType: 'absolute', width: 495, height: 126, positionType: 'center-bot', xRelative: 150, yRelative: -40});
  // this.containerButtonPlayAgain.scale.x = this.containerButtonPlayAgain.scale.y = 0.88;

  this.buttonPlayAgain = Gui.createSimpleButton({name: 'button_play_again', parentPanel: this.containerButtonPlayAgain, width: 559, height: 142, x: 0, y: 0},
  {
    pathToSkin: 'button_play_again_0001.png',
    onClick: function()
    {
      if(self.state == 'show') 
      {
        TweenMax.delayedCall(6/30, function()
        {
          app.screenGame.playAgain();
        });

        app.playAudio('sounds', 'sound_play_button');

        app.apiCallback('start', null);
      }
    }
  }); 
  // this.buttonPlayAgain.isClickTween = false;
  this.buttonPlayAgain.isClickSound = false;
  app.setButtonHover(this.buttonPlayAgain, assetsManager.getTexture('texture_atlas', 'button_play_again_0001.png'), assetsManager.getTexture('texture_atlas', 'button_play_again_0002.png'));
  
  this.containerButtonShowSolution = new Gui.BasePanel({parentPanel: this, positionType: 'absolute', width: 244, height: 126, positionType: 'center-bot', xRelative: -280, yRelative: -40});
  this.buttonShowSolution = Gui.createSimpleButton({name: 'button_show_solution', parentPanel: this.containerButtonShowSolution, width: 244, height: 126, x: 0, y: 0},
  {
    pathToSkin: 'button_show_solution_0001.png',
    onClick: function()
    {
      if(self.state == 'show') 
      {
        TweenMax.delayedCall(6/30, function()
        {
          self.tween({name: 'hide_anim'}, function()
          {
            app.screenGame.panelSolution.tween({name: 'show_anim', type: 'game_end', solution: app.screenGame.board});
          });
        });
      }
    }
  }); 
  // this.buttonShowSolution.isClickTween = false;
  // this.buttonShowSolution.isClickSound = false;
  app.setButtonHover(this.buttonShowSolution, assetsManager.getTexture('texture_atlas', 'button_show_solution_0001.png'), assetsManager.getTexture('texture_atlas', 'button_show_solution_0002.png'));

  this.visible = false;

  guiManager.on('orientation_change', this.onOrientationChange, this);
  guiManager.on('game_resize', this.onGameResize, this);
}
PanelGameResult.prototype = Object.create(Gui.BasePanel.prototype);
PanelGameResult.prototype.constructor = PanelGameResult;

PanelGameResult.prototype.onOrientationChange = function(data)
{
  this.updatePanelPositions();
}

PanelGameResult.prototype.onGameResize = function(data)
{
  this.updatePanelPositions();
}

PanelGameResult.prototype.updatePanelPositions = function()
{
  var orientation = guiManager.orientation;
  var width = guiManager.rootScene.width;
  var height = guiManager.rootScene.height;

  if(orientation == 'portrait')
  { 
    this.width = width;
    this.height = 925;
  }  
  if(orientation == 'landscape')
  {
    this.width = 925;
    this.height = height;
  }
}

PanelGameResult.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim')
  {
    this.state = 'to_show';

    var youScore = data.score;
    var highScore = data.highScore;

    var tweenScoreFrames = Math.round(youScore * 1.8);

    var titleTexture;
    if(app.screenGame.isHighScoreUp) titleTexture = assetsManager.getTexture('texture_atlas_2', 'label_end_new_record.png');
    else if(youScore == 0) titleTexture = assetsManager.getTexture('texture_atlas_2', 'label_end_game_over.png');
    else if(app.screenGame.isHighScoreEqual && youScore == highScore) titleTexture = assetsManager.getTexture('texture_atlas_2', 'label_end_almost_there.png');
    else if(youScore >= highScore*0.5) titleTexture = assetsManager.getTexture('texture_atlas_2', 'label_end_nice_job.png');
    else titleTexture = assetsManager.getTexture('texture_atlas_2', 'label_end_good_try.png');
    this.title.texture = titleTexture;

    this.visible = true;

    this.alpha = 1;

    this.scoreStackYou.visible = false;
    this.scoreStackHigh.visible = false;
    this.buttonShowSolution.visible = false;
    this.buttonPlayAgain.visible = false;

    this.title.x = 0;
    this.title.y = -100;
    this.title.alpha = 0;

    TweenMax.to(this.title, 10/30, { y: 0, alpha: 1.0, ease: Power1.easeOut });

    var buttonsDelay = 0;

    if(youScore > 0)
    {
      TweenMax.delayedCall(10/30, function()
      {
        self.scoreStackYou.x = -130-100;
        self.scoreStackYou.y = -60;
        self.scoreStackYou.visible = true;
        self.scoreStackYou.alpha = 0;
        
        // self.scoreStackYou.scale.x = self.scoreStackYou.scale.y = 1.15;

        TweenMax.to(self.scoreStackYou, 12/30, { x: -110, alpha: 1.0, ease: Power1.easeOut });

        self.scoreStackYou.initBg('full');
        self.scoreStackYou.setScore(0);
        TweenMax.delayedCall(8/30, function()
        {        
          self.scoreStackYou.tweenScoreTo(youScore, tweenScoreFrames/30);

          // console.log('daaa:', data);
          if(data.type != 'again') app.screenGame.playSalut(7, true);
        });

        // self.scoreStackYou.playTear();
      });

      TweenMax.delayedCall((18 + tweenScoreFrames + 2)/30, function()
      {
        self.scoreStackHigh.x = 230+100;
        self.scoreStackHigh.y = 165;
        self.scoreStackHigh.visible = true;
        self.scoreStackHigh.alpha = 0;
        self.scoreStackHigh.scale.x = self.scoreStackHigh.scale.y = 1.15;

        TweenMax.to(self.scoreStackHigh, 12/30, { x: 230, alpha: 1.0, ease: Power1.easeOut });

        self.scoreStackHigh.setScore(highScore);
      });

      buttonsDelay = (18 + tweenScoreFrames + 2 + 12 + 2)/30;
    }
    else
    {
      TweenMax.delayedCall(10/30, function()
      {
        self.scoreStackYou.x = 0-100;
        self.scoreStackYou.y = 0;
        self.scoreStackYou.visible = true;
        self.scoreStackYou.alpha = 0;

        self.scoreStackYou.scale.x = self.scoreStackYou.scale.y = 1.0;
        
        TweenMax.to(self.scoreStackYou, 12/30, { x: 0, alpha: 1.0, ease: Power1.easeOut });

        self.scoreStackYou.initBg('zero');
        self.scoreStackYou.setScore(0);
        // TweenMax.delayedCall(8/30, function()
        // {        
          // self.scoreStackYou.tweenScoreTo(youScore, tweenScoreFrames/30);

          // app.screenGame.playSalut();
        // });

        // self.scoreStackYou.playTear();
      });

      buttonsDelay = (18 + tweenScoreFrames + 2)/30;
    }

    TweenMax.delayedCall(buttonsDelay, function()
    {
      self.buttonShowSolution.visible = true;
      self.buttonShowSolution.alpha = 0;
      self.buttonShowSolution.y = 100;
      TweenMax.to(self.buttonShowSolution, 8/30, { y: 0, alpha: 1, ease: Power1.easeOut});     

      self.buttonPlayAgain.visible = true;
      self.buttonPlayAgain.alpha = 0;
      self.buttonPlayAgain.y = 100;
      TweenMax.to(self.buttonPlayAgain, 8/30, { y: 0, alpha: 1, ease: Power1.easeOut});

      TweenMax.delayedCall(8/30, function()
      {
        self.state = 'show';

        if(callback) callback();
      });
    });
  }
  else if(data.name == 'hide_anim')
  {
    self.state = 'to_hide';

    TweenMax.to(this.title, 10/30, { y: -200, alpha: 0.0, ease: Power2.easeOut });

    TweenMax.to(self.scoreStackYou, 10/30, { y: -60+200, alpha: 0, ease: Power2.easeOut});
    TweenMax.to(self.scoreStackHigh, 10/30, { y: 150+200, alpha: 0, ease: Power2.easeOut});

    TweenMax.to(self.buttonShowSolution, 10/30, { y: 200, alpha: 0, ease: Power2.easeOut});
    TweenMax.to(self.buttonPlayAgain, 10/30, { y: 200, alpha: 0, ease: Power2.easeOut});

    app.screenGame.hideSalut();

    TweenMax.delayedCall(10/30, function()
    {
      self.state = 'hide';
      self.visible = false;

      self.scoreStackYou.clear();

      if(callback) callback();
    });
  }
}
// ======================================================================================================================================== //
var ScoreStack = function(config)
{
  PIXI.Container.call(this);


  var self = this;

  this.type = config.type;

  this.score = 0;

  if(this.type == 'you')
  {
    // this.labelBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'bg_purple.png'));
    // this.addChild(this.labelBg);
    // this.labelBg.anchor.set(0.5, 0.5);
    // this.labelBg.width = 338;
    // this.labelBg.height = 140;
    // this.labelBg.y = -140;

    this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'score_stack_bg.png'));
    this.addChild(this.bg);
    this.bg.anchor.set(0.5, 0.5);   
    // this.bg.visible = false;

    this.bg0 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'scored_0_bg.png'));
    this.addChild(this.bg0);
    this.bg0.anchor.set(0.5, 0.5);   

    this.label = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'label_you_scored.png'));
    this.addChild(this.label);
    this.label.anchor.set(0.5, 0.5);
    this.label.x = 0;
    this.label.y = -this.bg.height/2 - this.label.height/2 - 10;

    this.textScore = Util.setParams(new Gui.TextBmp('',  constsManager.getData('text_configs/score_stack_you')), {parent: this, aX:0.5, aY:0.5, x: 25, y: 35});


    this.tears = [];
    for(var i = 0; i < 4; i++)
    {
      var tear = new FBFAnimation();
      this.addChild(tear);
      tear.addSequence('star', 'texture_atlas', 'CardTear/frame_', 1, 11, 30, { x: -63/2, y: -82/2, loop: false });
      tear.switchSequence('star');
      tear.visible = false;

      this.tears.push(tear);
    }

    this.scale.x = this.scale.y = 1.15;
  }

  if(this.type == 'high')
  {
    // this.labelBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'bg_purple.png'));
    // this.addChild(this.labelBg);
    // this.labelBg.anchor.set(0.5, 0.5);
    // this.labelBg.width = 148;
    // this.labelBg.height = 60;
    // this.labelBg.y = -80;

    this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'high_score_bg.png'));
    this.addChild(this.bg);
    this.bg.anchor.set(0.5, 0.5);

    // this.bg.scale.x = this.bg.scale.y = 0.67;

    this.label = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'label_high_score.png'));
    this.addChild(this.label);
    this.label.anchor.set(0.5, 0.5);
    this.label.x = 0;
    this.label.y = -this.bg.height/2 - this.label.height/2 - 7;

    this.textScore = Util.setParams(new Gui.TextBmp('',  constsManager.getData('text_configs/score_stack_high')), {parent: this, aX:0.5, aY:0.5, x: 0, y: 20});
  }

  // this.dot = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'button_operation_minus_0001.png'));
  // this.addChild(this.dot);
  // this.dot.anchor.set(0.5, 0.5);

  // this.visible = false;
}
ScoreStack.prototype = Object.create(PIXI.Container.prototype);
ScoreStack.prototype.constructor = ScoreStack;

ScoreStack.prototype.clear = function()
{
  if(this.type == 'you')
  {
    for(var i = 0; i < this.tears.length; i++)
    {
      if(this.tears[i].visible)
      {
        this.tears[i].visible = false;
        this.tears[i].stop();
      }
    }

    TweenMax.killDelayedCallsTo(this.playTear);
  }
}

// ScoreStack.prototype.playTears = function()
// {
//   this.playTear();
// }

ScoreStack.prototype.playTear = function()
{
  var tear = null;
  for(var i = 0; i < this.tears.length; i++)
  {
    if(!this.tears[i].visible)
    {
      tear = this.tears[i];
      break;
    }
  }

  if(tear != null)
  {
    tear.visible = true;
    tear.scale.x = tear.scale.y = Util.randomRangeInt(6, 12) / 10;
    tear.x = Util.randomRangeInt(-85, 150);
    tear.y = Util.randomRangeInt(-85, 85);

    tear.gotoAndPlay(1);
    TweenMax.delayedCall(12/30, function()
    {
      tear.visible = false;
    });

    TweenMax.delayedCall(Util.randomRangeInt(20,35) / 30, this.playTear, [], this);
  }

  // console.log('play tear');
}

ScoreStack.prototype.setScore = function(score)
{
  this.score = score;

  this.textScore.text = '' + this.score;
}

ScoreStack.prototype.initBg = function(name)
{
  if(name == 'full')
  {
    this.bg.visible = true;
    // this.labelBg.visible = true;
    this.textScore.visible = true;

    this.bg0.visible = false;
  }
  else if(name == 'zero')
  {
    this.bg.visible = false;
    // this.labelBg.visible = false;
    this.textScore.visible = false;

    this.bg0.visible = true;
  }
}

ScoreStack.prototype.tweenScoreTo = function(score, time)
{
  var self = this;

  var obj = { value: this.score };
  TweenMax.to(obj, time, { value: score, ease: Power0.easeNone, onUpdate: function()
  {
    var s = Math.ceil(obj.value);
    if(self.score != s) self.setScore(s);
  },
  onComplete: function()
  {

  }});

  // TweenMax.to(this.textScore.scale, time*0.8, { x: 1.2, y: 1.2, ease: Power1.easeOut, onComplete: function()
  // {
  //   TweenMax.to(self.textScore.scale, time*0.2, { x: 1.0, y: 1.0, ease: Power1.easeInt, onComplete: function()
  //   {

  //   }});
  // }});
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelDialog = function(config)
{
  config.width = 654;
  config.height = 500;
  Gui.BasePanel.call(this, config);


  var self = this;

  // this.initBlockInputBg(900, 900, function()
  // {
    
  // });
  // this.invisibleBg.interactive = true;
  // this.invisibleBg.alpha = 0.5;

  this.state = 'hide';
  this.visible = false;

  this.type = 'none';

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panels_blue_bg.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);
  this.bg.width = this.width;
  this.bg.height = this.height;

  this.labelHome = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'label_leave.png'));
  this.addChild(this.labelHome);
  this.labelHome.anchor.set(0.5, 0.5);
  this.labelHome.x = 0;
  this.labelHome.y = -60+15;

  this.labelSurrender = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'label_surrender.png'));
  this.addChild(this.labelSurrender);
  this.labelSurrender.anchor.set(0.5, 0.5);
  this.labelSurrender.x = 0;
  this.labelSurrender.y = -60+15;

  this.buttonYes = Gui.createSimpleButton({name: 'button_yes', parentPanel: this, width: 262, height: 112, x: 160, y: 140+15},
  {
    pathToSkin: 'button_yes_0001.png',
    onClick: function()
    {
      if(self.state == 'show') 
      {
        TweenMax.delayedCall(6/30, function()
        {
          self.tween({name: 'hide_anim'}, function()
          {
            if(self.type == 'leave') app.screenGame.leave();
            else if(self.type == 'surrender') app.screenGame.surrender();
          });
        });
      }
    }
  }); 
  app.setButtonHover(this.buttonYes, assetsManager.getTexture('texture_atlas', 'button_yes_0001.png'), assetsManager.getTexture('texture_atlas', 'button_yes_0002.png'));

  this.buttonNo = Gui.createSimpleButton({name: 'button_no', parentPanel: this, width: 262, height: 112, x: -160, y: 140+15},
  {
    pathToSkin: 'button_no_0001.png',
    onClick: function()
    {
      if(self.state == 'show') 
      {
        TweenMax.delayedCall(6/30, function()
        {
          self.tween({name: 'hide_anim'}, function()
          {
            app.screenGame.continueGame();
          });
        });
      }
    }
  }); 
  app.setButtonHover(this.buttonNo, assetsManager.getTexture('texture_atlas', 'button_no_0001.png'), assetsManager.getTexture('texture_atlas', 'button_no_0002.png'));

  this.buttonClose = Gui.createSimpleButton({name: 'button_close', parentPanel: this, width: 96, height: 96, positionType: 'right-top', xRelative: 0, yRelative: 0},
  {
    pathToSkin: 'button_close_0001.png',
    onClick: function()
    {
      if(self.state == 'show' && self.buttonClose.isCanClick) 
      {
        var skin = self.buttonClose.icon;

        skin.scale.x = skin.scale.y = 1;
        // TweenMax.killTweensOf(text.scale);
        TweenMax.to(skin.scale, 3/30, {x: 0.8, y: 0.8, ease: Power2.easeOut, onComplete: function()
        {
          TweenMax.to(skin.scale, 3/30, {x: 1, y: 1, ease: Power2.easeOut, onComplete: function()
          {
            self.buttonClose.isCanClick = true;
          }});
        }});

        TweenMax.delayedCall(6/30, function()
        {
          self.tween({name: 'hide_anim'}, function()
          {
            app.screenGame.continueGame();
          });
        });

        self.buttonClose.isCanClick = false;

        app.playAudio('sounds', 'sound_click');
      }
    }
  }); 
  app.setButtonHover(this.buttonClose, assetsManager.getTexture('texture_atlas', 'button_close_0001.png'), assetsManager.getTexture('texture_atlas', 'button_close_0002.png'));
  this.buttonClose.isClickTween = false;
  self.buttonClose.isCanClick = true;
  this.buttonClose.isClickSound = false;

  this.buttonClose.icon = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'button_close.png'));
  this.buttonClose.addChild(this.buttonClose.icon);
  this.buttonClose.icon.anchor.set(0.5, 0.5);

  guiManager.on('orientation_change', this.onOrientationChange, this);
  guiManager.on('game_resize', this.onGameResize, this);
}
PanelDialog.prototype = Object.create(Gui.BasePanel.prototype);
PanelDialog.prototype.constructor = PanelDialog;

PanelDialog.prototype.onOrientationChange = function(data)
{
  
}

PanelDialog.prototype.onGameResize = function(data)
{
  
}

PanelDialog.prototype.tween = function(data, callback)
{
  var self = this;

  var elemsShift = 200;

  var orientation = guiManager.orientation;

  if(data.name == 'show_anim' && this.state == 'hide')
  {
    this.state = 'show_anim';

    this.visible = true;

    this.type = data.type;

    this.labelSurrender.visible = false;
    this.labelHome.visible = false;

    if(this.type == 'leave')
    {
      this.labelHome.visible = true;
    }
    else if(this.type == 'surrender')
    {
      this.labelSurrender.visible = true;
    }

    var time = 8/30;
    var showDelay = 0/30;

    TweenMax.to(app.screenGame.boardOver, time, { alpha: 1.0, ease: Power2.easeOut });


    this.y = -90-100;
    TweenMax.to(this, time, { alpha: 1, x: 0, y: -90, ease: Power2.easeOut });

    TweenMax.delayedCall(time, function()
    {
      self.tween({name: 'show'}, callback);
    });
  }

  if(data.name == 'hide_anim' && this.state == 'show')
  {
    this.state = 'hide_anim';

    this.interactiveChildren = false;

    var time = 8/30;
    var showDelay = 0/30;

    TweenMax.to(app.screenGame.boardOver, time, { alpha: 0.0, ease: Power2.easeOut });

    TweenMax.to(this, time, { alpha: 0.0, x: 0, y: -90-100, ease: Power2.easeOut });

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
var PanelOperations = function(config)
{
  Gui.BasePanel.call(this, config);


  var self = this;

  this.field = config.field;

  // this.initBlockInputBg(5000, 5000, bind(function()
  // {

  // }, this));

  this.state = 'show';

  this.buttonOperationWidth = 144;
  this.buttonOperationHeight = 154;
  this.buttonOperationShift = 50;
  
  this.buttonOperationPlus = this.createOperationButton(-this.buttonOperationWidth*1.5 - this.buttonOperationShift*1.5, 0, 'plus');  
  this.buttonOperationMinus = this.createOperationButton(-this.buttonOperationWidth*0.5 - this.buttonOperationShift*0.5, 0, 'minus');
  this.buttonOperationMultiply = this.createOperationButton(this.buttonOperationWidth*0.5 + this.buttonOperationShift*0.5, 0, 'multiply');
  this.buttonOperationDivide = this.createOperationButton(this.buttonOperationWidth*1.5 + this.buttonOperationShift*1.5, 0, 'divide');

  this.operations = 
  {
    multiply: this.buttonOperationMultiply,
    plus: this.buttonOperationPlus,
    divide: this.buttonOperationDivide,
    minus: this.buttonOperationMinus
  };

  this.buttonsOperations = [this.buttonOperationMultiply, this.buttonOperationPlus, this.buttonOperationDivide, this.buttonOperationMinus];

  this.deactivate();
}
PanelOperations.prototype = Object.create(Gui.BasePanel.prototype);
PanelOperations.prototype.constructor = PanelOperations;

PanelOperations.prototype.createOperationButton = function(x, y, operation)
{
  var self = this;

  var button = Gui.createSimpleButton({name: 'button_'+operation, parentPanel: this, width: this.buttonOperationWidth, height: this.buttonOperationHeight, x: x, y: y},
  {
    pathToSkin: 'button_operation_'+operation+'_0001.png',
    onClick: function()
    {
      self.field.playerSelectOperation(operation);

      app.playAudio('sounds', 'sound_card_click');
    }
  }); 
  button.operation = operation;
  button.isClickSound = false;
  button.isClickTween = false;

  return button;
}

PanelOperations.prototype.findButtonOperation = function(operation)
{
  for(var i = 0; i < this.buttonsOperations.length; i++)
  {
    var button = this.buttonsOperations[i];
    if(button.operation == operation) return button;
  }

  return null;
}

PanelOperations.prototype.selectOperation = function(operation)
{
  var operationButton = null;
  // console.log(this.buttonsOperations);
  for(var i = 0; i < this.buttonsOperations.length; i++)
  {
    var button = this.buttonsOperations[i];
    
    if(button.operation != operation) button.skin.texture = assetsManager.getTexture('texture_atlas', 'button_operation_'+button.operation+'_0002.png');
    else 
    {
      operationButton = button;
    }
  }

  operationButton.skin.texture = assetsManager.getTexture('texture_atlas', 'button_operation_'+operationButton.operation+'_0001.png');
  operationButton.scale.x = operationButton.scale.y = 1;
  operationButton.isCanClick = false;
    // TweenMax.killTweensOf(text.scale);
  TweenMax.to(operationButton.scale, 3/30, {x: 0.8, y: 0.8, ease: Power2.easeOut, onComplete: function()
  {
    TweenMax.to(operationButton.scale, 3/30, {x: 1, y: 1, ease: Power2.easeOut, onComplete: function()
    {
      operationButton.isCanClick = true;
    }});
  }});
}

PanelOperations.prototype.deselectAll = function()
{
  for(var i = 0; i < this.buttonsOperations.length; i++)
  {
    var button = this.buttonsOperations[i];
    var operation = button.operation;
    button.skin.texture = assetsManager.getTexture('texture_atlas', 'button_operation_'+operation+'_0001.png');
  }
}

PanelOperations.prototype.activate = function()
{
  this.interactive = true;
  this.interactiveChildren = true;

  // for(var i = 0; i < this.buttonsOperations.length; i++)
  // {
  //   var button = this.buttonsOperations[i];
  //   button.interactive = true;
  // }
}
PanelOperations.prototype.deactivate = function()
{
  this.interactive = false;
  this.interactiveChildren = false;

  for(var i = 0; i < this.buttonsOperations.length; i++)
  {
    var button = this.buttonsOperations[i];
    var operation = button.operation;
    button.skin.texture = assetsManager.getTexture('texture_atlas', 'button_operation_'+operation+'_0002.png');
  }
}
PanelOperations.prototype.reset = function()
{
  this.deactivate();

  for(var i = 0; i < this.buttonsOperations.length; i++)
  {
    var button = this.buttonsOperations[i];
    // console.log(button.scale.x, button.scale.y);
    button.scale.x = button.scale.y = 1.0;
    button.isCanClick = true;
  }  
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var StarsSplash = function(config)
{
  PIXI.Container.call(this);


  var self = this;

  this.stars = [];

  this.type = config.type;

  if(this.type == 'circle')
  {
    this.createStarsCircle(config.starsCount);
  }
  else if(this.type == 'fbf')
  {
    this.starsSplash = new FBFAnimation();
    this.addChild(this.starsSplash);
    this.starsSplash.scale.x = this.starsSplash.scale.y = 1.9;
    this.starsSplash.addSequence('star', 'texture_atlas_2', 'StarsSplash/frame_', 1, 15, 30, { x: -260/2, y: -265/2, loop: false });
    this.starsSplash.switchSequence('star');
  }

  this.visible = false;

  // this.createStarsCircle(14);

  // function ttt()
  // {
  //   self.play(null, ttt);
  // }
  // ttt();
}
StarsSplash.prototype = Object.create(PIXI.Container.prototype);
StarsSplash.prototype.constructor = StarsSplash;

StarsSplash.prototype.createStarsCircle = function(count)
{
  var rotShift = 360/count;

  var L = count * 20;
  var radius = L / (2*Math.PI);
  // console.log('Radius:', radius);
  // radius = 5;

  for(var i = 0; i < count; i++)
  {
    var rotation = -90+rotShift*i;
    var position = Util.getMoveVector(radius, rotation);
    var star = this.createStar(position.x, position.y, rotation+90, 1.5);
  }
}

StarsSplash.prototype.createStar = function(x, y, rotation, scale)
{
  if(scale == undefined) scale = 1.0;

  var star = new FBFAnimation();
  this.addChild(star);
  star.scale.x = star.scale.y = scale;
  star.addSequence('star', 'texture_atlas', 'Star/frame_', 1, 13, 30, { x: -40/2, y: -130, loop: false });
  star.switchSequence('star');

  star.x = x;
  star.y = y;
  star.rotation = rotation * Util.TO_RADIANS;

  this.stars.push(star);

  return star;
}

StarsSplash.prototype.play = function(data, callback)
{
  var self = this;

  this.visible = true;

  var isStopLast = (data != undefined && data.isStopLast != undefined)?data.isStopLast:false;

  var playTime;
  if(this.type == 'circle')
  {
    playTime = 15/30;

    for(var i = 0; i < this.stars.length; i++)
    {
      var star = this.stars[i];
      star.gotoAndPlay(1);

      if(isStopLast) requestStopLast(star);
    }

    TweenMax.delayedCall(playTime, function()
    {
      if(!isStopLast) self.clear();

      if(callback) callback();
    });

    // this.scale.x = this.scale.y = 
  }
  else if(this.type == 'fbf')
  {
    playTime = 18/30;

    this.starsSplash.gotoAndPlay(1);

    TweenMax.delayedCall(playTime, function()
    {
      self.clear();

      if(callback) callback();
    });
  }

  function requestStopLast(star)
  {
    star.once('star_frame_6', function(data)
    {
      star.stop();
    });
  }
}

StarsSplash.prototype.clear = function()
{
  this.visible = false;

  if(this.type == 'circle')
  {
    playTime = 15/30;

    for(var i = 0; i < this.stars.length; i++)
    {
      var star = this.stars[i];
      star.removeAllListeners();
      star.gotoAndStop(1);
    }
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PopupTime = function(config)
{
  PIXI.Container.call(this);


  var self = this;

  this.bgH = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'popup_time_h.png'));
  this.addChild(this.bgH);
  this.bgH.anchor.set(0.5, 0.5);

  this.bgV = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'popup_time_v.png'));
  this.addChild(this.bgV);
  this.bgV.anchor.set(0.5, 0.5);
  this.bgV.scale.y = -1;

  this.textTime = Util.setParams(new Gui.TextBmp('',  constsManager.getData('text_configs/popup_time')), {parent: this, aX:0.5, aY:0.5, x: 0, y: 0});

  this.visible = false;
}
PopupTime.prototype = Object.create(PIXI.Container.prototype);
PopupTime.prototype.constructor = PopupTime;

PopupTime.prototype.show = function(time)
{
  var self = this;

  var orientation = guiManager.orientation;

  this.bgV.visible = false;
  this.bgH.visible = false;

  // this.rotation = 0;
  // this.scale.x = this.scale.y = 1.0;

  this.visible = true;

  this.textTime.text = '+'+time + ' s';

  if(orientation == 'landscape' || orientation == 'portrait')
  {
    this.bgH.visible = true;
    this.bgH.x = 300;
    this.bgH.y = 0;

    this.textTime.x = 180;
    this.textTime.y = 10;

    this.y = 10;

    this.rotation = 34*Util.TO_RADIANS;
    this.scale.x = this.scale.y = 0.44;

    TweenMax.to(this.bgH, 4/30, { x: 172, ease: Power2.easeOut });

    TweenMax.to(this, 4/30, { rotation: 0, x: 10, pixi: { scaleX: 1.0, scaleY: 1.0 }, ease: Power1.easeOut, onComplete: function()
    {
      TweenMax.to(self, 6/30, { x: -10, ease: Power2.easeOut, onComplete: function()
      {
        TweenMax.to(self, 10/30, { x: -25, pixi: { scaleX: 0.4, scaleY: 0.4 }, delay: 30/30, ease: Power2.easeIn, onComplete: function()
        {
          self.visible = false;
        }});
      }});
    }});
  }
  /*else if(orientation == 'portrait')
  {
    this.bgV.visible = true;
    this.bgV.x = 0;
    this.bgV.y = 300;

    // this.textTime.x = 180;
    // this.textTime.y = 10;

    // this.y = 10;

    this.rotation = 60*Util.TO_RADIANS;
    this.scale.x = this.scale.y = 0.44;

    TweenMax.to(this.bgV, 4/30, { y: 172, ease: Power2.easeOut });

    TweenMax.to(this, 4/30, { rotation: 0, x: 0, pixi: { scaleX: 1.0, scaleY: 1.0 }, ease: Power1.easeOut, onComplete: function()
    {
      // TweenMax.to(self, 6/30, { x: -10, ease: Power2.easeOut, onComplete: function()
      // {
      //   TweenMax.to(self, 10/30, { x: -20, pixi: { scaleX: 0.4, scaleY: 0.4 }, ease: Power2.easeIn, onComplete: function()
      //   {
          
      //   }});
      // }});
    }});
  }*/
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelTutorial = function(config)
{
  config.width = 675;
  config.height = 820;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.initBlockInputBg(3000, 3000, function()
  {
    
  });
  this.invisibleBg.interactive = true;

  this.state = 'hide';

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_tutorial_bg.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);
  this.bg.width = this.width;
  this.bg.height = this.height;

  this.labelHelp = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'label_help.png'));
  this.addChild(this.labelHelp);
  this.labelHelp.anchor.set(0.5, 0.5);
  this.labelHelp.y = -340;

  this.containerField = new PIXI.Container();
  this.addChild(this.containerField);

  this.field = config.field;

  this.buttonGotIt = Gui.createSimpleButton({name: 'button_got_it', parentPanel: this, layer: this.containerField, width: 394, height: 142, x: 0, y: 0},
  {
    pathToSkin: 'button_got_it_0001.png',
    onClick: function()
    {
      TweenMax.delayedCall(6/30, function()
      {
        self.hide();
      });

      if(app.gameData.isTutorial)
      {
        app.gameData.isTutorial = false;
        app.save();
      }
    }
  }); 
  // this.buttonPlay.isClickTween = false;
  // this.buttonPlay.isClickSound = false;
  app.setButtonHover(this.buttonGotIt, assetsManager.getTexture('texture_atlas', 'button_got_it_0001.png'), assetsManager.getTexture('texture_atlas', 'button_got_it_0002.png'));

  this.buttonGotIt.y = 320;

  this.visible = false;

  guiManager.on('game_resize', function(data)
  {
    // app.bgGradient.width = data.width + 5;
    // app.bgGradient.height = data.height + 5;
    // self.updateBgSize();
  });
}
PanelTutorial.prototype = Object.create(Gui.BasePanel.prototype);
PanelTutorial.prototype.constructor = PanelTutorial;

PanelTutorial.prototype.updateBgSize = function()
{
  // if(!this.visible) return;

  // if(this.showFrom == 'in_main_menu')
  // {
  //   this.height = guiManager.rootScene.height + 400;

  //   this.bg.height = this.height;
  // }
  // else 
  // {
  //   this.height = 820;

  //   this.bg.height = this.height;
  // }
}

PanelTutorial.prototype.onTutorialComplete = function()
{
  // console.log('tutorial_complete');

  var self = this;

  TweenMax.delayedCall(60/30, function()
  {
    self.newGameLoop();
  });
}

PanelTutorial.prototype.newGameLoop = function()
{
  if(this.state != 'show') return;

  var self = this;

  // self.board = app.getBoard();
  self.field.initTutorial(self.board);
  self.field.startTutorial();
}

PanelTutorial.prototype.show = function(showFrom, hideCallback)
{
  var self = this;

  this.showFrom = showFrom;

  this.state = 'to_show';
  this.visible = true;

  this.hideCallback = hideCallback;

  if(this.showFrom == 'in_game')
  {
    app.screenGame.containerBoard.addChild(this);

    this.bg.width = 675;
    this.bg.height = 820;

    this.containerField.scale.x = this.containerField.scale.y = 1;
    this.containerField.y = 0;

    this.labelHelp.visible = false;
  }
  else if(this.showFrom == 'in_main_menu')
  {
    guiManager.rootScene.addChild(this);
    // app.screenMainMenu.addChild(this);
    // app.screenMainMenu.containerMenus.addChild(this);
    // this.
    // this.positionType = 'center-bot';
    // this.xRelative = 0;
    // this.yRelative = -40;

    this.bg.width = 8000;
    this.bg.height = 8000;

    this.containerField.scale.x = this.containerField.scale.y = 0.8;
    this.containerField.y = 100;

    this.labelHelp.visible = true;

    app.screenMainMenu.hideSideButtons();
  }

  // this.updateBgSize();

  this.y = -100;
  this.alpha = 0;
  TweenMax.to(this, 10/30, { y: 0, alpha: 1.0, ease: Power1.easeOut, onComplete: function()
  {
    self.state = 'show';

    TweenMax.delayedCall(5/30, function()
    {
      self.field.startTutorial();
    });
  }});

  self.containerField.addChild(self.field.panelOperations);
  self.field.panelOperations.scale.x = self.field.panelOperations.scale.y = 0.7;
  self.field.panelOperations.x = 0;
  self.field.panelOperations.y = 140;
  self.field.panelOperations.alpha = 1.0;

  self.field.panelOperations.deactivate();

  self.containerField.addChild(self.field);
  self.field.x = 0;
  self.field.y = 0;
  self.field.alpha = 1;
  self.field.scale.x = self.field.scale.y = 0.7;
  self.field.x = 0;
  self.field.y = -100;

  self.board = app.getBoard();
  self.field.initTutorial(self.board);

  self.field.addListener('tutorial_complete', this.onTutorialComplete, this);
    // this.field.startTutorial();

    // for(var i = 0; i < self.field.cards.length; i++) self.field.cards[i].alpha = 1.0;

    // self.field.tween({name: 'start_game'}, function()
    // {
      
    // });
}
PanelTutorial.prototype.hide = function()
{
  if(this.state != 'show') return;

  var self = this;

  this.state = 'to_hide';

  TweenMax.to(this, 10/30, { y: - 100, alpha: 0, ease: Power1.easeOut, onComplete: function()
  {
    self.state = 'hide';
    self.visible = false;

    TweenMax.killAll();

    TweenMax.delayedCall(2/30, function()
    {
      self.field.panelOperations.reset();

      if(self.showFrom == 'in_game')
      {
        if(self.hideCallback != null) self.hideCallback();
        // app.screenGame.toGame('from_tutorial');
      }
    });

    app.screenGame.containerField.addChild(self.field.panelOperations);
    app.screenGame.containerField.addChild(self.field);
    self.field.alpha = 0;
    self.field.panelOperations.alpha = 0;

    // if(self.showFrom == 'in_game')
    // {
    //   if(self.hideCallback != null) self.hideCallback();
    //   // app.screenGame.toGame('from_tutorial');
    // }
    if(self.showFrom == 'in_main_menu')
    {
      app.screenMainMenu.showSideButtons();
      app.screenMainMenu.panelLogo.playAnimation();
    }
  }});

  this.field.removeListener('tutorial_complete', this.onTutorialComplete);
  TweenMax.killDelayedCallsTo(this.newGameLoop);

  // if(self.showFrom == 'in_main_menu')
  // {
  //   app.screenMainMenu.showSideButtons();
  // }



  // this.visible = false;

  // app.screenGame.toGame();
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var TutorialHand = function(config)
{
  PIXI.Container.call(this);


  var self = this;

  this.hand = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'tutorial_hand.png'));
  this.addChild(this.hand);
  this.hand.anchor.set(0.35, 0.1);

  // this.dot = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'button_operation_minus_0001.png'));
  // this.addChild(this.dot);
  // this.dot.anchor.set(0.5, 0.5);

  this.visible = false;
}
TutorialHand.prototype = Object.create(PIXI.Container.prototype);
TutorialHand.prototype.constructor = TutorialHand;

TutorialHand.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show')
  {
    this.visible = true;

    this.x = data.x;
    this.y = data.y + 40;
    this.alpha = 0;

    TweenMax.to(this, 10/30, { x: data.x, y: data.y, alpha: 1.0, ease: Power1.easeOut, onComplete: function()
    {
      if(callback) callback();
    }})
  }   
  if(data.name == 'hide')
  {
    TweenMax.to(this, 10/30, { y: this.y+40, alpha: 0.0, ease: Power1.easeOut, onComplete: function()
    {
      self.visible = false;

      if(callback) callback();
    }})
  } 
  else if(data.name == 'move_to')
  {
    TweenMax.to(this, 20/30, { x: data.x, y: data.y, ease: Power1.easeInOut, onComplete: function()
    {
      if(callback) callback();
    }})
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelStartMassage = function(config)
{
  config.width = 654;
  config.height = 457;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.state = 'hide';

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panels_blue_bg.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);
  this.bg.width = this.width;
  this.bg.height = this.height;

  this.labelSolve5 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'label_solve_5.png'));
  this.addChild(this.labelSolve5);
  this.labelSolve5.anchor.set(0.5, 0.5);
  this.labelSolve5.x = 0;
  this.labelSolve5.y = -60;

  this.labelSolveMax = new PIXI.Sprite(assetsManager.getTexture('texture_atlas_2', 'label_solve_max.png'));
  this.addChild(this.labelSolveMax);
  this.labelSolveMax.anchor.set(0.5, 0.5);
  this.labelSolveMax.x = 0;
  this.labelSolveMax.y = -75;

  this.buttonGo = Gui.createSimpleButton({name: 'button_go', parentPanel: this, width: 262, height: 112, x: 0, y: 140},
  {
    pathToSkin: 'button_go_0001.png',
    onClick: function()
    {
      if(self.state == 'show') 
      {
        TweenMax.delayedCall(6/30, function()
        {
          self.tween({name: 'hide_anim'}, function()
          {
            self.goCallback();
          });
        });
      }
    }
  }); 
  app.setButtonHover(this.buttonGo, assetsManager.getTexture('texture_atlas', 'button_go_0001.png'), assetsManager.getTexture('texture_atlas', 'button_go_0002.png'));

  this.visible = false;
}
PanelStartMassage.prototype = Object.create(Gui.BasePanel.prototype);
PanelStartMassage.prototype.constructor = PanelStartMassage;

PanelStartMassage.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim' && this.state == 'hide')
  {
    this.state = 'to_show';

    this.visible = true;

    this.labelSolve5.visible = false;
    this.labelSolveMax.visible = false;

    this.goCallback = data.go;

    if(data.type == 'solve_5') this.labelSolve5.visible = true;
    else if(data.type == 'solve_max') this.labelSolveMax.visible = true;

    var time = 8/30;
    var showDelay = 0/30;

    // TweenMax.to(app.screenGame.boardOver, time, { alpha: 1.0, ease: Power2.easeOut });

    this.alpha = 0;
    this.y = -100;
    TweenMax.to(this, time, { alpha: 1, x: 0, y: 0, ease: Power2.easeOut });

    TweenMax.delayedCall(time, function()
    {
      self.tween({name: 'show'}, callback);
    });
  }

  if(data.name == 'hide_anim' && this.state == 'show')
  {
    this.state = 'hide_anim';

    this.interactiveChildren = false;

    var time = 8/30;
    var showDelay = 0/30;

    // TweenMax.to(app.screenGame.boardOver, time, { alpha: 0.0, ease: Power2.easeOut });

    TweenMax.to(this, time, { alpha: 0.0, x: 0, y: -100, ease: Power2.easeOut });

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