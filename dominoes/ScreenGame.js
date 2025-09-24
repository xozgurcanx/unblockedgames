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

  // this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/tile_bg.png'));
  // this.addChild(this.bg);
  // this.bg.anchor.set(0.5, 0.5);

  this.tilesStorage = [];
  for(var i = 0; i < 28; i++)
  {
    var tile = new PanelTile();
    this.addChild(tile);
    tile.setTo({state: 'hiden'});

    this.tilesStorage.push(tile);
  }
  this.tiles = [];

  this.players = [];

  this.isNeedDisplayTargetScore = true;
  this.isGameLoaded = false;

  this.turnCompleteInfo = null;
  this.roundCompeteInfo = null;
  this.matchCompleteInfo = null;
  // this.dominoesGameInitInfo = null;
  this.dominoesGame = new DominoesGame({ victoryScores: app.victoryScores });
  this.dominoesGame.on('turn_complete', function(data)
  {
    this.turnCompleteInfo = data;
  }, this);  
  this.dominoesGame.on('round_complete', function(data)
  {
    this.roundCompeteInfo = data;
  }, this);  
  this.dominoesGame.on('match_complete', function(data)
  {
    this.matchCompleteInfo = data;
  }, this);    
  this.isAllFiveDisplayed = false;
  this.isRoundCompleteDisplayed = false;
  this.isMatchCompleteDisplayed = false;

  this.initGameInfo = null;

  this.containerPopups = new PIXI.Container();

  this.panelBoard = new PanelBoard({parentPanel: this, x: 0, y: -7});

  this.panelBazaar = new PanelBazaar({parentPanel: this, info: { type: 'bazaar'} });

  this.panelPlayerAiLeft = new PanelPlayerAi({parentPanel: this, info: { type: 'ai', side: 'left' } });
  this.panelPlayerAiTop = new PanelPlayerAi({parentPanel: this, info: { type: 'ai', side: 'top' } });
  this.panelPlayerAiRight = new PanelPlayerAi({parentPanel: this, info: { type: 'ai', side: 'right' } });
  this.panelPlayerHuman = new PanelPlayerHuman({parentPanel: this, info: { type: 'human', side: 'bot' } });

  this.playersPanels = [this.panelPlayerAiLeft, this.panelPlayerAiTop, this.panelPlayerAiRight, this.panelPlayerHuman];

  this.containerOver = new PIXI.Container();
  this.addChild(this.containerOver);

  this.addChild(this.containerPopups);

  this.panelTargetScore = new PanelTargetScore({parentPanel: this, layer: this.containerPopups});

  this.panelMenuButtons = new PanelMenuButtons({parentPanel: this});

  this.panelPopupBlocked = new PanelPopupBlocked({parentPanel: this, layer: this.containerPopups});

  this.panelMatchComplete = new PanelMatchComplete({parentPanel: this});

  this.buttonNextRound = Gui.createSimpleButton({name: 'button_next_round', parentPanel: this, layer: this.containerPopups, width: 256, height: 78, x: 0, y: 0},
  {
    pathToSkin: 'button_next_round.png',
    onClick: function()
    {
      if(self.roundCompeteInfo != null && self.isRoundCompleteDisplayed)
      {
        self.tween({name: 'hide_button_next_round'});
        for(var i = 0; i < self.players.length; i++)
        {
          self.players[i].tween({name: 'hide_anim'});
        }

        TweenMax.delayedCall(12/30, function()
        {
          self.clearAfterRound();      
          self.initRound();
          self.startGame();
        });
      }
    }
  }); 
  this.buttonNextRound.visible = false;

  this.humanRoundScore = 0;
  this.humanAllFivesMatchScore = 0;
  this.isOpponentsScoring = false;


  // var boardDebugBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Util/black_rect.png'));
  // this.panelBoard.parent.addChildAt(boardDebugBg, 0);
  // boardDebugBg.anchor.set(0.5, 0.5);
  // boardDebugBg.alpha = 0.4;
  // this.dominoesGame.initDebug(boardDebugBg);

    // var keyCode = letter.charCodeAt(0);
    // // console.log(keyCode);

    // var key = Util.keyboard(keyCode);
    // key.press = function()
    // {
    //   // console.log('KeyPress:', keyCode + ', ' + letter)
    //   app.screenGame.tryGuessLetter(letter);
    //   // app.screenGame.solved();
    // };

  if(app.isCheats)
  {
    var key = Util.keyboard('R'.charCodeAt(0));
    key.press = function()
    {
      self.cheatMatchComplete();
    };

    var key = Util.keyboard('T'.charCodeAt(0));
    key.press = function()
    {
      self.cheatRoundComplete();
    };
  }

  guiManager.on('orientation_change', this.onOrientationChange, this);
  guiManager.on('game_resize', this.onResize, this);
  // this.onOrientationChange({orientation: guiManager.orientation});

  // this.showViewRect();
  app.addForUpdate(this.update, this);

  app.on('board_style_setted', function(boardStyle)
  {
    if(boardStyle == 'minimalistic')
    {
      // app.bgGradient.texture = assetsManager.getTexture('texture_atlas', 'bg_gradient_1.png');
    }
    else if(boardStyle == 'realistic')
    {
      
    }
  }, this);
}
ScreenGame.prototype = Object.create(Gui.BasePanel.prototype);
ScreenGame.prototype.constructor = ScreenGame;

ScreenGame.prototype.onResize = function(data)
{
  this.panelBoard.width = this.width - 300;
  this.panelBoard.height = this.height - 330;
  app.screenGame.dominoesGame.setBoardSize(this.panelBoard.width, this.panelBoard.height, true);
  // this.domi
}

ScreenGame.prototype.onOrientationChange = function(data)
{
  var orientation = data.orientation;

  if(orientation == 'portrait')
  {

  }  
  if(orientation == 'landscape')
  {

  }
}

ScreenGame.prototype.update = function()
{

}

ScreenGame.prototype.toMainMenu = function()
{
  if(this.state != 'show') return;

  var self = this;

  this.tween({name: 'hide_anim'}, function()
  {
    TweenMax.delayedCall(6/30, function()
    {
      self.clear();

      app.screenMainMenu.tween({name: 'show_anim'});
    });
  });
}

ScreenGame.prototype.saveGame = function()
{
  var self = this;

  var saveData = null;
  if(this.matchCompleteInfo != null) saveData = null;
  else if(this.roundCompeteInfo != null)
  {
    saveData = 
    {
      humanRoundScore: self.humanRoundScore,
      humanAllFivesMatchScore: self.humanAllFivesMatchScore,
      isOpponentsScoring: self.isOpponentsScoring,

      isNeedDisplayTargetScore: self.isNeedDisplayTargetScore,

      dominoesGame: null,

      playersData: getPlayersData()
    };
  }
  else 
  {
    saveData = 
    {
      humanRoundScore: self.humanRoundScore,
      humanAllFivesMatchScore: self.humanAllFivesMatchScore,
      isOpponentsScoring: self.isOpponentsScoring,

      isNeedDisplayTargetScore: self.isNeedDisplayTargetScore,

      dominoesGame: self.dominoesGame.saveGame()
    };
  }

  function getPlayersData()
  {
    var playersData = [];
    for(var i = 0; i < self.dominoesGame.players.length; i++) playersData.push(self.dominoesGame.players[i].save());

    return playersData;
  }

  app.saveActiveGame(saveData);

  // console.log('Save game:', saveData);
}

ScreenGame.prototype.loadGameMatch = function(saveData)
{
  var self = this;

  var gameInfo = app.getNewGameInfo();
  this.initMatch(gameInfo);

  this.humanRoundScore = saveData.humanRoundScore;
  this.humanAllFivesMatchScore = saveData.humanAllFivesMatchScore;
  this.isOpponentsScoring = saveData.isOpponentsScoring;
  this.isNeedDisplayTargetScore = saveData.isNeedDisplayTargetScore;

  var playersData = saveData.playersData;
  for(var i = 0; i < playersData.length; i++)
  {
    for(var j = 0; j < self.dominoesGame.players.length; j++)
    {
      var gPlayer = self.dominoesGame.players[j];
      if(gPlayer.name == playersData[i].name)
      {
        gPlayer.setScore(playersData[i].score);
      }
    }
  }

  this.initRound();

  TweenMax.delayedCall(12/30, function()
  {
    self.startGame();
  });

  // console.log('Load ga match', saveData);
}

