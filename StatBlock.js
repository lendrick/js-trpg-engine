'use strict';

var statsCache = new Object();
require('js-yaml');
var merge = require('deepmerge');

class StatBlock {
  constructor(statBlockName) {   
    console.log('constructor');
    this.stats = StatBlock.getStats(statBlockName);
    console.log(this.stats);
  }
  
  static getStats(statBlockName) {
    console.log("getStats: " + statBlockName);
    if(!(statBlockName in statsCache)) {
      statsCache[statBlockName] = require('./stats/' + statBlockName + '.yml');
      if('parent' in statsCache[statBlockName]) {
        statsCache[statBlockName] = merge(StatBlock.getStats(statsCache[statBlockName].parent), statsCache[statBlockName]);        
      }
    }
    
    return Object.assign({}, statsCache[statBlockName]);
  }    
}

module.exports = StatBlock;
