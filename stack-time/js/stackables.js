//(function(){

var imagesDir = "images/";
var soundsDir = "audio/";
var preload;
var manifest = [];
var muteSounds = false;

var data;

//var padding = 10;
var num;
var grid;//array
//var gridSize = 45;
//var blockSize = 45;
//var gridPadding = 5;
//var blockPadding = 4;
var score;
var level;
var timerMS;
var typeCollected;
var typesCollected;
var built;
var colors = ['#F00', '#0F0', '#00F', '#FF0'];
var blockImages;
var builtImageParts;
var breadSlice;



var clicked = false;
var initialSetup = false;

$(document).ready(function(){
	// hide everything but preloader
	$('#stackables_left div').hide();
	$('#stackables_right div').hide();
	$('#stackables_audio_toggle').hide();
	
	getJSON();
});

function getJSON(){
	//console.log("loading JSON");
	$.getJSON('stackables.json', function(result){
		data = result;
		//console.log("loaded JSON");
		preloadAssets();
	}).fail(function(jqXHR, textStatus, errorThrown) {
		//console.log("JSON " + errorThrown);
	});
}

// find images in JSON and add to preload manifest
function recurse(key, val) {
	if (val instanceof Object) {
		$.each(val, recurse);
	} else {
		if (val.match(/\.(gif|jpg|jpeg|png)/gi)){
			var duplicate = false;
			for (var i = 0; i < manifest.length; i++){
				//console.log(val + " vs" + String(manifest[i]).split("/").pop());
				if (val == String(manifest[i]).split("/").pop()){
					duplicate = true;
					break;
				}
			}
			if (!duplicate){
				//console.log("add to manifest: " + val);
				manifest.push(imagesDir + val);
			}
		}
	}
}

// preload images and sounds
function preloadAssets(){

	//add images to manifest
	$.each(data, recurse);

	// add audio to manifest
	var fileType = ".mp3";
	var obj = data.stackables.sounds;
	for (var key in obj) {
		var val = obj[key];
		//console.log(key + ": " + soundsDir + val + fileType);
		manifest.push({id: key, src: soundsDir + val + fileType});
	}
	
	//console.log("manifest(" + manifest.length + "): " + manifest.toString());
	createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashPlugin]);
	createjs.Sound.alternateExtensions = ["ogg"];//"mp3", "m4a", "wav"
	preload = new createjs.LoadQueue(true);//use false for local testing - true required for audio
	preload.installPlugin(createjs.Sound);
	preload.setMaxConnections(5);
	preload.on("fileload", handleFileLoad);
	preload.on("progress", handleOverallProgress);
	preload.on("fileprogress", handleFileProgress);
	preload.on("error", handleFileError);
	loadAll();
}
	
function loadAll() {
	while (manifest.length > 0) {
		loadAnother();
	}
}

function loadAnother() {
	var item = manifest.shift();
	console.log(manifest.length, 'loading', item);
	preload.loadFile(item);
}

function handleFileLoad(event) {
	var img = event.result;
	console.log('loaded ' + event.item.id);
}

function handleFileProgress(event) {

}

function handleOverallProgress(event) {
	var percent = preload.progress * 100;
	//console.log('percent loaded: ' + percent);
	$('#stackables_preloader_bar').css('width', percent + '%');
	if (preload.progress == 1){
		//console.log("loading complete");
		$('#stackables_preloader').remove();
		if (preload != null) {
			preload.close();
		}
		init();
	}
}

function handleFileError(event) {
 	console.log('error loading ' + event.item.id + ': ' + event.target.error);
}

