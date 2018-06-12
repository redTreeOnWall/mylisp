console.log("== ts lisp ==")

var code = "( + 1 2 )"

//词法分析
var cifa = (s:string )=>{
    var list =  new Array<string>()
    for(var i=0;i<s.length;i++){
        var w  = s.charAt(i)
        if(w!==" "){
            list[list.length] = w
        }
    }
    return list;
}

//语法分析
var yufa =(list:Array<string>)=>{
    var map = {}
    for(var i in list){
        var e = list[i]

        console.log(e)
    }
}

var li = cifa (code);
console.log(li)
yufa(li)