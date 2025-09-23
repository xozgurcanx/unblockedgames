var StateLoad = function()
{
  // console.log('StateLoad');

  var rootScene = guiManager.rootScene;

  this.container = new PIXI.Container();
  rootScene.addChild(this.container);

  this.nLoaded = 0;

  assetsManager.loader.addListener('progress', this.onLoadProgress, this);
  assetsManager.loader.addListener('complete', this.onLoadComplete, this);

  this.label = new PIXI.Sprite(assetsManager.getTexture('progress_label'));
  this.container.addChild(this.label);
  this.label.anchor.set(0.5, 0.5);

  this.progressBar = new PIXI.Sprite(assetsManager.getTexture('progress_bar'));
  this.container.addChild(this.progressBar);
  this.progressBar.anchor.set(0.5, 0.5);
  this.progressBar.y = 75;
  this.progressBar.scale.x = 0.5;
  // this.solvedBorder.visible = false;  

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
      TweenMax.to(self.container, 15/30, {y: -80, alpha: 0, ease: Power2.easeOut, delay: 15/30, onComplete: function()
      {
        self.clear();
        app.init();
      }});
    });
  });
};

StateLoad.prototype.toMainMenu = function(callback)
{
  // TweenMax.to(this.progressBar, 8 / 30, {alpha: 0, y: 200, ease: constsManager.getData('tweens/tween_hide')});
  // TweenMax.to(this.logo, 14 / 30, {y: 1, ease: constsManager.getData('tweens/tween_hide'), onComplete: callback});
  callback();
};

StateLoad.prototype.clear = function()
{

}

StateLoad.prototype.onLoadProgress = function(loader, resource)
{
  var maxLoaded = 4;
  this.nLoaded ++;
  if(this.nLoaded > maxLoaded) this.nLoaded = maxLoaded;

  this.progressBar.scale.x = 0.5 + 0.5*(this.nLoaded / maxLoaded);

  // console.log(this.nLoaded);
  // this.progressBar.scale.x = this.nLoaded / maxLoaded;
};

StateLoad.prototype.destroy = function()
{

};
