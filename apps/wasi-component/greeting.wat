(module
  (import "wasi_snapshot_preview1" "args_get"
    (func $args_get (param i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "args_sizes_get"
    (func $args_sizes_get (param i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "environ_get" 
    (func $environ_get (param i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "environ_sizes_get"
    (func $environ_sizes_get (param i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "clock_res_get"
    (func $clock_res_get (param i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "clock_time_get"
    (func $clock_time_get (param i32 i64 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_advise" 
    (func $fd_advise (param i32 i64 i64 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_allocate"
    (func $fd_allocate (param i32 i64 i64) (result i32)))
  (import "wasi_snapshot_preview1" "fd_close" 
    (func $fd_close (param i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_datasync"
    (func $fd_datasync (param i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_fdstat_get" 
    (func $fd_fdstat_get (param i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_fdstat_set_flags" 
    (func $fd_fdstat_set_flags (param i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_fdstat_set_rights" 
    (func $fd_fdstat_set_rights (param i32 i64 i64) (result i32)))
  (import "wasi_snapshot_preview1" "fd_filestat_get" 
    (func $fd_filestat_get (param i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_filestat_set_size" 
    (func $fd_filestat_set_size (param i32 i64) (result i32)))
  (import "wasi_snapshot_preview1" "fd_pread" 
    (func $fd_pread (param i32 i32 i32 i64 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_prestat_get"
    (func $fd_prestat_get (param i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_prestat_dir_name" 
    (func $fd_prestat_dir_name (param i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_pwrite" 
    (func $fd_pwrite (param i32 i32 i32 i64 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_read"
    (func $fd_read (param i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_readdir" 
    (func $fd_readdir (param i32 i32 i32 i64 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_renumber" 
    (func $fd_renumber (param i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_seek" 
    (func $fd_seek (param i32 i64 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_sync" 
    (func $fd_sync (param i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_tell" 
    (func $fd_tell (param i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "fd_write" 
    (func $fd_write (param i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "path_create_directory" 
    (func $path_create_directory (param i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "path_filestat_get" 
    (func $path_filestat_get (param i32 i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "path_filestat_set_times" 
    (func $path_filestat_set_times (param i32 i32 i32 i32 i64 i64 i32) (result i32)))
  (import "wasi_snapshot_preview1" "path_link" 
    (func $path_link (param i32 i32 i32 i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "path_open" 
    (func $path_open (param i32 i32 i32 i32 i32 i64 i64 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "path_readlink" 
    (func $path_readlink (param i32 i32 i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "path_remove_directory" 
    (func $path_remove_directory (param i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "path_rename" 
    (func $path_rename (param i32 i32 i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "path_symlink" 
    (func $path_symlink (param i32 i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "path_unlink_file" 
    (func $path_unlink_file (param i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "poll_oneoff" 
    (func $poll_oneoff (param i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "proc_exit" 
    (func $proc_exit (param i32)))
  (import "wasi_snapshot_preview1" "proc_raise" 
    (func $proc_raise (param i32) (result i32)))
  (import "wasi_snapshot_preview1" "sched_yield" 
    (func $sched_yield (result i32)))
  (import "wasi_snapshot_preview1" "random_get" 
    (func $random_get (param i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "sock_accept" 
    (func $sock_accept (param i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "sock_recv" 
    (func $sock_recv (param i32 i32 i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "sock_send" 
    (func $sock_send (param i32 i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "sock_shutdown" 
    (func $sock_shutdown (param i32 i32) (result i32)))

  (func (export "_start")
    (call $print (i32.const 32) (i32.const 13))
    (call $print (i32.const 64) (i32.const 11))
  )
  (func $print (param $ptr i32) (param $len i32)
    (i32.store (i32.const 8) (local.get $len))
    (i32.store (i32.const 4) (local.get $ptr))
        (drop (call $fd_write
          (i32.const 1)
          (i32.const 4)
          (i32.const 1)
          (i32.const 0)))
  )
  (memory (export "memory") 1)
  (data (i32.const 32) "Hello _start\0a")
  (data (i32.const 64) "Hello done\0a")
)