ScreenGame.prototype.loadGameFull = function(saveData)
{
  var self = this;

  // console.log('Load:', saveData);

  this.isGameLoaded = true;

  this.humanRoundScore = saveData.humanRoundScore;
  this.humanAllFivesMatchScore = saveData.humanAllFivesMatchScore;
  this.isOpponentsScoring = saveData.isOpponentsScoring;
  this.isNeedDisplayTargetScore = saveData.isNeedDisplayTargetScore;

  this.dominoesGame.loadGame(saveData.dominoesGame);
  this.dominoesGame.setBoardSize(this.panelBoard.width, this.panelBoard.height);
  this.dominoesGame.updateBoard();

  this.tiles = [];
  for(var i = 0; i < this.dominoesGame.tiles.length; i++)
  {
    var gTile = this.dominoesGame.tiles[i];
    var tile = this.tilesStorage[i];
    tile.clear();
    tile.setTile(gTile);
    this.tiles.push(tile);
  }

  this.teams = this.dominoesGame.teams;

  this.initPlayersPanels();

  for(var i = 0; i < this.players.length; i++)
  {
    var player = this.players[i];
    player.panelScore.setScore(player.gPlayer.score);

    var tiles = this.findTilesPanels(player.gPlayer.tiles);
    player.tilesContainer.addStartTiles({tiles: tiles, addType: 'hard'});
  }

  // console.log(this.dominoesGame.board);

  var boardTiles = this.findTilesPanels(this.dominoesGame.board);
  this.panelBoard.initGame();
  this.panelBoard.load(boardTiles);
  this.panelBoard.tween({name: 'show'});

  // this.panelBoard..alpha = 0;
  // TweenMax.to(this.panelBoard,)

  this.panelBazaar.load(this.findTilesPanels(this.dominoesGame.bazaar));

  TweenMax.delayedCall(15/30, function()
  {
    self.dominoesGame.doTurn();
  });
}

ScreenGame.prototype.initGameFromMainMenu = function(activeGameData)
{
  var self = this;

  this.tween({name: 'show_anim'});

  // var activeGameData = app.loadActiveGame();
  if(activeGameData == null)
  {
    activeGameData = app.loadActiveGame(app.gameData.rules, app.gameData.players, app.gameData.dificulty);
    if(activeGameData != null)
    {
      app.popupSave.show(function()
      {
       app.popupSave.tween({name: 'hide_anim'}, function()
       {
         // console.log('Selected: Yes');
         // self.toGame(activeGame);
         resumeGame(activeGameData);
       });
      },
      function()
      {
       app.popupSave.tween({name: 'hide_anim'}, function()
       {
         // console.log('Selected: No');
         startNewGame();
       });
      });
    }
    else
    {
      startNewGame();
    }

    return;
  }
  else
  {
    resumeGame(activeGameData);
  }

  function startNewGame()
  {
    var gameInfo = app.getNewGameInfo();
    self.initMatch(gameInfo);
    self.initRound();

    for(var i = 0; i < self.players.length; i++)
    {
      self.players[i].tween({name: 'show_anim'});
    }

    TweenMax.delayedCall(12/30, function()
    {
      self.startGame();
    });
  }

  function resumeGame(activeGame)
  {
    if(activeGame.dominoesGame != null) self.loadGameFull(activeGame);
    else self.loadGameMatch(activeGame);

    for(var i = 0; i < self.players.length; i++)
    {
      self.players[i].tween({name: 'show_anim'});
    }

    self.panelBoard.alpha = 0;
    TweenMax.to(self.panelBoard, 10/30, { alpha: 1, ease: Power2.easeOut })

    TweenMax.delayedCall(8/30, function()
    {
      self.startGame();
    });
  }

  // if(activeGameData == null)
  // {
  //   var gameInfo = app.getNewGameInfo();
  //   this.initMatch(gameInfo);
  //   this.initRound();
  // }
  // else 
  // {
  //   if(activeGameData.dominoesGame != null) this.loadGameFull(activeGameData);
  //   else this.loadGameMatch(activeGameData);
  // }
}

ScreenGame.prototype.clear = function()
{
  TweenMax.killAll();

  this.dominoesGame.clear();
  // this.dominoesGameInitInfo = null;

  this.turnCompleteInfo = null;
  this.roundCompeteInfo = null;
  this.matchCompleteInfo = null;

  this.isAllFiveDisplayed = false;
  this.isRoundCompleteDisplayed = false;
  this.isMatchCompleteDisplayed = false;

  this.buttonNextRound.visible = false;
  this.panelTargetScore.visible = false;

  this.humanRoundScore = 0;
  this.humanAllFivesMatchScore = 0;
  this.isOpponentsScoring = false;

  for(var i = 0; i < this.tiles.length; i++)
  {
    this.tiles[i].clear();
    // this.tilesStorage.push(this.tiles[i]);
  }
  this.tiles = [];

  for(var i = 0; i < this.players.length; i++)
  {
    this.players[i].clear();
  }
  this.players = [];

  this.panelBoard.clear();
  // this.panelBoard.alpha = 1;
  this.panelBazaar.clear();
  // this.panelBazaar.alpha = 1;

  this.panelPopupBlocked.clear();

  this.panelMatchComplete.tween({name: 'hide'});

  this.isNeedDisplayTargetScore = false;
  this.isGameLoaded = false;
  // this.containerPopups.alpha = 1;
  // this.containerOver.alpha = 1;
}

ScreenGame.prototype.clearAfterRound = function()
{
  this.turnCompleteInfo = null;
  this.roundCompeteInfo = null;
  this.matchCompleteInfo = null;

  this.isAllFiveDisplayed = false;
  this.isRoundCompleteDisplayed = false;
  this.isMatchCompleteDisplayed = false;

  this.buttonNextRound.visible = false;

  for(var i = 0; i < this.tiles.length; i++)
  {
    this.tiles[i].clear();
  }
  this.tiles = [];

  for(var i = 0; i < this.players.length; i++)
  {
    this.players[i].clear();
  }
  // this.players = [];

  this.panelBoard.clear();
  this.panelBazaar.clear();
  this.panelPopupBlocked.clear();

  this.isGameLoaded = false;
}

ScreenGame.prototype.cheatMatchComplete = function()
{
  // console.log(this.dominoesGame, this.dominoesGame.players);
  this.dominoesGame.players[0].score = 200;
  this.dominoesGame.matchComplete();

  this.displayMatchComplete(this.matchCompleteInfo);
}

ScreenGame.prototype.cheatRoundComplete = function()
{
  // console.log(this.dominoesGame, this.dominoesGame.players);
  // this.dominoesGame.players[0].score = 200;
  this.dominoesGame.roundComplete();

  this.displayRoundComplete(this.roundCompeteInfo);

  this.saveGame();
}

ScreenGame.prototype.initMatch = function(gameInfo)
{
  var self = this;

  var teams = null;

  this.humanAllFivesMatchScore = 0;
  this.isOpponentsScoring = false;

  // console.log('InitGame:', gameInfo);
  this.initGameInfo = gameInfo;

  this.isNeedDisplayTargetScore = true;

  var playersInfo = gameInfo.players;
  if(playersInfo == '1v1')
  {
    teams = 
    [
      { name: 'A', players: [createHumanPlayer()] },
      { name: 'B', players: [createAiPlayer('Bot1', gameInfo.dificulty)] }      
    ];
  }  
  else if(playersInfo == '1v2')
  {
    teams = 
    [
      { name: 'A', players: [createHumanPlayer()] },
      { name: 'B', players: [createAiPlayer('Bot1', gameInfo.dificulty)] },
      { name: 'C', players: [createAiPlayer('Bot2', gameInfo.dificulty)] }
    ];
  }  
  else if(playersInfo == '1v3')
  {
    teams = 
    [
      { name: 'A', players: [createHumanPlayer()] },
      { name: 'B', players: [createAiPlayer('Bot1', gameInfo.dificulty)] },
      { name: 'C', players: [createAiPlayer('Bot2', gameInfo.dificulty)] },
      { name: 'D', players: [createAiPlayer('Bot3', gameInfo.dificulty)] }
      
    ];
  }  
  else if(playersInfo == '2v2')
  {
    teams = 
    [
      { name: 'B', players: [createAiPlayer('Bot1', gameInfo.dificulty), createAiPlayer('Bot2', gameInfo.dificulty)] },
      { name: 'A', players: [createAiPlayer('Bot3', 'hard'), createHumanPlayer()] }
    ];
  }

  function createAiPlayer(name, dificulty)
  {
    var player = new DominoesGame.PlayerAi(name);
    player.setDificulty(dificulty);

    return player;
  }
  function createHumanPlayer()
  {
    var player = new DominoesGame.PlayerHuman('human');

    return player;
  }

  this.dominoesGame.initMatch({ teams: teams, rules: gameInfo.rules });

  // console.log('InitGame:', this.initGameInfo);

  this.initPlayersPanels();

  app.saveActiveGame(null);
}

