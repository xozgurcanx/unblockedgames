// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelTile = function()
{
  PIXI.Container.call(this);


  var self = this;

  this.tile = null;

  this.state = 'none';

  this._angle = 0;
  Object.defineProperty(this, 'angle',
  {
    set: function(value)
    {
      self.updateAngle(value);
    },
    get: function()
    {
      return self._angle;
    }
  });

  this.id = -1;

  this.panelPlayer = null;
  this.panelBazaar = null;

  this.shadow = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'tile_shadow_1.png'));
  this.addChild(this.shadow);
  this.shadow.anchor.set(0.5, 0.5);

  this.splitBorder = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/tile_split_border.png'));
  this.addChild(this.splitBorder);
  this.splitBorder.anchor.set(0.5, 0.5);
  this.splitBorder.alpha = 0;

  this.bgTexture = assetsManager.getTexture('texture_atlas', 'tile_bg_1.png');
  this.bg = new PIXI.Sprite(this.bgTexture);
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  this.containerFront = new PIXI.Container();
  this.addChild(this.containerFront);

  // this.cell1 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/tile_bg.png'));
  // this.containerFront.addChild(this.cell1);
  // this.cell1.anchor.set(0.5, 0.5);
  // this.cell1.y = -48;

  // this.cell2 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/tile_bg.png'));
  // this.containerFront.addChild(this.cell2);
  // this.cell2.anchor.set(0.5, 0.5);
  // this.cell2.y = 48; 

  this.cell1Dots = [];
  this.cell2Dots = [];

  for(var i = 0; i < 6; i++)
  {
    var dot1 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'tile_dot_0001.png'));
    this.containerFront.addChild(dot1);
    dot1.anchor.set(0.5, 0.5);
    dot1.visible = false;  
    this.cell1Dots.push(dot1);

    var dot2 = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'tile_dot_0001.png'));
    this.containerFront.addChild(dot2);
    dot2.anchor.set(0.5, 0.5);
    dot2.visible = false;
    this.cell2Dots.push(dot2);

    // dot1.scale.x = dot1.scale.y = dot2.scale.x = dot2.scale.y = 1/1.5;
  }

  this.splitLine = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/tile_split_line.png'));
  this.containerFront.addChild(this.splitLine);
  this.splitLine.anchor.set(0.5, 0.5);
  // this.cell2.y = 48;

  this.containerOutline = new PIXI.Container();
  this.addChild(this.containerOutline);

  this.outlineUp = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/tile_outline_up_down.png'));
  this.containerOutline.addChild(this.outlineUp);
  this.outlineUp.anchor.set(0.5, 0.5);
  this.outlineUp.alpha = 0;  
  this.outlineDown = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/tile_outline_up_down.png'));
  this.containerOutline.addChild(this.outlineDown);
  this.outlineDown.anchor.set(0.5, 0.5);
  this.outlineDown.alpha = 0;
  this.outlineDown.scale.y = -1;  
  this.outlineRight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/tile_outline_left_right.png'));
  this.containerOutline.addChild(this.outlineRight);
  this.outlineRight.anchor.set(0.5, 0.5);
  this.outlineRight.alpha = 0;  
  this.outlineLeft = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/tile_outline_left_right.png'));
  this.containerOutline.addChild(this.outlineLeft);
  this.outlineLeft.anchor.set(0.5, 0.5);
  this.outlineLeft.alpha = 0;
  this.outlineLeft.scale.x = -1; 

  this.outlineFull = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/board_first_tile_light.png'));
  this.containerOutline.addChild(this.outlineFull);
  this.outlineFull.anchor.set(0.5, 0.5);
  this.outlineFull.alpha = 0;

  this.outlines = 
  [
    { side: 'left', outline: this.outlineLeft, state: 'hide' },
    { side: 'right', outline: this.outlineRight, state: 'hide' },
    { side: 'up', outline: this.outlineUp, state: 'hide' },
    { side: 'down', outline: this.outlineDown, state: 'hide' },
    { side: 'full', outline: this.outlineFull, state: 'hide' }
  ];

  // this.selectionOutline = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/tile_selection_outline.png'));
  // this.addChild(this.selectionOutline);
  // this.selectionOutline.anchor.set(0.5, 0.5);
  // this.selectionOutline.alpha = 0;

  this.visible = false;

  this.updateAngleView();

  app.on('tiles_style_setted', function(tilesStyle)
  {
    if(tilesStyle == 'minimalistic')
    {
      this.bgTexture = assetsManager.getTexture('texture_atlas', 'tile_bg_1.png');
      this.shadow.texture = assetsManager.getTexture('texture_atlas', 'tile_shadow_1.png');
    }
    else if(tilesStyle == 'realistic')
    {
      this.bgTexture = assetsManager.getTexture('texture_atlas', 'tile_bg_2.png');
      this.shadow.texture = assetsManager.getTexture('texture_atlas', 'tile_shadow_2.png');
    }

    this.bg.texture = this.bgTexture;
  }, this);
  app.on('dots_style_setted', function(dotsStyle)
  {
    this.setDotsStyle(dotsStyle);
  }, this);
}
PanelTile.prototype = Object.create(PIXI.Container.prototype);
PanelTile.prototype.constructor = PanelTile;

PanelTile.prototype.clear = function()
{
  this.setTo('hiden');

  this.removeAllListeners();

  this.alpha = 1;
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.scale.x = this.scale.y = 1;

  this.splitBorder.alpha = 0;
  this.containerFront.alpha = 0;

  TweenMax.to(this, 0/30, {pixi: { colorize: '#FFFFFF', colorizeAmount: 0.0 }});

  for(var i = 0; i < this.outlines.length; i++)
  {
    var outlineInfo = this.outlines[i];
    outlineInfo.outline.scale.x = outlineInfo.outline.scale.y = 1.0;
    outlineInfo.outline.alpha = 0;
    outlineInfo.outline.state = 'hide';
  }
}

PanelTile.WIDTH = 100;
PanelTile.HEIGHT = 196;

PanelTile.prototype.setDotsStyle = function(dotsStyle)
{
  if(this.gTile == null) return;

  if(this.gTile.cell1 != null)
  {
    var texture = getCellTexture(this.gTile.cell1);
    for(var i = 0; i < this.cell1Dots.length; i++) this.cell1Dots[i].texture = texture;
  }  
  if(this.gTile.cell2 != null)
  {
    var texture = getCellTexture(this.gTile.cell2);
    for(var i = 0; i < this.cell2Dots.length; i++) this.cell2Dots[i].texture = texture;
  }

  function getCellTexture(cell)
  {
    var texture = null;

    // console.log('C:', cell);
    if(dotsStyle == 'colorized')
    {
      if(cell == 'free') texture = assetsManager.getTexture('texture_atlas', 'tile_dot_0001.png');
      else if(cell == 'one') texture = assetsManager.getTexture('texture_atlas', 'tile_dot_0002.png');
      else if(cell == 'two') texture = assetsManager.getTexture('texture_atlas', 'tile_dot_0003.png');
      else if(cell == 'three') texture = assetsManager.getTexture('texture_atlas', 'tile_dot_0004.png');
      else if(cell == 'four') texture = assetsManager.getTexture('texture_atlas', 'tile_dot_0005.png');
      else if(cell == 'five') texture = assetsManager.getTexture('texture_atlas', 'tile_dot_0006.png');
      else if(cell == 'six') texture = assetsManager.getTexture('texture_atlas', 'tile_dot_0007.png');
    }
    else if(dotsStyle == 'black')
    {
      texture = assetsManager.getTexture('texture_atlas', 'tile_dot_0008.png');
    }

    return texture;
  }
}

PanelTile.prototype.setCellDots = function(cellName, cellValue)
{
  // console.log(cellName, dots);

  var dots = cellName == 'cell_1'?this.cell1Dots:this.cell2Dots;
  for(var i = 0; i < dots.length; i++) dots[i].visible = false;

  var cellCenter = new PIXI.Point(0, 0);
  if(cellName == 'cell_1') cellCenter.y = -48;
  else if(cellName == 'cell_2') cellCenter.y = 48;

  var cellWidth = 56;
  var cellHeight = 56; 

  var positions = 
  [
    [{x: -cellWidth/2, y: -cellHeight/2}, {x: -cellWidth/2, y: 0}, {x: -cellWidth/2, y: cellHeight/2}],
    [{x: 0, y: -cellHeight/2}, {x: 0, y: 0}, {x: 0, y: cellHeight/2}],
    [{x: cellWidth/2, y: -cellHeight/2}, {x: cellWidth/2, y: 0}, {x: cellWidth/2, y: cellHeight/2}]
  ];

  // console.log(dots);

  // var texture;

  if(cellValue == 'one')
  {
    setDot(dots[0], positions[1][1]);
  }
  if(cellValue == 'two')
  {
    setDot(dots[0], positions[0][2]);
    setDot(dots[1], positions[2][0]);
  }  
  if(cellValue == 'three')
  {
    setDot(dots[0], positions[0][2]);
    setDot(dots[1], positions[1][1]);
    setDot(dots[2], positions[2][0]);
  } 
  if(cellValue == 'four')
  {
    setDot(dots[0], positions[0][2]);
    setDot(dots[1], positions[0][0]);
    setDot(dots[2], positions[2][0]);
    setDot(dots[3], positions[2][2]);
  }  
  if(cellValue == 'five')
  {
    setDot(dots[0], positions[0][2]);
    setDot(dots[1], positions[0][0]);
    setDot(dots[2], positions[2][0]);
    setDot(dots[3], positions[2][2]);
    setDot(dots[4], positions[1][1]);
  }  
  if(cellValue == 'six')
  {
    setDot(dots[0], positions[0][0]);
    setDot(dots[1], positions[0][1]);
    setDot(dots[2], positions[0][2]);
    setDot(dots[3], positions[2][0]);
    setDot(dots[4], positions[2][1]);
    setDot(dots[5], positions[2][2]);
  }

  function setDot(dot, position)
  {
    dot.visible = true;

    dot.x = cellCenter.x + position.x;
    dot.y = cellCenter.y + position.y;

    // dot.texture = texture;
  }  
}

PanelTile.getOrientationRotation = function(positionInfo)
{
  var rotation = 0;
  if(positionInfo.orientation == 'vertical')
  {
    if(positionInfo.dir == 'up') rotation = 0 * Util.TO_RADIANS;
    else if(positionInfo.dir == 'down') rotation = 180 * Util.TO_RADIANS;
  }  
  if(positionInfo.orientation == 'horizontal')
  {
    if(positionInfo.dir == 'right') rotation = 90 * Util.TO_RADIANS;
    else if(positionInfo.dir == 'left') rotation = 270 * Util.TO_RADIANS;
  }

  return rotation;
}

PanelTile.prototype.updateAngle = function(value)
{
  this._angle = Util.normalizeAngleDeg(value);
  this.rotation = this._angle * Util.TO_RADIANS;

  this.updateAngleView();
}

PanelTile.prototype.updateAngleView = function()
{
  var angle = this.rotation * Util.TO_DEGREES;

  var p = new PIXI.Point(this.x, this.y);

  var shadowPosition;
  var selectionOutlinePosition;

  var shadowShift = 10;
  var selectionOutlineShift = 5;

  if(this.parent != null)
  {
    

    var globalScaleRotation = Util.getGlobalScaleAndRotation(this);
    shadowShift *= globalScaleRotation.scaleX;
    selectionOutlineShift *= globalScaleRotation.scaleX;
    // var myScale = this.scale.x * this.parent.scale.x * this.parent.parent.scale.x;
    p = this.parent.toGlobal(p);

    shadowPosition = this.toLocal(new PIXI.Point(p.x, p.y + shadowShift));
    selectionOutlinePosition = this.toLocal(new PIXI.Point(p.x, p.y + selectionOutlineShift));



    for(var i = 0; i < this.cell1Dots.length; i++)
    {
      if(this.cell1Dots[i].visible) setDotRot(this.cell1Dots[i]);
      if(this.cell2Dots[i].visible) setDotRot(this.cell2Dots[i]);
    }

    function setDotRot(dot)
    {
      dot.rotation = -globalScaleRotation.rotation;
    }

    this.shadow.x = shadowPosition.x;
    this.shadow.y = shadowPosition.y;

    this.containerOutline.x = selectionOutlinePosition.x;
    this.containerOutline.y = selectionOutlinePosition.y;
  }
}

PanelTile.prototype.translateTo = function(container)
{
  var globalScaleRotation = Util.getGlobalScaleAndRotation(this);
  var globalScale = globalScaleRotation.scaleX;
  var globalRotation = globalScaleRotation.rotation;

  var containerGlobalScaleRotation = null;
  if(container.globalScaleRotation != null) containerGlobalScaleRotation = container.globalScaleRotation;
  else 
  {
    containerGlobalScaleRotation = Util.getGlobalScaleAndRotation(container);
    // container.globalScaleRotation = containerGlobalScaleRotation;
  }

  var containerScale = containerGlobalScaleRotation.scaleX;
  var containerRotation = containerGlobalScaleRotation.rotation;

  var localScale = globalScale / containerScale;
  var localRotation = globalRotation - containerRotation;

  var p = new PIXI.Point(this.x, this.y);
  if(this.parent != null)
  {
    p = this.parent.toGlobal(p);
    p = container.toLocal(p);
  }

  container.addChild(this);
  this.x = p.x;
  this.y = p.y;
  this.scale.x = this.scale.y = localScale;
  this.angle = Util.normalizeAngleDeg(localRotation * Util.TO_DEGREES);
}

PanelTile.prototype.setTile = function(tile)
{
  this.gTile = tile;

  // this.cell1.texture = assetsManager.getTexture('texture_atlas', 'Theme1/tile_dots_'+this.gTile.cell1+'.png');
  // this.cell2.texture = assetsManager.getTexture('texture_atlas', 'Theme1/tile_dots_'+this.gTile.cell2+'.png');
  this.setCellDots('cell_1', this.gTile.cell1);
  this.setCellDots('cell_2', this.gTile.cell2);
  this.setDotsStyle(app.gameData.dotsStyle);

  this.id = this.gTile.id;
}

PanelTile.prototype.setTo = function(data)
{
  var nextState = data.state;

  if(nextState == 'hiden')
  {
    this.visible = false;
    if(this.parent != null) this.parent.removeChild(this);

    this.panelPlayer = null;
    this.panelBazaar = null;
  }
  else if(nextState == 'bazaar')
  {
    this.visible = true;

    this.containerFront.alpha = 0;
  }
  else if(nextState == 'hand')
  {
    this.visible = true;

    // this.x = 0;
    // this.y = 0;
    // this.angle = 0;
    // this.scale.x = this.scale.y = 1;
    // TweenMax.to(this, 0/30, {pixi: { colorize: '#FFFFFF', colorizeAmount: 0.0 }});
  }

  this.state = nextState;
  this.updateAngleView();
}

