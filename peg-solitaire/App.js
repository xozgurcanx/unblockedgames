var App = function()
{
  EventEmitter.call(this);


  App.instance = this;

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
  // interaction.addListener('mousedown', function(data)
  // {
  //   console.log(data);
  // });

  guiManager.emit('game_resize', {width: guiManager.rootScene.width, height: guiManager.rootScene.height});

  this.fieldsData = 
  {
    star: '{"name":"STAR","score":0, "shiftX":-40, "type":"hex","width":9,"height":5,"cells":[[{"i":0,"j":0,"type":"none"},null,{"i":0,"j":2,"type":"none"},null,{"i":0,"j":4,"type":"none"}],[null,{"i":1,"j":1,"type":"peg"},null,{"i":1,"j":3,"type":"peg"},null,{"i":1,"j":5,"type":"none"}],[{"i":2,"j":0,"type":"none"},null,{"i":2,"j":2,"type":"peg"},null,{"i":2,"j":4,"type":"none"}],[null,{"i":3,"j":1,"type":"peg"},null,{"i":3,"j":3,"type":"peg"},null,{"i":3,"j":5,"type":"none"}],[{"i":4,"j":0,"type":"free"},null,{"i":4,"j":2,"type":"peg"},null,{"i":4,"j":4,"type":"peg"}],[null,{"i":5,"j":1,"type":"peg"},null,{"i":5,"j":3,"type":"peg"},null,{"i":5,"j":5,"type":"none"}],[{"i":6,"j":0,"type":"none"},null,{"i":6,"j":2,"type":"peg"},null,{"i":6,"j":4,"type":"none"}],[null,{"i":7,"j":1,"type":"peg"},null,{"i":7,"j":3,"type":"peg"},null,{"i":7,"j":5,"type":"none"}],[{"i":8,"j":0,"type":"none"},null,{"i":8,"j":2,"type":"none"},null,{"i":8,"j":4,"type":"none"}]]}',
    pyramid: '{"name":"PYRAMID","score":0,"type":"hex","width":9,"height":5,"cells":[[{"i":0,"j":0,"type":"none"},null,{"i":0,"j":2,"type":"none"},null,{"i":0,"j":4,"type":"peg"}],[null,{"i":1,"j":1,"type":"none"},null,{"i":1,"j":3,"type":"peg"},null,{"i":1,"j":5,"type":"none"}],[{"i":2,"j":0,"type":"none"},null,{"i":2,"j":2,"type":"peg"},null,{"i":2,"j":4,"type":"peg"}],[null,{"i":3,"j":1,"type":"peg"},null,{"i":3,"j":3,"type":"peg"},null,{"i":3,"j":5,"type":"none"}],[{"i":4,"j":0,"type":"free"},null,{"i":4,"j":2,"type":"peg"},null,{"i":4,"j":4,"type":"peg"}],[null,{"i":5,"j":1,"type":"peg"},null,{"i":5,"j":3,"type":"peg"},null,{"i":5,"j":5,"type":"none"}],[{"i":6,"j":0,"type":"none"},null,{"i":6,"j":2,"type":"peg"},null,{"i":6,"j":4,"type":"peg"}],[null,{"i":7,"j":1,"type":"none"},null,{"i":7,"j":3,"type":"peg"},null,{"i":7,"j":5,"type":"none"}],[{"i":8,"j":0,"type":"none"},null,{"i":8,"j":2,"type":"none"},null,{"i":8,"j":4,"type":"peg"}]]}',
    trapezoid: '{"name":"TRAPEZOID","score":0, "shiftY":-80, "type":"hex","width":13,"height":5,"cells":[[{"i":0,"j":0,"type":"none"},null,{"i":0,"j":2,"type":"none"},null,{"i":0,"j":4,"type":"peg"}],[null,{"i":1,"j":1,"type":"none"},null,{"i":1,"j":3,"type":"peg"},null,{"i":1,"j":5,"type":"none"}],[{"i":2,"j":0,"type":"none"},null,{"i":2,"j":2,"type":"free"},null,{"i":2,"j":4,"type":"peg"}],[null,{"i":3,"j":1,"type":"peg"},null,{"i":3,"j":3,"type":"peg"},null,{"i":3,"j":5,"type":"none"}],[{"i":4,"j":0,"type":"none"},null,{"i":4,"j":2,"type":"peg"},null,{"i":4,"j":4,"type":"peg"}],[null,{"i":5,"j":1,"type":"peg"},null,{"i":5,"j":3,"type":"peg"},null,{"i":5,"j":5,"type":"none"}],[{"i":6,"j":0,"type":"none"},null,{"i":6,"j":2,"type":"peg"},null,{"i":6,"j":4,"type":"peg"}],[null,{"i":7,"j":1,"type":"peg"},null,{"i":7,"j":3,"type":"peg"},null,{"i":7,"j":5,"type":"none"}],[{"i":8,"j":0,"type":"none"},null,{"i":8,"j":2,"type":"peg"},null,{"i":8,"j":4,"type":"peg"}],[null,{"i":9,"j":1,"type":"peg"},null,{"i":9,"j":3,"type":"peg"},null,{"i":9,"j":5,"type":"none"}],[{"i":10,"j":0,"type":"none"},null,{"i":10,"j":2,"type":"peg"},null,{"i":10,"j":4,"type":"peg"}],[null,{"i":11,"j":1,"type":"none"},null,{"i":11,"j":3,"type":"peg"},null,{"i":11,"j":5,"type":"none"}],[{"i":12,"j":0,"type":"none"},null,{"i":12,"j":2,"type":"none"},null,{"i":12,"j":4,"type":"peg"}]]}',
    standard: '{"name":"STANDARD","score":0,"type":"rect","width":7,"height":7,"cells":[[{"i":0,"j":0,"type":"none"},{"i":1,"j":0,"type":"none"},{"i":2,"j":0,"type":"peg"},{"i":3,"j":0,"type":"peg"},{"i":4,"j":0,"type":"peg"},{"i":5,"j":0,"type":"none"},{"i":6,"j":0,"type":"none"}],[{"i":0,"j":1,"type":"none"},{"i":1,"j":1,"type":"none"},{"i":2,"j":1,"type":"peg"},{"i":3,"j":1,"type":"peg"},{"i":4,"j":1,"type":"peg"},{"i":5,"j":1,"type":"none"},{"i":6,"j":1,"type":"none"}],[{"i":0,"j":2,"type":"peg"},{"i":1,"j":2,"type":"peg"},{"i":2,"j":2,"type":"peg"},{"i":3,"j":2,"type":"peg"},{"i":4,"j":2,"type":"peg"},{"i":5,"j":2,"type":"peg"},{"i":6,"j":2,"type":"peg"}],[{"i":0,"j":3,"type":"peg"},{"i":1,"j":3,"type":"peg"},{"i":2,"j":3,"type":"peg"},{"i":3,"j":3,"type":"free"},{"i":4,"j":3,"type":"peg"},{"i":5,"j":3,"type":"peg"},{"i":6,"j":3,"type":"peg"}],[{"i":0,"j":4,"type":"peg"},{"i":1,"j":4,"type":"peg"},{"i":2,"j":4,"type":"peg"},{"i":3,"j":4,"type":"peg"},{"i":4,"j":4,"type":"peg"},{"i":5,"j":4,"type":"peg"},{"i":6,"j":4,"type":"peg"}],[{"i":0,"j":5,"type":"none"},{"i":1,"j":5,"type":"none"},{"i":2,"j":5,"type":"peg"},{"i":3,"j":5,"type":"peg"},{"i":4,"j":5,"type":"peg"},{"i":5,"j":5,"type":"none"},{"i":6,"j":5,"type":"none"}],[{"i":0,"j":6,"type":"none"},{"i":1,"j":6,"type":"none"},{"i":2,"j":6,"type":"peg"},{"i":3,"j":6,"type":"peg"},{"i":4,"j":6,"type":"peg"},{"i":5,"j":6,"type":"none"},{"i":6,"j":6,"type":"none"}]]}',
        
    square: '{"name":"SQUARE","score":0,"type":"rect","width":6,"height":6,"cells":[[{"i":0,"j":0,"type":"peg"},{"i":1,"j":0,"type":"peg"},{"i":2,"j":0,"type":"peg"},{"i":3,"j":0,"type":"peg"},{"i":4,"j":0,"type":"peg"},{"i":5,"j":0,"type":"peg"}],[{"i":0,"j":1,"type":"peg"},{"i":1,"j":1,"type":"peg"},{"i":2,"j":1,"type":"peg"},{"i":3,"j":1,"type":"peg"},{"i":4,"j":1,"type":"peg"},{"i":5,"j":1,"type":"peg"}],[{"i":0,"j":2,"type":"peg"},{"i":1,"j":2,"type":"peg"},{"i":2,"j":2,"type":"peg"},{"i":3,"j":2,"type":"free"},{"i":4,"j":2,"type":"peg"},{"i":5,"j":2,"type":"peg"}],[{"i":0,"j":3,"type":"peg"},{"i":1,"j":3,"type":"peg"},{"i":2,"j":3,"type":"peg"},{"i":3,"j":3,"type":"peg"},{"i":4,"j":3,"type":"peg"},{"i":5,"j":3,"type":"peg"}],[{"i":0,"j":4,"type":"peg"},{"i":1,"j":4,"type":"peg"},{"i":2,"j":4,"type":"peg"},{"i":3,"j":4,"type":"peg"},{"i":4,"j":4,"type":"peg"},{"i":5,"j":4,"type":"peg"}],[{"i":0,"j":5,"type":"peg"},{"i":1,"j":5,"type":"peg"},{"i":2,"j":5,"type":"peg"},{"i":3,"j":5,"type":"peg"},{"i":4,"j":5,"type":"peg"},{"i":5,"j":5,"type":"peg"}]]}',
    european: '{"name":"EUROPEAN","score":0,"type":"rect","width":7,"height":7,"cells":[[{"i":0,"j":0,"type":"none"},{"i":1,"j":0,"type":"none"},{"i":2,"j":0,"type":"peg"},{"i":3,"j":0,"type":"peg"},{"i":4,"j":0,"type":"peg"},{"i":5,"j":0,"type":"none"},{"i":6,"j":0,"type":"none"}],[{"i":0,"j":1,"type":"none"},{"i":1,"j":1,"type":"peg"},{"i":2,"j":1,"type":"peg"},{"i":3,"j":1,"type":"peg"},{"i":4,"j":1,"type":"peg"},{"i":5,"j":1,"type":"peg"},{"i":6,"j":1,"type":"none"}],[{"i":0,"j":2,"type":"peg"},{"i":1,"j":2,"type":"peg"},{"i":2,"j":2,"type":"peg"},{"i":3,"j":2,"type":"free"},{"i":4,"j":2,"type":"peg"},{"i":5,"j":2,"type":"peg"},{"i":6,"j":2,"type":"peg"}],[{"i":0,"j":3,"type":"peg"},{"i":1,"j":3,"type":"peg"},{"i":2,"j":3,"type":"peg"},{"i":3,"j":3,"type":"peg"},{"i":4,"j":3,"type":"peg"},{"i":5,"j":3,"type":"peg"},{"i":6,"j":3,"type":"peg"}],[{"i":0,"j":4,"type":"peg"},{"i":1,"j":4,"type":"peg"},{"i":2,"j":4,"type":"peg"},{"i":3,"j":4,"type":"peg"},{"i":4,"j":4,"type":"peg"},{"i":5,"j":4,"type":"peg"},{"i":6,"j":4,"type":"peg"}],[{"i":0,"j":5,"type":"none"},{"i":1,"j":5,"type":"peg"},{"i":2,"j":5,"type":"peg"},{"i":3,"j":5,"type":"peg"},{"i":4,"j":5,"type":"peg"},{"i":5,"j":5,"type":"peg"},{"i":6,"j":5,"type":"none"}],[{"i":0,"j":6,"type":"none"},{"i":1,"j":6,"type":"none"},{"i":2,"j":6,"type":"peg"},{"i":3,"j":6,"type":"peg"},{"i":4,"j":6,"type":"peg"},{"i":5,"j":6,"type":"none"},{"i":6,"j":6,"type":"none"}]]}',
    
    asymmetric: '{"name":"ASYMMETRIC","score":0,"type":"rect","width":8,"height":8,"cells":[[{"i":0,"j":0,"type":"none"},{"i":1,"j":0,"type":"none"},{"i":2,"j":0,"type":"peg"},{"i":3,"j":0,"type":"peg"},{"i":4,"j":0,"type":"peg"},{"i":5,"j":0,"type":"none"},{"i":6,"j":0,"type":"none"},{"i":7,"j":0,"type":"none"}],[{"i":0,"j":1,"type":"none"},{"i":1,"j":1,"type":"none"},{"i":2,"j":1,"type":"peg"},{"i":3,"j":1,"type":"peg"},{"i":4,"j":1,"type":"peg"},{"i":5,"j":1,"type":"none"},{"i":6,"j":1,"type":"none"},{"i":7,"j":1,"type":"none"}],[{"i":0,"j":2,"type":"none"},{"i":1,"j":2,"type":"none"},{"i":2,"j":2,"type":"peg"},{"i":3,"j":2,"type":"peg"},{"i":4,"j":2,"type":"peg"},{"i":5,"j":2,"type":"none"},{"i":6,"j":2,"type":"none"},{"i":7,"j":2,"type":"none"}],[{"i":0,"j":3,"type":"peg"},{"i":1,"j":3,"type":"peg"},{"i":2,"j":3,"type":"peg"},{"i":3,"j":3,"type":"peg"},{"i":4,"j":3,"type":"peg"},{"i":5,"j":3,"type":"peg"},{"i":6,"j":3,"type":"peg"},{"i":7,"j":3,"type":"peg"}],[{"i":0,"j":4,"type":"peg"},{"i":1,"j":4,"type":"peg"},{"i":2,"j":4,"type":"peg"},{"i":3,"j":4,"type":"free"},{"i":4,"j":4,"type":"peg"},{"i":5,"j":4,"type":"peg"},{"i":6,"j":4,"type":"peg"},{"i":7,"j":4,"type":"peg"}],[{"i":0,"j":5,"type":"peg"},{"i":1,"j":5,"type":"peg"},{"i":2,"j":5,"type":"peg"},{"i":3,"j":5,"type":"peg"},{"i":4,"j":5,"type":"peg"},{"i":5,"j":5,"type":"peg"},{"i":6,"j":5,"type":"peg"},{"i":7,"j":5,"type":"peg"}],[{"i":0,"j":6,"type":"none"},{"i":1,"j":6,"type":"none"},{"i":2,"j":6,"type":"peg"},{"i":3,"j":6,"type":"peg"},{"i":4,"j":6,"type":"peg"},{"i":5,"j":6,"type":"none"},{"i":6,"j":6,"type":"none"},{"i":7,"j":6,"type":"none"}],[{"i":0,"j":7,"type":"none"},{"i":1,"j":7,"type":"none"},{"i":2,"j":7,"type":"peg"},{"i":3,"j":7,"type":"peg"},{"i":4,"j":7,"type":"peg"},{"i":5,"j":7,"type":"none"},{"i":6,"j":7,"type":"none"},{"i":7,"j":7,"type":"none"}]]}',
    rhombus: '{"name":"RHOMBUS","score":0, "shiftX":-40, "shiftY":-80, "type":"hex","width":15,"height":5,"cells":[[{"i":0,"j":0,"type":"none"},null,{"i":0,"j":2,"type":"none"},null,{"i":0,"j":4,"type":"none"}],[null,{"i":1,"j":1,"type":"none"},null,{"i":1,"j":3,"type":"none"},null,{"i":1,"j":5,"type":"peg"}],[{"i":2,"j":0,"type":"none"},null,{"i":2,"j":2,"type":"none"},null,{"i":2,"j":4,"type":"peg"}],[null,{"i":3,"j":1,"type":"none"},null,{"i":3,"j":3,"type":"peg"},null,{"i":3,"j":5,"type":"peg"}],[{"i":4,"j":0,"type":"none"},null,{"i":4,"j":2,"type":"peg"},null,{"i":4,"j":4,"type":"peg"}],[null,{"i":5,"j":1,"type":"free"},null,{"i":5,"j":3,"type":"peg"},null,{"i":5,"j":5,"type":"peg"}],[{"i":6,"j":0,"type":"none"},null,{"i":6,"j":2,"type":"peg"},null,{"i":6,"j":4,"type":"peg"}],[null,{"i":7,"j":1,"type":"peg"},null,{"i":7,"j":3,"type":"peg"},null,{"i":7,"j":5,"type":"peg"}],[{"i":8,"j":0,"type":"none"},null,{"i":8,"j":2,"type":"peg"},null,{"i":8,"j":4,"type":"peg"}],[null,{"i":9,"j":1,"type":"peg"},null,{"i":9,"j":3,"type":"peg"},null,{"i":9,"j":5,"type":"peg"}],[{"i":10,"j":0,"type":"none"},null,{"i":10,"j":2,"type":"peg"},null,{"i":10,"j":4,"type":"peg"}],[null,{"i":11,"j":1,"type":"peg"},null,{"i":11,"j":3,"type":"peg"},null,{"i":11,"j":5,"type":"none"}],[{"i":12,"j":0,"type":"none"},null,{"i":12,"j":2,"type":"peg"},null,{"i":12,"j":4,"type":"none"}],[null,{"i":13,"j":1,"type":"peg"},null,{"i":13,"j":3,"type":"none"},null,{"i":13,"j":5,"type":"none"}],[{"i":14,"j":0,"type":"none"},null,{"i":14,"j":2,"type":"none"},null,{"i":14,"j":4,"type":"none"}]]}',
    german: '{"name":"GERMAN","score":0,"type":"rect","width":9,"height":9,"cells":[[{"i":0,"j":0,"type":"none"},{"i":1,"j":0,"type":"none"},{"i":2,"j":0,"type":"none"},{"i":3,"j":0,"type":"peg"},{"i":4,"j":0,"type":"peg"},{"i":5,"j":0,"type":"peg"},{"i":6,"j":0,"type":"none"},{"i":7,"j":0,"type":"none"},{"i":8,"j":0,"type":"none"}],[{"i":0,"j":1,"type":"none"},{"i":1,"j":1,"type":"none"},{"i":2,"j":1,"type":"none"},{"i":3,"j":1,"type":"peg"},{"i":4,"j":1,"type":"peg"},{"i":5,"j":1,"type":"peg"},{"i":6,"j":1,"type":"none"},{"i":7,"j":1,"type":"none"},{"i":8,"j":1,"type":"none"}],[{"i":0,"j":2,"type":"none"},{"i":1,"j":2,"type":"none"},{"i":2,"j":2,"type":"none"},{"i":3,"j":2,"type":"peg"},{"i":4,"j":2,"type":"peg"},{"i":5,"j":2,"type":"peg"},{"i":6,"j":2,"type":"none"},{"i":7,"j":2,"type":"none"},{"i":8,"j":2,"type":"none"}],[{"i":0,"j":3,"type":"peg"},{"i":1,"j":3,"type":"peg"},{"i":2,"j":3,"type":"peg"},{"i":3,"j":3,"type":"peg"},{"i":4,"j":3,"type":"peg"},{"i":5,"j":3,"type":"peg"},{"i":6,"j":3,"type":"peg"},{"i":7,"j":3,"type":"peg"},{"i":8,"j":3,"type":"peg"}],[{"i":0,"j":4,"type":"peg"},{"i":1,"j":4,"type":"peg"},{"i":2,"j":4,"type":"peg"},{"i":3,"j":4,"type":"peg"},{"i":4,"j":4,"type":"free"},{"i":5,"j":4,"type":"peg"},{"i":6,"j":4,"type":"peg"},{"i":7,"j":4,"type":"peg"},{"i":8,"j":4,"type":"peg"}],[{"i":0,"j":5,"type":"peg"},{"i":1,"j":5,"type":"peg"},{"i":2,"j":5,"type":"peg"},{"i":3,"j":5,"type":"peg"},{"i":4,"j":5,"type":"peg"},{"i":5,"j":5,"type":"peg"},{"i":6,"j":5,"type":"peg"},{"i":7,"j":5,"type":"peg"},{"i":8,"j":5,"type":"peg"}],[{"i":0,"j":6,"type":"none"},{"i":1,"j":6,"type":"none"},{"i":2,"j":6,"type":"none"},{"i":3,"j":6,"type":"peg"},{"i":4,"j":6,"type":"peg"},{"i":5,"j":6,"type":"peg"},{"i":6,"j":6,"type":"none"},{"i":7,"j":6,"type":"none"},{"i":8,"j":6,"type":"none"}],[{"i":0,"j":7,"type":"none"},{"i":1,"j":7,"type":"none"},{"i":2,"j":7,"type":"none"},{"i":3,"j":7,"type":"peg"},{"i":4,"j":7,"type":"peg"},{"i":5,"j":7,"type":"peg"},{"i":6,"j":7,"type":"none"},{"i":7,"j":7,"type":"none"},{"i":8,"j":7,"type":"none"}],[{"i":0,"j":8,"type":"none"},{"i":1,"j":8,"type":"none"},{"i":2,"j":8,"type":"none"},{"i":3,"j":8,"type":"peg"},{"i":4,"j":8,"type":"peg"},{"i":5,"j":8,"type":"peg"},{"i":6,"j":8,"type":"none"},{"i":7,"j":8,"type":"none"},{"i":8,"j":8,"type":"none"}]]}',
    
    triangle: '{"name":"TRIANGLE","score":0,"type":"hex","width":15,"height":8,"cells":[[{"i":0,"j":0,"type":"none"},null,{"i":0,"j":2,"type":"none"},null,{"i":0,"j":4,"type":"none"},null,{"i":0,"j":6,"type":"peg"}],[null,{"i":1,"j":1,"type":"none"},null,{"i":1,"j":3,"type":"none"},null,{"i":1,"j":5,"type":"none"},null,{"i":1,"j":7,"type":"peg"}],[{"i":2,"j":0,"type":"none"},null,{"i":2,"j":2,"type":"none"},null,{"i":2,"j":4,"type":"none"},null,{"i":2,"j":6,"type":"peg"}],[null,{"i":3,"j":1,"type":"none"},null,{"i":3,"j":3,"type":"none"},null,{"i":3,"j":5,"type":"peg"},null,{"i":3,"j":7,"type":"none"}],[{"i":4,"j":0,"type":"none"},null,{"i":4,"j":2,"type":"none"},null,{"i":4,"j":4,"type":"peg"},null,{"i":4,"j":6,"type":"peg"}],[null,{"i":5,"j":1,"type":"none"},null,{"i":5,"j":3,"type":"peg"},null,{"i":5,"j":5,"type":"peg"},null,{"i":5,"j":7,"type":"none"}],[{"i":6,"j":0,"type":"peg"},null,{"i":6,"j":2,"type":"peg"},null,{"i":6,"j":4,"type":"peg"},null,{"i":6,"j":6,"type":"peg"}],[null,{"i":7,"j":1,"type":"peg"},null,{"i":7,"j":3,"type":"free"},null,{"i":7,"j":5,"type":"peg"},null,{"i":7,"j":7,"type":"none"}],[{"i":8,"j":0,"type":"peg"},null,{"i":8,"j":2,"type":"peg"},null,{"i":8,"j":4,"type":"peg"},null,{"i":8,"j":6,"type":"peg"}],[null,{"i":9,"j":1,"type":"none"},null,{"i":9,"j":3,"type":"peg"},null,{"i":9,"j":5,"type":"peg"},null,{"i":9,"j":7,"type":"none"}],[{"i":10,"j":0,"type":"none"},null,{"i":10,"j":2,"type":"none"},null,{"i":10,"j":4,"type":"peg"},null,{"i":10,"j":6,"type":"peg"}],[null,{"i":11,"j":1,"type":"none"},null,{"i":11,"j":3,"type":"none"},null,{"i":11,"j":5,"type":"peg"},null,{"i":11,"j":7,"type":"none"}],[{"i":12,"j":0,"type":"none"},null,{"i":12,"j":2,"type":"none"},null,{"i":12,"j":4,"type":"none"},null,{"i":12,"j":6,"type":"peg"}],[null,{"i":13,"j":1,"type":"none"},null,{"i":13,"j":3,"type":"none"},null,{"i":13,"j":5,"type":"none"},null,{"i":13,"j":7,"type":"peg"}],[{"i":14,"j":0,"type":"none"},null,{"i":14,"j":2,"type":"none"},null,{"i":14,"j":4,"type":"none"},null,{"i":14,"j":6,"type":"peg"}]]}',

    diamond: '{"name":"DIAMOND","score":0,"type":"rect","width":9,"height":9,"cells":[[{"i":0,"j":0,"type":"none"},{"i":1,"j":0,"type":"none"},{"i":2,"j":0,"type":"none"},{"i":3,"j":0,"type":"none"},{"i":4,"j":0,"type":"peg"},{"i":5,"j":0,"type":"none"},{"i":6,"j":0,"type":"none"},{"i":7,"j":0,"type":"none"},{"i":8,"j":0,"type":"none"}],[{"i":0,"j":1,"type":"none"},{"i":1,"j":1,"type":"none"},{"i":2,"j":1,"type":"none"},{"i":3,"j":1,"type":"peg"},{"i":4,"j":1,"type":"peg"},{"i":5,"j":1,"type":"peg"},{"i":6,"j":1,"type":"none"},{"i":7,"j":1,"type":"none"},{"i":8,"j":1,"type":"none"}],[{"i":0,"j":2,"type":"none"},{"i":1,"j":2,"type":"none"},{"i":2,"j":2,"type":"peg"},{"i":3,"j":2,"type":"peg"},{"i":4,"j":2,"type":"free"},{"i":5,"j":2,"type":"peg"},{"i":6,"j":2,"type":"peg"},{"i":7,"j":2,"type":"none"},{"i":8,"j":2,"type":"none"}],[{"i":0,"j":3,"type":"none"},{"i":1,"j":3,"type":"peg"},{"i":2,"j":3,"type":"peg"},{"i":3,"j":3,"type":"peg"},{"i":4,"j":3,"type":"peg"},{"i":5,"j":3,"type":"peg"},{"i":6,"j":3,"type":"peg"},{"i":7,"j":3,"type":"peg"},{"i":8,"j":3,"type":"none"}],[{"i":0,"j":4,"type":"peg"},{"i":1,"j":4,"type":"peg"},{"i":2,"j":4,"type":"peg"},{"i":3,"j":4,"type":"peg"},{"i":4,"j":4,"type":"peg"},{"i":5,"j":4,"type":"peg"},{"i":6,"j":4,"type":"peg"},{"i":7,"j":4,"type":"peg"},{"i":8,"j":4,"type":"peg"}],[{"i":0,"j":5,"type":"none"},{"i":1,"j":5,"type":"peg"},{"i":2,"j":5,"type":"peg"},{"i":3,"j":5,"type":"peg"},{"i":4,"j":5,"type":"peg"},{"i":5,"j":5,"type":"peg"},{"i":6,"j":5,"type":"peg"},{"i":7,"j":5,"type":"peg"},{"i":8,"j":5,"type":"none"}],[{"i":0,"j":6,"type":"none"},{"i":1,"j":6,"type":"none"},{"i":2,"j":6,"type":"peg"},{"i":3,"j":6,"type":"peg"},{"i":4,"j":6,"type":"peg"},{"i":5,"j":6,"type":"peg"},{"i":6,"j":6,"type":"peg"},{"i":7,"j":6,"type":"none"},{"i":8,"j":6,"type":"none"}],[{"i":0,"j":7,"type":"none"},{"i":1,"j":7,"type":"none"},{"i":2,"j":7,"type":"none"},{"i":3,"j":7,"type":"peg"},{"i":4,"j":7,"type":"peg"},{"i":5,"j":7,"type":"peg"},{"i":6,"j":7,"type":"none"},{"i":7,"j":7,"type":"none"},{"i":8,"j":7,"type":"none"}],[{"i":0,"j":8,"type":"none"},{"i":1,"j":8,"type":"none"},{"i":2,"j":8,"type":"none"},{"i":3,"j":8,"type":"none"},{"i":4,"j":8,"type":"peg"},{"i":5,"j":8,"type":"none"},{"i":6,"j":8,"type":"none"},{"i":7,"j":8,"type":"none"},{"i":8,"j":8,"type":"none"}]]}',
    snow_flake: '{"name":"SNOWFLAKE","score":0,"type":"hex","width":17,"height":10,"cells":[[{"i":0,"j":0,"type":"none"},null,{"i":0,"j":2,"type":"none"},null,{"i":0,"j":4,"type":"peg"},null,{"i":0,"j":6,"type":"none"},null,{"i":0,"j":8,"type":"none"}],[null,{"i":1,"j":1,"type":"none"},null,{"i":1,"j":3,"type":"peg"},null,{"i":1,"j":5,"type":"peg"},null,{"i":1,"j":7,"type":"none"},null,{"i":1,"j":9,"type":"none"}],[{"i":2,"j":0,"type":"none"},null,{"i":2,"j":2,"type":"none"},null,{"i":2,"j":4,"type":"peg"},null,{"i":2,"j":6,"type":"none"},null,{"i":2,"j":8,"type":"none"}],[null,{"i":3,"j":1,"type":"peg"},null,{"i":3,"j":3,"type":"peg"},null,{"i":3,"j":5,"type":"peg"},null,{"i":3,"j":7,"type":"peg"},null,{"i":3,"j":9,"type":"none"}],[{"i":4,"j":0,"type":"peg"},null,{"i":4,"j":2,"type":"peg"},null,{"i":4,"j":4,"type":"peg"},null,{"i":4,"j":6,"type":"peg"},null,{"i":4,"j":8,"type":"peg"}],[null,{"i":5,"j":1,"type":"peg"},null,{"i":5,"j":3,"type":"peg"},null,{"i":5,"j":5,"type":"peg"},null,{"i":5,"j":7,"type":"peg"},null,{"i":5,"j":9,"type":"none"}],[{"i":6,"j":0,"type":"peg"},null,{"i":6,"j":2,"type":"peg"},null,{"i":6,"j":4,"type":"peg"},null,{"i":6,"j":6,"type":"peg"},null,{"i":6,"j":8,"type":"peg"}],[null,{"i":7,"j":1,"type":"peg"},null,{"i":7,"j":3,"type":"peg"},null,{"i":7,"j":5,"type":"peg"},null,{"i":7,"j":7,"type":"peg"},null,{"i":7,"j":9,"type":"none"}],[{"i":8,"j":0,"type":"none"},null,{"i":8,"j":2,"type":"peg"},null,{"i":8,"j":4,"type":"free"},null,{"i":8,"j":6,"type":"peg"},null,{"i":8,"j":8,"type":"none"}],[null,{"i":9,"j":1,"type":"peg"},null,{"i":9,"j":3,"type":"peg"},null,{"i":9,"j":5,"type":"peg"},null,{"i":9,"j":7,"type":"peg"},null,{"i":9,"j":9,"type":"none"}],[{"i":10,"j":0,"type":"peg"},null,{"i":10,"j":2,"type":"peg"},null,{"i":10,"j":4,"type":"peg"},null,{"i":10,"j":6,"type":"peg"},null,{"i":10,"j":8,"type":"peg"}],[null,{"i":11,"j":1,"type":"peg"},null,{"i":11,"j":3,"type":"peg"},null,{"i":11,"j":5,"type":"peg"},null,{"i":11,"j":7,"type":"peg"},null,{"i":11,"j":9,"type":"none"}],[{"i":12,"j":0,"type":"peg"},null,{"i":12,"j":2,"type":"peg"},null,{"i":12,"j":4,"type":"peg"},null,{"i":12,"j":6,"type":"peg"},null,{"i":12,"j":8,"type":"peg"}],[null,{"i":13,"j":1,"type":"peg"},null,{"i":13,"j":3,"type":"peg"},null,{"i":13,"j":5,"type":"peg"},null,{"i":13,"j":7,"type":"peg"},null,{"i":13,"j":9,"type":"none"}],[{"i":14,"j":0,"type":"none"},null,{"i":14,"j":2,"type":"none"},null,{"i":14,"j":4,"type":"peg"},null,{"i":14,"j":6,"type":"none"},null,{"i":14,"j":8,"type":"none"}],[null,{"i":15,"j":1,"type":"none"},null,{"i":15,"j":3,"type":"peg"},null,{"i":15,"j":5,"type":"peg"},null,{"i":15,"j":7,"type":"none"},null,{"i":15,"j":9,"type":"none"}],[{"i":16,"j":0,"type":"none"},null,{"i":16,"j":2,"type":"none"},null,{"i":16,"j":4,"type":"peg"},null,{"i":16,"j":6,"type":"none"},null,{"i":16,"j":8,"type":"none"}]]}',
    hexagonal: '{"name":"HEXAGONAL","score":0,"type":"hex","width":17,"height":9,"cells":[[{"i":0,"j":0,"type":"none"},null,{"i":0,"j":2,"type":"none"},null,{"i":0,"j":4,"type":"peg"},null,{"i":0,"j":6,"type":"none"},null,{"i":0,"j":8,"type":"none"}],[null,{"i":1,"j":1,"type":"none"},null,{"i":1,"j":3,"type":"peg"},null,{"i":1,"j":5,"type":"peg"},null,{"i":1,"j":7,"type":"none"},null,{"i":1,"j":9,"type":"none"}],[{"i":2,"j":0,"type":"none"},null,{"i":2,"j":2,"type":"peg"},null,{"i":2,"j":4,"type":"peg"},null,{"i":2,"j":6,"type":"peg"},null,{"i":2,"j":8,"type":"none"}],[null,{"i":3,"j":1,"type":"peg"},null,{"i":3,"j":3,"type":"peg"},null,{"i":3,"j":5,"type":"peg"},null,{"i":3,"j":7,"type":"peg"},null,{"i":3,"j":9,"type":"none"}],[{"i":4,"j":0,"type":"peg"},null,{"i":4,"j":2,"type":"peg"},null,{"i":4,"j":4,"type":"peg"},null,{"i":4,"j":6,"type":"peg"},null,{"i":4,"j":8,"type":"peg"}],[null,{"i":5,"j":1,"type":"peg"},null,{"i":5,"j":3,"type":"peg"},null,{"i":5,"j":5,"type":"peg"},null,{"i":5,"j":7,"type":"peg"},null,{"i":5,"j":9,"type":"none"}],[{"i":6,"j":0,"type":"peg"},null,{"i":6,"j":2,"type":"peg"},null,{"i":6,"j":4,"type":"peg"},null,{"i":6,"j":6,"type":"peg"},null,{"i":6,"j":8,"type":"peg"}],[null,{"i":7,"j":1,"type":"peg"},null,{"i":7,"j":3,"type":"peg"},null,{"i":7,"j":5,"type":"peg"},null,{"i":7,"j":7,"type":"peg"},null,{"i":7,"j":9,"type":"none"}],[{"i":8,"j":0,"type":"peg"},null,{"i":8,"j":2,"type":"peg"},null,{"i":8,"j":4,"type":"free"},null,{"i":8,"j":6,"type":"peg"},null,{"i":8,"j":8,"type":"peg"}],[null,{"i":9,"j":1,"type":"peg"},null,{"i":9,"j":3,"type":"peg"},null,{"i":9,"j":5,"type":"peg"},null,{"i":9,"j":7,"type":"peg"},null,{"i":9,"j":9,"type":"none"}],[{"i":10,"j":0,"type":"peg"},null,{"i":10,"j":2,"type":"peg"},null,{"i":10,"j":4,"type":"peg"},null,{"i":10,"j":6,"type":"peg"},null,{"i":10,"j":8,"type":"peg"}],[null,{"i":11,"j":1,"type":"peg"},null,{"i":11,"j":3,"type":"peg"},null,{"i":11,"j":5,"type":"peg"},null,{"i":11,"j":7,"type":"peg"},null,{"i":11,"j":9,"type":"none"}],[{"i":12,"j":0,"type":"peg"},null,{"i":12,"j":2,"type":"peg"},null,{"i":12,"j":4,"type":"peg"},null,{"i":12,"j":6,"type":"peg"},null,{"i":12,"j":8,"type":"peg"}],[null,{"i":13,"j":1,"type":"peg"},null,{"i":13,"j":3,"type":"peg"},null,{"i":13,"j":5,"type":"peg"},null,{"i":13,"j":7,"type":"peg"},null,{"i":13,"j":9,"type":"none"}],[{"i":14,"j":0,"type":"none"},null,{"i":14,"j":2,"type":"peg"},null,{"i":14,"j":4,"type":"peg"},null,{"i":14,"j":6,"type":"peg"},null,{"i":14,"j":8,"type":"none"}],[null,{"i":15,"j":1,"type":"none"},null,{"i":15,"j":3,"type":"peg"},null,{"i":15,"j":5,"type":"peg"},null,{"i":15,"j":7,"type":"none"},null,{"i":15,"j":9,"type":"none"}],[{"i":16,"j":0,"type":"none"},null,{"i":16,"j":2,"type":"none"},null,{"i":16,"j":4,"type":"peg"},null,{"i":16,"j":6,"type":"none"},null,{"i":16,"j":8,"type":"none"}]]}'
  };
  for(var key in this.fieldsData)
  {
    var string = this.fieldsData[key];
    this.fieldsData[key] = JSON.parse(string);
    this.fieldsData[key].isPlayed = false;
    this.fieldsData[key].isSolved = false;
    // console.log(this.fieldsData[key])
  }

  this.field = null;

  this.screenMain = new ScreenMain({name: 'screen_main', parentPanel: guiManager.rootScene});

  // app.save();
  app.load();

  for(var i = 0; i < this.screenMain.fields.length; i++)
  {
    this.screenMain.fields[i].init();
  }

  this.screenMain.tween({name: 'from_preloader'});

  // console.log(this)

  // var self = this;
  // TweenMax.delayedCall(2, function()
  // {
  //   self.screenMain.panelGameEnd.tween({name: 'show_anim', type: 'victory', field: self.screenMain.currentField});
  // });

  // var fieldInfo = 
  // {
  //   name: 'DIAMOND',
  //   type: 'rect',
  //   width: 9,
  //   height: 9
  // };

  // var panelEditor = new PanelEditor({name: 'xxx', parentPanel: guiManager.rootScene}, fieldInfo);
  // app.playAudio('sounds', 'sound_lose');
};

