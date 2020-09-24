(write-line "hello world")
(write-line "hello world")  
(write
  '(+ 1 1)
  )

(defun log (x)
  (write x)
  (write-line "")
  )

(log 2)
(log (+ 2 3))

(defun loopl (n)
  (log n)
  (setq n (+ n 1))
  (loopl n)
  )
;又是一个似曾相识的感觉 flash back
;; (loopl 0)

(setq l '(+ 1 2))

(log l)

(defun getLam (x)
  (lambda 
    (n) (n+1) 
    )
  )

(log ((getLam 2) 2))
