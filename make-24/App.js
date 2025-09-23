var App = function()
{
  EventEmitter.call(this);


  App.instance = this;

  this.version = '1.7';

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
  var self = this;
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
  	gmode: 'practice',
  	dificulty: 'easy',

  	isTutorial: true,
  	// isTutorial: false,

  	highScore: 
  	{ 	
  		arcade:
  		{
  			easy: 0,
  			medium: 0,
  			hard: 0
  		}
  	},

  	completeBoards:
  	{
  		easy: [],
  		medium: [],
  		hard: []
  	}
  }

  var time1 = Date.now();

  var boardsData = assetsManager.loader.resources['data'].data.boards;
  var boardsEasy = boardsData.easy;
  var boardsMedium = boardsData.medium;
  var boardsHard = boardsData.hard;
  boardsEasy = app.checkBoards(boardsEasy);
  boardsMedium = app.checkBoards(boardsMedium);
  boardsHard = app.checkBoards(boardsHard);

  var time2 = Date.now();

  // console.log('Time:', time2 - time1);

  // this.boardsData = assetsManager.loader.resources['data'].data.boards;
  this.boardsData = { easy: boardsEasy, medium: boardsMedium, hard: boardsHard };
  this.settingsData = assetsManager.loader.resources['data'].data.settings;
  this.isCheats = assetsManager.loader.resources['data'].data.settings.cheats;
  // console.log(this.isCheats);



  // this.save();
  this.load(); 

  // this.gameScene = new GameScene();
  // guiManager.rootScene.addChild(this.gameScene);

  // this.bgGradient = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'bg_gradient.png'));
  // guiManager.rootScene.addChild(this.bgGradient);
  // this.bgGradient.anchor.set(0.5, 0.5);

  this.screenMainMenu = new ScreenMainMenu({name: 'screen_main_menu', parentPanel: guiManager.rootScene});
  this.screenGame = new ScreenGame({name: 'screen_game', parentPanel: guiManager.rootScene});

  this.panelTutorial = new PanelTutorial({parentPanel: guiManager.rootScene, field: this.screenGame.field, x: 0, y: 0});
  // this.screenGame = new ScreenGame({name: 'screen_game', parentPanel: guiManager.rootScene});

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

  TweenMax.delayedCall(25/30, function()
  {
  	self.screenMainMenu.tween({name: 'show_from_preloader'});
  });

  guiManager.on('orientation_change', this.onOrientationChange, this);
  // this.onOrientationChange({orientation: guiManager.orientation});

  guiManager.on('game_resize', function(data)
  {
  	// app.bgGradient.width = data.width + 5;
  	// app.bgGradient.height = data.height + 5;
  });

  guiManager.emit('orientation_change', {orientation: guiManager.orientation});

  // TweenMax.delayedCall(15/30, function()
  // {
  // 	app.panelTutorial.show();
  // });

  // app.setAudioState('off');

  // this.balloons.visible = false;

  // console.log(interaction);

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


  // console.log(printPermutations([1, 2, 3, 4], 4));
};

// App.prototype.initGame = function()
// {
//   this.screenMainMenu.tween({name: 'show_anim'});
// }

App.prototype.boardComplete = function(dificulty, board)
{
	var boardId = this.boardsData[dificulty].indexOf(board);
	if(boardId == -1 || app.gameData.completeBoards[dificulty].indexOf(boardId) != -1) return;

	app.gameData.completeBoards[dificulty].push(boardId);

	// console.log('App board complete:', dificulty, board, boardId);
	// console.log('App completeBoards:', app.gameData.completeBoards);

	app.save();
}

App.prototype.setButtonHover = function(button, texture1, texture2)
{
button.isNeedMouseOverOut = true;

  button.on('mouse_over', function(d)
  {
    button.skin.texture = texture2;
  }, button);
  button.on('mouse_out', function(d)
  {
    button.skin.texture = texture1;
  }, button);
}

