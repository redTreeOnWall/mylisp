(   
    run
    (println "hello world")
    (let i 1)
    (let a 3)
    (let b 5)
    (println "i =" i)
    (println '(+ 1 2 ) "is:")
    (println (+ 1 2 ))
    (println "i + i is :")
    (println (+ i i))
    (let b (+ (+ 1  1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1) 2 ))
    (println "before gc,object num:" (allMetNum ))
    (gc)
    (println "after gc,object num:" (allMetNum ))
    (println "b:" b)
)