function init(){

	// size playing grid
	sizeGrid();
	$(window).resize(function() {
		sizeGrid();
	});

	// shortcuts
	blockImages = data.stackables.blockImages;	
	builtImageParts = data.stackables.builtImageParts;
	
	// add images pulled from JSON
	$('#stackables').css('background-image', 'url(' + imagesDir + data.stackables.backgroundImage + ')');
	$('#stackables_built_img').append("<img src='" + imagesDir + data.stackables.builtCounter.image +"' alt='" + data.stackables.builtCounter.altText + "' />");
	$('#stackables_level_img').append("<img src='" + imagesDir + data.stackables.levelCounter.image +"' alt='" + data.stackables.levelCounter.altText + "' />");
	$('#stackables_bonus').append("<img src='" + imagesDir + data.stackables.bonusImage + "' />");
	$('#stackables_collected_bg').css('background-image', 'url(' + imagesDir + data.stackables.builtImage + ')');
	for (var i=2; i<7; i++){
		$('#stackables_collected_container div:nth-child(' + i + ')').css({'background-image': 'url(' + imagesDir + builtImageParts[i-2] + ')', 'opacity': '0'});
	}
	
	// set up initial popup
	$('#stackables_popup p').text(data.stackables.text.intro);
	$('#stackables_popup button').text("Start Game");		
	$('#stackables_popup button').mousedown(function(event){
		event.preventDefault();
		$('#stackables_popup').hide();
		if (!initialSetup){
			// change pseudo element so window will from now on be centered
			$('#stackables_popup').addClass('full');
			initialSetup = true;
			startTimer();
		} else {
			newGame();
		}
	});
	
	// set up audio toggle
	$('#stackables_audio_toggle').mousedown(function(){
		toggleAudio();
	});
	
	// show stuff
	$('#stackables_popup').show();
	$('#stackables_left div').show();
	$('#stackables_right div').show();
	$('#stackables_audio_toggle').show();
		
	newGame();
}

function sizeGrid(){
	var square = $('#stackables_left').height();/*does not include padding*/
	
	// if in device portrait mode
	if ($('#stackables_left').css('float') == 'none'){
		//$('#stackables_timer').width() is not accurate!
		square = $(window).width() - parseFloat($('#stackables_timer').css('width')) - (parseFloat($('#stackables').css('padding')) * 3);//+1 in iPhone portrait to make perfect
	} else {
		$('#stackables_timer').removeAttr('style');/*MOVE UP?*/
	}
	
	$('#stackables_timer').css('height', square + 'px');
	
	console.log("grid size:",square);
	
	$('#stackables_blocks_holder').css({width: square + 'px', height: square + 'px'});
	
	// handle hiding bonus in portrait mode after reorient
	if ($('#stackables_bonus img').not(':hidden')){
		// if in portrait mode
		if ($('#stackables_left').css('float') == 'none'){
			$('#stackables_collected_box').hide();
		} else {
			$('#stackables_collected_box').show();
		}
	}
	
}


function newGame(){
	score = 0;
	level = 1;
	built = 0;
	breadSlice = 0;
	timerMS = 6000;
	typeCollected = -1;
	typesCollected = [0,0,0,0];	
	
	$('#stackables_collected_container').removeAttr('style');//hidden on game over in portrait mode
	$('.stackables_collected_item').css({opacity: 0});
	$('#stackables_bonus img').hide();
	$('#stackables_blocks').empty();
	
	resetGrid();
	populateGrid(7,4);
	updateScore();

	if (initialSetup){
		startTimer();
	}
}

// make 10x10 grid array of zeros
function resetGrid(){
	grid = [];
	num = 0;
	for (var r = 0; r < 10; r++){
		grid[r] = [];
		for (var c = 0; c < 10; c++){
			grid[r][c] = 0;
		}
	}
}


function populateGrid(startRow, rows){
	//var blockSize = gridSize - 7;//NOW 40
	for (var r = startRow - 1; r < startRow - 1 + rows; r++){
		for (var c = 0; c < 10; c++){
			num++;
			
			// record id number in grid
			if (!grid[r]){
				grid[r] = [];
			}
			grid[r][c] = num;
			
			var id = "block" + num;
			var type = Math.floor(Math.random() * 4);
			
			//$("#stackables_blocks").append("<div class='blockType" + type + "' id='" + id + "' row='" + r + "' col='" + c + "' type='" + type + "' matched='false' style='width:" + blockSize + "px; height:" + blockSize + "px;'></div>");
			//$("#stackables_blocks").append("<div class='block' id='" + id + "' style='width:" + blockSize + "px; height:" + blockSize + "px; background-image:url(" + imageDir + "/" + blockImages[type] + "); background-size: " + blockSize + "px " + blockSize + "px; background-color: " + data.stackables.blocks[type].color + "; cursor:pointer;'></div>");
			$("#stackables_blocks").append("<div class='block' id='" + id + "' style='background-image:url(" + imagesDir + data.stackables.blocks[type].image + "); background-size: 100%; background-color: " + data.stackables.blocks[type].color + "; cursor:pointer;'></div>");
			
			var thisBlock = $("#block"+num);
			//thisBlock.css({top: gridPadding + r * (blockSize + blockPadding), left: gridPadding + c * (blockSize + blockPadding)});
			thisBlock.css({top: r * 10 + '%', left: c * 10 + '%'});
			thisBlock.data({'row': r, 'col': c, 'type': type, 'matched': false});
			
			//$("#block"+num).mousedown(function() {
			$("#block"+num).bind('click touchstart', function(e){
				//disable touch on tablet?
				e.stopPropagation(); 
				e.preventDefault();
				//if (!clicked){
				clicked = true;
				check($(this));
				removeMatched();
				collect();
				drop();
					//setTimeout(function(){ clicked = false; }, 100);
				//}
				//logGrid();
			});
			//addEventListener("touchstart", handleStart, false);
			//$('#whatever').on({ 'touchstart' : function(){ /* do something... */ } });
			/*
			$(controlName).bind('touchend click', function(e) {
			e.stopPropagation();
			e.preventDefault();
			*/
		}
	}	
}

