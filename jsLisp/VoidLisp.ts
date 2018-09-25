class VoidLisp {
	public  TestExe() {
		var code = `
		(list 
			(print 'hello world')
			(print (+ 1 2 ) )
			(print
				(+ 1 2 (* 3 3))
			)
		)
		 `
		var tokens = this.Token(code);
		var met    = this.getAst(tokens).Exec();
	}


	private           P:number;
	private List:  Array<string> ;

	private Ast() {
		var met = new Met(this,MetType.List,"list");
		met.Type = MetType.List;
		var tree = new Array<Met>();
		met.Mets = tree;
		while (true) {
			if (this.P >= this.List.length) {
				console.log("tree err");
				return null;
			}

			var m = this.List[this.P];
			this.P = this.P + 1;
			if (m === "(") {
				var newMet = this.Ast();
				tree.push(newMet);
			}

			if (m === ")") {
				return met;
			}

			if (m != "(" && m != ")") {
				var notListMet = new Met(this);
				tree.push(notListMet);
				var mList = m;
				if (mList[0] == '"' && mList[mList.length - 1] == '"') {
					notListMet.Type = MetType.StringMet;
					var s = "";
					for (var i = 0; i < mList.length; i++) {
						if (i != 0 && i != mList.length - 1) {
							s = s + mList[i];
						}
					}
					notListMet.MetContent = s;
					continue;
				}

				notListMet.Type       = MetType.BaseMat;
				notListMet.MetContent = m;
			}
		}
	}

	//语法分析 生成语法树
	public getAst(li : Array<string> ) {
		this.P    = 1;
		this.List = li;
		if (this.List[0] != "(") {
			console.log("tree err");
			return null;
		}

		return this.Ast();
	}

	//词法分析
	private  Token(exp : string) {

		var l1 = exp;
		var l2 = new Array <string>();

		var  token      = "";
		var  isInString = false;
		var isInAno = false
		for (var i = 0; i < l1.length; i++) {
			var tc = l1[i];
			
			if(tc === ';'){
				isInAno = true;
			}	
			if(tc === '\r' || tc === '\n'){
				isInAno = false
			}

			if(isInAno){
				continue
			}

			if (tc === '"') {
				if (!isInString && token !== "") {
					l2.push(token);
				}

				if (isInString) {
					token = token + tc;
					l2.push(token);
					token      = "";
					isInString = false;
					continue;
				} else {
					isInString = true;
				}
			}

			if (!isInString) {

				if (tc === ' ' || tc === '\r' || tc === '\n' || tc ==="\t") {
					if (token !== "") {
						l2.push(token);
					}

					token = "";
					continue;
				}

				if (tc === '(' || tc === ')') {
					if (token !=="") {
						l2.push(token);
					}

					l2.push(tc);
					token = "";
					continue;
				}
			}

			token = token + tc;
		}

		return l2;
	}

	public Eval( code: string) {
		var tokens = this.Token(code);
		var met    = this.getAst(tokens).Exec();
		return met;
	}


	public Functions = {
		"q": li =>{
			return li[0]
		},
		"exec": li => {
			return li[0].Exec()
		},
		"list":li =>{
			var met = new Met(this,MetType.List)
			met.Mets = li;
			met.MetContent = "list"
			return met;
		},
		"push" : li => {
			var met =  new Met(this,MetType.List,"list")
			li[1].Mets.push(li[0])
			met.Mets = li[1].Mets
			console.log(met)
			return met
		},
		"index": li => {
			var list  = li[1]
			var index = li[0]
			var met = li[1].Mets[parseInt(li[0].MetContent)] 
			if(met === undefined) {
				throw "list out of range ,inde:" + parseInt(li[0].MetContent)
			}
			return met
		},
		"print" : li => {
			var s = ""
			for(var i =0 ;i< li.length;i++){
				s = s + li[i].Exec().MetContent
			}
			var met = new Met(this,MetType.BaseMat,s)
			console.log(s)

		},
		"or": li =>{
			var met = new Met(this,MetType.BaseMat,"F")
			for(var i =0 ;i< li.length;i++){
				if(li[i].Exec().MetContent === "T"){
					return new Met(this,MetType.BaseMat,"T")
				}
			}
			return met;
		},
		"and" :li =>{
			var met = new Met(this,MetType.BaseMat,"T")
			for(var i =0 ;i< li.length;i++){
				if(li[i].Exec().MetContent === "F"){
					return new Met(this,MetType.BaseMat,"F")
				}
			}
			return met;
		},
		"not" : li=>{
			return li[0].Exec().MetContent === "F" ? new Met(this,MetType.BaseMat,"T"):new Met(this,MetType.BaseMat,"F");
		},
		"==" : li =>{
			if(li[0].Exec().MetContent === li[1].Exec().MetContent) {
				return new Met(this,MetType.BaseMat,"T")
			}else{
				return new Met(this,MetType.BaseMat,"F")
			}
		},
		"<" : li => {
			var f1 =parseFloat( li[0].Exec().MetContent)
			var f2 =parseFloat( li[1].MetContent)
			if(f1< f2) {
				return new Met(this,MetType.BaseMat,"T")
			}else{
				return new Met(this,MetType.BaseMat,"F")
			}
		},
		">" : li => {
			var f1 =parseFloat( li[0].MetContent)
			var f2 =parseFloat( li[1].MetContent)
			if(f1 > f2) {
				return new Met(this,MetType.BaseMat,"T")
			}else{
				return new Met(this,MetType.BaseMat,"F")
			}
		},
		"+":li =>{
			var first = parseFloat(li[0].MetContent)
			for(var i = 1;i<li.length ;i++){
				var n  =parseFloat(li[i].MetContent) 
				first = first + n;
			}
			var met = new Met(this,MetType.BaseMat,first+"")
			return met
		},
		"-":li =>{
			var first = parseFloat(li[0].MetContent)
			for(var i = 1;i<li.length ;i++){
				var n  =parseFloat(li[i].MetContent) 
				first = first - n;
			}
			var met = new Met(this,MetType.BaseMat,first+"")
			return met
		},
		"*":li =>{
			var first = parseFloat(li[0].MetContent)
			for(var i = 1;i<li.length ;i++){
				var n  =parseFloat(li[i].MetContent) 
				first = first * n;
			}
			var met = new Met(this,MetType.BaseMat,first+"")
			return met
		},
		"/":li =>{
			var first = parseFloat(li[0].MetContent)
			for(var i = 1;i<li.length ;i++){
				var n  =parseFloat(li[i].MetContent) 
				first = first / n;
			}
			var met = new Met(this,MetType.BaseMat,first+"")
			return met
		},
		"if" : li => {
			var isT = li[0]
			if(isT.MetContent === "T") {
				return li[1].Exec()
			}else{
				return li[2].Exec()
			}
		},
		"while": li =>{
			while (li[0].MetContent ==="T"){
				var p = li[1].Exec()
			}
			return new Met(this)
		},
		"def" : li => {
			//value
			var v = li[1];
			this.Functions[li[0].MetContent] = lii=>{return v}
			return new Met(this)
		},
		"lambda" : li =>{
			if(li[1].Type != MetType.List){
				throw "no paramLis:t "+ li[0].MetContent
			}
			//Function
			var paramList = li[1].Mets
			this.Functions[li[0].MetContent] = lii =>{
				//give memery before function invoke
				for(var i = 0 ;i<paramList.length ;i++){
					var p = lii[i]
					this.Functions[paramList[i].MetContent] =  l => {return p}
				}
				//TODO: release memery when function invoked
				return li[2].Exec();
			}
			return new Met(this)
		}
	}
}


