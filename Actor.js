'use strict';

var StatBlock = require('./StatBlock');
var MoveMap = require('./MoveMap');

class Actor extends StatBlock {
  constructor(statBlockName, init = {}, map, x, y) {  	
    super(statBlockName, init);  

    this.map = map;
    this.range = null;
    this.moveMap = new MoveMap();
/*
   	var sprite = this.stats.sprite;
    if(!global.game.load.checkKeyExists(sprite.name, 'spritesheet')) {
    	let sheet = 'sprites/' + sprite.sheet;
    	console.log('loading ' + sprite.sheet + ': ' + sheet);
    	console.log(sprite);
    	global.game.load.spritesheet(sprite.sheet, sheet, sprite.width, sprite.height);
    }
*/
	
		console.log(this.pos);
    this.sprite = global.game.add.sprite();
    this.image = global.game.add.sprite(0, 0, this.stats.sprite);
    this.sprite.addChild(this.image);
    this.image.scale.setTo(4, 4);

    this.text = global.game.add.text(0, -20, this.stats.name);
    this.text.setTextBounds(0, 0, 64, 20);
    this.text.boundsAlignH = 'center';
    this.text.fontSize = 16;
    this.text.fill = '#ffffff';
    this.text.stroke = '#000000';
    this.text.strokeThickness = 4;
    this.text.fontWeight = 'bold';
    this.sprite.addChild(this.text);
    this.setPos(x, y);
  }

  setPos(x, y) {
  	this.pos = { x: x, y: y };
  	this.sprite.x = this.map.tilemap.tileWidth * x;
  	this.sprite.y = this.map.tilemap.tileWidth * y;
  }

  showRange() {
  	var movement = this.get('mov');
  	this.moveMap.clear();
  	this.setMoves(this.pos.x, this.pos.y, movement);
  	//this.moveMap.unset(this.pos.x, this.pos.y);
  	//console.log(this.moveMap.map);

  	this.range = global.game.add.sprite();
  	this.range.alpha = 0.5;
  	this.sprite.addChild(this.range);
  	this.sprite.setChildIndex(this.range, 0);
  	for(var p in this.moveMap.map) {
  		let pos = this.moveMap.map[p];
  		let x = (pos.x - this.pos.x) * this.map.tilemap.tileWidth;
  		let y = (pos.y - this.pos.y) * this.map.tilemap.tileHeight;
  		let square = global.game.add.graphics();
  		this.range.addChild(square);
  		square.beginFill(0x7777ff);
  		square.drawRect(x, y, this.map.tilemap.tileWidth, this.map.tilemap.tileHeight);
  		square.endFill();
  		square.inputEnabled = true;
  		square.events.onInputDown.add(this.moveClick, this, null, pos);
  	} 
  }

  hideRange() {
  	this.range.destroy();
  }

  setMoves(x, y, movement) {
  	this.moveMap.set(x, y);
  	var moves = [
  		[1, 0],
  		[-1, 0],
  		[0, 1],
  		[0, -1],
  	];

  	var moveTypes = this.getList('moveTypes');
  	//console.log("Move types:");
  	//console.log(moveTypes);
  	//console.log(this.get('moveTypes'));

  	for(var m in moves) {
  		let mx = x + moves[m][0];
  		let my = y + moves[m][1];
	  	let tile = this.map.tilemap.getTile(mx, my, this.map.tilemap.layers[0].name);
	  		
	  		//console.log(tile.properties);

  		if(tile) {
	  		let moveCost = null;
	  		for(var t in moveTypes) {
	  			if(moveTypes[t] !== null) {
	  				let tmpCost = global.moveTypes[moveTypes[t]][tile.properties.type];
	  				if(moveCost === null || tmpCost < moveCost) {
	  					moveCost = tmpCost;
	  				}
	  			}
	  		}

	  		if(moveCost !== null && moveCost > 0) {
		  		let newMove = movement - moveCost;
		  		if(movement > 0 && this.map.getActorAt(mx, my) === null) this.setMoves(mx, my, newMove);
		  	}		  
		  }
  	}
  }

  moveClick(graphic, pointer, pos) {
  	console.log('click');
  	console.log(this);
  	console.log(pos);
  	this.setPos(pos.x, pos.y);
  	this.hideRange();
  	//this.showRange();

  	this.map.nextActor();
  }
}

module.exports = Actor;
