var Field = function(config)
{
  config.sizeType = 'absolute';
  config.width = 900;
  config.height = 900;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.state = 'normal';

  // this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'color_rect_field.png'));
  // this.addChild(this.bg);
  // this.bg.anchor.set(0.5, 0.5);
  // this.bg.width = 900;
  // this.bg.height = 900;

  this.containerCards = new PIXI.Container();
  this.addChild(this.containerCards);

  this.smallCardWidth = 375;
  this.smallCardHeight = 317;
  // this.brickCardWidth = 

  this.cardsShift = 30;
  this.cardsInfo = 
  {
    small: { width: 375, height: 317 },
    brick_h: { width: 375*2+this.cardsShift, height: 317 },
    brick_v: { width: 375, height: 317*2+this.cardsShift },
    big: { width: 375*2+this.cardsShift, height: 317*2+this.cardsShift }
  };

  this.card1 = new Card({name: 'card', parentPanel: this, layer: this.containerCards});
  this.card2 = new Card({name: 'card', parentPanel: this, layer: this.containerCards});
  this.card3 = new Card({name: 'card', parentPanel: this, layer: this.containerCards});
  this.card4 = new Card({name: 'card', parentPanel: this, layer: this.containerCards});
  this.cards = [this.card1, this.card2, this.card3, this.card4];

  this.card24 = new Card24();
  this.addChild(this.card24);

  this.cells = [];
  this.allCells = [];
  for(var i = 0; i < 3; i++)
  {
    this.cells[i] = [];
    for(var j = 0; j < 3; j++)
    {
      var cell = createCell(i-1, j-1);
      this.cells[i][j] = cell;
      this.allCells.push(cell);
    }
  }

  function createCell(cellI, cellJ)
  {
    var cell = {cellI: cellI, cellJ: cellJ, cards: []};
    var info = self.cardsInfo['small'];
    var x = (info.width/2+self.cardsShift/2) * cellI;
    var y = (info.height/2+self.cardsShift/2) * cellJ;

    cell.x = x;
    cell.y = y;

    cell.getNext = function(dir)
    {
      var sI = 0;
      var sJ = 0;
      if(dir == 'up') sJ = -1;
      else if(dir == 'down') sJ = 1;
      else if(dir == 'left') sI = -1;
      else if(dir == 'right') sI = 1;   
      else if(dir == 'up_left') 
      {
        sI = -1;
        sJ = -1;
      }
      else if(dir == 'up_right') 
      {
        sI = 1
        sJ = -1;
      }
      else if(dir == 'down_left') 
      {
        sI = -1;
        sJ = 1;
      }
      else if(dir == 'down_right') 
      {
        sI = 1;
        sJ = 1;
      }

      if(sI == 0 && sJ == 0) return null;

      return self.getCell(cell.cellI+sI, cell.cellJ+sJ);
    }
    cell.getNeighbors = function()
    {
      var dirs = ['up', 'down', 'left', 'right', 'up_left', 'up_right', 'down_left', 'down_right'];
      var neighbors = [];
      for(var i = 0; i < dirs.length; i++)
      {
        var c = cell.getNext(dirs[i]);
        if(c != null) neighbors.push(c);
      }

      return neighbors;
    }

    return cell;
  }

  // console.log(this.allCells);

  this.boardArchive = [];
  this.turnN = 0;

  this.containerCards.y = -90;

  this.panelOperations = new PanelOperations({parentPanel: this.parentPanel, layer: config.layer, field: this, width: 900, height: 160, x: 0, y: 350});
  config.layer.setChildIndex(this.panelOperations, 0);

  // this.gamePhase = 'none';
  this.playPhase = 'none';
  this.turnPhase = 'none';

  this.turnData = {cardFirst: null, cardSecond: null, operation: 'none', result: null};

  this.isUndoAwaiable = true;

  // TweenMax.delayedCall(2, function()
  // {
    // self.cardUpLeft.combineWith(self.cardUpRight, 'plus');

    // self.cardDownLeft.setTo('hiden', 'left', 'down');
    // self.cardDownRight.setTo('brick_h', 'center', 'down');
  // });

  this.tutorialPhase = 'off';
  this.tutorialHand = new TutorialHand();
  this.addChild(this.tutorialHand);

  app.addForUpdate(this.update, this);

  guiManager.on('orientation_change', this.onOrientationChange, this);
  guiManager.on('game_resize', this.onGameResize, this);

  this.clear();
}
Field.prototype = Object.create(Gui.BasePanel.prototype);
Field.prototype.constructor = Field;

Field.prototype.onOrientationChange = function(data)
{
  // var orientation = data.orientation;

  // if(orientation == 'portrait')
  // { 
  //   this.x = 0;
  //   this.y = 300/2;
  // }  
  // if(orientation == 'landscape')
  // {
  //   this.x = 300/2;
  //   this.y = 0;
  // }
}

Field.prototype.onGameResize = function(data)
{
  // console.log(data.width, data.height);
}

Field.prototype.getCell = function(cellI, cellJ)
{
  // return this.cells[cellI+1][cellJ+1];
  for(var i = 0; i < this.allCells.length; i++)
  {
    var cell = this.allCells[i];
    if(cell.cellI == cellI && cell.cellJ == cellJ) return cell;
  }

  return null;
}

Field.prototype.clear = function()
{
  // this.gamePhase = 'clear';
  this.playPhase = 'none';
  this.turnPhase = 'normal';

  this.clearCells();

  this.card1.setTo('small', -1, -1);
  this.card2.setTo('small', 1, -1);
  this.card3.setTo('small', -1, 1);
  this.card4.setTo('small', 1, 1);

  for(var i = 0; i < this.cards.length; i++)
  {
    var card = this.cards[i];
    card.isSelect = false;
    card.selectionOver.alpha = 0;

    if(card.parent != this.containerCards) this.containerCards.addChild(card);

    card.visible = true;
    card.scale.x = card.scale.y = 1;
    card.number.scale.x = card.number.scale.y = 1;
    card.rotation = 0;
    card.alpha = 0;
  }

  this.card24.visible = false;

  this.boardArchive = [];
  this.turnN = 0;

  this.interactive = false;
  this.interactiveChildren = false;

  this.panelOperations.deactivate();

  this.clearTurnData();

  this.tutorialPhase = 'off';
  this.tutorialHand.visible = false;

  this.isUndoAwaiable = true;
}

Field.prototype.clearCells = function()
{
  for(var i = 0; i < this.cards.length; i++) this.cards[i].cell = null;

  for(var i = 0; i < this.allCells.length; i++) this.allCells[i].cards = [];
}

Field.prototype.initGame = function(boardData)
{
  this.clear();

  this.state = 'normal';
  this.playPhase = 'waiting_start';
  this.turnPhase = 'normal';
  // this.gamePhase = 'init';

  this.card1.setTo('small', -1, -1);
  this.card2.setTo('small', 1, -1);
  this.card3.setTo('small', -1, 1);
  this.card4.setTo('small', 1, 1);

  this.card1.number.setNumber(new NumberData(boardData.numbers[0]));
  this.card2.number.setNumber(new NumberData(boardData.numbers[1]));
  this.card3.number.setNumber(new NumberData(boardData.numbers[2]));
  this.card4.number.setNumber(new NumberData(boardData.numbers[3]));

  // console.log('field: init game');

  // for(var i = 0; i < this.cards.length; i++) this.cards[i].alpha = 0;
}
Field.prototype.initTutorial = function(boardData)
{
  this.clear();

  this.state = 'normal';
  this.playPhase = 'waiting_start';
  this.turnPhase = 'normal';

  this.tutorialPhase = 'waiting_start';
  // this.gamePhase = 'init';

  this.boardData = boardData;

  this.card1.setTo('small', -1, -1);
  this.card2.setTo('small', 1, -1);
  this.card3.setTo('small', -1, 1);
  this.card4.setTo('small', 1, 1);

  this.card1.number.setNumber(new NumberData(boardData.numbers[0]));
  this.card2.number.setNumber(new NumberData(boardData.numbers[1]));
  this.card3.number.setNumber(new NumberData(boardData.numbers[2]));
  this.card4.number.setNumber(new NumberData(boardData.numbers[3]));

  for(var i = 0; i < this.cards.length; i++) this.cards[i].alpha = 1.0;

  // console.log('field: init game');

  // for(var i = 0; i < this.cards.length; i++) this.cards[i].alpha = 0;
}

