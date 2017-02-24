var JSON5 = require('json5');
console.log('hello');
var StatBlock = require('./StatBlock');
var Actor = require('./Actor');

var actor1 = new Actor('actor');
var actor2 = new Actor('actor');

actor1.set('exp', 500);
actor2.set('exp', 1500);

actor1.equip('weapon', 0, 'items/swordIronShort');
actor1.equip('weapon', 0, 'items/swordWood');

console.log(actor2.get('hp'));
actor1.attack(actor2);
console.log(actor2.get('hp'));