ScreenGame.prototype.initPlayersPanels = function()
{
  // var playersInfo = this.initGameInfo.players;
  var playersInfo = app.gameData.players;

  var gPlayers = this.dominoesGame.players;
  var gPlayersAi = [];
  var gPlayerHuman = null;

  for(var i = 0; i < gPlayers.length; i++)
  {
    var gPlayer = gPlayers[i];
    if(gPlayer.type == 'ai') gPlayersAi.push(gPlayer);
    else if(gPlayer.type == 'human') gPlayerHuman = gPlayer;
  }

  var allRobotIcons = [1, 2, 3, 4, 5, 6];
  var robotIcons = [];
  while(robotIcons.length < gPlayersAi.length)
  {
    var iconN = Util.randomElement(allRobotIcons);
    allRobotIcons.splice(allRobotIcons.indexOf(iconN), 1);

    robotIcons.push(iconN);
  }

  // console.log('robotIcons:', robotIcons);

  for(var i = 0; i < gPlayersAi.length; i++)
  {
    if(gPlayersAi.length == 1 && i == 0) 
    {
      this.panelPlayerAiTop.initGame(gPlayersAi[i], robotIcons[0]);
      this.players.push(this.panelPlayerAiTop);
    }
    else if(gPlayersAi.length == 2)
    {
      if(i == 0)
      {
        this.panelPlayerAiLeft.initGame(gPlayersAi[i], robotIcons[0]);
        this.players.push(this.panelPlayerAiLeft);
      } 
      else if(i == 1)
      {
        this.panelPlayerAiRight.initGame(gPlayersAi[i], robotIcons[1]);
        this.players.push(this.panelPlayerAiRight);
      }
    }    
    else if(gPlayersAi.length == 3)
    {
      if(i == 0)
      {
        this.panelPlayerAiLeft.initGame(gPlayersAi[0], robotIcons[0]);
        this.players.push(this.panelPlayerAiLeft);
      } 
      else if(i == 1)
      {
        this.panelPlayerAiTop.initGame(gPlayersAi[1], robotIcons[1], playersInfo == '2v2');
        this.players.push(this.panelPlayerAiTop);
      }      
      else if(i == 2)
      {
        this.panelPlayerAiRight.initGame(gPlayersAi[2], robotIcons[2]);
        this.players.push(this.panelPlayerAiRight);
      }
    }
  }
  // if(gPlayersAi.length == 3)
  // {
  //   this.panelPlayerAiLeft.initGame(gPlayersAi[0], robotIcons[0]);
  //   this.players.push(this.panelPlayerAiLeft);
  //   this.panelPlayerAiRight.initGame(gPlayersAi[1], robotIcons[1]);
  //   this.players.push(this.panelPlayerAiRight);
  //   this.panelPlayerAiTop.initGame(gPlayersAi[2], robotIcons[2]);
  //   this.players.push(this.panelPlayerAiTop);
  // }

  if(gPlayerHuman != null)
  {
    this.panelPlayerHuman.initGame(gPlayerHuman);
    this.players.push(this.panelPlayerHuman);
  }

  // console.log(gPlayersAi, gPlayerHuman);
}

ScreenGame.prototype.restartMatch = function()
{
  var self = this;

  TweenMax.to(this.panelBoard, 12/30, { alpha: 0, ease: Power2.easeOut });

  TweenMax.delayedCall(12/30, function()
  {
    self.clear();
    self.initMatch(app.getNewGameInfo());
    self.initRound();

    for(var i = 0; i < self.players.length; i++)
    {
      self.players[i].tween({name: 'show_anim'});
    }

    TweenMax.delayedCall(12/30, function()
    {
      self.startGame();
    });
  });

  // this.clear();

  // this.initMatch(this.initGameInfo);
  // this.initRound();
  // this.startGame();
}

ScreenGame.prototype.initRound = function()
{
  this.initRoundInfo = this.dominoesGame.initRound();

  this.humanRoundScore = 0;

  for(var i = 0; i < this.players.length; i++)
  {
    var player = this.players[i];
    player.panelScore.setScore(player.gPlayer.score);

    // if(this.initGameInfo.players == '2v2' && player == this.panelPlayerAiTop) player.initRound({isAlli: true});
    // else player.initRound();

    if(app.gameData.players == '2v2' && player == this.panelPlayerAiTop) player.initRound({isAlli: true});
    else player.initRound();

    player.tween({name: 'show_anim'});

    // console.log('PlayerScore:', player.gPlayer.score);
  }

  this.tiles = [];

  // console.log(this.tilesStorage.length);

  var bazaarTiles = [];
  for(var i = 0; i < this.initRoundInfo.bazaar.length; i++)
  {
    var gTile = this.initRoundInfo.bazaar[i];
    var tile = this.tilesStorage[i];
    tile.setTile(gTile);
    this.tiles.push(tile);

    bazaarTiles.push(tile);
  }

  // console.log(bazaarTiles);

  this.panelBazaar.initGame(bazaarTiles);
  this.panelBoard.tween({name: 'show'});

  this.panelBoard.initGame();
}

ScreenGame.prototype.playerDisplayTurnComplete = function(player)
{
  // console.log('PlayerDisplayTurnComplete!');
  // if(this.matchCompleteInfo == null)
  // {
  this.saveGame();
  // }
  

  this.doNextAction();
  // if(this.roundCompeteInfo != null)
  // {
  //   // console.log('RRRRRRRRRRR:', this.roundCompeteInfo);
  //   this.displayRoundComplete(this.roundCompeteInfo);
  // }
  // else this.dominoesGame.doTurn();
}

ScreenGame.prototype.doNextAction = function()
{
  if(this.state != 'show') return;

  if(this.turnCompleteInfo != null && this.turnCompleteInfo.allFivesInfo != null && !this.isAllFiveDisplayed)
  {
    this.displayAllFives(this.turnCompleteInfo.allFivesInfo);
  }
  else if(this.roundCompeteInfo != null && !this.isRoundCompleteDisplayed)
  {
    this.displayRoundComplete(this.roundCompeteInfo);

    this.saveGame();
  }
  else if(this.matchCompleteInfo != null && !this.isMatchCompleteDisplayed)
  {
    this.displayMatchComplete(this.matchCompleteInfo);
  }
  // else if(this.roundCompeteInfo != null && this.isRoundCompleteDisplayed)
  // {
  //   this.clearAfterRound();
  //   this.initRound();
  //   this.startGame();
  // }
  else if(this.dominoesGame.phase == 'waiting_turn') 
  {
    this.isAllFiveDisplayed = false;
    this.isRoundCompleteDisplayed = false;
    this.isMatchCompleteDisplayed = false;

    this.dominoesGame.doTurn();
  }
  else console.log('DoNextTurn: ERR!');
}

ScreenGame.prototype.startGame = function()
{
  var self = this;

  // this.dominoesGame.initStartTiles();

  // this.dominoesGame.startGame();

  // console.log(this.dominoesGame.startTilesInfo);
  if(this.isGameLoaded)
  {
    // console.log('Start loaded game');
  }
  else if(this.isNeedDisplayTargetScore)
  {
    this.isNeedDisplayTargetScore = false;
    this.panelTargetScore.tween({name: 'show_anim'}, function()
    {
      TweenMax.delayedCall(30/30, function()
      {
        self.panelTargetScore.tween({name: 'hide_anim'}, function()
        {
          showStartTiles();
        });
      });
    });
  }
  else showStartTiles();

  function showStartTiles()
  {
    var startTilesInfo = self.dominoesGame.startTilesInfo;
    self.displayStartTiles(startTilesInfo, function()
    {
      TweenMax.delayedCall(20/30, function()
      {
        self.dominoesGame.doTurn();
      });
    });
  }



  // TweenMax.delayedCall(90/30, function()
  // {
  //   self.testReveal();
  // });
}

ScreenGame.prototype.testReveal = function()
{
  var self = this;

  for(var i = 0; i < this.players.length; i++)
  {
    var player = this.players[i];

    player.tilesContainer.revealHand();

    // player.showPopupScore(120/30, '+12');
  }

  var targetPlayer = this.panelPlayerAiTop;

  TweenMax.delayedCall(30/30, function()
  {
    for(var i = 0; i < self.players.length; i++)
    {
      var player = self.players[i];
      player.tilesContainer.fillTilesToPlayer(targetPlayer);
    }
    
    // TweenMax.delayedCall(8/30, function()
    // {
      // self.panelPlayerHuman.tilesContainer.hideHand();
      // self.panelPlayerAiLeft.tilesContainer.fillTilesToPlayer(self.panelPlayerHuman);
      // self.panelPlayerAiRight.tilesContainer.fillTilesToPlayer(self.panelPlayerHuman);
      // self.panelPlayerHuman.tilesContainer.fillTilesToPlayer(self.panelPlayerAiTop);
      // self.panelPlayerHuman.tilesContainer.fillTilesToPlayer(self.panelPlayerAiTop);
    // });
  });
}

