using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using UnityEngine;

namespace UI {
    public class VoidLisp {
        public void TexstExe() {
            var code = @"
(list 
    (print 'hello world')
    (print (+ 1 2 ) )
    (print
         (+ 1 2 (* 3 3))
    )
)
";
            var tokens = Token(code);
            var met    = getAst(tokens).Exec();
        }


        private int          P;
        private List<string> List;

        private Met Ast() {
            var met = new Met(this);
            met.Type = Met.MetType.List;
            var tree = new List<Met>();
            met.Mets = tree;
            while (true) {
                if (P >= List.Count) {
                    Debug.LogError("tree err");
                    return null;
                }

                var m = List[P];
                P++;
                if (m == "(") {
                    var newMet = Ast();
                    tree.Add(newMet);
                }

                if (m == ")") {
                    return met;
                }

                if (m != "(" && m != ")") {
                    var notListMet = new Met(this);
                    tree.Add(notListMet);
                    var mList = m.ToCharArray();
                    if (mList[0] == '\'' && mList[mList.Length - 1] == '\'') {
                        notListMet.Type = Met.MetType.StringMet;
                        var s = "";
                        for (var i = 0; i < mList.Length; i++) {
                            if (i != 0 && i != mList.Length - 1) {
                                s = s + mList[i];
                            }
                        }

                        notListMet.MetContent = s;
                        continue;
                    }

                    notListMet.Type       = Met.MetType.BaseMat;
                    notListMet.MetContent = m;
                }
            }
        }

        //语法分析 生成语法树
        public Met getAst(List<string> li) {
            P    = 1;
            List = li;
            if (List[0] != "(") {
                Debug.LogError("tree err");
                return null;
            }

            return Ast();
        }

        //词法分析
        private List<string> Token(string exp) {
            var l1 = exp.ToList();
            var l2 = new List<string>();

            var  token      = "";
            bool isInString = false;
            for (var i = 0; i < l1.Count; i++) {
                var tc = l1[i];

                if (tc == '\'') {
                    if (!isInString && !token.Equals("")) {
                        l2.Add(token);
                    }

                    if (isInString) {
                        token = token + tc;
                        l2.Add(token);
                        token      = "";
                        isInString = false;
                        continue;
                    } else {
                        isInString = true;
                    }
                }

                if (!isInString) {
                    if (tc == ' ' || tc == '\r' || tc == '\n') {
                        if (!token.Equals("")) {
                            l2.Add(token);
                        }

                        token = "";
                        continue;
                    }

                    if (tc == '(' || tc == ')') {
                        if (!token.Equals("")) {
                            l2.Add(token);
                        }

                        l2.Add(tc.ToString());
                        token = "";
                        continue;
                    }
                }

                token = token + tc.ToString();
            }

            return l2;
        }

        public Met Eval(string code) {
            var tokens = Token(code);
            var met    = getAst(tokens).Exec();
            return met;
        }


        public Dictionary<string, LispFunction> Functions;
        public Dictionary<string, Met> Values =  new Dictionary<string, Met>();

