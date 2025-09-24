var App = function()
{
  EventEmitter.call(this);


  App.instance = this;

  this.version = '1.5';

  this.dt = 0;
  this.et = 0;
  this.etTime = new Date().getTime();
  this.fps = 60;

  this.audioState = 'on';
  this.isMuteByPlayer = false;
  this.isMuteByWindow = false;

  this.gameFocus = true;

  this.forUpdate = [];

  this.mouse = {x: 0, y: 0};

  this.resizeCounter = 0;
};
App.prototype = Object.create(EventEmitter.prototype);
App.prototype.constructor = App;

App.prototype.init = function()
{
  // console.log('App: Init!');

  //console.log(loader.resources);
  interaction.addListener('mousemove', function(data)
  {
    app.mouse = data.data.global;
  });
  interaction.addListener('touchmove', function(data)
  {
    app.mouse = data.data.global;
  });
  interaction.addListener('pointerdown', function(data)
  {
    // nextAction();
  });

  // var actions = ['init_new_game', 'burst', 'burst', 'burst', 'burst', 'burst', 'lose', 'burst', 'burst', 'burst', 'burst', 'burst', 'lose', 'burst', 'burst', 'burst', 'burst', 'burst', 'lose'];
  // function nextAction()
  // {
  //   if(actions.length == 0) return;

  //   // app.gameScene.action({name: actions[0]});
  //   // actions.splice(0, 1);	
  // }

  guiManager.emit('game_resize', {width: guiManager.rootScene.width, height: guiManager.rootScene.height});

  this.isMobile = false; //initiate as false
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) this.isMobile = true;
  // console.log('IsMobile:', this.isMobile);

  this.gameData = 
  {
  	rules: 'draw',
  	players: '1v1',
  	dificulty: 'normal',

  	menu: 
  	{
  		game: 'draw',
  		players: '1v1',
  		dificulty: 'normal'
  	},

  	boardStyle: 'minimalistic',
  	tilesStyle: 'minimalistic',
  	dotsStyle: 'colorized',

  	autoDraw: false,

  	activeGame: null,

  	achievements:
  	{
  		info:
  		{
  			wins:
  			{
  				players_1v1: 0,
  				players_1v2: 0,
  				players_1v3: 0,
  				players_2v2: 0
  			},
  			completeModes:
  			{
  				draw: false,
  				all_fives: false,
  				block: false
  			}
  		},

  		items:
  		[
  			{ name: 'win_game_in_every_mode', label: 'Win a game in each mode (Classic, All-Fives, and Block)', complete: false },
  			{ name: 'win_game_without_op_scoring', label: 'Win a game without your opponents scoring', complete: false },
  			{ name: 'win_4_player_game_vs_hard', label: 'Win a 4-player game against three hard bots', complete: false },
  			{ name: 'score_25_in_one_round', label: 'Score 25 points in one round', complete: false },
  			{ name: 'score_50_in_one_round', label: 'Score 50 points in one round', complete: false },
  			{ name: 'score_75_in_all_fives', label: 'Score 75 bonus points in one game of All-Fives', complete: false },
  			{ name: 'lose_round_with_only_1_point', label: 'Lose a round with only 1 point or less in your hand', complete: false },
  			{ name: 'win_10_games', label: 'Win 10 games in any mode', complete: false },
  			{ name: 'win_100_games', label: 'Win 100 games in any mode', complete: false }
  		]
  	}
  }

  // this.gameData.activeGames = {};

  // var gMods = ['draw', 'all_fives', 'block'];
  // var gPlayers = ['1v1', '1v2', '1v3', '2v2'];
  // var gDificultyes = ['normal', 'hard'];
  // for(var i = 0; i < gMods.length; i++)
  // {
  // 	this.gameData.activeGames[gMods[i]] = {};

  // 	for(var j = 0; j < gPlayers.length; j++)
  // 	{
  // 		this.gameData.activeGames[gMods[i]][gPlayers[j]] = {};

  // 		for(var t = 0; t < gDificultyes.length; t++)
  // 		{
  // 			this.gameData.activeGames[gMods[i]][gPlayers[j]][gDificultyes[t]] = null;
  // 		}
  // 	}
  // }

  var settingsData = assetsManager.loader.resources['data'].data;
  this.victoryScores = settingsData.settings.victory_score;

  this.aiEasyMistakeEnable = settingsData.settings['ai_easy_all_fives'].enable;
  this.aiEasyMistakePercent = settingsData.settings['ai_easy_all_fives'].mistake_percent;

  this.achievementPopupDisplayTime = settingsData.settings.achievement_popup_display_time;

  this.isCheats = settingsData.settings.cheats;
  // console.log(this.isCheats);

  // console.log('MMM:', this.aiEasyMistakeEnable, this.aiEasyMistakePercent, this.achievementPopupDisplayTime);

  // console.log(this.victoryScores);

  // this.wordsList = assetsManager.loader.resources['words_list'].data.words;
  // console.log(this.wordsList);

  // this.save();
  this.load(); 

  // app.setAudioState('off');

  // this.gameScene = new GameScene();
  // guiManager.rootScene.addChild(this.gameScene);

  this.bgGradient = new PIXI.extras.TilingSprite(assetsManager.getTexture('texture_atlas', 'bg_gradient_1.png'));
  guiManager.rootScene.addChild(this.bgGradient);
  this.bgGradient.anchor.set(0.5, 0.5);

  app.on('board_style_setted', function(boardStyle)
  {
  	// console.log('BS:', boardStyle);
  	if(boardStyle == 'minimalistic')
  	{
  		app.bgGradient.texture = assetsManager.getTexture('texture_atlas', 'bg_gradient_1.png');
  	}
  	else if(boardStyle == 'realistic')
  	{
  		app.bgGradient.texture = assetsManager.getTexture('texture_atlas', 'bg_gradient_2.png');
  	}
  }, this);

  this.screenAchievements = new ScreenAchievements({name: 'screen_achievements', parentPanel: guiManager.rootScene});
  this.screenMainMenu = new ScreenMainMenu({name: 'screen_main_menu', parentPanel: guiManager.rootScene});
  this.screenGame = new ScreenGame({name: 'screen_game', parentPanel: guiManager.rootScene});
  this.panelAchievementComplete = new PanelAchievementComplete({name: 'achievement_complete', parentPanel: guiManager.rootScene});
  this.panelSettings = new PanelSettings({name: 'panel_settings', parentPanel: guiManager.rootScene});
  this.popupSave = new PopupSave({name: 'popup_save', parentPanel: guiManager.rootScene});
  this.panelHelp = new PanelHelp({name: 'panel_help', parentPanel: guiManager.rootScene});

  this.containerRotateScreen = new PIXI.Container();
  guiManager.rootScene.addChild(this.containerRotateScreen);
  this.rotateScreenBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'bg_gradient_1.png'));
  this.containerRotateScreen.addChild(this.rotateScreenBg);
  this.rotateScreenBg.width = 3500;
  this.rotateScreenBg.anchor.set(0.5, 0.5);  
  this.rotateScreenIcon = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'rotate_screen.png'));
  this.containerRotateScreen.addChild(this.rotateScreenIcon);
  this.rotateScreenIcon.anchor.set(0.5, 0.5);
  this.containerRotateScreen.visible = false;
  this.rotateScreenBg.interactive = true;

  // this.screenGame = new ScreenGame({name: 'screen_game', parentPanel: guiManager.rootScene});

  TweenMax.delayedCall(1, function()
  {
  	// app.panelSettings.tween({name: 'show_anim'});
  	// app.popupSave.tween({name: 'show_anim'});

  	// app.popupSave.show(function()
  	// {
  	// 	app.popupSave.tween({name: 'hide_anim'}, function()
  	// 	{
  	// 		console.log('Selected: Yes');
  	// 	});
  	// },
  	// function()
  	// {
  	// 	app.popupSave.tween({name: 'hide_anim'}, function()
  	// 	{
  	// 		console.log('Selected: No');
  	// 	});
  	// });
  });

  // this.buttonAudio = new Gui.ButtonAudio({name: 'button_audio', parentPanel: guiManager.rootScene, width: 120, height: 120, x: 415, y: -420});

  // this.field = new Field({name: 'field', parentPanel: guiManager.rootScene});

  this.screenMainMenu.onOrientationChange({orientation: guiManager.orientation})
  this.screenGame.onOrientationChange({orientation: guiManager.orientation})
  // this.screenGame.onOrientationChange({orientation: guiManager.orientation})

  // this.buttonAudio = new Gui.ButtonAudio({name: 'button_audio', parentPanel: guiManager.rootScene, width: 70, height: 70, positionType: 'left-bot', xRelative: 90, yRelative: -10});

  // this.buttonHelp = Gui.createSimpleButton({name: 'button_help', parentPanel: guiManager.rootScene, width: 70, height: 70, positionType: 'left-bot', xRelative: 10, yRelative: -10},
  // {
  //   pathToSkin: 'ScreenGame/button_help.png',
  //   onClick: function()
  //   {
  //     if(!(app.screenMainMenu.state == 'show' || app.screenGame.state == 'show')) return;

  //     app.panelHelp.tween({name: 'show_anim'});
  //   }
  // });

  this.whiteOver = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'white_rect.png'));
  guiManager.rootScene.addChild(this.whiteOver);
  this.whiteOver.width = this.whiteOver.height = 2500;
  this.whiteOver.anchor.set(0.5, 0.5);
  this.whiteOver.alpha = 0;

  // this.screenMainMenu.tween({name: 'show_from_preloader'});
  app.checkSaveGame();
  app.emit('clear_preloader');

  guiManager.on('orientation_change', this.onOrientationChange, this);
  this.onOrientationChange({orientation: guiManager.orientation});

  guiManager.on('game_resize', function(data)
  {
  	app.bgGradient.width = data.width + 5;
  	app.bgGradient.height = 900;
  	app.bgGradient.scale.y = (data.height + 5) / 900;

  	app.rotateScreenBg.height = data.height + 5;
  	// app.bgGradient.tileScale.y = (data.height + 5) / 900;
  	// console.log(app.bgGradient.tileScale.y);

  	// console.log(app.screenGame.width, app.screenGame.height);
  	// console.lo
  });

  guiManager.resize(guiManager.rootScene.width, guiManager.rootScene.height, true);

  app.isCheatShowHands = false;

  if(app.isCheats)
  {
    var key;
    key = Util.keyboard(81);
    key.press = function()
    {
    	app.setBoardStyle(app.gameData.boardStyle == 'minimalistic'?'realistic':'minimalistic');
    }

    key = Util.keyboard(87);
    key.press = function()
    {
    	app.setTilesStyle(app.gameData.tilesStyle == 'minimalistic'?'realistic':'minimalistic');
    }

    key = Util.keyboard(69);
    key.press = function()
    {
    	app.setDotsStyle(app.gameData.dotsStyle == 'colorized'?'black':'colorized');
    }

    var key = Util.keyboard('Z'.charCodeAt(0));
    key.press = function()
    {
      app.achievementComplete('win_game_in_every_mode');
    };  
    var key = Util.keyboard('X'.charCodeAt(0));
    key.press = function()
    {
      app.achievementComplete('win_100_games');
    };  
    var key = Util.keyboard('C'.charCodeAt(0));
    key.press = function()
    {
      app.achievementComplete('win_game_without_op_scoring');
    };  

    var key = Util.keyboard('Y'.charCodeAt(0));
    key.press = function()
    {
      app.cheatShowHands();
    };
  }

  Util.containerDebug = new PIXI.Container();
  guiManager.rootScene.addChild(Util.containerDebug);

  // app.setAudioState('off');

  // var joinDir = DominoesGame.Tile.getJoinDir('up', 'down', 'right', 'horizontal', 'forward');
  // console.log(joinDir, 'right');

  // var joinDir = DominoesGame.Tile.getJoinDir('up', 'left', 'down', 'vertical', 'right');
  // console.log(joinDir);

  // var position = Util.rotatePoint(0, -100, 0);
  // console.log(position);
  
  // var position = Util.rotatePoint(0, -100, -90);
  // console.log(position);

  // var position = Util.rotatePoint(0, -100, 180);
  // console.log(position);

  // var position = Util.rotatePoint(0, -100, 90);
  // console.log(position);

  // var testArr = [ { summ: 5 }, { summ: 10 }, { summ: 3 }];
  // testArr.sort(function(v1, v2)
  // {
  // 	return v2.summ - v1.summ;
  // });
  // console.log(testArr);

  // console.log("P: " + app.gameData.gamePlayed);

  // this.whiteOver = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'white_rect.png'));
  // guiManager.rootScene.addChild(this.whiteOver);
  // this.whiteOver.width = this.whiteOver.height = 3000;
  // this.whiteOver.anchor.set(0.5, 0.5);
  // this.whiteOver.visible = false;
  // this.whiteOver.interactive = true;

  // setTimeout(function()
  // {
  // 	console.log('ssss');
  // 	app.gameData.gamePlayed = 1000;
  // 	app.apiCallback('start');
  // }, 1000);
};

