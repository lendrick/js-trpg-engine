'use strict';

var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var StatBlock = require('./StatBlock');
var Actor = require('./Actor');
var GameMap = require('./GameMap');

global.game = game;
var map;

function preload() {
	game.load.tilemap('test', 'maps/test.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles', 'tiles/tiles.png');
}

function create() {
	/*
	var map = game.add.tilemap('test');
  map.addTilesetImage('tiles', 'tiles');
  var layer = map.createLayer('layer1');
  layer.resizeWorld();
	*/

	map = new GameMap('test', { tiles: 'tiles'});

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