App.prototype.checkBoards = function(boards)
{
	var verifiedBoards = [];

	for(var i = 0; i < boards.length; i++)
	{
		var board = boards[i];

		var solutions = app.calculateSolutions(board.numbers);
		if(solutions.length > 0) verifiedBoards.push(board);

		// console.log('Board:', board, 'Solution:', solutions);
		if(solutions.length == 0) console.log('Solution Not Found:', board.numbers);
		else
		{
			board.solution = solutions[0];
			// printSolution(board, solutions[0]);
		}
	}

	console.log('BoardsVerified: [' + verifiedBoards.length + '/' + boards.length + ']');

	return verifiedBoards;

	function printSolution(board, solution)
	{
		console.log('Solution', board.numbers, ':');
		console.log(solution.steps[0].number1+' '+solution.steps[0].operation+' '+solution.steps[0].number2+' = '+solution.steps[0].result);
		console.log(solution.steps[1].number1+' '+solution.steps[1].operation+' '+solution.steps[1].number2+' = '+solution.steps[1].result);
		console.log(solution.steps[2].number1+' '+solution.steps[2].operation+' '+solution.steps[2].number2+' = '+solution.steps[2].result);
	}
}

App.prototype.calculateSolutions = function(boardNumbers)
{
  // var operations = ['multiply', 'plus', 'divide', 'minus'];
  var allOperations = ['*', '+', '/', '-'];

  var numbersVariants = Util.permutations(boardNumbers, 4);

  var operationsCount = 3;

  var perms = Util.permutationsWithRepetition(allOperations, operationsCount);

  var variants = [];

  var variantResults = [];

  var solution = null;

  var isTrace = false;
  if(boardNumbers[0] == 7 && boardNumbers[1] == 7 && boardNumbers[2] == 5 && boardNumbers[3] == 6)
  {
  	// console.log()
  	isTrace = true;
  }

  for(var i = 0; i < numbersVariants.length; i++)
  {
  	var numbers = numbersVariants[i];

	perms.each(function(operations)
	{
		calculateVariant(numbers, operations, variantResults);
		// if(isTrace) console.log(numbers, operations);

		if(variantResults.length > 0) return;
	});

	if(variantResults.length > 0) break;
  }

  // if(isTrace) console.log(variantResults);

  return variantResults;

  // return solution;

  function calculateVariant(numbers, operations, variantResults)
  {
    var n1 = numbers[0];
    var n2 = numbers[1];
    var n3 = numbers[2];
    var n4 = numbers[3];

    var o1 = operations[0];
    var o2 = operations[1];
    var o3 = operations[2];

    // var isBad = false;

    // var result1 = calculateOperation(calculateOperation(calculateOperation(n1, n2, o1), n3, o2), n4, o3);
    // var result2 = calculateOperation(calculateOperation(n1, n2, o1), calculateOperation(n3, n4, o2), o3);

    var t1;
    var t2;
    var t3;

    t1 = calculateOperation(n1, n2, o1);
    if(isLegal(t1))
    {
      t2 = calculateOperation(t1, n3, o2);
      if(isLegal(t2))
      {
        t3 = calculateOperation(t2, n4, o3);
        if(isLegal(t3) && t3 == 24) 
        {
        	var solution = { result: t3, steps: [{ number1: n1, number2: n2, operation: o1, result: t1 }, { number1: t1, number2: n3, operation: o2, result: t2 }, { number1: t2, number2: n4, operation: o3, result: t3 }] };
        	variantResults.push(solution);
        }
      }
    }

    t1 = calculateOperation(n1, n2, o1);
    if(isLegal(t1))
    {
      t2 = calculateOperation(n3, n4, o2);
      if(isLegal(t2))
      {
        t3 = calculateOperation(t1, t2, o3);
        if(isLegal(t3) && t3 == 24) 
        {
        	var solution = { result: t3, steps: [{ number1: n1, number2: n2, operation: o1, result: t1 }, { number1: n3, number2: n4, operation: o2, result: t2 }, { number1: t1, number2: t2, operation: o3, result: t3 }] };
        	variantResults.push(solution);
        }
      }
    }

    t1 = calculateOperation(n1, n2, o1);
    if(isLegal(t1))
    {
      t2 = calculateOperation(n3, t1, o2);
      if(isLegal(t2))
      {
        t3 = calculateOperation(t2, n4, o3);
        if(isLegal(t3) && t3 == 24) 
        {
        	var solution = { result: t3, steps: [{ number1: n1, number2: n2, operation: o1, result: t1 }, { number1: n3, number2: t1, operation: o2, result: t2 }, { number1: t2, number2: n4, operation: o3, result: t3 }] };
        	variantResults.push(solution);
        }
      }
    }

    return variantResults;
    // var result = 0;
    // var number

    // for(var i = 0; i < operationsCount; i++)
    // {
    //   var operation = operations[i];

    //   if(i == 0) result = calculateOperation(numbers[0], numbers[1], operation);
    //   else if(i == 1) result = calculateOperation(result, numbers[2], operation);
    //   else if(i == 2) result = calculateOperation(result, numbers[3], operation);

    //   if(isBad || !isInteger(result)) return 0;
    // }

    // function calcF(n1, o1, )

    function calculateOperation(n1, n2, operation)
    {
      if(operation == '/' && n2 == 0) 
      {
        isBad = true;
        return 0;
      }

      var r = 0;

      if(operation == '*') r = n1 * n2;
      if(operation == '+') r = n1 + n2;
      if(operation == '/') r = n1 / n2;
      if(operation == '-') r = n1 - n2;

      // if(!isInteger(r)) r = 0;

      return r;
    }

    function isLegal(num) 
    {
      return (num ^ 0) === num && num >= 0;
    }

    // function isInteger(num) {
    //   return (num ^ 0) === num;
    // }

    // return result;
  }

  // var d = 0;

  // function getF(variants)
  // {
  //   d ++;
  //   if(d > 200) return;

  //   var result = [];

  //   for(var i = 0; i < variants.length; i++)
  //   {
  //     var variantResult = 
  //   }
  // }

  return 'aaa';
}