/*
Field.prototype.startGame = function(callback)
{
  var self = this;

  this.gamePhase = 'starting';

  var delay = 2/30;
  this.card3.tween({name: 'appear', delay: delay*0});
  this.card4.tween({name: 'appear', delay: delay*1});
  this.card2.tween({name: 'appear', delay: delay*2});
  this.card1.tween({name: 'appear', delay: delay*3});

  TweenMax.delayedCall(12/30, function()
  {
    self.gamePhase = 'playing';

    self.emit('game_start');

    if(callback) callback();
  });
}
*/

// Field.prototype.tweenStartGame

Field.prototype.startGame = function()
{
  if(this.playPhase != 'waiting_start') return;

  var self = this;

  // this.gamePhase = 'starting';
  this.playPhase = 'normal';

  this.interactive = true;
  this.interactiveChildren = true;

  // this.panelOperations.activate();

  // console.log('field: start game');


  // this.emit('game_started');
}

Field.prototype.startTutorial = function()
{
  if(this.playPhase != 'waiting_start') return;

  var self = this;

  // this.gamePhase = 'starting';
  this.playPhase = 'normal';

  this.interactive = false;
  this.interactiveChildren = false

  // console.log(this.boardData);

  this.tutorialPhase = 'step_1';
  this.tutorialStep();

  // this.panelOperations.activate();

  // console.log('field: start game');


  // this.emit('game_started');
}

Field.prototype.tutorialStep = function()
{
  var self = this;
  // console.log('Tutorial step:', this.tutorialPhase);

  var solution = this.boardData.solution;

  if(this.tutorialPhase == 'step_1')
  {
    var step = solution.steps[0];
    showSolutionStep(step, 0, function()
    {
      self.tutorialPhase = 'step_2';
      self.tutorialStep();
    });
  }
  if(this.tutorialPhase == 'step_2')
  {
    var step = solution.steps[1];
    showSolutionStep(step, 1, function()
    {
      self.tutorialPhase = 'step_3';
      self.tutorialStep();
    });
  }  
  if(this.tutorialPhase == 'step_3')
  {
    var step = solution.steps[2];
    showSolutionStep(step, 2, function()
    {
      self.tutorialPhase = 'complete';
      self.tutorialHand.tween({name: 'hide'});

      self.emit('tutorial_complete');
    });
  }

  function showSolutionStep(step, stepN, callback)
  {
    // console.log('Show step:', step);
    var number1 = step.number1;
    var number2 = step.number2;
    var operation = step.operation;
    if(operation == '+') operation = 'plus';
    else if(operation == '-') operation = 'minus';
    else if(operation == '*') operation = 'multiply';
    else if(operation == '/') operation = 'divide';

    var card1 = self.findCard({number: number1});
    var card2 = self.findCard({number: number2, notCard: card1});
    var buttonOperation = self.panelOperations.findButtonOperation(operation);
    var operationPosition = buttonOperation.parent.toGlobal(new PIXI.Point(buttonOperation.x, buttonOperation.y));
    operationPosition = self.tutorialHand.parent.toLocal(operationPosition);

    if(stepN == 0)
    {
      self.tutorialHand.tween({name: 'show', x: card1.x, y: card1.y}, function()
      {
        app.playAudio('sounds', 'sound_card_click');
        self.playerSelectCard(card1);
        TweenMax.delayedCall(10/30, function()
        {
          self.tutorialHand.tween({name: 'move_to', x: operationPosition.x, y: operationPosition.y}, function()
          {
            app.playAudio('sounds', 'sound_card_click');
            self.playerSelectOperation(operation);
            TweenMax.delayedCall(10/30, function()
            {
              self.tutorialHand.tween({name: 'move_to', x: card2.x, y: card2.y}, function()
              {
                app.playAudio('sounds', 'sound_card_click');
                self.playerSelectCard(card2);
                TweenMax.delayedCall(20/30, function()
                {
                  if(callback) callback();
                });
              });
            });
          });
        });
      });
    }
    else
    {
      if(self.turnData.cardFirst == card1)
      {
        self.tutorialHand.tween({name: 'move_to', x: operationPosition.x, y: operationPosition.y}, function()
        {
          app.playAudio('sounds', 'sound_card_click');
          self.playerSelectOperation(operation);
          TweenMax.delayedCall(10/30, function()
          {
            self.tutorialHand.tween({name: 'move_to', x: card2.x, y: card2.y}, function()
            {
              app.playAudio('sounds', 'sound_card_click');
              self.playerSelectCard(card2);
              TweenMax.delayedCall(20/30, function()
              {
                if(callback) callback();
              });
            });
          });
        });
      }
      else
      {
        self.tutorialHand.tween({name: 'move_to', x: card1.x, y: card1.y}, function()
        {
          app.playAudio('sounds', 'sound_card_click');
          self.playerSelectCard(card1);
          TweenMax.delayedCall(10/30, function()
          {
            self.tutorialHand.tween({name: 'move_to', x: operationPosition.x, y: operationPosition.y}, function()
            {
              app.playAudio('sounds', 'sound_card_click');
              self.playerSelectOperation(operation);
              TweenMax.delayedCall(10/30, function()
              {
                self.tutorialHand.tween({name: 'move_to', x: card2.x, y: card2.y}, function()
                {
                  app.playAudio('sounds', 'sound_card_click');
                  self.playerSelectCard(card2);
                  TweenMax.delayedCall(20/30, function()
                  {
                    if(callback) callback();
                  });
                });
              });
            });
          });
        });
      }
    }
  }
}

Field.prototype.endGame = function(type)
{
  var self = this;

  // this.gamePhase = 'end';
  this.playPhase = 'end_'+type;

  this.interactive = false;
  this.interactiveChildren = false;

  this.panelOperations.deactivate();

  // console.log('field: end game');

  if(this.tutorialPhase == 'off') this.emit('game_ended', { type: type, card24: this.card24 });
}

Field.prototype.setBoard = function(boardInfo)
{
  // this.card1.setTo('hiden', 'left', 'up');
  // this.card2.setTo('hiden', 'right', 'up');
  // this.card3.setTo('hiden', 'left', 'down');
  // this.card4.setTo('hiden', 'right', 'down');

  for(var i = 0; i < boardInfo.cards.length; i++)
  {
    var cardInfo = boardInfo.cards[i];

    var card = cardInfo.card;
    if(card.type == 'hiden' && cardInfo.type != 'hiden')
    {
      card.setTo(cardInfo.type, cardInfo.cellI, cardInfo.cellJ, cardInfo.numberData);

      card.alpha = 0;
      card.tween({name: 'appear', delay: 3/30});
    }
    else if(card.type != 'hiden' && cardInfo.type != 'hiden')
    {
      var x = card.x;
      var y = card.y;

      card.setTo(cardInfo.type, cardInfo.cellI, cardInfo.cellJ, cardInfo.numberData);
      card.x = x;
      card.y = y;
      card.tween({name: 'undo_move'});
    }
    else card.setTo(cardInfo.type, cardInfo.cellI, cardInfo.cellJ, cardInfo.numberData);
  }
}
Field.prototype.getBoard = function()
{
  var cards = [];

  for(var i = 0; i < this.cards.length; i++)
  {
    var card = this.cards[i];
    var cardInfo = card.getInfo();
    cardInfo.card = card;
    cards.push(cardInfo);

    // console.log(cardInfo);
  }

  return {cards: cards};
}