App.prototype.apiCallback = function(name, data)
{
  // console.log('Api:', name, data);
  if(parent && parent.cmgGameEvent)
  {
    if(data != null && data != undefined) parent.cmgGameEvent(name, data);
    else parent.cmgGameEvent(name);
  }
}


App.prototype.save = function()
{
  var data = {};
  for(var key in app.fieldsData)
  {
    data[key] = {score: app.fieldsData[key].score, isPlayed: app.fieldsData[key].isPlayed, isSolved: app.fieldsData[key].isSolved};
  }
  // console.log('Save:', data);

  var jsonString = JSON.stringify(data);

  localStorage.setItem('peg_solitaire_save', jsonString);
}
App.prototype.load = function()
{
  var data = localStorage.getItem('peg_solitaire_save');
  if(data == undefined || data == null) data = null;
  // // data = null;

  if(data == null) 
  {
    app.save();
    data = localStorage.getItem('peg_solitaire_save');
  }

  data = JSON.parse(data);

  for(var key in data)
  {
    app.fieldsData[key].score = data[key].score;
    app.fieldsData[key].isPlayed = data[key].isPlayed;
    app.fieldsData[key].isSolved = data[key].isSolved;
    app.fieldsData[key].field.updateScore();
  }

  // console.log('Load:', data);
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
};

App.instance = null;
App.getInstance = function()
{
  return App.instance;
};
//=========================================================================================================================================================================//