ScreenGame.prototype.displayRoundComplete = function(roundInfo)
{
  var self = this;

  this.isNeedDisplayTargetScore = false;

  // console.log('DisplayRoundComplete:', roundInfo);

  for(var i = 0; i < this.players.length; i++)
  {
    var gPlayer = this.players[i].gPlayer;
    if(gPlayer.team != 'A' && gPlayer.score > 0) this.isOpponentsScoring = true;
    // console.log('Score:', gPlayer.score, gPlayer.team);
  }

  for(var i = 0; i < this.players.length; i++)
  {
    var player = this.players[i];
    player.tilesContainer.revealHand();
  }

  this.panelBoard.tween({name: 'hide_anim'});

  if(roundInfo.losePlayers.length == 0)
  {
    TweenMax.delayedCall(12/30, function()
    {
      self.isRoundCompleteDisplayed = true;

      if(self.matchCompleteInfo != null && !self.isMatchCompleteDisplayed) self.displayMatchComplete(self.matchCompleteInfo);
      else self.tween({name: 'show_button_next_round'});
    });

    return;
  }

  var isHumanWin = false;
  var winPlayer = null;
  for(var i = 0; i < roundInfo.winPlayers.length; i++)
  {
    var gPlayer = roundInfo.winPlayers[i];
    if(gPlayer.name == 'human')
    {
      isHumanWin = true;
      winPlayer = this.findPlayerPanel(gPlayer);
      break;
    }
  }

  // if(winPlayer == null) winPlayer = this.findPlayerPanel(roundInfo.winPlayers[0]);
  if(winPlayer == null) 
  {
    if(roundInfo.winPlayers.length == 1) winPlayer = this.findPlayerPanel(roundInfo.winPlayers[0]);
    else
    {
      var minW = -1;
      for(var i = 0; i < roundInfo.playersTilesWeight.length; i++)
      {
        for(var j = 0; j < roundInfo.winPlayers.length; j++)
        {
          if(roundInfo.playersTilesWeight[i].player == roundInfo.winPlayers[j])
          {
            var tilesWeight = roundInfo.playersTilesWeight[i].tilesWeight;
            if(winPlayer == null || tilesWeight < minW)
            {
              winPlayer = this.findPlayerPanel(roundInfo.playersTilesWeight[i].player);
              minW = tilesWeight;
            }
          }
        }        
      }
    }
  }

  for(var i = 0; i < roundInfo.playersTilesWeight.length; i++)
  {
    var gPlayer = roundInfo.playersTilesWeight[i].player;
    var player = this.findPlayerPanel(gPlayer);
    player.tempTilesWeight = roundInfo.playersTilesWeight[i].tilesWeight;
  }

  if(!isHumanWin)
  {
    app.achievementInfo({name: 'round_lose', tilesWeight: self.panelPlayerHuman.tempTilesWeight});
  }


  this.panelBoard.tween({name: 'hide_anim'});
  // if(isHumanWin) app.playAudio('sounds', 'sound_win_round', { delay: 0/30 });
  app.playAudio('sounds', 'sound_win_round', { delay: 0/30 });

  var totalTime = 30/30 + 20/30 + 16/30;

  var winPlayers = this.findPlayersPanels(roundInfo.winPlayers);
  var losePlayers = this.findPlayersPanels(roundInfo.losePlayers);

  TweenMax.delayedCall(12/30, function()
  {
    for(var i = 0; i < losePlayers.length; i++)
    {
      var player = losePlayers[i];
      player.showPopupTilesWeight(60/30, player.tempTilesWeight, winPlayer, 30/30 + 10/30*i);
    }
  });

  totalTime += 15/30*(losePlayers.length-1);

  TweenMax.delayedCall(totalTime, function()
  {
    for(var i = 0; i < winPlayers.length; i++)
    {
      var player = winPlayers[i];
      player.showPopupScore(70/30, '+'+roundInfo.playerWinScores);
    }
  });  
  TweenMax.delayedCall(totalTime+8/30, function()
  {
    for(var i = 0; i < winPlayers.length; i++)
    {
      var player = winPlayers[i];
      self.tweenPlayerScores(player, roundInfo.playerWinScores, 'round_scores');
    }
  });
    
  TweenMax.delayedCall(totalTime + 85/30, function()
  {
    self.isRoundCompleteDisplayed = true;

    if(self.matchCompleteInfo != null && !self.isMatchCompleteDisplayed) self.displayMatchComplete(self.matchCompleteInfo);
    else self.tween({name: 'show_button_next_round'});
  });

  // function findPlayerTilesWeight(gPlayer)
  // {

  // }
}

/*
ScreenGame.prototype.displayRoundComplete = function(roundInfo)
{
  var self = this;

  this.isNeedDisplayTargetScore = false;

  for(var i = 0; i < this.players.length; i++)
  {
    var gPlayer = this.players[i].gPlayer;
    if(gPlayer.team != 'A' && gPlayer.score > 0) this.isOpponentsScoring = true;
    // console.log('Score:', gPlayer.score, gPlayer.team);
  }

  // this.isRoundCompleteDisplayed = true;
  // console.log('DisplayRoundComplete:', roundInfo);

  for(var i = 0; i < this.players.length; i++)
  {
    var player = this.players[i];

    player.tilesContainer.revealHand();
  }

  var fillTilesCount = 0;

  TweenMax.delayedCall(30/30, function()
  {
    var isHumanWin = false;

    var winPlayers = [];
    for(var i = 0; i < roundInfo.winTeam.players.length; i++)
    {
      var gPlayer = roundInfo.winTeam.players[i];
      winPlayers.push(self.findPlayerPanel(gPlayer));

      if(gPlayer.name == 'human') isHumanWin = true;
    }

    if(!isHumanWin)
    {
      var humanTilesWeight = -1;
      for(var i = 0; i < roundInfo.playersTilesWeight.length; i++)
      {
        if(roundInfo.playersTilesWeight[i].player.id == self.panelPlayerHuman.id)
        {
          humanTilesWeight = roundInfo.playersTilesWeight[i].tilesWeight;
          break;
        }
      }

      app.achievementInfo({name: 'round_lose', tilesWeight: humanTilesWeight});
    }

    TweenMax.delayedCall(15/30, function()
    {
      for(var i = 0; i < winPlayers.length; i++)
      {
        var player = winPlayers[i];
        player.showPopupScore(45/30, '+'+roundInfo.winScores);
      }

      TweenMax.delayedCall(10/30, function()
      {
        for(var i = 0; i < winPlayers.length; i++)
        {
          var player = winPlayers[i];
          self.tweenPlayerScores(player, roundInfo.winScores, 'round_scores');
          // player.panelScore.tweenScoreTo(player.gPlayer.score);
        }
      });
    });

    self.panelBoard.tween({name: 'hide_anim'});

    if(isHumanWin) app.playAudio('sounds', 'sound_win_round', { delay: 0/30 });

    // TweenMax.delayedCall(70/30, function()
    // {
    //   for(var i = 0; i < self.players.length; i++)
    //   {
    //     self.players[i].tween({name: 'hide_anim'});
    //   }
    // });

    TweenMax.delayedCall(90/30, function()
    {
      self.isRoundCompleteDisplayed = true;

      if(self.matchCompleteInfo != null && !self.isMatchCompleteDisplayed) self.displayMatchComplete(self.matchCompleteInfo);
      else self.tween({name: 'show_button_next_round'});
      
      // self.doNextAction();
    });
  });

  // var ccc = 0;
  // function fillTilesComplete()
  // {
  //   ccc ++;
  //   if(ccc < self.players.length) return;

  //   TweenMax.delayedCall(50/30, function()
  //   {
  //     self.isRoundCompleteDisplayed = true;
  //     self.doNextAction();
  //   });
  // }

  // TweenMax.delayedCall(30/30, function()
  // {
    // self.panelPlayerAiLeft.tilesContainer.fillTilesToPlayer(self.panelPlayerHuman);
    // self.panelPlayerAiRight.tilesContainer.fillTilesToPlayer(self.panelPlayerHuman);
    // self.panelPlayerAiTop.tilesContainer.fillTilesToPlayer(self.panelPlayerHuman);
    // self.panelPlayerHuman.tilesContainer.fillTilesToPlayer(self.panelPlayerHuman);
    
    // TweenMax.delayedCall(8/30, function()
    // {
      // self.panelPlayerHuman.tilesContainer.hideHand();
      // self.panelPlayerAiLeft.tilesContainer.fillTilesToPlayer(self.panelPlayerHuman);
      // self.panelPlayerAiRight.tilesContainer.fillTilesToPlayer(self.panelPlayerHuman);
      // self.panelPlayerHuman.tilesContainer.fillTilesToPlayer(self.panelPlayerAiTop);
      // self.panelPlayerHuman.tilesContainer.fillTilesToPlayer(self.panelPlayerAiTop);
    // });
  // });

  // TweenMax.delayedCall(120/30, function()
  // {
  //   self.clear();
  //   self.initGame(self.ggg);
  //   self.startGame();
  // });
}
*/