// App.prototype.initGame = function()
// {
//   this.screenMainMenu.tween({name: 'show_anim'});
// }

App.prototype.checkSaveGame = function()
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
       toGame(activeGame);
     });
    },
    function()
    {
     app.popupSave.tween({name: 'hide_anim'}, function()
     {
       // console.log('Selected: No');
       app.screenMainMenu.tween({name: 'show_anim'});
     });
    });
  }
  else
  {
  	app.screenMainMenu.tween({name: 'show_anim'});
  }

  function toGame(activeGame)
  {
	  // TweenMax.delayedCall(8/30, function()
	  // {
	    // app.screenGame.tween({name: 'show_anim'});
	    app.screenGame.initGameFromMainMenu(activeGame);
	  // });
  }

  // console.log('Active game:', activeGame);
}

App.prototype.cheatShowHands = function()
{
	app.isCheatShowHands = !app.isCheatShowHands;

	app.emit('cheat_show_hands', { isCheat: app.isCheatShowHands });

	if(app.screenGame.players != null)
	{
		for(var i = 0; i < app.screenGame.players.length; i++)
		{
			if(app.screenGame.players[i] == app.screenGame.panelPlayerHuman) continue;
			
			var tilesContainer = app.screenGame.players[i].tilesContainer;
			for(var j = 0; j < tilesContainer.tiles.length; j++)
			{
				var tile = tilesContainer.tiles[j];
				tile.containerFront.alpha = app.isCheatShowHands?1:0;
			}
		}
	}
}

