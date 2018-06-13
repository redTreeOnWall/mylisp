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

code =  `
    (print 'hello world sdsad ' )
`

//符号表
var fuc:any ={
    "+":(l:Array<Met>)=>{
        var sum:any = 0;
        for(var e in l){
            var num =parseFloat(l[e].metContent)
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
            s = l[i].metContent+ s
        }
        console.log(s)
        return s
    }
    ,"eval":(l:Array<Met>)=>{
        var s:any = l[0]
        return eva(<string>s.metContent)
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
    var readingString = false;
    for(var i=0;i<s.length;i++){
        var c  = s.charAt(i)
        if(readingString){
            if(c=="'"){
                readingString = false;
                word = word+c
                addWord(word)
                word = ""
            }else{
                word = word +c
            }
        }else{
            if(c=="'"){
                readingString = true
                addWord(word)
                word=c
                continue
            }
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
        met.type = MetType.list
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
                tree.push(notListMet)
                if(m[0]=="'" && m[m.length-1]=="'"){
                    notListMet.type = MetType.string
                    var s = ""
                    for(var i= 0;i<m.length;i++){
                        if(i!=0 && i!= m.length-1){
                            s = s + m.charAt(i)
                        }
                    }
                    notListMet.metContent = s
                    continue
                }

                notListMet.type = MetType.base
                notListMet.metContent = m
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


enum MetType{
    base,
    list,
    string,
    number,
    jsObj
}
class Met{
    list= new Array<Met>()
    metContent:any = ""
    type =  MetType.base
    exec(){
        switch(this.type){
            case MetType.base:
                return this
            case MetType.list:
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
                var result = fuc[n1.metContent](paramList)
                var resultMet =  new Met();
                resultMet.metContent = <string>result;
                return resultMet
            case MetType.string:
                return this
            default:
            return this
        }
        
    }
}

var eva = (code:string)=>{
    var c = cifa(code)
    var t = getAst(c)
    var result = execAST(t)
    return result
}


var c = `
(eval '(+ 5 2)')
`
console.log(eva(c))



