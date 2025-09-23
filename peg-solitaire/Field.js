var Field = function(config, fieldInfo)
{
  config.sizeType = 'absolute';
  config.width = 432;
  config.height = 515;
  Gui.BasePanel.call(this, config);


  var self = this;

  this.fieldInfo = fieldInfo;

  this.score = 0;
  this.totalScore = 0;
  // this.initBlockInputBg(3000, 3000, bind(this.onClickOnField, this));

  this.state = 'normal';
  // this.state = 'ready_to_game';
  // this.visible = false;
  // this.interactiveChildren = false;
  // this.alpha = 0;

  this.nameContainer = new PIXI.Container();
  this.addChild(this.nameContainer);
  var nameBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/field_name_bg.png'));
  this.nameContainer.addChild(nameBg);
  nameBg.anchor.set(0.5, 0.5);
  this.nameContainer.y = -396;

  this.nameText = Util.setParams(new Gui.TextBmp(this.fieldInfo.name,  constsManager.getData('text_configs/field_name_text')), {parent: this.nameContainer, aX:0.5, aY:0.5, x: 0, y: -16});

  this.scoreContainer = new PIXI.Container();
  this.addChild(this.scoreContainer);
  var scoreBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/field_score_bg.png'));
  this.scoreContainer.addChild(scoreBg);
  scoreBg.anchor.set(0.5, 0.5);
  this.scoreContainer.y = 396;

  this.scoreText = Util.setParams(new Gui.TextBmp('xxx',  constsManager.getData('text_configs/field_score_text')), {parent: this.scoreContainer, aX:0.5, aY:0.5, x: 0, y: 16});

  this.buttonReplay= Gui.createSimpleButton({name: 'button_replay', parentPanel: this, width: 88, height: 88, positionType: 'center-bot', xRelative: 210, yRelative: 200},
  {
    pathToSkin: 'Gui/button_replay.png',
    onClick: function()
    {
      if(!(self.state == 'normal')) return;
      self.resetField();

      app.apiCallback('replay', self.fieldInfo.name);
    }
  });
  this.buttonReplay.visible = false;

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/field_bg.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  this.scaleContainer = new PIXI.Container();
  this.addChild(this.scaleContainer);
  this.boardContainer = new PIXI.Container();
  this.scaleContainer.addChild(this.boardContainer); 

  // var fieldExample = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/field_example.png'));
  // this.addChild(fieldExample);
  // fieldExample.anchor.set(0.5, 0.5);
  this.solvedBorder = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/field_solved_border.png'));
  this.addChild(this.solvedBorder);
  this.solvedBorder.anchor.set(0.5, 0.5);
  this.solvedBorder.visible = false;  

  this.solvedRibbon= new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/solved_ribbon.png'));
  this.addChild(this.solvedRibbon);
  this.solvedRibbon.anchor.set(0.5, 0.5);
  this.solvedRibbon.x = -207;
  this.solvedRibbon.y = 208;
  this.solvedRibbon.visible = false;

  this.tint = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Gui/field_tint.png'));
  this.addChild(this.tint);
  this.tint.anchor.set(0.5, 0.5);
  // this.tint.width = 516;
  // this.tint.y = -3;
  this.tint.alpha = 0;
  // this.tint.visible = false;

  // this.interactive = true;
  // this.buttonMode = true;
  this.addListener('click', onFieldClick, this);
  this.addListener('tap', onFieldClick, this);
  function onFieldClick()
  {
    if(app.screenMain.state == 'menu') 
    {
      app.screenMain.tween({name: 'to_game'})
      app.apiCallback('start', null);
    }
  }

  // this.colorMatrixDark =
  // [
  //   0,0,0,0,
  //   0,0.32,0,0,
  //   0,0,0.49,0,
  //   0,0,0,1
  // ];
  // this.filterDark = new PIXI.filters.ColorMatrixFilter();
  // this.filterDark.matrix = this.colorMatrixDark;
  // this.filters = [this.filterDark];
  this.initField();

  this.currentPeg = null;
  this.isActive = false;
  this.dragingPeg = null;
  this.dragingPegCell = null;
  this.isDrag = false;
  this.dragingPointStart = null;

  this.movesArchive = [];

  app.addForUpdate(this.update, this);
}
Field.prototype = Object.create(Gui.BasePanel.prototype);
Field.prototype.constructor = Field;