App.prototype.onOrientationChange = function(data)
{
  var orientation = data.orientation;

  if(orientation == 'portrait')
  {
  	this.containerRotateScreen.visible = true;
    // this.panelRotate.tween({name: 'show'});
  }  
  if(orientation == 'landscape')
  {
  	this.containerRotateScreen.visible = false;
    // this.panelRotate.tween({name: 'hide'});
  }

  // console.log(this.panelRotate);
}


App.prototype.apiCallback = function(name, data)
{
  if(parent && parent.cmgGameEvent)
  {
  	// console.log('cmgEvent: ' + name + ',', data);

    if(data != null && data != undefined) parent.cmgGameEvent(name, data);
    else parent.cmgGameEvent(name);
  }
}

App.prototype.findAchievementItem = function(key)
{
	for(var i = 0; i < app.gameData.achievements.items.length; i++)
	{
		if(app.gameData.achievements.items[i].name == key) 
		{
			return app.gameData.achievements.items[i];
		}
	}

	return null;
}

App.prototype.achievementInfo = function(data)
{
	// console.log('a_info', data);

	if(data.name == 'match_win')
	{
		var players = data.players;
		var dificulty = data.dificulty;
		var rules = data.rules;

		app.gameData.achievements.info.wins['players_'+players] ++;
		app.gameData.achievements.info.completeModes[rules] = true;

		if(!app.findAchievementItem('win_10_games').complete && app.gameData.achievements.info.wins['players_'+players] >= 10) app.achievementComplete('win_10_games');
		if(!app.findAchievementItem('win_100_games').complete && app.gameData.achievements.info.wins['players_'+players] >= 100) app.achievementComplete('win_100_games');
		
		if(!app.findAchievementItem('win_4_player_game_vs_hard').complete && (players == '1v3' || players == '2v2') && dificulty == 'hard') app.achievementComplete('win_4_player_game_vs_hard');

		if(!app.findAchievementItem('win_game_in_every_mode').complete)
		{
			if(app.gameData.achievements.info.completeModes['draw'] == true &&
			   app.gameData.achievements.info.completeModes['all_fives'] == true &&
			   app.gameData.achievements.info.completeModes['block'] == true)
			{
				app.achievementComplete('win_game_in_every_mode');
			}
		} 

		if(!app.findAchievementItem('win_game_without_op_scoring').complete && !data.isOpponentsScoring) app.achievementComplete('win_game_without_op_scoring');
		// console.log('match_win', players, dificulty, app.gameData.achievements.info);
	}
	if(data.name == 'human_round_score')
	{
		// console.log('human score:', data.score);
		if(!app.findAchievementItem('score_25_in_one_round').complete && data.score >= 25) app.achievementComplete('score_25_in_one_round');
		if(!app.findAchievementItem('score_50_in_one_round').complete && data.score >= 50) app.achievementComplete('score_50_in_one_round');
	}
	if(data.name == 'human_all_five_score')
	{
		// console.log('human all_fives score', data.score);
		if(!app.findAchievementItem('score_75_in_all_fives').complete && data.score >= 75) app.achievementComplete('score_75_in_all_fives');
	}
	if(data.name == 'round_lose')
	{
		// console.log('asdasdasdasdasd', data);
		if(!app.findAchievementItem('lose_round_with_only_1_point').complete && data.tilesWeight >= 0 && data.tilesWeight <= 1) app.achievementComplete('lose_round_with_only_1_point');
	}
}

