(module
  (type (;0;) (func))
  (type (;1;) (func (param externref) (result i32)))
  (type (;2;) (func (param i32 i32 i32 i32) (result i32)))
  (import "" "_start" 
    (func $_start (result i32)))
  (import "wasi_snapshot_preview1" "fd_write" 
    (func $fd_write (param externref i32 i32 i32 i32) (result i32)))
  (global (;0;) (mut externref) (ref.null extern))

  (func (export "_start") (type 1) (param externref) (result i32)
    local.get 0 (;get externref param0;)
    global.set 0 (;set externref as global0;)
    call $_start (; call imported _start ;)
    return i32.const 0 (;return 0;)
  )

  (func (export "fd_write") (type 2) (param i32 i32 i32 i32) (result i32)
    (call $fd_write (global.get 0) (local.get 0) (local.get 1) (local.get 2) (local.get 3)) (; call imported fd_write ;)
    return i32.const 0 (;return 0;)
  )

)