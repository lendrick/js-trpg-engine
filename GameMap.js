var StatBlock = require('./StatBlock');
var Actor = require('./Actor');

class GameMap {
	constructor(tilemap, tilesets) {
		this.tilemap = global.game.add.tilemap(tilemap);
		this.actors = {};

		for(name in tilesets) {
			this.tilemap.addTilesetImage(name, tilesets[name]);
		}		
	  var layer = this.tilemap.createLayer(this.tilemap.layers[0].name);
	  layer.resizeWorld();

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
		this.actors[object.name] = new Actor(object.type, { pos: pos });
		console.log(object.name);
		console.log(this.actors[object.name]);
	}
}

module.exports = GameMap;