// place blocks based on array values
function placeBlocks(){
	for (var r = 0; r < grid.length; r++){
		for (var c = 0; c < 10; c++){
			if (grid[r][c]){
				//$("#block"+grid[r][c]).css({top: gridPadding + r * (blockSize + blockPadding), left: gridPadding + c * (blockSize + blockPadding)});
				$("#block"+grid[r][c]).css({top: r * 10 + '%', left: c * 10 + '%'});
				$("#block"+grid[r][c]).data("row", r);
			}
		}
	}		
}

// animate timer based on timerMS variable
function startTimer(){
	$("#stackables_timer_bar").css("height", "0%").animate({height: "100%"}, timerMS, "linear", function(){
		onTimer();
	});	
}

// called when timer is up
function onTimer(){
	playSound("rise");
	grid.shift();//remove top row
	populateGrid(10, 1);//add a new row
	placeBlocks();
	//logGrid();

	var topRowEmpty = true;
	for (var c = 0; c < 10; c++){
		if (grid[0][c] != 0){
			topRowEmpty = false;
			break;
		}
	}
	if (topRowEmpty){
		startTimer();
	} else {	
		gameOver();
	}
}

function gameOver(){
	playSound("gameOver");
	
	var gameOverMessage = data.stackables.text.gameOver.split("[#]").join(built);
	if (built == 1){
		gameOverMessage = gameOverMessage.split("(s)").join("").split("(es)").join("");
	} else {
		gameOverMessage = gameOverMessage.split("(s)").join("s").split("(es)").join("es");
	}
	$('#stackables_popup p').text(gameOverMessage);
	$('#stackables_popup button').text("Play Again");
	$('#stackables_popup').show();
	$(".block").off().css('cursor', 'default');
	if (score){
		$('#stackables_bonus img').show();
		// if in portrait mode
		if ($('#stackables_left').css('float') == 'none'){
			$('#stackables_collected_container').hide();
		}
	}
}

function check(block){

	var typ = block.data('type');
	var row = block.data('row');
	var col = block.data('col');
	var matches = [];
	
	console.log("check " + block.attr('id') + " row:" + row + " col:" + col + " type:" + typ);
	
	if (row){
		var blockAbove = grid[row-1][col];
		//console.log("	blockAbove " + blockAbove + " type:" + $("#block"+blockAbove).data('type'));
		if (blockAbove != 0){
			if ($("#block"+blockAbove).data('type') == typ && !$("#block"+blockAbove).data('matched')){
				block.data('matched', true);
				matches.push(blockAbove);
				//console.log("MATCH!");
			}
		}
	}
	
	if (row < 9){
		var blockBelow = grid[row+1][col];
		//console.log("	blockBelow " + blockBelow + " type:" + $("#block"+blockBelow).data('type'));
		if (blockBelow != 0){
			if ($("#block"+blockBelow).data('type') == typ && !$("#block"+blockBelow).data('matched')){
				block.data('matched', true);
				matches.push(blockBelow);
				//console.log("MATCH!");
			}
		}
	}
	
	if (col){
		var blockLeft = grid[row][col-1];
		//console.log("	blockLeft " + blockLeft + " type:" + $("#block"+blockLeft).data('type'));
		if (blockLeft != 0){
			if ($("#block"+blockLeft).data('type') == typ && !$("#block"+blockLeft).data('matched')){
				block.data('matched', true);
				matches.push(blockLeft);
				//console.log("MATCH!");
			}
		}
	}
	
	if (col < 9){
		var blockRight = grid[row][col+1];
		//console.log("	blockRight " + blockRight + " type:" + $("#block"+blockRight).data('type'));
		if (blockRight != 0){
			if ($("#block"+blockRight).data('type') == typ && !$("#block"+blockRight).data('matched')){
				block.data('matched', true);
				matches.push(blockRight);
				//console.log("MATCH!");
			}
		}
	}

	//console.log(matches.length + " matches: " + matches.toString());
	for (var i = 0; i < matches.length; i++){
		$("#block"+matches[i]).data('matched', true);
		check($("#block"+matches[i]));
	}
	if (matches.length){
		typeCollected = typ;
	}
}

