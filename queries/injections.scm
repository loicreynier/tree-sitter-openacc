; -- General injection
((comment) @injection.content
  (#set! injection.language "comment"))

; -- OpenACC injection
;
; !$acc parallel
; ! = col 0
; $ = col 1
; a = col 2
; c = col 3
; c = col 4
;   = col 5
; p = col 6
;
; --> Offset column: 0 6 0 0
; TODO: support for line continuation symbol
( (comment) @injection.content
  (#match? @injection.content "^!\\$acc")
  (#offset! @injection.content 0 6 0 0)
  (#set! injection.language "openacc"))

