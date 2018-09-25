(list 
  (print 1)
 (print (q (+ 1 1))) 
  )

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
