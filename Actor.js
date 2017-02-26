'use strict';

var StatBlock = require('./StatBlock');

class Actor extends StatBlock {
  constructor(statBlockName, init = {}) {  	
    super(statBlockName, init);   
  }
}

module.exports = Actor;
