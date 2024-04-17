(module
  (type (;0;) (func))
  (type (;1;) (func (param externref)))
  (type (;2;) (func (param i32 i32 i32 i32) (result i32)))
  (import "" "_start" 
    (func $_start ))
  (import "wasi_snapshot_preview1" "fd_write" 
    (func $fd_write (param externref i32 i32 i32 i32) (result i32)))
  (import "" "$imports" (table (;0;) 1 1 funcref))
  (import "env" "memory" (memory (;0;) 0))
  (global (;0;) (mut externref) (ref.null extern))

  (func (export "_start") (type 1) (param externref)
    local.get 0 (;get externref param0;)
    global.set 0 (;set externref as global0;)
    call $_start (; call imported _start ;)
  )

  (func (export "fd_write") (type 2) (param i32 i32 i32 i32) (result i32)
    (call $fd_write (global.get 0) (local.get 0) (local.get 1) (local.get 2) (local.get 3)) (; call imported fd_write ;)
    return i32.const 0 (;return 0;)
  )
  (elem (;0;) (i32.const 0) func 3)
)