enum MetType {
	BaseMat,
		List,
		StringMet,
		NumberMet
}
class Met {
	public  eviroment : VoidLisp;
	public constructor( eviroments: VoidLisp, types : MetType = MetType.BaseMat, content : string = "Nil") {
		this.Type = types;
		this.eviroment = eviroments;
		this.MetContent = content;
	}


	public    Token : string
	public  Mets : Array<Met>;
	public    Type : MetType;
	public     MetContent : string;

	public Exec() {
		switch (this.Type) {
			case MetType.BaseMat:
				if (this.eviroment.Functions[this.MetContent] != undefined) {
					return this.eviroment.Functions[this.MetContent]().Exec();
				} else {
					return this;
				}
			case MetType.List:
				var n1        = this.Mets[0];
				var paramList = new Array<Met>();
				for (var i = 0; i < this.Mets.length; i++) {
					if (i == 0) {
						continue;
					}
					var li    = this.Mets[i]
					var param = li;
					paramList.push(param);
				}
				var result = this.eviroment.Functions[n1.MetContent](paramList);
				return result;
			case MetType.StringMet:
				return this;
			case MetType.NumberMet:
				return this;
		}
	}

	public Print() {
		console.log(this)
		switch (this.Type) {
			case MetType.BaseMat:
				console.log(this.MetContent);
				break;
			case MetType.List:
				console.log("---------------");
				break;
			case MetType.StringMet:
				console.log(this.MetContent);
				break;
			case MetType.NumberMet:
				break;
		}
	}
}

var code = 
`
(runlist (print 'hello world')

	(print ( or  (< 1 -2) (> 2 3)))
	(print ( < -12 (+ 0 1)))

	(let var 15)
	(print var)
	(let var 'hello world')
	(print var)

	(def log (s) (print s))
	(log 'test log')

	(let i 1)
	(while (< i 100) 
		(runlist (print i)
			(let i (+ i 1))))

	(print 'end'))

`

//var lisp =  new VoidLisp();
//var s =lisp.Eval(code).MetContent;
//

export {VoidLisp}