Field.prototype.playerSelectCard = function(card)
{
  if(this.state != 'normal' || this.playPhase != 'normal' || this.turnPhase != 'normal' || this.turnN >= 3) return;

  if(this.turnData.cardFirst == null)
  {
    this.turnData.cardFirst = card;
    card.select();

    this.panelOperations.deselectAll();
    if(this.tutorialPhase == 'off') this.panelOperations.activate();

    // app.playAudio('sounds', 'sound_click');
  }
  else if(this.turnData.cardFirst != null && this.turnData.operation == 'none' && this.turnData.cardFirst != card)
  {
    this.turnData.cardFirst.deselect();

    this.turnData.cardFirst = card;
    card.select();

    // app.playAudio('sounds', 'sound_click');
  }
  else if(this.turnData.cardFirst != null && this.turnData.cardFirst == card)
  {
    this.turnData.cardFirst.deselect();
    this.turnData.cardFirst = null;

    this.turnData.operation = 'none';

    this.panelOperations.deselectAll();
    this.panelOperations.deactivate();

    // app.playAudio('sounds', 'sound_click');
  }
  else if(this.turnData.cardSecond == null && this.turnData.operation != 'none' && this.turnData.cardFirst != card)
  {
    if(!(this.turnData.operation == 'divide' && card.number.numberData.numerator == 0)) 
    {
      this.turnData.cardSecond = card;
      
      // app.playAudio('sounds', 'sound_click');
    }
    else app.playAudio('sounds', 'sound_wrong');
  }

  if(this.turnData.cardFirst != null && this.turnData.operation != 'none' && this.turnData.cardSecond != null) 
  {
    this.turnData.cardSecond.select();

    this.doTurn();

    this.panelOperations.deselectAll();
    this.panelOperations.deactivate();

    // app.playAudio('sounds', 'sound_click');
  }
}

Field.prototype.playerSelectOperation = function(operation)
{
  if(this.state != 'normal' || this.playPhase != 'normal' || this.turnPhase != 'normal') return;

  if(this.turnData.cardFirst != null)
  {
    this.turnData.operation = operation;
  }

  this.panelOperations.selectOperation(operation);
}

Field.prototype.doTurn = function()
{
  var self = this;

  this.turnPhase = 'turn';

  this.turnData.result = this.calculateTurnResult();

  var card = this.turnData.cardFirst;
  var combineType = 'normal';
  if(this.turnData.result.numberData.denominator == 1 && this.turnData.result.numberData.numerator == 24 && this.turnN == 2 && this.turnData.result.numberData.sign == 1) combineType = '24';
  else if(this.turnData.result.numberData.denominator != 1 || this.turnData.result.numberData.sign == -1) combineType = 'wrong';

  // console.log('Turn:', this.turnData.cardFirst, this.turnData.cardSecond, this.turnData.operation, this.turnData.result.numberData);

  if(app.screenGame.isCheatMake24)
  {
    combineType = '24';
    // app.screenGame.isCheatMake24 = false;
  }

  this.interactive = false;
  this.interactiveChildren = false;

  this.isUndoAwaiable = false;
  TweenMax.delayedCall(16/30, function()
  {
    self.isUndoAwaiable = true;
  });

  if(combineType == 'normal')
  {
    var boardInfo = this.getBoard();
    this.boardArchive.push(boardInfo);
    this.turnN ++;

    card.tween({name: 'combine_with', cardSecond: this.turnData.cardSecond, result: this.turnData.result.numberData}, function()
    {
      // console.log('Combine anim complete!');

      if(self.turnPhase != 'turn') return;

      self.turnPhase = 'normal';

      self.clearTurnData();

      if(self.turnN < 3) self.playerSelectCard(card);
      else 
      {
        self.emit('no_turns');

        app.playAudio('sounds', 'sound_wrong');
      }
      // else card.deselect();

      if(self.tutorialPhase == 'off')
      {
        self.interactive = true;
        self.interactiveChildren = true;
      }
    });
  }
  else if(combineType == 'wrong')
  {
    card.tween({name: 'combine_with_wrong', cardSecond: this.turnData.cardSecond, result: this.turnData.result.numberData}, function()
    {
      // console.log('Combine wrong complete!');

      if(self.turnPhase != 'turn') return;

      self.turnPhase = 'normal';

      self.clearTurnData();

      self.playerSelectCard(card);

      if(self.tutorialPhase == 'off')
      {
        self.interactive = true;
        self.interactiveChildren = true;
      }
    });
  }  
  else if(combineType == '24')
  {
    this.turnN ++;

    card.tween({name: 'combine_24', cardSecond: this.turnData.cardSecond, result: this.turnData.result.numberData}, function()
    {
      // console.log('Combine 24 complete!');

      if(self.turnPhase != 'turn') return;

      self.turnPhase = 'normal';

      self.clearTurnData();

      self.endGame('win');

      // self.playerSelectCard(card);
    });
  }
}

/*
Field.prototype.checkWin = function()
{
  if(this.turnN != 3) return;

  var card = null;
  for(var i = 0; i < this.cards.length; i++)
  {
    if(this.cards[i].type != 'hiden')
    {
      card = this.cards[i];
      break;
    }
  }
  var number = card.number.numberData;

  var isWin = number.numerator == 24 && number.denominator == 1 && number.sign == 1;

  if(isWin) this.win(card);
  // console.log('CheckWin:', card.number.numberData, isWin);
}
*/

/*
Field.prototype.win = function(card)
{
  var self = this;

  this.gamePhase = 'win';

  self.emit('game_complete', {type: 'win', card: card});

  console.log('Win!');

  app.setScore(app.getScore() + 1);
  app.save();

  TweenMax.delayedCall(5/30, function()
  {
    var panelScore = app.screenGame.panelGameControls.panelScore;
    panelScore.tweenWinCard(card);
  });
  console.log(panelScore);

  TweenMax.delayedCall(30/30, function()
  {
    self.emit('game_complete', 'win');
  });

  function nextGame()
  {
    self.initGame();
    self.startGame();
  }
}
*/

Field.prototype.undo = function()
{
  // console.log('undo', this.state, this.gamePhase, this.turnPhase);

  if(this.state != 'normal' || this.playPhase != 'normal' || this.turnPhase != 'normal' || this.tutorialPhase != 'off' || !this.isUndoAwaiable) return;

  if(this.turnN == 0) return;

  var self = this;

  this.turnPhase = 'undo';

  // console.log('undo');

  this.clearTurnData();
  this.clearCells();

  var boardInfo = this.boardArchive[this.turnN-1];
  this.setBoard(boardInfo);

  this.panelOperations.deselectAll();
  this.panelOperations.deactivate();

  this.turnN --;
  this.boardArchive.splice(this.boardArchive.length-1, 1);



  // TweenMax.to(this.containerCards.scale, 4/30, {x: 0.98, y: 0.98, ease: Power2.easeOut, onComplete: function()
  // {
  //   TweenMax.to(self.containerCards.scale, 3/30, {x: 1.03, y: 1.03, ease: Power2.easeIn, onComplete: function()
  //   {
  //     TweenMax.to(self.containerCards.scale, 3/30, {x: 1, y: 1, ease: Power2.easeIn, onComplete: function()
  //     {
  //       self.gamePhase = 'playing';
  //     }});
  //   }});
  // }});

  for(var i = 0; i < this.cards.length; i++)
  {
    this.cards[i].isSelect = false;
    this.cards[i].selectionOver.alpha = 0;
  }

  TweenMax.delayedCall(10/30, function()
  {
    if(self.turnPhase == 'undo') self.turnPhase = 'normal';
  });

  this.emit('undo');
}

