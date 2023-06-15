(module $wit-component:shim
  (type (;0;) (func (param i32)))
  (type (;1;) (func (param i32 i32)))
  (type (;2;) (func (param i64 i32)))
  (type (;3;) (func (param i32 i32 i32 i32)))
  (type (;4;) (func (param i32 i32) (result i32)))
  (type (;5;) (func (param i32 i32 i32 i32) (result i32)))
  (type (;6;) (func (param i32)))
  (func $indirect-preopens-get-stdio (type 0) (param i32)
    local.get 0
    i32.const 0
    call_indirect (type 0))
  (func $indirect-preopens-get-directories (type 0) (param i32)
    local.get 0
    i32.const 1
    call_indirect (type 0))
  (func $indirect-filesystem-get-type (type 1) (param i32 i32)
    local.get 0
    local.get 1
    i32.const 2
    call_indirect (type 1))
  (func $indirect-random-get-random-bytes (type 2) (param i64 i32)
    local.get 0
    local.get 1
    i32.const 3
    call_indirect (type 2))
  (func $indirect-environment-get-environment (type 0) (param i32)
    local.get 0
    i32.const 4
    call_indirect (type 0))
  (func $indirect-streams-write (type 3) (param i32 i32 i32 i32)
    local.get 0
    local.get 1
    local.get 2
    local.get 3
    i32.const 5
    call_indirect (type 3))
  (func $adapt-wasi_snapshot_preview1-random_get (type 4) (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.const 6
    call_indirect (type 4))
  (func $adapt-wasi_snapshot_preview1-fd_write (type 5) (param i32 i32 i32 i32) (result i32)
    local.get 0
    local.get 1
    local.get 2
    local.get 3
    i32.const 7
    call_indirect (type 5))
  (func $adapt-wasi_snapshot_preview1-environ_get (type 4) (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.const 8
    call_indirect (type 4))
  (func $adapt-wasi_snapshot_preview1-environ_sizes_get (type 4) (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.const 9
    call_indirect (type 4))
  (func $adapt-wasi_snapshot_preview1-proc_exit (type 6) (param i32)
    local.get 0
    i32.const 10
    call_indirect (type 6))
  (table (;0;) 11 11 funcref)
  (export "0" (func $indirect-preopens-get-stdio))
  (export "1" (func $indirect-preopens-get-directories))
  (export "2" (func $indirect-filesystem-get-type))
  (export "3" (func $indirect-random-get-random-bytes))
  (export "4" (func $indirect-environment-get-environment))
  (export "5" (func $indirect-streams-write))
  (export "6" (func $adapt-wasi_snapshot_preview1-random_get))
  (export "7" (func $adapt-wasi_snapshot_preview1-fd_write))
  (export "8" (func $adapt-wasi_snapshot_preview1-environ_get))
  (export "9" (func $adapt-wasi_snapshot_preview1-environ_sizes_get))
  (export "10" (func $adapt-wasi_snapshot_preview1-proc_exit))
  (export "$imports" (table 0)))