App.prototype.onOrientationChange = function(data)
{
  var orientation = data.orientation;

  if(orientation == 'portrait' && this.isMobile)
  {
    // this.panelRotate.tween({name: 'show'});
  }  
  if(orientation == 'landscape' && this.isMobile)
  {
    // this.panelRotate.tween({name: 'hide'});
  }

  // console.log(this.panelRotate);
}

// App.prototype.getScore = function()
// {
//   return app.gameData.score[app.gameData.gmode][app.gameData.dificulty];
// }
// App.prototype.setScore = function(score)
// {
//   app.gameData.score[app.gameData.gmode][app.gameData.dificulty] = score;
// }

App.prototype.getHighScore = function()
{
  return app.gameData.highScore['arcade'][app.gameData.dificulty];
}
App.prototype.setHighScore = function(score)
{
  app.gameData.highScore['arcade'][app.gameData.dificulty] = score;

  this.save();
}

App.prototype.getBaseTime = function()
{
  var time = this.settingsData['base_time'][app.gameData.dificulty];
  return time;
}
App.prototype.getBonusTime = function()
{
  var time = this.settingsData['bonus_time'][app.gameData.dificulty];
  return time;
}
App.prototype.getBlitzStartScore = function()
{
  var startScore = this.settingsData['blitz_start_score'];
  return startScore;
}