PanelTile.prototype.tween = function(data, callback)
{
  var self = this;

  var delay = data.delay;
  if(delay == undefined) delay = 0;

  if(data.name == 'show_split_border')
  {
    TweenMax.to(this.splitBorder, 5/30, {alpha: 1, delay: delay, ease: Power2.easeOut, onComplete: function()
    {
      if(callback) callback();
    }});
  }  
  if(data.name == 'hide_split_border')
  {
    TweenMax.to(this.splitBorder, 5/30, {alpha: 0, delay: delay, ease: Power2.easeOut, onComplete: function()
    {
      if(callback) callback();
    }});
  }

  if(data.name == 'show_selection_outline')
  {
    // var globalScaleRotation = Util.getGlobalScaleAndRotation(this);
    // var orientation = globalScaleRotation.rotation == 0?'vertical':'horizontal';

    var type = data.type;
    if(type == undefined) type = 'normal';

    var orientation = this.gTile.position.orientation;

    var hideDelay = data.hideDelay;
    if(hideDelay == undefined) hideDelay = 0;

    this.containerOutline.scale.x = this.containerOutline.scale.y = 1.0;

    if(orientation == 'vertical') 
    {
      // this.containerOutline.scale.x = 1;
      // this.containerOutline.scale.y = 1.0 + 40/241;
      this.containerOutline.width = 146;
      this.containerOutline.height = 241 + 10;
      // this.selectionOutline.x = 0;
      // this.selectionOutline.y = 5;
    }
    else if(orientation == 'horizontal')
    {
      this.containerOutline.width = 146 + 10;
      this.containerOutline.height = 241;
      // this.selectionOutline.x = -5;
      // this.selectionOutline.y = 0;
    }

    // console.log(orientation);

    // this.selectionOutline.anchor.set(0.5, 0.5);

    // this.parent.setChildIndex(this, this.parent.children.length-1);

    for(var i = 0; i < this.outlines.length; i++)
    {
      var outlineInfo = this.outlines[i];
      if(outlineInfo.side == data.side)
      {
        if(outlineInfo.state == 'show') continue;

        var shift = 6;
        if(outlineInfo.side == 'up') 
        {
          outlineInfo.outline.y = -shift;
          outlineInfo.outline.scale.y = 1;
          outlineInfo.outline.scale.x = 1.4;
        }
        if(outlineInfo.side == 'down') 
        {
          outlineInfo.outline.y = shift;
          outlineInfo.outline.scale.y = 1;
          outlineInfo.outline.scale.x = 1.4;
        }
        if(outlineInfo.side == 'left') 
        {
          outlineInfo.outline.x = -shift;
          outlineInfo.outline.scale.x = 1;
          outlineInfo.outline.scale.y = 1.4;
        }
        if(outlineInfo.side == 'right') 
        {
          outlineInfo.outline.x = shift;
          outlineInfo.outline.scale.x = 1;
          outlineInfo.outline.scale.y = 1.4;
        }    
        if(outlineInfo.side == 'full') 
        {
          // outlineInfo.outline.scale.x = 1.2;
          // outlineInfo.outline.scale.y = 1.2;
        }

        outlineInfo.state = 'show';

        var ease = Power1.easeInOut;

        TweenMax.killTweensOf(outlineInfo.outline.scale);
        TweenMax.killTweensOf(outlineInfo.outline);

        // outlineInfo.outline.alpha = 0;
        if(type == 'normal')
        {
          TweenMax.to(outlineInfo.outline.scale, 6/30, {x: (data.side == 'left'?-1:1), y: (data.side == 'down'?-1:1), ease: ease});
          TweenMax.to(outlineInfo.outline, 6/30, {alpha: 1, x: 0, y: 0, ease: ease});
        }
        else if(type == 'hard')
        {
          outlineInfo.outline.scale.x = (data.side == 'left'?-1:1);
          outlineInfo.outline.scale.y = (data.side == 'down'?-1:1);
          outlineInfo.outline.x = 0;
          outlineInfo.outline.y = 0;
          outlineInfo.outline.alpha = 1;
        }
      }
      else 
      {
        if(outlineInfo.state == 'hide') continue;

        outlineInfo.state = 'hide';
        
        TweenMax.killTweensOf(outlineInfo.outline);

        if(type == 'normal')
        {
          TweenMax.to(outlineInfo.outline, 6/30, {alpha: 0, ease: Power2.easeInOut});
        }
        else if(type == 'hard')
        {
          outlineInfo.outline.alpha = 0;
        }
      }
    }

    if(hideDelay != 0)
    {
      TweenMax.delayedCall(hideDelay, function()
      {
        self.tween({name: 'hide_selection_outline'});
      });
    }

    // var outline;
    // if(data.side == 'left') outline = this.outlineLeft;
    // else if(data.side == 'right') outline = this.outlineRight;
    // else if(data.side == 'up') outline = this.outlineUp;
    // else if(data.side == 'down') outline = this.outlineDown;

    // TweenMax.to(outline, 5/30, {alpha: 1, delay: delay, ease: Power2.easeOut, onComplete: function()
    // {
    //   if(callback) callback();
    // }});
  }  
  if(data.name == 'hide_selection_outline')
  {
    var type = data.type;
    if(type == undefined) type = 'normal';

    // console.log('TTT:', type);
    // var inst = data.inst;
    // if(inst == undefined) inst = false;

    for(var i = 0; i < this.outlines.length; i++)
    {
      var outlineInfo = this.outlines[i];

      if(outlineInfo.state == 'hide') continue;

      outlineInfo.state = 'hide';

      TweenMax.killTweensOf(outlineInfo.outline);
      
      if(type == 'normal') TweenMax.to(outlineInfo.outline, 6/30, {alpha: 0, ease: Power2.easeInOut});
      else if(type == 'hard') outlineInfo.outline.alpha = 0;
    }
  }

  if(data.name == 'show_front')
  {
    TweenMax.to(this.containerFront, 20/30, {alpha: 1, delay: delay, ease: Power1.easeInOut, onComplete: function()
    {
      if(callback) callback();
    }});
  }  
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelPlayerBase = function(config)
{
  Gui.BasePanel.call(this, config);


  this.panelState = 'hide';
  this.visible = false;

  this.hidePosition = null;
  this.showPosition = null;
}
PanelPlayerBase.prototype = Object.create(Gui.BasePanel.prototype);
PanelPlayerBase.prototype.constructor = PanelPlayerBase;

PanelPlayerBase.prototype.clear = function()
{
  this.tilesContainer.clear();

  if(this.panelPopupScore != null) this.panelPopupScore.visible = false;
}

PanelPlayerBase.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show_anim')
  {
    this.panelState = 'to_show';
    this.visible = true;

    // this.alpha = 0;
    // TweenMax.to(this, 4/30, {alpha: 1, ease: Power2.easeOut});

    this.xRelative = this.hidePosition.x;
    this.yRelative = this.hidePosition.y;

    TweenMax.to(this, 12/30, {xRelative: this.showPosition.x, yRelative: this.showPosition.y, ease: Power2.easeOut, onComplete: function()
    {
      self.tween({name: 'show'}, callback);
    }});
  }

  if(data.name == 'hide_anim')
  {
    this.panelState = 'to_hide';
    this.interactiveChildren = false;

    // this.alpha = 0;
    // TweenMax.to(this, 4/30, {alpha: 1, ease: Power2.easeOut});

    // this.xRelative = this.hidePosition.x;
    // this.yRelative = this.hidePosition.y;

    TweenMax.to(this, 12/30, {xRelative: this.hidePosition.x, yRelative: this.hidePosition.y, ease: Power2.easeIn, onComplete: function()
    {
      self.tween({name: 'hide'}, callback);
    }});
  }

  if(data.name == 'show' && this.panelState != 'show')
  {
    this.panelState = 'show';
    this.visible = true;
    this.interactiveChildren = true;

    if(callback) callback();
  }
  if(data.name == 'hide')
  {
    this.panelState = 'hide';
    this.visible = false;
    this.interactiveChildren = false;

    if(callback) callback();
  }
}

PanelPlayerBase.prototype.displayTurn = function(data, callback)
{
  if(app.screenGame.state != 'show') return;

  var self = this;

  var turnInfo = data.turnInfo;

  // console.log('D:', data);

  if(!turnInfo.isSkip)
  {
    if(turnInfo.turn.tile != null) 
    {
      if(app.screenGame.panelBazaar.state == 'hide') displayNormalTurn();
      else 
      {
        app.screenGame.panelBazaar.tween({name: 'hide'}, function()
        {
          displayNormalTurn();
        });
      }
    }
    else if(turnInfo.turn.bazaarTile != null) 
    {
      if(app.screenGame.panelBazaar.state == 'show') displayBazaarTurn();
      else 
      {
        app.screenGame.panelBazaar.tween({name: 'show'}, function()
        {
          displayBazaarTurn();
        });
      }
    }
  }
  else 
  {
    if(app.screenGame.panelBazaar.state == 'hide') displaySkipTurn();
    else 
    {
      app.screenGame.panelBazaar.tween({name: 'hide'}, function()
      {
        displaySkipTurn();
      });
    }
  }

  function displayNormalTurn()
  {
    var gTile = turnInfo.turn.tile;
    var tile = app.screenGame.findTilePanel(gTile);

    self.tilesContainer.removeTile(tile);
    // TweenMax.delayedCall(4/30, function()
    // {
      self.tilesContainer.tween({name: 'update_positions'});
    // });

    // app.screenGame.panelBoard.addTile({ tile: tile, turnInfo: turnInfo }, function()
    app.screenGame.panelBoard.addTile({ tile: tile, player: self }, function()
    {
      self.displayTurnComplete(data, function()
      {
        TweenMax.delayedCall(5/30, function()
        {
          // app.screenGame.dominoesGame.doTurn();
          app.screenGame.playerDisplayTurnComplete(self);
        });
      });
    });
  }

  function displayBazaarTurn()
  {
    var gTile = turnInfo.turn.bazaarTile;
    var tile = app.screenGame.findTilePanel(gTile);

    self.tilesContainer.addTile({tile: tile}, function()
    {
      TweenMax.delayedCall(4/30, function()
      {
        // app.screenGame.dominoesGame.doTurn();
        app.screenGame.playerDisplayTurnComplete(self);
      });
    });
  }

  function displaySkipTurn()
  {
    self.showPopupBlocked(15/30, function()
    {
      self.displayTurnComplete(data, function()
      {
        // app.screenGame.dominoesGame.doTurn();
        app.screenGame.playerDisplayTurnComplete(self);
      });      
    });
  }

  // this.showPopupBlocked();
}

PanelPlayerBase.prototype.showPopupBlocked = function(time, callback)
{
  var self = this;

  var position = this.getPopupBlockedPosition();

  app.screenGame.panelPopupBlocked.tween({ name: 'show_anim', side: this.side, x: position.x, y: position.y });

  if(time == undefined) time = 30/30;

  TweenMax.delayedCall(time, function()
  {
    app.screenGame.panelPopupBlocked.tween({ name: 'hide_anim', side: self.side }, callback);
  });
}

PanelPlayerBase.prototype.getPopupBlockedPosition = function()
{
  return { x: this.x, y: this.y };
  // app.screenGame.panelPopupBlocked.tween({name: 'show_anim', side: this.side, x: this.x, y: this.y});
}

PanelPlayerBase.prototype.getFillHandPosition = function()
{
  return { x: this.x, y: this.y };
  // app.screenGame.panelPopupBlocked.tween({name: 'show_anim', side: this.side, x: this.x, y: this.y});
}


PanelPlayerBase.prototype.showPopupScore = function(time, text, callback)
{
  var self = this;

  var position = this.getPopupScorePosition();
  this.panelPopupScore.tween({ name: 'show_anim', side: this.side, x: position.x, y: position.y, text: text });

  if(time == undefined) time = 30/30;

  TweenMax.delayedCall(time, function()
  {
    self.panelPopupScore.tween({ name: 'hide_anim', side: self.side }, callback);
  });
}