App.prototype.achievementComplete = function(key)
{
	var item = null;
	for(var i = 0; i < app.gameData.achievements.items.length; i++)
	{
		if(app.gameData.achievements.items[i].name == key) 
		{
			item = app.gameData.achievements.items[i];
			break;
		}
	}
	if(item == null || item.complete) return;

	// console.log(key, item);

	item.complete = true;

	app.emit('achievement_complete', { item: item });

	app.save();
}

App.prototype.setRules = function(rules)
{
	app.gameData.rules = rules;
}
App.prototype.setPlayers = function(players)
{
	app.gameData.players = players;
}
App.prototype.setDificulty = function(dificulty)
{
	app.gameData.dificulty = dificulty;
}

App.prototype.getNewGameInfo = function()
{
	return { rules: app.gameData.rules, players: app.gameData.players, dificulty: app.gameData.dificulty };
}

App.prototype.setAutoDraw = function(autoDraw)
{
	app.gameData.autoDraw = autoDraw;

	app.emit('auto_draw_setted', autoDraw);
}

App.prototype.setBoardStyle = function(boardStyle)
{
	app.gameData.boardStyle = boardStyle;

	app.emit('board_style_setted', boardStyle);
}
App.prototype.setTilesStyle = function(tilesStyle)
{
	app.gameData.tilesStyle = tilesStyle;

	app.emit('tiles_style_setted', tilesStyle);
}
App.prototype.setDotsStyle = function(dotsStyle)
{
	app.gameData.dotsStyle = dotsStyle;

	app.emit('dots_style_setted', dotsStyle);
}