Field.prototype.clearTurnData = function()
{
  this.turnData.cardFirst = null;
  this.turnData.operation = 'none';
  this.turnData.cardSecond = null;
  this.turnData.result = null;
}

Field.prototype.calculateTurnResult = function()
{
  var result = {};

  var number1 = this.turnData.cardFirst.number.numberData;
  var number2 = this.turnData.cardSecond.number.numberData;
  var operation = this.turnData.operation;

  var numberData = null;

  // console.log('Calc result:', number1, operation, number2);

  numberData = number1.operation(operation, number2);

  result.numberData = numberData;

  // console.log('Result:', numberData);

  return result;  
}

Field.prototype.update = function()
{

}

// Field.prototype.showTutorial = function()
// {

// }

Field.prototype.findCard = function(data)
{
  var number = data.number;



  for(var i = 0; i < this.cards.length; i++)
  {
    var card = this.cards[i];
    if(card.type != 'hiden' && card.number.numberData != null && card.number.numberData.numerator == number) 
    {
      // if(data.notSelected == undefined || !(this.turnData.cardFirst == card || this.turnData.cardSecond == card)) return card;
      if(data.notCard == undefined || data.notCard != card) return card;
    }
  }

  return null;
}

Field.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim')
  {
    var time = 15/30;
    var elemsShift = 200;

    this.scale.x = this.scale.y = 1.0;
    this.panelOperations.scale.x = this.panelOperations.scale.y = 1.0;

    if(guiManager.orientation == 'landscape')
    {
      this.x = elemsShift;
      this.y = 0;
      this.alpha = 0;
      TweenMax.to(this, time, {alpha: 1, x: 0, ease: Power2.easeOut});

      this.panelOperations.x = elemsShift;
      this.panelOperations.y = 350;
      this.panelOperations.alpha = 0;
      TweenMax.to(this.panelOperations, time, {alpha: 1, x: 0, ease: Power2.easeOut});
    }
    else
    {
      this.x = 0;
      this.y = elemsShift;
      this.alpha = 0;
      TweenMax.to(this, time, {alpha: 1, y: 0, ease: Power2.easeOut});      

      this.panelOperations.x = 0;
      this.panelOperations.y = 350+elemsShift;
      this.panelOperations.alpha = 0;
      TweenMax.to(this.panelOperations, time, {alpha: 1, y: 350, ease: Power2.easeOut});
    }

    TweenMax.delayedCall(time, function()
    {
      if(callback) callback();
    });
  }
  if(data.name == 'hide_anim')
  {
    var time = 15/30;
    var elemsShift = 200;

    if(guiManager.orientation == 'landscape')
    {
      TweenMax.to(this, time, {alpha: 0, x: elemsShift, ease: Power2.easeOut});
      TweenMax.to(this.panelOperations, time, {alpha: 0, x: elemsShift, ease: Power2.easeOut});
    }
    else
    {
      TweenMax.to(this, time, {alpha: 0, y: 300/2 + elemsShift, ease: Power2.easeOut});
      TweenMax.to(this.panelOperations, time, {alpha: 0, y: 350+elemsShift, ease: Power2.easeOut});
    }

    TweenMax.delayedCall(time, function()
    {
      if(callback) callback();
    });
  }

  if(data.name == 'start_game')
  {
    var delay = 2/30;
    this.card3.tween({name: 'appear', delay: delay*0});
    this.card4.tween({name: 'appear', delay: delay*1});
    this.card2.tween({name: 'appear', delay: delay*2});
    this.card1.tween({name: 'appear', delay: delay*3});

    TweenMax.delayedCall(12/30, function()
    {
      if(callback) callback();
    });
  }

  if(data.name == 'surrender')
  {
    var time = 10/30;
    var elemsShift = 200;

    TweenMax.to(this, time, {alpha: 0, y: -elemsShift, ease: Power2.easeOut});
    TweenMax.to(this.panelOperations, time, {alpha: 0, y: 350+elemsShift, ease: Power2.easeOut});

    TweenMax.delayedCall(time, function()
    {
      if(callback) callback();
    });
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var NumberData = function(numerator, denominator)
{
  if(denominator == undefined) denominator = 1;

  this.numerator = Math.abs(numerator);
  this.denominator = Math.abs(denominator);

  this.sign = (numerator < 0 && denominator >= 0)|| (numerator >= 0 && denominator < 0)?-1:1;
}
NumberData.prototype.getFraction = function()
{
  return math.fraction(this.numerator * this.sign, this.denominator);
}

NumberData.prototype.operation = function(operation, numberData)
{
  // if(operation == 'plus') return this.plus(numberData);
  // if(operation == 'minus') return this.minus(numberData);
  // if(operation == 'multiply') return this.multiply(numberData);
  // if(operation == 'divide') return this.divide(numberData);
  var f1 = this.getFraction();
  var f2 = numberData.getFraction();

  var r;

  if(operation == 'plus') r = math.add(f1, f2);
  if(operation == 'minus') r = math.add(f1, -f2);
  if(operation == 'multiply') r = math.multiply(f1, f2);
  if(operation == 'divide') r = math.divide(f1, f2);

  return new NumberData(r.n*r.s, r.d);
}
NumberData.prototype.plus = function(numberData)
{
  console.log(this, 'plus', numberData);

  // console.log('AAAA:', Fraction)
}
NumberData.prototype.minus = function(numberData)
{
  console.log(this, 'minus', numberData);
}
NumberData.prototype.multiply = function(numberData)
{
  console.log(this, 'multiply', numberData);
}
NumberData.prototype.divide = function(numberData)
{
  console.log(this, 'divide', numberData);
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var Card = function(config)
{
  config.width = 375;
  config.height = 317;  
  Gui.BasePanel.call(this, config);


  var self = this;

  this.field = config.parentPanel;

  // this.initBlockInputBg(5000, 5000, bind(function()
  // {

  // }, this));

  this.state = 'normal';

  this.type = 'none'; // 'small', 'brick', 'big', 'hiden'
  this.cellI = 0
  this.cellJ = 0;
  this.cell = null;

  // this.cornerWidth = 38;
  // this.cornerHeight = 38;

  // this.cornerUpLeft = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_corner_up_left.png'));
  // this.addChild(this.cornerUpLeft);
  // this.cornerUpLeft.anchor.set(1, 1);

  // this.cornerUpRight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_corner_up_right.png'));
  // this.addChild(this.cornerUpRight);
  // this.cornerUpRight.anchor.set(0, 1);

  // this.cornerDownLeft = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_corner_down_left.png'));
  // this.addChild(this.cornerDownLeft);
  // this.cornerDownLeft.anchor.set(1, 0);

  // this.cornerDownRight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_corner_down_right.png'));
  // this.addChild(this.cornerDownRight);
  // this.cornerDownRight.anchor.set(0, 0);

  // this.borderUp = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'color_rect_card.png'));
  // this.addChild(this.borderUp);
  // this.borderUp.anchor.set(0.5, 1);
  // this.borderUp.height = this.cornerHeight;

  // this.centerRect = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'color_rect_card.png'));
  // this.addChild(this.centerRect);
  // this.centerRect.anchor.set(0.5, 0.5);

  // this.borderDown = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_border_down.png'));
  // this.addChild(this.borderDown);
  // this.borderDown.anchor.set(0.5, 0);

  this.updateSize();

  // this.selectionBorder = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_selection_border.png'));
  // this.addChild(this.selectionBorder);
  // this.selectionBorder.anchor.set(0.5, 0.5);
  // this.selectionBorder.alpha = 0;
  // this.isSelect = false;  

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_normal_red.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  this.selectionOver = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_normal_selected.png'));
  this.addChild(this.selectionOver);
  this.selectionOver.anchor.set(0.5, 0.5);
  // this.selectionOver.alpha = 0;
  // this.isSelect = false;

  this.number = new CardNumber();
  this.addChild(this.number);

  this.interactive = true;
  this.buttonMode = true;

  this.on('click', this.onClickListener, this);
  this.on('tap', this.onClickListener, this);

  // function tweenCard()
  // {
  //   var w = Util.randomRangeInt(38*2, 400);
  //   var h = Util.randomRangeInt(38*2, 400);
  //   TweenMax.to(self, 1, {width: w, height: h, delay: 1.0, onComplete: tweenCard});
  // }
  // tweenCard();
}
Card.prototype = Object.create(Gui.BasePanel.prototype);
Card.prototype.constructor = Card;

Card.prototype.getInfo = function()
{
  return {type: this.type, cellI: this.cellI, cellJ: this.cellJ, numberData: this.number.numberData};
}

Card.prototype.onClickListener = function(e)
{
  this.field.playerSelectCard(this);

  app.playAudio('sounds', 'sound_card_click');
}

Card.prototype.select = function()
{
  if(this.isSelect) return;

  this.isSelect = true;
  this.selectionOver.alpha = 1;
  // TweenMax.to(this.selectionBorder, 8/30, {alpha: 1, ease: Power2.easeOut});

  // app.playAudio('sounds', 'sound_click');
}
Card.prototype.deselect = function()
{
  if(!this.isSelect) return;

  this.isSelect = false;
  this.selectionOver.alpha = 0;

  // TweenMax.to(this.selectionBorder, 8/30, {alpha: 0, ease: Power2.easeOut});

  // console.log('aa');
}

Card.prototype.updateSize = function()
{ 
  Gui.BasePanel.prototype.updateSize.call(this);


  // if(!this.cornerUpRight) return;

  // var innerWidth = this.width - this.cornerWidth*2;
  // var innerHeight = this.height - this.cornerHeight*2;

  // this.cornerUpLeft.x = -this.width/2 + this.cornerWidth;
  // this.cornerUpLeft.y = -this.height/2 + this.cornerHeight;
  // this.cornerUpRight.x = this.width/2 - this.cornerWidth;
  // this.cornerUpRight.y = -this.height/2 + this.cornerHeight;

  // this.cornerDownLeft.x = -this.width/2 + this.cornerWidth;
  // this.cornerDownLeft.y = this.height/2 - this.cornerHeight;

  // this.cornerDownRight.x = this.width/2 - this.cornerWidth;
  // this.cornerDownRight.y = this.height/2 - this.cornerHeight;

  // this.borderUp.y = -this.height/2 + this.cornerHeight;
  // this.borderUp.width = innerWidth;

  // this.centerRect.width = this.width;
  // this.centerRect.height = innerHeight;

  // this.borderDown.y = this.height/2 - this.cornerHeight;
  // this.borderDown.width = innerWidth;
}

Card.prototype.setTo = function(type, cellI, cellJ, numberData)
{
  this.type = type;
  this.cellI = cellI;
  this.cellJ = cellJ;

  var cell = this.field.getCell(this.cellI, this.cellJ);
  if(this.cell != null)
  {
    this.cell.cards.splice(this.cell.cards.indexOf(this), 1);
  }
  this.cell = cell;
  if(type != 'hiden') this.cell.cards.push(this);

  // console.log('SetTo:', type, this.cell);

  if(numberData != undefined) this.number.setNumber(numberData);

  if(type == 'hiden')
  {
    this.visible = false;
  }
  else this.visible = true;

  var xK = this.cellI;
  var yK = this.cellJ;

  var info = this.field.cardsInfo[this.type];

  if(this.type == 'small')
  {
    this.width = info.width;
    this.height = info.height;

    this.x = (info.width/2+this.field.cardsShift/2) * xK;
    this.y = (info.height/2+this.field.cardsShift/2) * yK;

    this.scale.x = this.scale.y = 1.0;
    this.rotation = 0;

    this.bg.visible = true;
    this.selectionOver.visible = true;
    this.number.visible = true;
    this.number.alpha = 1.0;
  }
  else if(this.type == 'brick_h')
  {
    this.width = info.width;
    this.height = info.height;

    this.x = 0;
    this.y = (info.height/2+this.field.cardsShift/2) * yK;
  }
  else if(this.type == 'brick_v')
  {
    this.width = info.width;
    this.height = info.height;

    this.x = (info.width/2+this.field.cardsShift/2) * xK;
    this.y = 0;
  }
}

// Card.prototype.getNeighbors = function()
// {
//   var neighbors = [];
//   for(var i = 0; i < this.field.cards.length; i++)
//   {
//     var card = this.field.cards[i];

//     if(card == this) continue;

//     if(this.type == 'small' && card.type == 'small' && this.positionV != card.positionV && this.positionH != card.positionH) 
//     {

//     }
//     else neighbors.push(card);
//   }

//   return neighbors;
// }

Card.prototype.getAvaiableShifts = function()
{
  var shifts = [];

  var dirs = ['up', 'down', 'left', 'right'];
  // var dirs8 = ['up', 'down', 'left', 'right', 'up_left', 'down', 'left', 'right'];
  for(var i = 0; i < dirs.length; i++)
  {
    var dir = dirs[i];
    var cell = this.cell.getNext(dir);
    // var cellNext = null;
    // if(cell != null) cellNext = cell.getNext(dir);

    // if(cellNext != null && cellNext.cards.length == 0) shifts.push(cell);
    if(cell != null)
    {
      var neighbors = cell.getNeighbors();
      if(neighbors.length > 0)
      {
        var isAdd = true;
        for(var j = 0; j < neighbors.length; j++)
        {
          var c = neighbors[j];
          if(c != this.cell && c.cards.length > 0) 
          {
            isAdd = false;
            break;
          }
        }

        if(isAdd && (cell.cellI == 0 || cell.cellJ == 0)) shifts.push(cell);
      }
    }
  }

  // console.log(shifts);

  return shifts;
}


Card.prototype.shift = function(callback)
{
  var self = this;

  var shifts = this.getAvaiableShifts();

  if(shifts.length == 0) 
  {
    if(callback) callback();
    return;
  }

  var number = this.number.numberData;
  var isWin = false;
  if(this.field.turnN == 3 && number.numerator == 24 && number.denominator == 1 && number.sign == 1) isWin = true;

  var cell = shifts[0];

  var orientation = cell.cellI == this.cell.cellI?'v':'h';
  // console.log('O:', orientation);
  // console.log(this.field.turnN);

  var x = this.x;
  var y = this.y;

  this.setTo('small', cell.cellI, cell.cellJ);
  this.x = x;
  this.y = y;

  var time = 8/30;
  if(isWin) time = 12/30;
  // console.log(time*30);

  TweenMax.to(this, time, {x: cell.x, y: cell.y, ease: Power3.easeInOut, onComplete: function()
  {
    if(callback) callback();
  }});

  // var number = this.number.numberData;
  // if(this.field.turnN == 3 && number.numerator == 24 && number.denominator == 1 && number.sign == 1)
  // {
  //   // var info = this.field.cardsInfo['big'];
  //   // TweenMax.to(this, 8/30, {width: info.width, height: info.height, ease: Power3.easeInOut, onComplete: function()
  //   // {

  //   // }});   

  //   // TweenMax.to(this.number.scale, 8/30, {x: 1.5, y: 1.5, ease: Power3.easeInOut, onComplete: function()
  //   // {

  //   // }});
  // }
}

Card.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'appear')
  {
    var time = 5/30;

    var targetY = this.y;
    this.y -= 100;

    TweenMax.to(this, time, {alpha: 1, y: targetY, ease: Power1.easeOut, delay: data.delay, onComplete: function()
    {
      if(callback) callback();
    }});
  }
  if(data.name == 'undo_move')
  {
    if(data.delay == undefined) data.delay = 0;

    var time = 5/30;

    TweenMax.to(this, time, {x: this.cell.x, y: this.cell.y, ease: Power1.easeOut, delay: data.delay, onComplete: function()
    {
      if(callback) callback();
    }});
  }

  if(data.name == 'combine_with')
  {
    var cardSecond = data.cardSecond;
    var result = data.result;

    this.parent.setChildIndex(this, this.parent.children.length-1);

    var startPosition = new PIXI.Point(this.x, this.y);

    var angle = Util.angle(this.x, this.y, cardSecond.x, cardSecond.y) * Util.TO_DEGREES;
    var distance = Util.distance(this.x, this.y, cardSecond.x, cardSecond.y);

    var p1 = Util.getMoveVector(distance * 0.2, angle, startPosition);
    var p2 = Util.getMoveVector(distance * 0.9, angle, startPosition);
    var p3 = Util.getMoveVector(distance * 1.0, angle, startPosition);

    this.tween({name: 'fly_in', p1: p1, p2: p2, p3: p3}, function()
    {
      TweenMax.to(self, 2/30, { rotation: 0* Util.TO_RADIANS, pixi: { scaleX: 1.0, scaleY: 1.0 }, ease: Power1.easeOut, onComplete: function()
      {

      }});
    });

    TweenMax.delayedCall(12/30, function()
    {
      app.playAudio('sounds', 'sound_new_number'); 
    });

    TweenMax.to(this.number, 4/30, {alpha: 0, ease: Power2.easeOut, delay: 5/30, onComplete: function()
    {
      self.number.setNumber(result);
      TweenMax.to(self.number, 6/30, {alpha: 1, ease: Power2.easeOut, onComplete: function()
      {

      }});
    }});

    TweenMax.to(cardSecond, 4/30, { pixi: { scaleX: 0.9, scaleY: 0.9 }, rotation: -2.5 * Util.TO_RADIANS, ease: Power2.easeOut, delay: 11/30, onComplete: function()
    {
      cardSecond.setTo('hiden', cardSecond.cellI, cardSecond.cellJ);

      cardSecond.rotation = 0;
      cardSecond.scale.x = cardSecond.scale.y = 1.0;
    }});

    var completeTime = 10/30;
    if(self.field.turnN == 3) completeTime = 15/30;
    TweenMax.delayedCall(completeTime, function()
    {
      self.setTo('small', cardSecond.cellI, cardSecond.cellJ);

      if(callback) callback();
    });

    // TweenMax.delayedCall()
    // if(callback) callback();
    // TweenMax.to(this, 10/30, { x: 0, y: 0, onComplete: callback});
  }
  if(data.name == 'combine_with_wrong')
  {
    var cardSecond = data.cardSecond;
    var result = data.result;

    this.parent.setChildIndex(this, this.parent.children.length-1);

    var startPosition = new PIXI.Point(this.x, this.y);

    var angle = Util.angle(this.x, this.y, cardSecond.x, cardSecond.y) * Util.TO_DEGREES;
    var distance = Util.distance(this.x, this.y, cardSecond.x, cardSecond.y);

    var p0 = new PIXI.Point(this.x, this.y);
    var p1 = Util.getMoveVector(distance * 0.2, angle, startPosition);
    var p2 = Util.getMoveVector(distance * 0.9, angle, startPosition);
    var p3 = Util.getMoveVector(distance * 1.0, angle, startPosition);

    var myNumber = this.number.numberData;

    this.tween({name: 'fly_in', p1: p1, p2: p2, p3: p3}, function()
    {
      TweenMax.to(self, 2/30, { rotation: -5.2* Util.TO_RADIANS, pixi: { scaleX: 1.0, scaleY: 1.0 }, ease: Power1.easeOut, onComplete: function()
      {
        TweenMax.to(self, 2/30, { rotation: 4.2* Util.TO_RADIANS, pixi: { scaleX: 1.0, scaleY: 1.0 }, ease: Power1.easeOut, onComplete: function()
        {
          TweenMax.to(self, 2/30, { rotation: -5.2* Util.TO_RADIANS, pixi: { scaleX: 1.0, scaleY: 1.0 }, ease: Power1.easeOut, onComplete: function()
          {

            TweenMax.to(self.number, 6/30, { alpha: 0.0, ease: Power2.easeOut });

            TweenMax.to(self, 6/30, { x: p2.x, y: p2.y, rotation: 15*Util.TO_RADIANS, pixi: { scaleX: 1.2, scaleY: 1.2 }, ease: Power1.easeIn, onComplete: function()
            {
              TweenMax.to(self, 4/30, { x: p1.x, y: p1.y, rotation: 0 * Util.TO_RADIANS, pixi: { scaleX: 1.2, scaleY: 1.2 }, ease: Power0.easeNone, onComplete: function()
              {
                TweenMax.to(self, 5/30, { x: p0.x, y: p0.y, rotation: 0 * Util.TO_RADIANS, pixi: { scaleX: 1.0, scaleY: 1.0 }, ease: Power1.easeOut, onComplete: function()
                {

                }});
              }});

              self.number.setNumber(myNumber);
              self.number.alpha = 0.5;
              TweenMax.to(self.number, 4/30, { alpha: 1.0, ease: Power2.easeOut });
            }});         

          }});

          cardSecond.rotation = -5.2 * Util.TO_RADIANS;
          TweenMax.to(cardSecond, 3/30, { alpha: 1.0, rotation: 0, ease: Power2.easeOut });
        }});
      }});
    });

    TweenMax.delayedCall(10/30, function()
    {
      app.playAudio('sounds', 'sound_wrong'); 
    });

    TweenMax.to(this.number, 4/30, {alpha: 0, ease: Power2.easeOut, delay: 5/30, onComplete: function()
    {
      self.number.setNumber(result);
      self.number.alpha = 0.5;
      TweenMax.to(self.number, 6/30, {alpha: 1, ease: Power2.easeOut, onComplete: function()
      {

      }});
    }});

    TweenMax.to(cardSecond, 4/30, { pixi: { scaleX: 0.9, scaleY: 0.9 }, rotation: -2.5 * Util.TO_RADIANS, ease: Power2.easeOut, delay: 11/30, onComplete: function()
    {
      // cardSecond.setTo('hiden', cardSecond.cellI, cardSecond.cellJ);
      cardSecond.deselect();
      cardSecond.alpha = 0;
      cardSecond.rotation = 0;
      cardSecond.scale.x = cardSecond.scale.y = 1.0;
    }});

    TweenMax.delayedCall(40/30, function()
    {
      // self.setTo('small', cardSecond.cellI, cardSecond.cellJ);

      if(callback) callback();
    });

    // TweenMax.to(this, 10/30, { x: 0, y: 0, onComplete: callback});
  }
  if(data.name == 'combine_24')
  {
    var cardSecond = data.cardSecond;
    var result = data.result;

    this.parent.setChildIndex(this, this.parent.children.length-1);

    var startPosition = new PIXI.Point(this.x, this.y);

    var angle = Util.angle(this.x, this.y, cardSecond.x, cardSecond.y) * Util.TO_DEGREES;
    var distance = Util.distance(this.x, this.y, cardSecond.x, cardSecond.y);

    var p1 = Util.getMoveVector(distance * 0.2, angle, startPosition);
    var p2 = Util.getMoveVector(distance * 0.9, angle, startPosition);
    var p3 = Util.getMoveVector(distance * 1.0, angle, startPosition);

    var card24 = app.screenGame.field.card24;

    TweenMax.to(this, 5/30, { x: p1.x, y: p1.y, pixi: { scaleX: 1.2, scaleY: 1.2 }, ease: Power1.easeIn, onComplete: function()
    {
      TweenMax.to(self, 4/30, { x: p2.x, y: p2.y, rotation: 15* Util.TO_RADIANS, ease: Power0.easeNone, onComplete: function()
      {
        TweenMax.to(self, 6/30, { x: p3.x, y: p3.y, rotation: -2.5* Util.TO_RADIANS, pixi: { scaleX: 0.9, scaleY: 0.9 }, ease: Power1.easeOut, onComplete: function()
        {
          self.bg.visible = false;
          self.selectionOver.visible = false;

          self.addChild(card24);
          card24.tween({name: 'combine'}, function()
          {
            if(callback) callback();
          });
          app.playAudio('sounds', 'sound_solved');

          if(app.gameData.gmode == 'arcade' && app.screenGame.score + 1 == app.getHighScore() && !app.screenGame.isHighScoreEqual && app.getHighScore() > 0)
          {
            app.screenGame.isHighScoreEqual = true;
          }
          if(app.gameData.gmode == 'arcade' && app.screenGame.score + 1 > app.getHighScore() && !app.screenGame.isHighScoreUp)
          {
            if(app.getHighScore() > 0)
            {
              app.screenGame.showMassage('new_high_score');
              app.screenGame.playSalut();
            }

            app.screenGame.isHighScoreUp = true;
          }

          TweenMax.to(self, 3/30, { rotation: 2.7 * Util.TO_RADIANS, pixi: { scaleX: 1.05, scaleY: 1.05 }, ease: Power1.easeOut, onComplete: function()
          {
            TweenMax.to(self, 5/30, { rotation: 0 * Util.TO_RADIANS, pixi: { scaleX: 1.0, scaleY: 1.0 }, ease: Power1.easeOut, onComplete: function()
            {

            }});
          }});
        }});
      }});
    }});

    TweenMax.to(this.number, 10/30, {alpha: 0, ease: Power2.easeOut, delay: 8/30, onComplete: function()
    {
      self.number.visible = false;
      self.number.alpha = 1;
    }});

    TweenMax.to(cardSecond, 4/30, { pixi: { scaleX: 0.9, scaleY: 0.9 }, rotation: -2.5 * Util.TO_RADIANS, ease: Power2.easeOut, delay: 11/30, onComplete: function()
    {
      cardSecond.setTo('hiden', cardSecond.cellI, cardSecond.cellJ);

      cardSecond.rotation = 0;
      cardSecond.scale.x = cardSecond.scale.y = 1.0;
    }});

    // TweenMax.delayedCall(20/30, function()
    // {
      // self.setTo('small', cardSecond.cellI, cardSecond.cellJ);

      // if(callback) callback();
    // });

    // TweenMax.to(this, 10/30, { x: 0, y: 0, onComplete: callback});
  }

  if(data.name == 'fly_in')
  {
    var p1 = data.p1;
    var p2 = data.p2;
    var p3 = data.p3;

    TweenMax.to(this, 5/30, { x: p1.x, y: p1.y, pixi: { scaleX: 1.2, scaleY: 1.2 }, ease: Power1.easeIn, onComplete: function()
    {
      TweenMax.to(self, 4/30, { x: p2.x, y: p2.y, rotation: 15* Util.TO_RADIANS, ease: Power0.easeNone, onComplete: function()
      {
        TweenMax.to(self, 6/30, { x: p3.x, y: p3.y, rotation: -2.5* Util.TO_RADIANS, pixi: { scaleX: 0.9, scaleY: 0.9 }, ease: Power1.easeOut, onComplete: function()
        {
          TweenMax.to(self, 3/30, { rotation: 2.2* Util.TO_RADIANS, pixi: { scaleX: 1.05, scaleY: 1.05 }, ease: Power1.easeOut, onComplete: function()
          {
            if(callback) callback();
          }});
        }});
      }});
    }});
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var Card24 = function(config)
{
  PIXI.Container.call(this);


  var self = this;

  this.shadow = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_yellow_shadow.png'));
  this.addChild(this.shadow);
  this.shadow.anchor.set(0.5, 0.5);
  this.shadow.scale.x = this.shadow.scale.y = 1/0.4;
  this.shadow.y = 10;

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'card_normal_yellow.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);



  // this.starsInfo = 
  // [
  //   { x: 0, y: 0, scaleX: 0, scaleY: 0, rotation: 0},
  // ];

  this.starsSplash = new FBFAnimation();
  this.addChild(this.starsSplash);
  this.starsSplash.scale.x = this.starsSplash.scale.y = 1.9;
  this.starsSplash.addSequence('star', 'texture_atlas_2', 'StarsSplash/frame_', 1, 15, 30, { x: -260/2, y: -265/2, loop: false });
  this.starsSplash.switchSequence('star');
  this.starsSplash.visible = false;
  // this.starsSplash.play();

  this.starsSplash2 = new FBFAnimation();
  this.addChild(this.starsSplash2);
  this.starsSplash2.scale.x = this.starsSplash2.scale.y = 1.9;
  this.starsSplash2.addSequence('star', 'texture_atlas_2', 'StarsSplash/frame_', 1, 15, 30, { x: -260/2, y: -265/2, loop: false });
  this.starsSplash2.switchSequence('star');
  this.starsSplash2.visible = false;
  // this.starsSplash.play();

  this.blink = new PanelsBlink({ mask: assetsManager.getTexture('texture_atlas', 'card_normal_yellow.png') });
  this.addChild(this.blink);

  this.number24 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'label_24.png'));
  this.addChild(this.number24);
  this.number24.anchor.set(0.5, 0.5);

  this.blinks = new FBFAnimation();
  this.addChild(this.blinks);
  this.blinks.scale.x = this.blinks.scale.y = 1.5/0.8;
  this.blinks.addSequence('star', 'texture_atlas', 'Card24Blinks/frame_', 1, 16, 30, { x: -190/2, y: -143/2, loop: false });
  this.blinks.switchSequence('star');
  this.blinks.y = -25;
  this.blinks.visible = false;
  // this.blinks.play();

  this.visible = false;

  // this.blink.play({ time: 14/30 });

  // function ttt()
  // {
  // TweenMax.delayedCall(20/30, function()
  // {
  //   self.tween({name: 'combine'}, ttt);
  // });
  // }
  // ttt();
}
Card24.prototype = Object.create(PIXI.Container.prototype);
Card24.prototype.constructor = Card24;

