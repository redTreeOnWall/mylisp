console.log("== ts lisp ==")

var code = `
(+ 123  24
    (+ 33 55) 
    (+ 82 8134) 11 22)
`
code =`(print helloWorld)`

code =`
    (+ (- 5 4) 1 
        (- 6 3)
        (+ 12 99))
`

//符号表
var fuc:any ={
    "+":(l:Array<Met>)=>{
        var sum:any = 0;
        for(var e in l){
            var num =parseFloat(l[e].metName)
            sum = sum + num;
        }
        return sum;
    }
    ,"-":(l:any)=>{
        var num1 =parseFloat(l[0].metName)
        var num2=parseFloat(l[1].metName)
        return num1 - num2
    }
    ,"print":(l:Array<Met>)=>{
        var s = ""
        for(var i in l){
            s = l[i].metName+ s
        }
        console.log(s)
        return s
    }
}

//词法分析
var cifa = (s:string )=>{
    var list =  new Array<string>()
    var addWord=(w:string)=>{
        if(word !=""){
            list[list.length] = word;
        }
    }
    var word = "";
    for(var i=0;i<s.length;i++){
        var c  = s.charAt(i)
        if(c!=" " && c!= "(" &&c!=")" && c!= "\n"){
            word = word+c;
        }else{
            addWord(word)
            if(c=="(" || c == ")"){
                word = c
                addWord(word);
            }
            word =""
        }
    }
    return list;
}


//语法分析 生成语法树
var getAst:any=(li:Array<string>)=>{
    var p=1;
    var list = li;
    if(list[0]!= "("){
        throw "tree err"
    }
    var ast:any = ()=>{
        var met =  new Met()
        met.isList= true;
        var tree = new Array<any>()
        met.list=tree;
        while(true){
            if(p>=list.length){
                throw "tree err"
            }
            var m =  list[p]
            p++
            if(m=="("){
                var newMet = ast()
                tree.push(newMet)
            }
            if(m==")"){
                return met;
            }
            if(m!="("&& m!=")"){
                var notListMet = new Met()
                notListMet.isList= false
                notListMet.metName = m;
                tree.push(notListMet)
            }
        }
        // return tree;
    }
    return ast()
}

//语义分析和执行
var execAST:any = (ast:Met)=>{
    return ast.exec()
}

class Met{
    isList=false;
    list= new Array<Met>()
    metName=""
    exec(){
        if(this.isList){
            var n1 = this.list[0].exec()
            var paramList =  new Array<Met>()
            for(var i in this.list){
                if(i=="0"){
                    continue
                }
                var li = this.list[i]
                var param = li.exec()
                paramList.push(param)
            }
            var result = fuc[n1.metName](paramList)
            var resultMet =  new Met();
            resultMet.metName = <string>result;
            return resultMet
        }else{
            return this
        }
    }
}

var l = cifa (code);
// console.log(li)
var t = getAst(l)

console.log("> --code --")
console.log(code)
console.log("> -- run --")
var result = execAST(t)
console.log("> -- result --")
console.log(result.metName)



