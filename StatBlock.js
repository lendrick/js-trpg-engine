'use strict';

var statsCache = new Object();
var yaml  = require('js-yaml');
var merge = require('deepmerge');
var fs    = require('fs');

class StatBlock {
  constructor(statBlockName) {   
    this.stats = StatBlock.getStats(statBlockName);
    this.modifiers = new Object();
    this.equipment = new Object();
    this.name = statBlockName;
    
    // Populate equipment
    for(var slotName in this.stats.slots) {
      this.equipment[slotName] = new Object();
      for(let i = 0; i < this.stats.slots[slotName].count; i++) {
        this.equipment[slotName][i] = null;
      }
    }
  }
  
  get(statName) {
    if(!(statName in this.stats.values)) {
      return null;
    }
        
    let val = this.getBase(statName);
    for(var slotName in this.equipment) {
      for(var i in this.equipment[slotName]) {
        if(this.equipment[slotName][i] !== null) {
          let equipVal = this.equipment[slotName][i].get(statName);
          if(equipVal !== null) {
            val += equipVal;
          }
        }
      }
    }
    
    if(statName in this.modifiers) val += this.modifiers[statName];
    
    return val;
  }
  
  getBase(statName) {
    if(!(statName in this.stats.values)) {
      return null;
    }
    
    if('value' in this.stats.values[statName]) {
      return this.stats.values[statName].value;
    }
    
    if('formula' in this.stats.values[statName]) {
      var values = this.stats.values;
      var curve = this.stats.curve;
      return eval(this.stats.values[statName].formula);
    }
    
    if('default' in this.stats.values[statName]) {
      return this.stats.values[statName].default;
    }
    
    return NULL;
  }
  
  set(statName, value) {
    this.stats.values[statName].value = value;
  }
  
  setMod(statName, value) {
    this.modifiers[statName] = value;
    this.clampMod(statName);
  }
  
  addMod(statName, value) {
    if(!(statName in this.modifiers)) this.modifiers[statName] = 0;
    this.modifiers[statName] += value;
    this.clampMod(statName);
  }
  
  clampMod(statName) {
    if('clampMod' in this.stats.values[statName]) {
      var clamp = this.stats.values[statName].clampMod;
      var values = this.stats.values;
      var curve = this.stats.curve;
      this.modifiers[statName] = Math.min(this.modifiers[statName], eval(clamp.max));
      this.modifiers[statName] = Math.max(this.modifiers[statName], eval(clamp.min));
    }
  }
  
  getName() {
    return this.name;
  }
  
  getDisplayName() {
    return this.stats.name;
  }
  
  equip(slotName, num, item) {
    if(slotName in this.equipment && num in this.equipment[slotName]) {
      this.equipment[slotName][num] = new StatBlock(item);
    }
  }
  
  unequip(slotName, num) {
    if(slotName in this.equipment && num in this.equipment[slotName]) {
      this.equipment[slotName][num] = null;
    }
  }
  
  use(itemName) {
    var item = new StatBlock(itemName);
    for(var statName in item.stats.values) {
      if(statName in this.stats.values) {
        let val = item.get(statName);
        if(val != 0) {
          console.log(statName + ": " + val);
          this.addMod(statName, item.get(statName));        
        }
      }
    }
  }
  
  static getStats(statBlockName) {
    console.log("getStats: " + statBlockName);
    if(!(statBlockName in statsCache)) {
      statsCache[statBlockName] = yaml.safeLoad(fs.readFileSync('./stats/' + statBlockName + '.yml', 'utf8'));
      if('parent' in statsCache[statBlockName]) {
        statsCache[statBlockName] = merge(StatBlock.getStats(statsCache[statBlockName].parent), statsCache[statBlockName]);        
      }
    }
    
    return Object.assign({}, statsCache[statBlockName]);
  }    
}

module.exports = StatBlock;
