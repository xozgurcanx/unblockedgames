var Field = function(config)
{
  config.sizeType = 'absolute';
  config.width = 370;
  config.height = 370;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.state = 'normal';

  app.addForUpdate(this.update, this);
}
Field.prototype = Object.create(Gui.BasePanel.prototype);
Field.prototype.constructor = Field;

Field.prototype.update = function()
{

}

Field.prototype.tween = function(data, callback)
{
  var self = this;
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var DominoesGame = function(data)
{
  EventEmitter.call(this);


  this.teams = [];
  this.players = [];
  this.teams = [];
  // this.board = new DominoesGame.Board();

  this.tiles = [];
  this.tilesById = [];
  this.bazaar = [];
  this.board = [];
  this.boardBranchs = [];

  this.phase = 'waiting_match';

  this.decks = 
  {

  };
  this.initDecks();

  var deck = this.getDeck('classic');
  for(var i = 0; i < deck.tiles.length; i++)
  {
    var tile = new DominoesGame.Tile(this, deck.tiles[i].cell1, deck.tiles[i].cell2);
    this.tiles.push(tile);
  }

  this.victoryScores = data.victoryScores;
  // console.log(this.victoryScores);

  // this.isWithBazaar = true;

  this.tileWidth = 100+5;
  this.tileHeight = 196+5;

  this.boardWidth = 200;
  this.boardHeigh = 200;

  this.minBoardScale = 1.7;
  this.boardScale = this.minBoardScale;
  this.boardShiftH = 0;
  this.boardShiftV = 0;

  this.turnsCount = 0;

  this.turnPlayer = null;
  this.turnInfo = 
  {
    turn: null,
    isSkip: false
  }

  this.nextPlayer = null;

  this.gameId = 0;
}
DominoesGame.prototype = Object.create(EventEmitter.prototype);
DominoesGame.prototype.constructor = DominoesGame;

DominoesGame.prototype.initDebug = function(boardBg)
{
  this.debugBoardBg = boardBg;

  // this.updateBoard();
}

DominoesGame.prototype.initDecks = function()
{
  var dots = ['free', 'one', 'two', 'three', 'four', 'five', 'six'];

  var deckClassic = { name: 'classic', tiles: [] };
  for(var i = 0; i < dots.length; i++)
  {
    for(var j = 0; j < dots.length; j++)
    {
      var d1 = dots[i];
      var d2 = dots[j];

      var isAdd = true;
      for(var k = 0; k < deckClassic.tiles.length; k++)
      {
        var tile = deckClassic.tiles[k];
        if((tile.cell1 == d1 && tile.cell2 == d2) || (tile.cell1 == d2 && tile.cell2 == d1))
        {
          isAdd = false;
          break;
        }
      }

      if(isAdd) deckClassic.tiles.push({ cell1: d1, cell2: d2 });
    }
  }

  this.addDeck(deckClassic);
}

DominoesGame.prototype.addDeck = function(deck)
{
  this.decks[deck.name] = deck;

  // console.log('DominoesGame, Deck Added:', deck);
}
DominoesGame.prototype.getDeck = function(deckName)
{

  return this.decks[deckName];
}

DominoesGame.prototype.saveGame = function()
{
  var self = this;

  var saveData = 
  {
    // teams: this.teams,
    // players: this.players,

    tiles: this.saveTiles(this.tiles),
    bazaar: this.saveTilesId(this.bazaar),
    board: this.saveTilesId(this.board),
    // boardBranchs: this.boardBranchs,

    phase: this.phase,

    rules: this.rules,
    victoryScore: this.victoryScore,

    turnsCount: this.turnsCount,
    roundsCount: this.roundsCount,

    nextPlayerId: this.nextPlayer.id
  }

  saveData.boardBranchs = 
  {
    center: self.saveTilesId(self.boardBranchs['center']),
    left: self.saveTilesId(self.boardBranchs['left']),
    right: self.saveTilesId(self.boardBranchs['right']),
    up: self.saveTilesId(self.boardBranchs['up']),
    down: self.saveTilesId(self.boardBranchs['down'])
  }

  saveData.isLastCon = this.isLastCon;
  saveData.lastConPlayerId = -1;
  if(this.lastConPlayer != null) saveData.lastConPlayerId = this.lastConPlayer.id;

  // var players = [];
  // for(var i = 0; i < this.players.length; i++) players.push(this.players[i].save());
  // saveData.players = players;

  var teams = [];
  for(var i = 0; i < this.teams.length; i++) 
  {
    var name = this.teams[i].name;
    var players =[];
    for(var j = 0; j < this.teams[i].players.length; j++) players.push(this.teams[i].players[j].save());
    teams.push({ name: name, players: players });
  }
  saveData.teams = teams;

  // console.log(this.teams);

  return saveData;
}

DominoesGame.prototype.loadGame = function(saveData)
{
  var self = this;

  this.clear();

  // console.log('LoadGame:', saveData);

  this.phase = saveData.phase;
  this.rules = saveData.rules;
  this.victoryScore = saveData.victoryScore;
  this.turnsCount = saveData.turnsCount;
  this.roundsCount = saveData.roundsCount;

  this.tilesById = [];
  for(var i = 0; i < this.tiles.length; i++)
  {
    var tile = this.tiles[i];
    tile.reset();

    var tileInfo = saveData.tiles[i];
    tile.setId(tileInfo.id);
  }
  for(var i = 0; i < this.tiles.length; i++)
  {
    var tile = this.tiles[i];

    var tileInfo = saveData.tiles[i];
    tile.load(tileInfo);
  }

  this.board = this.loadTilesId(saveData.board);
  this.bazaar = this.loadTilesId(saveData.bazaar);

  this.boardBranchs = 
  {
    center: self.loadTilesId(saveData.boardBranchs['center']),
    left: self.loadTilesId(saveData.boardBranchs['left']),
    right: self.loadTilesId(saveData.boardBranchs['right']),
    up: self.loadTilesId(saveData.boardBranchs['up']),
    down: self.loadTilesId(saveData.boardBranchs['down'])
  }
  // console.log('boardBranchs:', this.boardBranchs);
  // Players =================================================
  this.teams = [];
  this.players = [];
  for(var i = 0; i < saveData.teams.length; i++)
  {
    var team = { name: saveData.teams[i].name, players: [] };

    for(var j = 0; j < saveData.teams[i].players.length; j++) team.players.push(createPlayer(saveData.teams[i].players[j]));

    this.teams.push(team);
  }

  var c = 0;
  var playersInTeam = this.teams[0].players.length;
  for(var c = 0; c < playersInTeam; c++)
  {
  for(var i = 0; i < this.teams.length; i++)
  {
    var team = this.teams[i];
    var player = team.players[c];
    this.players.push(player);
  }
  }

  this.playersTurnOrder = this.players;
  this.nextPlayer = null;
  for(var i = 0; i < this.players.length; i++)
  {
    if(this.players[i].id == saveData.nextPlayerId)
    {
      this.nextPlayer = this.players[i];
      break;
    }
  }
  if(this.nextPlayer == null) console.log('Err: NextPlayer not found!');

  this.isLastCon = saveData.isLastCon;
  this.lastConPlayer = null;
  if(saveData.lastConPlayerId != -1) this.lastConPlayer = this.findPlayerById(saveData.lastConPlayerId);

  function createPlayer(playerInfo)
  {
    var player = null;
    if(playerInfo.type == 'human') 
    {
      player = new DominoesGame.PlayerHuman(playerInfo.name);
    }
    else if(playerInfo.type == 'ai')
    {
      player = new DominoesGame.PlayerAi(playerInfo.name);
      player.setDificulty(playerInfo.dificulty);
    }

    player.initGame(self, playerInfo.team);

    player.load(playerInfo);

    // console.log('create player:', playerInfo);

    return player;    
  }

  // console.log(this.tiles, this.board, this.bazaar, this.teams, this.players);
}

DominoesGame.prototype.saveTiles = function(tiles)
{
  var saveData = [];

  for(var i = 0; i < tiles.length; i++)
  {
    saveData.push(tiles[i].save());
  }

  return saveData;
}

DominoesGame.prototype.saveTilesId = function(tiles)
{
  var saveData = [];

  for(var i = 0; i < tiles.length; i++)
  {
    saveData.push(tiles[i].id);
  }

  return saveData;
}
DominoesGame.prototype.loadTilesId = function(tilesId)
{
  var tiles = [];

  for(var i = 0; i < tilesId.length; i++)
  {
    tiles.push(this.tilesById[tilesId[i]]);
  }

  return tiles;
}
DominoesGame.prototype.findPlayerById = function(playerId)
{
  for(var i = 0; i < this.players.length; i++)
  {
    if(this.players[i].id == playerId) return this.players[i];
  }

  return null;
}

DominoesGame.prototype.findTeam = function(teamName)
{
  for(var i = 0; i < this.teams.length; i++)
  {
    if(this.teams[i].name == teamName) return this.teams[i];
  }

  return null;
}

DominoesGame.prototype.clear = function()
{
  this.teams = [];
  this.players = [];

  // this.tiles = [];
  // this.tilesById = [];

  this.bazaar = [];
  this.board = [];
  this.boardBranchs = [];

  this.phase = 'waiting_match';

  this.turnsCount = 0;
  this.roundsCount = 0;

  this.turnPlayer = null;
  this.turnInfo = 
  {
    turn: null,
    isSkip: false
  }

  this.nextPlayer = null;

  this.isLastCon = false;
  this.lastConPlayer = null;

  this.startTilesInfo = null;

  this.boardWidth = 200;
  this.boardHeigh = 200;

  this.minBoardScale = 1.7;
  this.boardScale = this.minBoardScale;
  this.boardShiftH = 0;
  this.boardShiftV = 0;

  this.gameId ++;

  // console.log('DominoesGame: Clear!');
}

DominoesGame.prototype.initMatch = function(gameInfo)
{
  if(this.phase != 'waiting_match') this.clear();

  this.teams = gameInfo.teams;

  this.rules = gameInfo.rules;
  this.victoryScore = this.victoryScores[this.rules];
  // if(this.rules == 'draw' || this.rules == 'block') this.victoryScore = 100;
  // else if(this.rules == 'all_fives') this.victoryScore = 150;

  // this.victoryScore = 10;
  // console.log(this.rules, this.victoryScore);

  this.players = [];
  this.playersTurnOrder = null;

  // this.turnsCount = 0;
  this.roundsCount = 0;

  var deck = this.getDeck('classic');

  // this.tiles = [];
  this.bazaar = [];
  this.deckTiles = deck.tiles;
  // for(var i = 0; i < deck.tiles.length; i++)
  // {
  //   var tile = new DominoesGame.Tile(this, deck.tiles[i].cell1, deck.tiles[i].cell2);
  //   this.tiles.push(tile);
  // }

  this.players = [];
  // if(this.teams.length == 2)
  // {

  // }
  // else
  // {
  var c = 0;
  var playersInTeam = this.teams[0].players.length;
  for(var c = 0; c < playersInTeam; c++)
  {
  for(var i = 0; i < this.teams.length; i++)
  {
    var team = this.teams[i];
    var player = team.players[c];
    this.players.push(player);
  }
  }
  // console.log('PlayersInTeam:', playersInTeam);
  // }

  this.phase = 'waiting_round';

  var initMatchInfo = { teams: this.teams, players: this.players, deckTiles: this.deckTiles };

  this.emit('init_match', initMatchInfo);

  // this.setBoardScale(this.boardScale);

  // console.log('DominoesGame: InitMatch!');

  return initMatchInfo;
}

DominoesGame.prototype.initRound = function()
{
  if(this.phase != 'waiting_round') return;

  this.turnsCount = 0;

  for(var i = 0; i < this.teams.length; i++)
  {
    var team = this.teams[i];
    for(var j = 0; j < team.players.length; j++)
    {
      var player = team.players[j];
      player.initGame(this, team.name);
    }
  }

  this.board = [];

  for(var i = 0; i < this.tiles.length; i++)
  {
    this.tiles[i].reset();
  }

  this.boardBranchs = 
  {
    center: [],
    left: [],
    right: [],
    up: [],
    down: []
  }

  this.boardScale = this.minBoardScale;
  this.setBoardScale(this.boardScale);

  // console.log('DominoesGame Tiles:', this.tiles);

  this.bazaar = Util.shuffleElements(this.tiles.slice());

  // console.log('DominoesGame Bazaar:', this.bazaar);
  var bazaarTiles = this.bazaar.slice();

  this.startTilesInfo = this.initStartTiles();

  this.playersTurnOrder = this.players;
  this.nextPlayer = this.startTilesInfo.firstPlayer;

  // this.isWithBazaar = false;
  this.isLastCon = false;
  this.lastConPlayer = null;

  this.phase = 'waiting_turn';

  var initRoundInfo = { bazaar: bazaarTiles, startTilesInfo: this.startTilesInfo };

  // console.log('DominoesGame: InitRound!', this.tiles);

  this.updateBoard();

  this.emit('init_round', initRoundInfo);

  return initRoundInfo;
}

// DominoesGame.prototype.getFirstPlayer = function()
// {
//   var firstPlayer = null;
//   var minDupelWeight = 0;

//   for(var i = 0; i < this.players.length; i++)
//   {
//     var player = this.players[i];

//     var 
//   }
// }

DominoesGame.prototype.initStartTiles = function()
{
  var startTilesInfo = [];
  var startTilesCount = 7;

  if(this.players.length > 2) startTilesCount = 5;

  // startTilesCount = 7;

  var totalStartTiles = startTilesCount * this.players.length;

  var tiles = this.bazaar.slice();

  var startTiles = [];
  var dupels = [];
  for(var i = 0; i < this.tiles.length; i++)
  {
    if(this.tiles[i].isDupel) dupels.push(this.tiles[i]);
  }

  var dupel = Util.randomElement(dupels);
  tiles.splice(tiles.indexOf(dupel), 1);
  startTiles.push(dupel);

  while(startTiles.length < totalStartTiles)
  {
    var tile = Util.randomElement(tiles);
    tiles.splice(tiles.indexOf(tile), 1);

    startTiles.push(tile);
  }
  startTiles = Util.shuffleElements(startTiles);

  var maxDupel = null;
  for(var i = 0; i < startTiles.length; i++)
  {
    var tile = startTiles[i];
    if(tile.isDupel && (maxDupel == null || tile.getWeight() > maxDupel.getWeight()))
    {
      maxDupel = tile;
    }
  }
  // console.log('MaxDupel:', maxDupel);

  // console.log(startTiles.length);
  for(var i = 0; i < this.players.length; i++)
  {
    var player = this.players[i];

    var startTilesPlayerInfo = { player: player, tiles: [] };
    startTilesInfo.push(startTilesPlayerInfo);

    for(var j = i*startTilesCount; j < i*startTilesCount+startTilesCount; j++) 
    {
      var tile = startTiles[j];
      tile.addToHand(player);  

      startTilesPlayerInfo.tiles.push(tile);

      if(tile == maxDupel) 
      {
        startTilesInfo.firstPlayer = player;
        // console.log('MaxDupelFound:', tile, player);
      }
    }

    // player.initGame(this, 'A', startTiles);
  }

  // console.log(startTilesInfo);

  // console.log(this.bazaar.length, this.players);
  // console.log(startTilesInfo);

  // for(var i = 0; i < this.players.length; i++)
  // {
  //   var player = this.players[i];

  //   var startTilesPlayerInfo = { player: player, tiles: [] };
  //   startTilesInfo.push(startTilesPlayerInfo);

  //   for(var j = 0; j < startTilesCount; j++) 
  //   {
  //     var tile = Util.randomElement(this.bazaar);
  //     tile.addToHand(player);  

  //     startTilesPlayerInfo.tiles.push(tile);
  //   }
  // }

  // this.phase = 'waiting_turn';

  // this.nextPlayer = this.getNextPlayer();

  // this.emit('init_start_tiles', startTilesInfo);

  return startTilesInfo;
}

DominoesGame.prototype.doTurn = function()
{
  if(this.phase == 'waiting_turn')
  {
    this.turn(this.nextPlayer);
  }
}

DominoesGame.prototype.turn = function(player)
{
  if(player.game != this || player.gameId != this.gameId) return;

  this.turnPlayer = player;
  // this.turnsCount ++;

  this.phase = 'player_turn';

  this.emit('turn_start', {player: player, turnsCount: this.turnsCount});
  player.emit('turn_start', {player: player, turnsCount: this.turnsCount});

  this.playerTurn(player);
}
DominoesGame.prototype.playerTurn = function(player)
{
  var variants = this.getPlayerTurnVariants(player);

  // console.log('Game: Player['+player.name+'] TurnStart:', variants);

  // if(variants != null)
  // {
  player.turn(variants, bind(this.playerTurnCallback, this));
  // }
  // else
  // {
    // console.log('Dont have a turn variant!');
  // }  
}

DominoesGame.prototype.getPlayerTurnVariants = function(player)
{
  var tiles = player.tiles;

  var tilesVariants = [];
  var bazaarVariants = [];

  if(this.board.length == 0)
  {
    // for(var i = 0; i < tiles.length; i++)
    // {
    //   var joins = tiles[i].getAvaiableJoins(connects);
    //   if(joins.length > 0)
    //   {
    //     tilesVariants.push({tile: tiles[i], joins: joins});
    //   }
    // }

    var maxDupel = null;
    for(var i = 0; i < tiles.length; i++)
    {
      var tile = tiles[i];
      if(tile.isDupel && (maxDupel == null || tile.getWeight() > maxDupel.getWeight()))
      {
        maxDupel = tile;
      }
    }

    tilesVariants.push({tile: maxDupel, joins: maxDupel.getAvaiableJoins(connects)});
  }
  else
  {
    var connects = [];
    for(var i = 0; i < this.board.length; i++) connects = connects.concat(this.board[i].getAvaiableConnects());

    for(var i = 0; i < tiles.length; i++)
    {
      var joins = tiles[i].getAvaiableJoins(connects);
      if(joins.length > 0)
      {
        tilesVariants.push({tile: tiles[i], joins: joins});
      }
    }

    if(tilesVariants == 0 && this.rules != 'block' && this.bazaar.length > 0)
    {
      bazaarVariants = this.bazaar;
    }
  }

  if(tilesVariants.length > 0 || bazaarVariants.length > 0) return { tilesVariants: tilesVariants, bazaarVariants: bazaarVariants };

  return null;
}

DominoesGame.prototype.playerTurnCallback = function(player, turnInfo)
{
  if(player.game != this || player.gameId != this.gameId) return;
  // if(turnInfo != null && turnInfo.joinInfo != null) console.log('Player['+player.name+'] TurnComplete:', turnInfo.joinInfo);

  if(turnInfo == null)
  {
    this.turnInfo.turn = { player: player, tile: null, joinInfo: null, bazaarTile: null };
    this.turnComplete(player);
  }
  else if(turnInfo.playerTile != null)
  {
    var joinInfo = turnInfo.joinInfo;

    turnInfo.playerTile.addToBoard(joinInfo);

    // this.addTileToBoardBranch(joinInfo);

    player.tiles.splice(player.tiles.indexOf(turnInfo.playerTile), 1);
    // this.board.push(turnInfo.playerTile);


    this.turnInfo.turn = { player: turnInfo.player, tile: turnInfo.playerTile, joinInfo: joinInfo, bazaarTile: null };    
    this.turnComplete(player);

    // this.updateBoard();

    // console.log(this.boardBranchs);
  }
  else if(turnInfo.bazaarTile != null)
  {
    turnInfo.bazaarTile.addToHand(player);

    // console.log('XXX:', turnInfo, this.turnInfo);

    this.turnInfo.turn = { player: turnInfo.player, tile: null, joinInfo: null, bazaarTile: turnInfo.bazaarTile };    
    this.turnComplete(player);
  }
}

// DominoesGame.prototype.addTileToBranch = function(joinInfo)
// {

// }

DominoesGame.prototype.turnComplete = function(player)
{
  if(player.game != this || player.gameId != this.gameId) return;

  var self = this;

  this.turnInfo.isSkip = this.turnInfo.turn.tile == null && this.turnInfo.turn.bazaarTile == null;

  var allFivesInfo = null;
  if(this.turnInfo.turn.tile != null && this.rules == 'all_fives')
  {
    allFivesInfo = checkAllFives();

    if(allFivesInfo != null)
    {
      for(var i = 0; i < allFivesInfo.team.players.length; i++)
      {
        var tPlayer = allFivesInfo.team.players[i];
        var playerScore = tPlayer.score + allFivesInfo.summ;
        // if(playerScore > this.victoryScore) playerScore = this.victoryScore;

        tPlayer.setScore(playerScore);
      }
    }
    // console.log('AllFives:', allFivesInfo);
  }  
  // allFivesInfo = null;

  var isMatchComplete = this.checkMatchComplete();
  if(isMatchComplete)
  {
    this.emit('turn_complete', {player: player, turnsCount: this.turnsCount, turnInfo: this.turnInfo, allFivesInfo: allFivesInfo});
    player.emit('turn_complete', {player: player, turnsCount: this.turnsCount, turnInfo: this.turnInfo, allFivesInfo: allFivesInfo});

    this.matchComplete();
    return;
  }

  var isRoundComplete = checkRoundComplete();
  if(isRoundComplete)
  {
    this.emit('turn_complete', {player: player, turnsCount: this.turnsCount, turnInfo: this.turnInfo, allFivesInfo: allFivesInfo});
    player.emit('turn_complete', {player: player, turnsCount: this.turnsCount, turnInfo: this.turnInfo, allFivesInfo: allFivesInfo});

    this.roundComplete();
  }
  else
  {
    this.phase = 'waiting_turn';
    this.turnsCount ++;
    
    if(this.turnInfo.turn.bazaarTile != null)
    {
      this.nextPlayer = player;
    }
    else this.nextPlayer = this.getNextPlayer(player); 

    // console.log('NextPlayer:', this.playersTurnOrder.indexOf(player), this.playersTurnOrder.indexOf(this.nextPlayer)); 

    this.emit('turn_complete', {player: player, turnsCount: this.turnsCount, turnInfo: this.turnInfo, allFivesInfo: allFivesInfo});
    player.emit('turn_complete', {player: player, turnsCount: this.turnsCount, turnInfo: this.turnInfo, allFivesInfo: allFivesInfo});
  }

  function checkRoundComplete()
  {
    if(player.tiles.length == 0) return true;

    if(self.isLastCon && self.lastConPlayer == player) return true;

    if(self.turnInfo.isSkip && !self.isLastCon)
    {
      var startSkipPlayer = player;
      var skipPlayer = self.getNextPlayer(startSkipPlayer);
      while(true)
      {
        // console.log('Skip:', skipPlayer);
        var variants = self.getPlayerTurnVariants(skipPlayer);
        if(variants != null) return false;
        else 
        {
          var p = self.getNextPlayer(skipPlayer);
          if(p == startSkipPlayer)
          {
            self.isLastCon = true;
            self.lastConPlayer = skipPlayer;

            return false;
          }
          else skipPlayer = p;
        }
      }
    }

    return false;
  }

  function checkAllFives()
  {
    var info = null;

    var summ = 0;
    var outerTiles = self.getOuterTiles();
    for(var i = 0; i < outerTiles.length; i++)
    {
      summ += outerTiles[i].getOuterWeight();
    }

    if(outerTiles.length > 0 && summ%5 == 0 && summ > 0)
    {
      var team = null;
      for(var i = 0; i < self.teams.length; i++) 
      {
        if(self.teams[i].name == player.team)
        {
          team = self.teams[i];
          break;
        }
      }

      info = { team: team, summ: summ, outerTiles: outerTiles };
    }

    // console.log('TestAllFives:', summ, summ%5==0);

    return info;
  }
}

DominoesGame.prototype.getOuterTiles = function()
{
  var outerTiles = [];

  for(var i = 0; i < this.board.length; i++)
  {
    var tile = this.board[i];
    if(tile.isOuter()) 
    {
      // summ += tile.getOuterWeight();
      outerTiles.push(tile);
    }
  }

  return outerTiles;
}
// DominoesGame.prototype.checkRoundComplete = function()
// {

//   var isSkip = this.turnInfo.isSkip;

//   return false;
// }

// DominoesGame.prototype.getOuter

DominoesGame.prototype.roundComplete = function()
{
  this.phase = 'round_complete';

  /*
  var winPlayer = null;
  var winTeam = null;

  for(var i = 0; i < this.players.length; i++)
  {
    var player = this.players[i];

    if(player.tiles.length == 0) 
    {
      winPlayer = player;
      break;
    }
  }
  if(winPlayer == null)
  {
    var minTilesWeight = 0;
    for(var i = 0; i < this.players.length; i++)
    {
      var player = this.players[i];
      var tilesWeight = player.getTilesWeight();
      if(winPlayer == null || tilesWeight < minTilesWeight)
      {
        winPlayer = player;
        minTilesWeight = tilesWeight;
      }
    }
  }

  for(var i = 0; i < this.teams.length; i++)
  {
    if(this.teams[i].name == winPlayer.team) 
    {
      winTeam = this.teams[i];
      break;
    }
  }

  var playersTilesWeight = [];
  for(var i = 0; i < this.players.length; i++)
  {
    playersTilesWeight.push({ player: this.players[i], tilesWeight: this.players[i].getTilesWeight() });
  }

  var winScores = 0;
  for(var i = 0; i < this.players.length; i++)
  {
    var player = this.players[i];
    if(player.team != winPlayer.team) winScores += player.getTilesWeight();
  }

  var playersWinScores = [];
  for(var i = 0; i < winTeam.players.length; i++)
  {
    playersWinScores.push({ player: winTeam.players[i], scores: winScores });

    var playerScore = winTeam.players[i].score + winScores;
    // if(playerScore > this.victoryScore) playerScore = this.victoryScore;

    winTeam.players[i].setScore(playerScore);
  }

  var roundInfo = { winPlayer: winPlayer, winTeam: winTeam, playersTilesWeight: playersTilesWeight, winScores: winScores, playersWinScores: playersWinScores };
  */

  var loseTeams = [];
  var losePlayers = [];
  var winTeams = [];
  var winPlayers = [];

  var playersTilesWeight = [];
  for(var i = 0; i < this.players.length; i++)
  {
    playersTilesWeight.push({ player: this.players[i], tilesWeight: this.players[i].getTilesWeight() });
  }

  for(var i = 0; i < this.players.length; i++)
  {
    var player = this.players[i];

    if(player.tiles.length == 0) 
    {
      winTeams.push(this.findTeam(player.team));
    }
  }
  if(winTeams.length == 0)
  {
    var minTilesWeight = 0;
    for(var i = 0; i < this.players.length; i++)
    {
      var player = this.players[i];
      var tilesWeight = player.getTilesWeight();
      if(winTeams.length == 0 || tilesWeight < minTilesWeight)
      {
        winTeams = [this.findTeam(player.team)];
        minTilesWeight = tilesWeight;
      }
      else if(winTeams.length > 0 && tilesWeight == minTilesWeight)
      {
        winTeams.push(this.findTeam(player.team));
      }
    }
  }

  var totalWinScores = 0;
  var playerWinScores = 0;

  for(var i = 0; i < this.teams.length; i++)
  {
    var isLoseTeam = true;

    for(var j = 0; j < winTeams.length; j++)
    {
      if(this.teams[i] == winTeams[j])
      {
        isLoseTeam = false;
        break;
      }
    }

    if(isLoseTeam)
    {
      loseTeams.push(this.teams[i]);
    }

    for(var j = 0; j < this.teams[i].players.length; j++)
    {
      if(isLoseTeam) 
      {
        losePlayers.push(this.teams[i].players[j]);

        totalWinScores += this.teams[i].players[j].getTilesWeight();
      }
      else winPlayers.push(this.teams[i].players[j]);
    }
  }

  playerWinScores = Math.floor(totalWinScores / winTeams.length);

  for(var i = 0; i < winPlayers.length; i++)
  {
    var playerScore = winPlayers[i].score + playerWinScores;
    winPlayers[i].setScore(playerScore);
  }

  // console.log('PlayerWinScore:', playerWinScore);
  // for(var )

  // console.log('WinTeams:', winTeams);
  // console.log('LoseTeams:', loseTeams);
  // console.log('WinPlayers:', winPlayers);
  // console.log('LosePlayers:', losePlayers);
  // console.log('totalScores:', totalWinScores);

  // var roundInfo = { winPlayer: winPlayer, winTeam: winTeam, playersTilesWeight: playersTilesWeight, winScores: winScores, playersWinScores: playersWinScores };
  var roundInfo = { winTeams: winTeams, winPlayers: winPlayers, loseTeams: loseTeams, losePlayers: losePlayers, totalWinScores: totalWinScores, playerWinScores: playerWinScores, playersTilesWeight: playersTilesWeight};

  // console.log('DominoesGame: Round Complete!', roundInfo);

  this.phase = 'waiting_round';
  this.gameId ++;
  this.roundsCount ++;

  this.emit('round_complete', roundInfo);

  var isMatchComplete = this.checkMatchComplete();
  if(isMatchComplete) this.matchComplete();
}

DominoesGame.prototype.checkMatchComplete = function()
{
  // this.victoryScore = 3;

  var winTeam = null;
  for(var i = 0; i < this.teams.length; i++)
  {
    var team = this.teams[i];
    for(var j = 0; j < team.players.length; j++)
    {
      var player = team.players[j];
      if(player.score >= this.victoryScore)
      {
        winTeam = team;
        break;
      }
    }
  }

  if(winTeam != null) 
  {
    // this.matchComplete(winTeam);

    return true;
  }

  return false;

  // console.log('winTeam:', winTeam);
}

DominoesGame.prototype.matchComplete = function()
{
  this.phase = 'waiting_match';
  this.gameId ++;

  // var winPlayers = winTeam.players.slice();

  var winTeam = null;
  for(var i = 0; i < this.teams.length; i++)
  {
    for(var j = 0; j < this.teams[i].players.length; j++)
    {
      var player = this.teams[i].players[j];
      if(player.score >= this.victoryScore)
      {
        winTeam = this.teams[i];
        break;
      }
    }
  }

  console.log('Field: MatchComplete!');

  var matchInfo = { winTeam: winTeam, players: this.players.slice(), teams: this.teams };
  this.emit('match_complete', matchInfo);
}

DominoesGame.prototype.getNextPlayer = function(player)
{
  if(this.turnsCount == 0 || player == null) return this.playersTurnOrder[0];

  var n = this.playersTurnOrder.indexOf(player) + 1;
  if(n > this.playersTurnOrder.length-1) n = 0;
  var nextPlayer = this.playersTurnOrder[n];

  return nextPlayer;
}

DominoesGame.prototype.getAntiDir = function(dir)
{
  if(dir == 'up') return 'down';
  else if(dir == 'down') return 'up';
  else if(dir == 'left') return 'right';
  else if(dir == 'right') return 'left';

  return'none';
}

DominoesGame.prototype.setBoardSize = function(width, height, isDelayRequest)
{
  if(height > width) return;

  if(!(this.phase == 'waiting_turn' || this.phase == 'player_turn')) return;
  if(this.boardWidth == width && this.boardHeigh == height) return;

  this.boardWidth = width;
  this.boardHeigh = height;

  // console.log('SetBS:', this.boardWidth, this.boardHeigh);

  if(isDelayRequest != undefined && isDelayRequest == true)
  {
    this.requestUpdateBoard();
  }
  else this.updateBoard();
}

DominoesGame.prototype.updateBoardShift = function()
{
  var self = this;

  // this.boardShiftH = this.getBoardBranchSize('right')-this.getBoardBranchSize('left');
  this.boardShiftH = 0;
  this.boardShiftV = this.getBoardBranchSize('down')-this.getBoardBranchSize('up');
}
DominoesGame.prototype.getBoardBranchSize = function(boardBranch)
{
  var size = 0;
  var tiles = this.boardBranchs[boardBranch];
  for(var i = 0; i < tiles.length; i++)
  {
    if(tiles[i].isDupel) size += this.tileWidth;
    else size += this.tileHeight;
  }

  if(boardBranch == 'left' || boardBranch == 'right') size += this.tileWidth/2;
  else if(boardBranch == 'up' || boardBranch == 'down') size += this.tileHeight/2;

  return size;
}

DominoesGame.prototype.requestUpdateBoard = function()
{
  TweenMax.killDelayedCallsTo(this.updateBoard);
  TweenMax.delayedCall(10/30, this.updateBoard, [], this);

  console.log('RRR');
}

DominoesGame.prototype.updateBoard = function()
{
  // if(!(this.phase == 'waiting_turn' || this.phase == 'player_turn')) return;

  var self = this;

  if(this.debugBoardBg != null)
  {
    this.debugBoardBg.width = this.boardWidth;
    this.debugBoardBg.height = this.boardHeigh;
  }

  // this.minBoardScale = (this.tileHeight * 9) / this.boardWidth;


  

  
  // if(this.board.length > 8) this.boardScale = this.minBoardScale * this.board.length*0.05;
  // if(this.boardScale < this.minBoardScale) this.boardScale = this.minBoardScale;

  // if(this.board.length % 5 == 0 && (this.boardWidth * this.boardScale) / this.tileHeight < this.board.length) 
  // {
  //   // this.updateBoardShift();

  //   this.boardScale = this.minBoardScale + this.board.length*0.03;
  //   console.log('BoardScale:', this.boardScale, this.minBoardScale);
  // }

  // this.updateBoardShift();


  // ============================================================================ //
  /*
  var branchLeftSize = this.getBoardBranchSize('left');
  var branchRightSize = this.getBoardBranchSize('right');
  // var branchLong = Math.max(branchLeftSize, branchRightSize);
  var branchLong = (branchLeftSize + branchRightSize) / 2;
  var bS = (this.boardWidth/2 + this.boardHeigh/2) * this.boardScale;
  var bK = bS/branchLong;
  console.log(bK);
  if(bK < 1.2)
  {
    bS = 1.2 * branchLong;
    this.boardScale = bS / (this.boardWidth/2 + this.boardHeigh/2);
  }
  */
  // ============================================================================ //

  /*
  if(this.rules != 'all_fives' || (this.boardBranchs['up'].length <= 1 && this.boardBranchs['down'].length <= 1))
  {
    // var branchLong = Math.max(Math.max(this.boardBranchs['left'].length, this.boardBranchs['right'].length));

    // if(branchLong >= 13) this.boardScale = 2.1;
    // else this.boardScale = 1.7;

    this.boardScale = 1.7;

    var branchLeftSize = this.getBoardBranchSize('left');
    var branchRightSize = this.getBoardBranchSize('right');
    var branchLongSize = Math.max(branchLeftSize, branchRightSize);
    var bS = (this.boardWidth/2*0.9 + this.boardHeigh/2*0.8+this.boardWidth*0.8) * this.boardScale;
    var bK = bS/branchLongSize;
    // console.log(bK);

    if(bK < 1.1) this.boardScale = 2.1;
    if(this.boardBranchs['left'].length >= 16 || this.boardBranchs['right'].length >= 16) this.boardScale = 2.4;
    // if(bK < 1.9) this.boardScale = 2.1;
  }
  else
  {
    this.boardScale = 1.7;

    var branchLeftSize = this.getBoardBranchSize('left');
    var branchRightSize = this.getBoardBranchSize('right');
    var branchLongSize = Math.max(branchLeftSize, branchRightSize);
    var bS = (this.boardWidth/2*0.9 + this.boardHeigh/2*0.8+this.boardWidth/2*0.9) * this.boardScale;
    var bK = bS/branchLongSize;
    // console.log(bK);

    
    if(bK < 1.2) this.boardScale = 2.1;
    // var branchLong = Math.max(Math.max(this.boardBranchs['left'].length, this.boardBranchs['right'].length), Math.max(this.boardBranchs['up'].length, this.boardBranchs['down'].length));
    // if(branchLong > 16) this.boardScale = 2.6;
    // else if(branchLong >= 8) this.boardScale = 2.2;
    // else this.boardScale = 1.7;  
  }
  */

  // var branchLong = Math.max(Math.max(this.boardBranchs['left'].length, this.boardBranchs['right'].length), Math.max(this.boardBranchs['up'].length, this.boardBranchs['down'].length));
  // if(branchLong > 16) this.minBoardScale = 2.6;
  // else if(branchLong > 10) this.minBoardScale = 2.2;
  // else this.minBoardScale = 1.9;  

  // if(branchLong > 16) this.minBoardScale = 2.6;
  // if(branchLong >= 7) this.boardScale = 2.1;
  // else this.boardScale = 1.7;
  // ============================================================================ //

  // if(this.boardScale < this.minBoardScale) this.boardScale = this.minBoardScale;
  // this.updateBoardShift();

  for(var i = 0; i < this.board.length; i++)
  {
    var tile = this.board[i];
    var position = this.getTilePosition(tile.joinInfo);
    tile.position = position;
    tile.joinInfo.position = position;

    var isRebuild = checkRebuild(tile, i);
    if(isRebuild)
    {
      console.log('Rebuild!!!:', this.boardScale);

      if(this.boardScale == 1.7) 
      {
        this.setBoardScale(2.2);
        console.log('Rebuilded:', this.boardScale);
        return;
      }
      else if(this.boardScale == 2.2) 
      {
        this.setBoardScale(2.6);
        console.log('Rebuilded:', this.boardScale);
        return;
      }

      
      // if(this.boardScale != 2.6) return;
    }
    // console.log('P:', position);
  }

  function checkRebuild(tile, l)
  {
    var position = tile.joinInfo.position;

    // console.log('C:', tile);

    var tileN = self.boardBranchs[tile.boardBranch].indexOf(tile);
    // if(tileN < 2) return false;
    if(tile.boardBranch == 'center') return false;
    if((tile.boardBranch == 'left' || tile.boardBranch == 'right') && tileN < 2) return false;

    for(var i = 0; i < l; i++)
    {
      var tile1 = self.board[i];
      var position1 = tile1.joinInfo.position;
      var tile1N = self.boardBranchs[tile1.boardBranch].indexOf(tile1);

      // console.log('C2', tile1, tile1N);

      if(tile1.boardBranch == 'center' || tile1.boardBranch == tile.boardBranch) continue;
      if((tile1.boardBranch == 'left' || tile1.boardBranch == 'right') && tile1N < 2) continue;
      // else if((tile1.boardBranch == 'up' || tile1.boardBranch == 'down') && tileN < 1) continue;

      var d = Util.distance(position1.x, position1.y, position.x, position.y);
      // if(d < 400 && tile1.boardBranch != tile.boardBranch && tile1.boardBranch != 'center' && tile.boardBranch != 'center')
      // if(d < 500 && (tile.boardBranch == 'left' || tile.boardBranch == 'right') && (tile1.boardBranch == 'up' || tile1.boardBranch == 'down'))
      if(d < 350 && tile.boardBranch != tile1.boardBranch)
      {
        // console.log('aaa', d, tile1, tile, tileN, tile1N);
        return true;
      }
      // console.log('ввв', d, tile1, tile, tileN, tile1N);
    }

    return false;
  }

  // console.log('update board', this.boardWidth, this.boardHeigh, this.boardScale, this.minBoardScale);

  this.emit('board_updated', { tiles: this.board, boardWidth: this.boardWidth, boardHeigh: this.boardHeigh, boardScale: this.boardScale });

  // console.log(this.board);
}

DominoesGame.prototype.setBoardScale = function(boardScale)
{
  this.boardScale = boardScale;

  this.updateBoard();
}

DominoesGame.prototype.getTilePosition = function(joinInfo)
{
  var self = this;

  var position = { x: 0, y: 0, orientation: 'none', dir: 'none' };

  // console.log(joinInfo);

  var joinTile = joinInfo.joinTile;
  var connectTile = joinInfo.connectTile;

  if(connectTile == null) // First tile.
  {
    // var branchHShift = (this.boardBranchs['right'].length - this.boardBranchs['left'].length) * this.tileHeight*0.8;
    // var branchHShift = 0;
    // if(this.board.length > 5) branchHShift = getBoardBranchSize('right')-getBoardBranchSize('left');

    // position.x = -branchHShift/2;
    position.x = -this.boardShiftH/2;
    position.y = -this.boardShiftV/2;
    position.orientation = joinTile.isDupel?'vertical':'horizontal';
    position.dir = joinTile.isDupel?'up':'right';    

    // position.orientation = joinTile.isDupel?'horizontal':'vertical';
    // position.dir = joinTile.isDupel?'right':'up';

    return position;
  }


  var branchDir = 'forward';    

  var connectingDir = DominoesGame.Tile.getConnectingDir(joinInfo.connectSide, connectTile.position.dir);

  var turnTilesCount = 14;
  // turnTilesCount = 4;

  // if(this.board.length > turnTilesCount && connectingDir == 'left') branchDir = 'right';
  // else if(this.board.length > turnTilesCount && connectingDir == 'right') branchDir = 'right';


  var joinOrientation = 'none';

  if(connectTile == this.board[0] && connectTile.isDupel && !joinTile.isDupel)
  {
    if(joinInfo.connectSide == 'up' || joinInfo.connectSide == 'down') joinOrientation = 'vertical';
    else joinOrientation = 'horizontal';

    // console.log('Z:', connectTile, joinTile, connectTile.position, joinTile.position)
  }
  else joinOrientation = connectTile.isDupel != joinTile.isDupel?DominoesGame.Tile.getAntiOrientation(connectTile.position.orientation):connectTile.position.orientation;

  // if(branchDir != 'forward') joinOrientation = DominoesGame.Tile.getAntiOrientation(joinOrientation);

  var info = DominoesGame.Tile.getJoinDir(this.tileWidth+0, this.tileHeight+0, joinInfo.connectSide, joinInfo.joinSide, connectTile.position.dir, joinOrientation, branchDir);
  // console.log('I:', info);
  info.joinPosition.x += connectTile.position.x;
  info.joinPosition.y += connectTile.position.y;

  var w = this.tileWidth;
  var h = this.tileHeight;
  if(joinTile.isDupel) 
  {
    w = this.tileHeight;
    h = this.tileWidth;
  }
  if(joinOrientation == 'horizontal')
  {
    w = this.tileHeight;
    h = this.tileWidth;
    if(joinTile.isDupel) 
    {
      w = this.tileWidth;
      h = this.tileHeight;
    }
  }

  var boardWidth = this.boardWidth * this.boardScale * 1; // 0.95
  var boardHeigh = this.boardHeigh * this.boardScale * 1; // 0.95

  var rotateDir = 'none';

  w *= 1.0; // 1.05
  h *= 1.0; // 1.05



  // if((info.joinPosition.x + w/2) > boardWidth/2 || 
  //  (info.joinPosition.x - w/2) < -boardWidth/2 || 
  //  (info.joinPosition.y - h/2) < -boardHeigh/2 || 
  //  (info.joinPosition.y + h/2) > boardHeigh/2)
  // {
  //   if(connectTile.boardBranch == 'up' || connectTile.boardBranch == 'down') rotateDir = 'right';
  //   else rotateDir = 'left';
  // }

     // (info.joinPosition.y - h/2) < -boardHeigh/2 || 
   // (info.joinPosition.y + h/2) > boardHeigh/2)


  if((((info.joinPosition.x + w/2) > boardWidth/2 || (info.joinPosition.x - w/2) < -boardWidth/2) && ((!joinTile.isDupel && joinOrientation == 'horizontal' || joinTile.isDupel && joinOrientation == 'vertical'))) || 
     (((info.joinPosition.y + h/2) > boardHeigh/2 || (info.joinPosition.y - h/2) < -boardHeigh/2) && ((!joinTile.isDupel && joinOrientation == 'vertical' || joinTile.isDupel && joinOrientation == 'horizontal'))))
  {
    if(connectTile.boardBranch == 'up' || connectTile.boardBranch == 'down') rotateDir = 'right';
    else rotateDir = 'left';
  }

  if(rotateDir == 'none')
  {
    // if(connectTile.boardBranch == 'up' && this.boardBranchs['up'][0] == connectTile) rotateDir = 'left';
    // else if(connectTile.boardBranch == 'down' && this.boardBranchs['down'][0] == connectTile) rotateDir = 'left';
  }

  // if(isNeedRotate)
  // {
  //   if(connectTile.isDupel || joinTile.isDupel) isNeedRotate = false;
  // }

  if(rotateDir != 'none')
  {
    branchDir = rotateDir;

    joinOrientation = DominoesGame.Tile.getAntiOrientation(joinOrientation);
    info = DominoesGame.Tile.getJoinDir(this.tileWidth+0, this.tileHeight+0, joinInfo.connectSide, joinInfo.joinSide, connectTile.position.dir, joinOrientation, branchDir);
    info.joinPosition.x += connectTile.position.x;
    info.joinPosition.y += connectTile.position.y;
  }

  // console.log(joinTile, joinOrientation);

  position.x = info.joinPosition.x;
  position.y = info.joinPosition.y;
  position.orientation = joinOrientation;
  position.dir = info.joinDir;

  return position;
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
DominoesGame.Player = function(name, score)
{
  EventEmitter.call(this);


  this.id = DominoesGame.Player.getNextId();
  this.name = name;
  this.team = '';
  this.type = 'none';

  if(score == undefined) score = 0;
  this.score = 0;
  this.setScore(score);

  this.game = null;
  this.gameId = -1;

  this.tiles = [];

  this.phase = 'waiting_game';

  this.turnCallback = null;
  this.turnBazaarCallback = null;
}
DominoesGame.Player.prototype = Object.create(EventEmitter.prototype);
DominoesGame.Player.prototype.constructor = DominoesGame.Player;

DominoesGame.Player.id = 0;
DominoesGame.Player.getNextId = function()
{
  var id = DominoesGame.Player.id;
  DominoesGame.Player.id ++;

  return id;
}

DominoesGame.Player.prototype.initGame = function(game, team)
{
  this.game = game;
  this.gameId = this.game.gameId;

  this.team = team;

  this.tiles = [];

  this.phase = 'waiting_turn';

  this.emit('init_game', { game: this.game, player: this });

  // console.log('DominoesGame, Player['+this.name+'] InitGame: ', startTiles);
}

DominoesGame.Player.prototype.save = function()
{
  var saveData = 
  {
    id: this.id,
    type: this.type,
    team: this.team,
    name: this.name,
    score: this.score,
    phase: this.phase,
    tiles: this.game.saveTilesId(this.tiles),

    dificulty: this.dificulty == undefined?'none':this.dificulty
  };

  return saveData;
}
DominoesGame.Player.prototype.load = function(saveData)
{
  // console.log('Load player:', this.game.loadTilesId(saveData.tiles));
  // this.team = saveData.team;
  this.id = saveData.id;
  this.score = saveData.score;
  this.phase = saveData.phase;
  this.tiles = this.game.loadTilesId(saveData.tiles);
}

DominoesGame.Player.prototype.setScore = function(score)
{
  this.score = score;
}

DominoesGame.Player.prototype.getTilesWeight = function()
{
  var weight = 0;
  for(var i = 0; i < this.tiles.length; i++)
  {
    weight += this.tiles[i].getWeight();
  }

  return weight;
}

DominoesGame.Player.prototype.addTile = function(tile)
{
  this.tiles.push(tile);
}

DominoesGame.Player.prototype.turn = function(variants, callback)
{
  this.phase = 'turn';

  this.turnCallback = callback;

  this.emit('turn', { variants: variants });

  // console.log('Player['+this.name+'] Turn:', variants);
}

DominoesGame.Player.prototype.completeTurn = function(turnInfo)
{
  this.phase = 'waiting_turn';

  // console.log('Player['+this.name+'] TurnComplete:', turnInfo);

  this.turnCallback(this, turnInfo);
}
// ======================================================================================================================================== //
DominoesGame.PlayerHuman = function(name, score)
{
  DominoesGame.Player.call(this, name, score);


  this.type = 'human';
}
DominoesGame.PlayerHuman.prototype = Object.create(DominoesGame.Player.prototype);
DominoesGame.PlayerHuman.prototype.constructor = DominoesGame.PlayerHuman;

DominoesGame.PlayerHuman.prototype.turn = function(variants, callback)
{
  DominoesGame.Player.prototype.turn.call(this, variants, callback); 
}

DominoesGame.PlayerHuman.prototype.doTurn = function(tile, joinInfo)
{
  if(tile == null) 
  {
    this.completeTurn(null);
  }
  else 
  {
    var turnInfo = { player: this, playerTile: tile, joinInfo: joinInfo, bazaarTile: null };
    this.completeTurn(turnInfo); 
  }
}
DominoesGame.PlayerHuman.prototype.doBazaarTurn = function(tile)
{
  var turnInfo = { player: this, playerTile: null, joinInfo: null, bazaarTile: tile };
  this.completeTurn(turnInfo); 
}
// ======================================================================================================================================== //
DominoesGame.PlayerAi = function(name, score)
{
  DominoesGame.Player.call(this, name, score);


  this.type = 'ai';
  this.dificulty = 'normal';
}
DominoesGame.PlayerAi.prototype = Object.create(DominoesGame.Player.prototype);
DominoesGame.PlayerAi.prototype.constructor = DominoesGame.PlayerAi;

DominoesGame.PlayerAi.prototype.setDificulty = function(dificulty)
{
  this.dificulty = dificulty;
}

DominoesGame.PlayerAi.prototype.turn = function(variants, callback)
{
  DominoesGame.Player.prototype.turn.call(this, variants, callback);


  // console.log('AiTurn:', this.dificulty);

  if(variants == null)
  {
    this.completeTurn(null);
    return;
  }

  var tilesVariants = variants.tilesVariants;
  var bazaarVariants = variants.bazaarVariants;

  if(tilesVariants.length > 0)
  {
    

    // var dupleVariants = [];
    // for(var i = 0; i < tilesVariants.length; i++)
    // {
    //   if(tilesVariants[i].tile.isDupel) dupleVariants.push(tilesVariants[i]);
    // }
    // if(dupleVariants.length > 0) variant = Util.randomElement(dupleVariants);

    var turnInfo = null;
    if(this.dificulty == 'normal') turnInfo = this.getAiNormalTurn(tilesVariants);
    else if(this.dificulty == 'hard') turnInfo = this.getAiHardTurn(tilesVariants);

    this.completeTurn(turnInfo);  
  }
  else 
  {
    var tile = Util.randomElement(bazaarVariants);
    var turnInfo = { player: this, playerTile: null, joinInfo: null, bazaarTile: tile };
    this.completeTurn(turnInfo);  
  }
}

DominoesGame.PlayerAi.prototype.getAiNormalTurn = function(tilesVariants)
{
  var self = this;

  var turnInfo = null;

  if(this.game.rules == 'all_fives' && tilesVariants.length > 1)
  {
    var allFivesVariants = this.getAllFivesVariants(this.game.getOuterTiles(), tilesVariants);
    if(allFivesVariants.length > 0 && app.aiEasyMistakeEnable)
    {
      var r = Util.randomRange(0, 1);
      var isMistake = r <= app.aiEasyMistakePercent;
      // console.log('try_mistake:', r, isMistake);

      if(isMistake)
      {
        turnInfo = getMistakeVariant();
        if(turnInfo != null) return turnInfo;
      }

      // turnInfo = { player: this, playerTile: allFivesVariants[0].playerTile, joinInfo: allFivesVariants[0].joinInfo, bazaarTile: null };
      // return turnInfo;
    }
  }

  function getMistakeVariant()
  {
    for(var i = 0; i < tilesVariants.length; i++)
    {
      var variant = tilesVariants[i];
      var vJoins = variant.joins;
      var vTile = variant.tile;

      for(var t = 0; t < vJoins.length; t++)
      {
        var vJoinInfo = vJoins[t];
        var isAvaiable = true;
        for(var j = 0; j < allFivesVariants.length; j++)
        {
          if(vTile == allFivesVariants[j].playerTile && vJoinInfo == allFivesVariants[j].joinInfo)
          {
            isAvaiable = false;
            // console.log('dsdasdasdasdasd');
            break;
          }
        }

        if(isAvaiable)
        {
          // console.log('Do mistake', variant, vTile, vJoinInfo);
          return { player: self, playerTile: vTile, joinInfo: vJoinInfo, bazaarTile: null };
        }
      }
    }

    return null;
  }

  var variant = Util.randomElement(tilesVariants);
  var joins = variant.joins;

  var joinInfo = Util.randomElement(joins);

  turnInfo = { player: this, playerTile: variant.tile, joinInfo: joinInfo, bazaarTile: null };

  return turnInfo;
}

DominoesGame.PlayerAi.prototype.getAiHardTurn = function(tilesVariants)
{
  var turnInfo = null;

  if(this.game.rules == 'all_fives')
  {
    var allFivesVariants = this.getAllFivesVariants(this.game.getOuterTiles(), tilesVariants);
    if(allFivesVariants.length > 0)
    {
      turnInfo = { player: this, playerTile: allFivesVariants[0].playerTile, joinInfo: allFivesVariants[0].joinInfo, bazaarTile: null };
      return turnInfo;
    }
  }

  tilesVariants.sort(function(v1, v2)
  {
    return v2.tile.getWeight() - v1.tile.getWeight();
  });
  // console.log('--------------------------------');
  // for(var i = 0; i < tilesVariants.length; i++) console.log('TileVariant:', tilesVariants[i].tile.cell1 + ':' + tilesVariants[i].tile.cell2);

  var dupleVariants = [];
  for(var i = 0; i < tilesVariants.length; i++)
  {
    if(tilesVariants[i].tile.isDupel) dupleVariants.push(tilesVariants[i]);
  }

  if(dupleVariants.length > 0)
  {
    turnInfo = { player: this, playerTile: dupleVariants[0].tile, joinInfo: Util.randomElement(dupleVariants[0].joins), bazaarTile: null };
  }
  else
  {
    turnInfo = { player: this, playerTile: tilesVariants[0].tile, joinInfo: Util.randomElement(tilesVariants[0].joins), bazaarTile: null };
  }

  return turnInfo;
}

DominoesGame.PlayerAi.prototype.getAllFivesVariants = function(outerTiles, tilesVariants)
{
  var allFivesVariants = [];

  var outerTilesSumm = 0;
  for(var i = 0; i < outerTiles.length; i++) outerTilesSumm += outerTiles[i].getOuterWeight();

  for(var i = 0; i < tilesVariants.length; i++)
  {
    var tilesVariant = tilesVariants[i];
    var joins = tilesVariant.joins;
    for(var j = 0; j < joins.length; j++)
    {
      var joinInfo = joins[j];
      var variantSumm = getVariantSumm(joinInfo);

      if(variantSumm%5 == 0 && variantSumm > 0) allFivesVariants.push({ playerTile: tilesVariant.tile, joinInfo: joinInfo, summ: variantSumm });
      // console.log(tilesVariant);
    }
  }

  function getVariantSumm(joinInfo)
  {
    var variantSumm = outerTilesSumm;

    var joinTile = joinInfo.joinTile;
    var connectTile = joinInfo.connectTile;
    if(joinTile.isDupel) variantSumm += joinTile.getCellWeight(joinTile.cell1) + joinTile.getCellWeight(joinTile.cell2);
    else 
    {
      if(joinInfo.joinSide == 'down') variantSumm += joinTile.getCellWeight(joinTile.cell1);
      else if(joinInfo.joinSide == 'up') variantSumm += joinTile.getCellWeight(joinTile.cell2);
    }

    if(outerTiles.indexOf(connectTile) != -1)
    {
      if(outerTiles.length == 1)
      {
        if(!connectTile.isDupel)
        {
          if(joinInfo.connectSide == 'down') variantSumm -= connectTile.getCellWeight(connectTile.cell2);
          else if(joinInfo.connectSide == 'up') variantSumm -= connectTile.getCellWeight(connectTile.cell1);
        }
      }
      else variantSumm -= connectTile.getOuterWeight();
    }

    // console.log('AllFiveVariant:', joinTile.cell1 + ':' + joinTile.cell2, variantSumm);

    return variantSumm;
  }

  allFivesVariants.sort(function(variant1, variant2)
  {
    // console.log('Sort:', variant1, variant2);

    return variant2.summ - variant1.summ;
  });

  // console.log('allFivesVariants:', allFivesVariants);

  return allFivesVariants;
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
DominoesGame.Board = function()
{
  console.log('Board created!');
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
DominoesGame.Tile = function(game, cell1, cell2)
{
  this.game = game;
  this.cell1 = cell1;
  this.cell2 = cell2;

  this.id = -1;
  this.setId(DominoesGame.Tile.getNextId());

  this.isDupel = cell1 == cell2;

  this.joinInfo = null;

  // this.orientation = 'none';
  // this.dir = 'none';
  // this.x = 0;
  // this.y = 0;

  this.width = this.game.tileWidth;
  this.height = this.game.tileHeight;

  this.phase = 'bazaar';
  this.boardBranch = 'none';

  // this.neighbors = [];
  // this.nextUp = null;
  // this.nextDown = null;
  // this.nextLeft = null;
  // this.nextRight = null;
  this.next = 
  {
    up: {tile: null, side: 'none'},
    down: {tile: null, side: 'none'},
    left: {tile: null, side: 'none'},
    right: {tile: null, side: 'none'}
  }
}

DominoesGame.Tile.id = 0;
DominoesGame.Tile.getNextId = function()
{
  var id = DominoesGame.Tile.id;
  DominoesGame.Tile.id ++;
  return id;
}

DominoesGame.Tile.prototype.setId = function(id)
{
  this.id = id;
  this.game.tilesById[id] = this;
}

DominoesGame.Tile.prototype.save = function()
{
  var saveData = 
  {
    id: this.id,

    cell1: this.cell1,
    cell2: this.cell2,
    isDupel: this.isDupel,
    
    phase: this.phase,
    boardBranch: this.boardBranch,

    joinInfo: null
  };

  saveData.next = 
  {
    up: { tileId: -1, side: this.next['up'].side },
    down: { tileId: -1, side: this.next['down'].side },
    left: { tileId: -1, side: this.next['left'].side },
    right: { tileId: -1, side: this.next['right'].side }
  }
  if(this.next['up'].tile != null) saveData.next['up'].tileId = this.next['up'].tile.id;
  if(this.next['down'].tile != null) saveData.next['down'].tileId = this.next['down'].tile.id;
  if(this.next['left'].tile != null) saveData.next['left'].tileId = this.next['left'].tile.id;
  if(this.next['right'].tile != null) saveData.next['right'].tileId = this.next['right'].tile.id;

  if(this.joinInfo != null) 
  {
    saveData.joinInfo = { connectSide: this.joinInfo.connectSide, connectTileId: -1, joinSide: this.joinInfo.joinSide, joinTileId: -1, position: this.joinInfo.position };
    if(this.joinInfo.connectTile != null) saveData.joinInfo.connectTileId = this.joinInfo.connectTile.id;
    if(this.joinInfo.joinTile != null) saveData.joinInfo.joinTileId = this.joinInfo.joinTile.id;
  }

  return saveData;
}

DominoesGame.Tile.prototype.load = function(saveData)
{
  this.cell1 = saveData.cell1;
  this.cell2 = saveData.cell2;
  this.isDupel = saveData.isDupel;

  this.phase = saveData.phase;
  this.boardBranch = saveData.boardBranch;

  this.joinInfo = null;
  if(saveData.joinInfo != null)
  {
    this.joinInfo = { connectSide: saveData.joinInfo.connectSide, connectTile: null, joinSide: saveData.joinInfo.joinSide, joinTile: null, position: saveData.joinInfo.position };
    if(saveData.joinInfo.connectTileId != -1) this.joinInfo.connectTile = this.game.tilesById[saveData.joinInfo.connectTileId];
    if(saveData.joinInfo.joinTileId != -1) this.joinInfo.joinTile = this.game.tilesById[saveData.joinInfo.joinTileId];
  }
  this.position = null;
  if(this.joinInfo != null) this.position = this.joinInfo.position;

  this.next['up'].side = saveData.next['up'].side;
  this.next['down'].side = saveData.next['down'].side;
  this.next['right'].side = saveData.next['right'].side;
  this.next['left'].side = saveData.next['left'].side;

  if(saveData.next['up'].tileId != -1) this.next['up'].tile = this.game.tilesById[saveData.next['up'].tileId];
  if(saveData.next['down'].tileId != -1) this.next['down'].tile = this.game.tilesById[saveData.next['down'].tileId];
  if(saveData.next['right'].tileId != -1) this.next['right'].tile = this.game.tilesById[saveData.next['right'].tileId];
  if(saveData.next['left'].tileId != -1) this.next['left'].tile = this.game.tilesById[saveData.next['left'].tileId];

  // console.log('Tile load:', this);
}

DominoesGame.Tile.prototype.reset = function()
{
  this.phase = 'bazaar';
  this.boardBranch = 'none';

  this.joinInfo = null;
  this.position = null;
  this.boardBranch = 'none';

  // this.orientation = 'none';
  // this.dir = 'none';
  // this.x = 0;
  // this.y = 0;

  this.next = 
  {
    up: {tile: null, side: 'none'},
    down: {tile: null, side: 'none'},
    left: {tile: null, side: 'none'},
    right: {tile: null, side: 'none'}
  }

  // console.log('tile reset');
}

DominoesGame.Tile.prototype.isOuter = function()
{
  var connectsCount = 0;

  if(this.next['up'].tile != null) connectsCount ++;
  if(this.next['down'].tile != null) connectsCount ++;
  if(this.next['left'].tile != null) connectsCount ++;
  if(this.next['right'].tile != null) connectsCount ++;

  // console.log(this, this.game.rules, this.game.board[0] == this, connectsCount);

  // if(this.game.rules == 'all_fives' && this.game.board[0] == this && connectsCount < 4) 
  // {
  //   // console.log('AAA:', this);
  //   return true;
  // }
  // else 
  if(connectsCount <= 1) return true;
  else return false;
}
DominoesGame.Tile.prototype.getOuterWeight = function()
{
  // console.log(this.cell1, this.cell2, this.isOuter(), this.next);
  // console.log(this.cell1, this.cell2, this.isOuter(), this.next['up'], this.next['down'], this.next['left'], this.next['right']);

  if(this.game.rules == 'all_fives' && this.game.board[0] == this)
  {
    var weight = 0;
    // if(this.next['left'].tile == null || this.next['right'].tile == null) return this.getCellWeight(this.cell1) + this.getCellWeight(this.cell2);
    // else if(this.next['up'].tile == null) return this.getCellWeight(this.cell1);
    // else if(this.next['down'].tile == null) return this.getCellWeight(this.cell2);

    if(this.next['up'].tile == null) weight += this.getCellWeight(this.cell1);
    if(this.next['down'].tile == null) weight += this.getCellWeight(this.cell2);

    return weight;
  }

  if(this.isDupel) return this.getCellWeight(this.cell1) + this.getCellWeight(this.cell2);
  else
  {
    var weight = 0;
    if(this.next['up'].tile == null) weight += this.getCellWeight(this.cell1);
    if(this.next['down'].tile == null) weight += this.getCellWeight(this.cell2);

    // console.log(this.cell1, this.cell2, this.isOuter(), this.next['up'], this.next['down']);

    return weight;
  }

  // console.log("ERRR", this.isDupel, this.isOuter(), this.next);
}

DominoesGame.Tile.prototype.getWeight = function()
{
  var cell1Weight = this.getCellWeight(this.cell1);
  var cell2Weight = this.getCellWeight(this.cell2);

  return cell1Weight + cell2Weight;
}
DominoesGame.Tile.prototype.getCellWeight = function(cell)
{
    if(cell == 'free') return 0;
    if(cell == 'one') return 1;
    if(cell == 'two') return 2;
    if(cell == 'three') return 3;
    if(cell == 'four') return 4;
    if(cell == 'five') return 5;
    if(cell == 'six') return 6;

    return NaN;
}

DominoesGame.Tile.prototype.addToHand = function(player)
{
  if(this.phase == 'bazaar')
  {
    this.game.bazaar.splice(this.game.bazaar.indexOf(this), 1);

    player.addTile(this);

    this.phase = 'hand';
  }
}

DominoesGame.Tile.prototype.addToBoard = function(joinInfo)
{
  this.joinInfo = joinInfo;
  this.position = joinInfo.position;

  this.phase = 'game';

  this.boardBranch = 'none';
  if(joinInfo.connectTile == null) this.boardBranch = 'center'
  else if(joinInfo.connectTile == this.game.board[0]) this.boardBranch = joinInfo.connectSide;
  else this.boardBranch = joinInfo.connectTile.boardBranch;

  this.game.board.push(joinInfo.joinTile);
  this.game.boardBranchs[this.boardBranch].push(joinInfo.joinTile)

  if(joinInfo.connectTile != null)
  {
    joinInfo.connectTile.connect(joinInfo);
    joinInfo.joinTile.join(joinInfo);
  }
}

DominoesGame.Tile.prototype.join = function(joinInfo)
{
  // console.log(this.next);
  this.next[joinInfo.joinSide].tile = joinInfo.connectTile;
  this.next[joinInfo.joinSide].side = joinInfo.connectSide;
}

DominoesGame.Tile.prototype.connect = function(joinInfo)
{
  this.next[joinInfo.connectSide].tile = joinInfo.joinTile;
  this.next[joinInfo.connectSide].side = joinInfo.joinSide;
}

DominoesGame.Tile.prototype.getAvaiableConnects = function()
{
  var self = this;
  var connects = [];

  var up = this.next['up'];
  var down = this.next['down'];
  var left = this.next['left'];
  var right = this.next['right'];

  if(!this.isDupel)
  {
    if(up.tile == null) addConnect({ connectTile: this, connectSide: 'up', connectCell: this.cell1});
    if(down.tile == null) addConnect({ connectTile: this, connectSide: 'down', connectCell: this.cell2});
  }
  else
  {
    if(this.game.board[0] == this && this.game.rules == 'all_fives' && left.tile != null && right.tile != null)
    {
      if(up.tile == null) addConnect({ connectTile: this, connectSide: 'up', connectCell: this.cell1});
      if(down.tile == null) addConnect({ connectTile: this, connectSide: 'down', connectCell: this.cell2});
    }

    if(left.tile == null) addConnect({ connectTile: this, connectSide: 'left', connectCell: this.cell1});
    if(right.tile == null) addConnect({ connectTile: this, connectSide: 'right', connectCell: this.cell1});
  }

  function addConnect(connectInfo)
  {
    var connectDir = 'none';

    if(self.position.orientation == 'vertical' && self.position.dir == 'up' && connectInfo.connectSide == 'up') connectDir = 'up';
    if(self.position.orientation == 'vertical' && self.position.dir == 'up' && connectInfo.connectSide == 'down') connectDir = 'down';
    if(self.position.orientation == 'vertical' && self.position.dir == 'up' && connectInfo.connectSide == 'left') connectDir = 'left';
    if(self.position.orientation == 'vertical' && self.position.dir == 'up' && connectInfo.connectSide == 'right') connectDir = 'right';

    if(self.position.orientation == 'vertical' && self.position.dir == 'down' && connectInfo.connectSide == 'up') connectDir = 'down';
    if(self.position.orientation == 'vertical' && self.position.dir == 'down' && connectInfo.connectSide == 'down') connectDir = 'up';
    if(self.position.orientation == 'vertical' && self.position.dir == 'down' && connectInfo.connectSide == 'left') connectDir = 'right';
    if(self.position.orientation == 'vertical' && self.position.dir == 'down' && connectInfo.connectSide == 'right') connectDir = 'left';

    if(self.position.orientation == 'horizontal' && self.position.dir == 'right' && connectInfo.connectSide == 'up') connectDir = 'right';
    if(self.position.orientation == 'horizontal' && self.position.dir == 'right' && connectInfo.connectSide == 'down') connectDir = 'left';
    if(self.position.orientation == 'horizontal' && self.position.dir == 'right' && connectInfo.connectSide == 'left') connectDir = 'up';
    if(self.position.orientation == 'horizontal' && self.position.dir == 'right' && connectInfo.connectSide == 'right') connectDir = 'down';

    if(self.position.orientation == 'horizontal' && self.position.dir == 'left' && connectInfo.connectSide == 'up') connectDir = 'left';
    if(self.position.orientation == 'horizontal' && self.position.dir == 'left' && connectInfo.connectSide == 'down') connectDir = 'right';
    if(self.position.orientation == 'horizontal' && self.position.dir == 'left' && connectInfo.connectSide == 'left') connectDir = 'down';
    if(self.position.orientation == 'horizontal' && self.position.dir == 'left' && connectInfo.connectSide == 'right') connectDir = 'up';

    connectInfo.connectDir = connectDir;

    connects.push(connectInfo);
  }

  return connects;
}

DominoesGame.Tile.prototype.getAvaiableJoins = function(connects)
{
  var self = this;

  var joins = [];

  if(connects != undefined)
  {
    // console.log(connects);
    for(var i = 0; i < connects.length; i++)
    {
      var connect = connects[i];

      if(!this.isDupel)
      {
        if(connect.connectCell == this.cell1) 
        {
          addJoin({ connectTile: connect.connectTile, connectSide: connect.connectSide, joinTile: this, joinSide: 'up' });
        }        
        else if(connect.connectCell == this.cell2) 
        {
          addJoin({ connectTile: connect.connectTile, connectSide: connect.connectSide, joinTile: this, joinSide: 'down'});
        }
      }
      else 
      {
        if(connect.connectCell == this.cell1) 
        {
          // var joinSide = 'none';
          // if(orientation == 'horizontal' && connect.connectDir == 'up') joinSide = 'left';
          // if(orientation == 'horizontal' && connect.connectDir == 'down') joinSide = 'right';      
          // if(orientation == 'vertical' && connect.connectDir == 'right') joinSide = 'left';
          // if(orientation == 'vertical' && connect.connectDir == 'left') joinSide = 'right';
          // var joinSide = 'left';
          // if(connect.connectTile.next['left'].cell == null) addJoin({ connectTile: connect.connectTile, connectSide: connect.connectSide, joinTile: this, joinSide: 'right' });
          // if(connect.connectTile.next['right'].cell == null) addJoin({ connectTile: connect.connectTile, connectSide: connect.connectSide, joinTile: this, joinSide: 'left' });

          // if(connect.connectSide == 'left') addJoin({ connectTile: connect.connectTile, connectSide: connect.connectSide, joinTile: this, joinSide: 'right' });          
          // if(connect.connectSide == 'right') addJoin({ connectTile: connect.connectTile, connectSide: connect.connectSide, joinTile: this, joinSide: 'left' });   

          if(connect.connectSide == 'down') addJoin({ connectTile: connect.connectTile, connectSide: connect.connectSide, joinTile: this, joinSide: 'left' });             
          else if(connect.connectSide == 'up') addJoin({ connectTile: connect.connectTile, connectSide: connect.connectSide, joinTile: this, joinSide: 'right' });      
          // else if(connect.connectSide == 'down') addJoin({ connectTile: connect.connectTile, connectSide: connect.connectSide, joinTile: this, joinSide: 'right' });      

          // var joinSide = 'none';

          // if(orientation == 'vertical' && connect.connectDir == 'right') joinSide = 'left';
          // if(orientation == 'vertical' && connect.connectDir == 'left') joinSide = 'right';

          // addJoin({ connectTile: connect.connectTile, connectSide: connect.connectSide, joinTile: this, joinSide: joinSide });   
        }
      }


      // console.log(connect);
    }
  }
  else
  {
    var orientation = (this.isDupel)?'vertical':'horizontal';
    // var dir = (orientation == 'vertical')?'up':'right';
    addJoin({ connectTile: null, connectSide: 'none', joinTile: this, joinSide: 'center' });
  }

  function addJoin(joinInfo)
  {
    var position = self.game.getTilePosition(joinInfo);
    joinInfo.position = position;

    // console.log('AAA:', joinInfo, 'VVV:', position);

    joins.push(joinInfo);
  }

  return joins;
}

DominoesGame.Tile.isR = false;

DominoesGame.Tile.getConnectingDir = function(connectSide, connectDir)
{
  var connectingDir = 'none';

  if(connectDir == 'up')
  {
    if(connectSide == 'up') connectingDir = 'up';
    else if(connectSide == 'right') connectingDir = 'right';
    else if(connectSide == 'down') connectingDir = 'down';
    else if(connectSide == 'left') connectingDir = 'left';
  }
  else if(connectDir == 'right')
  {
    if(connectSide == 'up') connectingDir = 'right';
    else if(connectSide == 'right') connectingDir = 'down';
    else if(connectSide == 'down') connectingDir = 'left';
    else if(connectSide == 'left') connectingDir = 'up';
  }
  else if(connectDir == 'down')
  {
    if(connectSide == 'up') connectingDir = 'down';
    else if(connectSide == 'right') connectingDir = 'left';
    else if(connectSide == 'down') connectingDir = 'up';
    else if(connectSide == 'left') connectingDir = 'right';
  }
  else if(connectDir == 'left')
  {
    if(connectSide == 'up') connectingDir = 'left';
    else if(connectSide == 'right') connectingDir = 'up';
    else if(connectSide == 'down') connectingDir = 'right';
    else if(connectSide == 'left') connectingDir = 'down';
  }

  return connectingDir;
}

DominoesGame.Tile.getJoinDir = function(tileWidth, tileHeight, connectSide, joinSide, connectDir, joinOrientation, branchDir)
{
  var joinDir = 'none';
  var position = null;

  var width = tileWidth;
  var height = tileHeight;

  // console.log(connectSide, joinSide, connectDir, joinOrientation, branchDir);

  if(connectDir == 'up')
  {
    if(connectSide == 'up')
    {
      // +
      if(joinOrientation == 'vertical' && joinSide == 'right' && branchDir == 'right') joinDir = 'down';  
      else if(joinOrientation == 'vertical' && joinSide == 'right' && branchDir == 'left') joinDir = 'up';  
      else if(joinOrientation == 'vertical' && joinSide == 'left' && branchDir == 'right') joinDir = 'up';
      else if(joinOrientation == 'vertical' && joinSide == 'left' && branchDir == 'left') joinDir = 'down';
      else if(joinOrientation == 'vertical' && joinSide == 'up') joinDir = 'down';
      else if(joinOrientation == 'vertical' && joinSide == 'down') joinDir = 'up';

      if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'right') joinDir = 'left';
      else if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'left') joinDir = 'right';
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'right') joinDir = 'right';
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'left') joinDir = 'left';
      else if(joinOrientation == 'horizontal' && joinSide == 'right') joinDir = 'right';
      else if(joinOrientation == 'horizontal' && joinSide == 'left') joinDir = 'left';

      // Positions
      if(joinOrientation == 'vertical' && joinSide == 'right' && branchDir == 'right') position = { x: width, y: -height/4 }; 
      else if(joinOrientation == 'vertical' && joinSide == 'right' && branchDir == 'left') position = { x: -width, y: -height/4 }; 
      else if(joinOrientation == 'vertical' && joinSide == 'left' && branchDir == 'right') position = { x: width, y: -height/4 }; 
      else if(joinOrientation == 'vertical' && joinSide == 'left' && branchDir == 'left') position = { x: -width, y: -height/4 }; 
      else if(joinOrientation == 'vertical' && joinSide == 'up') position = { x: 0, y: -height }; 
      else if(joinOrientation == 'vertical' && joinSide == 'down') position = { x: 0, y: -height };

      if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'right') position = { x: width/2+height/2, y: -height/4 }; 
      else if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'left') position = { x: -width/2-height/2, y: -height/4 }; 
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'right') position = { x: width/2+height/2, y: -height/4 }; 
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'left') position = { x: -width/2-height/2, y: -height/4 }; 
      else if(joinOrientation == 'horizontal' && joinSide == 'right') position = { x: 0, y: -width/2-height/2 }; 
      else if(joinOrientation == 'horizontal' && joinSide == 'left') position = { x: 0, y: -width/2-height/2 }; 
    }
    else if(connectSide == 'down')
    {
      // +
      if(joinOrientation == 'vertical' && joinSide == 'right' && branchDir == 'right') joinDir = 'up';  
      else if(joinOrientation == 'vertical' && joinSide == 'right' && branchDir == 'left') joinDir = 'down';  
      else if(joinOrientation == 'vertical' && joinSide == 'left' && branchDir == 'right') joinDir = 'down';
      else if(joinOrientation == 'vertical' && joinSide == 'left' && branchDir == 'left') joinDir = 'up';
      else if(joinOrientation == 'vertical' && joinSide == 'up') joinDir = 'up';
      else if(joinOrientation == 'vertical' && joinSide == 'down') joinDir = 'down';

      if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'right') joinDir = 'right';
      else if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'left') joinDir = 'left';
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'right') joinDir = 'left';
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'left') joinDir = 'right';
      else if(joinOrientation == 'horizontal' && joinSide == 'right') joinDir = 'left';
      else if(joinOrientation == 'horizontal' && joinSide == 'left') joinDir = 'right';  

      // Positions
      if(joinOrientation == 'vertical' && joinSide == 'right' && branchDir == 'right') position = { x: -width, y: height/4 }; 
      else if(joinOrientation == 'vertical' && joinSide == 'right' && branchDir == 'left') position = { x: width, y: height/4 }; 
      else if(joinOrientation == 'vertical' && joinSide == 'left' && branchDir == 'right') position = { x: -width, y: height/4 }; 
      else if(joinOrientation == 'vertical' && joinSide == 'left' && branchDir == 'left') position = { x: width, y: height/4 }; 
      else if(joinOrientation == 'vertical' && joinSide == 'up') position = { x: 0, y: height }; 
      else if(joinOrientation == 'vertical' && joinSide == 'down') position = { x: 0, y: height };

      if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'right') position = { x: -width/2-height/2, y: height/4 }; 
      else if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'left') position = { x: width/2+height/2, y: height/4 }; 
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'right') position = { x: -width/2-height/2, y: height/4 }; 
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'left') position = { x: width/2+height/2, y: height/4 }; 
      else if(joinOrientation == 'horizontal' && joinSide == 'right') position = { x: 0, y: width/2+height/2 }; 
      else if(joinOrientation == 'horizontal' && joinSide == 'left') position = { x: 0, y: width/2+height/2 };   
    }   
    else if(connectSide == 'right')
    {
      // +
      if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'right') joinDir = 'up';
      else if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'left') joinDir = 'down';     
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'right') joinDir = 'down';
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'left') joinDir = 'up';
      else if(joinOrientation == 'vertical' && joinSide == 'right') joinDir = 'down';  
      else if(joinOrientation == 'vertical' && joinSide == 'left') joinDir = 'up';    

      if(joinOrientation == 'horizontal' && joinSide == 'up') joinDir = 'left';
      else if(joinOrientation == 'horizontal' && joinSide == 'down') joinDir = 'right'; 

      // Positions
      // if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'right') position = { x: width, y: height/4 }; 
      // else if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'left') position = { x: width, y: -height/4 };  
      // else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'right') position = { x: width, y: height/4 }; 
      // else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'left') position = { x: width, y: -height/4 };      

      if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'right') position = { x: 0, y: height }; 
      else if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'left') position = { x: 0, y: -height };  
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'right') position = { x: 0, y: height }; 
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'left') position = { x: 0, y: -height }; 

      else if(joinOrientation == 'vertical' && joinSide == 'right') position = { x: width, y: 0 }; 
      else if(joinOrientation == 'vertical' && joinSide == 'left') position = { x: width, y: 0 }; 

      if(joinOrientation == 'horizontal' && joinSide == 'up') position = { x: width/2+height/2, y: 0 }; 
      else if(joinOrientation == 'horizontal' && joinSide == 'down') position = { x: width/2+height/2, y: 0 }; 
    }    
    else if(connectSide == 'left')
    {
      // +
      if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'right') joinDir = 'down';
      else if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'left') joinDir = 'up';     
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'right') joinDir = 'up';
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'left') joinDir = 'down';
      else if(joinOrientation == 'vertical' && joinSide == 'right') joinDir = 'up'; 
      else if(joinOrientation == 'vertical' && joinSide == 'left') joinDir = 'down';     

      if(joinOrientation == 'horizontal' && joinSide == 'up') joinDir = 'right';
      else if(joinOrientation == 'horizontal' && joinSide == 'down') joinDir = 'left'; 

      // Positions
      // if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'right') position = { x: -width, y: -height/4 }; 
      // else if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'left') position = { x: -width, y: height/4 };  
      // else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'right') position = { x: -width, y: -height/4 }; 
      // else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'left') position = { x: -width, y: height/4 };       

      if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'right') position = { x: 0, y: -height }; 
      else if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'left') position = { x: 0, y: height };  
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'right') position = { x: 0, y: -height }; 
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'left') position = { x: 0, y: height }; 

      else if(joinOrientation == 'vertical' && joinSide == 'right') position = { x: -width, y: 0 }; 
      else if(joinOrientation == 'vertical' && joinSide == 'left') position = { x: -width, y: 0 }; 

      if(joinOrientation == 'horizontal' && joinSide == 'up') position = { x: -width/2-height/2, y: 0 }; 
      else if(joinOrientation == 'horizontal' && joinSide == 'down') position = { x: -width/2-height/2, y: 0 };
    }
  }

  if(connectDir == 'right')
  {
    if(connectSide == 'up')
    {
      // +
      if(joinOrientation == 'horizontal' && joinSide == 'right' && branchDir == 'right') joinDir = 'left';  
      else if(joinOrientation == 'horizontal' && joinSide == 'right' && branchDir == 'left') joinDir = 'right';  
      else if(joinOrientation == 'horizontal' && joinSide == 'left' && branchDir == 'right') joinDir = 'right';
      else if(joinOrientation == 'horizontal' && joinSide == 'left' && branchDir == 'left') joinDir = 'left';
      else if(joinOrientation == 'horizontal' && joinSide == 'up') joinDir = 'left';
      else if(joinOrientation == 'horizontal' && joinSide == 'down') joinDir = 'right';

      if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'right') joinDir = 'up';
      else if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'left') joinDir = 'down';
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'right') joinDir = 'down';
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'left') joinDir = 'up';
      else if(joinOrientation == 'vertical' && joinSide == 'right') joinDir = 'down';
      else if(joinOrientation == 'vertical' && joinSide == 'left') joinDir = 'up';

      // Positions
      if(joinOrientation == 'horizontal' && joinSide == 'right' && branchDir == 'right') position = { x: height/4, y: width };
      else if(joinOrientation == 'horizontal' && joinSide == 'right' && branchDir == 'left') position = { x: height/4, y: -width };
      else if(joinOrientation == 'horizontal' && joinSide == 'left' && branchDir == 'right') position = { x: height/4, y: width };
      else if(joinOrientation == 'horizontal' && joinSide == 'left' && branchDir == 'left') position = { x: height/4, y: -width };
      else if(joinOrientation == 'horizontal' && joinSide == 'up') position = { x: height, y: 0 };
      else if(joinOrientation == 'horizontal' && joinSide == 'down') position = { x: height, y: 0 };

      if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'right') position = { x: height/4, y: width/2+height/2 };
      else if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'left') position = { x: height/4, y: -width/2-height/2 };
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'right') position = { x: height/4, y: width/2+height/2 };
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'left') position = { x: height/4, y: -width/2-height/2 };
      else if(joinOrientation == 'vertical' && joinSide == 'right') position = { x: height/2+width/2, y: 0 };
      else if(joinOrientation == 'vertical' && joinSide == 'left') position = { x: height/2+width/2, y: 0 };
    }
    else if(connectSide == 'down')
    {
      // +
      if(joinOrientation == 'horizontal' && joinSide == 'right' && branchDir == 'right') joinDir = 'right';  
      else if(joinOrientation == 'horizontal' && joinSide == 'right' && branchDir == 'left') joinDir = 'left';  
      else if(joinOrientation == 'horizontal' && joinSide == 'left' && branchDir == 'right') joinDir = 'left';
      else if(joinOrientation == 'horizontal' && joinSide == 'left' && branchDir == 'left') joinDir = 'right';
      else if(joinOrientation == 'horizontal' && joinSide == 'up') joinDir = 'right';
      else if(joinOrientation == 'horizontal' && joinSide == 'down') joinDir = 'left';

      if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'right') joinDir = 'down';
      else if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'left') joinDir = 'up';
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'right') joinDir = 'up';
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'left') joinDir = 'down';
      else if(joinOrientation == 'vertical' && joinSide == 'right') joinDir = 'up';
      else if(joinOrientation == 'vertical' && joinSide == 'left') joinDir = 'down';

      // Positions
      if(joinOrientation == 'horizontal' && joinSide == 'right' && branchDir == 'right') position = { x: -height/4, y: -width };
      else if(joinOrientation == 'horizontal' && joinSide == 'right' && branchDir == 'left') position = { x: -height/4, y: width };
      else if(joinOrientation == 'horizontal' && joinSide == 'left' && branchDir == 'right') position = { x: -height/4, y: -width };
      else if(joinOrientation == 'horizontal' && joinSide == 'left' && branchDir == 'left') position = { x: -height/4, y: width };
      else if(joinOrientation == 'horizontal' && joinSide == 'up') position = { x: -height, y: 0 };
      else if(joinOrientation == 'horizontal' && joinSide == 'down') position = { x: -height, y: 0 };

      if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'right') position = { x: -height/4, y: -width/2-height/2 };
      else if(joinOrientation == 'vertical' && joinSide == 'up' && branchDir == 'left') position = { x: -height/4, y: width/2+height/2 };
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'right') position = { x: -height/4, y: -width/2-height/2 };
      else if(joinOrientation == 'vertical' && joinSide == 'down' && branchDir == 'left') position = { x: -height/4, y: width/2+height/2 };
      else if(joinOrientation == 'vertical' && joinSide == 'right') position = { x: -height/2-width/2, y: 0 };
      else if(joinOrientation == 'vertical' && joinSide == 'left') position = { x: -height/2-width/2, y: 0 };
    }
    if(connectSide == 'right')
    {
      // +
      if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'right') joinDir = 'right';
      else if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'left') joinDir = 'left';     
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'right') joinDir = 'left';
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'left') joinDir = 'right';
      else if(joinOrientation == 'horizontal' && joinSide == 'right') joinDir = 'left'; 
      else if(joinOrientation == 'horizontal' && joinSide == 'left') joinDir = 'right';     

      if(joinOrientation == 'vertical' && joinSide == 'up') joinDir = 'up';
      else if(joinOrientation == 'vertical' && joinSide == 'down') joinDir = 'down'; 

      // Positions
      // if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'right') position = { x: -height/4, y: width };
      // else if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'left') position = { x: height/4, y: width };    
      // else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'right') position = { x: -height/4, y: width };
      // else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'left') position = { x: height/4, y: width };      

      if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'right') position = { x: -height, y: 0 };
      else if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'left') position = { x: height, y: 0 };    
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'right') position = { x: -height, y: 0 };
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'left') position = { x: height, y: 0 };

      else if(joinOrientation == 'horizontal' && joinSide == 'right') position = { x: 0, y: width };
      else if(joinOrientation == 'horizontal' && joinSide == 'left') position = { x: 0, y: width };   

      if(joinOrientation == 'vertical' && joinSide == 'up') position = { x: 0, y: width/2+height/2 };
      else if(joinOrientation == 'vertical' && joinSide == 'down') position = { x: 0, y: width/2+height/2 };
    }
    else if(connectSide == 'left')
    {
      // +
      if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'right') joinDir = 'left';
      else if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'left') joinDir = 'right';     
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'right') joinDir = 'right';
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'left') joinDir = 'left';
      else if(joinOrientation == 'horizontal' && joinSide == 'right') joinDir = 'right'; 
      else if(joinOrientation == 'horizontal' && joinSide == 'left') joinDir = 'left';     

      if(joinOrientation == 'vertical' && joinSide == 'up') joinDir = 'down';
      else if(joinOrientation == 'vertical' && joinSide == 'down') joinDir = 'up'; 

      // Positions
      // if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'right') position = { x: height/4, y: -width };
      // else if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'left') position = { x: -height/4, y: -width };    
      // else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'right') position = { x: height/4, y: -width };
      // else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'left') position = { x: -height/4, y: -width };      

      if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'right') position = { x: height, y: 0 };
      else if(joinOrientation == 'horizontal' && joinSide == 'up' && branchDir == 'left') position = { x: -height, y: 0 };    
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'right') position = { x: height, y: 0 };
      else if(joinOrientation == 'horizontal' && joinSide == 'down' && branchDir == 'left') position = { x: -height, y: 0 };

      else if(joinOrientation == 'horizontal' && joinSide == 'right') position = { x: 0, y: -width };
      else if(joinOrientation == 'horizontal' && joinSide == 'left') position = { x: 0, y: -width };   

      if(joinOrientation == 'vertical' && joinSide == 'up') position = { x: 0, y: -width/2-height/2 };
      else if(joinOrientation == 'vertical' && joinSide == 'down') position = { x: 0, y: -width/2-height/2 };
    } 
  }

  if(connectDir == 'down')
  {
    var info = DominoesGame.Tile.getJoinDir(width, height, connectSide, joinSide, 'up', joinOrientation, branchDir);
    joinDir = DominoesGame.Tile.getAntiDir(info.joinDir);
    position = info.joinPosition;
    position.x *= -1;
    position.y *= -1;
  }

  if(connectDir == 'left')
  {
    var info = DominoesGame.Tile.getJoinDir(width, height, connectSide, joinSide, 'right', joinOrientation, branchDir);
    joinDir = DominoesGame.Tile.getAntiDir(info.joinDir);
    position = info.joinPosition;
    position.x *= -1;
    position.y *= -1;
  }

  return { joinDir: joinDir, joinPosition: position };
}