Card24.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'combine')
  {
    this.visible = true;

    this.starsSplash.visible = true;
    this.starsSplash.gotoAndPlay(1);

    TweenMax.delayedCall(3/30, function()
    {
      self.starsSplash2.visible = true;
      self.starsSplash2.gotoAndPlay(1);
      self.starsSplash2.scale.x = -1.9;
      self.starsSplash2.scale.y = 1.9;
      self.starsSplash2.scale.x *= 0.9;
      self.starsSplash2.scale.y *= 0.9;
      self.starsSplash2.rotation = 45 * Util.TO_RADIANS;
    });

    TweenMax.delayedCall(6/30, function()
    {
      self.blink.play({ time: 14/30 })
    });    

    TweenMax.delayedCall(15/30, function()
    {
      self.blinks.visible = true;
      self.blinks.gotoAndPlay(1);
    });

    TweenMax.delayedCall(30/30, function()
    {
      self.starsSplash.visible = false;
      self.blinks.visible = false;

      // self.visible = false;

      if(callback) callback();

      // TweenMax.delayedCall(15/30, function()
      // {
      //   self.tween({name: 'combine'});
      // });
    });
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelsBlink = function(config)
{
  PIXI.Container.call(this);


  var self = this;

  this.blink = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panels_blink.png'));
  this.addChild(this.blink);
  this.blink.anchor.set(0.5, 0.5);

  this.maskTexture = config.mask;
  this.maskSprite = new PIXI.Sprite(this.maskTexture);
  this.addChild(this.maskSprite);
  this.maskSprite.anchor.set(0.5, 0.5);
  this.blink.mask = this.maskSprite;

  this.blink.visible = false;

  // this.visible = false;

  // this.starsInfo = 
  // [
  //   { x: 0, y: 0, scaleX: 0, scaleY: 0, rotation: 0},
  // ];

  // this.starsSplash = new FBFAnimation();
  // this.addChild(this.starsSplash);
  // this.starsSplash.scale.x = this.starsSplash.scale.y = 1.5/0.8;
  // this.starsSplash.addSequence('star', 'texture_atlas', 'StarsSplash/frame_', 1, 15, 30, { x: -260/2, y: -265/2});
  // this.starsSplash.switchSequence('star');
  // this.starsSplash.play();
}
PanelsBlink.prototype = Object.create(PIXI.Container.prototype);
PanelsBlink.prototype.constructor = PanelsBlink;

PanelsBlink.prototype.play = function(data)
{
  var self = this;

  this.blink.visible = true;
  // this.visible = true;

  var shift = this.blink.width/2 + this.maskSprite.width/2;

  this.blink.x = -shift;

  var time = data.time;

  TweenMax.to(this.blink, time, { x: shift, ease: Power1.easeInOut, onComplete: function()
  {
    self.blink.visible = false;

    // self.play(data);
  }});
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var CardNumber = function(config)
{
  PIXI.Container.call(this);


  var self = this;

  // this.initBlockInputBg(5000, 5000, bind(function()
  // {

  // }, this));

  this.state = 'show';

  this.numberData = null;

  this.containerNumber = new PIXI.Container();
  this.addChild(this.containerNumber);

  this.number1 = new NumberField();
  this.containerNumber.addChild(this.number1);

  this.number2 = new NumberField();
  this.containerNumber.addChild(this.number2);

  this.minus = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'CardNumbers/minus.png'));
  this.containerNumber.addChild(this.minus);
  this.minus.anchor.set(0.5, 0.5);
  this.minus.scale.x = this.minus.scale.y = 0.7;
  this.minus.visible = false;

  this.containerDivLine = new PIXI.Container();
  this.containerNumber.addChild(this.containerDivLine);

  this.divLineCenter = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'CardNumbers/div_line_center.png'));
  this.containerDivLine.addChild(this.divLineCenter);
  this.divLineCenter.anchor.set(0.5, 0.5);
  this.divLineCornerLeft = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'CardNumbers/div_line_corner.png'));
  this.containerDivLine.addChild(this.divLineCornerLeft);
  this.divLineCornerLeft.anchor.set(1.0, 0.5);  
  this.divLineCornerRight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'CardNumbers/div_line_corner.png'));
  this.containerDivLine.addChild(this.divLineCornerRight);
  this.divLineCornerRight.anchor.set(1.0, 0.5);
  this.divLineCornerRight.scale.x = -1;

  this.containerDivLine.visible = false;

  if(config != undefined && config.number != undefined) this.setNumber(config.number);
}
CardNumber.prototype = Object.create(PIXI.Container.prototype);
CardNumber.prototype.constructor = CardNumber;