ScreenGame.prototype.displayAllFives = function(allFivesInfo)
{
  var self = this;

  // console.log('displayAllFives!');

  for(var i = 0; i < allFivesInfo.team.players.length; i++)
  {
    var gPlayer = allFivesInfo.team.players[i];
    var player = this.findPlayerPanel(gPlayer);
    player.showPopupScore(40/30, '+'+allFivesInfo.summ);
  }

  for(var i = 0; i < allFivesInfo.outerTiles.length; i++)
  {
    var gTile = allFivesInfo.outerTiles[i];
    var tile = this.findTilePanel(gTile);

    var side = '';
    if(gTile.next['left'].tile == null && gTile.next['right'].tile == null && gTile.next['up'].tile == null && gTile.next['down'].tile == null) side = 'full';
    else if(gTile.isDupel)
    {
      if(gTile.next['left'].tile == null) side = 'left';
      else if(gTile.next['right'].tile == null) side = 'right';
      else if(gTile.next['up'].tile == null && gTile.next['down'].tile == null) side = 'full';
      else if(gTile.next['up'].tile == null) side = 'up';
      else if(gTile.next['down'].tile == null) side = 'down';
    }
    else 
    {
      if(gTile.next['up'].tile == null) side = 'up';
      else if(gTile.next['down'].tile == null) side = 'down';
    }
    tile.tween({name: 'show_selection_outline', side: side, hideDelay: 21/30});
  }

  TweenMax.delayedCall(12/30, function()
  {
    for(var i = 0; i < allFivesInfo.team.players.length; i++)
    {
      var gPlayer = allFivesInfo.team.players[i];
      var player = self.findPlayerPanel(gPlayer);
      // player.panelScore.tweenScoreTo(player.gPlayer.score);
      self.tweenPlayerScores(player, allFivesInfo.summ, 'all_fives_scores');
    }
  });

  app.playAudio('sounds', 'sound_bonus_points', { delay: 3/30 });

  TweenMax.delayedCall(32/30, function()
  {
    self.isAllFiveDisplayed = true;
    self.doNextAction();
  });
}

ScreenGame.prototype.displayMatchComplete = function(matchInfo)
{
  var self = this;

  // console.log('Display match complete!', matchInfo);

  this.isMatchCompleteDisplayed = true;

  var isHumanWin = false;

  for(var i = 0; i < matchInfo.winTeam.players.length; i++)
  {
    var gPlayer = matchInfo.winTeam.players[i];
    var player = this.findPlayerPanel(gPlayer);

    player.panelScore.tweenWin();

    if(gPlayer.name == 'human') isHumanWin = true;
  }

  if(isHumanWin)
  {
    app.achievementInfo({name: 'match_win', players: app.gameData.players, dificulty: app.gameData.dificulty, rules: app.gameData.rules, isOpponentsScoring: this.isOpponentsScoring });
  }

  var endDelay;

  if(self.players[0].panelState != 'hide')
  {
    TweenMax.delayedCall(20/30, function()
    {
      for(var i = 0; i < self.players.length; i++)
      {
        self.players[i].tween({name: 'hide_anim'});
      }

      self.panelBoard.tween({name: 'hide_anim'});
    });

    endDelay = 35/30;
  }
  else 
  {
    endDelay = 5/30;
  }

  TweenMax.delayedCall(endDelay, function()
  {
    self.panelMatchComplete.show(app.gameData.players, matchInfo);

    if(isHumanWin) app.playAudio('sounds', 'sound_win_match', { delay: 6/30 });
  });  
}

ScreenGame.prototype.tweenPlayerScores = function(player, plusScore, type)
{
  var maxScore = this.dominoesGame.victoryScore;
  var playerScore = Math.round(player.panelScore.score + plusScore);
  // if(playerScore > maxScore) playerScore = maxScore;

  player.panelScore.tweenScoreTo(playerScore);

  if(player == this.panelPlayerHuman)
  {
    if(type == 'round_scores') 
    {
      this.humanRoundScore += plusScore;
      app.achievementInfo({name: 'human_round_score', score: this.humanRoundScore});
    }
    else if(type == 'all_fives_scores') 
    {
      this.humanAllFivesMatchScore += plusScore;
      app.achievementInfo({name: 'human_all_five_score', score: this.humanAllFivesMatchScore});
    }
  }
  else 
  {
    if(app.gameData.players == '2v2')
    {
      if(player != this.panelPlayerAiTop) this.isOpponentsScoring = true;
    }
    else this.isOpponentsScoring = true;
  }
}

ScreenGame.prototype.displayInitGame = function(data, callback)
{

}
ScreenGame.prototype.displayStartTiles = function(startTilesInfo, callback)
{
  var self = this;
  // console.log(this.tiles);

  this.panelBazaar.tween({name: 'show'}, function()
  {
    TweenMax.delayedCall(15/30, function()
    {
      for(var i = 0; i < startTilesInfo.length; i++)
      {
        var playerPanel = self.findPlayerPanel(startTilesInfo[i].player);
        var startTiles = self.findTilesPanels(startTilesInfo[i].tiles);

        playerPanel.tilesContainer.addStartTiles({tiles: startTiles}, playerShowComplete);
      }
    });
  });

  var playersShowed = 0;
  function playerShowComplete()
  {
    playersShowed ++;
    if(playersShowed < self.players.length) return;

    TweenMax.delayedCall(15/30, function()
    {
      self.panelBazaar.tween({name: 'hide'}, function()
      {
        if(callback) callback();
      });
    })
  }
}

ScreenGame.prototype.findTilePanel = function(gTile)
{
  for(var i = 0; i < this.tiles.length; i++)
  {
    if(this.tiles[i].gTile == gTile) return this.tiles[i];
  }

  return null;
}

ScreenGame.prototype.findTilesPanels = function(gTiles)
{
  var tiles = [];

  for(var i = 0; i < gTiles.length; i++)
  {
    tiles.push(this.findTilePanel(gTiles[i]));
  }

  return tiles;
}

ScreenGame.prototype.findPlayerPanel = function(gPlayer)
{
  for(var i = 0; i < this.players.length; i++)
  {
    if(this.players[i].gPlayer == gPlayer) return this.players[i];
  }

  return null;
}
ScreenGame.prototype.findPlayersPanels = function(gPlayers)
{
  var panels = [];
  for(var i = 0; i < gPlayers.length; i++)
  {
    var player = this.findPlayerPanel(gPlayers[i]);
    if(player != null) panels.push(player);
  }

  return panels;
}

ScreenGame.prototype.getPanelBazaarShowPosition = function()
{
  return new PIXI.Point(0, -150);
}