Field.prototype.init = function()
{
  if(this.fieldInfo.isSolved)
  {
    this.bg.scale.x = this.bg.scale.y = 0.98;
    this.solvedBorder.visible = true;
    this.solvedRibbon.visible = true;
  }
}

Field.prototype.update = function()
{
  if(!this.isActive) return;

  if(this.dragingPeg != null)
  {
    var local = this.toLocal(app.mouse);
    var d = Util.distance(0, 0, local.x, local.y);
    if(d > 450)
    {
      this.dragingPeg.deselect();
      this.dragingPeg = null;
      this.dragingPegCell = null;
      this.dragingPointStart = null;
      this.isDrag = false;
      return;
    }

    var local = this.boardContainer.toLocal(app.mouse);
    var p = {x: local.x, y: local.y};

    this.dragingPegCell = null;

    for(var i = 0; i < this.dragingPeg.avaiableMoves.length; i++)
    {
      var d = Util.distance(this.dragingPeg.avaiableMoves[i].position.x, this.dragingPeg.avaiableMoves[i].position.y, p.x, p.y);
      if(d < 30) 
      {
        p.x = this.dragingPeg.avaiableMoves[i].position.x;
        p.y = this.dragingPeg.avaiableMoves[i].position.y;
        this.dragingPegCell = this.dragingPeg.avaiableMoves[i];
        break;
      }
    }
      var d = Util.distance(this.dragingPeg.cell.position.x, this.dragingPeg.cell.position.y, p.x, p.y);
      if(d < 30) 
      {
        p.x = this.dragingPeg.cell.position.x;
        p.y = this.dragingPeg.cell.position.y;
        this.dragingPegCell = this.dragingPeg.cell;
      }

    this.dragingPeg.x = p.x;
    this.dragingPeg.y = p.y;

    // var d = Util.distance(local.x, local.y, this.dragingPointStart.x, this.dragingPointStart.y);
    var d = Util.distance(this.dragingPeg.x, this.dragingPeg.y, this.dragingPeg.cell.position.x, this.dragingPeg.cell.position.y);
    if(d > 1) this.isDrag = true;
    // else this.isDrag = false;
  }

  // var position = app.mouse.global;
  // var local = this.toLocal(app.mouse);
  // console.log(local);
  // console.log(app.mouse);
}

Field.prototype.activate = function()
{
  this.isActive = true;

  for(var i = 0; i < this.allCells.length; i++) this.allCells[i].activate();

  app.apiCallback('start', this.fieldInfo.name);

  // var self = this;
  // var keyR = Util.keyboard(82);
  // keyR.press = function()
  // {
  //   self.gameEnd('victory');
  // } 
  // var keyT = Util.keyboard(84);
  // keyT.press = function()
  // {
  //   self.gameEnd('lose');
  // }
  // console.log('aaa');
}

Field.prototype.deactivate = function()
{
  this.isActive = false;

  for(var i = 0; i < this.allCells.length; i++) this.allCells[i].deactivate();

  TweenMax.delayedCall(15/30, bind(this.resetField, this));

  // console.log('bbb');
  // Util.traceErrorStack();
}