CardNumber.prototype.setDivLineWidth = function(w)
{
  // console.log('W:', w);
  this.divLineCenter.width = w;

  this.divLineCornerLeft.x = -w/2;
  this.divLineCornerRight.x = w/2;
}

CardNumber.prototype.setNumber = function(numberData)
{
  this.numberData = numberData;

  // console.log(numberData);

  this.number1.setNumber(this.numberData.numerator);
  this.number1.y = 0;

  this.containerDivLine.visible = false;

  if(numberData.denominator != 1)
  {
    this.number2.visible = true;

    this.number1.y = -95;
    this.number2.setNumber(this.numberData.denominator);
    this.number2.y = 95;

    // console.log(this.number1.width, this.number2.width);

    this.containerDivLine.visible = true;
    this.setDivLineWidth(Math.max(this.number1.width, this.number2.width) - 80);
  }
  else this.number2.visible = false;

  this.minus.y = 0;
  this.minus.x = -(this.containerDivLine.visible?this.containerDivLine.width/2:this.number1.width/2 - 50) - 10 - this.minus.width/2;
  this.minus.visible = this.numberData.sign < 0;

  this.containerNumber.scale.x = this.containerNumber.scale.y = 1;
  var width = this.containerNumber.width;
  var height = this.containerNumber.height;
  var maxWidth = 375-80;
  var maxHeight = 317-60;

  var wK = 1;
  var hK = 1;

  if(width > maxWidth) wK = maxWidth / width;
  if(height > maxHeight) hK = maxHeight / height;

  this.containerNumber.scale.x = this.containerNumber.scale.y = Math.min(wK, hK);
}