// DominoesGame.Tile.prototype.getNextPosition = function(connectSide, joinOrientation) // dir: forward/right/left
// {
//   var position = null;

//   if(connectSide == 'up')

//   return position;
// }
/*
DominoesGame.Tile.prototype.getNextPosition = function(side, dir) // dir: forward/right/left
{
  var position = null;

  // var center = { x: 0, y: 0};
  var shift = 0;

  if(side == 'up')
  {
    if(dir == 'forward') position = { x: 0, y: -this.height/2-shift };
    else if(dir == 'left') position = { x: -this.width/2-shift, y: -this.height/4 };
    else if(dir == 'right') position = { x: this.width/2+shift, y: -this.height/4 };
  }
  else if(side == 'down')
  {
    if(dir == 'forward') position = { x: 0, y: this.height/2+shift };
    else if(dir == 'left') position = { x: this.width/2-shift, y: this.height/4 };
    else if(dir == 'right') position = { x: -this.width/2+shift, y: this.height/4 };
  }
  else if(side == 'left')
  {
    position = { x: -this.width/2-shift, y: 0 };
  } 
  else if(side == 'right')
  {
    position = { x: this.width/2+shift, y: 0 };
  }

  var angle = DominoesGame.Tile.getDirAngle(this.position.dir);
  // console.log("CCC:", this.width, this.height, position);
  position = Util.rotatePoint(position.x, position.y, angle);
  position.x += this.position.x;
  position.y += this.position.y;
  // console.log("AAA:", position);

  return position;
}
*/
DominoesGame.Tile.getDirAngle = function(dir)
{
  if(dir == 'up') return 0;
  if(dir == 'right') return -90;
  if(dir == 'down') return 180;
  if(dir == 'left') return 90;

  return null;
}

DominoesGame.Tile.getAntiOrientation = function(orientation)
{
  if(orientation == 'vertical') return 'horizontal';
  if(orientation == 'horizontal') return 'vertical';

  return null;
}

DominoesGame.Tile.getAntiDir = function(dir)
{
  if(dir == 'up') return 'down';
  else if(dir == 'down') return 'up';
  else if(dir == 'left') return 'right';
  else if(dir == 'right') return 'left';

  return'none';
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //