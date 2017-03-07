'use strict';

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

var statsCache = new Object();
var yaml  = require('js-yaml');
var merge = require('deepmerge');
var fs    = require('fs');

class StatBlock {
  constructor(statBlockName, init = {}) {   
    this.stats = StatBlock.getStats(statBlockName);
    this.modifiers = new Object();
    this.equipment = new Object();
    this.status = new Object();
    this.name = statBlockName;
    
    // Populate equipment
    for(var slotName in this.stats.slots) {
      this.equipment[slotName] = new Object();
      for(let i = 0; i < this.stats.slots[slotName].count; i++) {
        this.equipment[slotName][i] = null;
      }
    }
    
    for(var key in init) {
      this[key] = merge(this[key], init[key], { clone: true });
    }
  }
  
  get(statName) {
    if(!(statName in this.stats.values)) {
      return null;
    }
        
    let val = this.getBase(statName);
    if(val !== null && typeof val == 'object' && 'list' in val) {
      if(!('add' in val.list)) val.list.add = [];
      if(!('remove' in val.list)) val.list.remove = [];
      for(var slotName in this.equipment) {
        for(var i in this.equipment[slotName]) {
          if(this.equipment[slotName][i] !== null) {
            let equipVal = this.equipment[slotName][i].get(statName);
            if(equipVal !== null && typeof equipVal == 'object' && 'list' in equipVal) {
              val.list.add = Array.concat(val.list.add, equipVal.list.add);
              val.list.remove = Array.concat(val.list.remove, equipVal.list.remove);
            }
          }
        }
      }
      
      let mod = this.modifiers[statName];
      if(mod !== null && typeof mod == 'Object' && 'list' in mod) {
        if('add' in mod.list) val.list.add = Array.concat(val.list.add, mod.list.add);
        if('remove' in mod.list) val.list.remove = Array.concat(val.list.remove, mod.list.remove);
      }
    } else {
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
    }
    
    return val;
  }


  // TODO: I lazily copy and pasted this from this.get()
  getMax(statName) {
    if(!(statName in this.stats.values)) {
      return null;
    }
        
    let val = this.getBase(statName);
    if(val !== null && typeof val == 'object' && 'list' in val) {
      if(!('add' in val.list)) val.list.add = [];
      if(!('remove' in val.list)) val.list.remove = [];
      for(var slotName in this.equipment) {
        for(var i in this.equipment[slotName]) {
          if(this.equipment[slotName][i] !== null) {
            let equipVal = this.equipment[slotName][i].get(statName);
            if(equipVal !== null && typeof equipVal == 'object' && 'list' in equipVal) {
              val.list.add = Array.concat(val.list.add, equipVal.list.add);
              val.list.remove = Array.concat(val.list.remove, equipVal.list.remove);
            }
          }
        }
      }
    } else {
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
    }
    
    return val;
  }
  
  getList(statName) {
    var list = this.get(statName);
    var result = list.list.add;
    for(var i in list.list.remove) {
      var index = result.indexOf(list.list.remove[i]);
      if (index > -1) {
        result.splice(index, 1);
      }
    }
    return result;
  }

  getBase(statName) {
    if(!(statName in this.stats.values)) {
      return null;
    }

    if('list' in this.stats.values[statName]) {
      return this.stats.values[statName];
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
  
  getMod(statName) {
    if(!(statName in this.stats.values)) {
      return null;
    }
    
    if(!(statName in this.modifiers)) {
      return 0;
    }
    
    return this.modifiers[statName];
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
  
  /*
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
  */
  
  hasAbility(abilityName) {
    console.log(this.stats.name + " hasAbility " + abilityName);    
    return this.getAbilities().includes(abilityName);    
  }
  
  getAbilities() {
    var abilities = [];
    for(a in this.stats.abilities) {
      abilities.push(a);
    }
    for(var slotName in this.equipment) {
      for(var count in this.equipment[slotName]) {
        if(this.equipment[slotName][count] !== null) {
          itemAbilities = this.equipment[slotName][count].getAbilities();
          for(var a in itemAbilities) {
            if(!abilities.includes(itemAbilities[a])) abilities.push(itemAbilities[a]);
          }
        }
      }
    }
    console.log(this.stats.name + " getAbilities")
    console.log(abilities);
    return abilities;
  }
  
  useAbility(abilityName, user, targets = [], parents = []) {
    console.log(this.stats.name + " useAbility: " + abilityName);
    for(var slotName in this.equipment) {
      for(var count in this.equipment[slotName]) {
        if(this.equipment[slotName][count] !== null) {
          if(this.equipment[slotName][count].hasAbility(abilityName)) {
            parents.push(this);
            let values = this.equipment[slotName][count].stats.values;
            var result = this.equipment[slotName][count].useAbility(abilityName, user, targets, parents);
            return result;
          }
        }
      }
    }
    let values = this.stats.values;
    let self = this;
    var result = eval("(function() {" + this.stats.abilities[abilityName].function + "})();")
    eval(this.stats['onAbility' + abilityName.capitalize()]);
    return result;
  }
  
  addStatus(statusName) {
    console.log(this.stats.name + " addStatus: " + statusName);
    if(!(statusName in this.status)) {
      this.status[statusName] = new StatBlock(statusName);    
    }
  }
  
  removeStatus(statusName) {
    if(statusName in this.status) {
      delete this.status[statusName];
    }
  }
  
  turn(parents = []) {    
    if('onTurn' in this.stats) {
      let self = this;
      eval("(function() {" + this.stats.onTurn + "})();");
    }
    
    parents.push(this);
    
    for(var slotName in this.equipment) {
      for(var count in this.equipment[slotName]) {
        if(this.equipment[slotName][count] != null) {
          this.equipment[slotName][count].turn(parents);
        }
      }
    }
    
    for(var statusName in this.status) {
      this.status[statusName].turn(parents);
    }
  }
    
  static getStats(statBlockName) {
    console.log("getStats: " + statBlockName);
    if(!(statBlockName in statsCache)) {
      statsCache[statBlockName] = yaml.safeLoad(fs.readFileSync('./stats/' + statBlockName + '.yml', 'utf8'));
      if('parent' in statsCache[statBlockName]) {
        statsCache[statBlockName] = merge(StatBlock.getStats(statsCache[statBlockName].parent), statsCache[statBlockName], { clone: true });        
      }
    }
    
    return merge({}, statsCache[statBlockName], { clone: true });
  }    
}

module.exports = StatBlock;
