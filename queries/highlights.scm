; -- Directives

[
  "parallel"
  "kernels"
  "loop"
  "data"
  "enter"
  "exit"
  "update"
  "wait"
  "routine"
  "declare"
  "atomic"
  "cache"
  "end"
] @keyword

; Atomic
[
  "read"
  "write"
  "capture"
] @keyword

; -- Clauses

[
  "if"
  "async"
  "num_gangs"
  "num_workers"
  "vector_length"
  "private"
  "firstprivate"
  "reduction"
  "copy"
  "copyin"
  "copyout"
  "create"
  "present"
  "default"
  "collapse"
  "gang"
  "worker"
  "vector"
  "self"
  "host"
  "device"
  "device_type"
  "dtype"
] @keyword.directive

;  Clause without arguments
(seq_clause) @keyword.directive
(independent_clause) @keyword.directive
(auto_clause) @keyword.directive

; -- Clause arguments

[
  "num"
  "static"
] @keyword.directive

["none" "present"] @constant.builtin

; -- Literals

(reduction_operator) @operator

[
  "+" "-" "*" "/"
  ">" "<" ">=" "<=" "==" "/="
] @operator

(identifier) @variable
(number) @number
(comment) @comment

(routine_directive (identifier) @function)

["(" ")"] @punctuation.bracket
["," ":"] @punctuation.delimiter

(binary_expression) @_binexpr