Field.prototype.pegSelect = function(peg)
{
  if(this.currentPeg != null) this.currentPeg.deselect();
  this.currentPeg = peg;
}
Field.prototype.pegDeselect = function(peg)
{
  if(this.currentPeg == peg) this.currentPeg = null;
}
Field.prototype.pegMove = function(peg, cellFrom, cellTo, eatPegCell)
{
  var self = this;

  this.score --;
  this.updateScore();

  this.movesArchive.push({cellFrom: cellFrom, cellTo: cellTo, eatPegCell: eatPegCell});

  var isNoMoves = true;
  var pegsCount = 0;
  for(var i = 0; i < this.allCells.length; i++)
  {
    var peg = this.allCells[i].peg;
    if(peg == null) continue;

    if(isNoMoves && peg.getAvaiableMoves().length > 0) isNoMoves = false;
    pegsCount ++;
  }

  // console.log(this.fieldInfo.score, isNoMoves, pegsCount);
  if(pegsCount == 1) this.gameEnd('victory');
  else if(isNoMoves) this.gameEnd('lose');
}
Field.prototype.undoMove = function()
{
  if(this.movesArchive.length == 0)
  {
    app.playAudio('sounds', 'sound_wrong');
    return;
  }
  if(this.buttonReplay.visible) this.tween({name: 'hide_anim_button_replay'});

  var self = this;

  app.playAudio('sounds', 'sound_click');

  this.state = 'undo_move';

  if(this.currentPeg != null) this.currentPeg.deselect();

  this.score ++;

  var move = this.movesArchive[this.movesArchive.length-1];

  var eatPeg = new Field.Peg(this, move.eatPegCell);
  eatPeg.activate();
  eatPeg.tween({name: 'show_anim'});

  var peg = move.cellTo.peg;
  peg.setToCell(move.cellFrom);
  this.boardContainer.setChildIndex(peg, this.boardContainer.children.length-1);
  peg.tween({name: 'move_to_cell', cell: peg.cell});

  this.movesArchive.splice(this.movesArchive.length-1, 1);

  TweenMax.delayedCall(10/30, function()
  {
    self.state = 'normal';
  });
}
Field.prototype.gameEnd = function(type)
{
  var self = this;

  var isPlayed = true;
  var isSolved = this.fieldInfo.isSolved;

  if(type == 'victory')
  {
    this.state = 'game_ended';

    TweenMax.delayedCall(20/30, function()
    {
      app.screenMain.panelGameEnd.tween({name: 'show_anim', type: 'victory', field: self});
      app.playAudio('sounds', 'sound_victory');
      if(self.currentPeg != null) self.currentPeg.deselect();
    });

    isSolved = true;
  }
  else if(type == 'lose')
  {
    this.state = 'game_ended';

    TweenMax.delayedCall(20/30, function()
    {
      app.screenMain.panelGameEnd.tween({name: 'show_anim', type: 'lose', field: self});
      app.playAudio('sounds', 'sound_lose');
      if(self.currentPeg != null) self.currentPeg.deselect();
    });
  }

  if(isPlayed && !this.fieldInfo.isPlayed && !isSolved)
  {
    var time = 10 / 30;
    TweenMax.to(this.scoreContainer, time, {y: 396, delay: 25/30, ease: Power2.easeOut});
  }
  if(isSolved && this.fieldInfo.isPlayed)
  {
    var time = 10 / 30;
    TweenMax.to(this.scoreContainer, time, {y: 396-78, delay: 25/30, ease: Power2.easeInOut});
  }
  if(isSolved && !this.fieldInfo.isSolved)
  {
    TweenMax.delayedCall(30/30, function()
    {
      self.solvedBorder.visible = true;
      self.solvedBorder.alpha = 0;
      self.solvedBorder.scale.x = self.solvedBorder.scale.y = 1.1;
      TweenMax.to(self.solvedBorder, 10/30, {alpha: 1, ease: Power2.easeOut});
      TweenMax.to(self.solvedBorder.scale, 10/30, {x: 1.0, y: 1.0, ease: Power2.easeOut});

      TweenMax.to(self.bg.scale, 10/30, {x: 0.98, y: 0.98, ease: Power2.easeOut});
    });
  }

  this.fieldInfo.isPlayed = isPlayed;
  this.fieldInfo.isSolved = isSolved;
  app.save();

  // console.log(this.fieldInfo.isPlayed, this.fieldInfo.isSolved, isPlayed, isSolved);
}

