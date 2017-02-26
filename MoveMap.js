class MoveMap {
	constructor() {
		this.map = {};		
	}

	set(x, y) {
		this.map[x + ',' + y] = { x: x, y: y };
	}

	unset(x, y) {
		var key = x + ',' + y;
		if(key in this.map) delete this.map[key];
	}

	get(x, y) {
		var key = x + ',' + y;
		return(key in this.map);
	}

	clear() {
		this.map = {};
	}
}

module.exports = MoveMap;