// App.prototype.sa

App.prototype.saveActiveGame = function(saveData)
{
	if(saveData == null)
	{
		app.gameData.activeGame = null;
	}
	else 
	{
		var gMode = app.gameData.rules;
		var gPlayers = app.gameData.players;
		var gDificulty = app.gameData.dificulty;

		app.gameData.activeGame = { gMode: gMode, gPlayers: gPlayers, gDificulty: gDificulty, saveData: saveData };
	}

	// console.log('Save active game:', gMode, gPlayers, gDificulty, saveData);

	// app.gameData.activeGames[gMode][gPlayers][gDificulty] = saveData;

	// console.log(app.gameData.activeGames);

	app.save();
}
App.prototype.loadActiveGame = function(gMode, gPlayers, gDificulty)
{
	// var gMode = app.gameData.rules;
	// var gPlayers = app.gameData.players;
	// var gDificulty = app.gameData.dificulty;

	// return app.gameData.activeGames[gMode][gPlayers][gDificulty];

	if(app.gameData.activeGame != null)
	{
		if(app.gameData.activeGame.gMode == gMode && app.gameData.activeGame.gPlayers == gPlayers && app.gameData.activeGame.gDificulty == gDificulty) return app.gameData.activeGame.saveData;
	}

	return null;
}

App.prototype.save = function()
{
  // var data = app.gameData.scores;
  var data = 
  {
  	version: app.version,
  	achievements: app.gameData.achievements,
  	activeGame: app.gameData.activeGame,
  	menu: app.gameData.menu
  }

  var jsonString = JSON.stringify(data);

  localStorage.setItem('dominoes_save', jsonString);

  // console.log('Save!', data);
}
App.prototype.load = function()
{
  var data = localStorage.getItem('dominoes_save');
  if(data == undefined || data == null) data = null;
  if(data != null)
  {
  	// console.log('Load string:', data);
    data = JSON.parse(data);
    if(data.version != app.version) data = null;
  }

  if(data == null) 
  {
    app.save();
    data = localStorage.getItem('dominoes_save');
    data = JSON.parse(data);
  }  

  app.gameData.achievements = data.achievements;
  app.gameData.activeGame = data.activeGame;
  app.gameData.menu = data.menu;

  console.log('Load!', data);
}