Field.prototype.initField = function()
{
  this.cells = [];
  this.allCells = [];

  if(this.fieldInfo.type == 'rect')
  {
    for(var j = 0; j < this.fieldInfo.height; j++)
    {
      this.cells[j] = [];
      for(var i = 0; i < this.fieldInfo.width; i++)
      {
        this.cells[j][i] = null;

        if(this.fieldInfo.cells[j][i].type != 'none')
        {
          var cell = new Field.Cell(this, i, j);

          if(this.fieldInfo.cells[j][i].type == 'peg') 
          {
            new Field.Peg(this, cell);
            this.totalScore ++;
          }

          this.cells[j][i] = cell;

          this.allCells.push(cell);
        }
      }
    }
  }

  if(this.fieldInfo.type == 'hex')
  {
    // console.log(this.fieldInfo.cells);
    for(var i = 0; i < this.fieldInfo.width; i++)
    {
      this.cells[i] = [];
      for(var j = 0; j < this.fieldInfo.height; j+=2)
      {
        var nJ = j;
        if(i % 2 !== 0) nJ ++;

          // var cell = {i: i, j: nJ, type: 'none'}; 
          // this.cells[i][nJ] = cell;
          // this.createFieldCell(cell);
        this.cells[i][nJ] = null;

        if(this.fieldInfo.cells[i][nJ].type != 'none')
        {
          var cell = new Field.Cell(this, i, nJ);

          if(this.fieldInfo.cells[i][nJ].type == 'peg') 
          {
            new Field.Peg(this, cell);
            this.totalScore ++;
          }

          this.cells[i][nJ] = cell;
          this.allCells.push(cell);
        }
      }
    }
  }

  var shiftX = 0;
  var shiftY = 0;
  if(this.fieldInfo.shiftX != undefined) shiftX = this.fieldInfo.shiftX;
  if(this.fieldInfo.shiftY != undefined) shiftY = this.fieldInfo.shiftY;

  this.boardContainer.x = -this.boardContainer.width/2 + 80/2 + shiftX;
  this.boardContainer.y = -this.boardContainer.height/2 + 80/2 + shiftY;

  var maxSize = 764 - 50;
  var curSize = Math.max(this.boardContainer.width, this.boardContainer.height);
  var scale = maxSize/curSize;
  // console.log(scale);
  if(scale > 1.4) scale = 1.4;

  this.scaleContainer.scale.x = this.scaleContainer.scale.y = scale;

  if(this.fieldInfo.score == 0) this.fieldInfo.score = this.totalScore;
  this.score = this.totalScore;
  this.updateScore();
}
Field.prototype.resetField = function()
{
  var self = this;

  if(this.buttonReplay.visible) this.tween({name: 'hide_anim_button_replay'});

  this.score = this.totalScore;
  this.updateScore();

  if(this.currentPeg != null) this.currentPeg.deselect();

  this.movesArchive = [];

  this.state = 'reset_field';
  TweenMax.delayedCall(10/30, function()
  {
    self.state = 'normal';
  });

  if(this.fieldInfo.type == 'rect')
  {
    for(var j = 0; j < this.fieldInfo.height; j++)
    {
      for(var i = 0; i < this.fieldInfo.width; i++)
      {
        var cell = this.cells[j][i];

        if(this.fieldInfo.cells[j][i].type == 'peg' && cell.peg == null) 
        {
          var peg = new Field.Peg(this, cell);
          peg.tween({name: 'show_anim'});
          if(this.isActive) peg.activate();
        }
        else if(this.fieldInfo.cells[j][i].type == 'free' && cell.peg != null) cell.peg.tween({name: 'destroy_anim'});
      }
    }
  }

  if(this.fieldInfo.type == 'hex')
  {
    for(var i = 0; i < this.fieldInfo.width; i++)
    {
      for(var j = 0; j < this.fieldInfo.height; j+=2)
      {
        var nJ = j;
        if(i % 2 !== 0) nJ ++;

        var cell = this.cells[i][nJ];

        if(this.fieldInfo.cells[i][nJ].type == 'peg' && cell.peg == null) 
        {
          var peg = new Field.Peg(this, cell);
          peg.tween({name: 'show_anim'});
          if(this.isActive) peg.activate();
        }
        else if(this.fieldInfo.cells[i][nJ].type == 'free' && cell.peg != null) cell.peg.tween({name: 'destroy_anim'});
      }
    }
  }
}

Field.prototype.getCellPosition = function(i, j)
{
  if(this.fieldInfo.type == 'rect') return { x: i*80, y: j*80};
  if(this.fieldInfo.type == 'hex') return { x: i*43, y: j*69};
}