function removeMatched(){
	//console.log("removeMatched");
	var sound = "match";
	var matched = false;
	for (var r = 0; r < 10; r++){
		for (var c = 0; c < 10; c++){
			if (grid[r][c]){
				//console.log(r,c,$("#block"+grid[r][c]).data('matched'));
				if ($("#block"+grid[r][c]).data('matched') == true){
					//console.log("REMOVING!");
					$("#block"+grid[r][c]).removeData();//safety
					//$("#block"+grid[r][c]).hide();
					//$("#block"+grid[r][c]).css('top', '700px');//pieces or border were being left behind on edge of box container and timer in Firefox without this even if using hide
					$("#block"+grid[r][c]).off();//safety
					$("#block"+grid[r][c]).remove();
					grid[r][c] = 0;
					score += 100;
					if (score % 2000 == 0){
						level++;
						timerMS -= 200;
						sound = "levelUp";
					}
					matched = true;
				}
			}
		}
	}
	updateScore();
	if (matched){
		playSound(sound);	
	} else {
		playSound("nomatch");
	}
}

function drop(){
	//console.log("drop");
	for (var r = 8; r > -1; r--){
		for (var c = 0; c < 10; c++){
			if (grid[r][c]){
				var rTo = 0;
				for (var rNext = r + 1; rNext < 10; rNext++){
					if (!grid[rNext][c]){
						rTo = rNext;
					}
				}
				if (rTo > 0){	
					grid[rTo][c] = grid[r][c];
					grid[r][c] = 0;
					//console.log("rTo", rTo * 10 + '%');
					//$("#block"+grid[rTo][c]).css({top: gridPadding + rTo * (blockSize + blockPadding), left: gridPadding + c * (blockSize + blockPadding)});
					$("#block"+grid[r][c]).css({top: rTo * 10 + '%', left: c * 10 + '%'});//doesn't work in chrome?
					//$("#block"+grid[rTo][c]).attr('row', rTo);
					$("#block"+grid[rTo][c]).data('row', rTo);
					//console.log(r + ":" + c + " to " + rTo + ":" + c);
				}
			}
		}
	}
	placeBlocks();//why?
}

function collect(){
	if (typeCollected > -1){
		console.log("collected",typeCollected);
		typesCollected[typeCollected] = 1;
		var childNum = typeCollected + 2;
		if (!typeCollected){
			if (!breadSlice){
				breadSlice++;
			} else {
				childNum = 6;
				typesCollected[4] = 1;
			}
		}
		$('#stackables_collected_container div:nth-child(' + childNum + ')').css('opacity', '1');

		//$('#stackables_collected_container div:nth-child(' + Number(typeCollected + 2) + ')').removeAttr('style').css('background-image', 'url(' + imageDir + "/" + builtImageParts[typeCollected] + ')');
	}
	if (typesCollected.toString() == "1,1,1,1,1"){
		built++;
		updateScore();
		typesCollected = [];
		breadSlice = 0;
		$('.stackables_collected_item').animate({opacity: 0}, 'slow');
		playSound("built");
	}
}

function updateScore(){
	$('#score span').html(score);
	$('#stackables_level').html(level);
	$('#stackables_built').html(built);	
}

function playSound(name, loop) {
	if (!muteSounds){
		var instance = createjs.Sound.play(name, createjs.Sound.INTERRUPT_ANY);
		console.log("playSound", name, instance);
		instance.addEventListener("failed", function(event){console.log("failed", event.target);});
		instance.addEventListener("complete", function(event){console.log("complete", event.target);});
	}
}

function toggleAudio(){
	if (muteSounds){
		muteSounds = false;
		createjs.Sound.setMute(false);
		$('#stackables_audio_toggle div').removeClass('fa-volume-off').addClass('fa-volume-up');
	} else {
		muteSounds = true;
		createjs.Sound.setMute(true);
		$('#stackables_audio_toggle div').removeClass('fa-volume-up').addClass('fa-volume-off');
	}
	console.log("muteSounds: " + muteSounds);
}

function logGrid(){
	for (var r = 0; r < grid.length; r++){
		console.log(r + ": " + grid[r].toString());
	}		
}

//}());