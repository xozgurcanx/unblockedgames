var StateLoad = function()
{
  // console.log('StateLoad');

  var rootScene = guiManager.rootScene;

  this.container = new PIXI.Container();
  rootScene.addChild(this.container);

  this.nLoaded = 0;

  assetsManager.loader.addListener('progress', this.onLoadProgress, this);
  assetsManager.loader.addListener('complete', this.onLoadComplete, this);

  this.bar = new PIXI.Sprite(assetsManager.getTexture('preloader_bar'));
  this.container.addChild(this.bar);
  this.bar.anchor.set(0.0, 0.5);
  this.bar.width = 0;
  this.bar.height = 73;
  this.bar.x = -900/2+1;

  this.barBorder = new PIXI.Sprite(assetsManager.getTexture('preloader_bar_border'));
  this.container.addChild(this.barBorder);
  this.barBorder.anchor.set(0.5, 0.5);

  assetsManager.loadAssets('load');
};

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

}

StateLoad.prototype.onLoadProgress = function(loader, resource)
{
  // console.log('LLL');

  this.nLoaded ++;

  // console.log(this.nLoaded);

  var persent = this.nLoaded / 8;
  if(persent > 1) persent = 1.0;

  this.bar.width = 898 * persent;

  // console.log(loader.progress);
  // this.progressBar.scale.x = this.nLoaded / maxLoaded;
};

StateLoad.prototype.destroy = function()
{

};
