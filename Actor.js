'use strict';

var StatBlock = require('./StatBlock');

class Actor extends StatBlock {
  constructor(statBlockName, init = {}, map, x, y) {  	
    super(statBlockName, init);  

    this.pos = { x: x, y : y };

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
		//this.displayGroup = global.game.add.group(null, this.stats.name)
    this.sprite = global.game.add.sprite(map.tileWidth * this.pos.x, map.tileHeight * this.pos.y);
    this.image = global.game.add.sprite(0, 0, this.stats.sprite);
    this.sprite.addChild(this.image);
    //this.sprite = global.game.add.sprite(0, 0, this.stats.sprite, null, this.displayGroup);
    //this.displayGroup.x = map.tileWidth * this.pos.x;
    //this.displayGroup.y = map.tileHeight * this.pos.y
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

  }

  setPos(x, y) {
  	this.pos = { x: x, y: y };
  }
}

module.exports = Actor;
