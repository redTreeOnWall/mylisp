var  VoidLisp  = require("./VoidLisp").VoidLisp

var fs = require("fs")


var args = process.argv.splice(2)

if(args.length>=1){
	var lisp = fs.readFileSync(args[0]).toString()

	var res = new VoidLisp().Eval(lisp)
}


