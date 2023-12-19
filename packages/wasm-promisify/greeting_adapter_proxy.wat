(module $adapter-promisified:proxy
  (type (;0;) (func (param i32 i32 i32 i32) (result i32)))
  (func $adapt-wasi_snapshot_preview1-fd_write (type 0) (param i32 i32 i32 i32) (result i32)
    local.get 0
    local.get 1
    local.get 2
    local.get 3
    i32.const 0
    call_indirect (type 0))
  (table (;0;) 1 1 funcref)
  (export "0" (func $adapt-wasi_snapshot_preview1-fd_write))
  (export "$imports" (table 0))
)