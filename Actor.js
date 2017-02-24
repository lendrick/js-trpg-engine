'use strict';

var StatBlock = require('./StatBlock');

class Actor extends StatBlock {
  constructor(statBlockName) {
    super(statBlockName);
  }
  
  attack(enemy) {
    var hitChance = this.get('hit') - enemy.get('dodge');
    if(Math.random() * 100 < hitChance) {
      var damage = Math.max(this.get('atk') - enemy.get('def'), 1);
      enemy.setMod('hp', -damage);
      return { status: 'hit', damage: damage };
    } else {
      return { status: 'miss', damage: 0 };
    }    
  }
}

module.exports = Actor;