'use strict';

const fs = require('fs');
console.log(window.devicePixelRatio);

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update }, null, false, false);
var StatBlock = require('./StatBlock');
var Actor = require('./Actor');
var GameMap = require('./GameMap');
var yaml  = require('js-yaml');

global.$ = $;

var map;

global.game = game;

function preload() {
	/*
	game.load.tilemap('test', 'maps/test.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles', 'tiles/tiles.png');
	*/

	var assets = yaml.safeLoad(fs.readFileSync('assets.yml', 'utf8'));
	global.moveTypes = yaml.safeLoad(fs.readFileSync('moveTypes.yml', 'utf8'));
	for(var tilemap in assets.tilemaps) {
		game.load.tilemap(tilemap, assets.tilemaps[tilemap].file, null, Phaser.Tilemap.TILED_JSON);
	}

	for(var image in assets.images) {
		game.load.image(image, assets.images[image].file);
	}

	for(var spritesheet in assets.spritesheets) {
		game.load.spritesheet(spritesheet, assets.spritesheets[spritesheet].file, assets.spritesheets[spritesheet].width, assets.spritesheets[spritesheet].height);
	}
}

function create() {
	/*
	var map = game.add.tilemap('test');
  map.addTilesetImage('tiles', 'tiles');
  var layer = map.createLayer('layer1');
  layer.resizeWorld();
	*/
	game.stage.smoothed = false;
	game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;  
	game.scale.setUserScale(1, 1);
	

	// enable crisp rendering
	game.renderer.renderSession.roundPixels = true;  
	Phaser.Canvas.setImageRenderingCrisp(this.game.canvas) 

	map = new GameMap('test', { tiles: 'tiles'});
	global.currentMap = map;
	map.nextActor();
	
	//var overlay = game.add.tileSprite(0, 0, 1920, 1080, 'overlay');
	//overlay.alpha = 0.5;

	/*
	var actor1 = new Actor('actor');
	var actor2 = new Actor('actor');

	actor1.set('exp', 500);
	actor2.set('exp', 1500);

	actor1.equip('weapon', 0, 'items/weapons/swordIronShort');
	actor2.equip('weapon', 0, 'items/weapons/poisonDart');

	console.log(actor1.get('hp'));
	console.log(actor2.useAbility('attack', actor2, [actor1]));
	console.log(actor1.get('hp'));
	*/
} 

function update() {
}