Field.prototype.updateScore = function()
{
  if(this.score < this.fieldInfo.score) 
  {
    this.fieldInfo.score = this.score;
    app.save();
  }  

  if(this.fieldInfo.score > 1) this.scoreText.text = 'Best: ' + this.fieldInfo.score;
  else 
  {
    this.scoreText.text = 'Solved';
    this.scoreText.tint = 0xFFE735;
  }
}

Field.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_info_anim')
  {
    this.nameContainer.y = -396+80;
    this.scoreContainer.y = 396-78;
    var time = 10 / 30;

    TweenMax.to(this.nameContainer, time, {y: -396, delay: 5/30, ease: Power2.easeOut, onComplete: function()
    {
      self.tween({name: 'show_info'}, callback);
    }}); 

    if(!this.fieldInfo.isPlayed || this.fieldInfo.isSolved) return;

    TweenMax.to(this.scoreContainer, time, {y: 396, delay: 5/30, ease: Power2.easeOut});
  } 
  if(data.name == 'hide_info_anim')
  {
    var time = 15 / 30;
    TweenMax.to(this.nameContainer, time, {y: -396+80, ease: Power2.easeInOut, onComplete: function()
    {
      self.tween({name: 'hide_info'}, callback);
    }});  

    if(!this.fieldInfo.isPlayed || this.fieldInfo.isSolved) return;

    TweenMax.to(this.scoreContainer, time, {y: 396-78, ease: Power2.easeInOut});
  }

  if(data.name == 'show_info')
  {
    this.nameContainer.y = -396;

    if(!this.fieldInfo.isPlayed || this.fieldInfo.isSolved) 
    {
      if(callback) callback();
      return;
    }

    this.scoreContainer.y = 396;

    if(callback) callback();
  }
  if(data.name == 'hide_info')
  {
    this.nameContainer.y = -396+80;
    this.scoreContainer.y = 396-78;

    if(callback) callback();
  }

  if(data.name == 'to_menu')
  {
    if(this.fieldInfo.isSolved)
    {
      this.solvedRibbon.visible = true;
      this.solvedRibbon.alpha = 0;

      this.solvedRibbon.scale.x = this.solvedRibbon.scale.y = 1.2;
      TweenMax.to(this.solvedRibbon.scale, 15/30, {x: 1.0, y: 1.0, ease: Power2.easeOut});

      TweenMax.to(this.solvedRibbon, 15/30, {alpha: 1, ease: Power2.easeOut});
    }
  }  
  if(data.name == 'to_game')
  {
    TweenMax.to(this.scale, 15/30, {x: 1, y: 1, ease: Power2.easeOut});
    TweenMax.to(this, 15/30, {y: -3, ease: Power2.easeOut});

    if(this.fieldInfo.isSolved)
    {
      this.solvedRibbon.alpha = 1;
      TweenMax.to(this.solvedRibbon, 15/30, {alpha: 0, ease: Power2.easeOut, onComplete: function()
      {
        self.solvedRibbon.visible = false;
      }});
    }
  }

  if(data.name == 'show_anim_button_replay')
  {
    if(this.buttonReplay.visible) return;

    this.buttonReplay.visible = true;
    this.buttonReplay.yRelative = 200-100;

    TweenMax.to(this.buttonReplay, 10/30, {yRelative: 200, ease: Power2.easeOut});
  } 
  if(data.name == 'hide_anim_button_replay')
  {
    if(!this.buttonReplay.visible) return;

    TweenMax.to(this.buttonReplay, 10/30, {yRelative: 200-100, ease: Power2.easeOut, onComplete: function()
    {
      self.buttonReplay.visible = false;
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
Field.Cell = function(field, i, j)
{
  EventEmitter.call(this);


  this.field = field;
  this.i = i;
  this.j = j;

  this.peg = null;

  this.position = this.field.getCellPosition(i, j);

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'field_cell.png'));
  this.field.boardContainer.addChildAt(this.bg, 0);
  this.bg.anchor.set(0.5, 0.5);
  this.bg.x = this.position.x;
  this.bg.y = this.position.y;

  this.light = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'field_cell_light.png'));
  this.field.boardContainer.addChildAt(this.light, 0);
  this.light.anchor.set(0.5, 0.5);
  this.light.x = this.position.x;
  this.light.y = this.position.y;
  this.light.visible = false;

  this.directions = null;
  if(this.field.fieldInfo.type == 'rect') this.directions = ['up', 'right', 'down', 'left'];
  else if(this.field.fieldInfo.type == 'hex') this.directions = ['up_left', 'up_right', 'right', 'down_right', 'down_left', 'left'];
}
Field.Cell.prototype = Object.create(EventEmitter.prototype);
Field.Cell.prototype.constructor = Field.Cell;

