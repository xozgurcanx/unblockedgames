var StateLoad = function()
{
  // console.log('StateLoad');

  var rootScene = guiManager.rootScene;

  this.nLoaded = 0;

  assetsManager.loader.addListener('progress', this.onLoadProgress, this);
  assetsManager.loader.addListener('complete', this.onLoadComplete, this);

  this.rotateScreenBg = new PIXI.Sprite(assetsManager.getTexture('bg_gradient_1'));
  rootScene.addChild(this.rotateScreenBg);
  this.rotateScreenBg.width = 3500;
  this.rotateScreenBg.height = guiManager.rootScene.height+5;
  this.rotateScreenBg.anchor.set(0.5, 0.5);  

  this.container = new PIXI.Container();
  rootScene.addChild(this.container);

  this.bar = new PIXI.Sprite(assetsManager.getTexture('preloader_bar'));
  this.container.addChild(this.bar);
  this.bar.anchor.set(0.0, 0.5);
  this.bar.width = 0;

  this.barBorder = new PIXI.Sprite(assetsManager.getTexture('preloader_bar_border'));
  this.container.addChild(this.barBorder);
  this.barBorder.anchor.set(0.5, 0.5);
  this.bar.x = -this.barBorder.width/2+2;

  guiManager.addListener('game_resize', this.onGameResize, this);

  assetsManager.loadAssets('load');

  app.once('clear_preloader', function()
  {
    // console.log('Clear ppp');
    this.rotateScreenBg.destroy();
    this.rotateScreenBg = null;
  }, this);
};

StateLoad.prototype.onGameResize = function(data)
{
    this.rotateScreenBg.height = data.height + 5;

    // console.log('aaaa');
    // app.bgGradient.tileScale.y = (data.height + 5) / 900;
    // console.log(app.bgGradient.tileScale.y);

    // console.log(app.screenGame.width, app.screenGame.height);
    // console.lo
}

StateLoad.prototype.onLoadComplete = function()
{
  var self = this;

  // console.log('StateLoad: LoadComplete!');

  assetsManager.loader.removeListener('progress', this.onLoadProgress);
  assetsManager.loader.removeListener('complete', this.onLoadComplete);

  assetsManager.loadAudio(function()
  {
    // self.progressBar.scale.x = 1;
    self.toMainMenu(function()
    {
      self.clear();
      app.init();
    });
  });
};

StateLoad.prototype.toMainMenu = function(callback)
{
  // TweenMax.to(this.progressBar, 8 / 30, {alpha: 0, y: 200, ease: constsManager.getData('tweens/tween_hide')});
  // TweenMax.to(this.logo, 14 / 30, {y: 1, ease: constsManager.getData('tweens/tween_hide'), onComplete: callback});
  var self = this;

  TweenMax.to(this.container, 10/30, {alpha: 0, ease: Power2.easeOut, onComplete: function()
  {
    self.container.visible = false;
    
    callback();
  }});
};

StateLoad.prototype.clear = function()
{
  guiManager.removeListener('game_resize', this.onGameResize);
}

StateLoad.prototype.onLoadProgress = function(loader, resource)
{
  // console.log('LLL');

  this.nLoaded ++;

  // console.log(this.nLoaded);

  var persent = this.nLoaded / 10;
  if(persent > 1) persent = 1.0;

  // console.log(persent);

  this.bar.width = (this.barBorder.width-4) * persent;

  // console.log(loader.progress);
  // this.progressBar.scale.x = this.nLoaded / maxLoaded;
};

StateLoad.prototype.destroy = function()
{

};