        public VoidLisp() {
            Functions = new Dictionary<string, LispFunction> {
                {
                    "list",
                    new LispFunction(li => {
                        var listMet = new Met(this);
                        listMet.Type       = Met.MetType.List;
                        listMet.Mets       = li;
                        listMet.MetContent = "list";
                        return listMet;
                    })
                },
                {"eval", new LispFunction(li => Eval(li[0].MetContent))},
                {
                    "let" , 
                    new LispFunction(li => {
                        Values.Add(li[0].MetContent,li[1]);
                        var met = new Met(this);
                        met.Type = Met.MetType.BaseMat;
                        met.MetContent = "T";
                        return met;
                    })
                },
                {
                    "print", new LispFunction(l => {
                        var s = "";
                        foreach (var met in l) {
                            met.Print();
                            s = s + " " + met.MetContent;
                        }

                        var resmet = new Met(this);
                        resmet.MetContent = s;
                        resmet.Type       = Met.MetType.BaseMat;
                        return resmet;
                    })
                },
                {
                    "quote", new LispFunction(metList => {
                        var met = new Met(this);
                        met.Type = Met.MetType.List;
                        met.Mets = metList;
                        return met;
                    })
                },
                {
                    "+", new LispFunction(metList => {
                        var sum = 0f;
                        foreach (var met in metList) {
                            var n = float.Parse(met.MetContent);
                            sum = n + sum;
                        }

                        var m = new Met(this);
                        m.Type       = Met.MetType.BaseMat;
                        m.MetContent = sum.ToString();
                        return m;
                    })
                },
                {
                    "*", new LispFunction(metList => {
                        var sum = 1f;
                        foreach (var met in metList) {
                            var n = float.Parse(met.MetContent);
                            sum = n * sum;
                        }

                        var m = new Met(this);
                        m.Type       = Met.MetType.BaseMat;
                        m.MetContent = sum.ToString();
                        return m;
                    })
                },
                {
                    "-", new LispFunction(metList => {
                        var result = float.Parse(metList[0].MetContent);
                        for (var i = 1; i < metList.Count; i++) {
                            var n = float.Parse(metList[i].MetContent);
                            result = result - n;
                        }

                        var m = new Met(this);
                        m.Type       = Met.MetType.BaseMat;
                        m.MetContent = result.ToString();
                        return m;
                    })
                },
                {
                    "/", new LispFunction(metList => {
                        var result = float.Parse(metList[0].MetContent);
                        for (var i = 1; i < metList.Count; i++) {
                            var n = float.Parse(metList[i].MetContent);
                            result = result / n;
                        }

                        var m = new Met(this);
                        m.Type       = Met.MetType.BaseMat;
                        m.MetContent = result.ToString();
                        return m;
                    })
                },
                {
                    "loop", new LispFunction(li => {
                        return null;
                    })
                },
                {
                    "openMsgW" , new LispFunction(l => {
                        UIUtils.SimpleMsgWindow(l[0].MetContent, () => {
                        }, () => {
                        });
                        var m = new Met(this);
                        m.Type = Met.MetType.BaseMat;
                        
                        return m;
                    })
                }
                
            };
        }
    }


    public class Met {
        private VoidLisp _eviroment;

        public Met(VoidLisp eviroment) {
            _eviroment = eviroment;
        }

        public enum MetType {
            BaseMat,
            List,
            StringMet,
            Number
        }

        public string    Token;
        public List<Met> Mets;
        public MetType   Type;
        public string    MetContent;

        public Met Exec() {
            switch (Type) {
                case MetType.BaseMat:
                    if (_eviroment.Values.ContainsKey(MetContent)) {
                        return _eviroment.Values[MetContent];
                    } else {
                        return this;
                    }
                case MetType.List:
                    var n1        = Mets[0].Exec();
                    var paramList = new List<Met>();
                    for (var i = 0; i < Mets.Count; i++) {
                        if (i == 0) {
                            continue;
                        }

                        var li    = Mets[i];
                        var param = li.Exec();
                        paramList.Add(param);
                    }

                    var result = _eviroment.Functions[n1.MetContent].Function.Invoke(paramList);
                    return result;
                case MetType.StringMet:
                    return this;
                case MetType.Number:
                    return this;
                default:
                    return this;
            }
        }

        public void Print() {
            switch (Type) {
                case MetType.BaseMat:
                    Debug.Log(MetContent);
                    break;
                case MetType.List:
                    Debug.Log("---------------");
                    Mets.ForEach(m => m.Print());
                    break;
                case MetType.StringMet:
                    Debug.Log(MetContent);
                    break;
                case MetType.Number:
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }

    public class LispFunction {
        public Func<List<Met>, Met> Function;

        public LispFunction(Func<List<Met>, Met> function) {
            Function = function;
        }
    }
}