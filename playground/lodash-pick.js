const _      = require('lodash');

const OBJ = {
	"Hey": "Hi",
	"Bye": "Fuku"
};

console.log(_.has(OBJ, ["Hey", "Bye"]) );
console.log(_.pick(OBJ,  ["Hey", "Non existent"]));