App.prototype.getBoard = function()
{


  var dificulty = getDificulty();

  function getDificulty()
  {
	var k = 'one_star';
	if(app.gameData.dificulty == 'medium') k = 'two_star';
	else if(app.gameData.dificulty == 'hard') k = 'three_star';
	var dificultyBoards = app.settingsData.dificulty[k];

	 var dificulty = 'easy';

	var n = Util.randomRangeInt(1, 100);
	if(n <= dificultyBoards['boards_easy']) dificulty = 'easy';
	else if(n > dificultyBoards['boards_easy'] && n <= dificultyBoards['boards_easy'] + dificultyBoards['boards_medium']) dificulty = 'medium';
	else if(n > dificultyBoards['boards_easy'] + dificultyBoards['boards_medium'] && n <= dificultyBoards['boards_easy'] + dificultyBoards['boards_medium'] + dificultyBoards['boards_hard']) dificulty = 'hard';
  	// console.log(dificultyBoards, n);

  	// console.log('D:', dificulty, n);

  	return dificulty;
  }




  var boards = this.boardsData[dificulty];
  var completeBoards = app.gameData.completeBoards[dificulty];

  var avaiableBoards = [];
  for(var i = 0; i < boards.length; i++)
  {
  	var boardId = i;
  	if(completeBoards.indexOf(boardId) == -1) avaiableBoards.push(boards[i]);
  }

  // console.log('Avaiable boards:', avaiableBoards.length);

  if(avaiableBoards.length == 0)
  {
  	app.gameData.completeBoards[dificulty] = [];
  	return app.getBoard();
  }
  else return Util.randomElement(avaiableBoards);
}

App.prototype.apiCallback = function(name, data)
{
  // console.log('Api:', name, data);

  if(name == 'statistics')
  {
  	var statistics = '';

  	if(app.gameData.dificulty == 'easy') statistics += '1';
  	else if(app.gameData.dificulty == 'medium') statistics += '2';
  	else if(app.gameData.dificulty == 'hard') statistics += '3';

  	if(app.gameData.gmode == 'practice') statistics += '0';
  	else if(app.gameData.gmode == 'arcade') statistics += '1';

  	if(data.out == 'home') statistics += 0;
  	else if(data.out == 'surrender') statistics += 1;
  	else if(data.out == 'times_out') statistics += 3;
  	else if(data.out == 'quit') statistics += 2;

  	if(data.boardNumbers != null)
  	{
  		statistics += data.boardNumbers[0] + '' + data.boardNumbers[1] + '' + data.boardNumbers[2] + '' + data.boardNumbers[3];
  	}

  	console.log('Statistics: ', statistics);
  	
    if(parent && parent.cmgGameEvent)
    {
      parent.cmgDataEvent("data", statistics);
    }

  	return;
  }

  if(name == 'start' || name == 'replay')
  {
  	// console.log('cmgGameEvent: ' + name, data);
  }

  if(parent && parent.cmgGameEvent)
  {
  	// console.log('cmgEvent: ' + name + ',', data);

    if(data != null && data != undefined) parent.cmgGameEvent(name, data);
    else parent.cmgGameEvent(name);
  }
}

App.prototype.save = function()
{
  var data = 
  {
  	version: app.version,
  	highScore: app.gameData.highScore,
  	completeBoards: app.gameData.completeBoards,

  	gmode: app.gameData.gmode,
  	dificulty: app.gameData.dificulty,

  	isTutorial: app.gameData.isTutorial
  }

  var jsonString = JSON.stringify(data);

  localStorage.setItem('make24_save', jsonString);

  console.log('Save!', data);
}
App.prototype.load = function()
{
  var data = localStorage.getItem('make24_save');
  if(data == undefined || data == null) data = null;
  if(data != null)
  {
    data = JSON.parse(data);
    if(data.version != app.version) data = null;
  }

  if(data == null) 
  {
    app.save();
    data = localStorage.getItem('make24_save');
    data = JSON.parse(data);
  }  

  app.gameData.highScore = data.highScore;
  app.gameData.isTutorial = data.isTutorial;
  app.gameData.completeBoards = data.completeBoards;
  app.gameData.gmode = data.gmode;
  app.gameData.dificulty = data.dificulty;

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

App.prototype.playAudio = function(dir, name)
{
  var audio = constsManager.getData('audio_info/audio/'+name);  
  // audio.loop(true);
  audio.play();


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