Field.Cell.prototype.activate = function()
{
  if(this.peg != null) this.peg.activate();

  this.bg.interactive = true;
  this.bg.buttonMode = true;

  this.bg.addListener('click', this.onClickListener, this);
  this.bg.addListener('tap', this.onClickListener, this);
}
Field.Cell.prototype.deactivate = function()
{
  if(this.peg != null) this.peg.deactivate();

  this.bg.interactive = false;
  this.bg.buttonMode = false;

  this.bg.removeAllListeners();

  this.removeAllListeners();
}
Field.Cell.prototype.onClickListener = function()
{
  this.emit('cell_selected', this);
}
Field.Cell.prototype.addPeg = function(peg)
{
  this.peg = peg;
}
Field.Cell.prototype.removePeg = function(peg)
{
  this.peg = null;
}
Field.Cell.prototype.getNeighbors = function()
{
  var neighbors = [];

  for(var i = 0; i < this.directions.length; i++) 
  {
    var neighbor = this.getNeighbor(this.directions[i]);
    if(neighbor != null) neighbors.push(neighbor);
  }

  return neighbors;
}
Field.Cell.prototype.getNeighbor = function(dir)
{
  var shiftI = 0;
  var shiftJ = 0;

  if(this.field.fieldInfo.type == 'rect')
  {
    if(dir == 'up') shiftJ = -1;
    else if(dir == 'down') shiftJ = 1;
    else if(dir == 'left') shiftI = -1;
    else if(dir == 'right') shiftI = 1;
  }
  else if(this.field.fieldInfo.type == 'hex')
  {
    if(dir == 'up_left') 
    {
      shiftI = -1;
      shiftJ = -1;
    }
    if(dir == 'up_right') 
    {
      shiftI = 1;
      shiftJ = -1;
    }
    if(dir == 'down_left') 
    {
      shiftI = -1;
      shiftJ = 1;
    }
    if(dir == 'down_right') 
    {
      shiftI = 1;
      shiftJ = 1;
    }
    else if(dir == 'left') shiftI = -2;
    else if(dir == 'right') shiftI = 2;
  }

  var i = this.i + shiftI;
  var j = this.j + shiftJ;

  // if(i < 0 || i > this.field.fieldInfo.width-1 || j < 0 || j > this.field.fieldInfo.height-1) 
  // {
  //   console.log('aaa', j, this.field.fieldInfo.height-1);
  //   return null;
  // }

  var neighbor = null;
  if(this.field.fieldInfo.type == 'rect')
  {
    if(this.field.cells[j] == undefined) return null;
    if(this.field.cells[j][i] == undefined) return null;

    neighbor = this.field.cells[j][i];  
  }
  else if(this.field.fieldInfo.type == 'hex') 
  {
    if(this.field.cells[i] == undefined) return null;
    if(this.field.cells[i][j] == undefined) return null;

    neighbor = this.field.cells[i][j];
  }  

  return neighbor;
}
Field.Cell.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_light')
  {
    this.light.visible = true;
  } 

  if(data.name == 'hide_light')
  {
    this.light.visible = false;
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
Field.Peg = function(field, cell)
{
  PIXI.Container.call(this);


  this.isExist = true;

  this.field = field;
  this.cell = cell;

  this.sprite = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'peg.png'));
  this.addChild(this.sprite);
  this.sprite.anchor.set(0.5, 0.5);

  this.field.boardContainer.addChildAt(this, this.field.boardContainer.children.length);
  this.x = this.cell.position.x;
  this.y = this.cell.position.y;

  this.cell.addPeg(this);

  this.isSelected = false;
  this.avaiableMoves = null;
}
Field.Peg.prototype = Object.create(PIXI.Container.prototype);
Field.Peg.prototype.constructor = Field.Peg;