App.prototype.focusChange = function(focus)
{
  if(this.gameFocus == focus) return;

  this.gameFocus = focus;

  if(this.gameFocus)
  {
    this.isMuteByWindow = false;
  }
  else 
  {
    this.isMuteByWindow = true;
  }

  this.checkAudioMute();
}

App.prototype.createMusic = function(name)
{
  var audio = constsManager.getData('audio_info/audio/'+name); 
  var id = audio.play();

  audio.loop(true, id);
  // audio.volume(0.2, id);

  var music = {audio: audio, id: id, name: name, _volume: 1};

  Object.defineProperty(music, 'volume',
  {
    set: function(value)
    {
      music._volume = value;
      music.audio.volume(music._volume, music.id);
    },
    get: function()
    {
      return music._volume;
    }
  });

  // music.pause = function()
  // {
  //   music.audio.pause(music.id);
  // }
  // music.stop = function()
  // {
  //   music.audio.stop(music.id);
  // }
  // music.play = function()
  // {
  //   var audio = constsManager.getData('audio_info/audio/'+music.name); 
  //   music.audio = audio;
  //   music.id = music.audio.play();
  // }

  return music;
}

App.prototype.setMusic = function(name)
{
  var self = this;

  // console.log('set music:', name);

  var nextMusic = name == 'music_battle'?this.musicBattle:this.musicMenu;

  if(this.currentMusic == null)
  {
    this.currentMusic = nextMusic;
    this.currentMusic.volume = 0;
    TweenMax.to(this.currentMusic, 5, {volume: 1});
  }
  else 
  {
    TweenMax.to(this.currentMusic, 1, {volume: 0, onComplete:function()
    {
      self.currentMusic = nextMusic;
      self.currentMusic.volume = 0;
      TweenMax.to(self.currentMusic, 1, {volume: 1});
    }});
  }
}

App.prototype.playAudio = function(dir, name, data)
{
  var audio = constsManager.getData('audio_info/audio/'+name);  
  // audio.loop(true);

  var delay = 0;
  if(data != null && data.delay != undefined) delay = data.delay;

  if(delay == 0) audio.play();
  else 
  {
  	TweenMax.delayedCall(delay, function()
  	{
  		audio.play();
  	});
  }
  


  // audio.loop(true, a);
  //console.log(audio.loop);

  // if(this.audioState == 'off') audio.muted = true;

  // console.log('play sound:', name);
}
App.prototype.setAudioState = function(state)
{
  if(this.audioState == state) return;

  this.audioState = state;
  // if(state == 'on') PIXI.audioManager.unmute();
  // else if(state == 'off') PIXI.audioManager.mute();

  if(state == 'on')
  {
    this.isMuteByPlayer = false;
  } 
  else if(state == 'off')
  {
    this.isMuteByPlayer = true;
  }

  this.checkAudioMute();
  // console.log(audios);

  // console.log('set audio state:', state, PIXI.audioManager);
}
App.prototype.checkAudioMute = function()
{
  var isMute = this.isMuteByPlayer || this.isMuteByWindow;

  // console.log(isMute);

  var audios = constsManager.getData('audio_info/audio');
  for(var key in audios)
  {
    var audio = audios[key];
    audio.mute(isMute);
  }
}

App.prototype.addForUpdate = function(f, context)
{
  if(context == undefined) context = null;
  this.forUpdate.push({f: f, context: context});
}

App.prototype.update = function()
{
  for(var i = 0; i < this.forUpdate.length; i++)
  {
    if(this.forUpdate[i].context != null) this.forUpdate[i].f.call(this.forUpdate[i].context);
    else this.forUpdate[i].f();
  }

  // console.log(interaction.mouse.global);
};

App.prototype.loop = function(time)
{
  requestAnimationFrame(app.loop);

  var now = new Date().getTime();
  this.et = (now - this.etTime)*0.001;
  this.etTime = now;

  app.update();

  renderer.render(stage);

  if(app.resizeCounter == 0) 
  {
    resize();
    app.resizeCounter = 30;
  }
  else if(app.resizeCounter > 0) app.resizeCounter --;
};

App.instance = null;
App.getInstance = function()
{
  return App.instance;
};
//=========================================================================================================================================================================//