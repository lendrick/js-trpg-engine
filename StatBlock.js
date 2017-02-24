'use strict';

var statsCache = new Object();
require('json5');
require('json5/lib/require');

class StatBlock {
  constructor(statBlockName) {   
    console.log('constructor');
    this.stats = StatBlock.getStats(statBlockName);
    console.log(this.stats);
  }
  
  static getStats(statBlockName) {
    console.log("getStats: " + statBlockName);
    if(!(statBlockName in statsCache)) {
      statsCache[statBlockName] = require('./stats/' + statBlockName + '.json5');
      if('parent' in statsCache[statBlockName]) {
        statsCache[statBlockName] = Object.assign({}, StatBlock.getStats(statsCache[statBlockName].parent), statsCache[statBlockName]);        
      }
    }
    
    return Object.assign({}, statsCache[statBlockName]);
  }    
}

module.exports = StatBlock;
