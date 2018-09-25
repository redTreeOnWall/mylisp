"use strict";
exports.__esModule = true;
var VoidLisp = /** @class */ (function () {
    function VoidLisp() {
        var _this = this;
        this.Functions = {
            "q": function (li) {
                return li[0];
            },
            "exec": function (li) {
                return li[0].Exec();
            },
            "list": function (li) {
                var met = new Met(_this, MetType.List);
                met.Mets = li;
                met.MetContent = "list";
                return met;
            },
            "push": function (li) {
                var met = new Met(_this, MetType.List, "list");
                li[1].Mets.push(li[0]);
                met.Mets = li[1].Mets;
                console.log(met);
                return met;
            },
            "index": function (li) {
                var list = li[1];
                var index = li[0];
                var met = li[1].Mets[parseInt(li[0].MetContent)];
                if (met === undefined) {
                    throw "list out of range ,inde:" + parseInt(li[0].MetContent);
                }
                return met;
            },
            "print": function (li) {
                var s = "";
                for (var i = 0; i < li.length; i++) {
                    s = s + li[i].MetContent;
                }
                var met = new Met(_this, MetType.BaseMat, s);
                console.log(s);
            },
            "or": function (li) {
                var met = new Met(_this, MetType.BaseMat, "F");
                for (var i = 0; i < li.length; i++) {
                    if (li[i].MetContent === "T") {
                        return new Met(_this, MetType.BaseMat, "T");
                    }
                }
                return met;
            },
            "and": function (li) {
                var met = new Met(_this, MetType.BaseMat, "T");
                for (var i = 0; i < li.length; i++) {
                    if (li[i].MetContent === "F") {
                        return new Met(_this, MetType.BaseMat, "F");
                    }
                }
                return met;
            },
            "not": function (li) {
                return li[0].MetContent === "F" ? new Met(_this, MetType.BaseMat, "T") : new Met(_this, MetType.BaseMat, "F");
            },
            "==": function (li) {
                if (li[0].MetContent === li[1].MetContent) {
                    return new Met(_this, MetType.BaseMat, "T");
                }
                else {
                    return new Met(_this, MetType.BaseMat, "F");
                }
            },
            "<": function (li) {
                var f1 = parseFloat(li[0].MetContent);
                var f2 = parseFloat(li[1].MetContent);
                if (f1 < f2) {
                    return new Met(_this, MetType.BaseMat, "T");
                }
                else {
                    return new Met(_this, MetType.BaseMat, "F");
                }
            },
            ">": function (li) {
                var f1 = parseFloat(li[0].MetContent);
                var f2 = parseFloat(li[1].MetContent);
                if (f1 > f2) {
                    return new Met(_this, MetType.BaseMat, "T");
                }
                else {
                    return new Met(_this, MetType.BaseMat, "F");
                }
            },
            "+": function (li) {
                var first = parseFloat(li[0].MetContent);
                for (var i = 1; i < li.length; i++) {
                    var n = parseFloat(li[i].MetContent);
                    first = first + n;
                }
                var met = new Met(_this, MetType.BaseMat, first + "");
                return met;
            },
            "-": function (li) {
                var first = parseFloat(li[0].MetContent);
                for (var i = 1; i < li.length; i++) {
                    var n = parseFloat(li[i].MetContent);
                    first = first - n;
                }
                var met = new Met(_this, MetType.BaseMat, first + "");
                return met;
            },
            "*": function (li) {
                var first = parseFloat(li[0].MetContent);
                for (var i = 1; i < li.length; i++) {
                    var n = parseFloat(li[i].MetContent);
                    first = first * n;
                }
                var met = new Met(_this, MetType.BaseMat, first + "");
                return met;
            },
            "/": function (li) {
                var first = parseFloat(li[0].MetContent);
                for (var i = 1; i < li.length; i++) {
                    var n = parseFloat(li[i].MetContent);
                    first = first / n;
                }
                var met = new Met(_this, MetType.BaseMat, first + "");
                return met;
            },
            "if": function (li) {
                var isT = li[0];
                if (isT.MetContent === "T") {
                    return li[1].Exec();
                }
                else {
                    return li[2].Exec();
                }
            },
            "while": function (li) {
                while (li[0].MetContent === "T") {
                    var p = li[1].Exec();
                }
                return new Met(_this);
            },
            "def": function (li) {
                //value
                var v = li[1];
                _this.Functions[li[0].MetContent] = function (lii) { return v; };
                return new Met(_this);
            },
            "lambda": function (li) {
                if (li[1].Type != MetType.List) {
                    throw "no paramLis:t " + li[0].MetContent;
                }
                //Function
                var paramList = li[1].Mets;
                _this.Functions[li[0].MetContent] = function (lii) {
                    //give memery before function invoke
                    for (var i = 0; i < paramList.length; i++) {
                        var p = lii[i];
                        _this.Functions[paramList[i].MetContent] = function (l) { return p; };
                    }
                    //TODO: release memery when function invoked
                    return li[2].Exec();
                };
                return new Met(_this);
            }
        };
    }
    VoidLisp.prototype.TestExe = function () {
        var code = "\n\t\t(list \n\t\t\t(print 'hello world')\n\t\t\t(print (+ 1 2 ) )\n\t\t\t(print\n\t\t\t\t(+ 1 2 (* 3 3))\n\t\t\t)\n\t\t)\n\t\t ";
        var tokens = this.Token(code);
        var met = this.getAst(tokens).Exec();
    };
    VoidLisp.prototype.Ast = function () {
        var met = new Met(this, MetType.List, "list");
        met.Type = MetType.List;
        var tree = new Array();
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
                notListMet.Type = MetType.BaseMat;
                notListMet.MetContent = m;
            }
        }
    };
    //语法分析 生成语法树
    VoidLisp.prototype.getAst = function (li) {
        this.P = 1;
        this.List = li;
        if (this.List[0] != "(") {
            console.log("tree err");
            return null;
        }
        return this.Ast();
    };
    //词法分析
    VoidLisp.prototype.Token = function (exp) {
        var l1 = exp;
        var l2 = new Array();
        var token = "";
        var isInString = false;
        var isInAno = false;
        for (var i = 0; i < l1.length; i++) {
            var tc = l1[i];
            if (tc === ';') {
                isInAno = true;
            }
            if (tc === '\r' || tc === '\n') {
                isInAno = false;
            }
            if (isInAno) {
                continue;
            }
            if (tc === '"') {
                if (!isInString && token !== "") {
                    l2.push(token);
                }
                if (isInString) {
                    token = token + tc;
                    l2.push(token);
                    token = "";
                    isInString = false;
                    continue;
                }
                else {
                    isInString = true;
                }
            }
            if (!isInString) {
                if (tc === ' ' || tc === '\r' || tc === '\n' || tc === "\t") {
                    if (token !== "") {
                        l2.push(token);
                    }
                    token = "";
                    continue;
                }
                if (tc === '(' || tc === ')') {
                    if (token !== "") {
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
    };
    VoidLisp.prototype.Eval = function (code) {
        var tokens = this.Token(code);
        var met = this.getAst(tokens).Exec();
        return met;
    };
    return VoidLisp;
}());
exports.VoidLisp = VoidLisp;
var MetType;
(function (MetType) {
    MetType[MetType["BaseMat"] = 0] = "BaseMat";
    MetType[MetType["List"] = 1] = "List";
    MetType[MetType["StringMet"] = 2] = "StringMet";
    MetType[MetType["NumberMet"] = 3] = "NumberMet";
})(MetType || (MetType = {}));
var Met = /** @class */ (function () {
    function Met(eviroments, types, content) {
        if (types === void 0) { types = MetType.BaseMat; }
        if (content === void 0) { content = "Nil"; }
        this.Type = types;
        this.eviroment = eviroments;
        this.MetContent = content;
    }
    Met.prototype.Exec = function () {
        switch (this.Type) {
            case MetType.BaseMat:
                if (this.eviroment.Functions[this.MetContent] != undefined) {
                    return this.eviroment.Functions[this.MetContent]().Exec();
                }
                else {
                    return this;
                }
            case MetType.List:
                var n1 = this.Mets[0];
                var paramList = new Array();
                for (var i = 0; i < this.Mets.length; i++) {
                    if (i == 0) {
                        continue;
                    }
                    var li = this.Mets[i].Exec();
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
    };
    Met.prototype.Print = function () {
        console.log(this);
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
    };
    return Met;
}());
var code = "\n(runlist (print 'hello world')\n\n\t(print ( or  (< 1 -2) (> 2 3)))\n\t(print ( < -12 (+ 0 1)))\n\n\t(let var 15)\n\t(print var)\n\t(let var 'hello world')\n\t(print var)\n\n\t(def log (s) (print s))\n\t(log 'test log')\n\n\t(let i 1)\n\t(while (< i 100) \n\t\t(runlist (print i)\n\t\t\t(let i (+ i 1))))\n\n\t(print 'end'))\n\n";