Field.Peg.prototype.activate = function()
{
  this.interactive = true;
  this.buttonMode = true;

  // console.log(this.cell);
  // this.addListener('click', this.onClickListener, this);
  // this.addListener('tap', this.onClickListener, this);

  this.addListener('pointerdown', function(e)
  {
    app.mouse = e.data.global;

    if(this.field.state != 'normal') return;

    this.field.dragingPeg = this;
    this.field.dragingPointStart = this.field.boardContainer.toLocal(e.data.global);
    this.select();

    // this.addListener('pointerout', function(e)
    // {
    //   // console.log('z');
    //   if(this.isSelected) this.deselect();
    // }, this);
  }, this);
  this.addListener('pointerup', onInputUp, this);   
  this.addListener('pointerupoutside', onInputUp, this);  

  function onInputUp(e)
  {
    if(this.field.dragingPeg == this && this.field.isDrag) 
    {
      if(this.field.dragingPegCell == null || this.field.dragingPegCell == this.cell)
      {
        app.playAudio('sounds', 'sound_wrong');
        this.deselect();
      }
      else 
      {
        this.x = this.field.dragingPegCell.position.x;
        this.y = this.field.dragingPegCell.position.y;
        // console.log(this.field.dragingPegCell, this.cell);
        this.moveToCell(this.field.dragingPegCell);
      }

      this.field.dragingPeg = null;
      this.field.dragingPegCell = null;
      this.field.isDrag = false;
    }
    else if(this.field.dragingPeg == this && !this.field.isDrag)
    {
      this.field.dragingPeg = null;
      this.field.dragingPegCell = null;
      this.field.isDrag = false;
    }
  }
}
Field.Peg.prototype.deactivate = function()
{
  this.interactive = false;
  this.buttonMode = false;

  if(this.isSelected) this.deselect();

  this.removeAllListeners();
}

Field.Peg.prototype.select = function()
{
  if(this.isSelected) return;

  app.playAudio('sounds', 'sound_peg_select');

  this.field.pegSelect(this);

  this.isSelected = true;

  this.field.boardContainer.setChildIndex(this, this.field.boardContainer.children.length-1);

  this.cell.tween({name: 'show_light'});

  this.avaiableMoves = this.getAvaiableMoves();
  // console.log(this.avaiableMoves, this.cell.directions);
  for(var i = 0; i < this.avaiableMoves.length; i++)
  {
    var cell = this.avaiableMoves[i];
    cell.tween({name: 'show_light'});

    cell.addListener('cell_selected', this.moveToCell, this);
  }

  // app.playAudio('sounds', 'sound_click');
}

Field.Peg.prototype.deselect = function(isResetPosition)
{
  if(!this.isSelected) return;
  if(isResetPosition == undefined) isResetPosition = true;

  this.field.pegDeselect(this);

  this.isSelected = false;

  this.cell.tween({name: 'hide_light'});

  if(this.avaiableMoves != null && this.avaiableMoves.length > 0)
  {
    for(var i = 0; i < this.avaiableMoves.length; i++)
    {
      var cell = this.avaiableMoves[i];
      cell.tween({name: 'hide_light'});
      cell.removeListener('cell_selected', this.moveToCell);
    }

    this.avaiableMoves = null;
  }

  if(isResetPosition)
  {
    this.x = this.cell.position.x;
    this.y = this.cell.position.y;
  }

  // console.log(isResetPosition);
}