ScreenGame.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_button_next_round')
  {
    this.buttonNextRound.visible = true;
    this.buttonNextRound.y = -80;
    this.buttonNextRound.alpha = 0;
    this.buttonNextRound.interactive = false;
    TweenMax.to(this.buttonNextRound, 10/30, {alpha: 1, y: 0, ease: Power2.easeOut, onComplete: function()
    {
      self.buttonNextRound.interactive = true;
    }});
  }
  if(data.name == 'hide_button_next_round')
  {
    this.buttonNextRound.interactive = false;
    TweenMax.to(this.buttonNextRound, 10/30, {alpha: 0, y: -80, ease: Power2.easeOut, onComplete: function()
    {
      self.buttonNextRound.visible = false;
    }});
  }

  if(data.name == 'show_anim' && this.state == 'hide')
  {
    this.state = 'show_anim';

    this.visible = true;
    this.alpha = 0;

    var time = 14/30;
    var showDelay = 0/30;

    this.alpha = 1;
    TweenMax.to(this, time, {alpha: 1, x: 0, y: 0, ease: Power2.easeOut, delay: showDelay});

    for(var i = 0; i < this.playersPanels.length; i++)
    {
      this.playersPanels[i].tween({name: 'hide'});
    }
    // for(var i = 0; i < this.players.length; i++)
    // {
    //   this.players[i].tween({name: 'show_anim'});
    // }

    this.panelMenuButtons.tween({name: 'show_anim'});

    TweenMax.delayedCall(time, function()
    {
      // self.startGame();

      self.tween({name: 'show'}, callback);
    });
  }

  if(data.name == 'hide_anim' && this.state == 'show')
  {
    this.state = 'hide_anim';
    this.interactiveChildren = false;

    var time = 14/30;
    var showDelay = 0/30;

    for(var i = 0; i < this.players.length; i++)
    {
      this.players[i].tween({name: 'hide_anim'});
    }

    TweenMax.to(this.panelBoard, 12/30, { alpha: 0, ease: Power2.easeOut });
    // TweenMax.to(this.panelBazaar, 12/30, { alpha: 0, ease: Power2.easeOut });
    // TweenMax.to(this.containerPopups, 12/30, { alpha: 0, ease: Power2.easeOut });
    // TweenMax.to(this.containerOver, 12/30, { alpha: 0, ease: Power2.easeOut });

    // TweenMax.to()

    TweenMax.to(this, 6/30, { alpha: 0, ease: Power2.easeOut, delay: 8/30 });

    this.panelMenuButtons.tween({name: 'hide_anim'});

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

    // this.panelMatchComplete.show('2v2', null);

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
var PanelMenuButtons = function(config)
{
  config.width = 178;
  config.height = 50;
  config.positionType = 'left-top';
  config.xRelative = 8;
  config.yRelative = 8;
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

  this.state = 'show';
  // this.visible = false;
  // this.interactiveChildren = false;
  // this.alpha = 0;

  this.buttonHome = Gui.createSimpleButton({name: 'button_home', parentPanel: this, width: 50, height: 50, x: -64, y: 0},
  {
    pathToSkin: 'button_home_orange.png',
    onClick: function()
    {
      app.screenGame.toMainMenu();
    }
  }); 
  
  this.buttonSettings = Gui.createSimpleButton({name: 'button_settings', parentPanel: this, width: 50, height: 50, x: 0, y: 0},
  {
    pathToSkin: 'button_settings_1.png',
    onClick: function()
    {
      if(app.screenGame.state == 'show' && app.panelSettings.state == 'hide') app.panelSettings.tween({name: 'show_anim'});
    }
  });   

  this.buttonHelp = Gui.createSimpleButton({name: 'button_help', parentPanel: this, width: 50, height: 50, x: 64, y: 0},
  {
    pathToSkin: 'button_help_1.png',
    onClick: function()
    {
      if(self.state != 'show' || app.panelHelp.state != 'hide' || app.panelSettings.state != 'hide') return;

      app.panelHelp.tween({ type: 'small', name: 'show_anim' })
    }
  }); 

  app.on('board_style_setted', function(boardStyle)
  {
    // console.log('BS:', boardStyle);
    if(boardStyle == 'minimalistic')
    {
      this.buttonHome.skin.texture = assetsManager.getTexture('texture_atlas', 'button_home_orange.png');
      this.buttonSettings.skin.texture = assetsManager.getTexture('texture_atlas', 'button_settings_1.png');
      this.buttonHelp.skin.texture = assetsManager.getTexture('texture_atlas', 'button_help_1.png');
    }
    else if(boardStyle == 'realistic')
    {
      this.buttonHome.skin.texture = assetsManager.getTexture('texture_atlas', 'button_home_red.png');
      this.buttonSettings.skin.texture = assetsManager.getTexture('texture_atlas', 'button_settings_2.png');
      this.buttonHelp.skin.texture = assetsManager.getTexture('texture_atlas', 'button_help_2.png');
    }
  }, this);
}
PanelMenuButtons.prototype = Object.create(Gui.BasePanel.prototype);
PanelMenuButtons.prototype.constructor = PanelMenuButtons;

PanelMenuButtons.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim')
  {
    this.state = 'show_anim';
    this.visible = true;

    this.alpha = 0;
    this.yRelative = -50;

    var time = 14 / 30;

    TweenMax.to(this, time, {alpha: 1, yRelative: 8, ease: Power3.easeOut, onComplete: function()
    {
      self.tween({name: 'show'}, callback);
    }});
  }

  if(data.name == 'hide_anim' && this.state == 'show')
  {
    this.state = 'hide_anim';
    this.interactiveChildren = false;

    var time = 20 / 30;

    TweenMax.to(this, time, {alpha: 0, yRelative: -50, ease: Power3.easeOut, onComplete: function()
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

    if(callback) callback();
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelTargetScore = function(config)
{
  config.width = 459;
  config.height = 132;
  // config.positionType = 'left-top';
  // config.xRelative = 8;
  // config.yRelative = 8;
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
  // this.visible = false;
  // this.interactiveChildren = false;
  // this.alpha = 0;

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'panel_target_score_bg.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  this.textScore = Util.setParams(new Gui.TextBmp('Score 150 to win',  constsManager.getData('text_configs/target_score')), {parent: this, aX:0.5, aY:0.5, x: 0, y: 3});

  app.on('board_style_setted', function(boardStyle)
  {
    // console.log('BS:', boardStyle);
    if(boardStyle == 'minimalistic')
    {

    }
    else if(boardStyle == 'realistic')
    {

    }
  }, this);

  this.visible = false;
}
PanelTargetScore.prototype = Object.create(Gui.BasePanel.prototype);
PanelTargetScore.prototype.constructor = PanelTargetScore;

PanelTargetScore.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim')
  {
    this.state = 'show_anim';
    this.visible = true;

    this.textScore.text = 'Score ' + app.screenGame.dominoesGame.victoryScore + ' to win';

    this.alpha = 0;
    this.y = -50;

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

    TweenMax.to(this, time, {alpha: 0, y: -50, ease: Power3.easeOut, onComplete: function()
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

    if(callback) callback();
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelMatchComplete = function(config)
{
  config.width = 496;
  config.height = 800;
  Gui.BasePanel.call(this, config);


  var self = this;


  this.initBlockInputBg(2000, 2000, function()
  {

  });
  // this.invisibleBg.interactive = false; 

  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;
  // this.alpha = 0;

  this.darkBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Util/black_rect.png'));
  this.addChild(this.darkBg);
  this.darkBg.anchor.set(0.5, 0.5);
  this.darkBg.width = 5000;
  this.darkBg.height = 2000;
  this.darkBg.alpha = 0.6;

  this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_match_complete_bg_corner.png');
  this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_match_complete_bg_body.png');

  this.bgItemTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_match_complete_item_bg.png');

  this.bgCornerUp = new PIXI.Sprite(this.bgCornerTexture);
  this.addChild(this.bgCornerUp);
  this.bgCornerUp.anchor.set(0.5, 1);
  this.bgBody = new PIXI.Sprite(this.bgBodyTexture);
  this.addChild(this.bgBody);
  this.bgBody.anchor.set(0.5, 0.5);
  this.bgCornerDown = new PIXI.Sprite(this.bgCornerTexture);
  this.addChild(this.bgCornerDown);
  this.bgCornerDown.anchor.set(0.5, 1);
  this.bgCornerDown.scale.y = -1;

  this.textTitle = Util.setParams(new Gui.TextBmp('Game Over',  constsManager.getData('text_configs/panel_match_complete_title')), {parent: this, aX:0.5, aY:0.5, x: 0, y: 0});
  // this.textResult = Util.setParams(new Gui.TextBmp('Bot1 won the game.',  constsManager.getData('text_configs/panel_match_complete_result')), {parent: this, aX:0.5, aY:0.5, x: 0, y: 0});

  this.containerItems = new PIXI.Container();
  this.addChild(this.containerItems);

  this.items = [];
  for(var i = 0; i < 4; i++)
  {
    var item = this.createItem();
    this.items.push(item);
  }

  // this.buttonClose = Gui.createSimpleButton({name: 'button_close', parentPanel: this, width: 46, height: 46, x: this.width/2-46/2, y: -this.height/2+46/2},
  // {
  //   pathToSkin: 'Theme1/panel_match_complete_button_close.png',
  //   onClick: function()
  //   {
  //     if(self.state == 'show')
  //     {
  //       self.tween({name: 'hide_anim'}, function()
  //       {
  //         app.screenGame.restartMatch();
  //       });
  //     }
  //   }
  // }); 

  this.buttonHome = Gui.createSimpleButton({name: 'button_home', parentPanel: this, width: 307, height: 93, x: 0, y: 0},
  {
    pathToSkin: 'Theme1/panel_match_complete_button_home.png',
    onClick: function()
    {
      if(self.state == 'show')
      {
        self.tween({name: 'hide_anim'}, function()
        {
          app.screenGame.toMainMenu();
        });
      }
    }
  }); 
  this.buttonPlayAgain = Gui.createSimpleButton({name: 'button_play_again', parentPanel: this, width: 307, height: 93, x: 0, y: 0},
  {
    pathToSkin: 'Theme1/panel_match_complete_button_play_again.png',
    onClick: function()
    {
      if(self.state == 'show')
      {
        self.tween({name: 'hide_anim'}, function()
        {
          app.screenGame.restartMatch();
        });
      }
    }
  }); 

  // console.log(this.visible);
  // this.buttonClose.isClickTween = false;

  app.on('board_style_setted', function(boardStyle)
  {
    if(boardStyle == 'minimalistic')
    {
      this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_match_complete_bg_corner.png');
      this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_match_complete_bg_body.png');

      this.bgItemTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_match_complete_item_bg.png');
    }
    else if(boardStyle == 'realistic')
    {
      this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme2/panel_match_complete_bg_corner.png');
      this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme2/panel_match_complete_bg_body.png');

      this.bgItemTexture = assetsManager.getTexture('texture_atlas', 'Theme2/panel_match_complete_item_bg.png');
    }

    this.bgCornerDown.texture = this.bgCornerTexture;
    this.bgCornerUp.texture = this.bgCornerTexture;
    this.bgBody.texture = this.bgBodyTexture;

    for(var i = 0; i < this.items.length; i++) this.items[i].bg.texture = this.bgItemTexture;
  }, this);
}
PanelMatchComplete.prototype = Object.create(Gui.BasePanel.prototype);
PanelMatchComplete.prototype.constructor = PanelMatchComplete;

PanelMatchComplete.prototype.createItem = function()
{
  var item = {};

  var container = new PIXI.Container();
  this.containerItems.addChild(container);

  var bg = new PIXI.Sprite(this.bgItemTexture);
  container.addChild(bg);
  bg.anchor.set(0.5, 0.5);

  item.bg = bg;

  var icon = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/icon_robot_normal_0003.png'));
  container.addChild(icon);
  icon.anchor.set(0.5, 0.5);
  icon.visible = false;

  var icon2 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/icon_robot_normal_0003.png'));
  container.addChild(icon2);
  icon2.anchor.set(0.5, 0.5);
  icon2.visible = false;

  var playersPlus = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'players_plus.png'));
  container.addChild(playersPlus);
  playersPlus.anchor.set(0.5, 0.5);
  playersPlus.visible = false;

  var textLabel = Util.setParams(new Gui.TextBmp('nnn',  constsManager.getData('text_configs/panel_match_complete_item')), {parent: container, aX:0.0, aY:0.5, x: 0, y: 4});
  var textScore = Util.setParams(new Gui.TextBmp('000',  constsManager.getData('text_configs/panel_match_complete_item')), {parent: container, aX:0.5, aY:0.5, x: 0, y: 4});

  item.container = container;

  item.textLabel = textLabel;
  item.textScore = textScore;

  item.icon = icon;
  item.icon2 = icon2;
  item.playersPlus = playersPlus;

  item.setTo = function(info)
  {
    item.container.visible = true;
    item.container.y = info.y;

    item.icon2.visible = false;

    if(info.type == 'ai' || info.type == 'human')
    {
      item.playersPlus.visible = false;

      if(info.icon == null)
      {
        item.icon.visible = false;

        item.textLabel.visible = true;
        item.textLabel.text = info.label;
        item.textLabel.x = -416/2 + 20;
        item.textLabel.scale.x = item.textLabel.scale.y = 1.0;
      }
      else
      {
        item.icon.visible = true;
        item.icon.texture = info.icon;
        item.icon.x = -416/2 + item.icon.width/2 + 10;

        item.textLabel.visible = false;
        // item.textLabel.x = item.icon.x + item.icon.width/2 + 10;
      }
    }
    else if(info.type == 'ai_human')
    {
      item.icon.visible = true;
      item.icon.texture = info.icon2;
      item.icon.x = -416/2 + item.icon.width/2 + 10;

      item.playersPlus.visible = true;
      item.playersPlus.x = item.icon.x + item.icon.width/2 + 20;

      item.textLabel.visible = true;
      item.textLabel.text = info.label;
      item.textLabel.x = item.icon.x + item.icon.width/2 + 45;
      item.textLabel.scale.x = item.textLabel.scale.y = 1.2;
    }
    else if(info.type == 'ai_ai')
    {
      item.icon.visible = true;
      item.icon.texture = info.icon;
      item.icon.x = -416/2 + item.icon.width/2 + 10;

      item.playersPlus.visible = true;
      item.playersPlus.x = item.icon.x + item.icon.width/2 + 20;

      item.icon2.visible = true;
      item.icon2.texture = info.icon2;
      item.icon2.x = item.icon.x + 100;

      item.textLabel.visible = false;
    }

    item.textScore.text = info.score;
    item.textScore.x = 416/2-45;

    // console.log('item set to', info);
  }

  return item;
}

PanelMatchComplete.prototype.show = function(playersMode, matchInfo)
{
  // console.log('SSS', playersMode, matchInfo);

  var isHumanWin = false;
  for(var i = 0; i < matchInfo.winTeam.players.length; i++)
  {
    if(matchInfo.winTeam.players[i].name == 'human')
    {
      isHumanWin = true;
      break;
    }
  }

  var resultText = 'Result text.';

  var itemsInfo = [];

  if(playersMode == '2v2')
  {
    var humanTeam = null;
    var enemyTeam = null;
    for(var i = 0; i < matchInfo.teams.length; i++)
    {
      var team = matchInfo.teams[i];

      var isHumanTeam = false;
      for(var j = 0; j < team.players.length; j++)
      {
        if(team.players[j].name == 'human')
        {
          isHumanTeam = true;
          break;
        }
      }
      if(isHumanTeam) humanTeam = team;
      else enemyTeam = team;
    }

    itemsInfo.push({ type: 'ai_human', icon: null, icon2: app.screenGame.panelPlayerAiTop.iconRobot.texture, label: 'You', score: humanTeam.players[0].score });
    itemsInfo.push({ type: 'ai_ai', icon: app.screenGame.panelPlayerAiLeft.iconRobot.texture, icon2: app.screenGame.panelPlayerAiRight.iconRobot.texture, label: '', score: enemyTeam.players[0].score });

    if(isHumanWin) 
    {
      resultText = 'You Won';
    }
    else 
    {
      resultText = 'Game Over';
    }
  }
  else 
  {
    // console.log('Players:', matchInfo.players);
    for(var i = 0; i < matchInfo.players.length; i++)
    {
      var gPlayer = matchInfo.players[i];
      var player = app.screenGame.findPlayerPanel(gPlayer);

      if(gPlayer.name == 'human')
      {
        itemsInfo.push({ type: 'human', icon: null, label: 'You', score: gPlayer.score });
      }
      else
      {
        itemsInfo.push({ type: 'ai', icon: player.iconRobot.texture, label: '', score: gPlayer.score });
      }
    }

    if(isHumanWin) 
    {
      resultText = 'You Won';
    }
    else 
    {
      resultText = 'Game Over';
    }
  }

  this.setItems(itemsInfo);

  // this.textResult.text = resultText;
  this.textTitle.text = resultText;


  this.setBgHeight(this.containerItems.height + 390);

  this.tween({name: 'show_anim'});
}

PanelMatchComplete.prototype.setItems = function(itemsInfo)
{
  // console.log('items:', itemsInfo);
  itemsInfo.sort(function(i1, i2)
  {
    return i2.score - i1.score;
  });

  for(var i = 0; i < 4; i++)
  {
    if(i < itemsInfo.length)
    {
      var itemInfo = itemsInfo[i];

      itemInfo.y = 100/2 + ((100 + 10) * i);

      this.items[i].setTo(itemInfo);
      // console.log('zzz', i, itemInfo);
    }
    else this.items[i].container.visible = false;
  }
}

PanelMatchComplete.prototype.setBgHeight = function(height)
{
  this.height = height;

  var bodyHeight = height - this.bgCornerUp.height - this.bgCornerDown.height;
  this.bgCornerUp.y = -bodyHeight/2;
  this.bgBody.height = bodyHeight;
  this.bgCornerDown.y = bodyHeight/2;

  // this.buttonClose.x = this.width/2-46/2;
  // this.buttonClose.y = -this.height/2+46/2;

  this.buttonHome.y = this.height/2 - 180;
  this.buttonPlayAgain.y = this.height/2 - 75;

  this.textTitle.y = -this.height/2 + 75;
  // this.textResult.y = -this.height/2 + 100;

  this.containerItems.y = -this.height/2 + 140;
}

PanelMatchComplete.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim' && this.state == 'hide')
  {
    this.state = 'show_anim';
    this.visible = true;

    this.alpha = 0;
    this.y = -50;

    var time = 12 / 30;

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
var PanelPopupBlocked = function(config)
{
  config.width = 240;
  config.height = 114;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.bgH = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/popup_blocked_h.png'));
  this.addChild(this.bgH);
  this.bgH.anchor.set(0.5, 0.5);

  this.bgV = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/popup_blocked_v.png'));
  this.addChild(this.bgV);
  this.bgV.anchor.set(0.5, 0.5);

  this.label = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/popup_blocked_label.png'));
  this.addChild(this.label);
  this.label.anchor.set(0.5, 0.5);

  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;
  this.alpha = 0;
}
PanelPopupBlocked.prototype = Object.create(Gui.BasePanel.prototype);
PanelPopupBlocked.prototype.constructor = PanelPopupBlocked;

PanelPopupBlocked.prototype.clear = function()
{
  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;
  this.alpha = 0;

  this.scale.x = this.scale.y = 0;
  this.x = this.y = 0;
}

PanelPopupBlocked.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim')
  {
    this.state = 'show_anim';
    this.visible = true;

    var side = data.side;

    var startX = data.x;
    var startY = data.y;

    var startShift = 50;

    this.bgV.visible = false;
    this.bgH.visible = false;

    if(side == 'bot')
    {
      this.bgH.visible = true;
      this.bgH.scale.y = 1;

      startY -= startShift;
    }
    if(side == 'top')
    {
      this.bgH.visible = true;
      this.bgH.scale.y = -1;

      startY += startShift;
    }
    if(side == 'right')
    {
      this.bgV.visible = true;
      this.bgV.scale.x = 1;

      startX -= startShift;
    }
    if(side == 'left')
    {
      this.bgV.visible = true;
      this.bgV.scale.x = -1;

      startX += startShift;
    }

    var time = 8 / 30;

    this.alpha = 0;
    this.x = startX;
    this.y = startY;

    this.scale.x = this.scale.y = 1.2;

    TweenMax.to(this.scale, time, {x: 1.0, y: 1.0, ease: Power3.easeOut});
    TweenMax.to(this, time, {alpha: 1, x: data.x, y: data.y, ease: Power3.easeOut, onComplete: function()
    {
      self.tween({name: 'show'}, callback);
    }});

    // TweenMax.

    // console.log('Show popup:', data);
  }

  if(data.name == 'hide_anim' && this.state == 'show')
  {
    this.state = 'hide_anim';
    this.interactiveChildren = false;

    var side = data.side;

    var targetX = this.x;
    var targetY = this.y;

    var startShift = 50;

    if(side == 'bot')
    {
      targetY -= startShift;
    }
    if(side == 'top')
    {
      targetY += startShift;
    }
    if(side == 'right')
    {
      targetX -= startShift;
    }
    if(side == 'left')
    {
      targetX += startShift;
    }

    var time = 8 / 30;

    TweenMax.to(this, time, {alpha: 0, x: targetX, y: targetY, ease: Power3.easeOut, onComplete: function()
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

    if(callback) callback();
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelPopupScore = function(config)
{
  config.width = 140;
  config.height = 140;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.bgH = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/popup_score_h.png'));
  this.addChild(this.bgH);
  this.bgH.anchor.set(0.5, 0.5);

  this.bgV = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/popup_score_v.png'));
  this.addChild(this.bgV);
  this.bgV.anchor.set(0.5, 0.5);

  this.bgR = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/popup_score_r.png'));
  this.addChild(this.bgR);
  this.bgR.anchor.set(0.5, 0.5);

  this.textScore = Util.setParams(new Gui.TextBmp('82',  constsManager.getData('text_configs/popup_score_text')), {parent: this, aX:0.5, aY:0.5, x: -5, y: 5});

  // this.label = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/popup_blocked_label.png'));
  // this.addChild(this.label);
  // this.label.anchor.set(0.5, 0.5);

  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;
  this.alpha = 0;
}
PanelPopupScore.prototype = Object.create(Gui.BasePanel.prototype);
PanelPopupScore.prototype.constructor = PanelPopupScore;

PanelPopupScore.prototype.clear = function()
{
  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;
  this.alpha = 0;

  this.scale.x = this.scale.y = 0;
  this.x = this.y = 0;
}

PanelPopupScore.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_tiles_weight')
  {
    this.state = 'show_tiles_weight';
    this.visible = true;

    this.textScore.text = data.text;

    var side = data.side;

    var startX = data.x;
    var startY = data.y;

    var startShift = 50;

    this.bgV.visible = false;
    this.bgH.visible = false;
    this.bgR.visible = false;

    this.bgR.visible = true;

    if(side == 'bot')
    {
      startY -= startShift;
    }
    if(side == 'top')
    {
      startY += startShift;
    }
    if(side == 'right')
    {
      startX -= startShift;
    }
    if(side == 'left')
    {
      startX += startShift;
    }

    var time = 8 / 30;

    this.alpha = 0;
    this.x = startX;
    this.y = startY;

    this.scale.x = this.scale.y = 1.2;

    TweenMax.to(this.scale, time, {x: 1.0, y: 1.0, ease: Power3.easeOut});
    TweenMax.to(this, time, {alpha: 1, x: data.x, y: data.y, ease: Power3.easeOut, onComplete: function()
    {
      TweenMax.to(self, 15/30, { alpha: 0, x: data.targetX, y: data.targetY, ease: Power1.easeInOut, delay: data.waitDelay, onComplete: function()
      {
        self.tween({name: 'hide'}, callback);
      }});
    }});
  }

  if(data.name == 'show_anim')
  {
    this.state = 'show_anim';
    this.visible = true;

    var type = data.type;
    if(type == undefined) type = 'normal';

    this.textScore.text = data.text;

    var side = data.side;

    var startX = data.x;
    var startY = data.y;

    var startShift = 50;

    this.bgV.visible = false;
    this.bgH.visible = false;
    this.bgR.visible = false;

    if(type == 'rect')
    {
      this.bgR.visible = true;
    }

    if(side == 'bot')
    {
      if(type == 'normal')
      {
        this.bgH.visible = true;
        this.bgH.scale.y = 1;
      }

      startY -= startShift;
    }
    if(side == 'top')
    {
      if(type == 'normal')
      {
        this.bgH.visible = true;
        this.bgH.scale.y = -1;
      }

      startY += startShift;
    }
    if(side == 'right')
    {
      if(type == 'normal')
      {
        this.bgV.visible = true;
        this.bgV.scale.x = 1;
      }

      startX -= startShift;
    }
    if(side == 'left')
    {
      if(type == 'normal')
      {
        this.bgV.visible = true;
        this.bgV.scale.x = -1;
      }

      startX += startShift;
    }

    var time = 8 / 30;

    this.alpha = 0;
    this.x = startX;
    this.y = startY;

    this.scale.x = this.scale.y = 1.2;

    TweenMax.to(this.scale, time, {x: 1.0, y: 1.0, ease: Power3.easeOut});
    TweenMax.to(this, time, {alpha: 1, x: data.x, y: data.y, ease: Power3.easeOut, onComplete: function()
    {
      self.tween({name: 'show'}, callback);
    }});

    // TweenMax.

    // console.log('Show popup:', data);
  }

  if(data.name == 'hide_anim' && this.state == 'show')
  {
    this.state = 'hide_anim';
    this.interactiveChildren = false;

    var side = data.side;

    var targetX = this.x;
    var targetY = this.y;

    var startShift = 50;

    if(side == 'bot')
    {
      targetY -= startShift;
    }
    if(side == 'top')
    {
      targetY += startShift;
    }
    if(side == 'right')
    {
      targetX -= startShift;
    }
    if(side == 'left')
    {
      targetX += startShift;
    }

    var time = 8 / 30;

    TweenMax.to(this, time, {alpha: 0, x: targetX, y: targetY, ease: Power3.easeOut, onComplete: function()
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

    if(callback) callback();
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PopupSave = function(config)
{
  config.width = 600;
  config.height = 211;
  // config.positionType = 'left-top';
  // config.xRelative = 8;
  // config.yRelative = 8;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.initBlockInputBg(4000, 2000, function()
  {

  });
  this.invisibleBg.interactive = true; 
  this.invisibleBg.texture = assetsManager.getTexture('texture_atlas', 'Util/black_rect.png'); 
  this.invisibleBg.alpha = 0.5;

  this.state = 'hide';
  this.visible = false;
  this.interactiveChildren = false;
  this.alpha = 0;

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'popup_save_bg.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  this.callbackNo = null;
  this.callbackYes = null;

  this.buttonNo = Gui.createSimpleButton({name: 'button_no', parentPanel: this, width: 135, height: 58, x: -118, y: 57},
  {
    pathToSkin: 'button_no.png',
    onClick: function()
    {
      if(self.state != 'show') return;

      self.callbackNo();
    }
  }); 

  this.buttonYes = Gui.createSimpleButton({name: 'button_yes', parentPanel: this, width: 135, height: 58, x: 118, y: 57},
  {
    pathToSkin: 'button_yes.png',
    onClick: function()
    {
      if(self.state != 'show') return;

      self.callbackYes();
    }
  }); 

  app.on('board_style_setted', function(boardStyle)
  {
    if(boardStyle == 'minimalistic')
    {
      this.bg.texture = assetsManager.getTexture('texture_atlas', 'popup_save_bg.png');
    }
    else if(boardStyle == 'realistic')
    {
      this.bg.texture = assetsManager.getTexture('texture_atlas', 'popup_save_bg_green.png');
    }
  }, this);
}
PopupSave.prototype = Object.create(Gui.BasePanel.prototype);
PopupSave.prototype.constructor = PopupSave;

PopupSave.prototype.show = function(callbackYes, callbackNo)
{
  this.callbackNo = callbackNo;
  this.callbackYes = callbackYes;

  this.tween({name: 'show_anim'});
}

PopupSave.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim')
  {
    this.state = 'show_anim';
    this.visible = true;

    this.alpha = 0;
    this.y = -100;

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