PanelPlayerBase.prototype.showPopupTilesWeight = function(time, tilesWeight, winPlayer, waitDelay, callback)
{
  var self = this;

  var position = this.getPopupTilesWeightPosition();

  var p = new PIXI.Point(winPlayer.panelScore.x, winPlayer.panelScore.y);
  p = winPlayer.panelScore.parent.toGlobal(p);
  p = winPlayer.parent.toLocal(p);

  this.panelPopupScore.tween({ name: 'show_tiles_weight', side: this.side, x: position.x, y: position.y, targetX: p.x, targetY: p.y, text: ''+tilesWeight, waitDelay: waitDelay });

  // if(time == undefined) time = 30/30;

  // TweenMax.delayedCall(time, function()
  // {
  //   self.panelPopupScore.tween({ name: 'hide_anim', side: self.side }, callback);
  // });
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelPlayerScore = function(config)
{
  config.width = 70;
  config.height = 70;
  Gui.BasePanel.call(this, config);


  this.textScore = Util.setParams(new Gui.TextBmp('0',  constsManager.getData('text_configs/player_score_text')), {parent: this, aX:0.5, aY:0.5, x: 0, y: -10});

  this.score = 0;

  this.labelPoints = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_score_label_points.png'));
  this.addChild(this.labelPoints);
  this.labelPoints.anchor.set(0.5, 0.5);
  this.labelPoints.y = 10;
}
PanelPlayerScore.prototype = Object.create(Gui.BasePanel.prototype);
PanelPlayerScore.prototype.constructor = PanelPlayerScore;

PanelPlayerScore.prototype.tweenScoreTo = function(score)
{
  var self = this;

  var obj = { score: this.score };
  TweenMax.to(obj, 12/30, { score: score, ease: Power1.easeIn, onUpdate: function()
  {
    self.setScore(Math.round(obj.score));
  },
  onComplete: function()
  {
    self.setScore(score);
  }});
}

PanelPlayerScore.prototype.setScore = function(score)
{
  if(this.score == score) return;

  this.score = score;
  this.textScore.text = score;
}

PanelPlayerScore.prototype.tweenWin = function()
{
  var self = this;

  var showTime = 4/30;

  TweenMax.to(this.scale, 10/30, { x: 1.2, y: 1.2, ease: Power1.easeOut });
  TweenMax.to(this, 10/30, { pixi: { colorize: '#DBE238', colorizeAmount: 1.0 }, onComplete: function()
  {
    TweenMax.to(self.scale, 10/30, { x: 1.0, y: 1.0, ease: Power1.easeOut, delay: showTime });
    TweenMax.to(self, 10/30, { pixi: { colorize: '#FFFFFF', colorizeAmount: 0.0 }, delay: showTime, onComplete: function()
    {
      
    }});
  }});
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelPlayerAi = function(config)
{
  PanelPlayerBase.call(this, config);


  this.gPlayer = null;
  // this.startTiles = [];

  this.type = config.info.type;
  this.side = config.info.side;

  if(this.side == 'left')
  {
    this.iconRobotKind = 'robot_1';
  }
  if(this.side == 'top')
  {
    this.iconRobotKind = 'robot_2';
  }    
  if(this.side == 'right')
  {
    this.iconRobotKind = 'robot_3';
  }

  this.containerBg = new PIXI.Container();
  this.addChild(this.containerBg);
  // this.containerBg.visible = false;

  this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_ai_bg_corner.png');
  this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_ai_bg_body.png');

  this.bgCornerLeft = new PIXI.Sprite(this.bgCornerTexture);
  this.containerBg.addChild(this.bgCornerLeft);
  this.bgCornerLeft.anchor.set(1.0, 0.5);
  this.bgCornerRight = new PIXI.Sprite(this.bgCornerTexture);
  this.containerBg.addChild(this.bgCornerRight);
  this.bgCornerRight.anchor.set(1.0, 0.5);
  this.bgCornerRight.scale.x = -1;  
  this.bgBody = new PIXI.Sprite(this.bgBodyTexture);
  this.containerBg.addChild(this.bgBody);
  this.bgBody.anchor.set(0.5, 0.5);

  this.containerBgLight = new PIXI.Container();
  this.containerBg.addChild(this.containerBgLight);
  this.bgCornerLeftLight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme2/panel_player_ai_bg_corner_2.png'));
  this.containerBgLight.addChild(this.bgCornerLeftLight);
  this.bgCornerLeftLight.anchor.set(1.0, 0.5);
  this.bgCornerRightLight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme2/panel_player_ai_bg_corner_2.png'));
  this.containerBgLight.addChild(this.bgCornerRightLight);
  this.bgCornerRightLight.anchor.set(1.0, 0.5);
  this.bgCornerRightLight.scale.x = -1;  
  this.bgBodyLight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme2/panel_player_ai_bg_body_2.png'));
  this.containerBgLight.addChild(this.bgBodyLight);
  this.bgBodyLight.anchor.set(0.5, 0.5);
  this.containerBgLight.visible = false;
  this.containerBgLight.alpha = 0;

  this.containerTurnLight = new PIXI.Container();
  this.addChild(this.containerTurnLight);
  this.turnLightCornerLeft = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_ai_turn_light_corner.png'));
  this.containerTurnLight.addChild(this.turnLightCornerLeft);
  this.turnLightCornerLeft.anchor.set(1.0, 0.5);
  this.turnLightCornerRight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_ai_turn_light_corner.png'));
  this.containerTurnLight.addChild(this.turnLightCornerRight);
  this.turnLightCornerRight.anchor.set(1.0, 0.5);
  this.turnLightCornerRight.scale.x = -1;  
  this.turnLightBody = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_ai_turn_light_body.png'));
  this.containerTurnLight.addChild(this.turnLightBody);
  this.turnLightBody.anchor.set(0.5, 0.5);
  this.turnLightBody.y = -45;
  this.containerTurnLight.alpha = 0;

  this.containerRobot = new PIXI.Container();
  this.addChild(this.containerRobot);

  this.iconRobot = new PIXI.Sprite(this.getIconRobotTexture('Theme1', 'normal'));
  this.containerRobot.addChild(this.iconRobot);
  this.iconRobot.anchor.set(0.5, 0.5);

  this.iconRobotReal = new PIXI.Sprite(this.getIconRobotTexture('Theme2', 'normal'));
  this.containerRobot.addChild(this.iconRobotReal);
  this.iconRobotReal.anchor.set(0.5, 0.5);
  this.iconRobotReal.visible = false;

  this.iconRobotRealActive = new PIXI.Sprite(this.getIconRobotTexture('Theme2', 'active'));
  this.containerRobot.addChild(this.iconRobotRealActive);
  this.iconRobotRealActive.anchor.set(0.5, 0.5);
  this.iconRobotRealActive.visible = false;
  this.iconRobotRealActive.alpha = 0;

  this.panelScore = new PanelPlayerScore({parentPanel: this});

  this.tilesContainer = new PanelTilesContainer({parentPanel: this, width: 300, height: 100, info: {type: 'ai'}});

  this.panelPopupScore = new PanelPopupScore({parentPanel: this, layer: this.parentPanel.containerPopups});
  this.panelPopupScore.y = 5;

  var hideShift = 125;
  var showShift = 5;

  this.tilesContainerShift = 50;
  this.tilesContainerPadding = 105;

  if(this.side == 'left')
  {
    this.width = 82;
    // this.height = 460;
    this.positionType = 'left-center';

    this.hidePosition = new PIXI.Point(-hideShift, 0);
    this.showPosition = new PIXI.Point(showShift, 0);

    this.containerBg.rotation = -90 * Util.TO_RADIANS;
    this.containerTurnLight.rotation = 90 * Util.TO_RADIANS;

    // this.iconRobot.y = -185;
    // this.iconRobotActive.y = this.iconRobot.y;

    this.tilesContainer.x = 20;
    this.tilesContainer.y = this.tilesContainerShift;
    this.tilesContainer.rotation = 90*Util.TO_RADIANS;
  }   
  if(this.side == 'top')
  {
    // this.width = 460;
    this.height = 82;
    this.positionType = 'center-top';

    this.hidePosition = new PIXI.Point(0, -hideShift);
    this.showPosition = new PIXI.Point(0, showShift);

    // this.iconRobot.x = -185;
    // this.iconRobotActive.x = this.iconRobot.x;

    this.tilesContainer.y = 20;
    this.tilesContainer.x = this.tilesContainerShift;
    this.tilesContainer.rotation = 0*Util.TO_RADIANS;

    this.containerTurnLight.scale.y = -1;
  }   
  if(this.side == 'right')
  {
    this.width = 82;
    // this.height = 460;
    this.positionType = 'right-center';

    this.hidePosition = new PIXI.Point(hideShift, 0);
    this.showPosition = new PIXI.Point(-showShift, 0);

    this.containerBg.rotation = 90 * Util.TO_RADIANS;
    this.containerTurnLight.rotation = -90 * Util.TO_RADIANS;

    // this.iconRobot.y = -185;
    // this.iconRobotActive.y = this.iconRobot.y;

    this.tilesContainer.x = -20;
    this.tilesContainer.y = this.tilesContainerShift;
    this.tilesContainer.rotation = 90*Util.TO_RADIANS;
  }

  // this.minSize = 168;
  this.minSize = this.tilesContainer.minWidth + this.tilesContainerShift+this.tilesContainerPadding;

  this.tilesContainer.on('size_update', function(data)
  {
    var size = data.width + this.tilesContainerShift+this.tilesContainerPadding;
    if(size < this.minSize) size = this.minSize;

    if(this.side == 'top' && this.width != size) this.width = size;
    else if((this.side == 'left' || this.side == 'right') && this.height != size) this.height = size;
    // if(width != this.width) 
    // {
    //   this.width = width;
    // }

    this.updateContainerSize();

    // console.log('D:', data.width);
  }, this);

  this.updateContainerSize();

  // app.on('board_style_setted', function(boardStyle)
  app.on('tiles_style_setted', function(boardStyle)
  {
    this.updateStyle();
  }, this);  

  app.on('board_style_setted', function(boardStyle)
  {
    this.updateStyle();
  }, this);
}
PanelPlayerAi.prototype = Object.create(PanelPlayerBase.prototype);
PanelPlayerAi.prototype.constructor = PanelPlayerAi;

PanelPlayerAi.prototype.updateStyle = function()
{
  var tilesStyle = app.gameData.tilesStyle;
  var boardStyle = app.gameData.boardStyle;

    if(tilesStyle == 'minimalistic')
    {
      if(this.isAlli)
      {
        // console.log(boardStyle);
        if(boardStyle == 'minimalistic')
        {
          // this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_alli_bg_corner.png');
          // this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_alli_bg_body.png');
          this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_alli_bg_corner_green.png');
          this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_alli_bg_body_green.png');
        }
        else
        {
          // this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_alli_bg_corner_green.png');
          // this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_alli_bg_body_green.png');
          this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_alli_bg_corner.png');
          this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_alli_bg_body.png');
        }
      }
      else
      {
        this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_ai_bg_corner.png');
        this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_ai_bg_body.png');
      }

      this.containerTurnLight.visible = true;
      this.containerBgLight.visible = false;

      this.iconRobot.visible = true;
      this.iconRobotReal.visible = false;
      this.iconRobotRealActive.visible = false;

      // TweenMax.to(this.containerBg, 1/30, { pixi: { colorize: '#FFFFFF', colorizeAmount: 0} });
    }
    else if(tilesStyle == 'realistic')
    {
      this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme2/panel_player_ai_bg_corner.png');
      this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme2/panel_player_ai_bg_body.png');

      this.containerTurnLight.visible = false;
      this.containerBgLight.visible = true;

      this.iconRobot.visible = false;
      this.iconRobotReal.visible = true;
      this.iconRobotRealActive.visible = true;

      // TweenMax.to(this.containerBg, 1/30, { pixi: { colorize: '#742D13', colorizeAmount: 0.25} });
    }

    this.bgCornerLeft.texture = this.bgCornerTexture;
    this.bgCornerRight.texture = this.bgCornerTexture;
    this.bgBody.texture = this.bgBodyTexture;

    this.updateContainerSize();
}

PanelPlayerAi.prototype.updateContainerSize = function()
{
  var size = (this.side == 'top')?this.width:this.height;
  // var size = this.width;

  // console.log('AAAAAAAAA');

  var bodyWidth = size-this.bgCornerLeft.width*2;

  var panelScoreShift = 0;

  if(app.gameData.tilesStyle == 'realistic') 
  {
    bodyWidth += 30;

    if(this.side == 'top')
    {
      this.containerRobot.y = -10;
      this.containerBg.y = -3;

      // panelScoreShift = -5;
      this.panelScore.y = -10;
    }
    else if(this.side == 'left')
    {
      this.containerRobot.x = -10;
      this.containerBg.x = -3;

      // panelScoreShift = -5;
      this.panelScore.x = -10;
    }
    else if(this.side == 'right')
    {
      this.containerRobot.x = 10;
      this.containerBg.x = 3;

      // panelScoreShift = -5;
      this.panelScore.x = 10;
    }
  }
  else 
  {
    if(this.side == 'top')
    {
      this.containerRobot.y = 0;
      this.containerBg.y = 0;

      this.panelScore.y = 0;
    }
    else if(this.side == 'left' || this.side == 'right')
    {
      this.containerRobot.y = 0;
      this.containerRobot.x = 0;
      this.panelScore.x = 0;
      this.panelScore.y = 0;
      this.containerBg.y = 0;
      this.containerBg.x = 0;
    }
  }

  this.bgCornerLeft.x = -bodyWidth/2;
  this.bgBody.width = bodyWidth;
  this.bgCornerRight.x = bodyWidth/2;

  this.bgCornerLeftLight.x = -bodyWidth/2;
  this.bgBodyLight.width = bodyWidth;
  this.bgCornerRightLight.x = bodyWidth/2;

  var lightBodyWidth = size - this.turnLightCornerLeft.width * 2 + 25;
  this.turnLightCornerLeft.x = -lightBodyWidth/2;
  this.turnLightBody.width = lightBodyWidth+2;
  this.turnLightCornerRight.x = lightBodyWidth/2;

  if(this.side == 'top')
  {
    this.containerRobot.x = -size/2 + 40;
    this.panelScore.x = size/2 - 40 + panelScoreShift;

    this.tilesContainer.x = -size/2 + 80 + this.tilesContainer.width/2;
  }
  else if(this.side == 'left' || this.side == 'right')
  {
    this.containerRobot.y = -size/2 + 40;
    this.panelScore.y = size/2 - 36 + panelScoreShift;

    this.tilesContainer.y = -size/2 + 80 + this.tilesContainer.width/2;
  }

  // this.label.x = this.width/2 - 40;
}

PanelPlayerAi.prototype.getIconRobotTexture = function(theme, state)
{
  var n = '';
  if(this.iconRobotKind == 'robot_1') n = '0001';
  if(this.iconRobotKind == 'robot_2') n = '0002';
  if(this.iconRobotKind == 'robot_3') n = '0003';
  if(this.iconRobotKind == 'robot_4') n = '0004';
  if(this.iconRobotKind == 'robot_5') n = '0005';
  if(this.iconRobotKind == 'robot_6') n = '0006';

  return assetsManager.getTexture('texture_atlas', theme+'/icon_robot_'+state+'_'+n+'.png');
}

PanelPlayerAi.prototype.getPopupBlockedPosition = function()
{
  var p = new PIXI.Point(this.iconRobot.x, this.iconRobot.y);
  p = this.iconRobot.parent.toGlobal(p);
  p = this.parent.toLocal(p);

  var position = { x: p.x, y: p.y };

  if(this.side == 'left')
  {
    position.x += 190;
  }
  if(this.side == 'top')
  {
    position.y += 120;
  } 
   if(this.side == 'right')
  {
    position.x -= 190;
  }

  return position;
}
PanelPlayerAi.prototype.getPopupScorePosition = function()
{
  var p = new PIXI.Point(this.panelScore.x, this.panelScore.y);
  p = this.panelScore.parent.toGlobal(p);
  p = this.parent.toLocal(p);

  var position = { x: p.x, y: p.y };

  if(this.side == 'left')
  {
    position.x += 125;
  }
  if(this.side == 'top')
  {
    position.y += 120;
  } 
   if(this.side == 'right')
  {
    position.x -= 125;
  }

  return position;
}
PanelPlayerAi.prototype.getPopupTilesWeightPosition = function()
{
  // var p = new PIXI.Point(this.x, this.y);
  // p = this.panelScore.parent.toGlobal(p);
  // p = this.parent.toLocal(p);

  var position = { x: this.x, y: this.y };

  if(this.side == 'left')
  {
    position.x += 135;
  }
  if(this.side == 'top')
  {
    position.y += 140;
  } 
   if(this.side == 'right')
  {
    position.x -= 135;
  }

  return position;
}

PanelPlayerAi.prototype.getFillHandPosition = function()
{
  var position = { x: this.x, y: this.y };

  var shift = 100;

  if(this.side == 'left')
  {
    position.x -= shift;
  }
  if(this.side == 'top')
  {
    position.y -= shift;
  } 
   if(this.side == 'right')
  {
    position.x += shift;
  }

  return position;
}

PanelPlayerAi.prototype.clear = function()
{
  PanelPlayerBase.prototype.clear.call(this);


  TweenMax.to(this.iconRobot, 0/30, {pixi: { colorize: '#FFFFFF', colorizeAmount: 0.0 }});
  
  this.iconRobotRealActive.alpha = 0;
  this.containerBgLight.alpha = 0;

  this.containerTurnLight.alpha = 0;
}

PanelPlayerAi.prototype.initGame = function(player, iconN, isAlli)
{
  var self = this;

  if(isAlli == undefined) isAlli = false;

  // console.log('isAll', isAlli);

  this.gPlayer = player;

  this.isAlli = isAlli;

  this.iconRobotKind = 'robot_'+iconN;

  this.iconRobot.texture = this.getIconRobotTexture('Theme1', 'normal');
  this.iconRobotReal.texture = this.getIconRobotTexture('Theme2', 'normal');
  this.iconRobotRealActive.texture = this.getIconRobotTexture('Theme2', 'active');

  // console.log('init', isAlli);
  this.tilesContainer.isHumanAlli = isAlli;
  // if(app.screenGame.)

  // this.gPlayer.on('init_game', function(data)
  // {
  //   this.initStartTiles(data.tiles);
  // }, this);

  this.gPlayer.on('turn_start', function(data)
  {
    // console.log('turn_start', data);
    self.displayTurnStart(data);
  });

  this.gPlayer.on('turn_complete', function(data)
  {
    TweenMax.delayedCall(14/30, function()
    {
      self.displayTurn(data);
    });
  });

  this.gPlayer.on('turn', function(data)
  {
    // console.log(data);
  });

  this.updateStyle();
}

PanelPlayerAi.prototype.initRound = function(data)
{
  var isAlli = (data != null && data.isAlli != undefined)?data.isAlli:false;
  this.tilesContainer.isHumanAlli = isAlli;
}

PanelPlayerAi.prototype.displayTurnStart = function(data, callback)
{
  if(app.screenGame.state != 'show') return;

  var self = this;

  TweenMax.to(this.iconRobotRealActive, 8/30, {alpha: 1, ease: Power1.easeInOut});
  TweenMax.to(this.iconRobot, 8/30, {pixi: { colorize: '#FFF456', colorizeAmount: 1.0, ease: Power1.easeInOut }, onComplete: function()
  {
    if(callback) callback();
  }});

  if(app.gameData.boardStyle == 'realistic')
  {
    // TweenMax.to(this.containerBg, 8/30, { pixi: { colorize: '#FDF3B1', colorizeAmount: 0.90} });
  }

  TweenMax.to(this.containerTurnLight, 8/30, {alpha: 1, ease: Power1.easeInOut});
  TweenMax.to(this.containerBgLight, 8/30, {alpha: 1, ease: Power1.easeInOut});
  // TweenMax.delayedCall(120/30, function()
  // {
  //   if(callback) callback();
  // });
}

PanelPlayerAi.prototype.displayTurnComplete = function(data, callback)
{
  if(app.screenGame.state != 'show') return;

  TweenMax.to(this.iconRobotRealActive, 8/30, {alpha: 0, ease: Power1.easeInOut});
  TweenMax.to(this.iconRobot, 8/30, {pixi: { colorize: '#FFFFFF', colorizeAmount: 1.0, ease: Power1.easeInOut }, onComplete: function()
  {
    if(callback) callback();
  }});

  if(app.gameData.boardStyle == 'realistic')
  {
    // TweenMax.to(this.containerBg, 8/30, { pixi: { colorize: '#742D13', colorizeAmount: 0.25} });
  }

  TweenMax.to(this.containerTurnLight, 8/30, {alpha: 0, ease: Power1.easeInOut});
  TweenMax.to(this.containerBgLight, 8/30, {alpha: 0, ease: Power1.easeInOut});
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelPlayerHuman = function(config)
{
  PanelPlayerBase.call(this, config);


  this.gPlayer = null;
  // this.startTiles = [];

  this.type = config.info.type;
  this.side = config.info.side;

  this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_human_bg_corner.png');
  this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_human_bg_body.png');

  this.containerBg = new PIXI.Sprite();
  this.addChild(this.containerBg);
  // this.containerBg.visible = false;
  this.bgCornerLeft = new PIXI.Sprite(this.bgCornerTexture);
  this.containerBg.addChild(this.bgCornerLeft);
  this.bgCornerLeft.anchor.set(1, 0.5);     
  this.bgBody = new PIXI.Sprite(this.bgBodyTexture);
  this.containerBg.addChild(this.bgBody);
  this.bgBody.anchor.set(0.5, 0.5);    
  this.bgCornerRight = new PIXI.Sprite(this.bgCornerTexture);
  this.containerBg.addChild(this.bgCornerRight);
  this.bgCornerRight.anchor.set(1, 0.5);
  this.bgCornerRight.scale.x = -1;
  this.containerBg.rotation = 180*Util.TO_RADIANS;

  this.containerBgLight = new PIXI.Container();
  this.containerBg.addChild(this.containerBgLight);
  this.bgCornerLeftLight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme2/panel_player_ai_bg_corner_2.png'));
  this.containerBgLight.addChild(this.bgCornerLeftLight);
  this.bgCornerLeftLight.anchor.set(1.0, 0.5);
  this.bgCornerRightLight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme2/panel_player_ai_bg_corner_2.png'));
  this.containerBgLight.addChild(this.bgCornerRightLight);
  this.bgCornerRightLight.anchor.set(1.0, 0.5);
  this.bgCornerRightLight.scale.x = -1;  
  this.bgBodyLight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme2/panel_player_ai_bg_body_2.png'));
  this.containerBgLight.addChild(this.bgBodyLight);
  this.bgBodyLight.anchor.set(0.5, 0.5);
  this.containerBgLight.visible = false;
  this.containerBgLight.alpha = 0;

  this.containerTurnLight = new PIXI.Container();
  this.addChild(this.containerTurnLight);
  this.turnLightCornerLeft = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_ai_turn_light_corner.png'));
  this.containerTurnLight.addChild(this.turnLightCornerLeft);
  this.turnLightCornerLeft.anchor.set(1.0, 0.5);
  this.turnLightCornerRight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_ai_turn_light_corner.png'));
  this.containerTurnLight.addChild(this.turnLightCornerRight);
  this.turnLightCornerRight.anchor.set(1.0, 0.5);
  this.turnLightCornerRight.scale.x = -1;  
  this.turnLightBody = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_ai_turn_light_body.png'));
  this.containerTurnLight.addChild(this.turnLightBody);
  this.turnLightBody.anchor.set(0.5, 0.5);
  this.turnLightBody.y = -45;
  this.containerTurnLight.y = 0;
  this.containerTurnLight.alpha = 0;

  this.panelScore = new PanelPlayerScore({parentPanel: this});
  this.panelScore.y = 5;

  this.panelPopupScore = new PanelPopupScore({parentPanel: this, layer: this.parentPanel.containerPopups});

  this.minWidth = 490;

  this.width = this.minWidth;
  this.height = 94;
  this.positionType = 'center-bot';

  this.hidePosition = new PIXI.Point(0, 125);
  this.showPosition = new PIXI.Point(0, -5);

  this.tilesContainerShift = 80;
  this.tilesContainerPadding = 10;

  this.tilesContainer = new PanelTilesContainer({parentPanel: this, width: 200, height: 100, info: {type: 'human'}});
  this.tilesContainer.x = -this.tilesContainerShift/2+this.tilesContainerPadding/2;
  this.tilesContainer.y = -15;

  this.tilesContainer.on('size_update', function(data)
  {
    var width = data.width + this.tilesContainerShift+this.tilesContainerPadding;
    if(width < this.minWidth) width = this.minWidth;

    if(width != this.width) 
    {
      this.width = width;
        // this.updateContainerSize();
    }

    this.updateContainerSize();

    // console.log('D:', data.width);
  }, this);

  this.selectedTile = null;
  this.selectedConnectTile = null;
  this.selectedJoin = null;

  this.avaiableTiles = [];
  this.uslessTiles = [];

  this.updateContainerSize();

  app.addForUpdate(this.update, this);

  this.autoDraw = app.gameData.autoDraw;
  app.on('auto_draw_setted', function(autoDraw)
  {
    this.autoDraw = autoDraw;
  }, this);

  // app.on('board_style_setted', function(boardStyle)
  app.on('tiles_style_setted', function(tilesStyle)
  {
    this.updateStyle();
  }, this);  
  app.on('board_style_setted', function(tilesStyle)
  {
    this.updateStyle();
  }, this);

  this.preselectTile = null;
  this.preselectPosition = null;
  this.selectPhase = 'none';
}
PanelPlayerHuman.prototype = Object.create(PanelPlayerBase.prototype);
PanelPlayerHuman.prototype.constructor = PanelPlayerHuman;

PanelPlayerHuman.prototype.updateStyle = function()
{
  var tilesStyle = app.gameData.tilesStyle;
  var boardStyle = app.gameData.boardStyle;

    if(tilesStyle == 'minimalistic')
    {
      if(boardStyle == 'minimalistic')
      {
        if(app.gameData.players != '2v2')
        {
          this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_human_bg_corner.png');
          this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_human_bg_body.png');
        }
        else
        {
          this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_human_bg_corner_green.png');
          this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_human_bg_body_green.png');
        }
      }
      else
      {
        if(app.gameData.players != '2v2')
        {
          this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_human_bg_corner_green.png');
          this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_human_bg_body_green.png'); 
        }
        else
        {
          this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_human_bg_corner.png');
          this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_player_human_bg_body.png');
        }
      }

      this.containerTurnLight.visible = true;
      this.containerBgLight.visible = false;
      // TweenMax.to(this.containerBg, 1/30, { pixi: { colorize: '#FFFFFF', colorizeAmount: 0.20} });
    }
    else if(tilesStyle == 'realistic')
    {
      this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme2/panel_player_human_bg_corner.png');
      this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme2/panel_player_human_bg_body.png');

      this.containerTurnLight.visible = false;
      this.containerBgLight.visible = true;
      // TweenMax.to(this.containerBg, 1/30, { pixi: { colorize: '#742D13', colorizeAmount: 0.25} });
    }

    this.bgCornerLeft.texture = this.bgCornerTexture;
    this.bgCornerRight.texture = this.bgCornerTexture;
    this.bgBody.texture = this.bgBodyTexture;

    this.updateContainerSize();
}

PanelPlayerHuman.prototype.updateContainerSize = function()
{
  var bodyWidth = this.width-this.bgCornerLeft.width*2;

  if(app.gameData.tilesStyle == 'realistic')
  {
    bodyWidth += 40;

    this.containerBg.y = 8;
    this.panelScore.y = 18;
  }
  else
  {
    this.containerBg.y = 0;
    this.panelScore.y = 0;
  }

  this.bgCornerLeft.x = -bodyWidth/2;
  this.bgBody.width = bodyWidth;
  this.bgCornerRight.x = bodyWidth/2;

  this.bgCornerLeftLight.x = -bodyWidth/2;
  this.bgBodyLight.width = bodyWidth;
  this.bgCornerRightLight.x = bodyWidth/2;

  var lightBodyWidth = this.width - this.turnLightCornerLeft.width * 2 + 25;
  this.turnLightCornerLeft.x = -lightBodyWidth/2;
  this.turnLightBody.width = lightBodyWidth+2;
  this.turnLightCornerRight.x = lightBodyWidth/2;

  this.panelScore.x = this.width/2 - 40;

  // console.log()

  // this.tilesContainer.x = this.width/2-this.tilesContainerShift-this.tilesContainer.width/2;

  // console.log(bodyWidth);
}

PanelPlayerHuman.prototype.getPopupBlockedPosition = function()
{
  var position = { x: this.x, y: this.y - 140 };

  return position;
}

PanelPlayerHuman.prototype.getPopupScorePosition = function()
{
  var p = new PIXI.Point(this.panelScore.x, this.panelScore.y);
  p = this.panelScore.parent.toGlobal(p);
  p = this.parent.toLocal(p);

  var position = { x: p.x, y: p.y - 130 };

  return position;
}
PanelPlayerHuman.prototype.getPopupTilesWeightPosition = function()
{
  var position = { x: this.x, y: this.y - 150 };

  return position;
}

PanelPlayerHuman.prototype.getFillHandPosition = function()
{
  var position = { x: this.x, y: this.y + 100 };

  return position;
}

PanelPlayerHuman.prototype.clear = function()
{
  PanelPlayerBase.prototype.clear.call(this);


  this.width = this.minWidth;
  this.height = 94;

  this.tilesContainer.width = 200;

  this.containerTurnLight.alpha = 0;
  this.containerBgLight.alpha = 0;

  this.selectedTile = null;
  this.selectedJoin = null;
  this.selectedJoins = null;
  this.avaiableConnectTiles = null;
  this.avaiableTiles = null;
  this.uslessTiles = null;

  this.preselectTile = null;
  this.preselectPosition = null;
  this.selectPhase = 'none';
}

PanelPlayerHuman.prototype.initGame = function(player)
{
  var self = this;

  this.gPlayer = player;

  this.gPlayer.on('turn_start', function(data)
  {
    self.displayTurnStart(data);

    self.selectPhase = 'none';
  });

  this.gPlayer.on('turn_complete', function(data)
  {
    self.displayTurn(data);
  });

  this.gPlayer.on('turn', function(data)
  {
    if(app.screenGame.state != 'show') return;

    TweenMax.delayedCall(6/30, function()
    {
    var variants = data.variants;

    if(variants == null) 
    {
      if(app.screenGame.panelBazaar.state == 'show')
      {
        app.screenGame.panelBazaar.tween({name: 'hide'}, function()
        {
          self.initTurnSkip();
        });
      }
      else self.initTurnSkip();
    }    
    else if(variants.tilesVariants.length > 0) 
    {
      if(app.screenGame.panelBazaar.state == 'show')
      {
        app.screenGame.panelBazaar.tween({name: 'hide'}, function()
        {
          self.initTurnNormal(data);
        });
      }
      else self.initTurnNormal(data);
    }
    else if(variants.bazaarVariants.length > 0) 
    {
      if(app.screenGame.panelBazaar.state == 'hide')
      {
        app.screenGame.panelBazaar.tween({name: 'show'}, function()
        {
          
        });

        self.initTurnBazaar(data);
      }
      else self.initTurnBazaar(data);
    }
    });
  });
  
  this.updateStyle();
}

PanelPlayerHuman.prototype.initRound = function(data)
{

}

PanelPlayerHuman.prototype.displayTurnStart = function(data, callback)
{
  var self = this;

  TweenMax.to(this.containerTurnLight, 8/30, {alpha: 1, ease: Power1.easeInOut, onComplete: function()
  {
    if(callback) callback();
  }});

  TweenMax.to(this.containerBgLight, 8/30, {alpha: 1, ease: Power1.easeInOut});
}

PanelPlayerHuman.prototype.displayTurnComplete = function(data, callback)
{
  TweenMax.to(this.containerTurnLight, 8/30, {alpha: 0, ease: Power1.easeInOut, onComplete: function()
  {
    if(callback) callback();
  }});

  TweenMax.to(this.containerBgLight, 8/30, {alpha: 0, ease: Power1.easeInOut});
}
// ======================================================================================================================================== //
PanelPlayerHuman.prototype.initTurnSkip = function()
{
  for(var i = 0; i < this.gPlayer.tiles.length; i++)
  {
    var gTile = this.gPlayer.tiles[i];
    var tile = app.screenGame.findTilePanel(gTile);

    TweenMax.to(tile, 10/30, {pixi: { colorize: '#FFFFFF', colorizeAmount: 0.0 }, ease: Power2.easeOut});
  }

  this.gPlayer.doTurn(null);
}
// ======================================================================================================================================== //
PanelPlayerHuman.prototype.initTurnBazaar = function(data, callback)
{
  var self = this;

  var variants = data.variants;
  var bazaarVariants = variants.bazaarVariants;

  this.bazaarTiles = [];
  for(var i = 0; i < bazaarVariants.length; i++)
  {
    this.bazaarTiles.push(app.screenGame.findTilePanel(bazaarVariants[i]));
  }

  for(var i = 0; i < this.gPlayer.tiles.length; i++)
  {
    var gTile = this.gPlayer.tiles[i];
    var tile = app.screenGame.findTilePanel(gTile);

    TweenMax.to(tile, 10/30, {pixi: { colorize: '#1A2B4A', colorizeAmount: 0.4 }, ease: Power2.easeOut});
  }

  if(!this.autoDraw)
  {
    for(var i = 0; i < this.bazaarTiles.length; i++)
    {
      var bazaarTile = this.bazaarTiles[i];

      bazaarTile.interactive = true;
      bazaarTile.addListener('pointerdown', this.onBazaarTileClick, this);
    }
  }
  else 
  {
    TweenMax.delayedCall(12/30, function()
    {
      self.doBazaarTurn(Util.randomElement(self.bazaarTiles));
    });
  }
}

PanelPlayerHuman.prototype.doBazaarTurn = function(tile)
{
  for(var i = 0; i < this.bazaarTiles.length; i++)
  {
    var bazaarTile = this.bazaarTiles[i];

    bazaarTile.removeListener('pointerdown', this.onBazaarTileClick, this);

    bazaarTile.interactive = false;
  }

  this.bazaarTiles = [];

  this.gPlayer.doBazaarTurn(tile.gTile);
}

PanelPlayerHuman.prototype.onBazaarTileClick = function(data)
{
  var tile = data.target;
  this.doBazaarTurn(tile);
}
// ======================================================================================================================================== //
PanelPlayerHuman.prototype.initTurnNormal = function(data, callback)
{
  var variants = data.variants;
  var tilesVariants = variants.tilesVariants;

  // console.log('Human variants:', tilesVariants);

  this.avaiableTiles = [];
  this.uslessTiles = [];

  for(var i = 0; i < this.gPlayer.tiles.length; i++)
  {
    var gTile = this.gPlayer.tiles[i];
    var tile = app.screenGame.findTilePanel(gTile);

    var tileType = 'usless';

    for(var j = 0; j < tilesVariants.length; j++)
    {
      var variant = tilesVariants[j];
      if(variant.tile == gTile)
      {
        this.avaiableTiles.push({tile: tile, joins: variant.joins});
        tileType = 'avaiable';
        break;
      }
    }
    
    if(tileType == 'usless') this.uslessTiles.push(tile);
  }

  // console.log(this.avaiableTiles);
  // console.log(this.uslessTiles);

  for(var i = 0; i < this.uslessTiles.length; i++)
  {
    var tile = this.uslessTiles[i];

    TweenMax.to(tile, 10/30, {pixi: { colorize: '#1A2B4A', colorizeAmount: 0.4 }, ease: Power2.easeOut});
  }

  for(var i = 0; i < this.avaiableTiles.length; i++)
  {
    var tile = this.avaiableTiles[i].tile;

    tile.interactive = true;
    tile.addListener('pointerdown', this.onTilePointerDown, this);
    tile.addListener('pointerup', this.onTilePointerUp, this);
    tile.addListener('pointerupoutside', this.onTilePointerUp, this);
  }

  this.preselectTile = null; 
  this.selectPhase = 'none';
}

PanelPlayerHuman.prototype.doNormalTurn = function(tile, join)
{
  // console.log('do turn:', tile, join);

  this.selectedTile = null;
  this.selectedJoins = null;

  this.selectJoin(null);
  this.selectConnectTile(null);

  for(var i = 0; i < this.avaiableTiles.length; i++)
  {
    var avaiableTile = this.avaiableTiles[i].tile;

    avaiableTile.removeListener('pointerdown', this.onTilePointerDown, this);
    avaiableTile.removeListener('pointerup', this.onTilePointerUp, this);
    avaiableTile.removeListener('pointerupoutside', this.onTilePointerUp, this);

    avaiableTile.interactive = false;
  }

  for(var i = 0; i < this.uslessTiles.length; i++)
  {
    var uslessTile = this.uslessTiles[i];
    TweenMax.to(uslessTile, 10/30, { pixi: { colorize: '#1A2B4A', colorizeAmount: 0.0 }, delay: 12/30 });

    // console.log(uslessTile);
  }
  // console.log('U:L', this.uslessTiles);

  this.avaiableTiles = [];
  this.uslessTiles = [];

  this.gPlayer.doTurn(tile.gTile, join);
}

PanelPlayerHuman.prototype.onTilePointerDown = function(data)
{
  // console.log('Tile selected:', data, this);
  app.mouse = data.data.global;
  // console.log(app.mouse);
  this.preselectTile = data.target;
  this.preselectPosition = new PIXI.Point(app.mouse.x, app.mouse.y);

  // console.log(this.preselectPosition);

  // this.selectTile(data.target);
}
PanelPlayerHuman.prototype.onTilePointerUp = function(data)
{
  if(this.preselectTile != null && this.selectedTile == null && this.selectPhase == 'none')
  {
    this.selectTile(this.preselectTile, 'click');

    this.preselectTile = null;
    this.preselectPosition = null;

    // app.playAudio('sounds', 'sound_click');
  }
  else if(this.selectPhase == 'click' && this.selectedTile != this.preselectTile && this.preselectTile != null)
  {
    this.deselectTile();
    this.selectTile(this.preselectTile, 'click');

    this.preselectTile = null;
    this.preselectPosition = null;

    // app.playAudio('sounds', 'sound_click');
  }
  else if(this.selectPhase == 'click' && this.selectedTile == this.preselectTile && this.preselectTile != null)
  {
    this.deselectTile();

    this.preselectTile = null;
    this.preselectPosition = null;

    // app.playAudio('sounds', 'sound_click');
  }
  else if(this.selectPhase == 'move') 
  {
    this.deselectTile();

    this.preselectTile = null;
    this.preselectPosition = null;
  }
}
PanelPlayerHuman.prototype.onConnectTilePointerDown = function(data)
{
  if(this.selectPhase != 'click') return;

  app.mouse = data.data.global;

  this.selectClickTile(data.target);
}

PanelPlayerHuman.prototype.onConnectTileMouseOver = function(data)
{
  if(this.selectPhase != 'click') return;

  app.mouse = data.data.global;

  var connectTile = data.target;
  // connectTile.tween({name: 'show_selection_outline', side: 'full', type: 'hard'});

  // console.log('CCCCCCCC:', connectTile);
}
PanelPlayerHuman.prototype.onConnectTileMouseOut = function(data, connectTile)
{
  if(this.selectPhase != 'click') return;

  app.mouse = data.data.global;

  // connectTile.tween({name: 'hide_selection_outline', type: 'hard'});
}

PanelPlayerHuman.prototype.onFirstTilePointerDown = function(data)
{
  if(this.selectPhase != 'click') return;

  // console.log('Tile selected:', data, this);
  app.mouse = data.data.global;

  this.selectClickTile(null)
}

PanelPlayerHuman.prototype.onTilePlaceSelected = function(join)
{
  if(this.selectPhase != 'click') return;


  this.selectClickTile(app.screenGame.findTilePanel(join.connectTile), join);
}

PanelPlayerHuman.prototype.selectClickTile = function(connectTile, join)
{
  if(this.selectPhase != 'click') return;

  this.selectedConnectTile = connectTile;

  if(join == undefined)
  {
  if(this.selectedConnectTile != null)
  {
    for(var i = 0; i < this.selectedJoins.length; i++)
    {
      var join = this.selectedJoins[i];
      if(join.connectTile.id == this.selectedConnectTile.id)
      {
        this.selectedJoin = join;
        break;
      }
    }
  }
  else this.selectedJoin = this.selectedJoins[0];
  }
  else this.selectedJoin = join;

  // console.log(this.selectedConnectTile, this.selectedJoin);
  this.deselectTile();
}

PanelPlayerHuman.prototype.selectTile = function(tile, selectType)
{
  if(this.selectedTile != null) return;

  var self = this;

  // console.log('SelectTile:', tile, selectType);
  this.preselectTile = null;
  
  this.selectedTile = tile;

  this.selectedJoins = null;
  for(var i =0 ; i < this.avaiableTiles.length; i++)
  {
    if(this.avaiableTiles[i].tile == this.selectedTile)
    {
      this.selectedJoins = this.avaiableTiles[i].joins;
      break;
    }
  }

  var avaiableConnectTiles = [];
  for(var i = 0; i < this.selectedJoins.length; i++)
  {
    var join = this.selectedJoins[i];
    if(join.connectTile != null && avaiableConnectTiles.indexOf(join.connectTile) == -1) avaiableConnectTiles.push(join.connectTile);
  }

  if(avaiableConnectTiles.length > 0) app.screenGame.panelBoard.tween({name: 'show_light_avaiable_tiles', tiles: avaiableConnectTiles});

  if(selectType == 'move') app.screenGame.panelBoard.showTilePlaces(this.selectedJoins);
  else if(selectType == 'click') app.screenGame.panelBoard.showTilePlaces(this.selectedJoins, this.onTilePlaceSelected);

  this.avaiableConnectTiles = avaiableConnectTiles;

  if(selectType == 'move')
  {
    var p = this.selectedTile.parent.toLocal(app.mouse);
    this.selectedTile.x = p.x;
    this.selectedTile.y = p.y;
  }
  else if(selectType == 'click')
  {
    for(var i = 0; i < avaiableConnectTiles.length; i++)
    {
      var connectTile = app.screenGame.findTilePanel(avaiableConnectTiles[i]);
      // connectTile.tween({name: 'show_selection_outline', side: 'full'});


      connectTile.interactive = true;
      connectTile.addListener('pointerdown', this.onConnectTilePointerDown, this);

      connectTile.addListener('mouseover', this.onConnectTileMouseOver, this);
      addMouseOutEvent(connectTile);
        // tile.addListener('pointerup', this.onTilePointerUp, this);
        // tile.addListener('pointerupoutside', this.onTilePointerUp, this);
    }

    if(avaiableConnectTiles.length == 0)
    {
      // app.screenGame.panelBoard.tween({name: 'show_first_tile_light', orientation: this.selectedJoins[0].position.orientation});
      // app.screenGame.panelBoard.firstTileLight.interactive = true;
      // app.screenGame.panelBoard.firstTileLight.addListener('pointerdown', this.onFirstTilePointerDown, this);
    }

    TweenMax.to(this.selectedTile, 10/30, { y: -50, ease: Power1.easeOut});
  }

  this.selectPhase = selectType;

  function addMouseOutEvent(connectTile)
  {
    connectTile.addListener('mouseout', function(data)
    {
      self.onConnectTileMouseOut(data, connectTile);
    }, self);
  }

  // console.log(avaiableConnectTiles);  
}
PanelPlayerHuman.prototype.deselectTile = function()
{
  if(this.selectedTile == null) return;

  // console.log('DeselectTile:', this.selectPhase);
  var isTurn = !(this.selectedConnectTile == null && this.selectedJoin == null);
  // console.log('IsTurn', isTurn, isTurn?'hard':'normal')
  if(this.selectPhase == 'click')
  {
    for(var i = 0; i < this.avaiableConnectTiles.length; i++)
    {
      var connectTile = app.screenGame.findTilePanel(this.avaiableConnectTiles[i]);
      connectTile.removeAllListeners();
      connectTile.interactive = false;

      connectTile.tween({name: 'hide_selection_outline', type: isTurn?'hard':'normal'});
    }

    if(this.avaiableConnectTiles.length == 0)
    {
      // app.screenGame.panelBoard.tween({name: 'hide_first_tile_light', type: isTurn?'hard':'normal'});
      // app.screenGame.panelBoard.firstTileLight.interactive = false;
      // app.screenGame.panelBoard.firstTileLight.removeAllListeners();
    }
  }

  app.screenGame.panelBoard.hideTilePlaces();
  
  if(this.selectedConnectTile == null && this.selectedJoin == null)
  {
    TweenMax.to(this.selectedTile, 10/30, { x: 0, y: 0, directionalRotation: { angle: '0_short'}, ease: Power2.easeOut });

    this.selectedTile = null;
    
    this.selectJoin(null);

    app.screenGame.panelBoard.tween({name: 'hide_light_avaiable_tiles'});
  }
  else
  {
    for(var i = 0; i < this.avaiableConnectTiles.length; i++)
    {
      var connectTile = app.screenGame.findTilePanel(this.avaiableConnectTiles[i]);
      connectTile.removeAllListeners();
      connectTile.interactive = false;

      connectTile.tween({name: 'hide_selection_outline', type: isTurn?'hard':'normal'});
    }

    app.screenGame.panelBoard.tween({name: 'hide_light_avaiable_tiles'});
    this.doNormalTurn(this.selectedTile, this.selectedJoin);
  }  

  // app.screenGame.panelBoard.tween({name: 'hide_light_avaiable_tiles'});

  this.selectPhase = 'none';
}

PanelPlayerHuman.prototype.selectConnectTile = function(tile)
{
  if(this.selectedConnectTile == tile) return;

  this.deselectConnectTile();

  if(this.selectedConnectTile == tile) return;
  
  this.selectedConnectTile = tile;
}
PanelPlayerHuman.prototype.deselectConnectTile = function()
{
  if(this.selectedConnectTile != null)
  {
    this.selectJoin(null);

    // this.selectedConnectTile.tween({name: 'hide_selection_outline'});
    this.selectedConnectTile = null;

    // if(this.selectedTile != null) TweenMax.to(this.selectedTile, 8/30, {directionalRotation: { angle: '0_short'}, ease: Power2.easeOut});

    
  }
}

PanelPlayerHuman.prototype.autoselectJoin = function()
{
  var joins = [];
  for(var i = 0; i < this.selectedJoins.length; i++)
  {
    var join = this.selectedJoins[i];
    if(join.connectTile.id == this.selectedConnectTile.id) joins.push(join);
  }

  var join = null;
  if(joins.length == 1) join = joins[0];
  else
  {
    var minDistance;

    for(var i = 0; i < joins.length; i++)
    {
      var checkJoin = joins[i];
      var connectTile = app.screenGame.findTilePanel(checkJoin.connectTile);

      var p = connectTile.parent.toLocal(this.selectedTile.parent.toGlobal(new PIXI.Point(this.selectedTile.x, this.selectedTile.y)));
      var distance = Util.distance(checkJoin.position.x, checkJoin.position.y, p.x, p.y);
      if(join == null || distance < minDistance)
      {
        join = checkJoin;
        minDistance = distance;
      }
    }
  }

  this.selectJoin(join);
}

PanelPlayerHuman.prototype.selectJoin = function(join)
{
  if(this.selectedJoin == join) return;

  this.selectedJoin = join;

  if(this.selectedJoin == null)
  {
    // if(this.selectedConnectTile != null) this.selectedConnectTile.tween({name: 'hide_selection_outline'});
    // else app.screenGame.panelBoard.tween({name: 'hide_first_tile_light'});

    if(this.selectedTile != null) TweenMax.to(this.selectedTile, 8/30, {directionalRotation: { angle: '0_short'}, ease: Power2.easeOut});

    return;
  }

  var angle = PanelTile.getOrientationRotation(this.selectedJoin.position) * Util.TO_DEGREES;
  TweenMax.to(this.selectedTile, 8/30, {directionalRotation: { angle: angle+'_short'}, ease: Power2.easeOut});

  if(this.selectedConnectTile != null)
  {
    // this.selectedConnectTile.tween({name: 'show_selection_outline', side: this.selectedJoin.connectSide});
  }
  else 
  {
    // console.log(this.selectedJoin);
    // app.screenGame.panelBoard.tween({name: 'show_first_tile_light', orientation: this.selectedJoin.position.orientation});
  }
}

PanelPlayerHuman.prototype.update = function()
{
  var self = this;

  var selectDistance = 400;

  if(this.preselectTile != null && this.selectPhase != 'move')
  {
    var distance = Util.distance(this.preselectPosition.x, this.preselectPosition.y, app.mouse.x, app.mouse.y);
    if(distance > 5)
    {
      if(this.selectPhase != 'none') this.deselectTile();
      this.selectTile(this.preselectTile, 'move');
    }
  }

  if(this.selectedTile != null && this.selectPhase == 'move')
  {
    var p = this.selectedTile.parent.toLocal(app.mouse);
    this.selectedTile.x = p.x;
    this.selectedTile.y = p.y;

    // var 
    // console.log()

    if(this.selectedConnectTile == null)
    {
      for(var i = 0; i < this.selectedJoins.length; i++)
      {
        var join = this.selectedJoins[i];
        if(join.connectTile != null)
        {
          var connectTile = app.screenGame.findTilePanel(join.connectTile);

          if(getDistanceToConnectTile(connectTile) <= selectDistance) this.selectConnectTile(connectTile);
        }
        else
        {
          var p = new PIXI.Point(this.selectedTile.x, this.selectedTile.y);
          p = this.selectedTile.parent.toGlobal(p);
          p = app.screenGame.panelBoard.containerTiles.toLocal(p);

          var distance = Util.distance(0, 0, p.x, p.y);
          if(distance > selectDistance)
          {
            this.selectJoin(null);
          }
          else 
          {
            this.selectJoin(join);
          }

          break;
        }
      }
    }

    if(this.selectedConnectTile != null)
    {
      if(getDistanceToConnectTile(this.selectedConnectTile) > selectDistance) this.selectConnectTile(null);
      else 
      {
        this.autoselectJoin();

        // var angle = PanelTile.getOrientationRotation(this.selectedJoin.position) * Util.TO_DEGREES;
        // TweenMax.to(this.selected)
      }
    }

    // if(this.selectedConnectTile != null && getDistanceToConnectTile(this.selectedConnectTile) > selectDistance) this.selectConnectTile(null);
  }

  function getDistanceToConnectTile(tile)
  {
    // console.log(tile, self.selectedTile);
    var p = tile.parent.toLocal(self.selectedTile.parent.toGlobal(new PIXI.Point(self.selectedTile.x, self.selectedTile.y)));
    return Util.distance(p.x, p.y, tile.x, tile.y);
  }

  // console.log(this.selectedTile);
}

// PanelPlayer.prototype.initStartTiles = function(tiles)
// {
//     var startTiles = [];

//     for(var i = 0; i < tiles.length; i++)
//     {
//       var tile = app.screenGame.findTilePanel(tiles[i]);
//       startTiles.push(tile);
//     }

//     console.log('startTiles', startTiles);

//     this.tilesContainer.addStartTiles({tiles: startTiles});
// }
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelBoard = function(config)
{
  Gui.BasePanel.call(this, config);


  // this.player = null;

  // this.type = config.info.type;
  // this.side = config.info.side;

  this.containerTiles = new PIXI.Container();
  this.addChild(this.containerTiles);

  this.firstTileLight = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Theme1/board_first_tile_light.png'));
  this.containerTiles.addChild(this.firstTileLight);
  this.firstTileLight.anchor.set(0.5, 0.5);
  this.firstTileLight.alpha = 0;
  // this.showViewRect();

  this.maxScale = 0.6;

  this.containerTiles.scale.x = this.containerTiles.scale.y = this.maxScale;

  this.tiles = [];
  // this.tilesContainers = [];

  this.maxWidth = 10;
  this.maxHeight = 10;

  this.boardOrientation = 'horizontal';

  this.tileTurnPlaces = [];
  for(var i = 0; i < 8; i++)
  {
    var tileTurnPlace = new TileTurnPlace();
    this.containerTiles.addChild(tileTurnPlace);
    tileTurnPlace.visible = false;

    this.tileTurnPlaces.push(tileTurnPlace);
  }

  this.screenGame = this.parentPanel;

  this.screenGame.dominoesGame.on('board_updated', this.onBoardUpdated, this);

  guiManager.on('game_resize', this.onResize, this);
}
PanelBoard.prototype = Object.create(Gui.BasePanel.prototype);
PanelBoard.prototype.constructor = PanelBoard;

PanelBoard.prototype.onResize = function(data)
{
  // if(guiManager.rootScene.width >= guiManager.rootScene.height)
  // {
  //   this.boardOrientation = 'horizontal';
  //   this.containerTiles.rotation = 0 * Util.TO_RADIANS;
  // }
  // else
  // {
  //   this.boardOrientation = 'vertical';
  //   this.containerTiles.rotation = -90 * Util.TO_RADIANS;
  // }

  // var positionsInfo = this.getPositionsInfo();
  // this.containerTiles.scale.x = this.containerTiles.scale.y = positionsInfo.containerScale;
  // this.containerTiles.x = positionsInfo.containerX;
  // this.containerTiles.y = positionsInfo.containerY;

  // if(guiManager.orientation == 'landscape') app.screenGame.dominoesGame.setBoardSize(this.width, this.height, true);
}

PanelBoard.prototype.onBoardUpdated = function(data)
{
  // var tilesScale = data.tilesScale;
  var isTilesMove = false;

  for(var i = 0; i < this.tiles.length; i++)
  {
    var tile = this.tiles[i];
    // var tileContainer = this.tilesContainers[i];
    var position = tile.gTile.position;
    var angle = PanelTile.getOrientationRotation(position) * Util.TO_DEGREES;
    
    if(tile.x != position.x || tile.y != position.y || tile.angle != angle)
    {
      // if(tile.angle != angle)
      // {        
      //   console.log('xxx');
      //   TweenMax.to(tile, 10/30, {directionalRotation: { angle: angle+'_short'}, ease: Power1.easeOut});
      // }
      TweenMax.to(tile, 12/30, { x: position.x, y: position.y, directionalRotation: { angle: angle+'_short'}, ease: Power1.easeOut});
      
      isTilesMove = true;
    }
    // console.log(tile);
  }

  if(isTilesMove) 
  {
    this.sortTiles();
  }

  // console.log(data.boardScale);

  var boardScale = 1 / data.boardScale;
  if(this.containerTiles.scale.x != boardScale)
  {
    // TweenMax.to(this.scale, 12/30, { x: boardScale, y: boardScale, ease: Power1.easeOut });
    TweenMax.to(this.containerTiles.scale, 12/30, { x: boardScale, y: boardScale, ease: Power1.easeOut });
  }

  // console.log('CCCCCCCCCCCCCC', this.containerTiles.scale.x);
}

PanelBoard.prototype.load = function(tiles)
{
  this.tiles = [];
  for(var i = 0; i < tiles.length; i++)
  {
    this.addTile({tile: tiles[i], addType: 'hard'});
  }

  this.containerTiles.scale.x = this.containerTiles.scale.y = 1 / app.screenGame.dominoesGame.boardScale;

  this.sortTiles();
}

PanelBoard.prototype.clear = function()
{
  for(var i = 0; i < this.tiles.length; i++) this.containerTiles.removeChild(this.tiles[i]);
  this.tiles = [];

  // for(var i = 0; i < this.tilesContainers.length; i++) this.tilesContainers[i].destroy();
  // this.tilesContainers = [];

  // this.containerTiles.scale.x = this.containerTiles.scale.y = this.maxScale;
  // this.containerTiles.x = this.containerTiles.y = 0;

  this.firstTileLight.alpha = 0;
  this.firstTileLight.interactive = false;
  this.firstTileLight.removeAllListeners();

  for(var i = 0; i < this.tileTurnPlaces.length; i++)
  {
    var turnPlace = this.tileTurnPlaces[i];
    turnPlace.clear();
  }

  // console.log(this.containerTiles.children)
}

PanelBoard.prototype.initGame = function()
{
  app.screenGame.dominoesGame.setBoardSize(this.width, this.height);
}

PanelBoard.prototype.addTile = function(data, callback)
{
  var self = this;

  var tile = data.tile;
  this.tiles.push(tile);

  var addType = data.addType;
  if(addType == undefined) addType = 'normal';

  var player = data.player;
  // console.log(player);
  // var tileContainer = this.createTileContainer();

  // console.log('PanelBoard AddTile:', data.turnInfo);

  // var joinInfo = data.turnInfo.turn.joinInfo;
  var joinInfo = tile.gTile.joinInfo;

  // tileContainer.x = joinInfo.position.x;
  // tileContainer.y = joinInfo.position.y;

  // var rotation = PanelTile.getOrientationRotation(joinInfo.position);
  // tileContainer.rotation = rotation;
  // console.log('Board: add tile:', joinInfo);

  // tile.translateTo(tileContainer);
  tile.translateTo(this.containerTiles);

  // tile.angle = Util.normalizeAngleDeg(tile.angle-90);

  if(addType == 'normal')
  {
    TweenMax.delayedCall(2/30, function()
    {
      tile.tween({name: 'show_front'});
    });
    tile.tween({name: 'hide_split_border'});

    // TweenMax.to(tileContainer, 12/30, {directionalRotation: { rotation: rotation+'_short', useRadians: true}, ease: Power1.easeInOut});

    TweenMax.to(tile.scale, 12/30, {x: 1, y: 1, ease: Power1.easeInOut});
    // TweenMax.to(tile, 12/30, {x: joinInfo.position.x, y: joinInfo.position.y, directionalRotation: { angle: angle+'_short'}, ease: Power1.easeInOut});

    TweenMax.delayedCall(14/30, function()
    {
      // self.tween({name: 'update_positions'});

      if(callback) callback();
    });

    app.screenGame.dominoesGame.updateBoard();

    this.sortTiles();

    if(player.gPlayer.name == 'human')
    {
      app.playAudio('sounds', 'sound_tile_placed');
    }
    else
    {
      TweenMax.delayedCall(12/30, function()
      {
        app.playAudio('sounds', 'sound_tile_placed');
      });
    }
  }
  else if(addType == 'hard')
  {
    tile.containerFront.alpha = 1;
    tile.splitBorder.alpha = 0;

    tile.scale.x = tile.scale.y = 1.0;

    var angle = PanelTile.getOrientationRotation(joinInfo.position) * Util.TO_DEGREES;
    tile.angle = angle;
    tile.x = joinInfo.position.x;
    tile.y = joinInfo.position.y;

    tile.visible = true;

    if(callback) callback();
  }

  // console.log(tile.gTile.position);

}

// PanelBoard.prototype.createTileContainer = function()
// {
//   var container = new PIXI.Container();
//   this.containerTiles.addChild(container);

//   this.tilesContainers.push(container);

//   return container;
// }

PanelBoard.prototype.sortTiles = function()
{
  this.containerTiles.children.sort(function (t1, t2)
  {
    if(t1.gTile != null && t2.gTile != null)
    {
      return t1.gTile.position.y - t2.gTile.position.y;
    }
    // console.log(t1);
    // return t1.y - t2.y;
    return -1;
  });
}

PanelBoard.prototype.getPositionsInfo = function()
{
  var positionsInfo = {};

  this.maxWidth = guiManager.rootScene.width - 400;
  this.maxHeight = guiManager.rootScene.height - 400;

  // var bounds = this.containerTiles.getLocalBounds();

  // var scale = Math.min(this.maxWidth / bounds.width, this.maxHeight / bounds.height);
  // if(scale > this.maxScale) scale = this.maxScale;

  var scale = 1.0;

  positionsInfo.containerScale = scale;
  positionsInfo.containerX = 0;
  positionsInfo.containerY = 0;
  // positionsInfo.containerX = -bounds.x*positionsInfo.containerScale - bounds.width*positionsInfo.containerScale/2;
  // positionsInfo.containerY = -bounds.y*positionsInfo.containerScale - bounds.height*positionsInfo.containerScale/2;
  // positionsInfo.containerBounds = bounds;

  return positionsInfo;
}

PanelBoard.prototype.showTilePlaces = function(joins, clickCallback)
{
  var self = this;

  // console.log('show tile places:', joins);
  for(var i = 0; i < joins.length; i++)
  {
    var join = joins[i];
    var tilePlace = getFreeTilePlace();
    if(tilePlace != null) tilePlace.showJoin(join, clickCallback);
  }

  function getFreeTilePlace()
  {
    for(var i = 0; i < self.tileTurnPlaces.length; i++)
    {
      var tilePlace = self.tileTurnPlaces[i];
      if(tilePlace.state == 'wait') return tilePlace;
    }

    return null;
  }
}
PanelBoard.prototype.hideTilePlaces = function()
{
  var self = this;

  for(var i = 0; i < this.tileTurnPlaces.length; i++)
  {
    var turnPlace = this.tileTurnPlaces[i];
    if(turnPlace.state == 'show') turnPlace.clear();
  }
}

PanelBoard.prototype.tween = function(data, callback)
{
  // if(data.name == 'update_positions')
  // {
  //   var positionsInfo = this.getPositionsInfo();

  //   TweenMax.to(this.containerTiles.scale, 10/30, {x: positionsInfo.containerScale, y: positionsInfo.containerScale, ease: Power1.easeInOut});
  //   TweenMax.to(this.containerTiles, 10/30, {x: positionsInfo.containerX, y: positionsInfo.containerY, ease: Power1.easeInOut});
  // }

  if(data.name == 'show_first_tile_light')
  {
    var orientation = data.orientation;
    if(orientation == 'horizontal')
    {
      this.firstTileLight.rotation = 90 * Util.TO_RADIANS;
    }
    else if(orientation == 'vertical')
    {
      this.firstTileLight.rotation = 0;
    }

    this.firstTileLight.alpha = 0;
    this.firstTileLight.scale.x = this.firstTileLight.scale.y = 1.2;

    TweenMax.to(this.firstTileLight.scale, 8/30, { x: 1, y: 1, ease: Power1.easeIn });
    TweenMax.to(this.firstTileLight, 8/30, { alpha: 1, ease: Power1.easeIn, onComplete: function()
    {
      if(callback) callback();
    }});
  }  
  if(data.name == 'hide_first_tile_light')
  {
    var type = data.type;
    if(data.type == undefined) data.type = 'normal';

    if(type == 'normal')
    {
      TweenMax.to(this.firstTileLight.scale, 8/30, { x: 1.2, y: 1.2, ease: Power1.easeIn });
      TweenMax.to(this.firstTileLight, 8/30, { alpha: 0, ease: Power1.easeIn, onComplete: function()
      {
        if(callback) callback();
      }});
    }
    else
    {
      this.firstTileLight.alpha = 0;
      if(callback) callback();
    }
  }

  if(data.name == 'show_light_avaiable_tiles')
  {
    var tilesToHide = [];

    for(var i = 0; i < this.tiles.length; i++)
    {
      var tile = this.tiles[i];

      var isA = false;
      for(var j = 0; j < data.tiles.length; j++)
      {
        var avaiableGTile = data.tiles[j];
        if(tile.id == avaiableGTile.id)
        {
          isA = true;
          break;
        }
      }

      if(!isA) tilesToHide.push(tile);
    }

    for(var i = 0; i < tilesToHide.length; i++)
    {
      var tile = tilesToHide[i];

      TweenMax.to(tile, 10/30, { pixi: { colorize: '#1A2B4A', colorizeAmount: 0.35 }, ease: Power1.easeInOut});
    }

    // console.log('TilesToHide:', tilesToHide);
  }

  if(data.name == 'hide_light_avaiable_tiles')
  {
    for(var i = 0; i < this.tiles.length; i++)
    {
      var tile = this.tiles[i];

      TweenMax.to(tile, 10/30, { pixi: { colorize: '#FFFFFF', colorizeAmount: 0.0 }, ease: Power1.easeInOut});
    }
  }

  if(data.name == 'hide_anim')
  {
    TweenMax.to(this.containerTiles, 12/30, { alpha: 0, ease: Power1.easeOut, onComplete: function()
    {
      if(callback) callback();
    }});
  }

  if(data.name == 'show')
  {
    this.visible = true;
    this.alpha = 1;
    this.containerTiles.alpha = 1;
    this.interactiveChildren = true;

    if(callback) callback();
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var TileTurnPlace = function(config)
{
  PIXI.Container.call(this);


  var self = this;

  this.state = 'wait';

  this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'tile_turn_place.png'));
  this.addChild(this.bg);
  this.bg.anchor.set(0.5, 0.5);

  this.join = null;
  this.visible = false;
  // this.setNumber(6);
}
TileTurnPlace.prototype = Object.create(PIXI.Container.prototype);
TileTurnPlace.prototype.constructor = TileTurnPlace;

TileTurnPlace.prototype.clear = function()
{
  this.state = 'wait';
  this.join = null;
  this.visible = false;

  this.bg.interactive = false;
  this.bg.removeAllListeners();
}

TileTurnPlace.prototype.onTileClick = function()
{
  if(this.state != 'show' || this.clickCallback == null) return;

  this.clickCallback.call(app.screenGame.panelPlayerHuman, this.join);
  // this.clickCallback(this.join);
}

TileTurnPlace.prototype.showJoin = function(join, clickCallback)
{
  this.state = 'show';

  this.join = join;
  this.clickCallback = clickCallback;

  this.visible = true;
  this.x = join.position.x;
  this.y = join.position.y;
  this.rotation = PanelTile.getOrientationRotation(join.position);

  if(this.clickCallback != null)
  {
    this.bg.interactive = true;
    this.bg.addListener('pointerup', this.onTileClick, this);
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelBazaar = function(config)
{
  config.width = 825;
  config.height = 335;
  config.positionType = 'center-bot';
  Gui.BasePanel.call(this, config);


  this.state = 'hide';

  this.tiles = [];

  this.containerTiles = new PIXI.Container();
  this.addChild(this.containerTiles);

  this.containerBg = new PIXI.Container();
  this.containerTiles.addChild(this.containerBg);
  // this.containerBg.visible = false;
  // this.add(this.containerBg);


  this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_bazaar_bg_corner.png');
  this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_bazaar_bg_body.png');

  this.bgCornerLeft = new PIXI.Sprite(this.bgCornerTexture);
  this.containerBg.addChild(this.bgCornerLeft);
  this.bgCornerLeft.anchor.set(1, 0.5);

  this.bgCornerRight = new PIXI.Sprite(this.bgCornerTexture);
  this.containerBg.addChild(this.bgCornerRight);
  this.bgCornerRight.anchor.set(1, 0.5);
  this.bgCornerRight.scale.x = -1;

  this.bgBody = new PIXI.Sprite(this.bgBodyTexture);
  this.containerBg.addChild(this.bgBody);
  this.bgBody.anchor.set(0.5, 0.5);

  // this.bgCornerLeft.height = this.bgCornerRight.height = this.bgBody.height = 100;
  
  this.tilesPositions = [];
  var totalWidth = 28 * (PanelTile.WIDTH + 8) - 8;
  var posX = -totalWidth/2+PanelTile.WIDTH/2;
  var shiftX = PanelTile.WIDTH + 8;  
  for(var i = 0; i < 28; i++)
  {
    var position = { x: posX, y: 0 };
    this.tilesPositions.push(position);

    posX += shiftX;
  }

  this.tilesBgs = [];
  for(var i = 0; i < 28; i++)
  {
    var tileBg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'tile_bg_bazaar_1.png'));
    this.containerBg.addChild(tileBg);
    tileBg.anchor.set(0.5, 0.5);
    // TweenMax.to(tileBg, 1/30, { pixi: { colorize: '#1A2B4A', colorizeAmount: 0.35 }});

    this.tilesBgs.push(tileBg);

    var position = this.tilesPositions[i];
    tileBg.x = position.x;
    tileBg.y = position.y;
  }

  // this.tilesContainer = new PanelTilesContainer({parentPanel: this, width: this.width-20, height: this.height, info: {type: 'bazaar'}});
  // this.tilesContainer.addChildAt(this.containerBg, 0);

  this.visible = false;
  this.alpha = 0;
  // this.showViewRect();
  // this.showY = 270;

  guiManager.on('game_resize', this.onResize, this);

  // app.on('board_style_setted', function(boardStyle)
  app.on('tiles_style_setted', function(boardStyle)
  {
    if(boardStyle == 'minimalistic')
    {
      this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_bazaar_bg_corner.png');
      this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme1/panel_bazaar_bg_body.png');
    }
    else if(boardStyle == 'realistic')
    {
      this.bgCornerTexture = assetsManager.getTexture('texture_atlas', 'Theme2/panel_bazaar_bg_corner.png');
      this.bgBodyTexture = assetsManager.getTexture('texture_atlas', 'Theme2/panel_bazaar_bg_body.png');
    }

    this.bgCornerLeft.texture = this.bgCornerTexture;
    this.bgCornerRight.texture = this.bgCornerTexture;
    this.bgBody.texture = this.bgBodyTexture;

    this.updateContainerSize();
  }, this);

  app.on('tiles_style_setted', function(tilesStyle)
  {
    if(tilesStyle == 'minimalistic')
    {
      var tileBgTexture = assetsManager.getTexture('texture_atlas', 'tile_bg_bazaar_1.png');
      for(var i = 0; i < this.tilesBgs.length; i++)
      {
        this.tilesBgs[i].texture = tileBgTexture;
      }
    }
    else if(tilesStyle == 'realistic')
    {
      var tileBgTexture = assetsManager.getTexture('texture_atlas', 'tile_bg_bazaar_2.png');
      for(var i = 0; i < this.tilesBgs.length; i++)
      {
        this.tilesBgs[i].texture = tileBgTexture;
      }
    }

    this.updateContainerSize();
  }, this);
}
PanelBazaar.prototype = Object.create(Gui.BasePanel.prototype);
PanelBazaar.prototype.constructor = PanelBazaar;

PanelBazaar.prototype.updateContainerSize = function()
{
  var bodyWidth = 28*(PanelTile.WIDTH+8)-8;

  // console.log(app.gameData.boardStyle, app.gameData.tilesStyle);

  if(app.gameData.tilesStyle == 'realistic') bodyWidth -= 200;

  // this.bgBody.width = this.width - (this.bgCornerRight.width+this.bgCornerLeft.width);
  this.bgBody.width = bodyWidth;
  this.bgCornerLeft.x = -this.bgBody.width/2;
  this.bgCornerRight.x = this.bgBody.width/2;

  var containerScale = this.width / (bodyWidth + this.bgCornerLeft.width*2);
  if(containerScale > 0.42) containerScale = 0.42;

  this.containerTiles.scale.x = this.containerTiles.scale.y = containerScale;

  // console.log(this.bgBody.height);

  // console.log(this.tilesContainer.width);
}

PanelBazaar.prototype.onResize = function(data)
{
  this.width = data.width - 290;
  this.height = 218;
  // console.log(this, this.bgBody, this.bgCornerLeft, this.bgCornerRight);

  this.updateContainerSize();



  // var totalWidth = this.tilesContainer.tiles.length * (PanelTile.WIDTH + 8);

  // var scale = (this.width - 40) / totalWidth;
  // this.tilesContainer.scale.x = this.tilesContainer.scale.y = scale;

  // this.bgBody.height = this.bgCornerLeft.height = this.bgCornerRight.height = 100;
}

PanelBazaar.prototype.load = function(tiles)
{
  var avaiablePositions = Util.clone(this.tilesPositions);
  var positions = [];
  for(var i = 0; i < tiles.length; i++)
  {
    var n = Util.randomRangeInt(0, avaiablePositions.length-1);
    var position = avaiablePositions[n];
    positions.push(position);

    avaiablePositions.splice(n, 1);
  }

  this.tiles = [];
  for(var i = 0; i < tiles.length; i++)
  {
    var position = positions[i];

    var tile = tiles[i];
    tile.setTo({state: 'bazaar'});
    this.tiles.push(tile);

    this.containerTiles.addChild(tile);
    tile.scale.x = tile.scale.y = 1.0;
    tile.angle = 0;
    tile.x = position.x;
    tile.y = position.y;
    // console.log(tile.x);
  }
}

PanelBazaar.prototype.clear = function()
{
  // this.tilesContainer.clear();

  this.state = 'hide';
  this.alpha = 0;
  this.visible = false;

  while(this.tiles.length > 0) this.removeTile(this.tiles[0]);

}

PanelBazaar.prototype.initGame = function(tiles)
{
  for(var i = 0; i < tiles.length; i++)
  {
    var position = this.tilesPositions[i];

    var tile = tiles[i];
    tile.setTo({state: 'bazaar'});
    this.tiles.push(tile);

    this.containerTiles.addChild(tile);
    tile.scale.x = tile.scale.y = 1.0;
    tile.angle = 0;
    tile.x = position.x;
    tile.y = position.y;
    // console.log(tile.x);
  }

  // this.containerTiles.scale.x = this.containerTiles.scale.y = 0.35;

  // console.log('bazaar init:', totalWidth, posX, shiftX, tiles);

  // var totalWidth = tiles.length * (PanelTile.WIDTH + 8) - 8;

  // var scale = (this.width - 40) / totalWidth;
  // this.tilesContainer.scale.x = this.tilesContainer.scale.y = scale;

  // this.tilesContainer.addStartTiles({tiles: tiles});

  // for(var i = 0; i < this.tilesBgs.length; i++) this.tilesBgs[i].visible = false;

  // var containerScaleRotation = Util.getGlobalScaleAndRotation(this.containerBg);

  // for(var i = 0; i < this.tilesContainer.tiles.length; i++)
  // {
  //   var tile = this.tilesContainer.tiles[i];
  //   var p = tile.parent.toGlobal(new PIXI.Point(tile.x, tile.y));
  //   p = this.containerBg.toLocal(p);

  //   var globalScaleRotation = Util.getGlobalScaleAndRotation(tile);

  //   var tileBg = this.tilesBgs[i];
  //   tileBg.x = p.x;
  //   tileBg.y = p.y + 6;
  //   tileBg.visible = true;
  //   tileBg.scale.x = tileBg.scale.y = containerScaleRotation.scaleX/globalScaleRotation.scaleX; 
  //   tileBg.height += 20 * globalScaleRotation.scaleY;

    // var tile = this.tilesContainer.tiles[i];
    // var tileContainer = tile.parent;

    // var tileBg = this.tilesBgs[i];
    // tileBg.x = tileContainer.x;
    // tileBg.y = tileContainer.y;
    // tileBg.visible = true;
    // tileBg.scale.x = tileBg.scale.y = globalScaleRotation.scaleX;

    // console.log(tileBg, p);
  // }

  // this.updateContainerSize();
  // this.bgBody.height = this.bgCornerLeft.height = this.bgCornerRight.height = PanelTile.HEIGHT * this.tilesContainer.scale.x + 40;
  // this.height = this.bgBody.height;
}

PanelBazaar.prototype.removeTile = function(tile)
{
  var n = this.tiles.indexOf(tile);
  if(n == -1) return;

  this.containerTiles.removeChild(tile);
  this.tiles.splice(n, 1);
}

PanelBazaar.prototype.tween = function(data, callback)
{
  var self = this;

  if(data.name == 'show' && this.state == 'hide')
  {
    this.state = 'to_show';
    this.visible = true;

    var position = app.screenGame.getPanelBazaarShowPosition();

    // this.yRelative = position.y-50;
    this.yRelative = position.y;

    TweenMax.to(this, 12/30, {alpha: 1, ease: Power1.easeInOut, onComplete: function()
    // TweenMax.to(this, 12/30, {alpha: 1, yRelative: position.y, ease: Power1.easeInOut, onComplete: function()
    {
      self.state = 'show';

      if(callback) callback();
    }});
  }
  else if(data.name == 'show' && this.state == 'show') 
  {
    if(callback) callback();
  }

  if(data.name == 'hide' && this.state == 'show')
  {
    this.state = 'to_hide';

    // if(this.tilesContainer.tiles.length > 0)
    // {
      // this.tilesContainer.tween({name: 'update_positions'}, function()
      // {
        // hide();
      // });
    // }
    // else hide();
    hide();

    function hide()
    {
      // console.log(self.y);
      // TweenMax.to(self, 12/30, {alpha: 0, yRelative: self.yRelative-50, ease: Power1.easeInOut, delay: 2/30, onComplete: function()
      TweenMax.to(self, 12/30, {alpha: 0, ease: Power1.easeInOut, delay: 2/30, onComplete: function()
      {
        self.state = 'hide';

        self.visible = false;
        // console.log(self.y);
        // console.log('asdadasd');

        if(callback) callback();
      }});
    }

  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //
var PanelTilesContainer = function(config)
{
  Gui.BasePanel.call(this, config);


  this.type = config.info.type;

  this.tiles = [];
  this.tilesContainers = [];

  this.container = new PIXI.Container();
  this.addChild(this.container);

  // this.bg = new PIXI.Sprite(assetsManager.getTexture('texture_atlas', 'Util/rect_white.png'));
  // this.container.addChild(this.bg);
  // this.bg.anchor.set(0.5, 0.5);
  // this.b

  app.addForUpdate(this.update, this);

  // this.showViewRect();

  if(this.type == 'bazaar')
  {
    this.tilesShift = 8;

    // this.container.scale.x = this.container.scale.y = 0.28;
  }
  else if(this.type == 'ai')
  {
    this.maxShift = PanelTile.WIDTH*0.8;
    this.maxScale = 0.55;
    this.container.scale.x = this.container.scale.y = this.maxScale;

    this.minWidth = 300;

    this.width = this.minWidth;

    this.isHumanAlli = false;
    // this.container.x = -this.width/2;
  }
  else if(this.type == 'human')
  {
    this.tilesShift = 5;

    this.maxScale = 0.55;
    this.container.scale.x = this.container.scale.y = this.maxScale;

    this.minWidth = 100;
    this.maxWidth = 800;

    this.width = this.minWidth;
  }
}
PanelTilesContainer.prototype = Object.create(Gui.BasePanel.prototype);
PanelTilesContainer.prototype.constructor = PanelTilesContainer;

PanelTilesContainer.prototype.updateSize = function()
{ 
  Gui.BasePanel.prototype.updateSize.call(this);


  this.emit('size_update', {width: this.width, height: this.height});
}

PanelTilesContainer.prototype.removeTile = function(tile)
{
  var tileContainer = tile.parent;

  tile.translateTo(app.screenGame.containerPopups);
  // console.log(tile.parent);

  this.removeChild(tileContainer);

  var n = this.tilesContainers.indexOf(tileContainer);
  this.tilesContainers.splice(n, 1);

  n = this.tiles.indexOf(tile);
  this.tiles.splice(n, 1);

  tileContainer.destroy();
}

PanelTilesContainer.prototype.clear = function()
{
  this.tiles = [];
  for(var i = 0; i < this.tilesContainers.length; i++) this.tilesContainers[i].destroy();
  this.tilesContainers = [];

  if(this.type == 'ai')
  {
    this.container.scale.x = this.container.scale.y = this.maxScale;
    this.container.x = this.container.y = 0;

    this.width = this.minWidth;
    this.container.x = -this.width/2;

    this.isHumanAlli = false;
  }
  else if(this.type == 'human')
  {
    this.container.scale.x = this.container.scale.y = this.maxScale;
    this.container.x = this.container.y = 0;

    this.width = this.minWidth;
  }
}

PanelTilesContainer.prototype.addStartTiles = function(data, callback)
{
  var tiles = data.tiles;
  var addType = data.addType;
  if(addType == undefined) addType = 'normal';

  if(this.type == 'bazaar')
  {
    for(var i = 0; i < tiles.length; i++)
    {
      var tile = tiles[i];
      tile.setTo({state: 'bazaar'});
      this.tiles.push(tile);      

      var tileContainer = this.createTileContainer();
    }

    var positionsInfo = this.getPositionsInfo();
    for(var i = 0; i < positionsInfo.tiles.length; i++)
    {
      var position = positionsInfo.tiles[i];
      var tile = position.tile;
      var container = position.container;

      container.x = position.x;
      container.y = position.y;

      tile.scale.x = tile.scale.y = 1.0;
      // console.log(tile.scale);

      tile.translateTo(container);

      tile.x = 0;
      tile.y = 0;
      tile.angle = 0;   
      tile.scale.x = tile.scale.y = 1.0;   
    }

    var containerWidth = this.tiles.length * (PanelTile.WIDTH + this.tilesShift) - this.tilesShift;
    this.container.x = -(containerWidth*this.container.scale.x)/2;

    if(callback) callback();
  }

  if(this.type == 'ai')
  {
    this.width = this.minWidth;
    this.container.x = -this.width/2;

    for(var i = 0; i < tiles.length; i++)
    {
      var tile = tiles[i];
      tile.setTo({state: 'hand'});
      // if(addType == 'normal') app.screenGame.panelBazaar.removeTile(tile);
      this.tiles.push(tile);

      var tileContainer = this.createTileContainer();
    }

    var totalTime = 0;

    var positionsInfo = this.getPositionsInfo();

    if(positionsInfo.containerWidth != undefined)
    {
      this.container.x = -positionsInfo.containerWidth/2;
      // TweenMax.to(this.container, 12/30, { x: -positionsInfo.containerWidth/2, ease: Power1.easeInOut });
      TweenMax.to(this, 8/30, { width: positionsInfo.containerWidth, ease: Power1.easeInOut, onComplete: function()
      {

      }});
    }

    // var positionsInfo = this.getFillHandPosition();
    for(var i = 0; i < positionsInfo.tiles.length; i++)
    {
      var position = positionsInfo.tiles[i];
      var tile = position.tile;
      var container = position.container;

      container.x = position.x;
      container.y = position.y;

      // console.log(position);

      tile.translateTo(container);
      // console.log(tile.x, tile.y, addType);

      if(tile.angle > 180) tile.angle -= 180;

      if(addType == 'normal')
      {
        var time = 12/30;
        var delay = 3*i/30;

        totalTime = (time + delay) > totalTime?time+delay:totalTime;

        TweenMax.to(tile.scale, time, {x: 1, y: 1, delay: delay, ease: Power1.easeInOut});
        TweenMax.to(tile, time, { directionalRotation: { angle: '0_short'}, x: 0, y: 0, delay: delay, ease: Power1.easeInOut});
        // app.playAudio('sounds', 'sound_tile_draw', { delay: delay });
        if(i > 0) tile.tween({name: 'show_split_border', delay: delay + 5/30});

        if(app.isCheatShowHands) tile.tween({name: 'show_front', delay: delay});
      }
      else if(addType == 'hard')
      {
        tile.scale.x = tile.scale.y = 1.0;
        tile.angle = 0;
        tile.x = tile.y = 0;

        if(i > 0) tile.tween({name: 'show_split_border', delay: 0});
      }
    }

    for(var i = 0; i < tiles.length; i++)
    {
      if(addType == 'normal') app.screenGame.panelBazaar.removeTile(tile);
    }

    if(callback) TweenMax.delayedCall(totalTime, callback);
  } 

  if(this.type == 'human')
  {
    for(var i = 0; i < tiles.length; i++)
    {
      var tile = tiles[i];
      tile.setTo({state: 'hand'});
      // if(addType == 'normal') app.screenGame.panelBazaar.removeTile(tile);
      this.tiles.push(tile);

      var tileContainer = this.createTileContainer();
    }

    var positionsInfo = this.getPositionsInfo();

    var containerInfo = positionsInfo.containerInfo;
    this.container.x = containerInfo.x;
    this.container.scale.x = this.container.scale.y = containerInfo.scale;

    var totalTime = 0;

    for(var i = 0; i < positionsInfo.tiles.length; i++)
    {
      var position = positionsInfo.tiles[i];
      var tile = position.tile;
      var container = position.container;

      container.x = position.x;
      container.y = position.y;

      tile.translateTo(container);

      if(addType == 'normal')
      {
        var time = 12/30;
        var delay = 3*i/30;

        totalTime = (time + delay) > totalTime?time+delay:totalTime;

        TweenMax.to(tile.scale, time, {x: 1, y: 1, delay: delay, ease: Power1.easeInOut});
        TweenMax.to(tile, time, {x: 0, y: 0, directionalRotation: { angle: '0_short'}, delay: delay, ease: Power1.easeInOut});
        app.playAudio('sounds', 'sound_tile_draw', { delay: delay });
        tile.tween({name: 'show_front', delay: delay});
      }
      else if(addType == 'hard')
      {
        tile.scale.x = tile.scale.y = 1.0;
        tile.angle = 0;
        tile.x = tile.y = 0;

        tile.containerFront.alpha = 1;
      }
    }

    for(var i = 0; i < tiles.length; i++)
    {
      if(addType == 'normal') app.screenGame.panelBazaar.removeTile(tile);
    }

    this.tween({name: 'update_positions'});

    if(callback) TweenMax.delayedCall(totalTime, callback);
  } 

  // for(var i = 0; i < this.tiles.length; i++) this.tiles[i].updateShadow();
}

PanelTilesContainer.prototype.addTile = function(data, callback)
{
  var tile = data.tile;
  tile.setTo({state: 'hand'});
  this.tiles.push(tile);

  if(this.type == 'ai')
  {
    // tile.setTo({state: 'hand'});
    // app.screenGame.panelBazaar.tilesContainer.removeTile(tile);
    // this.tiles.push(tile);

    var tileContainer = this.createTileContainer();
    var n = this.tiles.indexOf(tile);

    // var positionsInfo = this.getPositionsInfo();
    // var position = positionsInfo.tiles[n];

    // tileContainer.x = position.x;
    // tileContainer.y = position.y;

    tile.translateTo(tileContainer);

    var time = 12/30;
    var delay = 0/30;

    TweenMax.to(tile.scale, time, {x: 1, y: 1, delay: delay, ease: Power1.easeInOut});
    TweenMax.to(tile, time, {x: 0, y: 0, directionalRotation: { angle: '0_short'}, delay: delay, ease: Power1.easeInOut});
    app.playAudio('sounds', 'sound_tile_draw');
    if(n > 0) tile.tween({name: 'show_split_border', delay: delay + 5/30});

    if(app.isCheatShowHands) tile.tween({name: 'show_front', delay: delay});

    this.tween({name: 'update_positions'});

    // TweenMax.to(this.container, 4/30, { x: -positionsInfo.containerWidth/2, ease: Power1.easeOut });
    // TweenMax.to(this, 4/30, { width: positionsInfo.containerWidth, ease: Power1.easeOut, onComplete: function()
    // {

    // }});

    if(callback) TweenMax.delayedCall(10/30, callback);
  } 

  if(this.type == 'human')
  {
    // tile.translateTo(this.container);

    var tileContainer = this.createTileContainer();

    var positionsInfo = this.getPositionsInfo();

    var translatesInfo = [];
    for(var i = 0; i < positionsInfo.tiles.length; i++)
    {
      var position = positionsInfo.tiles[i];
      var tile = position.tile;
      var container = position.container;

      var p = new PIXI.Point(container.x, container.y);
      p = this.container.toGlobal(p);
      var scale = container.scale.x * container.parent.scale.x;
      translatesInfo.push({tile: tile, container: container, p: p, scale: scale});
    }

    var containerInfo = positionsInfo.containerInfo;
    this.container.x = containerInfo.x;
    this.container.scale.x = this.container.scale.y = containerInfo.scale;

    for(var i = 0; i < positionsInfo.tiles.length; i++)
    {
      var position = positionsInfo.tiles[i];
      var tile = position.tile;
      var container = position.container;

      var p = translatesInfo[i].p;
      var scale = translatesInfo[i].scale;

      p = this.container.toLocal(p);
      scale = scale / this.container.scale.x;

      container.x = p.x;
      container.y = p.y;
      container.scale.x = container.scale.y = scale;
    }

    tileContainer.x = positionsInfo.tiles[positionsInfo.tiles.length-1].x;
    tileContainer.y = positionsInfo.tiles[positionsInfo.tiles.length-1].y;
    tileContainer.scale.x = tileContainer.scale.y = 1.0;
    tile.translateTo(tileContainer);

    var time = 10/30;

    TweenMax.to(tile.scale, time, {x: 1, y: 1, ease: Power1.easeInOut});
    TweenMax.to(tile, time, {x: 0, y: 0, directionalRotation: { angle: '0_short'}, ease: Power1.easeInOut});
    app.playAudio('sounds', 'sound_tile_draw');
    tile.tween({name: 'show_front', delay: 0/30});

    this.tween({name: 'update_positions'});

    if(callback) TweenMax.delayedCall(2/30, callback);
  }

  app.screenGame.panelBazaar.removeTile(tile);
}

PanelTilesContainer.prototype.revealHand = function()
{
  if(this.type == 'ai')
  {
    var positions = this.getRevealHandPositionsInfo();

    for(var i = 0; i < positions.tiles.length; i++)
    {
      var position = positions.tiles[i];

      var tile = position.tile;
      var container = position.container;

      TweenMax.to(container, 12/30, { x: position.x, y: position.y, ease: Power1.easeOut });

      if(i > 0) tile.tween({name: 'hide_split_border'});
      tile.tween({name: 'show_front', delay: 6/30});
    }

    TweenMax.to(this.container, 12/30, { x: -positions.containerWidth/2, ease: Power1.easeOut });
    TweenMax.to(this, 12/30, { width: positions.containerWidth, ease: Power1.easeOut, onComplete: function()
    {

    }});
  }
  else if(this.type == 'human')
  {
    TweenMax.to(this.container, 12/30, { y: -20, ease: Power1.easeOut });
  }

  // console.log("reveal hand!", positions);
}

PanelTilesContainer.prototype.fillTilesToPlayer = function(panelPlayer, callback)
{
  var self = this;
  // for(var i = 0; i < this.tiles.length; i++)
  // {
  //   var tile = tiles[i];
  //   app.screenGame.panelBazaar.tilesContainer.removeTile(tile);
  //   this.tiles.push(tile);

  //   var tileContainer = this.createTileContainer();
  // }

  var p = panelPlayer.getFillHandPosition();
  var fillPosition = panelPlayer.parent.toGlobal(new PIXI.Point(p.x, p.y));
  fillPosition = app.screenGame.containerOver.toLocal(fillPosition);

  var fillAngle = 0;
  if(panelPlayer.side == 'bot') fillAngle = 180;
  else if(panelPlayer.side == 'top') fillAngle = 180;
  else if(panelPlayer.side == 'left') fillAngle = 270;
  else if(panelPlayer.side == 'right') fillAngle = 270;

  var totalTime = 0;

  var i = 0;
  while(this.tiles.length > 0)
  {
    var tile = this.tiles[0];
    this.removeTile(tile);

    tile.translateTo(app.screenGame.containerOver);

    var delay = 3/30*i;

    TweenMax.to(tile.scale, 12/30, { x: tile.scale.x * 0.7, y: tile.scale.y * 0.7, ease: Power1.easeInOut, delay: delay });
    // TweenMax.to(tile, 4/30, { alpha: 0, ease: Power1.easeOut, delay: delay+8/30 });
    TweenMax.to(tile, 12/30, { alpha: 1, x: fillPosition.x, y: fillPosition.y, angle: fillAngle, ease: Power1.easeInOut, delay: delay });

    if(delay + 12/30 > totalTime) totalTime = delay + 12/30;

    i++;
  }

  TweenMax.delayedCall(totalTime, function()
  {
    if(self.type == 'ai')
    {
      var time = 12/30;
      TweenMax.to(self.container.scale, time, { x: self.maxScale, y: self.maxScale, ease: Power1.easeOut });
      TweenMax.to(self.container, time, { x: -self.minWidth/2, y: 0, ease: Power1.easeOut });
      TweenMax.to(self, time, { width: self.minWidth, ease: Power1.easeOut, onComplete: function()
      {
        if(callback != null) callback();
      }});
    }    
    else if(self.type == 'human')
    {
    // this.container.scale.x = this.container.scale.y = this.maxScale;
    // this.container.x = this.container.y = 0;

    // this.width = this.minWidth;

      var time = 12/30;
      TweenMax.to(self.container.scale, time, { x: self.maxScale, y: self.maxScale, ease: Power1.easeOut });
      TweenMax.to(self.container, time, { x: 0, y: 0, ease: Power1.easeOut });
      TweenMax.to(self, time, { width: self.minWidth, ease: Power1.easeOut, onComplete: function()
      {
        if(callback != null) callback();
      }});
    }
  });

  // console.log(this.tiles, this.tilesContainers);
}

PanelTilesContainer.prototype.hideHand = function()
{
  for(var i = 0; i < this.tiles.length; i++)
  {
    var tile = this.tiles[i];

    TweenMax.to(tile.scale, 12/30, { x: tile.scale.x * 0.9, y: tile.scale.y * 0.9, ease: Power1.easeOut });
    TweenMax.to(tile, 12/30, { alpha: 0, ease: Power1.easeOut });
    // TweenMax.to(tile, 12/30, { x: 0, y: tile.y + 80, ease: Power1.easeOut });
  }
}

PanelTilesContainer.prototype.createTileContainer = function()
{
  var tileContainer = new PIXI.Container();
  this.container.addChild(tileContainer);
  this.tilesContainers.push(tileContainer);

  var positions = this.getPositionsInfo();
  var position = positions.tiles[positions.tiles.length-1];
  tileContainer.x = position.x;
  tileContainer.y = position.y;
  tileContainer.angle = position.angle;

  // if(tile != null) tile.translateTo(tileContainer);

  return tileContainer;
}

PanelTilesContainer.prototype.update = function()
{

}

PanelTilesContainer.prototype.getPositionsInfo = function()
{
  var positionsInfo = { tiles: [] };

  // this.showViewRect();

  if(this.type == 'bazaar')
  {
    for(var i = 0; i < this.tiles.length; i++)
    {
      var tile = this.tiles[i];
      var container = this.tilesContainers[i];
      if(container == null) console.log('Container not exist!');

      positionsInfo.tiles.push({ tile: tile, container: container, x: PanelTile.WIDTH/2 + i*(PanelTile.WIDTH + this.tilesShift), y: 0, angle: 0 });
    }
  }
  else if(this.type == 'ai')
  {
    // if(this.isHumanAlli) return this.getRevealHandPositionsInfo();

    var realWidth = this.width / this.container.scale.x;

    var shift = ((realWidth-PanelTile.WIDTH) / (this.tiles.length-1));
    if(shift > this.maxShift) shift = this.maxShift;

    for(var i = 0; i < this.tiles.length; i++)
    {
      var tile = this.tiles[i];
      var container = this.tilesContainers[i];
      if(container == null) console.log('Container not exist!');

      positionsInfo.tiles.push({ tile: tile, container: container, x: PanelTile.WIDTH/2 + i*shift, y: 0, angle: 0 });
    }

    // this.container.x = -this.width/2 + 5;
    // console.log(realWidth);
  }
  else if(this.type == 'human')
  {
    var shift = PanelTile.WIDTH + this.tilesShift;

    for(var i = 0; i < this.tiles.length; i++)
    {
      var tile = this.tiles[i];
      var container = this.tilesContainers[i];
      if(container == null) console.log('Container not exist!');

      positionsInfo.tiles.push({ tile: tile, container: container, x: PanelTile.WIDTH/2 + i*shift, y: 0, angle: 0 });
    }

    var containerInfo = {};

    var realWidth = this.tiles.length * (PanelTile.WIDTH + this.tilesShift) - this.tilesShift;
    var maxWidth = this.maxWidth;

    // var width = containerWidth;
    containerInfo.scale = this.maxScale;

    if(realWidth > maxWidth)
    {
      // width = maxWidth;

      containerInfo.scale = maxWidth / realWidth;
      if(containerInfo.scale > this.maxScale) containerInfo.scale = this.maxScale;
    }
    // this.container.scale.x = this.container.scale.y = scale;

    containerInfo.x = -(realWidth*containerInfo.scale)/2;
    // this.container.x = containerX;

    positionsInfo.width = realWidth * containerInfo.scale;
    if(positionsInfo.width < this.minWidth) positionsInfo.width = this.minWidth;

    positionsInfo.containerInfo = containerInfo;
  }

  return positionsInfo;
}

PanelTilesContainer.prototype.getRevealHandPositionsInfo = function()
{
  var positionsInfo = { tiles: [] };

  if(this.type == 'ai')
  {
    var containerWidth = ((PanelTile.WIDTH + 8) * this.tiles.length - 8) * this.container.scale.x;

    for(var i = 0; i < this.tiles.length; i++)
    {
      var tile = this.tiles[i];
      var container = this.tilesContainers[i];

      positionsInfo.tiles.push({ tile: tile, container: container, x: PanelTile.WIDTH/2 + i*(PanelTile.WIDTH + 8), y: 0, angle: 0});
    }

    positionsInfo.containerWidth = containerWidth;
  }

  return positionsInfo;
}

PanelTilesContainer.prototype.tween = function(data, callback)
{
  var positionsInfo = {};

  var tweensCount = 0;

  if(this.type == 'bazaar' && data.name == 'update_positions')
  {
    positionsInfo = this.getPositionsInfo();

    // if(positionsInfo.tiles.length == 0)
    // {
    //   if(callback) callback();
    //   return;
    // }

    for(var i = 0; i < positionsInfo.tiles.length; i++)
    {
      var position = positionsInfo.tiles[i];

      var tileContainer = position.container;

      var time = 12/30;
      var delay = 0/30 * i;

      TweenMax.to(tileContainer, time, { x: position.x, y: position.y, ease: Power1.easeInOut, delay: delay });
    }

    var containerWidth = this.tiles.length * (PanelTile.WIDTH + this.tilesShift) - this.tilesShift;
    var containetX = -((containerWidth)*this.container.scale.x)/2;
    TweenMax.to(this.container, 12/30, { x: containetX, ease: Power1.easeInOut, onComplete: function()
    {
      if(callback) callback();
    }});
  }
  else if(this.type == 'ai' && data.name == 'update_positions')
  {
    positionsInfo = this.getPositionsInfo();

    // var containerInfo = positionsInfo.containerInfo;

    for(var i = 0; i < positionsInfo.tiles.length; i++)
    {
      var position = positionsInfo.tiles[i];

      var tile = position.tile;
      var tileContainer = position.container;

      var time = 12/30;
      var delay = 0/30 * i;

      TweenMax.to(tileContainer.scale, time, { x: 1, y: 1, ease: Power1.easeInOut, delay: delay});
      TweenMax.to(tileContainer, time, { x: position.x, y: position.y, ease: Power1.easeInOut, delay: delay});

      if(i == 0 && tile.splitBorder.alpha > 0) tile.tween({name: 'hide_split_border'});
    }

    if(positionsInfo.containerWidth != undefined)
    {
      TweenMax.to(this.container, time, { x: -positionsInfo.containerWidth/2, ease: Power1.easeInOut });
      TweenMax.to(this, time, { width: positionsInfo.containerWidth, ease: Power1.easeInOut, onComplete: function()
      {

      }});
    }

    // console.log('upd');



    // TweenMax.to(this.container.scale, 12/30, {x: containerInfo.scale, y: containerInfo.scale, ease: Power1.easeInOut});
    // TweenMax.to(this.container, 12/30, {x: containerInfo.x, ease: Power1.easeInOut});

    // TweenMax.to(this, 12/30, {width: positionsInfo.width, ease: Power1.easeInOut});
  }  
  else if(this.type == 'human' && data.name == 'update_positions')
  {
    positionsInfo = this.getPositionsInfo();

    var containerInfo = positionsInfo.containerInfo;

    for(var i = 0; i < positionsInfo.tiles.length; i++)
    {
      var position = positionsInfo.tiles[i];

      var tileContainer = position.container;

      var time = 12/30;
      var delay = 0/30 * i;

      TweenMax.to(tileContainer.scale, time, { x: 1, y: 1, ease: Power1.easeInOut, delay: delay});
      TweenMax.to(tileContainer, time, { x: position.x, y: position.y, ease: Power1.easeInOut, delay: delay});
    }

    TweenMax.to(this.container.scale, 12/30, {x: containerInfo.scale, y: containerInfo.scale, ease: Power1.easeInOut});
    TweenMax.to(this.container, 12/30, {x: containerInfo.x, ease: Power1.easeInOut});

    TweenMax.to(this, 12/30, {width: positionsInfo.width, ease: Power1.easeInOut});
  }
}
// ======================================================================================================================================== //
// ======================================================================================================================================== //
// ======================================================================================================================================== //