Field.Peg.prototype.moveToCell = function(cell)
{
  if(!this.isSelected) return;

  this.field.state = 'peg_move';

  // console.log(this.cell);

  app.playAudio('sounds', 'sound_peg_tap');

  this.deselect(false);

  var cellFrom = this.cell;
  var cellTo = cell;

  var distance = Util.distance(this.x, this.y, cell.position.x, cell.position.y);

  var eatPeg = null;
  var eatPegDir = '';
  var eatDelay = (distance < 1)?0:4/30;
  if(this.field.fieldInfo.type == 'rect') eatPegDir = Util.getDirectionBetweenCells(this.cell, cell);
  else if(this.field.fieldInfo.type == 'hex') eatPegDir = Util.getDirectionBetweenHexs(this.cell, cell);
  eatPeg = this.cell.getNeighbor(eatPegDir).peg;
  var eatPegCell = eatPeg.cell;
  eatPeg.eat(eatDelay);

  // console.log('Move: ', eatPegDir);
  this.setToCell(cell);

  // console.log(distance);

  // this.x = this.cell.position.x;
  // this.y = this.cell.position.y;
  
  if(distance > 1) this.tween({name: 'move_to_cell', cell: this.cell}, bind(moveComplete, this));
  else moveComplete.call(this);

  function moveComplete()
  {
    this.field.state = 'normal';
    this.field.pegMove(this, cellFrom, cellTo, eatPegCell);
  }
}

Field.Peg.prototype.setToCell = function(cell)
{
  if(this.cell != null) this.cell.removePeg(this);
  this.cell = cell;
  this.cell.addPeg(this);

  // console.log('set to cell', cell);
}

Field.Peg.prototype.onClickListener = function(e)
{  
  // if(this.field.dragingPeg == this) return;

  // this.select();
}

Field.Peg.prototype.getAvaiableMoves = function()
{
  var moves = [];

  // console.log('==========================');

  var directions = this.cell.directions;
  for(var i = 0; i < directions.length; i++) 
  {
    var neighbor = this.cell.getNeighbor(directions[i]);
    if(neighbor != null && neighbor.peg != null)
    {
      var cell = neighbor.getNeighbor(directions[i]);
      if(cell != null && cell.peg == null) moves.push(cell);
    }

    // console.log(directions[i], neighbor == null);
  }

  // var neighbors = this.cell.getNeighbors();

  return moves;
}

Field.Peg.prototype.eat = function(delay)
{
  if(delay == undefined) delay = 0;

  this.cell.removePeg(this);
  this.cell = null;

  this.tween({name: 'eat', delay: delay}, bind(this.destroy, this));
}

Field.Peg.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'move_to_cell')
  {
    var cell = data.cell;

    var time = 10/30;
    var ease = Power2.easeOut;

    TweenMax.to(this.scale, time*0.5, {x: 1.4, y: 1.4, ease: ease});
    TweenMax.to(this.scale, time*0.5, {x: 1.0, y: 1.0, ease: ease, delay: time*0.5});
    TweenMax.to(this, time, {x: cell.position.x, y: cell.position.y, ease: ease, onComplete: function()
    {
      if(callback) callback();
    }});
  }

  if(data.name == 'eat')
  {
    var delay = 4/30;
    if(data.delay != undefined) delay = data.delay;

    TweenMax.to(this, 8/30, {alpha: 0, ease: Back.easeIn.config(3), delay: delay});
    TweenMax.to(this.scale, 8/30, {x: 0.4, y: 0.4, ease: Back.easeIn.config(3), delay: delay, onComplete: function()
    {
      if(callback) callback();
    }});
  }

  if(data.name == 'show_anim')
  {
    this.alpha = 0;
    this.scale.x = this.scale.y = 0.4;

    TweenMax.to(this, 8/30, {alpha: 1, ease: Back.easeOut.config(3)});
    TweenMax.to(this.scale, 8/30, {x: 1.0, y: 1.0, ease: Back.easeOut.config(3), onComplete: function()
    {
      if(callback) callback();
    }});
  }
  if(data.name == 'destroy_anim')
  {
    this.alpha = 1;
    this.scale.x = this.scale.y = 1.0;

    TweenMax.to(this, 8/30, {alpha: 0, ease: Power2.easeOut});
    TweenMax.to(this.scale, 8/30, {x: 0.4, y: 0.4, ease: Power2.easeOut, onComplete: function()
    {
      self.destroy();
      if(callback) callback();
    }});
  }
}

Field.Peg.prototype.destroy = function()
{
  if(!this.isExist) return;

  this.isExist = false;

  if(this.cell != null) this.cell.removePeg(this);
  this.cell = null;

  this.sprite.destroy();
  this.sprite = null;

  this.removeAllListeners();


  PIXI.Container.prototype.destroy.call(this);
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //