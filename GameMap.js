var StatBlock = require('./StatBlock');
var Actor = require('./Actor');

class GameMap {
	constructor(tilemap, tilesets) {
		this.tilemap = global.game.add.tilemap(tilemap);
		this.tilemap.setTileSize(64, 64);
		this.actors = {};

		for(name in tilesets) {
			this.tilemap.addTilesetImage(name, tilesets[name]);
		}		
	  this.layer = this.tilemap.createLayer(this.tilemap.layers[0].name);
	  //layer.resizeWorld();

//	  overlay = global.game.add.tileSprite(0, 0, 1920, 1080, 'overlay');
//		overlay.alpha = 0.5;
		var overlay = global.game.add.tileSprite(0, 0, 1920, 1080, 'overlay');
		overlay.alpha = 0.5;
		this.layer.addChild(overlay);

	  for(var layer in this.tilemap.objects) {
	  	for(var object in this.tilemap.objects[layer]) {
		  	this.addActor(this.tilemap.objects[layer][object], layer);
		  }
	  }
	}

	addActor(object, layer) {
		console.log(object);
		var pos = {
			x: object.x / this.tilemap.tileWidth,
			y: object.y / this.tilemap.tileHeight,
		};
		var name = object.name;
		while(name in this.actors) {
			name = name + '_';
		}
		this.actors[name] = new Actor(object.type, {}, this.tilemap, pos.x, pos.y);
		console.log(name);
		console.log(this.actors[name]);
		this.layer.addChild(this.actors[name].sprite);
	}
}

module.exports = GameMap;