// CardNumber.prototype.tweenChange = function(numberData)
// {
//   var self = this;

//   TweenMax.to(this.scale, 10/30, {x: 1.2, y: 1.2, ease: Power2.easeOut});
//   TweenMax.to(this, 10/30, {alpha: 0, ease: Power2.easeOut, onComplete: function()
//   {
//     self.setNumber(numberData);

//     TweenMax.to(self.scale, 10/30, {x: 1.0, y: 1.0, ease: Power2.easeOut});
//     TweenMax.to(self, 10/30, {alpha: 1, ease: Power2.easeOut, onComplete: function()
//     {

//     }});
//   }});
// }
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var NumberField = function()
{
  PIXI.Container.call(this);


  var self = this;

  this.numberWidth = 129;
  this.numberHeight = 147;
  this.numbersShift = 5;

  this.numbers = [];

  for(var i = 0; i < 10; i++)
  {
    var number = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'CardNumbers/number_0001.png'));
    this.addChild(number);
    number.anchor.set(0.5, 0.5);
    number.visible = false;

    this.numbers.push(number);
  }
}
NumberField.prototype = Object.create(PIXI.Container.prototype);
NumberField.prototype.constructor = NumberField;

NumberField.prototype.setNumber = function(num)
{
  var s = num + '';

  var startX = 0;

  if(s.length % 2 == 0)
  {
    startX = -(this.numberWidth/2 + this.numbersShift/2) - (this.numberWidth + this.numbersShift) * (Math.floor(s.length/2) - 1);
  }
  else
  {
    startX -= (this.numberWidth + this.numbersShift) * Math.floor(s.length/2);
  }

  for(var i = 0; i < this.numbers.length; i++)
  {
    this.numbers[i].visible = false;
  }

  for(var i = 0; i < s.length; i++)
  {
    var number = this.numbers[i];
    number.texture = assetsManager.getTexture('texture_atlas', 'CardNumbers/number_000'+s[i]+'.png');

    number.x = startX + (this.numberWidth + this.numbersShift) * i;

    number.visible = true;
  }

  // this.scale.x = 1.0;
  // this.scale.y = 1.0;

  // var width = this.width;
  // var height = this.height;
  // var maxWidth = 300;

  // if(width > maxWidth)
  // {
  //   this.scale.x = this.scale.y = maxWidth/width;
  // }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //