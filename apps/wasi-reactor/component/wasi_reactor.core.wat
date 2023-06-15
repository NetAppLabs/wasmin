(module
  (type $.rodata (;0;) (func (param i32)))
  (type $.data (;1;) (func (param i32) (result i64)))
  (type (;2;) (func (param i32 i32 i32)))
  (type (;3;) (func (param i32 i32)))
  (type (;4;) (func (param i32 i32 i32) (result i32)))
  (type (;5;) (func (param i32 i32) (result i32)))
  (type (;6;) (func (param i32 i32 i32 i32) (result i32)))
  (type (;7;) (func))
  (type (;8;) (func (param i32 i32 i32 i32)))
  (type (;9;) (func (param i32) (result i32)))
  (type (;10;) (func (param i32 i32 i32 i32 i32)))
  (type (;11;) (func (param i32 i32 i32 i32 i32 i32 i32)))
  (type (;12;) (func (result i32)))
  (type (;13;) (func (param i32 i32 i32 i32 i32 i32)))
  (type (;14;) (func (param i32 i32 i32 i32 i32) (result i32)))
  (type (;15;) (func (param i32 i32 i32 i32 i32 i32) (result i32)))
  (type (;16;) (func (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result i32)))
  (type (;17;) (func (param i64 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "random_get" (func $_ZN4wasi13lib_generated22wasi_snapshot_preview110random_get17h5d1cc52b36ce0bd1E (;0;) (type 5)))
  (import "wasi_snapshot_preview1" "fd_write" (func $_ZN4wasi13lib_generated22wasi_snapshot_preview18fd_write17h1fddf6a5171ac8d1E (;1;) (type 6)))
  (import "wasi_snapshot_preview1" "environ_get" (func $__imported_wasi_snapshot_preview1_environ_get (;2;) (type 5)))
  (import "wasi_snapshot_preview1" "environ_sizes_get" (func $__imported_wasi_snapshot_preview1_environ_sizes_get (;3;) (type 5)))
  (import "wasi_snapshot_preview1" "proc_exit" (func $__imported_wasi_snapshot_preview1_proc_exit (;4;) (type $.rodata)))
  (func $__wasm_call_ctors (;5;) (type 7))
  (func $_ZN5alloc3vec12Vec$LT$T$GT$14from_raw_parts17haa9d77bebdbfca6dE (;6;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 48
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    local.get 1
    i32.store offset=28
    local.get 6
    local.get 2
    i32.store offset=32
    local.get 6
    local.get 3
    i32.store offset=36
    local.get 6
    local.get 1
    i32.store offset=24
    local.get 6
    i32.load offset=24
    local.set 7
    local.get 6
    local.get 7
    i32.store offset=20
    local.get 6
    i32.load offset=20
    local.set 8
    local.get 6
    local.get 8
    i32.store offset=12
    local.get 6
    local.get 3
    i32.store offset=8
    local.get 6
    i32.load offset=8
    local.set 9
    local.get 6
    i32.load offset=12
    local.set 10
    local.get 0
    local.get 9
    i32.store
    local.get 0
    local.get 10
    i32.store offset=4
    local.get 0
    local.get 2
    i32.store offset=8
    return
  )
  (func $_ZN5alloc3vec16Vec$LT$T$C$A$GT$13shrink_to_fit17ha8a52414229a8acfE (;7;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=4
    local.get 3
    local.get 0
    i32.store offset=8
    local.get 3
    local.get 0
    i32.store offset=12
    i32.const 0
    local.set 4
    i32.const 1
    local.set 5
    local.get 4
    local.get 5
    i32.and
    local.set 6
    block ;; label = @1
      block ;; label = @2
        local.get 6
        br_if 0 (;@2;)
        local.get 0
        i32.load
        local.set 7
        local.get 3
        local.get 7
        i32.store
        br 1 (;@1;)
      end
      i32.const -1
      local.set 8
      local.get 3
      local.get 8
      i32.store
    end
    local.get 0
    i32.load offset=8
    local.set 9
    local.get 3
    i32.load
    local.set 10
    local.get 10
    local.set 11
    local.get 9
    local.set 12
    local.get 11
    local.get 12
    i32.gt_u
    local.set 13
    i32.const 1
    local.set 14
    local.get 13
    local.get 14
    i32.and
    local.set 15
    block ;; label = @1
      local.get 15
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.load offset=8
      local.set 16
      local.get 0
      local.get 16
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$13shrink_to_fit17h4cc734d24f4b891aE
    end
    i32.const 16
    local.set 17
    local.get 3
    local.get 17
    i32.add
    local.set 18
    local.get 18
    global.set $__stack_pointer
    return
  )
  (func $_ZN5alloc3vec16Vec$LT$T$C$A$GT$16into_boxed_slice17hea7146025a9978a1E (;8;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 112
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 1
    call $_ZN5alloc3vec16Vec$LT$T$C$A$GT$13shrink_to_fit17ha8a52414229a8acfE
    i32.const 8
    local.set 5
    local.get 1
    local.get 5
    i32.add
    local.set 6
    local.get 6
    i32.load
    local.set 7
    i32.const 32
    local.set 8
    local.get 4
    local.get 8
    i32.add
    local.set 9
    local.get 9
    local.get 5
    i32.add
    local.set 10
    local.get 10
    local.get 7
    i32.store
    local.get 1
    i64.load align=4
    local.set 11
    local.get 4
    local.get 11
    i64.store offset=32
    i32.const 16
    local.set 12
    local.get 4
    local.get 12
    i32.add
    local.set 13
    local.get 13
    local.get 5
    i32.add
    local.set 14
    local.get 10
    i32.load
    local.set 15
    local.get 14
    local.get 15
    i32.store
    local.get 4
    i64.load offset=32
    local.set 16
    local.get 4
    local.get 16
    i64.store offset=16
    i32.const 16
    local.set 17
    local.get 4
    local.get 17
    i32.add
    local.set 18
    local.get 4
    local.get 18
    i32.store offset=60
    i32.const 16
    local.set 19
    local.get 4
    local.get 19
    i32.add
    local.set 20
    local.get 4
    local.get 20
    i32.store offset=64
    i32.const 48
    local.set 21
    local.get 4
    local.get 21
    i32.add
    local.set 22
    local.get 4
    local.get 22
    i32.store offset=68
    local.get 4
    i64.load offset=16
    local.set 23
    local.get 4
    local.get 23
    i64.store offset=48
    local.get 4
    i32.load offset=48
    local.set 24
    local.get 4
    i32.load offset=52
    local.set 25
    local.get 4
    local.get 24
    i32.store offset=72
    local.get 4
    local.get 25
    i32.store offset=76
    local.get 4
    local.get 24
    i32.store offset=80
    local.get 4
    local.get 25
    i32.store offset=84
    local.get 4
    local.get 24
    i32.store offset=88
    local.get 4
    local.get 25
    i32.store offset=92
    i32.const 16
    local.set 26
    local.get 4
    local.get 26
    i32.add
    local.set 27
    local.get 4
    local.get 27
    i32.store offset=100
    i32.const 16
    local.set 28
    local.get 4
    local.get 28
    i32.add
    local.set 29
    local.get 4
    local.get 29
    i32.store offset=104
    local.get 14
    i32.load
    local.set 30
    local.get 4
    local.get 30
    i32.store offset=108
    i32.const 8
    local.set 31
    local.get 4
    local.get 31
    i32.add
    local.set 32
    local.get 32
    local.get 24
    local.get 25
    local.get 30
    call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$8into_box17heb98b99a2ae26c60E
    local.get 4
    i32.load offset=12
    local.set 33
    local.get 4
    i32.load offset=8
    local.set 34
    local.get 4
    local.get 34
    local.get 33
    call $_ZN5alloc5boxed70Box$LT$$u5b$core..mem..maybe_uninit..MaybeUninit$LT$T$GT$$u5d$$C$A$GT$11assume_init17hfb7aab2623bf3355E
    local.get 4
    i32.load
    local.set 35
    local.get 4
    i32.load offset=4
    local.set 36
    local.get 0
    local.get 36
    i32.store offset=4
    local.get 0
    local.get 35
    i32.store
    i32.const 112
    local.set 37
    local.get 4
    local.get 37
    i32.add
    local.set 38
    local.get 38
    global.set $__stack_pointer
    return
  )
  (func $_ZN72_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..ops..deref..Deref$GT$5deref17h7bf35af3ade01f55E (;9;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 64
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 1
    i32.store offset=24
    local.get 4
    local.get 1
    i32.store offset=28
    local.get 1
    i32.load offset=4
    local.set 5
    local.get 4
    local.get 5
    i32.store offset=32
    local.get 4
    local.get 5
    i32.store offset=36
    local.get 4
    local.get 5
    i32.store offset=40
    local.get 4
    local.get 5
    i32.store offset=4
    local.get 4
    i32.load offset=4
    local.set 6
    local.get 4
    local.get 6
    i32.store offset=44
    local.get 4
    local.get 6
    i32.store offset=48
    local.get 4
    local.get 5
    i32.store offset=52
    local.get 1
    i32.load offset=8
    local.set 7
    local.get 4
    local.get 7
    i32.store offset=56
    local.get 4
    local.get 5
    i32.store offset=60
    local.get 4
    local.get 5
    i32.store offset=16
    local.get 4
    local.get 7
    i32.store offset=20
    local.get 4
    i32.load offset=16
    local.set 8
    local.get 4
    i32.load offset=20
    local.set 9
    local.get 4
    local.get 8
    i32.store offset=8
    local.get 4
    local.get 9
    i32.store offset=12
    local.get 4
    i32.load offset=8
    local.set 10
    local.get 4
    i32.load offset=12
    local.set 11
    local.get 0
    local.get 11
    i32.store offset=4
    local.get 0
    local.get 10
    i32.store
    return
  )
  (func $_ZN50_$LT$T$u20$as$u20$core..convert..Into$LT$U$GT$$GT$4into17h549c009440e01153E (;10;) (type 9) (param i32) (result i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 0
    call $_ZN119_$LT$core..ptr..non_null..NonNull$LT$T$GT$$u20$as$u20$core..convert..From$LT$core..ptr..unique..Unique$LT$T$GT$$GT$$GT$4from17h15e4824b7481feccE
    local.set 4
    i32.const 16
    local.set 5
    local.get 3
    local.get 5
    i32.add
    local.set 6
    local.get 6
    global.set $__stack_pointer
    local.get 4
    return
  )
  (func $_ZN4core3fmt9Arguments6as_str17hb0faefb47713c4a1E (;11;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 1
    i32.store offset=24
    local.get 1
    i32.load offset=8
    local.set 5
    local.get 1
    i32.load offset=12
    local.set 6
    local.get 1
    i32.load offset=16
    local.set 7
    local.get 1
    i32.load offset=20
    local.set 8
    local.get 4
    local.get 5
    i32.store offset=8
    local.get 4
    local.get 6
    i32.store offset=12
    local.get 4
    local.get 7
    i32.store offset=16
    local.get 4
    local.get 8
    i32.store offset=20
    local.get 4
    i32.load offset=12
    local.set 9
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 9
            i32.eqz
            br_if 0 (;@4;)
            local.get 4
            i32.load offset=12
            local.set 10
            i32.const 1
            local.set 11
            local.get 10
            local.set 12
            local.get 11
            local.set 13
            local.get 12
            local.get 13
            i32.eq
            local.set 14
            i32.const 1
            local.set 15
            local.get 14
            local.get 15
            i32.and
            local.set 16
            local.get 16
            br_if 1 (;@3;)
            br 2 (;@2;)
          end
          local.get 4
          i32.load offset=20
          local.set 17
          local.get 17
          br_if 1 (;@2;)
          i32.const 1048576
          local.set 18
          local.get 4
          local.get 18
          i32.store
          i32.const 0
          local.set 19
          local.get 4
          local.get 19
          i32.store offset=4
          br 2 (;@1;)
        end
        local.get 4
        i32.load offset=20
        local.set 20
        local.get 20
        br_if 0 (;@2;)
        local.get 4
        i32.load offset=8
        local.set 21
        local.get 4
        local.get 21
        i32.store offset=28
        local.get 21
        i32.load
        local.set 22
        local.get 21
        i32.load offset=4
        local.set 23
        local.get 4
        local.get 22
        i32.store
        local.get 4
        local.get 23
        i32.store offset=4
        br 1 (;@1;)
      end
      i32.const 0
      local.set 24
      local.get 4
      local.get 24
      i32.store
    end
    local.get 4
    i32.load
    local.set 25
    local.get 4
    i32.load offset=4
    local.set 26
    local.get 0
    local.get 26
    i32.store offset=4
    local.get 0
    local.get 25
    i32.store
    return
  )
  (func $_ZN4core3fmt9Arguments6new_v117h5b3fab9a6985d3e3E (;12;) (type 10) (param i32 i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 5
    i32.const 64
    local.set 6
    local.get 5
    local.get 6
    i32.sub
    local.set 7
    local.get 7
    global.set $__stack_pointer
    local.get 7
    local.get 1
    i32.store offset=48
    local.get 7
    local.get 2
    i32.store offset=52
    local.get 7
    local.get 3
    i32.store offset=56
    local.get 7
    local.get 4
    i32.store offset=60
    local.get 2
    local.set 8
    local.get 4
    local.set 9
    local.get 8
    local.get 9
    i32.lt_u
    local.set 10
    i32.const 1
    local.set 11
    local.get 10
    local.get 11
    i32.and
    local.set 12
    block ;; label = @1
      block ;; label = @2
        local.get 12
        br_if 0 (;@2;)
        i32.const 1
        local.set 13
        local.get 4
        local.get 13
        i32.add
        local.set 14
        local.get 2
        local.set 15
        local.get 14
        local.set 16
        local.get 15
        local.get 16
        i32.gt_u
        local.set 17
        i32.const 1
        local.set 18
        local.get 17
        local.get 18
        i32.and
        local.set 19
        local.get 7
        local.get 19
        i32.store8 offset=15
        br 1 (;@1;)
      end
      i32.const 1
      local.set 20
      local.get 7
      local.get 20
      i32.store8 offset=15
    end
    local.get 7
    i32.load8_u offset=15
    local.set 21
    i32.const 1
    local.set 22
    local.get 21
    local.get 22
    i32.and
    local.set 23
    block ;; label = @1
      local.get 23
      br_if 0 (;@1;)
      i32.const 0
      local.set 24
      local.get 7
      local.get 24
      i32.store offset=40
      local.get 0
      local.get 1
      i32.store offset=8
      local.get 0
      local.get 2
      i32.store offset=12
      local.get 7
      i32.load offset=40
      local.set 25
      local.get 7
      i32.load offset=44
      local.set 26
      local.get 0
      local.get 25
      i32.store
      local.get 0
      local.get 26
      i32.store offset=4
      local.get 0
      local.get 3
      i32.store offset=16
      local.get 0
      local.get 4
      i32.store offset=20
      i32.const 64
      local.set 27
      local.get 7
      local.get 27
      i32.add
      local.set 28
      local.get 28
      global.set $__stack_pointer
      return
    end
    i32.const 16
    local.set 29
    local.get 7
    local.get 29
    i32.add
    local.set 30
    local.get 30
    local.set 31
    i32.const 1048588
    local.set 32
    i32.const 1
    local.set 33
    i32.const 1048576
    local.set 34
    i32.const 0
    local.set 35
    local.get 31
    local.get 32
    local.get 33
    local.get 34
    local.get 35
    call $_ZN4core3fmt9Arguments6new_v117h5b3fab9a6985d3e3E
    i32.const 16
    local.set 36
    local.get 7
    local.get 36
    i32.add
    local.set 37
    local.get 37
    local.set 38
    i32.const 1048672
    local.set 39
    local.get 38
    local.get 39
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN122_$LT$alloc..collections..TryReserveError$u20$as$u20$core..convert..From$LT$alloc..collections..TryReserveErrorKind$GT$$GT$4from17h0e85b78cbeafe076E (;13;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    local.get 1
    i32.store offset=8
    local.get 5
    local.get 2
    i32.store offset=12
    local.get 5
    local.get 1
    i32.store
    local.get 5
    local.get 2
    i32.store offset=4
    local.get 5
    i32.load
    local.set 6
    local.get 5
    i32.load offset=4
    local.set 7
    local.get 0
    local.get 7
    i32.store offset=4
    local.get 0
    local.get 6
    i32.store
    return
  )
  (func $_ZN4core6option15Option$LT$T$GT$11map_or_else17h9c2af8ee5f7adf59E (;14;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 48
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    global.set $__stack_pointer
    local.get 6
    local.get 1
    i32.store offset=8
    local.get 6
    local.get 2
    i32.store offset=12
    local.get 6
    local.get 3
    i32.store offset=28
    i32.const 1
    local.set 7
    local.get 6
    local.get 7
    i32.store8 offset=27
    i32.const 1
    local.set 8
    local.get 6
    local.get 8
    i32.store8 offset=26
    local.get 6
    i32.load offset=8
    local.set 9
    i32.const 0
    local.set 10
    i32.const 1
    local.set 11
    local.get 11
    local.get 10
    local.get 9
    select
    local.set 12
    block ;; label = @1
      block ;; label = @2
        local.get 12
        br_if 0 (;@2;)
        i32.const 0
        local.set 13
        local.get 6
        local.get 13
        i32.store8 offset=27
        local.get 0
        local.get 3
        call $_ZN5alloc3fmt6format28_$u7b$$u7b$closure$u7d$$u7d$17ha4ddff10a78e9630E
        br 1 (;@1;)
      end
      local.get 6
      i32.load offset=8
      local.set 14
      local.get 6
      i32.load offset=12
      local.set 15
      local.get 6
      local.get 14
      i32.store offset=40
      local.get 6
      local.get 15
      i32.store offset=44
      i32.const 0
      local.set 16
      local.get 6
      local.get 16
      i32.store8 offset=26
      local.get 6
      local.get 14
      i32.store offset=16
      local.get 6
      local.get 15
      i32.store offset=20
      local.get 6
      i32.load offset=16
      local.set 17
      local.get 6
      i32.load offset=20
      local.set 18
      local.get 0
      local.get 17
      local.get 18
      call $_ZN4core3ops8function6FnOnce9call_once17hf5be886b95b4ed25E
    end
    local.get 6
    i32.load8_u offset=26
    local.set 19
    i32.const 1
    local.set 20
    local.get 19
    local.get 20
    i32.and
    local.set 21
    block ;; label = @1
      local.get 21
      i32.eqz
      br_if 0 (;@1;)
    end
    local.get 6
    i32.load8_u offset=27
    local.set 22
    i32.const 1
    local.set 23
    local.get 22
    local.get 23
    i32.and
    local.set 24
    block ;; label = @1
      local.get 24
      i32.eqz
      br_if 0 (;@1;)
    end
    i32.const 48
    local.set 25
    local.get 6
    local.get 25
    i32.add
    local.set 26
    local.get 26
    global.set $__stack_pointer
    return
  )
  (func $_ZN4core3mem6forget17hd5e1d9d8066222ecE (;15;) (type 3) (param i32 i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 0
    i32.store offset=8
    local.get 4
    local.get 1
    i32.store offset=12
    return
  )
  (func $_ZN50_$LT$T$u20$as$u20$core..convert..Into$LT$U$GT$$GT$4into17h88275e2536533eaeE (;16;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store offset=8
    local.get 5
    local.get 2
    i32.store offset=12
    local.get 5
    local.get 1
    local.get 2
    call $_ZN122_$LT$alloc..collections..TryReserveError$u20$as$u20$core..convert..From$LT$alloc..collections..TryReserveErrorKind$GT$$GT$4from17h0e85b78cbeafe076E
    local.get 5
    i32.load
    local.set 6
    local.get 5
    i32.load offset=4
    local.set 7
    local.get 0
    local.get 7
    i32.store offset=4
    local.get 0
    local.get 6
    i32.store
    i32.const 16
    local.set 8
    local.get 5
    local.get 8
    i32.add
    local.set 9
    local.get 9
    global.set $__stack_pointer
    return
  )
  (func $_ZN5alloc3fmt6format28_$u7b$$u7b$closure$u7d$$u7d$17ha4ddff10a78e9630E (;17;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i64 i32 i32 i32 i64 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 1
    i32.store offset=4
    local.get 4
    i32.load offset=4
    local.set 5
    i32.const 16
    local.set 6
    local.get 5
    local.get 6
    i32.add
    local.set 7
    local.get 7
    i64.load align=4
    local.set 8
    i32.const 8
    local.set 9
    local.get 4
    local.get 9
    i32.add
    local.set 10
    local.get 10
    local.get 6
    i32.add
    local.set 11
    local.get 11
    local.get 8
    i64.store
    i32.const 8
    local.set 12
    local.get 5
    local.get 12
    i32.add
    local.set 13
    local.get 13
    i64.load align=4
    local.set 14
    i32.const 8
    local.set 15
    local.get 4
    local.get 15
    i32.add
    local.set 16
    local.get 16
    local.get 12
    i32.add
    local.set 17
    local.get 17
    local.get 14
    i64.store
    local.get 5
    i64.load align=4
    local.set 18
    local.get 4
    local.get 18
    i64.store offset=8
    i32.const 8
    local.set 19
    local.get 4
    local.get 19
    i32.add
    local.set 20
    local.get 20
    local.set 21
    local.get 0
    local.get 21
    call $_ZN5alloc3fmt6format12format_inner17h09cf2eb7625dc038E
    i32.const 32
    local.set 22
    local.get 4
    local.get 22
    i32.add
    local.set 23
    local.get 23
    global.set $__stack_pointer
    return
  )
  (func $_ZN4core3ops8function6FnOnce9call_once17hf5be886b95b4ed25E (;18;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store
    local.get 5
    local.get 2
    i32.store offset=4
    local.get 5
    i32.load
    local.set 6
    local.get 5
    i32.load offset=4
    local.set 7
    local.get 0
    local.get 6
    local.get 7
    call $_ZN5alloc3str56_$LT$impl$u20$alloc..borrow..ToOwned$u20$for$u20$str$GT$8to_owned17h7c3e9352c2a84ac7E
    i32.const 16
    local.set 8
    local.get 5
    local.get 8
    i32.add
    local.set 9
    local.get 9
    global.set $__stack_pointer
    return
  )
  (func $_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17hdb4a6961e9d6351cE (;19;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 0
    call $_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17hf98b2c2082156601E
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.add
    local.set 5
    local.get 5
    global.set $__stack_pointer
    return
  )
  (func $_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17hf98b2c2082156601E (;20;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 0
    call $_ZN70_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17hb013624536cd3550E
    local.get 0
    call $_ZN4core3ptr53drop_in_place$LT$alloc..raw_vec..RawVec$LT$u8$GT$$GT$17h320f9682e1ff64b4E
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.add
    local.set 5
    local.get 5
    global.set $__stack_pointer
    return
  )
  (func $_ZN70_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17hb013624536cd3550E (;21;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 64
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    local.get 0
    i32.store offset=28
    local.get 3
    local.get 0
    i32.store offset=32
    local.get 0
    i32.load offset=4
    local.set 4
    local.get 3
    local.get 4
    i32.store offset=36
    local.get 3
    local.get 4
    i32.store offset=40
    local.get 3
    local.get 4
    i32.store offset=44
    local.get 3
    local.get 4
    i32.store offset=4
    local.get 3
    i32.load offset=4
    local.set 5
    local.get 3
    local.get 5
    i32.store offset=48
    local.get 3
    local.get 5
    i32.store offset=52
    local.get 0
    i32.load offset=8
    local.set 6
    local.get 3
    local.get 6
    i32.store offset=56
    local.get 3
    local.get 4
    i32.store offset=60
    local.get 3
    local.get 4
    i32.store offset=16
    local.get 3
    local.get 6
    i32.store offset=20
    local.get 3
    i32.load offset=16
    local.set 7
    local.get 3
    i32.load offset=20
    local.set 8
    local.get 3
    local.get 7
    i32.store offset=8
    local.get 3
    local.get 8
    i32.store offset=12
    return
  )
  (func $_ZN4core3ptr53drop_in_place$LT$alloc..raw_vec..RawVec$LT$u8$GT$$GT$17h320f9682e1ff64b4E (;22;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 0
    call $_ZN77_$LT$alloc..raw_vec..RawVec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h7e69dc222295117fE
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.add
    local.set 5
    local.get 5
    global.set $__stack_pointer
    return
  )
  (func $_ZN4core3ptr49drop_in_place$LT$alloc..string..FromUtf8Error$GT$17h46c70c0eaaaf171bE (;23;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=12
    i32.const 8
    local.set 4
    local.get 0
    local.get 4
    i32.add
    local.set 5
    local.get 5
    call $_ZN4core3ptr46drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$17hf98b2c2082156601E
    i32.const 16
    local.set 6
    local.get 3
    local.get 6
    i32.add
    local.set 7
    local.get 7
    global.set $__stack_pointer
    return
  )
  (func $_ZN77_$LT$alloc..raw_vec..RawVec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h7e69dc222295117fE (;24;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 32
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=16
    local.get 3
    local.set 4
    local.get 4
    local.get 0
    call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h381f0dc8cd1ad676E
    local.get 3
    i32.load offset=8
    local.set 5
    i32.const 0
    local.set 6
    i32.const 1
    local.set 7
    local.get 7
    local.get 6
    local.get 5
    select
    local.set 8
    i32.const 1
    local.set 9
    local.get 8
    local.set 10
    local.get 9
    local.set 11
    local.get 10
    local.get 11
    i32.eq
    local.set 12
    i32.const 1
    local.set 13
    local.get 12
    local.get 13
    i32.and
    local.set 14
    block ;; label = @1
      local.get 14
      i32.eqz
      br_if 0 (;@1;)
      local.get 3
      i32.load
      local.set 15
      local.get 3
      local.get 15
      i32.store offset=20
      local.get 3
      i32.load offset=4
      local.set 16
      local.get 3
      i32.load offset=8
      local.set 17
      local.get 3
      local.get 16
      i32.store offset=24
      local.get 3
      local.get 17
      i32.store offset=28
      local.get 0
      local.get 15
      local.get 16
      local.get 17
      call $_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h68fb77bf8dc0effcE
    end
    i32.const 32
    local.set 18
    local.get 3
    local.get 18
    i32.add
    local.set 19
    local.get 19
    global.set $__stack_pointer
    return
  )
  (func $_ZN4core5alloc6layout6Layout5array5inner17h56a3f1abda73a3e5E (;25;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 64
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    global.set $__stack_pointer
    local.get 6
    local.get 1
    i32.store offset=40
    local.get 6
    local.get 2
    i32.store offset=44
    local.get 6
    local.get 3
    i32.store offset=48
    block ;; label = @1
      block ;; label = @2
        local.get 1
        br_if 0 (;@2;)
        i32.const 0
        local.set 7
        local.get 6
        local.get 7
        i32.store8 offset=23
        br 1 (;@1;)
      end
      local.get 6
      local.get 2
      i32.store offset=32
      local.get 6
      i32.load offset=32
      local.set 8
      i32.const 1
      local.set 9
      local.get 8
      local.get 9
      i32.sub
      local.set 10
      i32.const 2147483647
      local.set 11
      local.get 11
      local.get 10
      i32.sub
      local.set 12
      i32.const 0
      local.set 13
      local.get 1
      local.set 14
      local.get 13
      local.set 15
      local.get 14
      local.get 15
      i32.eq
      local.set 16
      i32.const 1
      local.set 17
      local.get 16
      local.get 17
      i32.and
      local.set 18
      block ;; label = @2
        local.get 18
        br_if 0 (;@2;)
        local.get 12
        local.get 1
        i32.div_u
        local.set 19
        local.get 3
        local.set 20
        local.get 19
        local.set 21
        local.get 20
        local.get 21
        i32.gt_u
        local.set 22
        i32.const 1
        local.set 23
        local.get 22
        local.get 23
        i32.and
        local.set 24
        local.get 6
        local.get 24
        i32.store8 offset=23
        br 1 (;@1;)
      end
      i32.const 1048784
      local.set 25
      i32.const 25
      local.set 26
      i32.const 1048768
      local.set 27
      local.get 25
      local.get 26
      local.get 27
      call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
      unreachable
    end
    local.get 6
    i32.load8_u offset=23
    local.set 28
    i32.const 1
    local.set 29
    local.get 28
    local.get 29
    i32.and
    local.set 30
    block ;; label = @1
      block ;; label = @2
        local.get 30
        br_if 0 (;@2;)
        local.get 1
        local.get 3
        i32.mul
        local.set 31
        local.get 6
        local.get 31
        i32.store offset=52
        local.get 6
        local.get 2
        i32.store offset=36
        local.get 6
        i32.load offset=36
        local.set 32
        local.get 6
        local.get 32
        i32.store offset=56
        local.get 6
        local.get 32
        i32.store offset=60
        local.get 6
        i32.load offset=60
        local.set 33
        local.get 6
        local.get 31
        i32.store offset=24
        local.get 6
        local.get 33
        i32.store offset=28
        local.get 6
        i32.load offset=24
        local.set 34
        local.get 6
        i32.load offset=28
        local.set 35
        local.get 6
        local.get 34
        i32.store offset=8
        local.get 6
        local.get 35
        i32.store offset=12
        br 1 (;@1;)
      end
      i32.const 0
      local.set 36
      local.get 6
      local.get 36
      i32.store offset=12
    end
    local.get 6
    i32.load offset=8
    local.set 37
    local.get 6
    i32.load offset=12
    local.set 38
    local.get 0
    local.get 38
    i32.store offset=4
    local.get 0
    local.get 37
    i32.store
    i32.const 64
    local.set 39
    local.get 6
    local.get 39
    i32.add
    local.set 40
    local.get 40
    global.set $__stack_pointer
    return
  )
  (func $_ZN5alloc3str56_$LT$impl$u20$alloc..borrow..ToOwned$u20$for$u20$str$GT$8to_owned17h7c3e9352c2a84ac7E (;26;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 32
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store offset=16
    local.get 5
    local.get 2
    i32.store offset=20
    local.get 5
    local.get 1
    i32.store offset=24
    local.get 5
    local.get 2
    i32.store offset=28
    local.get 5
    i32.load offset=24
    local.set 6
    local.get 5
    i32.load offset=28
    local.set 7
    local.get 5
    local.set 8
    local.get 8
    local.get 6
    local.get 7
    call $_ZN5alloc5slice64_$LT$impl$u20$alloc..borrow..ToOwned$u20$for$u20$$u5b$T$u5d$$GT$8to_owned17hc3a22756e5b02158E
    local.get 5
    i64.load
    local.set 9
    local.get 0
    local.get 9
    i64.store align=4
    i32.const 8
    local.set 10
    local.get 0
    local.get 10
    i32.add
    local.set 11
    local.get 5
    local.get 10
    i32.add
    local.set 12
    local.get 12
    i32.load
    local.set 13
    local.get 11
    local.get 13
    i32.store
    i32.const 32
    local.set 14
    local.get 5
    local.get 14
    i32.add
    local.set 15
    local.get 15
    global.set $__stack_pointer
    return
  )
  (func $_ZN5alloc6string6String10into_bytes17hff2b206b40ca2dbfE (;27;) (type 3) (param i32 i32)
    (local i64 i32 i32 i32 i32)
    local.get 1
    i64.load align=4
    local.set 2
    local.get 0
    local.get 2
    i64.store align=4
    i32.const 8
    local.set 3
    local.get 0
    local.get 3
    i32.add
    local.set 4
    local.get 1
    local.get 3
    i32.add
    local.set 5
    local.get 5
    i32.load
    local.set 6
    local.get 4
    local.get 6
    i32.store
    return
  )
  (func $_ZN5alloc6string6String9from_utf817h85e7b1cbd259e4bbE (;28;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i64 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 80
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    i32.const 8
    local.set 5
    local.get 4
    local.get 5
    i32.add
    local.set 6
    local.get 6
    local.get 1
    call $_ZN72_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..ops..deref..Deref$GT$5deref17h7bf35af3ade01f55E
    local.get 4
    i32.load offset=12
    local.set 7
    local.get 4
    i32.load offset=8
    local.set 8
    i32.const 16
    local.set 9
    local.get 4
    local.get 9
    i32.add
    local.set 10
    local.get 10
    local.set 11
    local.get 11
    local.get 8
    local.get 7
    call $_ZN4core3str8converts9from_utf817h4708668127040a35E
    local.get 4
    i32.load offset=16
    local.set 12
    block ;; label = @1
      block ;; label = @2
        local.get 12
        br_if 0 (;@2;)
        i32.const 8
        local.set 13
        local.get 1
        local.get 13
        i32.add
        local.set 14
        local.get 14
        i32.load
        local.set 15
        i32.const 32
        local.set 16
        local.get 4
        local.get 16
        i32.add
        local.set 17
        local.get 17
        local.get 13
        i32.add
        local.set 18
        local.get 18
        local.get 15
        i32.store
        local.get 1
        i64.load align=4
        local.set 19
        local.get 4
        local.get 19
        i64.store offset=32
        i32.const 8
        local.set 20
        local.get 0
        local.get 20
        i32.add
        local.set 21
        local.get 4
        i64.load offset=32
        local.set 22
        local.get 21
        local.get 22
        i64.store align=4
        i32.const 8
        local.set 23
        local.get 21
        local.get 23
        i32.add
        local.set 24
        i32.const 32
        local.set 25
        local.get 4
        local.get 25
        i32.add
        local.set 26
        local.get 26
        local.get 23
        i32.add
        local.set 27
        local.get 27
        i32.load
        local.set 28
        local.get 24
        local.get 28
        i32.store
        i32.const 2
        local.set 29
        local.get 0
        local.get 29
        i32.store8 offset=4
        br 1 (;@1;)
      end
      i32.const 16
      local.set 30
      local.get 4
      local.get 30
      i32.add
      local.set 31
      local.get 31
      local.set 32
      i32.const 4
      local.set 33
      local.get 32
      local.get 33
      i32.add
      local.set 34
      local.get 34
      i64.load align=4
      local.set 35
      local.get 4
      local.get 35
      i64.store offset=48
      i32.const 56
      local.set 36
      local.get 4
      local.get 36
      i32.add
      local.set 37
      local.get 37
      local.set 38
      i32.const 8
      local.set 39
      local.get 38
      local.get 39
      i32.add
      local.set 40
      local.get 1
      i64.load align=4
      local.set 41
      local.get 40
      local.get 41
      i64.store align=4
      i32.const 8
      local.set 42
      local.get 40
      local.get 42
      i32.add
      local.set 43
      local.get 1
      local.get 42
      i32.add
      local.set 44
      local.get 44
      i32.load
      local.set 45
      local.get 43
      local.get 45
      i32.store
      local.get 4
      i64.load offset=48
      local.set 46
      local.get 4
      local.get 46
      i64.store offset=56
      local.get 4
      i64.load offset=56
      local.set 47
      local.get 0
      local.get 47
      i64.store align=4
      i32.const 16
      local.set 48
      local.get 0
      local.get 48
      i32.add
      local.set 49
      i32.const 56
      local.set 50
      local.get 4
      local.get 50
      i32.add
      local.set 51
      local.get 51
      local.get 48
      i32.add
      local.set 52
      local.get 52
      i32.load
      local.set 53
      local.get 49
      local.get 53
      i32.store
      i32.const 8
      local.set 54
      local.get 0
      local.get 54
      i32.add
      local.set 55
      i32.const 56
      local.set 56
      local.get 4
      local.get 56
      i32.add
      local.set 57
      local.get 57
      local.get 54
      i32.add
      local.set 58
      local.get 58
      i64.load
      local.set 59
      local.get 55
      local.get 59
      i64.store align=4
    end
    i32.const 80
    local.set 60
    local.get 4
    local.get 60
    i32.add
    local.set 61
    local.get 61
    global.set $__stack_pointer
    return
  )
  (func $_ZN60_$LT$alloc..string..String$u20$as$u20$core..fmt..Display$GT$3fmt17h5a9196d4d980ba2bE (;29;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=8
    local.get 4
    local.get 1
    i32.store offset=12
    local.get 4
    local.get 0
    call $_ZN72_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..ops..deref..Deref$GT$5deref17h7bf35af3ade01f55E
    local.get 4
    i32.load offset=4
    local.set 5
    local.get 4
    i32.load
    local.set 6
    local.get 4
    local.get 6
    i32.store offset=16
    local.get 4
    local.get 5
    i32.store offset=20
    local.get 4
    local.get 6
    i32.store offset=24
    local.get 4
    local.get 5
    i32.store offset=28
    local.get 4
    i32.load offset=24
    local.set 7
    local.get 4
    i32.load offset=28
    local.set 8
    local.get 7
    local.get 8
    local.get 1
    call $_ZN42_$LT$str$u20$as$u20$core..fmt..Display$GT$3fmt17hcd33a3726c86db1aE
    local.set 9
    i32.const 1
    local.set 10
    local.get 9
    local.get 10
    i32.and
    local.set 11
    i32.const 32
    local.set 12
    local.get 4
    local.get 12
    i32.add
    local.set 13
    local.get 13
    global.set $__stack_pointer
    local.get 11
    return
  )
  (func $_ZN5alloc7raw_vec14handle_reserve17hcd44055f17776da7E (;30;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=16
    local.get 4
    local.get 1
    i32.store offset=20
    local.get 4
    local.get 0
    local.get 1
    call $_ZN4core6result19Result$LT$T$C$E$GT$7map_err17hf30ac78436ae445cE
    local.get 4
    i32.load
    local.set 5
    local.get 4
    i32.load offset=4
    local.set 6
    local.get 4
    local.get 6
    i32.store offset=12
    local.get 4
    local.get 5
    i32.store offset=8
    local.get 4
    i32.load offset=12
    local.set 7
    i32.const -2147483647
    local.set 8
    local.get 7
    local.set 9
    local.get 8
    local.set 10
    local.get 9
    local.get 10
    i32.eq
    local.set 11
    i32.const 0
    local.set 12
    i32.const 1
    local.set 13
    i32.const 1
    local.set 14
    local.get 11
    local.get 14
    i32.and
    local.set 15
    local.get 12
    local.get 13
    local.get 15
    select
    local.set 16
    block ;; label = @1
      local.get 16
      br_if 0 (;@1;)
      i32.const 32
      local.set 17
      local.get 4
      local.get 17
      i32.add
      local.set 18
      local.get 18
      global.set $__stack_pointer
      return
    end
    local.get 4
    i32.load offset=12
    local.set 19
    i32.const 0
    local.set 20
    i32.const 1
    local.set 21
    local.get 21
    local.get 20
    local.get 19
    select
    local.set 22
    block ;; label = @1
      local.get 22
      br_if 0 (;@1;)
      call $_ZN5alloc7raw_vec17capacity_overflow17h38ac120e37f2568fE
      unreachable
    end
    local.get 4
    i32.load offset=8
    local.set 23
    local.get 4
    i32.load offset=12
    local.set 24
    local.get 4
    local.get 23
    i32.store offset=24
    local.get 4
    local.get 24
    i32.store offset=28
    local.get 23
    local.get 24
    call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
    unreachable
  )
  (func $_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17h70b08c8fc18c15b7E (;31;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 80
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store offset=16
    local.get 5
    local.get 2
    i32.store offset=20
    local.get 5
    local.get 2
    i32.store offset=32
    i32.const 0
    local.set 6
    local.get 5
    local.get 2
    local.get 6
    call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$11allocate_in17h387384a793975a6fE
    local.get 5
    i32.load offset=4
    local.set 7
    local.get 5
    i32.load
    local.set 8
    local.get 0
    local.get 8
    i32.store
    local.get 0
    local.get 7
    i32.store offset=4
    i32.const 0
    local.set 9
    local.get 0
    local.get 9
    i32.store offset=8
    local.get 5
    local.get 1
    i32.store offset=36
    local.get 5
    local.get 0
    i32.store offset=40
    local.get 5
    local.get 0
    i32.store offset=44
    local.get 0
    i32.load offset=4
    local.set 10
    local.get 5
    local.get 10
    i32.store offset=48
    local.get 5
    local.get 10
    i32.store offset=52
    local.get 5
    local.get 10
    i32.store offset=56
    local.get 5
    local.get 10
    i32.store offset=12
    local.get 5
    i32.load offset=12
    local.set 11
    local.get 5
    local.get 11
    i32.store offset=60
    local.get 5
    local.get 11
    i32.store offset=64
    local.get 5
    local.get 2
    i32.store offset=68
    i32.const 0
    local.set 12
    local.get 2
    local.get 12
    i32.shl
    local.set 13
    local.get 10
    local.get 1
    local.get 13
    call $memcpy
    drop
    local.get 5
    local.get 0
    i32.store offset=72
    local.get 5
    local.get 2
    i32.store offset=76
    local.get 0
    local.get 2
    i32.store offset=8
    i32.const 80
    local.set 14
    local.get 5
    local.get 14
    i32.add
    local.set 15
    local.get 15
    global.set $__stack_pointer
    return
  )
  (func $_ZN4core3fmt10ArgumentV111new_display17h4ac66c0a8e10c207E (;32;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 1
    i32.store offset=16
    i32.const 1
    local.set 5
    local.get 4
    local.get 5
    i32.store offset=20
    local.get 4
    local.get 5
    i32.store offset=24
    local.get 4
    i32.load offset=24
    local.set 6
    local.get 4
    local.get 1
    i32.store offset=28
    local.get 4
    i32.load offset=28
    local.set 7
    local.get 4
    local.get 7
    i32.store offset=8
    local.get 4
    local.get 6
    i32.store offset=12
    local.get 4
    i32.load offset=8
    local.set 8
    local.get 4
    i32.load offset=12
    local.set 9
    local.get 0
    local.get 9
    i32.store offset=4
    local.get 0
    local.get 8
    i32.store
    return
  )
  (func $_ZN4core3fmt10ArgumentV111new_display17h61a41a94be7998b1E (;33;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 1
    i32.store offset=16
    i32.const 2
    local.set 5
    local.get 4
    local.get 5
    i32.store offset=20
    local.get 4
    local.get 5
    i32.store offset=24
    local.get 4
    i32.load offset=24
    local.set 6
    local.get 4
    local.get 1
    i32.store offset=28
    local.get 4
    i32.load offset=28
    local.set 7
    local.get 4
    local.get 7
    i32.store offset=8
    local.get 4
    local.get 6
    i32.store offset=12
    local.get 4
    i32.load offset=8
    local.set 8
    local.get 4
    i32.load offset=12
    local.set 9
    local.get 0
    local.get 9
    i32.store offset=4
    local.get 0
    local.get 8
    i32.store
    return
  )
  (func $_ZN5alloc5alloc6Global10alloc_impl17ha47b2d59fbddaa23E (;34;) (type 10) (param i32 i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 5
    i32.const 304
    local.set 6
    local.get 5
    local.get 6
    i32.sub
    local.set 7
    local.get 7
    global.set $__stack_pointer
    local.get 7
    local.get 2
    i32.store offset=8
    local.get 7
    local.get 3
    i32.store offset=12
    local.get 7
    local.get 1
    i32.store offset=136
    local.get 4
    local.set 8
    local.get 7
    local.get 8
    i32.store8 offset=143
    i32.const 8
    local.set 9
    local.get 7
    local.get 9
    i32.add
    local.set 10
    local.get 10
    local.set 11
    local.get 7
    local.get 11
    i32.store offset=192
    local.get 7
    i32.load offset=8
    local.set 12
    local.get 7
    local.get 12
    i32.store offset=196
    block ;; label = @1
      block ;; label = @2
        local.get 12
        br_if 0 (;@2;)
        i32.const 8
        local.set 13
        local.get 7
        local.get 13
        i32.add
        local.set 14
        local.get 14
        local.set 15
        local.get 7
        local.get 15
        i32.store offset=264
        local.get 7
        i32.load offset=12
        local.set 16
        local.get 7
        local.get 16
        i32.store offset=268
        local.get 7
        local.get 16
        i32.store offset=84
        local.get 7
        i32.load offset=84
        local.set 17
        local.get 7
        local.get 17
        i32.store offset=272
        local.get 7
        local.get 17
        i32.store offset=276
        local.get 7
        i32.load offset=276
        local.set 18
        local.get 7
        local.get 18
        i32.store offset=280
        local.get 7
        local.get 18
        i32.store offset=32
        i32.const 0
        local.set 19
        local.get 7
        local.get 19
        i32.store offset=284
        local.get 7
        i32.load offset=32
        local.set 20
        local.get 7
        local.get 20
        i32.store offset=288
        local.get 7
        local.get 20
        i32.store offset=292
        local.get 7
        local.get 20
        i32.store offset=96
        i32.const 0
        local.set 21
        local.get 7
        local.get 21
        i32.store offset=100
        local.get 7
        i32.load offset=96
        local.set 22
        local.get 7
        i32.load offset=100
        local.set 23
        local.get 7
        local.get 22
        i32.store offset=88
        local.get 7
        local.get 23
        i32.store offset=92
        local.get 7
        i32.load offset=88
        local.set 24
        local.get 7
        i32.load offset=92
        local.set 25
        local.get 7
        local.get 24
        i32.store offset=296
        local.get 7
        local.get 25
        i32.store offset=300
        local.get 7
        local.get 24
        i32.store offset=24
        local.get 7
        local.get 25
        i32.store offset=28
        local.get 7
        i32.load offset=24
        local.set 26
        local.get 7
        i32.load offset=28
        local.set 27
        local.get 7
        local.get 26
        i32.store offset=16
        local.get 7
        local.get 27
        i32.store offset=20
        br 1 (;@1;)
      end
      local.get 4
      local.set 28
      block ;; label = @2
        block ;; label = @3
          local.get 28
          br_if 0 (;@3;)
          local.get 7
          i32.load offset=8
          local.set 29
          local.get 7
          i32.load offset=12
          local.set 30
          local.get 7
          local.get 29
          i32.store offset=48
          local.get 7
          local.get 30
          i32.store offset=52
          i32.const 48
          local.set 31
          local.get 7
          local.get 31
          i32.add
          local.set 32
          local.get 32
          local.set 33
          local.get 7
          local.get 33
          i32.store offset=212
          local.get 7
          i32.load offset=48
          local.set 34
          i32.const 48
          local.set 35
          local.get 7
          local.get 35
          i32.add
          local.set 36
          local.get 36
          local.set 37
          local.get 7
          local.get 37
          i32.store offset=216
          local.get 7
          i32.load offset=52
          local.set 38
          local.get 7
          local.get 38
          i32.store offset=220
          local.get 7
          local.get 38
          i32.store offset=108
          local.get 7
          i32.load offset=108
          local.set 39
          local.get 34
          local.get 39
          call $__rust_alloc
          local.set 40
          local.get 7
          local.get 40
          i32.store offset=36
          br 1 (;@2;)
        end
        local.get 7
        i32.load offset=8
        local.set 41
        local.get 7
        i32.load offset=12
        local.set 42
        local.get 7
        local.get 41
        i32.store offset=40
        local.get 7
        local.get 42
        i32.store offset=44
        i32.const 40
        local.set 43
        local.get 7
        local.get 43
        i32.add
        local.set 44
        local.get 44
        local.set 45
        local.get 7
        local.get 45
        i32.store offset=200
        local.get 7
        i32.load offset=40
        local.set 46
        i32.const 40
        local.set 47
        local.get 7
        local.get 47
        i32.add
        local.set 48
        local.get 48
        local.set 49
        local.get 7
        local.get 49
        i32.store offset=204
        local.get 7
        i32.load offset=44
        local.set 50
        local.get 7
        local.get 50
        i32.store offset=208
        local.get 7
        local.get 50
        i32.store offset=104
        local.get 7
        i32.load offset=104
        local.set 51
        local.get 46
        local.get 51
        call $__rust_alloc_zeroed
        local.set 52
        local.get 7
        local.get 52
        i32.store offset=36
      end
      local.get 7
      i32.load offset=36
      local.set 53
      local.get 7
      local.get 53
      i32.store offset=224
      local.get 7
      local.get 53
      i32.store offset=116
      local.get 7
      i32.load offset=116
      local.set 54
      local.get 7
      local.get 54
      i32.store offset=228
      local.get 7
      local.get 54
      i32.store offset=232
      local.get 7
      i32.load offset=232
      local.set 55
      i32.const 0
      local.set 56
      local.get 55
      local.set 57
      local.get 56
      local.set 58
      local.get 57
      local.get 58
      i32.eq
      local.set 59
      i32.const -1
      local.set 60
      local.get 59
      local.get 60
      i32.xor
      local.set 61
      i32.const 1
      local.set 62
      local.get 61
      local.get 62
      i32.and
      local.set 63
      block ;; label = @2
        block ;; label = @3
          local.get 63
          br_if 0 (;@3;)
          i32.const 0
          local.set 64
          local.get 7
          local.get 64
          i32.store offset=68
          br 1 (;@2;)
        end
        local.get 7
        local.get 53
        i32.store offset=112
        local.get 7
        i32.load offset=112
        local.set 65
        local.get 7
        local.get 65
        i32.store offset=68
      end
      local.get 7
      i32.load offset=68
      local.set 66
      i32.const 0
      local.set 67
      i32.const 1
      local.set 68
      local.get 68
      local.get 67
      local.get 66
      select
      local.set 69
      block ;; label = @2
        block ;; label = @3
          local.get 69
          br_if 0 (;@3;)
          i32.const 0
          local.set 70
          local.get 7
          local.get 70
          i32.store offset=64
          br 1 (;@2;)
        end
        local.get 7
        i32.load offset=68
        local.set 71
        local.get 7
        local.get 71
        i32.store offset=236
        local.get 7
        local.get 71
        i32.store offset=64
      end
      local.get 7
      i32.load offset=64
      local.set 72
      i32.const 1
      local.set 73
      i32.const 0
      local.set 74
      local.get 74
      local.get 73
      local.get 72
      select
      local.set 75
      block ;; label = @2
        block ;; label = @3
          local.get 75
          br_if 0 (;@3;)
          local.get 7
          i32.load offset=64
          local.set 76
          local.get 7
          local.get 76
          i32.store offset=240
          local.get 7
          local.get 76
          i32.store offset=60
          br 1 (;@2;)
        end
        i32.const 0
        local.set 77
        local.get 7
        local.get 77
        i32.store offset=60
      end
      local.get 7
      i32.load offset=60
      local.set 78
      i32.const 1
      local.set 79
      i32.const 0
      local.set 80
      local.get 80
      local.get 79
      local.get 78
      select
      local.set 81
      block ;; label = @2
        local.get 81
        br_if 0 (;@2;)
        local.get 7
        i32.load offset=60
        local.set 82
        local.get 7
        local.get 82
        i32.store offset=244
        local.get 7
        local.get 82
        i32.store offset=248
        local.get 7
        local.get 82
        i32.store offset=252
        local.get 7
        local.get 82
        i32.store offset=128
        local.get 7
        local.get 12
        i32.store offset=132
        local.get 7
        i32.load offset=128
        local.set 83
        local.get 7
        i32.load offset=132
        local.set 84
        local.get 7
        local.get 83
        i32.store offset=120
        local.get 7
        local.get 84
        i32.store offset=124
        local.get 7
        i32.load offset=120
        local.set 85
        local.get 7
        i32.load offset=124
        local.set 86
        local.get 7
        local.get 85
        i32.store offset=256
        local.get 7
        local.get 86
        i32.store offset=260
        local.get 7
        local.get 85
        i32.store offset=72
        local.get 7
        local.get 86
        i32.store offset=76
        local.get 7
        i32.load offset=72
        local.set 87
        local.get 7
        i32.load offset=76
        local.set 88
        local.get 7
        local.get 87
        i32.store offset=16
        local.get 7
        local.get 88
        i32.store offset=20
        br 1 (;@1;)
      end
      i32.const 0
      local.set 89
      local.get 7
      local.get 89
      i32.store offset=16
    end
    local.get 7
    i32.load offset=16
    local.set 90
    local.get 7
    i32.load offset=20
    local.set 91
    local.get 0
    local.get 91
    i32.store offset=4
    local.get 0
    local.get 90
    i32.store
    i32.const 304
    local.set 92
    local.get 7
    local.get 92
    i32.add
    local.set 93
    local.get 93
    global.set $__stack_pointer
    return
  )
  (func $_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h68fb77bf8dc0effcE (;35;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 48
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    global.set $__stack_pointer
    local.get 6
    local.get 2
    i32.store
    local.get 6
    local.get 3
    i32.store offset=4
    local.get 6
    local.get 0
    i32.store offset=20
    local.get 6
    local.get 1
    i32.store offset=24
    local.get 6
    local.set 7
    local.get 6
    local.get 7
    i32.store offset=28
    local.get 6
    i32.load
    local.set 8
    block ;; label = @1
      block ;; label = @2
        local.get 8
        br_if 0 (;@2;)
        br 1 (;@1;)
      end
      local.get 6
      local.get 1
      i32.store offset=32
      local.get 6
      i32.load
      local.set 9
      local.get 6
      i32.load offset=4
      local.set 10
      local.get 6
      local.get 9
      i32.store offset=8
      local.get 6
      local.get 10
      i32.store offset=12
      i32.const 8
      local.set 11
      local.get 6
      local.get 11
      i32.add
      local.set 12
      local.get 12
      local.set 13
      local.get 6
      local.get 13
      i32.store offset=36
      local.get 6
      i32.load offset=8
      local.set 14
      i32.const 8
      local.set 15
      local.get 6
      local.get 15
      i32.add
      local.set 16
      local.get 16
      local.set 17
      local.get 6
      local.get 17
      i32.store offset=40
      local.get 6
      i32.load offset=12
      local.set 18
      local.get 6
      local.get 18
      i32.store offset=44
      local.get 6
      local.get 18
      i32.store offset=16
      local.get 6
      i32.load offset=16
      local.set 19
      local.get 1
      local.get 14
      local.get 19
      call $__rust_dealloc
    end
    i32.const 48
    local.set 20
    local.get 6
    local.get 20
    i32.add
    local.set 21
    local.get 21
    global.set $__stack_pointer
    return
  )
  (func $_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$15allocate_zeroed17hdb6e1481ce43188dE (;36;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 32
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    global.set $__stack_pointer
    local.get 6
    local.get 1
    i32.store offset=20
    local.get 6
    local.get 2
    i32.store offset=24
    local.get 6
    local.get 3
    i32.store offset=28
    i32.const 1
    local.set 7
    i32.const 8
    local.set 8
    local.get 6
    local.get 8
    i32.add
    local.set 9
    local.get 9
    local.get 1
    local.get 2
    local.get 3
    local.get 7
    call $_ZN5alloc5alloc6Global10alloc_impl17ha47b2d59fbddaa23E
    local.get 6
    i32.load offset=8
    local.set 10
    local.get 6
    i32.load offset=12
    local.set 11
    local.get 0
    local.get 11
    i32.store offset=4
    local.get 0
    local.get 10
    i32.store
    i32.const 32
    local.set 12
    local.get 6
    local.get 12
    i32.add
    local.set 13
    local.get 13
    global.set $__stack_pointer
    return
  )
  (func $_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$6shrink17hab44145df62518d4E (;37;) (type 11) (param i32 i32 i32 i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 7
    i32.const 432
    local.set 8
    local.get 7
    local.get 8
    i32.sub
    local.set 9
    local.get 9
    global.set $__stack_pointer
    local.get 9
    local.get 3
    i32.store offset=8
    local.get 9
    local.get 4
    i32.store offset=12
    local.get 9
    local.get 5
    i32.store offset=16
    local.get 9
    local.get 6
    i32.store offset=20
    local.get 9
    local.get 1
    i32.store offset=168
    local.get 9
    local.get 2
    i32.store offset=172
    i32.const 16
    local.set 10
    local.get 9
    local.get 10
    i32.add
    local.set 11
    local.get 11
    local.set 12
    local.get 9
    local.get 12
    i32.store offset=264
    local.get 9
    i32.load offset=16
    local.set 13
    local.get 9
    local.get 13
    i32.store offset=268
    block ;; label = @1
      block ;; label = @2
        local.get 13
        br_if 0 (;@2;)
        local.get 9
        i32.load offset=8
        local.set 14
        local.get 9
        i32.load offset=12
        local.set 15
        local.get 1
        local.get 2
        local.get 14
        local.get 15
        call $_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h68fb77bf8dc0effcE
        i32.const 16
        local.set 16
        local.get 9
        local.get 16
        i32.add
        local.set 17
        local.get 17
        local.set 18
        local.get 9
        local.get 18
        i32.store offset=392
        local.get 9
        i32.load offset=20
        local.set 19
        local.get 9
        local.get 19
        i32.store offset=396
        local.get 9
        local.get 19
        i32.store offset=100
        local.get 9
        i32.load offset=100
        local.set 20
        local.get 9
        local.get 20
        i32.store offset=400
        local.get 9
        local.get 20
        i32.store offset=404
        local.get 9
        i32.load offset=404
        local.set 21
        local.get 9
        local.get 21
        i32.store offset=408
        local.get 9
        local.get 21
        i32.store offset=44
        i32.const 0
        local.set 22
        local.get 9
        local.get 22
        i32.store offset=412
        local.get 9
        i32.load offset=44
        local.set 23
        local.get 9
        local.get 23
        i32.store offset=416
        local.get 9
        local.get 23
        i32.store offset=420
        local.get 9
        local.get 23
        i32.store offset=112
        i32.const 0
        local.set 24
        local.get 9
        local.get 24
        i32.store offset=116
        local.get 9
        i32.load offset=112
        local.set 25
        local.get 9
        i32.load offset=116
        local.set 26
        local.get 9
        local.get 25
        i32.store offset=104
        local.get 9
        local.get 26
        i32.store offset=108
        local.get 9
        i32.load offset=104
        local.set 27
        local.get 9
        i32.load offset=108
        local.set 28
        local.get 9
        local.get 27
        i32.store offset=424
        local.get 9
        local.get 28
        i32.store offset=428
        local.get 9
        local.get 27
        i32.store offset=32
        local.get 9
        local.get 28
        i32.store offset=36
        local.get 9
        i32.load offset=32
        local.set 29
        local.get 9
        i32.load offset=36
        local.set 30
        local.get 9
        local.get 29
        i32.store offset=24
        local.get 9
        local.get 30
        i32.store offset=28
        br 1 (;@1;)
      end
      i32.const 8
      local.set 31
      local.get 9
      local.get 31
      i32.add
      local.set 32
      local.get 32
      local.set 33
      local.get 9
      local.get 33
      i32.store offset=272
      local.get 9
      i32.load offset=12
      local.set 34
      local.get 9
      local.get 34
      i32.store offset=276
      local.get 9
      local.get 34
      i32.store offset=124
      local.get 9
      i32.load offset=124
      local.set 35
      i32.const 16
      local.set 36
      local.get 9
      local.get 36
      i32.add
      local.set 37
      local.get 37
      local.set 38
      local.get 9
      local.get 38
      i32.store offset=280
      local.get 9
      i32.load offset=20
      local.set 39
      local.get 9
      local.get 39
      i32.store offset=284
      local.get 9
      local.get 39
      i32.store offset=128
      local.get 9
      i32.load offset=128
      local.set 40
      local.get 35
      local.set 41
      local.get 40
      local.set 42
      local.get 41
      local.get 42
      i32.eq
      local.set 43
      i32.const 1
      local.set 44
      local.get 43
      local.get 44
      i32.and
      local.set 45
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              local.get 45
              br_if 0 (;@5;)
              local.get 9
              i32.load offset=16
              local.set 46
              local.get 9
              i32.load offset=20
              local.set 47
              i32.const 0
              local.set 48
              local.get 9
              local.get 1
              local.get 46
              local.get 47
              local.get 48
              call $_ZN5alloc5alloc6Global10alloc_impl17ha47b2d59fbddaa23E
              local.get 9
              i32.load
              local.set 49
              local.get 9
              i32.load offset=4
              local.set 50
              local.get 9
              local.get 50
              i32.store offset=92
              local.get 9
              local.get 49
              i32.store offset=88
              local.get 9
              i32.load offset=88
              local.set 51
              i32.const 1
              local.set 52
              i32.const 0
              local.set 53
              local.get 53
              local.get 52
              local.get 51
              select
              local.set 54
              local.get 54
              i32.eqz
              br_if 1 (;@4;)
              br 2 (;@3;)
            end
            i32.const 8
            local.set 55
            local.get 9
            local.get 55
            i32.add
            local.set 56
            local.get 56
            local.set 57
            local.get 9
            local.get 57
            i32.store offset=288
            local.get 9
            local.get 2
            i32.store offset=292
            local.get 9
            i32.load offset=8
            local.set 58
            local.get 9
            i32.load offset=12
            local.set 59
            local.get 9
            local.get 58
            i32.store offset=48
            local.get 9
            local.get 59
            i32.store offset=52
            i32.const 48
            local.set 60
            local.get 9
            local.get 60
            i32.add
            local.set 61
            local.get 61
            local.set 62
            local.get 9
            local.get 62
            i32.store offset=296
            local.get 9
            i32.load offset=48
            local.set 63
            i32.const 48
            local.set 64
            local.get 9
            local.get 64
            i32.add
            local.set 65
            local.get 65
            local.set 66
            local.get 9
            local.get 66
            i32.store offset=300
            local.get 9
            i32.load offset=52
            local.set 67
            local.get 9
            local.get 67
            i32.store offset=304
            local.get 9
            local.get 67
            i32.store offset=132
            local.get 9
            i32.load offset=132
            local.set 68
            local.get 2
            local.get 63
            local.get 68
            local.get 13
            call $__rust_realloc
            local.set 69
            local.get 9
            local.get 69
            i32.store offset=308
            local.get 9
            local.get 69
            i32.store offset=312
            local.get 9
            local.get 69
            i32.store offset=140
            local.get 9
            i32.load offset=140
            local.set 70
            local.get 9
            local.get 70
            i32.store offset=316
            local.get 9
            local.get 70
            i32.store offset=320
            local.get 9
            i32.load offset=320
            local.set 71
            i32.const 0
            local.set 72
            local.get 71
            local.set 73
            local.get 72
            local.set 74
            local.get 73
            local.get 74
            i32.eq
            local.set 75
            i32.const -1
            local.set 76
            local.get 75
            local.get 76
            i32.xor
            local.set 77
            i32.const 1
            local.set 78
            local.get 77
            local.get 78
            i32.and
            local.set 79
            block ;; label = @5
              block ;; label = @6
                local.get 79
                br_if 0 (;@6;)
                i32.const 0
                local.set 80
                local.get 9
                local.get 80
                i32.store offset=68
                br 1 (;@5;)
              end
              local.get 9
              local.get 69
              i32.store offset=136
              local.get 9
              i32.load offset=136
              local.set 81
              local.get 9
              local.get 81
              i32.store offset=68
            end
            local.get 9
            i32.load offset=68
            local.set 82
            i32.const 0
            local.set 83
            i32.const 1
            local.set 84
            local.get 84
            local.get 83
            local.get 82
            select
            local.set 85
            block ;; label = @5
              block ;; label = @6
                local.get 85
                br_if 0 (;@6;)
                i32.const 0
                local.set 86
                local.get 9
                local.get 86
                i32.store offset=64
                br 1 (;@5;)
              end
              local.get 9
              i32.load offset=68
              local.set 87
              local.get 9
              local.get 87
              i32.store offset=324
              local.get 9
              local.get 87
              i32.store offset=64
            end
            local.get 9
            i32.load offset=64
            local.set 88
            i32.const 1
            local.set 89
            i32.const 0
            local.set 90
            local.get 90
            local.get 89
            local.get 88
            select
            local.set 91
            block ;; label = @5
              block ;; label = @6
                local.get 91
                br_if 0 (;@6;)
                local.get 9
                i32.load offset=64
                local.set 92
                local.get 9
                local.get 92
                i32.store offset=328
                local.get 9
                local.get 92
                i32.store offset=60
                br 1 (;@5;)
              end
              i32.const 0
              local.set 93
              local.get 9
              local.get 93
              i32.store offset=60
            end
            local.get 9
            i32.load offset=60
            local.set 94
            i32.const 1
            local.set 95
            i32.const 0
            local.set 96
            local.get 96
            local.get 95
            local.get 94
            select
            local.set 97
            block ;; label = @5
              local.get 97
              br_if 0 (;@5;)
              local.get 9
              i32.load offset=60
              local.set 98
              local.get 9
              local.get 98
              i32.store offset=332
              local.get 9
              local.get 98
              i32.store offset=336
              local.get 9
              local.get 98
              i32.store offset=340
              local.get 9
              local.get 98
              i32.store offset=152
              local.get 9
              local.get 13
              i32.store offset=156
              local.get 9
              i32.load offset=152
              local.set 99
              local.get 9
              i32.load offset=156
              local.set 100
              local.get 9
              local.get 99
              i32.store offset=144
              local.get 9
              local.get 100
              i32.store offset=148
              local.get 9
              i32.load offset=144
              local.set 101
              local.get 9
              i32.load offset=148
              local.set 102
              local.get 9
              local.get 101
              i32.store offset=344
              local.get 9
              local.get 102
              i32.store offset=348
              local.get 9
              local.get 101
              i32.store offset=72
              local.get 9
              local.get 102
              i32.store offset=76
              local.get 9
              i32.load offset=72
              local.set 103
              local.get 9
              i32.load offset=76
              local.set 104
              local.get 9
              local.get 103
              i32.store offset=24
              local.get 9
              local.get 104
              i32.store offset=28
              br 4 (;@1;)
            end
            i32.const 0
            local.set 105
            local.get 9
            local.get 105
            i32.store offset=24
            br 3 (;@1;)
          end
          local.get 9
          i32.load offset=88
          local.set 106
          local.get 9
          i32.load offset=92
          local.set 107
          local.get 9
          local.get 106
          i32.store offset=352
          local.get 9
          local.get 107
          i32.store offset=356
          local.get 9
          local.get 106
          i32.store offset=80
          local.get 9
          local.get 107
          i32.store offset=84
          br 1 (;@2;)
        end
        i32.const 0
        local.set 108
        local.get 9
        local.get 108
        i32.store offset=80
      end
      local.get 9
      i32.load offset=80
      local.set 109
      i32.const 1
      local.set 110
      i32.const 0
      local.set 111
      local.get 111
      local.get 110
      local.get 109
      select
      local.set 112
      block ;; label = @2
        local.get 112
        br_if 0 (;@2;)
        local.get 9
        i32.load offset=80
        local.set 113
        local.get 9
        i32.load offset=84
        local.set 114
        local.get 9
        local.get 113
        i32.store offset=360
        local.get 9
        local.get 114
        i32.store offset=364
        local.get 9
        local.get 2
        i32.store offset=372
        local.get 9
        local.get 113
        i32.store offset=376
        local.get 9
        local.get 114
        i32.store offset=380
        local.get 9
        local.get 113
        i32.store offset=384
        local.get 9
        local.get 113
        i32.store offset=164
        local.get 9
        i32.load offset=164
        local.set 115
        local.get 9
        local.get 115
        i32.store offset=388
        i32.const 0
        local.set 116
        local.get 13
        local.get 116
        i32.shl
        local.set 117
        local.get 115
        local.get 2
        local.get 117
        call $memcpy
        drop
        local.get 9
        i32.load offset=8
        local.set 118
        local.get 9
        i32.load offset=12
        local.set 119
        local.get 1
        local.get 2
        local.get 118
        local.get 119
        call $_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$10deallocate17h68fb77bf8dc0effcE
        local.get 9
        local.get 113
        i32.store offset=24
        local.get 9
        local.get 114
        i32.store offset=28
        br 1 (;@1;)
      end
      i32.const 0
      local.set 120
      local.get 9
      local.get 120
      i32.store offset=24
    end
    local.get 9
    i32.load offset=24
    local.set 121
    local.get 9
    i32.load offset=28
    local.set 122
    local.get 0
    local.get 122
    i32.store offset=4
    local.get 0
    local.get 121
    i32.store
    i32.const 432
    local.set 123
    local.get 9
    local.get 123
    i32.add
    local.set 124
    local.get 124
    global.set $__stack_pointer
    return
  )
  (func $_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$8allocate17h2ff4f4dc5181b6c1E (;38;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 32
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    global.set $__stack_pointer
    local.get 6
    local.get 1
    i32.store offset=20
    local.get 6
    local.get 2
    i32.store offset=24
    local.get 6
    local.get 3
    i32.store offset=28
    i32.const 0
    local.set 7
    i32.const 8
    local.set 8
    local.get 6
    local.get 8
    i32.add
    local.set 9
    local.get 9
    local.get 1
    local.get 2
    local.get 3
    local.get 7
    call $_ZN5alloc5alloc6Global10alloc_impl17ha47b2d59fbddaa23E
    local.get 6
    i32.load offset=8
    local.set 10
    local.get 6
    i32.load offset=12
    local.set 11
    local.get 0
    local.get 11
    i32.store offset=4
    local.get 0
    local.get 10
    i32.store
    i32.const 32
    local.set 12
    local.get 6
    local.get 12
    i32.add
    local.set 13
    local.get 13
    global.set $__stack_pointer
    return
  )
  (func $_ZN119_$LT$core..ptr..non_null..NonNull$LT$T$GT$$u20$as$u20$core..convert..From$LT$core..ptr..unique..Unique$LT$T$GT$$GT$$GT$4from17h15e4824b7481feccE (;39;) (type 9) (param i32) (result i32)
    (local i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    local.get 0
    i32.store offset=4
    local.get 3
    local.get 0
    i32.store offset=8
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 3
    local.get 0
    i32.store
    local.get 3
    i32.load
    local.set 4
    local.get 4
    return
  )
  (func $_ZN5alloc5boxed16Box$LT$T$C$A$GT$11into_unique17hb1e1948e1c601e97E (;40;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 128
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    local.get 1
    i32.store
    local.get 5
    local.get 2
    i32.store offset=4
    local.get 5
    local.get 5
    i32.store offset=72
    i32.const 24
    local.set 6
    local.get 5
    local.get 6
    i32.add
    local.set 7
    local.get 5
    local.get 7
    i32.store offset=76
    local.get 5
    i32.load
    local.set 8
    local.get 5
    i32.load offset=4
    local.set 9
    local.get 5
    local.get 8
    i32.store offset=80
    local.get 5
    local.get 9
    i32.store offset=84
    local.get 5
    local.get 8
    i32.store offset=32
    local.get 5
    local.get 9
    i32.store offset=36
    i32.const 32
    local.set 10
    local.get 5
    local.get 10
    i32.add
    local.set 11
    local.get 5
    local.get 11
    i32.store offset=92
    local.get 5
    i32.load offset=32
    local.set 12
    local.get 5
    i32.load offset=36
    local.set 13
    local.get 5
    local.get 12
    i32.store offset=96
    local.get 5
    local.get 13
    i32.store offset=100
    local.get 5
    local.get 12
    i32.store offset=104
    local.get 5
    local.get 13
    i32.store offset=108
    local.get 5
    local.get 12
    i32.store offset=112
    local.get 5
    local.get 13
    i32.store offset=116
    local.get 5
    local.get 12
    i32.store offset=120
    local.get 5
    local.get 13
    i32.store offset=124
    local.get 5
    local.get 12
    i32.store offset=40
    local.get 5
    local.get 13
    i32.store offset=44
    local.get 5
    i32.load offset=40
    local.set 14
    local.get 5
    i32.load offset=44
    local.set 15
    local.get 5
    local.get 14
    i32.store offset=16
    local.get 5
    local.get 15
    i32.store offset=20
    local.get 5
    i32.load offset=16
    local.set 16
    local.get 5
    i32.load offset=20
    local.set 17
    local.get 5
    local.get 16
    i32.store offset=8
    local.get 5
    local.get 17
    i32.store offset=12
    local.get 5
    i32.load offset=8
    local.set 18
    local.get 5
    i32.load offset=12
    local.set 19
    local.get 0
    local.get 19
    i32.store offset=4
    local.get 0
    local.get 18
    i32.store
    return
  )
  (func $_ZN5alloc5boxed70Box$LT$$u5b$core..mem..maybe_uninit..MaybeUninit$LT$T$GT$$u5d$$C$A$GT$11assume_init17hfb7aab2623bf3355E (;41;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 96
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store offset=40
    local.get 5
    local.get 2
    i32.store offset=44
    local.get 5
    local.get 1
    local.get 2
    call $_ZN5alloc5boxed16Box$LT$T$C$A$GT$11into_unique17hb1e1948e1c601e97E
    local.get 5
    i32.load offset=4
    local.set 6
    local.get 5
    i32.load
    local.set 7
    local.get 5
    local.get 7
    i32.store offset=64
    local.get 5
    local.get 6
    i32.store offset=68
    local.get 5
    local.get 7
    i32.store offset=72
    local.get 5
    local.get 6
    i32.store offset=76
    local.get 5
    local.get 7
    i32.store offset=16
    local.get 5
    local.get 6
    i32.store offset=20
    local.get 5
    i32.load offset=16
    local.set 8
    local.get 5
    i32.load offset=20
    local.set 9
    local.get 5
    local.get 8
    i32.store offset=80
    local.get 5
    local.get 9
    i32.store offset=84
    local.get 5
    local.get 8
    i32.store offset=88
    local.get 5
    local.get 9
    i32.store offset=92
    local.get 5
    local.get 8
    i32.store offset=32
    local.get 5
    local.get 9
    i32.store offset=36
    local.get 5
    i32.load offset=32
    local.set 10
    local.get 5
    i32.load offset=36
    local.set 11
    local.get 5
    local.get 10
    i32.store offset=24
    local.get 5
    local.get 11
    i32.store offset=28
    local.get 5
    i32.load offset=24
    local.set 12
    local.get 5
    i32.load offset=28
    local.set 13
    local.get 5
    local.get 12
    i32.store offset=8
    local.get 5
    local.get 13
    i32.store offset=12
    local.get 5
    i32.load offset=8
    local.set 14
    local.get 5
    i32.load offset=12
    local.set 15
    local.get 0
    local.get 15
    i32.store offset=4
    local.get 0
    local.get 14
    i32.store
    i32.const 96
    local.set 16
    local.get 5
    local.get 16
    i32.add
    local.set 17
    local.get 17
    global.set $__stack_pointer
    return
  )
  (func $_ZN76_$LT$wasi_reactor..Component$u20$as$u20$wasi_reactor_bindings..Component$GT$5hello17hbb14f8bbd71966e2E (;42;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 48
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    i32.const 8
    local.set 5
    local.get 4
    local.get 5
    i32.add
    local.set 6
    local.get 6
    local.get 1
    call $_ZN4core3fmt10ArgumentV111new_display17h4ac66c0a8e10c207E
    local.get 4
    i32.load offset=12
    local.set 7
    local.get 4
    i32.load offset=8
    local.set 8
    local.get 4
    local.get 8
    i32.store offset=40
    local.get 4
    local.get 7
    i32.store offset=44
    i32.const 16
    local.set 9
    local.get 4
    local.get 9
    i32.add
    local.set 10
    local.get 10
    local.set 11
    i32.const 1048816
    local.set 12
    i32.const 2
    local.set 13
    i32.const 40
    local.set 14
    local.get 4
    local.get 14
    i32.add
    local.set 15
    local.get 15
    local.set 16
    i32.const 1
    local.set 17
    local.get 11
    local.get 12
    local.get 13
    local.get 16
    local.get 17
    call $_ZN4core3fmt9Arguments6new_v117h5b3fab9a6985d3e3E
    i32.const 16
    local.set 18
    local.get 4
    local.get 18
    i32.add
    local.set 19
    local.get 19
    local.set 20
    local.get 0
    local.get 20
    call $_ZN5alloc3fmt6format17h2129a4646cb8d78fE
    local.get 1
    call $_ZN4core3ptr42drop_in_place$LT$alloc..string..String$GT$17hdb4a6961e9d6351cE
    i32.const 48
    local.set 21
    local.get 4
    local.get 21
    i32.add
    local.set 22
    local.get 22
    global.set $__stack_pointer
    return
  )
  (func $_ZN76_$LT$wasi_reactor..Component$u20$as$u20$wasi_reactor_bindings..Component$GT$4uuid17h3f275b75e69c92a7E (;43;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 64
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    i32.const 48
    local.set 4
    local.get 3
    local.get 4
    i32.add
    local.set 5
    local.get 5
    local.set 6
    local.get 6
    call $_ZN4uuid2v428_$LT$impl$u20$uuid..Uuid$GT$6new_v417h230c5c61b114d67eE
    i32.const 8
    local.set 7
    local.get 3
    local.get 7
    i32.add
    local.set 8
    i32.const 48
    local.set 9
    local.get 3
    local.get 9
    i32.add
    local.set 10
    local.get 8
    local.get 10
    call $_ZN4core3fmt10ArgumentV111new_display17h61a41a94be7998b1E
    local.get 3
    i32.load offset=12
    local.set 11
    local.get 3
    i32.load offset=8
    local.set 12
    local.get 3
    local.get 12
    i32.store offset=40
    local.get 3
    local.get 11
    i32.store offset=44
    i32.const 16
    local.set 13
    local.get 3
    local.get 13
    i32.add
    local.set 14
    local.get 14
    local.set 15
    i32.const 1048832
    local.set 16
    i32.const 1
    local.set 17
    i32.const 40
    local.set 18
    local.get 3
    local.get 18
    i32.add
    local.set 19
    local.get 19
    local.set 20
    local.get 15
    local.get 16
    local.get 17
    local.get 20
    local.get 17
    call $_ZN4core3fmt9Arguments6new_v117h5b3fab9a6985d3e3E
    i32.const 16
    local.set 21
    local.get 3
    local.get 21
    i32.add
    local.set 22
    local.get 22
    local.set 23
    local.get 0
    local.get 23
    call $_ZN5alloc3fmt6format17h2129a4646cb8d78fE
    i32.const 64
    local.set 24
    local.get 3
    local.get 24
    i32.add
    local.set 25
    local.get 25
    global.set $__stack_pointer
    return
  )
  (func $hello (;44;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=8
    local.get 4
    local.get 1
    i32.store offset=12
    local.get 0
    local.get 1
    call $_ZN21wasi_reactor_bindings10call_hello17h83f4459c06bcef47E
    local.set 5
    i32.const 16
    local.set 6
    local.get 4
    local.get 6
    i32.add
    local.set 7
    local.get 7
    global.set $__stack_pointer
    local.get 5
    return
  )
  (func $cabi_post_hello (;45;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 0
    call $_ZN21wasi_reactor_bindings17post_return_hello17h0a54c64f2bcc882aE
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.add
    local.set 5
    local.get 5
    global.set $__stack_pointer
    return
  )
  (func $uuid (;46;) (type 12) (result i32)
    (local i32)
    call $_ZN21wasi_reactor_bindings9call_uuid17hbf5f29b4bf70a86fE
    local.set 0
    local.get 0
    return
  )
  (func $cabi_post_uuid (;47;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 0
    call $_ZN21wasi_reactor_bindings16post_return_uuid17he787547f7fccf63fE
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.add
    local.set 5
    local.get 5
    global.set $__stack_pointer
    return
  )
  (func $_ZN5alloc7raw_vec14handle_reserve28_$u7b$$u7b$closure$u7d$$u7d$17hb49258dd7097fcdfE (;48;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 32
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    local.get 1
    i32.store
    local.get 5
    local.get 2
    i32.store offset=4
    local.get 5
    local.set 6
    local.get 5
    local.get 6
    i32.store offset=20
    local.get 5
    local.set 7
    local.get 5
    local.get 7
    i32.store offset=24
    local.get 5
    i32.load offset=4
    local.set 8
    i32.const 0
    local.set 9
    i32.const 1
    local.set 10
    local.get 10
    local.get 9
    local.get 8
    select
    local.set 11
    block ;; label = @1
      block ;; label = @2
        local.get 11
        br_if 0 (;@2;)
        i32.const 0
        local.set 12
        local.get 5
        local.get 12
        i32.store offset=12
        br 1 (;@1;)
      end
      local.get 5
      local.set 13
      local.get 5
      local.get 13
      i32.store offset=28
      local.get 5
      i32.load
      local.set 14
      local.get 5
      i32.load offset=4
      local.set 15
      local.get 5
      local.get 14
      i32.store offset=8
      local.get 5
      local.get 15
      i32.store offset=12
    end
    local.get 5
    i32.load offset=8
    local.set 16
    local.get 5
    i32.load offset=12
    local.set 17
    local.get 0
    local.get 17
    i32.store offset=4
    local.get 0
    local.get 16
    i32.store
    return
  )
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$11allocate_in17h387384a793975a6fE (;49;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 176
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 2
    local.set 6
    local.get 5
    local.get 6
    i32.store8 offset=55
    local.get 5
    local.get 1
    i32.store offset=132
    i32.const 0
    local.set 7
    i32.const 1
    local.set 8
    local.get 7
    local.get 8
    i32.and
    local.set 9
    block ;; label = @1
      block ;; label = @2
        local.get 9
        br_if 0 (;@2;)
        i32.const 0
        local.set 10
        local.get 1
        local.set 11
        local.get 10
        local.set 12
        local.get 11
        local.get 12
        i32.eq
        local.set 13
        i32.const 1
        local.set 14
        local.get 13
        local.get 14
        i32.and
        local.set 15
        local.get 5
        local.get 15
        i32.store8 offset=79
        br 1 (;@1;)
      end
      i32.const 1
      local.set 16
      local.get 5
      local.get 16
      i32.store8 offset=79
    end
    local.get 5
    i32.load8_u offset=79
    local.set 17
    i32.const 1
    local.set 18
    local.get 17
    local.get 18
    i32.and
    local.set 19
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  local.get 19
                  br_if 0 (;@7;)
                  i32.const 1
                  local.set 20
                  local.get 5
                  local.get 20
                  i32.store offset=136
                  local.get 5
                  local.get 20
                  i32.store offset=140
                  local.get 5
                  i32.load offset=140
                  local.set 21
                  i32.const 40
                  local.set 22
                  local.get 5
                  local.get 22
                  i32.add
                  local.set 23
                  local.get 23
                  local.get 20
                  local.get 21
                  local.get 1
                  call $_ZN4core5alloc6layout6Layout5array5inner17h56a3f1abda73a3e5E
                  local.get 5
                  i32.load offset=40
                  local.set 24
                  local.get 5
                  i32.load offset=44
                  local.set 25
                  local.get 5
                  local.get 25
                  i32.store offset=92
                  local.get 5
                  local.get 24
                  i32.store offset=88
                  local.get 5
                  i32.load offset=92
                  local.set 26
                  i32.const 1
                  local.set 27
                  i32.const 0
                  local.set 28
                  local.get 28
                  local.get 27
                  local.get 26
                  select
                  local.set 29
                  local.get 29
                  i32.eqz
                  br_if 1 (;@6;)
                  br 2 (;@5;)
                end
                i32.const 8
                local.set 30
                local.get 5
                local.get 30
                i32.add
                local.set 31
                local.get 31
                call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$6new_in17ha8bae81afe838448E
                local.get 5
                i32.load offset=8
                local.set 32
                local.get 5
                i32.load offset=12
                local.set 33
                local.get 5
                local.get 33
                i32.store offset=68
                local.get 5
                local.get 32
                i32.store offset=64
                br 5 (;@1;)
              end
              local.get 5
              i32.load offset=88
              local.set 34
              local.get 5
              i32.load offset=92
              local.set 35
              local.get 5
              local.get 34
              i32.store offset=144
              local.get 5
              local.get 35
              i32.store offset=148
              local.get 5
              local.get 34
              i32.store offset=80
              local.get 5
              local.get 35
              i32.store offset=84
              i32.const 80
              local.set 36
              local.get 5
              local.get 36
              i32.add
              local.set 37
              local.get 37
              local.set 38
              local.get 5
              local.get 38
              i32.store offset=152
              local.get 5
              i32.load offset=80
              local.set 39
              local.get 5
              local.get 39
              i32.store offset=156
              i32.const 2147483647
              local.set 40
              local.get 39
              local.set 41
              local.get 40
              local.set 42
              local.get 41
              local.get 42
              i32.gt_u
              local.set 43
              i32.const 1
              local.set 44
              local.get 43
              local.get 44
              i32.and
              local.set 45
              local.get 45
              br_if 2 (;@3;)
              br 1 (;@4;)
            end
            call $_ZN5alloc7raw_vec17capacity_overflow17h38ac120e37f2568fE
            unreachable
          end
          i32.const -2147483647
          local.set 46
          local.get 5
          local.get 46
          i32.store offset=100
          br 1 (;@2;)
        end
        i32.const 0
        local.set 47
        local.get 5
        local.get 47
        i32.store offset=124
        local.get 5
        i32.load offset=120
        local.set 48
        local.get 5
        i32.load offset=124
        local.set 49
        i32.const 32
        local.set 50
        local.get 5
        local.get 50
        i32.add
        local.set 51
        local.get 51
        local.get 48
        local.get 49
        call $_ZN50_$LT$T$u20$as$u20$core..convert..Into$LT$U$GT$$GT$4into17h88275e2536533eaeE
        local.get 5
        i32.load offset=36
        local.set 52
        local.get 5
        i32.load offset=32
        local.set 53
        local.get 5
        local.get 53
        i32.store offset=96
        local.get 5
        local.get 52
        i32.store offset=100
      end
      local.get 5
      i32.load offset=100
      local.set 54
      i32.const -2147483647
      local.set 55
      local.get 54
      local.set 56
      local.get 55
      local.set 57
      local.get 56
      local.get 57
      i32.eq
      local.set 58
      i32.const 0
      local.set 59
      i32.const 1
      local.set 60
      i32.const 1
      local.set 61
      local.get 58
      local.get 61
      i32.and
      local.set 62
      local.get 59
      local.get 60
      local.get 62
      select
      local.set 63
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              local.get 63
              br_if 0 (;@5;)
              local.get 5
              i32.load8_u offset=55
              local.set 64
              i32.const 1
              local.set 65
              local.get 64
              local.get 65
              i32.and
              local.set 66
              local.get 66
              i32.eqz
              br_if 1 (;@4;)
              br 2 (;@3;)
            end
            call $_ZN5alloc7raw_vec17capacity_overflow17h38ac120e37f2568fE
            unreachable
          end
          i32.const 16
          local.set 67
          local.get 5
          local.get 67
          i32.add
          local.set 68
          i32.const 56
          local.set 69
          local.get 5
          local.get 69
          i32.add
          local.set 70
          local.get 68
          local.get 70
          local.get 34
          local.get 35
          call $_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$8allocate17h2ff4f4dc5181b6c1E
          local.get 5
          i32.load offset=16
          local.set 71
          local.get 5
          i32.load offset=20
          local.set 72
          local.get 5
          local.get 72
          i32.store offset=108
          local.get 5
          local.get 71
          i32.store offset=104
          br 1 (;@2;)
        end
        i32.const 24
        local.set 73
        local.get 5
        local.get 73
        i32.add
        local.set 74
        i32.const 56
        local.set 75
        local.get 5
        local.get 75
        i32.add
        local.set 76
        local.get 74
        local.get 76
        local.get 34
        local.get 35
        call $_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$15allocate_zeroed17hdb6e1481ce43188dE
        local.get 5
        i32.load offset=24
        local.set 77
        local.get 5
        i32.load offset=28
        local.set 78
        local.get 5
        local.get 78
        i32.store offset=108
        local.get 5
        local.get 77
        i32.store offset=104
      end
      local.get 5
      i32.load offset=104
      local.set 79
      i32.const 1
      local.set 80
      i32.const 0
      local.set 81
      local.get 81
      local.get 80
      local.get 79
      select
      local.set 82
      block ;; label = @2
        local.get 82
        br_if 0 (;@2;)
        local.get 5
        i32.load offset=104
        local.set 83
        local.get 5
        i32.load offset=108
        local.set 84
        local.get 5
        local.get 83
        i32.store offset=160
        local.get 5
        local.get 84
        i32.store offset=164
        local.get 5
        local.get 83
        i32.store offset=168
        local.get 5
        local.get 83
        i32.store offset=116
        local.get 5
        i32.load offset=116
        local.set 85
        local.get 5
        local.get 85
        i32.store offset=172
        local.get 5
        local.get 85
        i32.store offset=128
        local.get 5
        i32.load offset=128
        local.set 86
        local.get 5
        local.get 86
        i32.store offset=112
        local.get 5
        i32.load offset=112
        local.set 87
        local.get 5
        local.get 87
        i32.store offset=68
        local.get 5
        local.get 1
        i32.store offset=64
        br 1 (;@1;)
      end
      local.get 34
      local.get 35
      call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
      unreachable
    end
    local.get 5
    i32.load offset=64
    local.set 88
    local.get 5
    i32.load offset=68
    local.set 89
    local.get 0
    local.get 89
    i32.store offset=4
    local.get 0
    local.get 88
    i32.store
    i32.const 176
    local.set 90
    local.get 5
    local.get 90
    i32.add
    local.set 91
    local.get 91
    global.set $__stack_pointer
    return
  )
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$6new_in17ha8bae81afe838448E (;50;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 48
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    i32.const 1
    local.set 4
    local.get 3
    local.get 4
    i32.store offset=32
    local.get 3
    local.get 4
    i32.store offset=36
    local.get 3
    i32.load offset=36
    local.set 5
    local.get 3
    local.get 5
    i32.store offset=40
    local.get 3
    local.get 5
    i32.store offset=44
    local.get 3
    local.get 5
    i32.store offset=20
    local.get 3
    i32.load offset=20
    local.set 6
    local.get 3
    local.get 6
    i32.store offset=16
    local.get 3
    i32.load offset=16
    local.set 7
    local.get 3
    local.get 7
    i32.store offset=12
    i32.const 0
    local.set 8
    local.get 3
    local.get 8
    i32.store offset=8
    local.get 3
    i32.load offset=8
    local.set 9
    local.get 3
    i32.load offset=12
    local.set 10
    local.get 0
    local.get 10
    i32.store offset=4
    local.get 0
    local.get 9
    i32.store
    return
  )
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$13shrink_to_fit17h4cc734d24f4b891aE (;51;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=8
    local.get 4
    local.get 1
    i32.store offset=12
    local.get 4
    local.get 0
    local.get 1
    call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$6shrink17h3d5ab90437b9b86aE
    local.get 4
    i32.load offset=4
    local.set 5
    local.get 4
    i32.load
    local.set 6
    local.get 6
    local.get 5
    call $_ZN5alloc7raw_vec14handle_reserve17hcd44055f17776da7E
    i32.const 16
    local.set 7
    local.get 4
    local.get 7
    i32.add
    local.set 8
    local.get 8
    global.set $__stack_pointer
    return
  )
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$6shrink17h3d5ab90437b9b86aE (;52;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 240
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store offset=160
    local.get 5
    local.get 2
    i32.store offset=164
    local.get 5
    local.get 1
    i32.store offset=168
    i32.const 0
    local.set 6
    i32.const 1
    local.set 7
    local.get 6
    local.get 7
    i32.and
    local.set 8
    block ;; label = @1
      block ;; label = @2
        local.get 8
        br_if 0 (;@2;)
        local.get 1
        i32.load
        local.set 9
        local.get 5
        local.get 9
        i32.store offset=20
        br 1 (;@1;)
      end
      i32.const -1
      local.set 10
      local.get 5
      local.get 10
      i32.store offset=20
    end
    local.get 5
    i32.load offset=20
    local.set 11
    local.get 2
    local.set 12
    local.get 11
    local.set 13
    local.get 12
    local.get 13
    i32.le_u
    local.set 14
    i32.const -1
    local.set 15
    local.get 14
    local.get 15
    i32.xor
    local.set 16
    i32.const 1
    local.set 17
    local.get 16
    local.get 17
    i32.and
    local.set 18
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  local.get 18
                  br_if 0 (;@7;)
                  i32.const 56
                  local.set 19
                  local.get 5
                  local.get 19
                  i32.add
                  local.set 20
                  local.get 20
                  local.set 21
                  local.get 21
                  local.get 1
                  call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h381f0dc8cd1ad676E
                  local.get 5
                  i32.load offset=64
                  local.set 22
                  i32.const 0
                  local.set 23
                  i32.const 1
                  local.set 24
                  local.get 24
                  local.get 23
                  local.get 22
                  select
                  local.set 25
                  i32.const 1
                  local.set 26
                  local.get 25
                  local.set 27
                  local.get 26
                  local.set 28
                  local.get 27
                  local.get 28
                  i32.eq
                  local.set 29
                  i32.const 1
                  local.set 30
                  local.get 29
                  local.get 30
                  i32.and
                  local.set 31
                  local.get 31
                  br_if 1 (;@6;)
                  br 2 (;@5;)
                end
                i32.const 24
                local.set 32
                local.get 5
                local.get 32
                i32.add
                local.set 33
                local.get 33
                local.set 34
                i32.const 1048876
                local.set 35
                i32.const 1
                local.set 36
                i32.const 1048884
                local.set 37
                i32.const 0
                local.set 38
                local.get 34
                local.get 35
                local.get 36
                local.get 37
                local.get 38
                call $_ZN4core3fmt9Arguments6new_v117h5b3fab9a6985d3e3E
                i32.const 24
                local.set 39
                local.get 5
                local.get 39
                i32.add
                local.set 40
                local.get 40
                local.set 41
                i32.const 1048960
                local.set 42
                local.get 41
                local.get 42
                call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
                unreachable
              end
              i32.const 8
              local.set 43
              i32.const 72
              local.set 44
              local.get 5
              local.get 44
              i32.add
              local.set 45
              local.get 45
              local.get 43
              i32.add
              local.set 46
              i32.const 56
              local.set 47
              local.get 5
              local.get 47
              i32.add
              local.set 48
              local.get 48
              local.get 43
              i32.add
              local.set 49
              local.get 49
              i32.load
              local.set 50
              local.get 46
              local.get 50
              i32.store
              local.get 5
              i64.load offset=56
              local.set 51
              local.get 5
              local.get 51
              i64.store offset=72
              local.get 5
              i32.load offset=72
              local.set 52
              local.get 5
              local.get 52
              i32.store offset=172
              local.get 5
              i32.load offset=76
              local.set 53
              local.get 5
              i32.load offset=80
              local.set 54
              local.get 5
              local.get 53
              i32.store offset=48
              local.get 5
              local.get 54
              i32.store offset=52
              i32.const 1
              local.set 55
              local.get 5
              local.get 55
              i32.store offset=176
              i32.const 0
              local.set 56
              local.get 2
              local.get 56
              i32.shl
              local.set 57
              local.get 5
              local.get 57
              i32.store offset=180
              local.get 5
              i32.load offset=180
              local.set 58
              local.get 5
              local.get 58
              i32.store offset=184
              local.get 5
              local.get 58
              i32.store offset=188
              i32.const 48
              local.set 59
              local.get 5
              local.get 59
              i32.add
              local.set 60
              local.get 60
              local.set 61
              local.get 5
              local.get 61
              i32.store offset=192
              local.get 5
              i32.load offset=52
              local.set 62
              local.get 5
              local.get 62
              i32.store offset=196
              local.get 5
              local.get 62
              i32.store offset=140
              local.get 5
              i32.load offset=140
              local.set 63
              local.get 5
              local.get 63
              i32.store offset=200
              local.get 5
              local.get 63
              i32.store offset=204
              local.get 5
              i32.load offset=204
              local.set 64
              local.get 5
              local.get 58
              i32.store offset=88
              local.get 5
              local.get 64
              i32.store offset=92
              local.get 5
              i32.load offset=48
              local.set 65
              local.get 5
              i32.load offset=52
              local.set 66
              local.get 5
              i32.load offset=88
              local.set 67
              local.get 5
              i32.load offset=92
              local.set 68
              local.get 5
              local.get 1
              local.get 52
              local.get 65
              local.get 66
              local.get 67
              local.get 68
              call $_ZN63_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Allocator$GT$6shrink17hab44145df62518d4E
              local.get 5
              i32.load offset=4
              local.set 69
              local.get 5
              i32.load
              local.set 70
              i32.const 88
              local.set 71
              local.get 5
              local.get 71
              i32.add
              local.set 72
              local.get 72
              local.set 73
              local.get 5
              local.get 73
              i32.store offset=124
              local.get 5
              i32.load offset=124
              local.set 74
              i32.const 112
              local.set 75
              local.get 5
              local.get 75
              i32.add
              local.set 76
              local.get 76
              local.set 77
              local.get 77
              local.get 70
              local.get 69
              local.get 74
              call $_ZN4core6result19Result$LT$T$C$E$GT$7map_err17h13bd545a05ed41bbE
              local.get 5
              i32.load offset=112
              local.set 78
              local.get 78
              i32.eqz
              br_if 1 (;@4;)
              br 2 (;@3;)
            end
            i32.const -2147483647
            local.set 79
            local.get 5
            local.get 79
            i32.store offset=12
            br 3 (;@1;)
          end
          local.get 5
          i32.load offset=116
          local.set 80
          local.get 5
          i32.load offset=120
          local.set 81
          local.get 5
          local.get 80
          i32.store offset=216
          local.get 5
          local.get 81
          i32.store offset=220
          local.get 5
          local.get 80
          i32.store offset=100
          local.get 5
          local.get 81
          i32.store offset=104
          i32.const 0
          local.set 82
          local.get 5
          local.get 82
          i32.store offset=96
          br 1 (;@2;)
        end
        local.get 5
        i32.load offset=116
        local.set 83
        local.get 5
        i32.load offset=120
        local.set 84
        local.get 5
        local.get 83
        i32.store offset=208
        local.get 5
        local.get 84
        i32.store offset=212
        local.get 5
        local.get 83
        i32.store offset=144
        local.get 5
        local.get 84
        i32.store offset=148
        local.get 5
        i32.load offset=144
        local.set 85
        local.get 5
        i32.load offset=148
        local.set 86
        local.get 5
        local.get 85
        i32.store offset=100
        local.get 5
        local.get 86
        i32.store offset=104
        i32.const 1
        local.set 87
        local.get 5
        local.get 87
        i32.store offset=96
      end
      local.get 5
      i32.load offset=96
      local.set 88
      block ;; label = @2
        local.get 88
        br_if 0 (;@2;)
        local.get 5
        i32.load offset=100
        local.set 89
        local.get 5
        i32.load offset=104
        local.set 90
        local.get 5
        local.get 89
        i32.store offset=232
        local.get 5
        local.get 90
        i32.store offset=236
        local.get 1
        local.get 89
        local.get 90
        local.get 2
        call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15set_ptr_and_cap17h39a40c6c19fb8299E
        i32.const -2147483647
        local.set 91
        local.get 5
        local.get 91
        i32.store offset=12
        br 1 (;@1;)
      end
      local.get 5
      i32.load offset=100
      local.set 92
      local.get 5
      i32.load offset=104
      local.set 93
      local.get 5
      local.get 92
      i32.store offset=128
      local.get 5
      local.get 93
      i32.store offset=132
      local.get 5
      i32.load offset=128
      local.set 94
      local.get 5
      i32.load offset=132
      local.set 95
      local.get 5
      local.get 94
      i32.store offset=224
      local.get 5
      local.get 95
      i32.store offset=228
      local.get 5
      local.get 94
      i32.store offset=152
      local.get 5
      local.get 95
      i32.store offset=156
      local.get 5
      i32.load offset=152
      local.set 96
      local.get 5
      i32.load offset=156
      local.set 97
      local.get 5
      local.get 96
      i32.store offset=8
      local.get 5
      local.get 97
      i32.store offset=12
    end
    local.get 5
    i32.load offset=8
    local.set 98
    local.get 5
    i32.load offset=12
    local.set 99
    local.get 0
    local.get 99
    i32.store offset=4
    local.get 0
    local.get 98
    i32.store
    i32.const 240
    local.set 100
    local.get 5
    local.get 100
    i32.add
    local.set 101
    local.get 101
    global.set $__stack_pointer
    return
  )
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_memory17h381f0dc8cd1ad676E (;53;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 80
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 1
    i32.store offset=36
    i32.const 0
    local.set 5
    i32.const 1
    local.set 6
    local.get 5
    local.get 6
    i32.and
    local.set 7
    block ;; label = @1
      block ;; label = @2
        local.get 7
        br_if 0 (;@2;)
        local.get 1
        i32.load
        local.set 8
        i32.const 0
        local.set 9
        local.get 8
        local.set 10
        local.get 9
        local.set 11
        local.get 10
        local.get 11
        i32.eq
        local.set 12
        i32.const 1
        local.set 13
        local.get 12
        local.get 13
        i32.and
        local.set 14
        local.get 4
        local.get 14
        i32.store8 offset=7
        br 1 (;@1;)
      end
      i32.const 1
      local.set 15
      local.get 4
      local.get 15
      i32.store8 offset=7
    end
    local.get 4
    i32.load8_u offset=7
    local.set 16
    i32.const 1
    local.set 17
    local.get 16
    local.get 17
    i32.and
    local.set 18
    block ;; label = @1
      block ;; label = @2
        local.get 18
        br_if 0 (;@2;)
        i32.const 1
        local.set 19
        local.get 4
        local.get 19
        i32.store offset=40
        i32.const 1
        local.set 20
        local.get 4
        local.get 20
        i32.store offset=44
        local.get 1
        i32.load
        local.set 21
        local.get 4
        local.get 21
        i32.store offset=48
        i32.const 0
        local.set 22
        local.get 21
        local.get 22
        i32.shl
        local.set 23
        local.get 4
        local.get 23
        i32.store offset=52
        local.get 4
        i32.load offset=52
        local.set 24
        local.get 4
        local.get 24
        i32.store offset=56
        local.get 4
        local.get 24
        i32.store offset=60
        i32.const 1
        local.set 25
        local.get 4
        local.get 25
        i32.store offset=64
        local.get 4
        i32.load offset=64
        local.set 26
        local.get 4
        local.get 24
        i32.store offset=8
        local.get 4
        local.get 26
        i32.store offset=12
        local.get 1
        i32.load offset=4
        local.set 27
        local.get 4
        local.get 27
        i32.store offset=68
        local.get 4
        local.get 27
        i32.store offset=72
        local.get 4
        local.get 27
        i32.store offset=76
        local.get 4
        local.get 27
        i32.store offset=32
        local.get 4
        i32.load offset=32
        local.set 28
        local.get 4
        local.get 28
        i32.store offset=28
        local.get 4
        i32.load offset=28
        local.set 29
        local.get 29
        call $_ZN50_$LT$T$u20$as$u20$core..convert..Into$LT$U$GT$$GT$4into17h549c009440e01153E
        local.set 30
        local.get 4
        local.get 30
        i32.store offset=16
        local.get 4
        i32.load offset=8
        local.set 31
        local.get 4
        i32.load offset=12
        local.set 32
        local.get 4
        local.get 31
        i32.store offset=20
        local.get 4
        local.get 32
        i32.store offset=24
        local.get 4
        i64.load offset=16
        local.set 33
        local.get 0
        local.get 33
        i64.store align=4
        i32.const 8
        local.set 34
        local.get 0
        local.get 34
        i32.add
        local.set 35
        i32.const 16
        local.set 36
        local.get 4
        local.get 36
        i32.add
        local.set 37
        local.get 37
        local.get 34
        i32.add
        local.set 38
        local.get 38
        i32.load
        local.set 39
        local.get 35
        local.get 39
        i32.store
        br 1 (;@1;)
      end
      i32.const 0
      local.set 40
      local.get 0
      local.get 40
      i32.store offset=8
    end
    i32.const 80
    local.set 41
    local.get 4
    local.get 41
    i32.add
    local.set 42
    local.get 42
    global.set $__stack_pointer
    return
  )
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$15set_ptr_and_cap17h39a40c6c19fb8299E (;54;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 48
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    local.get 0
    i32.store offset=20
    local.get 6
    local.get 1
    i32.store offset=24
    local.get 6
    local.get 2
    i32.store offset=28
    local.get 6
    local.get 3
    i32.store offset=36
    local.get 6
    local.get 1
    i32.store offset=40
    local.get 6
    local.get 1
    i32.store offset=12
    local.get 6
    i32.load offset=12
    local.set 7
    local.get 6
    local.get 7
    i32.store offset=44
    local.get 6
    local.get 7
    i32.store offset=16
    local.get 6
    i32.load offset=16
    local.set 8
    local.get 6
    local.get 8
    i32.store offset=8
    local.get 6
    i32.load offset=8
    local.set 9
    local.get 0
    local.get 9
    i32.store offset=4
    local.get 0
    local.get 3
    i32.store
    return
  )
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$6shrink28_$u7b$$u7b$closure$u7d$$u7d$17hffda4371461d648aE (;55;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 1
    i32.store offset=12
    local.get 4
    i32.load offset=12
    local.set 5
    local.get 5
    i32.load
    local.set 6
    local.get 5
    i32.load offset=4
    local.set 7
    local.get 4
    local.get 6
    i32.store offset=16
    local.get 4
    local.get 7
    i32.store offset=20
    local.get 4
    i32.load offset=16
    local.set 8
    local.get 4
    i32.load offset=20
    local.set 9
    local.get 0
    local.get 9
    i32.store offset=4
    local.get 0
    local.get 8
    i32.store
    return
  )
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$8into_box17heb98b99a2ae26c60E (;56;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 160
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    global.set $__stack_pointer
    local.get 6
    local.get 1
    i32.store offset=56
    local.get 6
    local.get 2
    i32.store offset=60
    local.get 6
    local.get 3
    i32.store offset=68
    local.get 6
    local.get 1
    i32.store offset=96
    local.get 6
    local.get 2
    i32.store offset=100
    local.get 6
    local.get 1
    i32.store offset=8
    local.get 6
    local.get 2
    i32.store offset=12
    i32.const 8
    local.set 7
    local.get 6
    local.get 7
    i32.add
    local.set 8
    local.get 6
    local.get 8
    i32.store offset=104
    i32.const 8
    local.set 9
    local.get 6
    local.get 9
    i32.add
    local.set 10
    local.get 6
    local.get 10
    i32.store offset=108
    local.get 6
    i32.load offset=12
    local.set 11
    local.get 6
    local.get 11
    i32.store offset=112
    local.get 6
    local.get 11
    i32.store offset=116
    local.get 6
    local.get 11
    i32.store offset=120
    local.get 6
    local.get 11
    i32.store offset=124
    local.get 6
    local.get 11
    i32.store offset=24
    local.get 6
    local.get 3
    i32.store offset=28
    local.get 6
    i32.load offset=24
    local.set 12
    local.get 6
    i32.load offset=28
    local.set 13
    local.get 6
    local.get 12
    i32.store offset=16
    local.get 6
    local.get 13
    i32.store offset=20
    local.get 6
    i32.load offset=16
    local.set 14
    local.get 6
    i32.load offset=20
    local.set 15
    local.get 6
    local.get 14
    i32.store offset=128
    local.get 6
    local.get 15
    i32.store offset=132
    local.get 6
    local.get 14
    i32.store offset=136
    local.get 6
    local.get 15
    i32.store offset=140
    i32.const 8
    local.set 16
    local.get 6
    local.get 16
    i32.add
    local.set 17
    local.get 6
    local.get 17
    i32.store offset=148
    i32.const 8
    local.set 18
    local.get 6
    local.get 18
    i32.add
    local.set 19
    local.get 6
    local.get 19
    i32.store offset=152
    i32.const 32
    local.set 20
    local.get 6
    local.get 20
    i32.add
    local.set 21
    local.get 6
    local.get 21
    i32.store offset=156
    local.get 6
    local.get 14
    i32.store offset=48
    local.get 6
    local.get 15
    i32.store offset=52
    local.get 6
    i32.load offset=48
    local.set 22
    local.get 6
    i32.load offset=52
    local.set 23
    local.get 6
    local.get 22
    i32.store offset=40
    local.get 6
    local.get 23
    i32.store offset=44
    local.get 6
    i32.load offset=40
    local.set 24
    local.get 6
    i32.load offset=44
    local.set 25
    local.get 6
    local.get 24
    i32.store
    local.get 6
    local.get 25
    i32.store offset=4
    local.get 6
    i32.load
    local.set 26
    local.get 6
    i32.load offset=4
    local.set 27
    local.get 0
    local.get 27
    i32.store offset=4
    local.get 0
    local.get 26
    i32.store
    i32.const 160
    local.set 28
    local.get 6
    local.get 28
    i32.add
    local.set 29
    local.get 29
    global.set $__stack_pointer
    return
  )
  (func $_ZN5alloc5slice64_$LT$impl$u20$alloc..borrow..ToOwned$u20$for$u20$$u5b$T$u5d$$GT$8to_owned17hc3a22756e5b02158E (;57;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store
    local.get 5
    local.get 2
    i32.store offset=4
    local.get 0
    local.get 1
    local.get 2
    call $_ZN52_$LT$T$u20$as$u20$alloc..slice..hack..ConvertVec$GT$6to_vec17h70b08c8fc18c15b7E
    i32.const 16
    local.set 6
    local.get 5
    local.get 6
    i32.add
    local.set 7
    local.get 7
    global.set $__stack_pointer
    return
  )
  (func $_ZN21wasi_reactor_bindings10call_hello17h83f4459c06bcef47E (;58;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 160
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=112
    local.get 4
    local.get 1
    i32.store offset=116
    call $_ZN11wit_bindgen2rt14run_ctors_once17h8b1b51fd1fc366e5E
    local.get 4
    local.get 1
    i32.store offset=120
    i32.const 64
    local.set 5
    local.get 4
    local.get 5
    i32.add
    local.set 6
    local.get 6
    local.set 7
    local.get 7
    local.get 0
    local.get 1
    local.get 1
    call $_ZN5alloc3vec12Vec$LT$T$GT$14from_raw_parts17haa9d77bebdbfca6dE
    i32.const 40
    local.set 8
    local.get 4
    local.get 8
    i32.add
    local.set 9
    local.get 9
    local.set 10
    i32.const 64
    local.set 11
    local.get 4
    local.get 11
    i32.add
    local.set 12
    local.get 12
    local.set 13
    local.get 10
    local.get 13
    call $_ZN5alloc6string6String9from_utf817h85e7b1cbd259e4bbE
    i32.const 24
    local.set 14
    local.get 4
    local.get 14
    i32.add
    local.set 15
    local.get 15
    local.set 16
    i32.const 40
    local.set 17
    local.get 4
    local.get 17
    i32.add
    local.set 18
    local.get 18
    local.set 19
    i32.const 1049084
    local.set 20
    local.get 16
    local.get 19
    local.get 20
    call $_ZN4core6result19Result$LT$T$C$E$GT$6unwrap17ha732e39153198ad3E
    i32.const 8
    local.set 21
    local.get 4
    local.get 21
    i32.add
    local.set 22
    local.get 22
    local.set 23
    i32.const 24
    local.set 24
    local.get 4
    local.get 24
    i32.add
    local.set 25
    local.get 25
    local.set 26
    local.get 23
    local.get 26
    call $_ZN76_$LT$wasi_reactor..Component$u20$as$u20$wasi_reactor_bindings..Component$GT$5hello17hbb14f8bbd71966e2E
    i32.const 1054820
    local.set 27
    local.get 4
    local.get 27
    i32.store offset=144
    i32.const 8
    local.set 28
    local.get 4
    local.get 28
    i32.store offset=148
    i32.const 1054820
    local.set 29
    local.get 4
    local.get 29
    i32.store offset=124
    i32.const 8
    local.set 30
    i32.const 96
    local.set 31
    local.get 4
    local.get 31
    i32.add
    local.set 32
    local.get 32
    local.get 30
    i32.add
    local.set 33
    i32.const 8
    local.set 34
    local.get 4
    local.get 34
    i32.add
    local.set 35
    local.get 35
    local.get 30
    i32.add
    local.set 36
    local.get 36
    i32.load
    local.set 37
    local.get 33
    local.get 37
    i32.store
    local.get 4
    i64.load offset=8
    local.set 38
    local.get 4
    local.get 38
    i64.store offset=96
    i32.const 80
    local.set 39
    local.get 4
    local.get 39
    i32.add
    local.set 40
    local.get 40
    local.set 41
    i32.const 96
    local.set 42
    local.get 4
    local.get 42
    i32.add
    local.set 43
    local.get 43
    local.set 44
    local.get 41
    local.get 44
    call $_ZN5alloc6string6String10into_bytes17hff2b206b40ca2dbfE
    i32.const 80
    local.set 45
    local.get 4
    local.get 45
    i32.add
    local.set 46
    local.get 4
    local.get 46
    call $_ZN5alloc3vec16Vec$LT$T$C$A$GT$16into_boxed_slice17hea7146025a9978a1E
    local.get 4
    i32.load offset=4
    local.set 47
    local.get 4
    i32.load
    local.set 48
    local.get 4
    local.get 48
    i32.store offset=128
    local.get 4
    local.get 47
    i32.store offset=132
    local.get 4
    local.get 48
    i32.store offset=152
    local.get 4
    local.get 47
    i32.store offset=156
    local.get 4
    local.get 48
    i32.store offset=136
    local.get 4
    local.get 47
    i32.store offset=140
    local.get 48
    local.get 47
    call $_ZN4core3mem6forget17hd5e1d9d8066222ecE
    i32.const 4
    local.set 49
    local.get 29
    local.get 49
    i32.add
    local.set 50
    local.get 50
    local.get 29
    i32.lt_s
    local.set 51
    i32.const 1
    local.set 52
    local.get 51
    local.get 52
    i32.and
    local.set 53
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          local.get 53
          br_if 0 (;@3;)
          local.get 50
          local.get 47
          i32.store
          i32.const 0
          local.set 54
          local.get 29
          local.set 55
          i32.const 1
          local.set 56
          local.get 54
          local.get 56
          i32.and
          local.set 57
          local.get 57
          br_if 2 (;@1;)
          br 1 (;@2;)
        end
        i32.const 1049120
        local.set 58
        i32.const 28
        local.set 59
        i32.const 1049100
        local.set 60
        local.get 58
        local.get 59
        local.get 60
        call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
        unreachable
      end
      local.get 55
      local.get 48
      i32.store
      i32.const 160
      local.set 61
      local.get 4
      local.get 61
      i32.add
      local.set 62
      local.get 62
      global.set $__stack_pointer
      local.get 29
      return
    end
    i32.const 1049120
    local.set 63
    i32.const 28
    local.set 64
    i32.const 1049148
    local.set 65
    local.get 63
    local.get 64
    local.get 65
    call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
    unreachable
  )
  (func $_ZN21wasi_reactor_bindings16post_return_uuid17he787547f7fccf63fE (;59;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=12
    i32.const 0
    local.set 4
    local.get 0
    local.set 5
    i32.const 1
    local.set 6
    local.get 4
    local.get 6
    i32.and
    local.set 7
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          local.get 7
          br_if 0 (;@3;)
          local.get 5
          i32.load
          local.set 8
          i32.const 4
          local.set 9
          local.get 0
          local.get 9
          i32.add
          local.set 10
          local.get 10
          local.get 0
          i32.lt_s
          local.set 11
          i32.const 1
          local.set 12
          local.get 11
          local.get 12
          i32.and
          local.set 13
          local.get 13
          br_if 2 (;@1;)
          br 1 (;@2;)
        end
        i32.const 1049120
        local.set 14
        i32.const 28
        local.set 15
        i32.const 1049164
        local.set 16
        local.get 14
        local.get 15
        local.get 16
        call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
        unreachable
      end
      local.get 10
      i32.load
      local.set 17
      i32.const 1
      local.set 18
      local.get 8
      local.get 17
      local.get 18
      call $_ZN11wit_bindgen2rt7dealloc17h92de99bf5237c3c5E
      i32.const 16
      local.set 19
      local.get 3
      local.get 19
      i32.add
      local.set 20
      local.get 20
      global.set $__stack_pointer
      return
    end
    i32.const 1049120
    local.set 21
    i32.const 28
    local.set 22
    i32.const 1049180
    local.set 23
    local.get 21
    local.get 22
    local.get 23
    call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
    unreachable
  )
  (func $_ZN21wasi_reactor_bindings17post_return_hello17h0a54c64f2bcc882aE (;60;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=12
    i32.const 0
    local.set 4
    local.get 0
    local.set 5
    i32.const 1
    local.set 6
    local.get 4
    local.get 6
    i32.and
    local.set 7
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          local.get 7
          br_if 0 (;@3;)
          local.get 5
          i32.load
          local.set 8
          i32.const 4
          local.set 9
          local.get 0
          local.get 9
          i32.add
          local.set 10
          local.get 10
          local.get 0
          i32.lt_s
          local.set 11
          i32.const 1
          local.set 12
          local.get 11
          local.get 12
          i32.and
          local.set 13
          local.get 13
          br_if 2 (;@1;)
          br 1 (;@2;)
        end
        i32.const 1049120
        local.set 14
        i32.const 28
        local.set 15
        i32.const 1049196
        local.set 16
        local.get 14
        local.get 15
        local.get 16
        call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
        unreachable
      end
      local.get 10
      i32.load
      local.set 17
      i32.const 1
      local.set 18
      local.get 8
      local.get 17
      local.get 18
      call $_ZN11wit_bindgen2rt7dealloc17h92de99bf5237c3c5E
      i32.const 16
      local.set 19
      local.get 3
      local.get 19
      i32.add
      local.set 20
      local.get 20
      global.set $__stack_pointer
      return
    end
    i32.const 1049120
    local.set 21
    i32.const 28
    local.set 22
    i32.const 1049212
    local.set 23
    local.get 21
    local.get 22
    local.get 23
    call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
    unreachable
  )
  (func $_ZN21wasi_reactor_bindings9call_uuid17hbf5f29b4bf70a86fE (;61;) (type 12) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 0
    i32.const 96
    local.set 1
    local.get 0
    local.get 1
    i32.sub
    local.set 2
    local.get 2
    global.set $__stack_pointer
    call $_ZN11wit_bindgen2rt14run_ctors_once17h8b1b51fd1fc366e5E
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.add
    local.set 4
    local.get 4
    local.set 5
    local.get 5
    call $_ZN76_$LT$wasi_reactor..Component$u20$as$u20$wasi_reactor_bindings..Component$GT$4uuid17h3f275b75e69c92a7E
    i32.const 1054820
    local.set 6
    local.get 2
    local.get 6
    i32.store offset=80
    i32.const 8
    local.set 7
    local.get 2
    local.get 7
    i32.store offset=84
    i32.const 1054820
    local.set 8
    local.get 2
    local.get 8
    i32.store offset=60
    i32.const 8
    local.set 9
    i32.const 48
    local.set 10
    local.get 2
    local.get 10
    i32.add
    local.set 11
    local.get 11
    local.get 9
    i32.add
    local.set 12
    i32.const 16
    local.set 13
    local.get 2
    local.get 13
    i32.add
    local.set 14
    local.get 14
    local.get 9
    i32.add
    local.set 15
    local.get 15
    i32.load
    local.set 16
    local.get 12
    local.get 16
    i32.store
    local.get 2
    i64.load offset=16
    local.set 17
    local.get 2
    local.get 17
    i64.store offset=48
    i32.const 32
    local.set 18
    local.get 2
    local.get 18
    i32.add
    local.set 19
    local.get 19
    local.set 20
    i32.const 48
    local.set 21
    local.get 2
    local.get 21
    i32.add
    local.set 22
    local.get 22
    local.set 23
    local.get 20
    local.get 23
    call $_ZN5alloc6string6String10into_bytes17hff2b206b40ca2dbfE
    i32.const 8
    local.set 24
    local.get 2
    local.get 24
    i32.add
    local.set 25
    i32.const 32
    local.set 26
    local.get 2
    local.get 26
    i32.add
    local.set 27
    local.get 25
    local.get 27
    call $_ZN5alloc3vec16Vec$LT$T$C$A$GT$16into_boxed_slice17hea7146025a9978a1E
    local.get 2
    i32.load offset=12
    local.set 28
    local.get 2
    i32.load offset=8
    local.set 29
    local.get 2
    local.get 29
    i32.store offset=64
    local.get 2
    local.get 28
    i32.store offset=68
    local.get 2
    local.get 29
    i32.store offset=88
    local.get 2
    local.get 28
    i32.store offset=92
    local.get 2
    local.get 29
    i32.store offset=72
    local.get 2
    local.get 28
    i32.store offset=76
    local.get 29
    local.get 28
    call $_ZN4core3mem6forget17hd5e1d9d8066222ecE
    i32.const 4
    local.set 30
    local.get 8
    local.get 30
    i32.add
    local.set 31
    local.get 31
    local.get 8
    i32.lt_s
    local.set 32
    i32.const 1
    local.set 33
    local.get 32
    local.get 33
    i32.and
    local.set 34
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          local.get 34
          br_if 0 (;@3;)
          local.get 31
          local.get 28
          i32.store
          i32.const 0
          local.set 35
          local.get 8
          local.set 36
          i32.const 1
          local.set 37
          local.get 35
          local.get 37
          i32.and
          local.set 38
          local.get 38
          br_if 2 (;@1;)
          br 1 (;@2;)
        end
        i32.const 1049120
        local.set 39
        i32.const 28
        local.set 40
        i32.const 1049228
        local.set 41
        local.get 39
        local.get 40
        local.get 41
        call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
        unreachable
      end
      local.get 36
      local.get 29
      i32.store
      i32.const 96
      local.set 42
      local.get 2
      local.get 42
      i32.add
      local.set 43
      local.get 43
      global.set $__stack_pointer
      local.get 8
      return
    end
    i32.const 1049120
    local.set 44
    i32.const 28
    local.set 45
    i32.const 1049244
    local.set 46
    local.get 44
    local.get 45
    local.get 46
    call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
    unreachable
  )
  (func $_ZN4core6result19Result$LT$T$C$E$GT$6unwrap17ha732e39153198ad3E (;62;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 32
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 1
    i32.load8_u offset=4
    local.set 6
    i32.const 2
    local.set 7
    i32.const 255
    local.set 8
    local.get 6
    local.get 8
    i32.and
    local.set 9
    i32.const 255
    local.set 10
    local.get 7
    local.get 10
    i32.and
    local.set 11
    local.get 9
    local.get 11
    i32.eq
    local.set 12
    i32.const 0
    local.set 13
    i32.const 1
    local.set 14
    i32.const 1
    local.set 15
    local.get 12
    local.get 15
    i32.and
    local.set 16
    local.get 13
    local.get 14
    local.get 16
    select
    local.set 17
    block ;; label = @1
      local.get 17
      br_if 0 (;@1;)
      i32.const 8
      local.set 18
      local.get 1
      local.get 18
      i32.add
      local.set 19
      local.get 19
      i64.load align=4
      local.set 20
      local.get 0
      local.get 20
      i64.store align=4
      i32.const 8
      local.set 21
      local.get 0
      local.get 21
      i32.add
      local.set 22
      local.get 19
      local.get 21
      i32.add
      local.set 23
      local.get 23
      i32.load
      local.set 24
      local.get 22
      local.get 24
      i32.store
      i32.const 32
      local.set 25
      local.get 5
      local.get 25
      i32.add
      local.set 26
      local.get 26
      global.set $__stack_pointer
      return
    end
    i32.const 16
    local.set 27
    local.get 1
    local.get 27
    i32.add
    local.set 28
    local.get 28
    i32.load
    local.set 29
    i32.const 8
    local.set 30
    local.get 5
    local.get 30
    i32.add
    local.set 31
    local.get 31
    local.get 27
    i32.add
    local.set 32
    local.get 32
    local.get 29
    i32.store
    i32.const 8
    local.set 33
    local.get 1
    local.get 33
    i32.add
    local.set 34
    local.get 34
    i64.load align=4
    local.set 35
    i32.const 8
    local.set 36
    local.get 5
    local.get 36
    i32.add
    local.set 37
    local.get 37
    local.get 33
    i32.add
    local.set 38
    local.get 38
    local.get 35
    i64.store
    local.get 1
    i64.load align=4
    local.set 39
    local.get 5
    local.get 39
    i64.store offset=8
    i32.const 1049260
    local.set 40
    i32.const 43
    local.set 41
    i32.const 8
    local.set 42
    local.get 5
    local.get 42
    i32.add
    local.set 43
    local.get 43
    local.set 44
    i32.const 1049304
    local.set 45
    local.get 40
    local.get 41
    local.get 44
    local.get 45
    local.get 2
    call $_ZN4core6result13unwrap_failed17he6bfae7ea6f8795eE
    unreachable
  )
  (func $_ZN4core6result19Result$LT$T$C$E$GT$7map_err17h13bd545a05ed41bbE (;63;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 48
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    global.set $__stack_pointer
    local.get 6
    local.get 1
    i32.store offset=16
    local.get 6
    local.get 2
    i32.store offset=20
    local.get 6
    local.get 3
    i32.store offset=28
    i32.const 1
    local.set 7
    local.get 6
    local.get 7
    i32.store8 offset=27
    local.get 6
    i32.load offset=16
    local.set 8
    i32.const 1
    local.set 9
    i32.const 0
    local.set 10
    local.get 10
    local.get 9
    local.get 8
    select
    local.set 11
    block ;; label = @1
      block ;; label = @2
        local.get 11
        br_if 0 (;@2;)
        local.get 6
        i32.load offset=16
        local.set 12
        local.get 6
        i32.load offset=20
        local.set 13
        local.get 6
        local.get 12
        i32.store offset=40
        local.get 6
        local.get 13
        i32.store offset=44
        local.get 0
        local.get 12
        i32.store offset=4
        local.get 0
        local.get 13
        i32.store offset=8
        i32.const 0
        local.set 14
        local.get 0
        local.get 14
        i32.store
        br 1 (;@1;)
      end
      i32.const 0
      local.set 15
      local.get 6
      local.get 15
      i32.store8 offset=27
      i32.const 8
      local.set 16
      local.get 6
      local.get 16
      i32.add
      local.set 17
      local.get 17
      local.get 3
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$6shrink28_$u7b$$u7b$closure$u7d$$u7d$17hffda4371461d648aE
      local.get 6
      i32.load offset=12
      local.set 18
      local.get 6
      i32.load offset=8
      local.set 19
      local.get 0
      local.get 19
      i32.store offset=4
      local.get 0
      local.get 18
      i32.store offset=8
      i32.const 1
      local.set 20
      local.get 0
      local.get 20
      i32.store
    end
    local.get 6
    i32.load8_u offset=27
    local.set 21
    i32.const 1
    local.set 22
    local.get 21
    local.get 22
    i32.and
    local.set 23
    block ;; label = @1
      local.get 23
      i32.eqz
      br_if 0 (;@1;)
    end
    i32.const 48
    local.set 24
    local.get 6
    local.get 24
    i32.add
    local.set 25
    local.get 25
    global.set $__stack_pointer
    return
  )
  (func $_ZN4core6result19Result$LT$T$C$E$GT$7map_err17hf30ac78436ae445cE (;64;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 64
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store offset=8
    local.get 5
    local.get 2
    i32.store offset=12
    i32.const 1
    local.set 6
    local.get 5
    local.get 6
    i32.store8 offset=39
    local.get 5
    i32.load offset=12
    local.set 7
    i32.const -2147483647
    local.set 8
    local.get 7
    local.set 9
    local.get 8
    local.set 10
    local.get 9
    local.get 10
    i32.eq
    local.set 11
    i32.const 0
    local.set 12
    i32.const 1
    local.set 13
    i32.const 1
    local.set 14
    local.get 11
    local.get 14
    i32.and
    local.set 15
    local.get 12
    local.get 13
    local.get 15
    select
    local.set 16
    block ;; label = @1
      block ;; label = @2
        local.get 16
        br_if 0 (;@2;)
        i32.const -2147483647
        local.set 17
        local.get 5
        local.get 17
        i32.store offset=20
        br 1 (;@1;)
      end
      local.get 5
      i32.load offset=8
      local.set 18
      local.get 5
      i32.load offset=12
      local.set 19
      local.get 5
      local.get 18
      i32.store offset=56
      local.get 5
      local.get 19
      i32.store offset=60
      i32.const 0
      local.set 20
      local.get 5
      local.get 20
      i32.store8 offset=39
      local.get 5
      local.get 18
      i32.store offset=24
      local.get 5
      local.get 19
      i32.store offset=28
      local.get 5
      i32.load offset=24
      local.set 21
      local.get 5
      i32.load offset=28
      local.set 22
      local.get 5
      local.get 21
      local.get 22
      call $_ZN5alloc7raw_vec14handle_reserve28_$u7b$$u7b$closure$u7d$$u7d$17hb49258dd7097fcdfE
      local.get 5
      i32.load offset=4
      local.set 23
      local.get 5
      i32.load
      local.set 24
      local.get 5
      local.get 24
      i32.store offset=16
      local.get 5
      local.get 23
      i32.store offset=20
    end
    local.get 5
    i32.load8_u offset=39
    local.set 25
    i32.const 1
    local.set 26
    local.get 25
    local.get 26
    i32.and
    local.set 27
    block ;; label = @1
      local.get 27
      i32.eqz
      br_if 0 (;@1;)
    end
    local.get 5
    i32.load offset=16
    local.set 28
    local.get 5
    i32.load offset=20
    local.set 29
    local.get 0
    local.get 29
    i32.store offset=4
    local.get 0
    local.get 28
    i32.store
    i32.const 64
    local.set 30
    local.get 5
    local.get 30
    i32.add
    local.set 31
    local.get 31
    global.set $__stack_pointer
    return
  )
  (func $_ZN5alloc3fmt6format17h2129a4646cb8d78fE (;65;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 1
    call $_ZN4core3fmt9Arguments6as_str17hb0faefb47713c4a1E
    local.get 4
    i32.load offset=4
    local.set 5
    local.get 4
    i32.load
    local.set 6
    local.get 4
    local.get 1
    i32.store offset=12
    local.get 4
    i32.load offset=12
    local.set 7
    local.get 0
    local.get 6
    local.get 5
    local.get 7
    call $_ZN4core6option15Option$LT$T$GT$11map_or_else17h9c2af8ee5f7adf59E
    i32.const 16
    local.set 8
    local.get 4
    local.get 8
    i32.add
    local.set 9
    local.get 9
    global.set $__stack_pointer
    return
  )
  (func $__rust_alloc (;66;) (type 5) (param i32 i32) (result i32)
    (local i32)
    local.get 0
    local.get 1
    call $__rdl_alloc
    local.set 2
    local.get 2
    return
  )
  (func $__rust_dealloc (;67;) (type 2) (param i32 i32 i32)
    local.get 0
    local.get 1
    local.get 2
    call $__rdl_dealloc
    return
  )
  (func $__rust_realloc (;68;) (type 6) (param i32 i32 i32 i32) (result i32)
    (local i32)
    local.get 0
    local.get 1
    local.get 2
    local.get 3
    call $__rdl_realloc
    local.set 4
    local.get 4
    return
  )
  (func $__rust_alloc_zeroed (;69;) (type 5) (param i32 i32) (result i32)
    (local i32)
    local.get 0
    local.get 1
    call $__rdl_alloc_zeroed
    local.set 2
    local.get 2
    return
  )
  (func $__rust_alloc_error_handler (;70;) (type 3) (param i32 i32)
    local.get 0
    local.get 1
    call $__rg_oom
    return
  )
  (func $_ZN4uuid7builder28_$LT$impl$u20$uuid..Uuid$GT$10from_bytes17ha9b1dc5c2e36adbaE (;71;) (type 3) (param i32 i32)
    (local i64 i32 i32 i32 i64)
    local.get 1
    i64.load align=1
    local.set 2
    local.get 0
    local.get 2
    i64.store align=1
    i32.const 8
    local.set 3
    local.get 0
    local.get 3
    i32.add
    local.set 4
    local.get 1
    local.get 3
    i32.add
    local.set 5
    local.get 5
    i64.load align=1
    local.set 6
    local.get 4
    local.get 6
    i64.store align=1
    return
  )
  (func $_ZN4uuid3fmt60_$LT$impl$u20$core..fmt..LowerHex$u20$for$u20$uuid..Uuid$GT$3fmt17he660f75d21348ad6E (;72;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=8
    local.get 4
    local.get 1
    i32.store offset=12
    local.get 0
    call $_ZN4uuid3fmt28_$LT$impl$u20$uuid..Uuid$GT$13as_hyphenated17h563b0fc8c3463cd3E
    local.set 5
    local.get 5
    local.get 1
    call $_ZN61_$LT$uuid..fmt..Hyphenated$u20$as$u20$core..fmt..LowerHex$GT$3fmt17hd25f9ce338fac2d9E
    local.set 6
    i32.const 1
    local.set 7
    local.get 6
    local.get 7
    i32.and
    local.set 8
    i32.const 16
    local.set 9
    local.get 4
    local.get 9
    i32.add
    local.set 10
    local.get 10
    global.set $__stack_pointer
    local.get 8
    return
  )
  (func $_ZN4uuid3fmt59_$LT$impl$u20$core..fmt..Display$u20$for$u20$uuid..Uuid$GT$3fmt17hdefb8f3088fb574dE (;73;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=8
    local.get 4
    local.get 1
    i32.store offset=12
    local.get 0
    local.get 1
    call $_ZN4uuid3fmt60_$LT$impl$u20$core..fmt..LowerHex$u20$for$u20$uuid..Uuid$GT$3fmt17he660f75d21348ad6E
    local.set 5
    i32.const 1
    local.set 6
    local.get 5
    local.get 6
    i32.and
    local.set 7
    i32.const 16
    local.set 8
    local.get 4
    local.get 8
    i32.add
    local.set 9
    local.get 9
    global.set $__stack_pointer
    local.get 7
    return
  )
  (func $_ZN4uuid3fmt28_$LT$impl$u20$uuid..Uuid$GT$13as_hyphenated17h563b0fc8c3463cd3E (;74;) (type 9) (param i32) (result i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 0
    return
  )
  (func $_ZN4uuid2v428_$LT$impl$u20$uuid..Uuid$GT$6new_v417h230c5c61b114d67eE (;75;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 32
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.add
    local.set 5
    local.get 5
    local.set 6
    local.get 6
    call $_ZN4uuid3rng5bytes17h9765e5ba42b5d4f8E
    local.get 3
    local.set 7
    i32.const 16
    local.set 8
    local.get 3
    local.get 8
    i32.add
    local.set 9
    local.get 9
    local.set 10
    local.get 7
    local.get 10
    call $_ZN4uuid7builder7Builder17from_random_bytes17h0ef1d660589bf826E
    local.get 3
    local.set 11
    local.get 0
    local.get 11
    call $_ZN4uuid7builder7Builder9into_uuid17h150f41d9721f6fa3E
    i32.const 32
    local.set 12
    local.get 3
    local.get 12
    i32.add
    local.set 13
    local.get 13
    global.set $__stack_pointer
    return
  )
  (func $_ZN4uuid4Uuid8as_bytes17hda5c13a773088c91E (;76;) (type 9) (param i32) (result i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 0
    return
  )
  (func $_ZN4uuid3fmt17format_hyphenated17hcce154fbadd58f25E (;77;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 80
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store offset=60
    local.get 2
    local.set 6
    local.get 5
    local.get 6
    i32.store8 offset=67
    local.get 2
    local.set 7
    block ;; label = @1
      block ;; label = @2
        local.get 7
        br_if 0 (;@2;)
        i32.const 1049336
        local.set 8
        local.get 5
        local.get 8
        i32.store offset=4
        br 1 (;@1;)
      end
      i32.const 1049320
      local.set 9
      local.get 5
      local.get 9
      i32.store offset=4
    end
    i32.const 0
    local.set 10
    local.get 10
    i32.load offset=1049468
    local.set 11
    i32.const 0
    local.set 12
    local.get 12
    i32.load offset=1049472
    local.set 13
    i32.const 0
    local.set 14
    local.get 14
    i32.load offset=1049476
    local.set 15
    i32.const 0
    local.set 16
    local.get 16
    i32.load offset=1049480
    local.set 17
    i32.const 0
    local.set 18
    local.get 18
    i32.load offset=1049484
    local.set 19
    i32.const 0
    local.set 20
    local.get 20
    i32.load offset=1049488
    local.set 21
    i32.const 0
    local.set 22
    local.get 22
    i32.load offset=1049492
    local.set 23
    i32.const 0
    local.set 24
    local.get 24
    i32.load offset=1049496
    local.set 25
    i32.const 0
    local.set 26
    local.get 26
    i32.load offset=1049500
    local.set 27
    i32.const 0
    local.set 28
    local.get 28
    i32.load offset=1049504
    local.set 29
    local.get 5
    local.get 11
    i32.store offset=8
    local.get 5
    local.get 13
    i32.store offset=12
    local.get 5
    local.get 15
    i32.store offset=16
    local.get 5
    local.get 17
    i32.store offset=20
    local.get 5
    local.get 19
    i32.store offset=24
    local.get 5
    local.get 21
    i32.store offset=28
    local.get 5
    local.get 23
    i32.store offset=32
    local.get 5
    local.get 25
    i32.store offset=36
    local.get 5
    local.get 27
    i32.store offset=40
    local.get 5
    local.get 29
    i32.store offset=44
    i64.const 0
    local.set 30
    local.get 0
    local.get 30
    i64.store align=1
    i32.const 32
    local.set 31
    local.get 0
    local.get 31
    i32.add
    local.set 32
    i32.const 0
    local.set 33
    local.get 32
    local.get 33
    i32.store align=1
    i32.const 24
    local.set 34
    local.get 0
    local.get 34
    i32.add
    local.set 35
    local.get 35
    local.get 30
    i64.store align=1
    i32.const 16
    local.set 36
    local.get 0
    local.get 36
    i32.add
    local.set 37
    local.get 37
    local.get 30
    i64.store align=1
    i32.const 8
    local.set 38
    local.get 0
    local.get 38
    i32.add
    local.set 39
    local.get 39
    local.get 30
    i64.store align=1
    i32.const 0
    local.set 40
    local.get 5
    local.get 40
    i32.store offset=48
    i32.const 0
    local.set 41
    local.get 5
    local.get 41
    i32.store offset=52
    loop ;; label = @1
      local.get 5
      i32.load offset=48
      local.set 42
      i32.const 5
      local.set 43
      local.get 42
      local.set 44
      local.get 43
      local.set 45
      local.get 44
      local.get 45
      i32.lt_u
      local.set 46
      i32.const 1
      local.set 47
      local.get 46
      local.get 47
      i32.and
      local.set 48
      block ;; label = @2
        local.get 48
        br_if 0 (;@2;)
        i32.const 80
        local.set 49
        local.get 5
        local.get 49
        i32.add
        local.set 50
        local.get 50
        global.set $__stack_pointer
        return
      end
      local.get 5
      i32.load offset=48
      local.set 51
      i32.const 5
      local.set 52
      local.get 51
      local.set 53
      local.get 52
      local.set 54
      local.get 53
      local.get 54
      i32.lt_u
      local.set 55
      i32.const 1
      local.set 56
      local.get 55
      local.get 56
      i32.and
      local.set 57
      block ;; label = @2
        block ;; label = @3
          local.get 57
          i32.eqz
          br_if 0 (;@3;)
          i32.const 8
          local.set 58
          local.get 5
          local.get 58
          i32.add
          local.set 59
          local.get 59
          local.set 60
          i32.const 3
          local.set 61
          local.get 51
          local.get 61
          i32.shl
          local.set 62
          local.get 60
          local.get 62
          i32.add
          local.set 63
          local.get 63
          i32.load
          local.set 64
          local.get 5
          local.get 64
          i32.store offset=68
          i32.const 8
          local.set 65
          local.get 5
          local.get 65
          i32.add
          local.set 66
          local.get 66
          local.set 67
          i32.const 3
          local.set 68
          local.get 51
          local.get 68
          i32.shl
          local.set 69
          local.get 67
          local.get 69
          i32.add
          local.set 70
          local.get 70
          i32.load offset=4
          local.set 71
          local.get 5
          local.get 71
          i32.store offset=72
          local.get 5
          local.get 64
          i32.store offset=56
          br 1 (;@2;)
        end
        i32.const 5
        local.set 72
        i32.const 1049508
        local.set 73
        local.get 51
        local.get 72
        local.get 73
        call $_ZN4core9panicking18panic_bounds_check17h11c3c861adfc2c89E
        unreachable
      end
      block ;; label = @2
        block ;; label = @3
          loop ;; label = @4
            local.get 5
            i32.load offset=56
            local.set 74
            local.get 74
            local.set 75
            local.get 71
            local.set 76
            local.get 75
            local.get 76
            i32.lt_u
            local.set 77
            i32.const 1
            local.set 78
            local.get 77
            local.get 78
            i32.and
            local.set 79
            block ;; label = @5
              local.get 79
              br_if 0 (;@5;)
              local.get 5
              i32.load offset=48
              local.set 80
              i32.const 4
              local.set 81
              local.get 80
              local.set 82
              local.get 81
              local.set 83
              local.get 82
              local.get 83
              i32.lt_u
              local.set 84
              i32.const 1
              local.set 85
              local.get 84
              local.get 85
              i32.and
              local.set 86
              local.get 86
              br_if 2 (;@3;)
              br 3 (;@2;)
            end
            local.get 5
            i32.load offset=52
            local.set 87
            i32.const 16
            local.set 88
            local.get 87
            local.set 89
            local.get 88
            local.set 90
            local.get 89
            local.get 90
            i32.lt_u
            local.set 91
            i32.const 1
            local.set 92
            local.get 91
            local.get 92
            i32.and
            local.set 93
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  block ;; label = @8
                    block ;; label = @9
                      block ;; label = @10
                        block ;; label = @11
                          block ;; label = @12
                            block ;; label = @13
                              block ;; label = @14
                                block ;; label = @15
                                  block ;; label = @16
                                    block ;; label = @17
                                      block ;; label = @18
                                        block ;; label = @19
                                          local.get 93
                                          i32.eqz
                                          br_if 0 (;@19;)
                                          local.get 1
                                          local.get 87
                                          i32.add
                                          local.set 94
                                          local.get 94
                                          i32.load8_u
                                          local.set 95
                                          local.get 5
                                          local.get 95
                                          i32.store8 offset=79
                                          local.get 5
                                          i32.load offset=52
                                          local.set 96
                                          i32.const 1
                                          local.set 97
                                          local.get 96
                                          local.get 97
                                          i32.add
                                          local.set 98
                                          local.get 98
                                          i32.eqz
                                          local.set 99
                                          i32.const 1
                                          local.set 100
                                          local.get 99
                                          local.get 100
                                          i32.and
                                          local.set 101
                                          local.get 101
                                          br_if 2 (;@17;)
                                          br 1 (;@18;)
                                        end
                                        i32.const 16
                                        local.set 102
                                        i32.const 1049524
                                        local.set 103
                                        local.get 87
                                        local.get 102
                                        local.get 103
                                        call $_ZN4core9panicking18panic_bounds_check17h11c3c861adfc2c89E
                                        unreachable
                                      end
                                      local.get 5
                                      local.get 98
                                      i32.store offset=52
                                      i32.const 240
                                      local.set 104
                                      local.get 95
                                      local.get 104
                                      i32.and
                                      local.set 105
                                      i32.const 4
                                      local.set 106
                                      local.get 105
                                      local.get 106
                                      i32.shr_u
                                      local.set 107
                                      i32.const 255
                                      local.set 108
                                      local.get 107
                                      local.get 108
                                      i32.and
                                      local.set 109
                                      i32.const 16
                                      local.set 110
                                      local.get 109
                                      local.set 111
                                      local.get 110
                                      local.set 112
                                      local.get 111
                                      local.get 112
                                      i32.lt_u
                                      local.set 113
                                      i32.const 1
                                      local.set 114
                                      local.get 113
                                      local.get 114
                                      i32.and
                                      local.set 115
                                      local.get 115
                                      br_if 1 (;@16;)
                                      br 2 (;@15;)
                                    end
                                    i32.const 1049440
                                    local.set 116
                                    i32.const 28
                                    local.set 117
                                    i32.const 1049540
                                    local.set 118
                                    local.get 116
                                    local.get 117
                                    local.get 118
                                    call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
                                    unreachable
                                  end
                                  local.get 5
                                  i32.load offset=4
                                  local.set 119
                                  local.get 119
                                  local.get 109
                                  i32.add
                                  local.set 120
                                  local.get 120
                                  i32.load8_u
                                  local.set 121
                                  local.get 5
                                  i32.load offset=56
                                  local.set 122
                                  i32.const 36
                                  local.set 123
                                  local.get 122
                                  local.set 124
                                  local.get 123
                                  local.set 125
                                  local.get 124
                                  local.get 125
                                  i32.lt_u
                                  local.set 126
                                  i32.const 1
                                  local.set 127
                                  local.get 126
                                  local.get 127
                                  i32.and
                                  local.set 128
                                  local.get 128
                                  br_if 1 (;@14;)
                                  br 2 (;@13;)
                                end
                                i32.const 16
                                local.set 129
                                i32.const 1049556
                                local.set 130
                                local.get 109
                                local.get 129
                                local.get 130
                                call $_ZN4core9panicking18panic_bounds_check17h11c3c861adfc2c89E
                                unreachable
                              end
                              local.get 0
                              local.get 122
                              i32.add
                              local.set 131
                              local.get 131
                              local.get 121
                              i32.store8
                              i32.const 15
                              local.set 132
                              local.get 95
                              local.get 132
                              i32.and
                              local.set 133
                              i32.const 255
                              local.set 134
                              local.get 133
                              local.get 134
                              i32.and
                              local.set 135
                              i32.const 16
                              local.set 136
                              local.get 135
                              local.set 137
                              local.get 136
                              local.set 138
                              local.get 137
                              local.get 138
                              i32.lt_u
                              local.set 139
                              i32.const 1
                              local.set 140
                              local.get 139
                              local.get 140
                              i32.and
                              local.set 141
                              local.get 141
                              br_if 1 (;@12;)
                              br 2 (;@11;)
                            end
                            i32.const 36
                            local.set 142
                            i32.const 1049572
                            local.set 143
                            local.get 122
                            local.get 142
                            local.get 143
                            call $_ZN4core9panicking18panic_bounds_check17h11c3c861adfc2c89E
                            unreachable
                          end
                          local.get 5
                          i32.load offset=4
                          local.set 144
                          local.get 144
                          local.get 135
                          i32.add
                          local.set 145
                          local.get 145
                          i32.load8_u
                          local.set 146
                          local.get 5
                          i32.load offset=56
                          local.set 147
                          i32.const 1
                          local.set 148
                          local.get 147
                          local.get 148
                          i32.add
                          local.set 149
                          local.get 149
                          i32.eqz
                          local.set 150
                          i32.const 1
                          local.set 151
                          local.get 150
                          local.get 151
                          i32.and
                          local.set 152
                          local.get 152
                          br_if 2 (;@9;)
                          br 1 (;@10;)
                        end
                        i32.const 16
                        local.set 153
                        i32.const 1049588
                        local.set 154
                        local.get 135
                        local.get 153
                        local.get 154
                        call $_ZN4core9panicking18panic_bounds_check17h11c3c861adfc2c89E
                        unreachable
                      end
                      i32.const 36
                      local.set 155
                      local.get 149
                      local.set 156
                      local.get 155
                      local.set 157
                      local.get 156
                      local.get 157
                      i32.lt_u
                      local.set 158
                      i32.const 1
                      local.set 159
                      local.get 158
                      local.get 159
                      i32.and
                      local.set 160
                      local.get 160
                      br_if 1 (;@8;)
                      br 2 (;@7;)
                    end
                    i32.const 1049440
                    local.set 161
                    i32.const 28
                    local.set 162
                    i32.const 1049604
                    local.set 163
                    local.get 161
                    local.get 162
                    local.get 163
                    call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
                    unreachable
                  end
                  local.get 0
                  local.get 149
                  i32.add
                  local.set 164
                  local.get 164
                  local.get 146
                  i32.store8
                  local.get 5
                  i32.load offset=56
                  local.set 165
                  i32.const 2
                  local.set 166
                  local.get 165
                  local.get 166
                  i32.add
                  local.set 167
                  local.get 167
                  local.get 165
                  i32.lt_u
                  local.set 168
                  i32.const 1
                  local.set 169
                  local.get 168
                  local.get 169
                  i32.and
                  local.set 170
                  local.get 170
                  br_if 2 (;@5;)
                  br 1 (;@6;)
                end
                i32.const 36
                local.set 171
                i32.const 1049620
                local.set 172
                local.get 149
                local.get 171
                local.get 172
                call $_ZN4core9panicking18panic_bounds_check17h11c3c861adfc2c89E
                unreachable
              end
              local.get 5
              local.get 167
              i32.store offset=56
              br 1 (;@4;)
            end
          end
          i32.const 1049440
          local.set 173
          i32.const 28
          local.set 174
          i32.const 1049636
          local.set 175
          local.get 173
          local.get 174
          local.get 175
          call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
          unreachable
        end
        i32.const 36
        local.set 176
        local.get 71
        local.set 177
        local.get 176
        local.set 178
        local.get 177
        local.get 178
        i32.lt_u
        local.set 179
        i32.const 1
        local.set 180
        local.get 179
        local.get 180
        i32.and
        local.set 181
        block ;; label = @3
          local.get 181
          i32.eqz
          br_if 0 (;@3;)
          local.get 0
          local.get 71
          i32.add
          local.set 182
          i32.const 45
          local.set 183
          local.get 182
          local.get 183
          i32.store8
          br 1 (;@2;)
        end
        i32.const 36
        local.set 184
        i32.const 1049652
        local.set 185
        local.get 71
        local.get 184
        local.get 185
        call $_ZN4core9panicking18panic_bounds_check17h11c3c861adfc2c89E
        unreachable
      end
      local.get 5
      i32.load offset=48
      local.set 186
      i32.const 1
      local.set 187
      local.get 186
      local.get 187
      i32.add
      local.set 188
      local.get 188
      i32.eqz
      local.set 189
      i32.const 1
      local.set 190
      local.get 189
      local.get 190
      i32.and
      local.set 191
      block ;; label = @2
        local.get 191
        br_if 0 (;@2;)
        local.get 5
        local.get 188
        i32.store offset=48
        br 1 (;@1;)
      end
    end
    i32.const 1049440
    local.set 192
    i32.const 28
    local.set 193
    i32.const 1049668
    local.set 194
    local.get 192
    local.get 193
    local.get 194
    call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
    unreachable
  )
  (func $_ZN4uuid3fmt17encode_hyphenated17ha7b01fc0048472c7E (;78;) (type 10) (param i32 i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 5
    i32.const 96
    local.set 6
    local.get 5
    local.get 6
    i32.sub
    local.set 7
    local.get 7
    global.set $__stack_pointer
    local.get 7
    local.get 1
    i32.store offset=52
    local.get 7
    local.get 2
    i32.store offset=56
    local.get 7
    local.get 3
    i32.store offset=60
    i32.const 1
    local.set 8
    local.get 4
    local.get 8
    i32.and
    local.set 9
    local.get 7
    local.get 9
    i32.store8 offset=71
    i32.const 1049684
    local.set 10
    i32.const 36
    local.set 11
    i32.const 8
    local.set 12
    local.get 7
    local.get 12
    i32.add
    local.set 13
    local.get 13
    local.get 2
    local.get 3
    local.get 11
    local.get 10
    call $_ZN4core5slice5index77_$LT$impl$u20$core..ops..index..IndexMut$LT$I$GT$$u20$for$u20$$u5b$T$u5d$$GT$9index_mut17h5837f297ea372406E
    local.get 7
    i32.load offset=12
    local.set 14
    local.get 7
    i32.load offset=8
    local.set 15
    local.get 7
    local.get 15
    i32.store offset=72
    local.get 7
    local.get 14
    i32.store offset=76
    local.get 7
    local.get 15
    i32.store offset=88
    local.get 7
    local.get 14
    i32.store offset=92
    local.get 7
    local.get 15
    i32.store offset=80
    local.get 7
    local.get 15
    i32.store offset=84
    i32.const 16
    local.set 16
    local.get 7
    local.get 16
    i32.add
    local.set 17
    local.get 17
    local.get 1
    local.get 9
    call $_ZN4uuid3fmt17format_hyphenated17hcce154fbadd58f25E
    i32.const 16
    local.set 18
    local.get 7
    local.get 18
    i32.add
    local.set 19
    local.get 15
    local.get 19
    call $_ZN4core3ptr5write17hf5826bad470c2824E
    local.get 7
    local.get 15
    local.get 14
    call $_ZN4core3str8converts23from_utf8_unchecked_mut17h746cd05a250dc07eE
    local.get 7
    i32.load
    local.set 20
    local.get 7
    i32.load offset=4
    local.set 21
    local.get 0
    local.get 21
    i32.store offset=4
    local.get 0
    local.get 20
    i32.store
    i32.const 96
    local.set 22
    local.get 7
    local.get 22
    i32.add
    local.set 23
    local.get 23
    global.set $__stack_pointer
    return
  )
  (func $_ZN4uuid3fmt10Hyphenated12encode_lower17h433a94161ceea559E (;79;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 32
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    global.set $__stack_pointer
    local.get 6
    local.get 1
    i32.store offset=20
    local.get 6
    local.get 2
    i32.store offset=24
    local.get 6
    local.get 3
    i32.store offset=28
    local.get 1
    call $_ZN4uuid4Uuid8as_bytes17hda5c13a773088c91E
    local.set 7
    i32.const 0
    local.set 8
    i32.const 8
    local.set 9
    local.get 6
    local.get 9
    i32.add
    local.set 10
    local.get 10
    local.get 7
    local.get 2
    local.get 3
    local.get 8
    call $_ZN4uuid3fmt17encode_hyphenated17ha7b01fc0048472c7E
    local.get 6
    i32.load offset=8
    local.set 11
    local.get 6
    i32.load offset=12
    local.set 12
    local.get 0
    local.get 12
    i32.store offset=4
    local.get 0
    local.get 11
    i32.store
    i32.const 32
    local.set 13
    local.get 6
    local.get 13
    i32.add
    local.set 14
    local.get 14
    global.set $__stack_pointer
    return
  )
  (func $_ZN61_$LT$uuid..fmt..Hyphenated$u20$as$u20$core..fmt..LowerHex$GT$3fmt17hd25f9ce338fac2d9E (;80;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 64
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=56
    local.get 4
    local.get 1
    i32.store offset=60
    i32.const 20
    local.set 5
    local.get 4
    local.get 5
    i32.add
    local.set 6
    local.get 6
    local.set 7
    i64.const 0
    local.set 8
    local.get 7
    local.get 8
    i64.store align=1
    i32.const 32
    local.set 9
    local.get 7
    local.get 9
    i32.add
    local.set 10
    i32.const 0
    local.set 11
    local.get 10
    local.get 11
    i32.store align=1
    i32.const 24
    local.set 12
    local.get 7
    local.get 12
    i32.add
    local.set 13
    local.get 13
    local.get 8
    i64.store align=1
    i32.const 16
    local.set 14
    local.get 7
    local.get 14
    i32.add
    local.set 15
    local.get 15
    local.get 8
    i64.store align=1
    i32.const 8
    local.set 16
    local.get 7
    local.get 16
    i32.add
    local.set 17
    local.get 17
    local.get 8
    i64.store align=1
    i32.const 36
    local.set 18
    i32.const 8
    local.set 19
    local.get 4
    local.get 19
    i32.add
    local.set 20
    i32.const 20
    local.set 21
    local.get 4
    local.get 21
    i32.add
    local.set 22
    local.get 20
    local.get 0
    local.get 22
    local.get 18
    call $_ZN4uuid3fmt10Hyphenated12encode_lower17h433a94161ceea559E
    local.get 4
    i32.load offset=12
    local.set 23
    local.get 4
    i32.load offset=8
    local.set 24
    local.get 1
    local.get 24
    local.get 23
    call $_ZN4core3fmt9Formatter9write_str17h556030d2063bd0caE
    local.set 25
    i32.const 1
    local.set 26
    local.get 25
    local.get 26
    i32.and
    local.set 27
    i32.const 64
    local.set 28
    local.get 4
    local.get 28
    i32.add
    local.set 29
    local.get 29
    global.set $__stack_pointer
    local.get 27
    return
  )
  (func $_ZN153_$LT$core..result..Result$LT$T$C$F$GT$$u20$as$u20$core..ops..try_trait..FromResidual$LT$core..result..Result$LT$core..convert..Infallible$C$E$GT$$GT$$GT$13from_residual17h21b3a9dac95dc5baE (;81;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 0
    i32.store
    local.get 4
    i32.load
    local.set 5
    local.get 4
    local.get 5
    i32.store offset=8
    local.get 4
    local.get 5
    i32.store offset=12
    local.get 4
    local.get 5
    i32.store offset=4
    local.get 4
    i32.load offset=4
    local.set 6
    local.get 6
    return
  )
  (func $_ZN153_$LT$core..result..Result$LT$T$C$F$GT$$u20$as$u20$core..ops..try_trait..FromResidual$LT$core..result..Result$LT$core..convert..Infallible$C$E$GT$$GT$$GT$13from_residual17h4226c443b30565c3E (;82;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    local.get 1
    i32.store offset=4
    local.get 5
    i32.load offset=4
    local.set 6
    local.get 5
    local.get 6
    i32.store offset=8
    local.get 5
    local.get 6
    i32.store offset=12
    local.get 0
    local.get 6
    i32.store offset=4
    i32.const 0
    local.set 7
    local.get 0
    local.get 7
    i32.store
    return
  )
  (func $_ZN4core6result19Result$LT$T$C$E$GT$14unwrap_or_else17haa48b17982cd167bE (;83;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 32
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=4
    i32.const 1
    local.set 4
    local.get 3
    local.get 4
    i32.store8 offset=15
    local.get 3
    i32.load offset=4
    local.set 5
    i32.const 0
    local.set 6
    i32.const 1
    local.set 7
    local.get 7
    local.get 6
    local.get 5
    select
    local.set 8
    block ;; label = @1
      block ;; label = @2
        local.get 8
        br_if 0 (;@2;)
        br 1 (;@1;)
      end
      local.get 3
      i32.load offset=4
      local.set 9
      local.get 3
      local.get 9
      i32.store offset=28
      i32.const 0
      local.set 10
      local.get 3
      local.get 10
      i32.store8 offset=15
      local.get 3
      local.get 9
      i32.store offset=8
      local.get 3
      i32.load offset=8
      local.set 11
      local.get 11
      call $_ZN4uuid3rng5bytes28_$u7b$$u7b$closure$u7d$$u7d$17h138dcf2b7811823aE
    end
    local.get 3
    i32.load8_u offset=15
    local.set 12
    i32.const 1
    local.set 13
    local.get 12
    local.get 13
    i32.and
    local.set 14
    block ;; label = @1
      local.get 14
      i32.eqz
      br_if 0 (;@1;)
    end
    i32.const 32
    local.set 15
    local.get 3
    local.get 15
    i32.add
    local.set 16
    local.get 16
    global.set $__stack_pointer
    return
  )
  (func $_ZN79_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$core..ops..try_trait..Try$GT$6branch17ha473c5a719b7e0dbE (;84;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 1
    i32.load
    local.set 5
    i32.const 1
    local.set 6
    i32.const 0
    local.set 7
    local.get 7
    local.get 6
    local.get 5
    select
    local.set 8
    block ;; label = @1
      block ;; label = @2
        local.get 8
        br_if 0 (;@2;)
        local.get 1
        i32.load
        local.set 9
        local.get 1
        i32.load offset=4
        local.set 10
        local.get 4
        local.get 9
        i32.store offset=8
        local.get 4
        local.get 10
        i32.store offset=12
        local.get 0
        local.get 9
        i32.store
        local.get 0
        local.get 10
        i32.store offset=4
        br 1 (;@1;)
      end
      local.get 1
      i32.load offset=4
      local.set 11
      local.get 4
      local.get 11
      i32.store offset=4
      local.get 4
      local.get 11
      i32.store
      local.get 4
      i32.load
      local.set 12
      local.get 0
      local.get 12
      i32.store offset=4
      i32.const 0
      local.set 13
      local.get 0
      local.get 13
      i32.store
    end
    return
  )
  (func $_ZN79_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$core..ops..try_trait..Try$GT$6branch17hdab6d894977e4076E (;85;) (type 9) (param i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 32
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 3
    i32.load offset=12
    local.set 4
    i32.const 0
    local.set 5
    i32.const 1
    local.set 6
    local.get 6
    local.get 5
    local.get 4
    select
    local.set 7
    block ;; label = @1
      block ;; label = @2
        local.get 7
        br_if 0 (;@2;)
        i32.const 0
        local.set 8
        local.get 3
        local.get 8
        i32.store offset=16
        br 1 (;@1;)
      end
      local.get 3
      i32.load offset=12
      local.set 9
      local.get 3
      local.get 9
      i32.store offset=28
      local.get 3
      local.get 9
      i32.store offset=20
      local.get 3
      i32.load offset=20
      local.set 10
      local.get 3
      local.get 10
      i32.store offset=16
    end
    local.get 3
    i32.load offset=16
    local.set 11
    local.get 11
    return
  )
  (func $_ZN4core3ptr5write17hf5826bad470c2824E (;86;) (type 3) (param i32 i32)
    (local i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i64 i32 i32 i32 i64)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 0
    i32.store offset=12
    local.get 1
    i64.load align=1
    local.set 5
    local.get 0
    local.get 5
    i64.store align=1
    i32.const 32
    local.set 6
    local.get 0
    local.get 6
    i32.add
    local.set 7
    local.get 1
    local.get 6
    i32.add
    local.set 8
    local.get 8
    i32.load align=1
    local.set 9
    local.get 7
    local.get 9
    i32.store align=1
    i32.const 24
    local.set 10
    local.get 0
    local.get 10
    i32.add
    local.set 11
    local.get 1
    local.get 10
    i32.add
    local.set 12
    local.get 12
    i64.load align=1
    local.set 13
    local.get 11
    local.get 13
    i64.store align=1
    i32.const 16
    local.set 14
    local.get 0
    local.get 14
    i32.add
    local.set 15
    local.get 1
    local.get 14
    i32.add
    local.set 16
    local.get 16
    i64.load align=1
    local.set 17
    local.get 15
    local.get 17
    i64.store align=1
    i32.const 8
    local.set 18
    local.get 0
    local.get 18
    i32.add
    local.set 19
    local.get 1
    local.get 18
    i32.add
    local.set 20
    local.get 20
    i64.load align=1
    local.set 21
    local.get 19
    local.get 21
    i64.store align=1
    return
  )
  (func $_ZN4core3str8converts23from_utf8_unchecked_mut17h746cd05a250dc07eE (;87;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    local.get 1
    i32.store offset=8
    local.get 5
    local.get 2
    i32.store offset=12
    local.get 0
    local.get 2
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store
    return
  )
  (func $_ZN4core5slice29_$LT$impl$u20$$u5b$T$u5d$$GT$8is_empty17h06d9b39d2e57975dE (;88;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 0
    i32.store offset=8
    local.get 4
    local.get 1
    i32.store offset=12
    i32.const 0
    local.set 5
    local.get 1
    local.set 6
    local.get 5
    local.set 7
    local.get 6
    local.get 7
    i32.eq
    local.set 8
    i32.const 1
    local.set 9
    local.get 8
    local.get 9
    i32.and
    local.set 10
    local.get 10
    return
  )
  (func $_ZN4uuid3rng5bytes17h9765e5ba42b5d4f8E (;89;) (type $.rodata) (param i32)
    (local i64 i32 i32 i32 i32)
    i64.const 0
    local.set 1
    local.get 0
    local.get 1
    i64.store align=1
    i32.const 8
    local.set 2
    local.get 0
    local.get 2
    i32.add
    local.set 3
    local.get 3
    local.get 1
    i64.store align=1
    i32.const 16
    local.set 4
    local.get 0
    local.get 4
    call $_ZN9getrandom9getrandom17hf64dfcab90af63a8E
    local.set 5
    local.get 5
    call $_ZN4core6result19Result$LT$T$C$E$GT$14unwrap_or_else17haa48b17982cd167bE
    return
  )
  (func $_ZN4uuid3rng5bytes28_$u7b$$u7b$closure$u7d$$u7d$17h138dcf2b7811823aE (;90;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 64
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store offset=20
    i32.const 8
    local.set 4
    local.get 3
    local.get 4
    i32.add
    local.set 5
    i32.const 20
    local.set 6
    local.get 3
    local.get 6
    i32.add
    local.set 7
    local.get 5
    local.get 7
    call $_ZN4core3fmt10ArgumentV111new_display17hfb3a99e9ee7b37c3E
    local.get 3
    i32.load offset=12
    local.set 8
    local.get 3
    i32.load offset=8
    local.set 9
    local.get 3
    local.get 9
    i32.store offset=48
    local.get 3
    local.get 8
    i32.store offset=52
    i32.const 24
    local.set 10
    local.get 3
    local.get 10
    i32.add
    local.set 11
    local.get 11
    local.set 12
    i32.const 1049744
    local.set 13
    i32.const 1
    local.set 14
    i32.const 48
    local.set 15
    local.get 3
    local.get 15
    i32.add
    local.set 16
    local.get 16
    local.set 17
    local.get 12
    local.get 13
    local.get 14
    local.get 17
    local.get 14
    call $_ZN4core3fmt9Arguments6new_v117hc1e750e5e52a88b6E
    i32.const 24
    local.set 18
    local.get 3
    local.get 18
    i32.add
    local.set 19
    local.get 19
    local.set 20
    i32.const 1049840
    local.set 21
    local.get 20
    local.get 21
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN4uuid7builder7Builder12with_variant17h261474c3b61991dfE (;91;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i64)
    global.get $__stack_pointer
    local.set 3
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    local.get 2
    i32.store8 offset=13
    local.get 1
    i32.load8_u offset=8
    local.set 6
    local.get 5
    local.get 6
    i32.store8 offset=15
    local.get 5
    i32.load8_u offset=13
    local.set 7
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              local.get 7
              br_table 0 (;@5;) 1 (;@4;) 2 (;@3;) 3 (;@2;) 0 (;@5;)
            end
            i32.const 127
            local.set 8
            local.get 6
            local.get 8
            i32.and
            local.set 9
            local.get 5
            local.get 9
            i32.store8 offset=14
            br 3 (;@1;)
          end
          i32.const 63
          local.set 10
          local.get 6
          local.get 10
          i32.and
          local.set 11
          i32.const -128
          local.set 12
          local.get 11
          local.get 12
          i32.or
          local.set 13
          local.get 5
          local.get 13
          i32.store8 offset=14
          br 2 (;@1;)
        end
        i32.const 31
        local.set 14
        local.get 6
        local.get 14
        i32.and
        local.set 15
        i32.const -64
        local.set 16
        local.get 15
        local.get 16
        i32.or
        local.set 17
        local.get 5
        local.get 17
        i32.store8 offset=14
        br 1 (;@1;)
      end
      i32.const -32
      local.set 18
      local.get 6
      local.get 18
      i32.or
      local.set 19
      local.get 5
      local.get 19
      i32.store8 offset=14
    end
    local.get 5
    i32.load8_u offset=14
    local.set 20
    local.get 1
    local.get 20
    i32.store8 offset=8
    local.get 1
    i64.load align=1
    local.set 21
    local.get 0
    local.get 21
    i64.store align=1
    i32.const 8
    local.set 22
    local.get 0
    local.get 22
    i32.add
    local.set 23
    local.get 1
    local.get 22
    i32.add
    local.set 24
    local.get 24
    i64.load align=1
    local.set 25
    local.get 23
    local.get 25
    i64.store align=1
    return
    unreachable
  )
  (func $_ZN4uuid7builder7Builder12with_version17h5060c9a0a30720a8E (;92;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i64)
    global.get $__stack_pointer
    local.set 3
    i32.const 16
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    local.get 2
    i32.store8 offset=15
    local.get 1
    i32.load8_u offset=6
    local.set 6
    i32.const 15
    local.set 7
    local.get 6
    local.get 7
    i32.and
    local.set 8
    local.get 5
    i32.load8_u offset=15
    local.set 9
    i32.const 4
    local.set 10
    local.get 9
    local.get 10
    i32.shl
    local.set 11
    local.get 8
    local.get 11
    i32.or
    local.set 12
    local.get 1
    local.get 12
    i32.store8 offset=6
    local.get 1
    i64.load align=1
    local.set 13
    local.get 0
    local.get 13
    i64.store align=1
    i32.const 8
    local.set 14
    local.get 0
    local.get 14
    i32.add
    local.set 15
    local.get 1
    local.get 14
    i32.add
    local.set 16
    local.get 16
    i64.load align=1
    local.set 17
    local.get 15
    local.get 17
    i64.store align=1
    return
  )
  (func $_ZN4uuid7builder7Builder17from_random_bytes17h0ef1d660589bf826E (;93;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i64 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 64
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    i32.const 8
    local.set 5
    local.get 1
    local.get 5
    i32.add
    local.set 6
    local.get 6
    i64.load align=1
    local.set 7
    i32.const 48
    local.set 8
    local.get 4
    local.get 8
    i32.add
    local.set 9
    local.get 9
    local.get 5
    i32.add
    local.set 10
    local.get 10
    local.get 7
    i64.store
    local.get 1
    i64.load align=1
    local.set 11
    local.get 4
    local.get 11
    i64.store offset=48
    i32.const 32
    local.set 12
    local.get 4
    local.get 12
    i32.add
    local.set 13
    local.get 13
    local.set 14
    i32.const 48
    local.set 15
    local.get 4
    local.get 15
    i32.add
    local.set 16
    local.get 16
    local.set 17
    local.get 14
    local.get 17
    call $_ZN4uuid7builder28_$LT$impl$u20$uuid..Uuid$GT$10from_bytes17ha9b1dc5c2e36adbaE
    i32.const 8
    local.set 18
    i32.const 16
    local.set 19
    local.get 4
    local.get 19
    i32.add
    local.set 20
    local.get 20
    local.get 18
    i32.add
    local.set 21
    i32.const 32
    local.set 22
    local.get 4
    local.get 22
    i32.add
    local.set 23
    local.get 23
    local.get 18
    i32.add
    local.set 24
    local.get 24
    i64.load
    local.set 25
    local.get 21
    local.get 25
    i64.store
    local.get 4
    i64.load offset=32
    local.set 26
    local.get 4
    local.get 26
    i64.store offset=16
    local.get 4
    local.set 27
    i32.const 16
    local.set 28
    local.get 4
    local.get 28
    i32.add
    local.set 29
    local.get 29
    local.set 30
    i32.const 1
    local.set 31
    local.get 27
    local.get 30
    local.get 31
    call $_ZN4uuid7builder7Builder12with_variant17h261474c3b61991dfE
    local.get 4
    local.set 32
    i32.const 4
    local.set 33
    local.get 0
    local.get 32
    local.get 33
    call $_ZN4uuid7builder7Builder12with_version17h5060c9a0a30720a8E
    i32.const 64
    local.set 34
    local.get 4
    local.get 34
    i32.add
    local.set 35
    local.get 35
    global.set $__stack_pointer
    return
  )
  (func $_ZN4uuid7builder7Builder9into_uuid17h150f41d9721f6fa3E (;94;) (type 3) (param i32 i32)
    (local i64 i32 i32 i32 i64)
    local.get 1
    i64.load align=1
    local.set 2
    local.get 0
    local.get 2
    i64.store align=1
    i32.const 8
    local.set 3
    local.get 0
    local.get 3
    i32.add
    local.set 4
    local.get 1
    local.get 3
    i32.add
    local.set 5
    local.get 5
    i64.load align=1
    local.set 6
    local.get 4
    local.get 6
    i64.store align=1
    return
  )
  (func $_ZN4core3fmt10ArgumentV111new_display17hfb3a99e9ee7b37c3E (;95;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 1
    i32.store offset=16
    i32.const 5
    local.set 5
    local.get 4
    local.get 5
    i32.store offset=20
    local.get 4
    local.get 5
    i32.store offset=24
    local.get 4
    i32.load offset=24
    local.set 6
    local.get 4
    local.get 1
    i32.store offset=28
    local.get 4
    i32.load offset=28
    local.set 7
    local.get 4
    local.get 7
    i32.store offset=8
    local.get 4
    local.get 6
    i32.store offset=12
    local.get 4
    i32.load offset=8
    local.set 8
    local.get 4
    i32.load offset=12
    local.set 9
    local.get 0
    local.get 9
    i32.store offset=4
    local.get 0
    local.get 8
    i32.store
    return
  )
  (func $_ZN4core3fmt9Arguments6new_v117hc1e750e5e52a88b6E (;96;) (type 10) (param i32 i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 5
    i32.const 64
    local.set 6
    local.get 5
    local.get 6
    i32.sub
    local.set 7
    local.get 7
    global.set $__stack_pointer
    local.get 7
    local.get 1
    i32.store offset=48
    local.get 7
    local.get 2
    i32.store offset=52
    local.get 7
    local.get 3
    i32.store offset=56
    local.get 7
    local.get 4
    i32.store offset=60
    local.get 2
    local.set 8
    local.get 4
    local.set 9
    local.get 8
    local.get 9
    i32.lt_u
    local.set 10
    i32.const 1
    local.set 11
    local.get 10
    local.get 11
    i32.and
    local.set 12
    block ;; label = @1
      block ;; label = @2
        local.get 12
        br_if 0 (;@2;)
        i32.const 1
        local.set 13
        local.get 4
        local.get 13
        i32.add
        local.set 14
        local.get 2
        local.set 15
        local.get 14
        local.set 16
        local.get 15
        local.get 16
        i32.gt_u
        local.set 17
        i32.const 1
        local.set 18
        local.get 17
        local.get 18
        i32.and
        local.set 19
        local.get 7
        local.get 19
        i32.store8 offset=15
        br 1 (;@1;)
      end
      i32.const 1
      local.set 20
      local.get 7
      local.get 20
      i32.store8 offset=15
    end
    local.get 7
    i32.load8_u offset=15
    local.set 21
    i32.const 1
    local.set 22
    local.get 21
    local.get 22
    i32.and
    local.set 23
    block ;; label = @1
      local.get 23
      br_if 0 (;@1;)
      i32.const 0
      local.set 24
      local.get 7
      local.get 24
      i32.store offset=40
      local.get 0
      local.get 1
      i32.store offset=8
      local.get 0
      local.get 2
      i32.store offset=12
      local.get 7
      i32.load offset=40
      local.set 25
      local.get 7
      i32.load offset=44
      local.set 26
      local.get 0
      local.get 25
      i32.store
      local.get 0
      local.get 26
      i32.store offset=4
      local.get 0
      local.get 3
      i32.store offset=16
      local.get 0
      local.get 4
      i32.store offset=20
      i32.const 64
      local.set 27
      local.get 7
      local.get 27
      i32.add
      local.set 28
      local.get 28
      global.set $__stack_pointer
      return
    end
    i32.const 16
    local.set 29
    local.get 7
    local.get 29
    i32.add
    local.set 30
    local.get 30
    local.set 31
    i32.const 1049868
    local.set 32
    i32.const 1
    local.set 33
    i32.const 1049876
    local.set 34
    i32.const 0
    local.set 35
    local.get 31
    local.get 32
    local.get 33
    local.get 34
    local.get 35
    call $_ZN4core3fmt9Arguments6new_v117hc1e750e5e52a88b6E
    i32.const 16
    local.set 36
    local.get 7
    local.get 36
    i32.add
    local.set 37
    local.get 37
    local.set 38
    i32.const 1049952
    local.set 39
    local.get 38
    local.get 39
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN4core5slice5index77_$LT$impl$u20$core..ops..index..IndexMut$LT$I$GT$$u20$for$u20$$u5b$T$u5d$$GT$9index_mut17h5837f297ea372406E (;97;) (type 10) (param i32 i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 5
    i32.const 32
    local.set 6
    local.get 5
    local.get 6
    i32.sub
    local.set 7
    local.get 7
    global.set $__stack_pointer
    local.get 7
    local.get 1
    i32.store offset=16
    local.get 7
    local.get 2
    i32.store offset=20
    local.get 7
    local.get 3
    i32.store offset=28
    i32.const 8
    local.set 8
    local.get 7
    local.get 8
    i32.add
    local.set 9
    local.get 9
    local.get 3
    local.get 1
    local.get 2
    local.get 4
    call $_ZN108_$LT$core..ops..range..RangeTo$LT$usize$GT$$u20$as$u20$core..slice..index..SliceIndex$LT$$u5b$T$u5d$$GT$$GT$9index_mut17h198602632ba946e8E
    local.get 7
    i32.load offset=8
    local.set 10
    local.get 7
    i32.load offset=12
    local.set 11
    local.get 0
    local.get 11
    i32.store offset=4
    local.get 0
    local.get 10
    i32.store
    i32.const 32
    local.set 12
    local.get 7
    local.get 12
    i32.add
    local.set 13
    local.get 13
    global.set $__stack_pointer
    return
  )
  (func $_ZN9getrandom16getrandom_uninit17ha9296264802ce52fE (;98;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 32
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store offset=8
    local.get 5
    local.get 2
    i32.store offset=12
    local.get 1
    local.get 2
    call $_ZN4core5slice29_$LT$impl$u20$$u5b$T$u5d$$GT$8is_empty17h06d9b39d2e57975dE
    local.set 6
    i32.const -1
    local.set 7
    local.get 6
    local.get 7
    i32.xor
    local.set 8
    i32.const 1
    local.set 9
    local.get 8
    local.get 9
    i32.and
    local.set 10
    block ;; label = @1
      block ;; label = @2
        local.get 10
        i32.eqz
        br_if 0 (;@2;)
        local.get 1
        local.get 2
        call $_ZN9getrandom3imp15getrandom_inner17h5370013ce312b18eE
        local.set 11
        local.get 11
        call $_ZN79_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$core..ops..try_trait..Try$GT$6branch17hdab6d894977e4076E
        local.set 12
        local.get 5
        local.get 12
        i32.store offset=4
        local.get 5
        i32.load offset=4
        local.set 13
        i32.const 0
        local.set 14
        i32.const 1
        local.set 15
        local.get 15
        local.get 14
        local.get 13
        select
        local.set 16
        local.get 16
        i32.eqz
        br_if 0 (;@2;)
        local.get 5
        i32.load offset=4
        local.set 17
        local.get 5
        local.get 17
        i32.store offset=20
        i32.const 1050060
        local.set 18
        local.get 0
        local.get 17
        local.get 18
        call $_ZN153_$LT$core..result..Result$LT$T$C$F$GT$$u20$as$u20$core..ops..try_trait..FromResidual$LT$core..result..Result$LT$core..convert..Infallible$C$E$GT$$GT$$GT$13from_residual17h4226c443b30565c3E
        br 1 (;@1;)
      end
      local.get 5
      local.get 1
      i32.store offset=24
      local.get 5
      local.get 2
      i32.store offset=28
      local.get 2
      local.set 19
      local.get 1
      local.set 20
      local.get 0
      local.get 20
      i32.store
      local.get 0
      local.get 19
      i32.store offset=4
    end
    i32.const 32
    local.set 21
    local.get 5
    local.get 21
    i32.add
    local.set 22
    local.get 22
    global.set $__stack_pointer
    return
  )
  (func $_ZN9getrandom9getrandom17hf64dfcab90af63a8E (;99;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 64
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=32
    local.get 4
    local.get 1
    i32.store offset=36
    local.get 4
    local.get 0
    i32.store offset=56
    local.get 4
    local.get 1
    i32.store offset=60
    local.get 1
    local.set 5
    local.get 0
    local.set 6
    i32.const 24
    local.set 7
    local.get 4
    local.get 7
    i32.add
    local.set 8
    local.get 8
    local.set 9
    local.get 9
    local.get 6
    local.get 5
    call $_ZN9getrandom16getrandom_uninit17ha9296264802ce52fE
    i32.const 16
    local.set 10
    local.get 4
    local.get 10
    i32.add
    local.set 11
    local.get 11
    local.set 12
    i32.const 24
    local.set 13
    local.get 4
    local.get 13
    i32.add
    local.set 14
    local.get 14
    local.set 15
    local.get 12
    local.get 15
    call $_ZN79_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$core..ops..try_trait..Try$GT$6branch17ha473c5a719b7e0dbE
    local.get 4
    i32.load offset=16
    local.set 16
    i32.const 1
    local.set 17
    i32.const 0
    local.set 18
    local.get 18
    local.get 17
    local.get 16
    select
    local.set 19
    block ;; label = @1
      block ;; label = @2
        local.get 19
        br_if 0 (;@2;)
        local.get 4
        i32.load offset=16
        local.set 20
        local.get 4
        i32.load offset=20
        local.set 21
        local.get 4
        local.get 20
        i32.store offset=48
        local.get 4
        local.get 21
        i32.store offset=52
        i32.const 0
        local.set 22
        local.get 4
        local.get 22
        i32.store offset=12
        br 1 (;@1;)
      end
      local.get 4
      i32.load offset=20
      local.set 23
      local.get 4
      local.get 23
      i32.store offset=44
      i32.const 1050076
      local.set 24
      local.get 23
      local.get 24
      call $_ZN153_$LT$core..result..Result$LT$T$C$F$GT$$u20$as$u20$core..ops..try_trait..FromResidual$LT$core..result..Result$LT$core..convert..Infallible$C$E$GT$$GT$$GT$13from_residual17h21b3a9dac95dc5baE
      local.set 25
      local.get 4
      local.get 25
      i32.store offset=12
    end
    local.get 4
    i32.load offset=12
    local.set 26
    i32.const 64
    local.set 27
    local.get 4
    local.get 27
    i32.add
    local.set 28
    local.get 28
    global.set $__stack_pointer
    local.get 26
    return
  )
  (func $_ZN106_$LT$core..ops..range..Range$LT$usize$GT$$u20$as$u20$core..slice..index..SliceIndex$LT$$u5b$T$u5d$$GT$$GT$9index_mut17haa5ce7c7a96e365eE (;100;) (type 13) (param i32 i32 i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 6
    i32.const 80
    local.set 7
    local.get 6
    local.get 7
    i32.sub
    local.set 8
    local.get 8
    global.set $__stack_pointer
    local.get 8
    local.get 1
    i32.store offset=24
    local.get 8
    local.get 2
    i32.store offset=28
    local.get 8
    local.get 3
    i32.store offset=32
    local.get 8
    local.get 4
    i32.store offset=36
    local.get 1
    local.set 9
    local.get 2
    local.set 10
    local.get 9
    local.get 10
    i32.gt_u
    local.set 11
    i32.const 1
    local.set 12
    local.get 11
    local.get 12
    i32.and
    local.set 13
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          local.get 13
          br_if 0 (;@3;)
          local.get 2
          local.set 14
          local.get 4
          local.set 15
          local.get 14
          local.get 15
          i32.gt_u
          local.set 16
          i32.const 1
          local.set 17
          local.get 16
          local.get 17
          i32.and
          local.set 18
          local.get 18
          br_if 2 (;@1;)
          br 1 (;@2;)
        end
        local.get 1
        local.get 2
        local.get 5
        call $_ZN4core5slice5index22slice_index_order_fail17h23aab599a56da6feE
        unreachable
      end
      local.get 8
      local.get 3
      i32.store offset=40
      local.get 8
      local.get 4
      i32.store offset=44
      local.get 8
      local.get 3
      i32.store offset=52
      local.get 8
      local.get 1
      i32.store offset=56
      local.get 8
      local.get 1
      i32.store offset=60
      local.get 3
      local.get 1
      i32.add
      local.set 19
      local.get 8
      local.get 19
      i32.store offset=64
      local.get 8
      i32.load offset=64
      local.set 20
      local.get 8
      local.get 20
      i32.store offset=68
      local.get 2
      local.get 1
      i32.sub
      local.set 21
      local.get 8
      local.get 21
      i32.store offset=72
      local.get 8
      local.get 20
      i32.store offset=76
      local.get 8
      local.get 20
      i32.store offset=16
      local.get 8
      local.get 21
      i32.store offset=20
      local.get 8
      i32.load offset=16
      local.set 22
      local.get 8
      i32.load offset=20
      local.set 23
      local.get 8
      local.get 22
      i32.store offset=8
      local.get 8
      local.get 23
      i32.store offset=12
      local.get 8
      i32.load offset=8
      local.set 24
      local.get 8
      i32.load offset=12
      local.set 25
      local.get 0
      local.get 25
      i32.store offset=4
      local.get 0
      local.get 24
      i32.store
      i32.const 80
      local.set 26
      local.get 8
      local.get 26
      i32.add
      local.set 27
      local.get 27
      global.set $__stack_pointer
      return
    end
    local.get 2
    local.get 4
    local.get 5
    call $_ZN4core5slice5index24slice_end_index_len_fail17h2ed49d5a2945907fE
    unreachable
  )
  (func $_ZN108_$LT$core..ops..range..RangeTo$LT$usize$GT$$u20$as$u20$core..slice..index..SliceIndex$LT$$u5b$T$u5d$$GT$$GT$9index_mut17h198602632ba946e8E (;101;) (type 10) (param i32 i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 5
    i32.const 32
    local.set 6
    local.get 5
    local.get 6
    i32.sub
    local.set 7
    local.get 7
    global.set $__stack_pointer
    local.get 7
    local.get 1
    i32.store offset=20
    local.get 7
    local.get 2
    i32.store offset=24
    local.get 7
    local.get 3
    i32.store offset=28
    i32.const 0
    local.set 8
    local.get 7
    local.get 8
    i32.store offset=8
    local.get 7
    local.get 1
    i32.store offset=12
    local.get 7
    i32.load offset=8
    local.set 9
    local.get 7
    i32.load offset=12
    local.set 10
    local.get 7
    local.get 9
    local.get 10
    local.get 2
    local.get 3
    local.get 4
    call $_ZN106_$LT$core..ops..range..Range$LT$usize$GT$$u20$as$u20$core..slice..index..SliceIndex$LT$$u5b$T$u5d$$GT$$GT$9index_mut17haa5ce7c7a96e365eE
    local.get 7
    i32.load
    local.set 11
    local.get 7
    i32.load offset=4
    local.set 12
    local.get 0
    local.get 12
    i32.store offset=4
    local.get 0
    local.get 11
    i32.store
    i32.const 32
    local.set 13
    local.get 7
    local.get 13
    i32.add
    local.set 14
    local.get 14
    global.set $__stack_pointer
    return
  )
  (func $_ZN4core3fmt10ArgumentV111new_display17h18c5892993bfd8dcE (;102;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 1
    i32.store offset=16
    i32.const 6
    local.set 5
    local.get 4
    local.get 5
    i32.store offset=20
    local.get 4
    local.get 5
    i32.store offset=24
    local.get 4
    i32.load offset=24
    local.set 6
    local.get 4
    local.get 1
    i32.store offset=28
    local.get 4
    i32.load offset=28
    local.set 7
    local.get 4
    local.get 7
    i32.store offset=8
    local.get 4
    local.get 6
    i32.store offset=12
    local.get 4
    i32.load offset=8
    local.set 8
    local.get 4
    i32.load offset=12
    local.set 9
    local.get 0
    local.get 9
    i32.store offset=4
    local.get 0
    local.get 8
    i32.store
    return
  )
  (func $_ZN4core3fmt10ArgumentV111new_display17h44794ecd0007fd7aE (;103;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 1
    i32.store offset=16
    i32.const 7
    local.set 5
    local.get 4
    local.get 5
    i32.store offset=20
    local.get 4
    local.get 5
    i32.store offset=24
    local.get 4
    i32.load offset=24
    local.set 6
    local.get 4
    local.get 1
    i32.store offset=28
    local.get 4
    i32.load offset=28
    local.set 7
    local.get 4
    local.get 7
    i32.store offset=8
    local.get 4
    local.get 6
    i32.store offset=12
    local.get 4
    i32.load offset=8
    local.set 8
    local.get 4
    i32.load offset=12
    local.set 9
    local.get 0
    local.get 9
    i32.store offset=4
    local.get 0
    local.get 8
    i32.store
    return
  )
  (func $_ZN4core3fmt9Arguments6new_v117hf05d13fa57bf4cf4E (;104;) (type 10) (param i32 i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 5
    i32.const 64
    local.set 6
    local.get 5
    local.get 6
    i32.sub
    local.set 7
    local.get 7
    global.set $__stack_pointer
    local.get 7
    local.get 1
    i32.store offset=48
    local.get 7
    local.get 2
    i32.store offset=52
    local.get 7
    local.get 3
    i32.store offset=56
    local.get 7
    local.get 4
    i32.store offset=60
    local.get 2
    local.set 8
    local.get 4
    local.set 9
    local.get 8
    local.get 9
    i32.lt_u
    local.set 10
    i32.const 1
    local.set 11
    local.get 10
    local.get 11
    i32.and
    local.set 12
    block ;; label = @1
      block ;; label = @2
        local.get 12
        br_if 0 (;@2;)
        i32.const 1
        local.set 13
        local.get 4
        local.get 13
        i32.add
        local.set 14
        local.get 2
        local.set 15
        local.get 14
        local.set 16
        local.get 15
        local.get 16
        i32.gt_u
        local.set 17
        i32.const 1
        local.set 18
        local.get 17
        local.get 18
        i32.and
        local.set 19
        local.get 7
        local.get 19
        i32.store8 offset=15
        br 1 (;@1;)
      end
      i32.const 1
      local.set 20
      local.get 7
      local.get 20
      i32.store8 offset=15
    end
    local.get 7
    i32.load8_u offset=15
    local.set 21
    i32.const 1
    local.set 22
    local.get 21
    local.get 22
    i32.and
    local.set 23
    block ;; label = @1
      local.get 23
      br_if 0 (;@1;)
      i32.const 0
      local.set 24
      local.get 7
      local.get 24
      i32.store offset=40
      local.get 0
      local.get 1
      i32.store offset=8
      local.get 0
      local.get 2
      i32.store offset=12
      local.get 7
      i32.load offset=40
      local.set 25
      local.get 7
      i32.load offset=44
      local.set 26
      local.get 0
      local.get 25
      i32.store
      local.get 0
      local.get 26
      i32.store offset=4
      local.get 0
      local.get 3
      i32.store offset=16
      local.get 0
      local.get 4
      i32.store offset=20
      i32.const 64
      local.set 27
      local.get 7
      local.get 27
      i32.add
      local.set 28
      local.get 28
      global.set $__stack_pointer
      return
    end
    i32.const 16
    local.set 29
    local.get 7
    local.get 29
    i32.add
    local.set 30
    local.get 30
    local.set 31
    i32.const 1050104
    local.set 32
    i32.const 1
    local.set 33
    i32.const 1050112
    local.set 34
    i32.const 0
    local.set 35
    local.get 31
    local.get 32
    local.get 33
    local.get 34
    local.get 35
    call $_ZN4core3fmt9Arguments6new_v117hf05d13fa57bf4cf4E
    i32.const 16
    local.set 36
    local.get 7
    local.get 36
    i32.add
    local.set 37
    local.get 37
    local.set 38
    i32.const 1050188
    local.set 39
    local.get 38
    local.get 39
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN4core6result19Result$LT$T$C$E$GT$7map_err17hf1454677b755b50dE (;105;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store16
    local.get 4
    local.get 1
    i32.store16 offset=2
    i32.const 1
    local.set 5
    local.get 4
    local.get 5
    i32.store8 offset=15
    local.get 4
    i32.load16_u
    local.set 6
    i32.const 65535
    local.set 7
    local.get 6
    local.get 7
    i32.and
    local.set 8
    block ;; label = @1
      block ;; label = @2
        local.get 8
        br_if 0 (;@2;)
        i32.const 0
        local.set 9
        local.get 4
        local.get 9
        i32.store offset=8
        br 1 (;@1;)
      end
      local.get 4
      i32.load16_u offset=2
      local.set 10
      local.get 4
      local.get 10
      i32.store16 offset=30
      i32.const 0
      local.set 11
      local.get 4
      local.get 11
      i32.store8 offset=15
      local.get 4
      local.get 10
      i32.store16 offset=12
      local.get 4
      i32.load16_u offset=12
      local.set 12
      local.get 12
      call $_ZN9getrandom3imp15getrandom_inner28_$u7b$$u7b$closure$u7d$$u7d$17hefd1bb114a3a0826E
      local.set 13
      local.get 4
      local.get 13
      i32.store offset=8
    end
    local.get 4
    i32.load8_u offset=15
    local.set 14
    i32.const 1
    local.set 15
    local.get 14
    local.get 15
    i32.and
    local.set 16
    block ;; label = @1
      local.get 16
      i32.eqz
      br_if 0 (;@1;)
    end
    local.get 4
    i32.load offset=8
    local.set 17
    i32.const 32
    local.set 18
    local.get 4
    local.get 18
    i32.add
    local.set 19
    local.get 19
    global.set $__stack_pointer
    local.get 17
    return
  )
  (func $_ZN4core3num7nonzero10NonZeroU163new17hd858bf6629216e02E (;106;) (type 9) (param i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    local.get 0
    i32.store16 offset=14
    i32.const 0
    local.set 4
    i32.const 65535
    local.set 5
    local.get 0
    local.get 5
    i32.and
    local.set 6
    i32.const 65535
    local.set 7
    local.get 4
    local.get 7
    i32.and
    local.set 8
    local.get 6
    local.get 8
    i32.eq
    local.set 9
    i32.const 1
    local.set 10
    local.get 9
    local.get 10
    i32.and
    local.set 11
    block ;; label = @1
      block ;; label = @2
        local.get 11
        i32.eqz
        br_if 0 (;@2;)
        i32.const 0
        local.set 12
        local.get 3
        local.get 12
        i32.store16 offset=10
        br 1 (;@1;)
      end
      local.get 3
      local.get 0
      i32.store16 offset=12
      local.get 3
      i32.load16_u offset=12
      local.set 13
      local.get 3
      local.get 13
      i32.store16 offset=10
    end
    local.get 3
    i32.load16_u offset=10
    local.set 14
    local.get 14
    return
  )
  (func $_ZN4core3num7nonzero10NonZeroU323get17h157dc061692fd355E (;107;) (type 9) (param i32) (result i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 0
    return
  )
  (func $_ZN4core7convert3num118_$LT$impl$u20$core..convert..From$LT$core..num..nonzero..NonZeroU16$GT$$u20$for$u20$core..num..nonzero..NonZeroU32$GT$4from17hd38b9993015641abE (;108;) (type 9) (param i32) (result i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    local.get 0
    i32.store16 offset=8
    local.get 3
    local.get 0
    i32.store16 offset=10
    i32.const 65535
    local.set 4
    local.get 0
    local.get 4
    i32.and
    local.set 5
    local.get 3
    local.get 5
    i32.store offset=12
    local.get 3
    local.get 5
    i32.store offset=4
    local.get 3
    i32.load offset=4
    local.set 6
    local.get 6
    return
  )
  (func $_ZN9getrandom3imp15getrandom_inner17h5370013ce312b18eE (;109;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=16
    local.get 4
    local.get 1
    i32.store offset=20
    local.get 4
    local.get 0
    i32.store offset=24
    local.get 4
    local.get 1
    i32.store offset=28
    i32.const 8
    local.set 5
    local.get 4
    local.get 5
    i32.add
    local.set 6
    local.get 6
    local.get 0
    local.get 1
    call $_ZN4wasi13lib_generated10random_get17hde77a9f55043326bE
    local.get 4
    i32.load16_u offset=8
    local.set 7
    local.get 4
    i32.load16_u offset=10
    local.set 8
    local.get 7
    local.get 8
    call $_ZN4core6result19Result$LT$T$C$E$GT$7map_err17hf1454677b755b50dE
    local.set 9
    i32.const 32
    local.set 10
    local.get 4
    local.get 10
    i32.add
    local.set 11
    local.get 11
    global.set $__stack_pointer
    local.get 9
    return
  )
  (func $_ZN9getrandom3imp15getrandom_inner28_$u7b$$u7b$closure$u7d$$u7d$17hefd1bb114a3a0826E (;110;) (type 9) (param i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 32
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    global.set $__stack_pointer
    local.get 3
    local.get 0
    i32.store16 offset=14
    i32.const 14
    local.set 4
    local.get 3
    local.get 4
    i32.add
    local.set 5
    local.get 5
    local.set 6
    local.get 6
    call $_ZN4wasi13lib_generated5Errno3raw17h3be5ef89c4f9e467E
    local.set 7
    local.get 7
    call $_ZN4core3num7nonzero10NonZeroU163new17hd858bf6629216e02E
    local.set 8
    local.get 3
    local.get 8
    i32.store16 offset=22
    local.get 3
    i32.load16_u offset=22
    local.set 9
    i32.const 0
    local.set 10
    i32.const 65535
    local.set 11
    local.get 9
    local.get 11
    i32.and
    local.set 12
    i32.const 65535
    local.set 13
    local.get 10
    local.get 13
    i32.and
    local.set 14
    local.get 12
    local.get 14
    i32.eq
    local.set 15
    i32.const 0
    local.set 16
    i32.const 1
    local.set 17
    i32.const 1
    local.set 18
    local.get 15
    local.get 18
    i32.and
    local.set 19
    local.get 16
    local.get 17
    local.get 19
    select
    local.set 20
    block ;; label = @1
      block ;; label = @2
        local.get 20
        br_if 0 (;@2;)
        i32.const -2147483647
        local.set 21
        local.get 3
        local.get 21
        i32.store offset=16
        br 1 (;@1;)
      end
      local.get 3
      i32.load16_u offset=22
      local.set 22
      local.get 3
      local.get 22
      i32.store16 offset=30
      local.get 22
      call $_ZN4core7convert3num118_$LT$impl$u20$core..convert..From$LT$core..num..nonzero..NonZeroU16$GT$$u20$for$u20$core..num..nonzero..NonZeroU32$GT$4from17hd38b9993015641abE
      local.set 23
      local.get 23
      call $_ZN101_$LT$getrandom..error..Error$u20$as$u20$core..convert..From$LT$core..num..nonzero..NonZeroU32$GT$$GT$4from17h30508099485bba26E
      local.set 24
      local.get 3
      local.get 24
      i32.store offset=16
    end
    local.get 3
    i32.load offset=16
    local.set 25
    i32.const 32
    local.set 26
    local.get 3
    local.get 26
    i32.add
    local.set 27
    local.get 27
    global.set $__stack_pointer
    local.get 25
    return
  )
  (func $_ZN9getrandom5error5Error12raw_os_error17h57ec8e7991df1d87E (;111;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 1
    i32.store offset=12
    local.get 1
    call $_ZN4core3num7nonzero10NonZeroU323get17h157dc061692fd355E
    local.set 5
    i32.const -2147483648
    local.set 6
    local.get 5
    local.set 7
    local.get 6
    local.set 8
    local.get 7
    local.get 8
    i32.lt_u
    local.set 9
    i32.const 1
    local.set 10
    local.get 9
    local.get 10
    i32.and
    local.set 11
    block ;; label = @1
      block ;; label = @2
        local.get 11
        br_if 0 (;@2;)
        i32.const 0
        local.set 12
        local.get 4
        local.get 12
        i32.store
        br 1 (;@1;)
      end
      local.get 1
      call $_ZN4core3num7nonzero10NonZeroU323get17h157dc061692fd355E
      local.set 13
      local.get 4
      local.get 13
      i32.store offset=4
      i32.const 1
      local.set 14
      local.get 4
      local.get 14
      i32.store
    end
    local.get 4
    i32.load
    local.set 15
    local.get 4
    i32.load offset=4
    local.set 16
    local.get 0
    local.get 16
    i32.store offset=4
    local.get 0
    local.get 15
    i32.store
    i32.const 16
    local.set 17
    local.get 4
    local.get 17
    i32.add
    local.set 18
    local.get 18
    global.set $__stack_pointer
    return
  )
  (func $_ZN9getrandom5error6os_err17hb31931f57f318b3aE (;112;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 32
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    local.get 1
    i32.store offset=20
    local.get 6
    local.get 2
    i32.store offset=24
    local.get 6
    local.get 3
    i32.store offset=28
    i32.const 0
    local.set 7
    local.get 6
    local.get 7
    i32.store offset=8
    local.get 6
    i32.load offset=8
    local.set 8
    local.get 6
    i32.load offset=12
    local.set 9
    local.get 0
    local.get 9
    i32.store offset=4
    local.get 0
    local.get 8
    i32.store
    return
  )
  (func $_ZN9getrandom5error13internal_desc17h8799b0c6b5e5065cE (;113;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    local.get 1
    i32.store offset=12
    i32.const -2147483648
    local.set 5
    local.get 1
    local.get 5
    i32.add
    local.set 6
    i32.const 14
    local.set 7
    local.get 6
    local.get 7
    i32.gt_u
    drop
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  block ;; label = @8
                    block ;; label = @9
                      block ;; label = @10
                        block ;; label = @11
                          block ;; label = @12
                            block ;; label = @13
                              block ;; label = @14
                                local.get 6
                                br_table 1 (;@13;) 2 (;@12;) 0 (;@14;) 3 (;@11;) 4 (;@10;) 5 (;@9;) 6 (;@8;) 7 (;@7;) 8 (;@6;) 0 (;@14;) 0 (;@14;) 9 (;@5;) 10 (;@4;) 11 (;@3;) 12 (;@2;) 0 (;@14;)
                              end
                              i32.const 0
                              local.set 8
                              local.get 4
                              local.get 8
                              i32.store
                              br 12 (;@1;)
                            end
                            i32.const 1050778
                            local.set 9
                            local.get 4
                            local.get 9
                            i32.store
                            i32.const 39
                            local.set 10
                            local.get 4
                            local.get 10
                            i32.store offset=4
                            br 11 (;@1;)
                          end
                          i32.const 1050740
                          local.set 11
                          local.get 4
                          local.get 11
                          i32.store
                          i32.const 38
                          local.set 12
                          local.get 4
                          local.get 12
                          i32.store offset=4
                          br 10 (;@1;)
                        end
                        i32.const 1050690
                        local.set 13
                        local.get 4
                        local.get 13
                        i32.store
                        i32.const 50
                        local.set 14
                        local.get 4
                        local.get 14
                        i32.store offset=4
                        br 9 (;@1;)
                      end
                      i32.const 1050645
                      local.set 15
                      local.get 4
                      local.get 15
                      i32.store
                      i32.const 45
                      local.set 16
                      local.get 4
                      local.get 16
                      i32.store offset=4
                      br 8 (;@1;)
                    end
                    i32.const 1050598
                    local.set 17
                    local.get 4
                    local.get 17
                    i32.store
                    i32.const 47
                    local.set 18
                    local.get 4
                    local.get 18
                    i32.store offset=4
                    br 7 (;@1;)
                  end
                  i32.const 1050565
                  local.set 19
                  local.get 4
                  local.get 19
                  i32.store
                  i32.const 33
                  local.set 20
                  local.get 4
                  local.get 20
                  i32.store offset=4
                  br 6 (;@1;)
                end
                i32.const 1050536
                local.set 21
                local.get 4
                local.get 21
                i32.store
                i32.const 29
                local.set 22
                local.get 4
                local.get 22
                i32.store offset=4
                br 5 (;@1;)
              end
              i32.const 1050491
              local.set 23
              local.get 4
              local.get 23
              i32.store
              i32.const 45
              local.set 24
              local.get 4
              local.get 24
              i32.store offset=4
              br 4 (;@1;)
            end
            i32.const 1050442
            local.set 25
            local.get 4
            local.get 25
            i32.store
            i32.const 49
            local.set 26
            local.get 4
            local.get 26
            i32.store offset=4
            br 3 (;@1;)
          end
          i32.const 1050397
          local.set 27
          local.get 4
          local.get 27
          i32.store
          i32.const 45
          local.set 28
          local.get 4
          local.get 28
          i32.store offset=4
          br 2 (;@1;)
        end
        i32.const 1050349
        local.set 29
        local.get 4
        local.get 29
        i32.store
        i32.const 48
        local.set 30
        local.get 4
        local.get 30
        i32.store offset=4
        br 1 (;@1;)
      end
      i32.const 1050248
      local.set 31
      local.get 4
      local.get 31
      i32.store
      i32.const 101
      local.set 32
      local.get 4
      local.get 32
      i32.store offset=4
    end
    local.get 4
    i32.load
    local.set 33
    local.get 4
    i32.load offset=4
    local.set 34
    local.get 0
    local.get 34
    i32.store offset=4
    local.get 0
    local.get 33
    i32.store
    return
  )
  (func $_ZN62_$LT$getrandom..error..Error$u20$as$u20$core..fmt..Display$GT$3fmt17hdccdbaf0f53358fbE (;114;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 304
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=280
    local.get 4
    local.get 1
    i32.store offset=284
    local.get 0
    i32.load
    local.set 5
    i32.const 32
    local.set 6
    local.get 4
    local.get 6
    i32.add
    local.set 7
    local.get 7
    local.get 5
    call $_ZN9getrandom5error5Error12raw_os_error17h57ec8e7991df1d87E
    local.get 4
    i32.load offset=32
    local.set 8
    local.get 4
    i32.load offset=36
    local.set 9
    local.get 4
    local.get 9
    i32.store offset=52
    local.get 4
    local.get 8
    i32.store offset=48
    local.get 4
    i32.load offset=48
    local.set 10
    i32.const 1
    local.set 11
    local.get 10
    local.set 12
    local.get 11
    local.set 13
    local.get 12
    local.get 13
    i32.eq
    local.set 14
    i32.const 1
    local.set 15
    local.get 14
    local.get 15
    i32.and
    local.set 16
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 16
            i32.eqz
            br_if 0 (;@4;)
            local.get 4
            i32.load offset=52
            local.set 17
            local.get 4
            local.get 17
            i32.store offset=60
            i32.const 128
            local.set 18
            i32.const 0
            local.set 19
            i32.const 64
            local.set 20
            local.get 4
            local.get 20
            i32.add
            local.set 21
            local.get 21
            local.get 19
            local.get 18
            call $memset
            drop
            local.get 4
            i32.load offset=60
            local.set 22
            i32.const 8
            local.set 23
            local.get 4
            local.get 23
            i32.add
            local.set 24
            i32.const 64
            local.set 25
            local.get 4
            local.get 25
            i32.add
            local.set 26
            local.get 24
            local.get 22
            local.get 26
            local.get 18
            call $_ZN9getrandom5error6os_err17hb31931f57f318b3aE
            local.get 4
            i32.load offset=8
            local.set 27
            local.get 4
            i32.load offset=12
            local.set 28
            local.get 4
            local.get 28
            i32.store offset=196
            local.get 4
            local.get 27
            i32.store offset=192
            local.get 4
            i32.load offset=192
            local.set 29
            i32.const 0
            local.set 30
            i32.const 1
            local.set 31
            local.get 31
            local.get 30
            local.get 29
            select
            local.set 32
            local.get 32
            i32.eqz
            br_if 1 (;@3;)
            br 2 (;@2;)
          end
          local.get 0
          i32.load
          local.set 33
          i32.const 24
          local.set 34
          local.get 4
          local.get 34
          i32.add
          local.set 35
          local.get 35
          local.get 33
          call $_ZN9getrandom5error13internal_desc17h8799b0c6b5e5065cE
          local.get 4
          i32.load offset=24
          local.set 36
          local.get 4
          i32.load offset=28
          local.set 37
          local.get 4
          local.get 37
          i32.store offset=236
          local.get 4
          local.get 36
          i32.store offset=232
          local.get 4
          i32.load offset=232
          local.set 38
          i32.const 0
          local.set 39
          i32.const 1
          local.set 40
          local.get 40
          local.get 39
          local.get 38
          select
          local.set 41
          i32.const 1
          local.set 42
          local.get 41
          local.set 43
          local.get 42
          local.set 44
          local.get 43
          local.get 44
          i32.eq
          local.set 45
          i32.const 1
          local.set 46
          local.get 45
          local.get 46
          i32.and
          local.set 47
          block ;; label = @4
            local.get 47
            i32.eqz
            br_if 0 (;@4;)
            local.get 4
            i32.load offset=232
            local.set 48
            local.get 4
            i32.load offset=236
            local.set 49
            local.get 4
            local.get 48
            i32.store offset=288
            local.get 4
            local.get 49
            i32.store offset=292
            local.get 1
            local.get 48
            local.get 49
            call $_ZN4core3fmt9Formatter9write_str17h556030d2063bd0caE
            local.set 50
            i32.const 1
            local.set 51
            local.get 50
            local.get 51
            i32.and
            local.set 52
            local.get 4
            local.get 52
            i32.store8 offset=47
            br 3 (;@1;)
          end
          local.get 0
          i32.load
          local.set 53
          local.get 53
          call $_ZN4core3num7nonzero10NonZeroU323get17h157dc061692fd355E
          local.set 54
          local.get 4
          local.get 54
          i32.store offset=276
          i32.const 16
          local.set 55
          local.get 4
          local.get 55
          i32.add
          local.set 56
          i32.const 276
          local.set 57
          local.get 4
          local.get 57
          i32.add
          local.set 58
          local.get 56
          local.get 58
          call $_ZN4core3fmt10ArgumentV111new_display17h44794ecd0007fd7aE
          local.get 4
          i32.load offset=20
          local.set 59
          local.get 4
          i32.load offset=16
          local.set 60
          local.get 4
          local.get 60
          i32.store offset=264
          local.get 4
          local.get 59
          i32.store offset=268
          i32.const 240
          local.set 61
          local.get 4
          local.get 61
          i32.add
          local.set 62
          local.get 62
          local.set 63
          i32.const 1050220
          local.set 64
          i32.const 1
          local.set 65
          i32.const 264
          local.set 66
          local.get 4
          local.get 66
          i32.add
          local.set 67
          local.get 67
          local.set 68
          local.get 63
          local.get 64
          local.get 65
          local.get 68
          local.get 65
          call $_ZN4core3fmt9Arguments6new_v117hf05d13fa57bf4cf4E
          i32.const 240
          local.set 69
          local.get 4
          local.get 69
          i32.add
          local.set 70
          local.get 70
          local.set 71
          local.get 1
          local.get 71
          call $_ZN4core3fmt9Formatter9write_fmt17hdae39eebc223cfffE
          local.set 72
          i32.const 1
          local.set 73
          local.get 72
          local.get 73
          i32.and
          local.set 74
          local.get 4
          local.get 74
          i32.store8 offset=47
          br 2 (;@1;)
        end
        i32.const 60
        local.set 75
        local.get 4
        local.get 75
        i32.add
        local.set 76
        local.get 4
        local.get 76
        call $_ZN4core3fmt10ArgumentV111new_display17h18c5892993bfd8dcE
        local.get 4
        i32.load offset=4
        local.set 77
        local.get 4
        i32.load
        local.set 78
        local.get 4
        local.get 78
        i32.store offset=224
        local.get 4
        local.get 77
        i32.store offset=228
        i32.const 200
        local.set 79
        local.get 4
        local.get 79
        i32.add
        local.set 80
        local.get 80
        local.set 81
        i32.const 1050240
        local.set 82
        i32.const 1
        local.set 83
        i32.const 224
        local.set 84
        local.get 4
        local.get 84
        i32.add
        local.set 85
        local.get 85
        local.set 86
        local.get 81
        local.get 82
        local.get 83
        local.get 86
        local.get 83
        call $_ZN4core3fmt9Arguments6new_v117hf05d13fa57bf4cf4E
        i32.const 200
        local.set 87
        local.get 4
        local.get 87
        i32.add
        local.set 88
        local.get 88
        local.set 89
        local.get 1
        local.get 89
        call $_ZN4core3fmt9Formatter9write_fmt17hdae39eebc223cfffE
        local.set 90
        i32.const 1
        local.set 91
        local.get 90
        local.get 91
        i32.and
        local.set 92
        local.get 4
        local.get 92
        i32.store8 offset=47
        br 1 (;@1;)
      end
      local.get 4
      i32.load offset=192
      local.set 93
      local.get 4
      i32.load offset=196
      local.set 94
      local.get 4
      local.get 93
      i32.store offset=296
      local.get 4
      local.get 94
      i32.store offset=300
      local.get 93
      local.get 94
      local.get 1
      call $_ZN42_$LT$str$u20$as$u20$core..fmt..Display$GT$3fmt17hcd33a3726c86db1aE
      local.set 95
      i32.const 1
      local.set 96
      local.get 95
      local.get 96
      i32.and
      local.set 97
      local.get 4
      local.get 97
      i32.store8 offset=47
    end
    local.get 4
    i32.load8_u offset=47
    local.set 98
    i32.const 1
    local.set 99
    local.get 98
    local.get 99
    i32.and
    local.set 100
    i32.const 304
    local.set 101
    local.get 4
    local.get 101
    i32.add
    local.set 102
    local.get 102
    global.set $__stack_pointer
    local.get 100
    return
  )
  (func $_ZN101_$LT$getrandom..error..Error$u20$as$u20$core..convert..From$LT$core..num..nonzero..NonZeroU32$GT$$GT$4from17h30508099485bba26E (;115;) (type 9) (param i32) (result i32)
    (local i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 3
    local.get 0
    i32.store offset=8
    local.get 3
    i32.load offset=8
    local.set 4
    local.get 4
    return
  )
  (func $_ZN4wasi13lib_generated5Errno3raw17h3be5ef89c4f9e467E (;116;) (type 9) (param i32) (result i32)
    (local i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    local.get 0
    i32.store offset=12
    local.get 0
    i32.load16_u
    local.set 4
    local.get 4
    return
  )
  (func $_ZN4wasi13lib_generated10random_get17hde77a9f55043326bE (;117;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 32
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store offset=20
    local.get 5
    local.get 2
    i32.store offset=24
    local.get 1
    local.get 2
    call $_ZN4wasi13lib_generated22wasi_snapshot_preview110random_get17h5d1cc52b36ce0bd1E
    local.set 6
    local.get 5
    local.get 6
    i32.store offset=28
    block ;; label = @1
      block ;; label = @2
        local.get 6
        br_if 0 (;@2;)
        i32.const 0
        local.set 7
        local.get 5
        local.get 7
        i32.store16 offset=8
        br 1 (;@1;)
      end
      local.get 5
      local.get 6
      i32.store16 offset=18
      local.get 5
      i32.load16_u offset=18
      local.set 8
      local.get 5
      local.get 8
      i32.store16 offset=10
      i32.const 1
      local.set 9
      local.get 5
      local.get 9
      i32.store16 offset=8
    end
    local.get 5
    i32.load16_u offset=8
    local.set 10
    local.get 5
    i32.load16_u offset=10
    local.set 11
    local.get 0
    local.get 11
    i32.store16 offset=2
    local.get 0
    local.get 10
    i32.store16
    i32.const 32
    local.set 12
    local.get 5
    local.get 12
    i32.add
    local.set 13
    local.get 13
    global.set $__stack_pointer
    return
  )
  (func $_ZN4core5alloc6layout6Layout25from_size_align_unchecked17hf948fc835c4a5e58E (;118;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 32
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    local.get 1
    i32.store offset=20
    local.get 5
    local.get 2
    i32.store offset=24
    local.get 5
    local.get 2
    i32.store offset=28
    local.get 5
    i32.load offset=28
    local.set 6
    local.get 5
    local.get 1
    i32.store offset=8
    local.get 5
    local.get 6
    i32.store offset=12
    local.get 5
    i32.load offset=8
    local.set 7
    local.get 5
    i32.load offset=12
    local.set 8
    local.get 0
    local.get 8
    i32.store offset=4
    local.get 0
    local.get 7
    i32.store
    return
  )
  (func $_ZN5alloc5alloc5alloc17hb676a09e26a85d2eE (;119;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 32
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=8
    local.get 4
    local.get 1
    i32.store offset=12
    i32.const 8
    local.set 5
    local.get 4
    local.get 5
    i32.add
    local.set 6
    local.get 6
    local.set 7
    local.get 4
    local.get 7
    i32.store offset=20
    local.get 4
    i32.load offset=8
    local.set 8
    i32.const 8
    local.set 9
    local.get 4
    local.get 9
    i32.add
    local.set 10
    local.get 10
    local.set 11
    local.get 4
    local.get 11
    i32.store offset=24
    local.get 4
    i32.load offset=12
    local.set 12
    local.get 4
    local.get 12
    i32.store offset=28
    local.get 4
    local.get 12
    i32.store offset=16
    local.get 4
    i32.load offset=16
    local.set 13
    local.get 8
    local.get 13
    call $__rust_alloc
    local.set 14
    i32.const 32
    local.set 15
    local.get 4
    local.get 15
    i32.add
    local.set 16
    local.get 16
    global.set $__stack_pointer
    local.get 14
    return
  )
  (func $_ZN5alloc5alloc7dealloc17hda988eba43c4bb72E (;120;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 32
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store
    local.get 5
    local.get 2
    i32.store offset=4
    local.get 5
    local.get 0
    i32.store offset=16
    local.get 5
    local.set 6
    local.get 5
    local.get 6
    i32.store offset=20
    local.get 5
    i32.load
    local.set 7
    local.get 5
    local.set 8
    local.get 5
    local.get 8
    i32.store offset=24
    local.get 5
    i32.load offset=4
    local.set 9
    local.get 5
    local.get 9
    i32.store offset=28
    local.get 5
    local.get 9
    i32.store offset=12
    local.get 5
    i32.load offset=12
    local.set 10
    local.get 0
    local.get 7
    local.get 10
    call $__rust_dealloc
    i32.const 32
    local.set 11
    local.get 5
    local.get 11
    i32.add
    local.set 12
    local.get 12
    global.set $__stack_pointer
    return
  )
  (func $_ZN5alloc5alloc7realloc17hd8f7fe00eb5d18e9E (;121;) (type 6) (param i32 i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 32
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    global.set $__stack_pointer
    local.get 6
    local.get 1
    i32.store
    local.get 6
    local.get 2
    i32.store offset=4
    local.get 6
    local.get 0
    i32.store offset=12
    local.get 6
    local.get 3
    i32.store offset=16
    local.get 6
    local.set 7
    local.get 6
    local.get 7
    i32.store offset=20
    local.get 6
    i32.load
    local.set 8
    local.get 6
    local.set 9
    local.get 6
    local.get 9
    i32.store offset=24
    local.get 6
    i32.load offset=4
    local.set 10
    local.get 6
    local.get 10
    i32.store offset=28
    local.get 6
    local.get 10
    i32.store offset=8
    local.get 6
    i32.load offset=8
    local.set 11
    local.get 0
    local.get 8
    local.get 11
    local.get 3
    call $__rust_realloc
    local.set 12
    i32.const 32
    local.set 13
    local.get 6
    local.get 13
    i32.add
    local.set 14
    local.get 14
    global.set $__stack_pointer
    local.get 12
    return
  )
  (func $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..Debug$u20$for$u20$usize$GT$3fmt17h6bd905cf9b1e1a64E (;122;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=8
    local.get 4
    local.get 1
    i32.store offset=12
    local.get 1
    call $_ZN4core3fmt9Formatter15debug_lower_hex17hb31a3ef71c81bc79E
    local.set 5
    i32.const 1
    local.set 6
    local.get 5
    local.get 6
    i32.and
    local.set 7
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              local.get 7
              br_if 0 (;@5;)
              local.get 1
              call $_ZN4core3fmt9Formatter15debug_upper_hex17h505100e6817602a1E
              local.set 8
              i32.const 1
              local.set 9
              local.get 8
              local.get 9
              i32.and
              local.set 10
              local.get 10
              br_if 2 (;@3;)
              br 1 (;@4;)
            end
            local.get 0
            local.get 1
            call $_ZN4core3fmt3num53_$LT$impl$u20$core..fmt..LowerHex$u20$for$u20$i32$GT$3fmt17h9059b66bffaf1ac2E
            local.set 11
            i32.const 1
            local.set 12
            local.get 11
            local.get 12
            i32.and
            local.set 13
            local.get 4
            local.get 13
            i32.store8 offset=7
            br 3 (;@1;)
          end
          local.get 0
          local.get 1
          call $_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$u32$GT$3fmt17hca64045c3402134cE
          local.set 14
          i32.const 1
          local.set 15
          local.get 14
          local.get 15
          i32.and
          local.set 16
          local.get 4
          local.get 16
          i32.store8 offset=7
          br 1 (;@2;)
        end
        local.get 0
        local.get 1
        call $_ZN4core3fmt3num53_$LT$impl$u20$core..fmt..UpperHex$u20$for$u20$i32$GT$3fmt17h80cdb4a5bd8baacaE
        local.set 17
        i32.const 1
        local.set 18
        local.get 17
        local.get 18
        i32.and
        local.set 19
        local.get 4
        local.get 19
        i32.store8 offset=7
      end
    end
    local.get 4
    i32.load8_u offset=7
    local.set 20
    i32.const 1
    local.set 21
    local.get 20
    local.get 21
    i32.and
    local.set 22
    i32.const 16
    local.set 23
    local.get 4
    local.get 23
    i32.add
    local.set 24
    local.get 24
    global.set $__stack_pointer
    local.get 22
    return
  )
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h76ab5160729e5d61E (;123;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 2
    i32.const 16
    local.set 3
    local.get 2
    local.get 3
    i32.sub
    local.set 4
    local.get 4
    global.set $__stack_pointer
    local.get 4
    local.get 0
    i32.store offset=8
    local.get 4
    local.get 1
    i32.store offset=12
    local.get 0
    i32.load
    local.set 5
    local.get 5
    local.get 1
    call $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..Debug$u20$for$u20$usize$GT$3fmt17h6bd905cf9b1e1a64E
    local.set 6
    i32.const 1
    local.set 7
    local.get 6
    local.get 7
    i32.and
    local.set 8
    i32.const 16
    local.set 9
    local.get 4
    local.get 9
    i32.add
    local.set 10
    local.get 10
    global.set $__stack_pointer
    local.get 8
    return
  )
  (func $_ZN4core3fmt9Arguments6new_v117hba8594d11dc4ebdaE (;124;) (type 10) (param i32 i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 5
    i32.const 64
    local.set 6
    local.get 5
    local.get 6
    i32.sub
    local.set 7
    local.get 7
    global.set $__stack_pointer
    local.get 7
    local.get 1
    i32.store offset=48
    local.get 7
    local.get 2
    i32.store offset=52
    local.get 7
    local.get 3
    i32.store offset=56
    local.get 7
    local.get 4
    i32.store offset=60
    local.get 2
    local.set 8
    local.get 4
    local.set 9
    local.get 8
    local.get 9
    i32.lt_u
    local.set 10
    i32.const 1
    local.set 11
    local.get 10
    local.get 11
    i32.and
    local.set 12
    block ;; label = @1
      block ;; label = @2
        local.get 12
        br_if 0 (;@2;)
        i32.const 1
        local.set 13
        local.get 4
        local.get 13
        i32.add
        local.set 14
        local.get 2
        local.set 15
        local.get 14
        local.set 16
        local.get 15
        local.get 16
        i32.gt_u
        local.set 17
        i32.const 1
        local.set 18
        local.get 17
        local.get 18
        i32.and
        local.set 19
        local.get 7
        local.get 19
        i32.store8 offset=15
        br 1 (;@1;)
      end
      i32.const 1
      local.set 20
      local.get 7
      local.get 20
      i32.store8 offset=15
    end
    local.get 7
    i32.load8_u offset=15
    local.set 21
    i32.const 1
    local.set 22
    local.get 21
    local.get 22
    i32.and
    local.set 23
    block ;; label = @1
      local.get 23
      br_if 0 (;@1;)
      i32.const 0
      local.set 24
      local.get 7
      local.get 24
      i32.store offset=40
      local.get 0
      local.get 1
      i32.store offset=8
      local.get 0
      local.get 2
      i32.store offset=12
      local.get 7
      i32.load offset=40
      local.set 25
      local.get 7
      i32.load offset=44
      local.set 26
      local.get 0
      local.get 25
      i32.store
      local.get 0
      local.get 26
      i32.store offset=4
      local.get 0
      local.get 3
      i32.store offset=16
      local.get 0
      local.get 4
      i32.store offset=20
      i32.const 64
      local.set 27
      local.get 7
      local.get 27
      i32.add
      local.set 28
      local.get 28
      global.set $__stack_pointer
      return
    end
    i32.const 16
    local.set 29
    local.get 7
    local.get 29
    i32.add
    local.set 30
    local.get 30
    local.set 31
    i32.const 1050832
    local.set 32
    i32.const 1
    local.set 33
    i32.const 1050840
    local.set 34
    i32.const 0
    local.set 35
    local.get 31
    local.get 32
    local.get 33
    local.get 34
    local.get 35
    call $_ZN4core3fmt9Arguments6new_v117hba8594d11dc4ebdaE
    i32.const 16
    local.set 36
    local.get 7
    local.get 36
    i32.add
    local.set 37
    local.get 37
    local.set 38
    i32.const 1050916
    local.set 39
    local.get 38
    local.get 39
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN4core3ptr30drop_in_place$LT$$RF$usize$GT$17haf5756b469e6b041E (;125;) (type $.rodata) (param i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    local.get 0
    i32.store offset=12
    return
  )
  (func $_ZN4core9panicking13assert_failed17h90c8d41db42c7e2cE (;126;) (type 10) (param i32 i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i64 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 5
    i32.const 48
    local.set 6
    local.get 5
    local.get 6
    i32.sub
    local.set 7
    local.get 7
    global.set $__stack_pointer
    local.get 7
    local.get 1
    i32.store offset=12
    local.get 7
    local.get 2
    i32.store offset=16
    local.get 7
    local.get 0
    i32.store8 offset=23
    i32.const 16
    local.set 8
    local.get 3
    local.get 8
    i32.add
    local.set 9
    local.get 9
    i64.load align=4
    local.set 10
    i32.const 24
    local.set 11
    local.get 7
    local.get 11
    i32.add
    local.set 12
    local.get 12
    local.get 8
    i32.add
    local.set 13
    local.get 13
    local.get 10
    i64.store
    i32.const 8
    local.set 14
    local.get 3
    local.get 14
    i32.add
    local.set 15
    local.get 15
    i64.load align=4
    local.set 16
    i32.const 24
    local.set 17
    local.get 7
    local.get 17
    i32.add
    local.set 18
    local.get 18
    local.get 14
    i32.add
    local.set 19
    local.get 19
    local.get 16
    i64.store
    local.get 3
    i64.load align=4
    local.set 20
    local.get 7
    local.get 20
    i64.store offset=24
    i32.const 12
    local.set 21
    local.get 7
    local.get 21
    i32.add
    local.set 22
    local.get 22
    local.set 23
    i32.const 1050932
    local.set 24
    i32.const 16
    local.set 25
    local.get 7
    local.get 25
    i32.add
    local.set 26
    local.get 26
    local.set 27
    i32.const 24
    local.set 28
    local.get 7
    local.get 28
    i32.add
    local.set 29
    local.get 29
    local.set 30
    local.get 0
    local.get 23
    local.get 24
    local.get 27
    local.get 24
    local.get 30
    local.get 4
    call $_ZN4core9panicking19assert_failed_inner17hf30758b978d1cad1E
    unreachable
  )
  (func $_ZN4core3ptr7mut_ptr31_$LT$impl$u20$$BP$mut$u20$T$GT$7is_null17h194254030d14c503E (;127;) (type 9) (param i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 1
    i32.const 16
    local.set 2
    local.get 1
    local.get 2
    i32.sub
    local.set 3
    local.get 3
    local.get 0
    i32.store offset=4
    local.get 3
    local.get 0
    i32.store
    local.get 3
    i32.load
    local.set 4
    local.get 3
    local.get 4
    i32.store offset=8
    local.get 3
    local.get 4
    i32.store offset=12
    local.get 3
    i32.load offset=12
    local.set 5
    i32.const 0
    local.set 6
    local.get 5
    local.set 7
    local.get 6
    local.set 8
    local.get 7
    local.get 8
    i32.eq
    local.set 9
    i32.const 1
    local.set 10
    local.get 9
    local.get 10
    i32.and
    local.set 11
    local.get 11
    return
  )
  (func $_ZN11wit_bindgen2rt14run_ctors_once17h8b1b51fd1fc366e5E (;128;) (type 7)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    i32.const 0
    local.set 0
    local.get 0
    i32.load8_u offset=1054828
    local.set 1
    i32.const -1
    local.set 2
    local.get 1
    local.get 2
    i32.xor
    local.set 3
    i32.const 1
    local.set 4
    local.get 3
    local.get 4
    i32.and
    local.set 5
    block ;; label = @1
      local.get 5
      i32.eqz
      br_if 0 (;@1;)
      call $__wasm_call_ctors
      i32.const 1
      local.set 6
      i32.const 0
      local.set 7
      local.get 7
      local.get 6
      i32.store8 offset=1054828
    end
    return
  )
  (func $cabi_realloc (;129;) (type 6) (param i32 i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i32 i32 i32 i32 i32 i32 i32 i64 i64 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 4
    i32.const 128
    local.set 5
    local.get 4
    local.get 5
    i32.sub
    local.set 6
    local.get 6
    global.set $__stack_pointer
    local.get 6
    local.get 3
    i32.store offset=24
    local.get 6
    local.get 0
    i32.store offset=104
    local.get 6
    local.get 1
    i32.store offset=108
    local.get 6
    local.get 2
    i32.store offset=112
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              local.get 1
              br_if 0 (;@5;)
              local.get 6
              i32.load offset=24
              local.set 7
              local.get 7
              i32.eqz
              br_if 1 (;@4;)
              br 2 (;@3;)
            end
            i32.const 24
            local.set 8
            local.get 6
            local.get 8
            i32.add
            local.set 9
            local.get 9
            local.set 10
            local.get 6
            local.get 10
            i32.store offset=48
            i32.const 1050948
            local.set 11
            local.get 6
            local.get 11
            i32.store offset=52
            local.get 6
            i32.load offset=48
            local.set 12
            local.get 6
            local.get 12
            i32.store offset=116
            local.get 6
            i32.load offset=52
            local.set 13
            local.get 6
            local.get 13
            i32.store offset=120
            local.get 12
            i32.load
            local.set 14
            block ;; label = @5
              local.get 14
              i32.eqz
              br_if 0 (;@5;)
              i32.const 16
              local.set 15
              local.get 6
              local.get 15
              i32.add
              local.set 16
              local.get 16
              local.get 1
              local.get 2
              call $_ZN4core5alloc6layout6Layout25from_size_align_unchecked17hf948fc835c4a5e58E
              local.get 6
              i32.load offset=20
              local.set 17
              local.get 6
              i32.load offset=16
              local.set 18
              local.get 6
              local.get 18
              i32.store offset=32
              local.get 6
              local.get 17
              i32.store offset=36
              local.get 6
              i32.load offset=32
              local.set 19
              local.get 6
              i32.load offset=36
              local.set 20
              local.get 6
              i32.load offset=24
              local.set 21
              local.get 0
              local.get 19
              local.get 20
              local.get 21
              call $_ZN5alloc5alloc7realloc17hd8f7fe00eb5d18e9E
              local.set 22
              local.get 6
              local.get 22
              i32.store offset=44
              br 3 (;@2;)
            end
            i32.const 1
            local.set 23
            local.get 6
            local.get 23
            i32.store8 offset=127
            i32.const 80
            local.set 24
            local.get 6
            local.get 24
            i32.add
            local.set 25
            local.get 25
            local.set 26
            i32.const 1050996
            local.set 27
            i32.const 1
            local.set 28
            i32.const 1051004
            local.set 29
            i32.const 0
            local.set 30
            local.get 26
            local.get 27
            local.get 28
            local.get 29
            local.get 30
            call $_ZN4core3fmt9Arguments6new_v117hba8594d11dc4ebdaE
            i32.const 16
            local.set 31
            i32.const 56
            local.set 32
            local.get 6
            local.get 32
            i32.add
            local.set 33
            local.get 33
            local.get 31
            i32.add
            local.set 34
            i32.const 80
            local.set 35
            local.get 6
            local.get 35
            i32.add
            local.set 36
            local.get 36
            local.get 31
            i32.add
            local.set 37
            local.get 37
            i64.load
            local.set 38
            local.get 34
            local.get 38
            i64.store
            i32.const 8
            local.set 39
            i32.const 56
            local.set 40
            local.get 6
            local.get 40
            i32.add
            local.set 41
            local.get 41
            local.get 39
            i32.add
            local.set 42
            i32.const 80
            local.set 43
            local.get 6
            local.get 43
            i32.add
            local.set 44
            local.get 44
            local.get 39
            i32.add
            local.set 45
            local.get 45
            i64.load
            local.set 46
            local.get 42
            local.get 46
            i64.store
            local.get 6
            i64.load offset=80
            local.set 47
            local.get 6
            local.get 47
            i64.store offset=56
            i32.const 1
            local.set 48
            i32.const 56
            local.set 49
            local.get 6
            local.get 49
            i32.add
            local.set 50
            local.get 50
            local.set 51
            i32.const 1051096
            local.set 52
            local.get 48
            local.get 12
            local.get 13
            local.get 51
            local.get 52
            call $_ZN4core9panicking13assert_failed17h90c8d41db42c7e2cE
            unreachable
          end
          local.get 6
          local.get 2
          i32.store offset=28
          br 2 (;@1;)
        end
        local.get 6
        i32.load offset=24
        local.set 53
        i32.const 8
        local.set 54
        local.get 6
        local.get 54
        i32.add
        local.set 55
        local.get 55
        local.get 53
        local.get 2
        call $_ZN4core5alloc6layout6Layout25from_size_align_unchecked17hf948fc835c4a5e58E
        local.get 6
        i32.load offset=12
        local.set 56
        local.get 6
        i32.load offset=8
        local.set 57
        local.get 6
        local.get 57
        i32.store offset=32
        local.get 6
        local.get 56
        i32.store offset=36
        local.get 6
        i32.load offset=32
        local.set 58
        local.get 6
        i32.load offset=36
        local.set 59
        local.get 58
        local.get 59
        call $_ZN5alloc5alloc5alloc17hb676a09e26a85d2eE
        local.set 60
        local.get 6
        local.get 60
        i32.store offset=44
      end
      local.get 6
      i32.load offset=44
      local.set 61
      local.get 61
      call $_ZN4core3ptr7mut_ptr31_$LT$impl$u20$$BP$mut$u20$T$GT$7is_null17h194254030d14c503E
      local.set 62
      i32.const 1
      local.set 63
      local.get 62
      local.get 63
      i32.and
      local.set 64
      block ;; label = @2
        local.get 64
        br_if 0 (;@2;)
        local.get 6
        i32.load offset=44
        local.set 65
        local.get 6
        local.get 65
        i32.store offset=28
        br 1 (;@1;)
      end
      local.get 6
      i32.load offset=32
      local.set 66
      local.get 6
      i32.load offset=36
      local.set 67
      local.get 66
      local.get 67
      call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
      unreachable
    end
    local.get 6
    i32.load offset=28
    local.set 68
    i32.const 128
    local.set 69
    local.get 6
    local.get 69
    i32.add
    local.set 70
    local.get 70
    global.set $__stack_pointer
    local.get 68
    return
  )
  (func $_ZN11wit_bindgen2rt7dealloc17h92de99bf5237c3c5E (;130;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    local.set 3
    i32.const 32
    local.set 4
    local.get 3
    local.get 4
    i32.sub
    local.set 5
    local.get 5
    global.set $__stack_pointer
    local.get 5
    local.get 0
    i32.store offset=12
    local.get 5
    local.get 1
    i32.store offset=16
    local.get 5
    local.get 2
    i32.store offset=20
    block ;; label = @1
      local.get 1
      i32.eqz
      br_if 0 (;@1;)
      local.get 5
      local.get 1
      local.get 2
      call $_ZN4core5alloc6layout6Layout25from_size_align_unchecked17hf948fc835c4a5e58E
      local.get 5
      i32.load offset=4
      local.set 6
      local.get 5
      i32.load
      local.set 7
      local.get 5
      local.get 7
      i32.store offset=24
      local.get 5
      local.get 6
      i32.store offset=28
      local.get 0
      local.get 7
      local.get 6
      call $_ZN5alloc5alloc7dealloc17hda988eba43c4bb72E
    end
    i32.const 32
    local.set 8
    local.get 5
    local.get 8
    i32.add
    local.set 9
    local.get 9
    global.set $__stack_pointer
    return
  )
  (func $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17h176cc91ce5e817f1E (;131;) (type $.data) (param i32) (result i64)
    i64.const -816388632080319500
  )
  (func $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17hbcf83b65e788092eE (;132;) (type $.data) (param i32) (result i64)
    i64.const 6963515535637561570
  )
  (func $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17hcff55bed44912628E (;133;) (type $.data) (param i32) (result i64)
    i64.const -8527728395957036344
  )
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17had3a23ed2b0f9a78E (;134;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i32.load
    local.get 1
    call $_ZN43_$LT$bool$u20$as$u20$core..fmt..Display$GT$3fmt17h3687ae6db1632d84E
  )
  (func $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17h553f113e10db4e4dE (;135;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i32.load
    local.get 0
    i32.load offset=4
    local.get 1
    call $_ZN42_$LT$str$u20$as$u20$core..fmt..Display$GT$3fmt17hcd33a3726c86db1aE
  )
  (func $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17h9f91f4a02f7722e6E (;136;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i32.load
    local.get 1
    call $_ZN70_$LT$core..panic..location..Location$u20$as$u20$core..fmt..Display$GT$3fmt17h9c3dd31b52e6f54eE
  )
  (func $_ZN4core3fmt5Write10write_char17haa46f9e30bca77f3E (;137;) (type 5) (param i32 i32) (result i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    i32.const 0
    i32.store offset=12
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.const 128
        i32.lt_u
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 1
          i32.const 2048
          i32.lt_u
          br_if 0 (;@3;)
          block ;; label = @4
            local.get 1
            i32.const 65536
            i32.lt_u
            br_if 0 (;@4;)
            local.get 2
            local.get 1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=15
            local.get 2
            local.get 1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=14
            local.get 2
            local.get 1
            i32.const 12
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            local.get 2
            local.get 1
            i32.const 18
            i32.shr_u
            i32.const 7
            i32.and
            i32.const 240
            i32.or
            i32.store8 offset=12
            i32.const 4
            local.set 3
            br 3 (;@1;)
          end
          local.get 2
          local.get 1
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=14
          local.get 2
          local.get 1
          i32.const 12
          i32.shr_u
          i32.const 224
          i32.or
          i32.store8 offset=12
          local.get 2
          local.get 1
          i32.const 6
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=13
          i32.const 3
          local.set 3
          br 2 (;@1;)
        end
        local.get 2
        local.get 1
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=13
        local.get 2
        local.get 1
        i32.const 6
        i32.shr_u
        i32.const 192
        i32.or
        i32.store8 offset=12
        i32.const 2
        local.set 3
        br 1 (;@1;)
      end
      local.get 2
      local.get 1
      i32.store8 offset=12
      i32.const 1
      local.set 3
    end
    block ;; label = @1
      local.get 0
      i32.load offset=8
      local.tee 1
      i32.load
      local.get 1
      i32.load offset=8
      local.tee 0
      i32.sub
      local.get 3
      i32.ge_u
      br_if 0 (;@1;)
      local.get 1
      local.get 0
      local.get 3
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE
      local.get 1
      i32.load offset=8
      local.set 0
    end
    local.get 1
    i32.load offset=4
    local.get 0
    i32.add
    local.get 2
    i32.const 12
    i32.add
    local.get 3
    call $memcpy
    drop
    local.get 1
    local.get 0
    local.get 3
    i32.add
    i32.store offset=8
    local.get 2
    i32.const 16
    i32.add
    global.set $__stack_pointer
    i32.const 0
  )
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE (;138;) (type 2) (param i32 i32 i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 1
        local.get 2
        i32.add
        local.tee 2
        local.get 1
        i32.lt_u
        br_if 0 (;@2;)
        local.get 0
        i32.load
        local.tee 1
        i32.const 1
        i32.shl
        local.tee 4
        local.get 2
        local.get 4
        local.get 2
        i32.gt_u
        select
        local.tee 2
        i32.const 8
        local.get 2
        i32.const 8
        i32.gt_u
        select
        local.tee 2
        i32.const -1
        i32.xor
        i32.const 31
        i32.shr_u
        local.set 4
        block ;; label = @3
          block ;; label = @4
            local.get 1
            i32.eqz
            br_if 0 (;@4;)
            local.get 3
            i32.const 1
            i32.store offset=24
            local.get 3
            local.get 1
            i32.store offset=20
            local.get 3
            local.get 0
            i32.const 4
            i32.add
            i32.load
            i32.store offset=16
            br 1 (;@3;)
          end
          local.get 3
          i32.const 0
          i32.store offset=24
        end
        local.get 3
        local.get 2
        local.get 4
        local.get 3
        i32.const 16
        i32.add
        call $_ZN5alloc7raw_vec11finish_grow17h28a077458d86de3bE
        local.get 3
        i32.load offset=4
        local.set 1
        block ;; label = @3
          local.get 3
          i32.load
          br_if 0 (;@3;)
          local.get 0
          local.get 2
          i32.store
          local.get 0
          local.get 1
          i32.store offset=4
          br 2 (;@1;)
        end
        local.get 3
        i32.const 8
        i32.add
        i32.load
        local.tee 0
        i32.const -2147483647
        i32.eq
        br_if 1 (;@1;)
        local.get 0
        i32.eqz
        br_if 0 (;@2;)
        local.get 1
        local.get 0
        call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
        unreachable
      end
      call $_ZN5alloc7raw_vec17capacity_overflow17h38ac120e37f2568fE
      unreachable
    end
    local.get 3
    i32.const 32
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN4core3fmt5Write10write_char17hb36c4fc26ddebae1E (;139;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    i32.const 0
    i32.store offset=12
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.const 128
        i32.lt_u
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 1
          i32.const 2048
          i32.lt_u
          br_if 0 (;@3;)
          block ;; label = @4
            local.get 1
            i32.const 65536
            i32.lt_u
            br_if 0 (;@4;)
            local.get 2
            local.get 1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=15
            local.get 2
            local.get 1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=14
            local.get 2
            local.get 1
            i32.const 12
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            local.get 2
            local.get 1
            i32.const 18
            i32.shr_u
            i32.const 7
            i32.and
            i32.const 240
            i32.or
            i32.store8 offset=12
            i32.const 4
            local.set 1
            br 3 (;@1;)
          end
          local.get 2
          local.get 1
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=14
          local.get 2
          local.get 1
          i32.const 12
          i32.shr_u
          i32.const 224
          i32.or
          i32.store8 offset=12
          local.get 2
          local.get 1
          i32.const 6
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=13
          i32.const 3
          local.set 1
          br 2 (;@1;)
        end
        local.get 2
        local.get 1
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=13
        local.get 2
        local.get 1
        i32.const 6
        i32.shr_u
        i32.const 192
        i32.or
        i32.store8 offset=12
        i32.const 2
        local.set 1
        br 1 (;@1;)
      end
      local.get 2
      local.get 1
      i32.store8 offset=12
      i32.const 1
      local.set 1
    end
    local.get 0
    local.get 2
    i32.const 12
    i32.add
    local.get 1
    call $_ZN80_$LT$std..io..Write..write_fmt..Adapter$LT$T$GT$$u20$as$u20$core..fmt..Write$GT$9write_str17h1468756d66c20292E
    local.set 1
    local.get 2
    i32.const 16
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN80_$LT$std..io..Write..write_fmt..Adapter$LT$T$GT$$u20$as$u20$core..fmt..Write$GT$9write_str17h1468756d66c20292E (;140;) (type 4) (param i32 i32 i32) (result i32)
    (local i32 i32 i64 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    i32.const 0
    local.set 4
    block ;; label = @1
      local.get 2
      i32.eqz
      br_if 0 (;@1;)
      i32.const 1051644
      i64.extend_i32_u
      i64.const 32
      i64.shl
      i64.const 2
      i64.or
      local.set 5
      loop ;; label = @2
        local.get 3
        local.get 2
        i32.store offset=12
        local.get 3
        local.get 1
        i32.store offset=8
        local.get 3
        i32.const 16
        i32.add
        i32.const 2
        local.get 3
        i32.const 8
        i32.add
        i32.const 1
        call $_ZN4wasi13lib_generated8fd_write17h26c52996b83e471dE
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                local.get 3
                i32.load16_u offset=16
                br_if 0 (;@6;)
                local.get 3
                i32.load offset=20
                local.tee 6
                i32.eqz
                br_if 1 (;@5;)
                local.get 2
                local.get 6
                i32.lt_u
                br_if 2 (;@4;)
                local.get 2
                local.get 6
                i32.sub
                local.set 2
                local.get 1
                local.get 6
                i32.add
                local.set 1
                br 3 (;@3;)
              end
              local.get 3
              local.get 3
              i32.load16_u offset=18
              i32.store16 offset=30
              local.get 3
              i32.const 30
              i32.add
              call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
              local.tee 6
              i32.const 65535
              i32.and
              call $_ZN3std3sys4wasi17decode_error_kind17hf13b07452e633c92E
              i32.const 255
              i32.and
              i32.const 35
              i32.eq
              br_if 2 (;@3;)
              local.get 6
              i64.extend_i32_u
              i64.const 65535
              i64.and
              i64.const 32
              i64.shl
              local.set 5
            end
            local.get 5
            i64.const 255
            i64.and
            i64.const 4
            i64.eq
            br_if 3 (;@1;)
            block ;; label = @5
              local.get 0
              i32.load8_u
              i32.const 3
              i32.ne
              br_if 0 (;@5;)
              local.get 0
              i32.load offset=4
              local.tee 2
              i32.load
              local.get 2
              i32.load offset=4
              i32.load
              call_indirect (type $.rodata)
              block ;; label = @6
                local.get 2
                i32.load offset=4
                local.tee 1
                i32.const 4
                i32.add
                i32.load
                local.tee 6
                i32.eqz
                br_if 0 (;@6;)
                local.get 2
                i32.load
                local.get 6
                local.get 1
                i32.const 8
                i32.add
                i32.load
                call $__rust_dealloc
              end
              local.get 2
              i32.const 12
              i32.const 4
              call $__rust_dealloc
            end
            local.get 0
            local.get 5
            i64.store align=4
            i32.const 1
            local.set 4
            br 3 (;@1;)
          end
          local.get 6
          local.get 2
          i32.const 1051600
          call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
          unreachable
        end
        local.get 2
        br_if 0 (;@2;)
      end
    end
    local.get 3
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 4
  )
  (func $_ZN4core3fmt5Write9write_fmt17hadcd24a979fa7d5dE (;141;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    local.get 0
    i32.store offset=4
    local.get 2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 1
    i64.load align=4
    i64.store offset=8
    local.get 2
    i32.const 4
    i32.add
    i32.const 1051136
    local.get 2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17h7558535140974479E
    local.set 1
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN4core3fmt5Write9write_fmt17he26b07feb918eff5E (;142;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    local.get 0
    i32.store offset=4
    local.get 2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 1
    i64.load align=4
    i64.store offset=8
    local.get 2
    i32.const 4
    i32.add
    i32.const 1051160
    local.get 2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17h7558535140974479E
    local.set 1
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN3std9panicking12default_hook17h516b5ae38093c678E (;143;) (type $.rodata) (param i32)
    (local i32 i32 i32 i64 i32)
    global.get $__stack_pointer
    i32.const 96
    i32.sub
    local.tee 1
    global.set $__stack_pointer
    i32.const 1
    local.set 2
    block ;; label = @1
      i32.const 0
      i32.load offset=1054888
      i32.const 1
      i32.gt_u
      br_if 0 (;@1;)
      call $_ZN3std5panic19get_backtrace_style17h1cc96ffe00155ad1E
      i32.const 255
      i32.and
      local.set 2
    end
    local.get 1
    local.get 2
    i32.store8 offset=19
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 0
            call $_ZN4core5panic10panic_info9PanicInfo8location17h73a8e3c8110f5f4eE
            local.tee 2
            i32.eqz
            br_if 0 (;@4;)
            local.get 1
            local.get 2
            i32.store offset=20
            local.get 1
            i32.const 8
            i32.add
            local.get 0
            call $_ZN4core5panic10panic_info9PanicInfo7payload17h2c14f7d93cbd0d04E
            i32.const 12
            local.set 3
            local.get 1
            i32.load offset=8
            local.tee 2
            local.get 1
            i32.load offset=12
            i32.const 12
            i32.add
            i32.load
            call_indirect (type $.data)
            local.set 4
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  block ;; label = @8
                    local.get 2
                    i32.eqz
                    br_if 0 (;@8;)
                    local.get 4
                    i64.const -8527728395957036344
                    i64.eq
                    br_if 1 (;@7;)
                  end
                  local.get 1
                  local.get 0
                  call $_ZN4core5panic10panic_info9PanicInfo7payload17h2c14f7d93cbd0d04E
                  i32.const 1052176
                  local.set 0
                  local.get 1
                  i32.load
                  local.tee 2
                  local.get 1
                  i32.load offset=4
                  i32.const 12
                  i32.add
                  i32.load
                  call_indirect (type $.data)
                  local.set 4
                  local.get 2
                  i32.eqz
                  br_if 2 (;@5;)
                  local.get 4
                  i64.const 6963515535637561570
                  i64.ne
                  br_if 2 (;@5;)
                  local.get 2
                  i32.const 8
                  i32.add
                  local.set 0
                  local.get 2
                  i32.const 4
                  i32.add
                  local.set 2
                  br 1 (;@6;)
                end
                local.get 2
                i32.const 4
                i32.add
                local.set 0
              end
              local.get 0
              i32.load
              local.set 3
              local.get 2
              i32.load
              local.set 0
            end
            local.get 1
            local.get 3
            i32.store offset=28
            local.get 1
            local.get 0
            i32.store offset=24
            i32.const 9
            local.set 2
            i32.const 1052188
            local.set 3
            block ;; label = @5
              call $_ZN3std10sys_common11thread_info14current_thread17hd7027661b777c4d6E
              local.tee 0
              i32.eqz
              br_if 0 (;@5;)
              local.get 0
              i32.load offset=8
              local.tee 5
              i32.eqz
              br_if 0 (;@5;)
              local.get 0
              i32.const 12
              i32.add
              i32.load
              i32.const -1
              i32.add
              local.set 2
              local.get 5
              local.set 3
            end
            local.get 1
            local.get 2
            i32.store offset=36
            local.get 1
            local.get 3
            i32.store offset=32
            local.get 1
            local.get 1
            i32.const 19
            i32.add
            i32.store offset=52
            local.get 1
            local.get 1
            i32.const 20
            i32.add
            i32.store offset=48
            local.get 1
            local.get 1
            i32.const 24
            i32.add
            i32.store offset=44
            local.get 1
            local.get 1
            i32.const 32
            i32.add
            i32.store offset=40
            i32.const 0
            i32.load8_u offset=1054829
            i32.eqz
            br_if 2 (;@2;)
            i32.const 0
            i32.const 1
            i32.store8 offset=1054829
            block ;; label = @5
              i32.const 0
              i32.load8_u offset=1054872
              br_if 0 (;@5;)
              i32.const 0
              i32.const 1
              i32.store8 offset=1054872
              i32.const 0
              i32.const 0
              i32.store offset=1054876
              br 3 (;@2;)
            end
            i32.const 0
            i32.load offset=1054876
            local.set 2
            i32.const 0
            i32.const 0
            i32.store offset=1054876
            local.get 2
            i32.eqz
            br_if 2 (;@2;)
            local.get 2
            i32.load8_u offset=8
            local.set 3
            local.get 2
            i32.const 1
            i32.store8 offset=8
            local.get 1
            local.get 3
            i32.const 1
            i32.and
            local.tee 3
            i32.store8 offset=63
            local.get 3
            br_if 1 (;@3;)
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  i32.const 0
                  i32.load offset=1054860
                  i32.const 2147483647
                  i32.and
                  i32.eqz
                  br_if 0 (;@7;)
                  call $_ZN3std9panicking11panic_count17is_zero_slow_path17he73cea3e605a507aE
                  local.set 3
                  local.get 1
                  i32.const 40
                  i32.add
                  local.get 2
                  i32.const 12
                  i32.add
                  i32.const 1052240
                  call $_ZN3std9panicking12default_hook28_$u7b$$u7b$closure$u7d$$u7d$17h623f4dc81025ab51E
                  local.get 3
                  br_if 1 (;@6;)
                  br 2 (;@5;)
                end
                local.get 1
                i32.const 40
                i32.add
                local.get 2
                i32.const 12
                i32.add
                i32.const 1052240
                call $_ZN3std9panicking12default_hook28_$u7b$$u7b$closure$u7d$$u7d$17h623f4dc81025ab51E
              end
              i32.const 0
              i32.load offset=1054860
              i32.const 2147483647
              i32.and
              i32.eqz
              br_if 0 (;@5;)
              call $_ZN3std9panicking11panic_count17is_zero_slow_path17he73cea3e605a507aE
              br_if 0 (;@5;)
              local.get 2
              i32.const 1
              i32.store8 offset=9
            end
            i32.const 0
            i32.const 1
            i32.store8 offset=1054829
            local.get 2
            i32.const 0
            i32.store8 offset=8
            block ;; label = @5
              i32.const 0
              i32.load8_u offset=1054872
              br_if 0 (;@5;)
              i32.const 0
              local.get 2
              i32.store offset=1054876
              i32.const 0
              i32.const 1
              i32.store8 offset=1054872
              br 4 (;@1;)
            end
            i32.const 0
            i32.load offset=1054876
            local.set 3
            i32.const 0
            local.get 2
            i32.store offset=1054876
            local.get 3
            i32.eqz
            br_if 3 (;@1;)
            local.get 3
            local.get 3
            i32.load
            local.tee 2
            i32.const -1
            i32.add
            i32.store
            local.get 2
            i32.const 1
            i32.ne
            br_if 3 (;@1;)
            local.get 3
            call $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h00aeb5db7b908ba4E
            br 3 (;@1;)
          end
          i32.const 1051204
          i32.const 43
          i32.const 1052280
          call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
          unreachable
        end
        local.get 1
        i32.const 0
        i32.store offset=84
        local.get 1
        i32.const 1051184
        i32.store offset=80
        local.get 1
        i32.const 1
        i32.store offset=76
        local.get 1
        i32.const 1052964
        i32.store offset=72
        local.get 1
        i32.const 0
        i32.store offset=64
        local.get 1
        i32.const 63
        i32.add
        local.get 1
        i32.const 64
        i32.add
        call $_ZN4core9panicking13assert_failed17hd77b42a9e8961af9E
        unreachable
      end
      local.get 1
      i32.const 40
      i32.add
      local.get 1
      i32.const 88
      i32.add
      i32.const 1052200
      call $_ZN3std9panicking12default_hook28_$u7b$$u7b$closure$u7d$$u7d$17h623f4dc81025ab51E
    end
    block ;; label = @1
      local.get 0
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      local.get 0
      i32.load
      local.tee 2
      i32.const -1
      i32.add
      i32.store
      local.get 2
      i32.const 1
      i32.ne
      br_if 0 (;@1;)
      local.get 0
      call $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h780d223e8bf1e21cE
    end
    local.get 1
    i32.const 96
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN4core3ptr100drop_in_place$LT$$RF$mut$u20$std..io..Write..write_fmt..Adapter$LT$alloc..vec..Vec$LT$u8$GT$$GT$$GT$17hde21ae438dab7501E (;144;) (type $.rodata) (param i32))
  (func $_ZN3std9panicking11panic_count17is_zero_slow_path17he73cea3e605a507aE (;145;) (type 12) (result i32)
    i32.const 0
    i32.load offset=1054888
    i32.eqz
  )
  (func $_ZN4core3ptr205drop_in_place$LT$$LT$alloc..boxed..Box$LT$dyn$u20$core..error..Error$u2b$core..marker..Send$u2b$core..marker..Sync$GT$$u20$as$u20$core..convert..From$LT$alloc..string..String$GT$$GT$..from..StringError$GT$17h6486a4eecfa8ec50E (;146;) (type $.rodata) (param i32)
    (local i32)
    block ;; label = @1
      local.get 0
      i32.load
      local.tee 1
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.const 4
      i32.add
      i32.load
      local.get 1
      i32.const 1
      call $__rust_dealloc
    end
  )
  (func $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h780d223e8bf1e21cE (;147;) (type $.rodata) (param i32)
    (local i32)
    block ;; label = @1
      local.get 0
      i32.load offset=8
      local.tee 1
      i32.eqz
      br_if 0 (;@1;)
      local.get 1
      i32.const 0
      i32.store8
      local.get 0
      i32.const 12
      i32.add
      i32.load
      local.tee 1
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.load offset=8
      local.get 1
      i32.const 1
      call $__rust_dealloc
    end
    block ;; label = @1
      local.get 0
      i32.const -1
      i32.eq
      br_if 0 (;@1;)
      local.get 0
      local.get 0
      i32.load offset=4
      local.tee 1
      i32.const -1
      i32.add
      i32.store offset=4
      local.get 1
      i32.const 1
      i32.ne
      br_if 0 (;@1;)
      local.get 0
      i32.const 32
      i32.const 8
      call $__rust_dealloc
    end
  )
  (func $_ZN4core3ptr70drop_in_place$LT$core..option..Option$LT$alloc..string..String$GT$$GT$17h6743b4145838f5adE (;148;) (type $.rodata) (param i32)
    (local i32)
    block ;; label = @1
      local.get 0
      i32.const 4
      i32.add
      i32.load
      local.tee 1
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.load
      local.tee 0
      i32.eqz
      br_if 0 (;@1;)
      local.get 1
      local.get 0
      i32.const 1
      call $__rust_dealloc
    end
  )
  (func $_ZN4core3ptr81drop_in_place$LT$core..result..Result$LT$$LP$$RP$$C$std..io..error..Error$GT$$GT$17h0ad9adc9a67d38b6E (;149;) (type $.rodata) (param i32)
    (local i32 i32 i32)
    block ;; label = @1
      local.get 0
      i32.load8_u
      i32.const 3
      i32.ne
      br_if 0 (;@1;)
      local.get 0
      i32.load offset=4
      local.tee 1
      i32.load
      local.get 1
      i32.load offset=4
      i32.load
      call_indirect (type $.rodata)
      block ;; label = @2
        local.get 1
        i32.load offset=4
        local.tee 2
        i32.const 4
        i32.add
        i32.load
        local.tee 3
        i32.eqz
        br_if 0 (;@2;)
        local.get 1
        i32.load
        local.get 3
        local.get 2
        i32.const 8
        i32.add
        i32.load
        call $__rust_dealloc
      end
      local.get 0
      i32.load offset=4
      i32.const 12
      i32.const 4
      call $__rust_dealloc
    end
  )
  (func $_ZN4core3ptr88drop_in_place$LT$std..io..Write..write_fmt..Adapter$LT$alloc..vec..Vec$LT$u8$GT$$GT$$GT$17hf78d30d59fb86c0dE (;150;) (type $.rodata) (param i32)
    (local i32 i32 i32)
    block ;; label = @1
      local.get 0
      i32.load8_u
      i32.const 3
      i32.ne
      br_if 0 (;@1;)
      local.get 0
      i32.load offset=4
      local.tee 1
      i32.load
      local.get 1
      i32.load offset=4
      i32.load
      call_indirect (type $.rodata)
      block ;; label = @2
        local.get 1
        i32.load offset=4
        local.tee 2
        i32.const 4
        i32.add
        i32.load
        local.tee 3
        i32.eqz
        br_if 0 (;@2;)
        local.get 1
        i32.load
        local.get 3
        local.get 2
        i32.const 8
        i32.add
        i32.load
        call $__rust_dealloc
      end
      local.get 0
      i32.load offset=4
      i32.const 12
      i32.const 4
      call $__rust_dealloc
    end
  )
  (func $_ZN4core9panicking13assert_failed17hd77b42a9e8961af9E (;151;) (type 3) (param i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    i32.const 1051184
    i32.store offset=4
    local.get 2
    local.get 0
    i32.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 1
    i64.load align=4
    i64.store offset=8
    i32.const 0
    local.get 2
    i32.const 1051188
    local.get 2
    i32.const 4
    i32.add
    i32.const 1051188
    local.get 2
    i32.const 8
    i32.add
    i32.const 1053028
    call $_ZN4core9panicking19assert_failed_inner17hf30758b978d1cad1E
    unreachable
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h488f14e19ec7ceafE (;152;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i32.load
    local.get 1
    call $_ZN4core3fmt5Write10write_char17haa46f9e30bca77f3E
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h97dcd5289d066230E (;153;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 0
    i32.load
    local.set 0
    local.get 2
    i32.const 0
    i32.store offset=12
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.const 128
        i32.lt_u
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 1
          i32.const 2048
          i32.lt_u
          br_if 0 (;@3;)
          block ;; label = @4
            local.get 1
            i32.const 65536
            i32.lt_u
            br_if 0 (;@4;)
            local.get 2
            local.get 1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=15
            local.get 2
            local.get 1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=14
            local.get 2
            local.get 1
            i32.const 12
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            local.get 2
            local.get 1
            i32.const 18
            i32.shr_u
            i32.const 7
            i32.and
            i32.const 240
            i32.or
            i32.store8 offset=12
            i32.const 4
            local.set 1
            br 3 (;@1;)
          end
          local.get 2
          local.get 1
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=14
          local.get 2
          local.get 1
          i32.const 12
          i32.shr_u
          i32.const 224
          i32.or
          i32.store8 offset=12
          local.get 2
          local.get 1
          i32.const 6
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=13
          i32.const 3
          local.set 1
          br 2 (;@1;)
        end
        local.get 2
        local.get 1
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=13
        local.get 2
        local.get 1
        i32.const 6
        i32.shr_u
        i32.const 192
        i32.or
        i32.store8 offset=12
        i32.const 2
        local.set 1
        br 1 (;@1;)
      end
      local.get 2
      local.get 1
      i32.store8 offset=12
      i32.const 1
      local.set 1
    end
    local.get 0
    local.get 2
    i32.const 12
    i32.add
    local.get 1
    call $_ZN80_$LT$std..io..Write..write_fmt..Adapter$LT$T$GT$$u20$as$u20$core..fmt..Write$GT$9write_str17h1468756d66c20292E
    local.set 1
    local.get 2
    i32.const 16
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17hd9f4a6d08a482859E (;154;) (type 5) (param i32 i32) (result i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 0
    i32.load
    local.set 0
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.const 127
        i32.gt_u
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 0
          i32.load offset=8
          local.tee 3
          local.get 0
          i32.load
          i32.ne
          br_if 0 (;@3;)
          local.get 0
          local.get 3
          call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$16reserve_for_push17h30578206c0db45c0E
          local.get 0
          i32.load offset=8
          local.set 3
        end
        local.get 0
        local.get 3
        i32.const 1
        i32.add
        i32.store offset=8
        local.get 0
        i32.load offset=4
        local.get 3
        i32.add
        local.get 1
        i32.store8
        br 1 (;@1;)
      end
      local.get 2
      i32.const 0
      i32.store offset=12
      block ;; label = @2
        block ;; label = @3
          local.get 1
          i32.const 2048
          i32.lt_u
          br_if 0 (;@3;)
          block ;; label = @4
            local.get 1
            i32.const 65536
            i32.lt_u
            br_if 0 (;@4;)
            local.get 2
            local.get 1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=15
            local.get 2
            local.get 1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=14
            local.get 2
            local.get 1
            i32.const 12
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            local.get 2
            local.get 1
            i32.const 18
            i32.shr_u
            i32.const 7
            i32.and
            i32.const 240
            i32.or
            i32.store8 offset=12
            i32.const 4
            local.set 1
            br 2 (;@2;)
          end
          local.get 2
          local.get 1
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=14
          local.get 2
          local.get 1
          i32.const 12
          i32.shr_u
          i32.const 224
          i32.or
          i32.store8 offset=12
          local.get 2
          local.get 1
          i32.const 6
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=13
          i32.const 3
          local.set 1
          br 1 (;@2;)
        end
        local.get 2
        local.get 1
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=13
        local.get 2
        local.get 1
        i32.const 6
        i32.shr_u
        i32.const 192
        i32.or
        i32.store8 offset=12
        i32.const 2
        local.set 1
      end
      block ;; label = @2
        local.get 0
        i32.load
        local.get 0
        i32.load offset=8
        local.tee 3
        i32.sub
        local.get 1
        i32.ge_u
        br_if 0 (;@2;)
        local.get 0
        local.get 3
        local.get 1
        call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE
        local.get 0
        i32.load offset=8
        local.set 3
      end
      local.get 0
      i32.load offset=4
      local.get 3
      i32.add
      local.get 2
      i32.const 12
      i32.add
      local.get 1
      call $memcpy
      drop
      local.get 0
      local.get 3
      local.get 1
      i32.add
      i32.store offset=8
    end
    local.get 2
    i32.const 16
    i32.add
    global.set $__stack_pointer
    i32.const 0
  )
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$16reserve_for_push17h30578206c0db45c0E (;155;) (type 3) (param i32 i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.const 1
        i32.add
        local.tee 1
        i32.eqz
        br_if 0 (;@2;)
        local.get 0
        i32.load
        local.tee 3
        i32.const 1
        i32.shl
        local.tee 4
        local.get 1
        local.get 4
        local.get 1
        i32.gt_u
        select
        local.tee 1
        i32.const 8
        local.get 1
        i32.const 8
        i32.gt_u
        select
        local.tee 1
        i32.const -1
        i32.xor
        i32.const 31
        i32.shr_u
        local.set 4
        block ;; label = @3
          block ;; label = @4
            local.get 3
            i32.eqz
            br_if 0 (;@4;)
            local.get 2
            i32.const 1
            i32.store offset=24
            local.get 2
            local.get 3
            i32.store offset=20
            local.get 2
            local.get 0
            i32.const 4
            i32.add
            i32.load
            i32.store offset=16
            br 1 (;@3;)
          end
          local.get 2
          i32.const 0
          i32.store offset=24
        end
        local.get 2
        local.get 1
        local.get 4
        local.get 2
        i32.const 16
        i32.add
        call $_ZN5alloc7raw_vec11finish_grow17h28a077458d86de3bE
        local.get 2
        i32.load offset=4
        local.set 3
        block ;; label = @3
          local.get 2
          i32.load
          br_if 0 (;@3;)
          local.get 0
          local.get 1
          i32.store
          local.get 0
          local.get 3
          i32.store offset=4
          br 2 (;@1;)
        end
        local.get 2
        i32.const 8
        i32.add
        i32.load
        local.tee 0
        i32.const -2147483647
        i32.eq
        br_if 1 (;@1;)
        local.get 0
        i32.eqz
        br_if 0 (;@2;)
        local.get 3
        local.get 0
        call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
        unreachable
      end
      call $_ZN5alloc7raw_vec17capacity_overflow17h38ac120e37f2568fE
      unreachable
    end
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17h19a1acee2e3fe47bE (;156;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    local.get 0
    i32.load
    i32.store offset=4
    local.get 2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 1
    i64.load align=4
    i64.store offset=8
    local.get 2
    i32.const 4
    i32.add
    i32.const 1051136
    local.get 2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17h7558535140974479E
    local.set 1
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17h4ab582e0a50bf665E (;157;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    local.get 0
    i32.load
    i32.store offset=4
    local.get 2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 1
    i64.load align=4
    i64.store offset=8
    local.get 2
    i32.const 4
    i32.add
    i32.const 1051160
    local.get 2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17h7558535140974479E
    local.set 1
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17ha2835ff278cbfecbE (;158;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    local.get 0
    i32.load
    i32.store offset=4
    local.get 2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 1
    i64.load align=4
    i64.store offset=8
    local.get 2
    i32.const 4
    i32.add
    i32.const 1051112
    local.get 2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17h7558535140974479E
    local.set 1
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h303b0dcaf54ff4d5E (;159;) (type 4) (param i32 i32 i32) (result i32)
    (local i32)
    block ;; label = @1
      local.get 0
      i32.load
      local.tee 0
      i32.load
      local.get 0
      i32.load offset=8
      local.tee 3
      i32.sub
      local.get 2
      i32.ge_u
      br_if 0 (;@1;)
      local.get 0
      local.get 3
      local.get 2
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE
      local.get 0
      i32.load offset=8
      local.set 3
    end
    local.get 0
    i32.load offset=4
    local.get 3
    i32.add
    local.get 1
    local.get 2
    call $memcpy
    drop
    local.get 0
    local.get 3
    local.get 2
    i32.add
    i32.store offset=8
    i32.const 0
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h92bdbb051fdd6c01E (;160;) (type 4) (param i32 i32 i32) (result i32)
    (local i32)
    block ;; label = @1
      local.get 0
      i32.load
      i32.load offset=8
      local.tee 0
      i32.load
      local.get 0
      i32.load offset=8
      local.tee 3
      i32.sub
      local.get 2
      i32.ge_u
      br_if 0 (;@1;)
      local.get 0
      local.get 3
      local.get 2
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE
      local.get 0
      i32.load offset=8
      local.set 3
    end
    local.get 0
    i32.load offset=4
    local.get 3
    i32.add
    local.get 1
    local.get 2
    call $memcpy
    drop
    local.get 0
    local.get 3
    local.get 2
    i32.add
    i32.store offset=8
    i32.const 0
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17hd4e24d7828055adbE (;161;) (type 4) (param i32 i32 i32) (result i32)
    local.get 0
    i32.load
    local.get 1
    local.get 2
    call $_ZN80_$LT$std..io..Write..write_fmt..Adapter$LT$T$GT$$u20$as$u20$core..fmt..Write$GT$9write_str17h1468756d66c20292E
  )
  (func $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17h00aeb5db7b908ba4E (;162;) (type $.rodata) (param i32)
    (local i32)
    block ;; label = @1
      local.get 0
      i32.const 12
      i32.add
      i32.load
      local.tee 1
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.const 16
      i32.add
      i32.load
      local.get 1
      i32.const 1
      call $__rust_dealloc
    end
    block ;; label = @1
      local.get 0
      i32.const -1
      i32.eq
      br_if 0 (;@1;)
      local.get 0
      local.get 0
      i32.load offset=4
      local.tee 1
      i32.const -1
      i32.add
      i32.store offset=4
      local.get 1
      i32.const 1
      i32.ne
      br_if 0 (;@1;)
      local.get 0
      i32.const 24
      i32.const 4
      call $__rust_dealloc
    end
  )
  (func $_ZN5alloc7raw_vec11finish_grow17h28a077458d86de3bE (;163;) (type 8) (param i32 i32 i32 i32)
    (local i32)
    block ;; label = @1
      block ;; label = @2
        local.get 2
        i32.eqz
        br_if 0 (;@2;)
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  local.get 1
                  i32.const 0
                  i32.lt_s
                  br_if 0 (;@7;)
                  local.get 3
                  i32.load offset=8
                  i32.eqz
                  br_if 2 (;@5;)
                  local.get 3
                  i32.load offset=4
                  local.tee 4
                  br_if 1 (;@6;)
                  local.get 1
                  br_if 3 (;@4;)
                  local.get 2
                  local.set 3
                  br 4 (;@3;)
                end
                local.get 0
                i32.const 8
                i32.add
                i32.const 0
                i32.store
                br 5 (;@1;)
              end
              local.get 3
              i32.load
              local.get 4
              local.get 2
              local.get 1
              call $__rust_realloc
              local.set 3
              br 2 (;@3;)
            end
            local.get 1
            br_if 0 (;@4;)
            local.get 2
            local.set 3
            br 1 (;@3;)
          end
          local.get 1
          local.get 2
          call $__rust_alloc
          local.set 3
        end
        block ;; label = @3
          local.get 3
          i32.eqz
          br_if 0 (;@3;)
          local.get 0
          local.get 3
          i32.store offset=4
          local.get 0
          i32.const 8
          i32.add
          local.get 1
          i32.store
          local.get 0
          i32.const 0
          i32.store
          return
        end
        local.get 0
        local.get 1
        i32.store offset=4
        local.get 0
        i32.const 8
        i32.add
        local.get 2
        i32.store
        br 1 (;@1;)
      end
      local.get 0
      local.get 1
      i32.store offset=4
      local.get 0
      i32.const 8
      i32.add
      i32.const 0
      i32.store
    end
    local.get 0
    i32.const 1
    i32.store
  )
  (func $_ZN3std6thread8ThreadId3new9exhausted17h786ca0572314fee8E (;164;) (type 7)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 0
    global.set $__stack_pointer
    local.get 0
    i32.const 20
    i32.add
    i32.const 1
    i32.store
    local.get 0
    i32.const 28
    i32.add
    i32.const 0
    i32.store
    local.get 0
    i32.const 1051412
    i32.store offset=16
    local.get 0
    i32.const 1051184
    i32.store offset=24
    local.get 0
    i32.const 0
    i32.store offset=8
    local.get 0
    i32.const 8
    i32.add
    i32.const 1051420
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN3std2io5Write9write_fmt17hba5fcb56a4c5cebaE (;165;) (type 2) (param i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    local.get 3
    i32.const 4
    i32.store8 offset=8
    local.get 3
    local.get 1
    i32.store offset=16
    local.get 3
    i32.const 24
    i32.add
    i32.const 16
    i32.add
    local.get 2
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 3
    i32.const 24
    i32.add
    i32.const 8
    i32.add
    local.get 2
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 3
    local.get 2
    i64.load align=4
    i64.store offset=24
    block ;; label = @1
      block ;; label = @2
        local.get 3
        i32.const 8
        i32.add
        i32.const 1051708
        local.get 3
        i32.const 24
        i32.add
        call $_ZN4core3fmt5write17h7558535140974479E
        i32.eqz
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 3
          i32.load8_u offset=8
          i32.const 4
          i32.ne
          br_if 0 (;@3;)
          local.get 0
          i32.const 1051672
          i32.store offset=4
          local.get 0
          i32.const 2
          i32.store
          br 2 (;@1;)
        end
        local.get 0
        local.get 3
        i64.load offset=8
        i64.store align=4
        br 1 (;@1;)
      end
      local.get 0
      i32.const 4
      i32.store8
      local.get 3
      i32.load8_u offset=8
      i32.const 3
      i32.ne
      br_if 0 (;@1;)
      local.get 3
      i32.load offset=12
      local.tee 2
      i32.load
      local.get 2
      i32.load offset=4
      i32.load
      call_indirect (type $.rodata)
      block ;; label = @2
        local.get 2
        i32.load offset=4
        local.tee 0
        i32.const 4
        i32.add
        i32.load
        local.tee 1
        i32.eqz
        br_if 0 (;@2;)
        local.get 2
        i32.load
        local.get 1
        local.get 0
        i32.const 8
        i32.add
        i32.load
        call $__rust_dealloc
      end
      local.get 3
      i32.load offset=12
      i32.const 12
      i32.const 4
      call $__rust_dealloc
    end
    local.get 3
    i32.const 48
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN3std3sys4wasi14abort_internal17h761afe555b0460d5E (;166;) (type 7)
    call $abort
    unreachable
  )
  (func $_ZN3std10sys_common11thread_info14current_thread17hd7027661b777c4d6E (;167;) (type 12) (result i32)
    (local i32 i32 i32 i32 i32 i64 i64 i64)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 0
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            i32.const 0
            i32.load offset=1054880
            br_if 0 (;@4;)
            i32.const 0
            i32.const -1
            i32.store offset=1054880
            block ;; label = @5
              i32.const 0
              i32.load offset=1054884
              local.tee 1
              br_if 0 (;@5;)
              local.get 0
              i32.const 16
              i32.add
              i32.const 24
              i32.const 8
              call $_ZN5alloc4sync32arcinner_layout_for_value_layout17h57586c4dc56ab55aE
              local.get 0
              i32.load offset=20
              local.set 2
              local.get 0
              i32.load offset=16
              local.set 3
              local.get 0
              i32.const 8
              i32.add
              i32.const 24
              i32.const 8
              call $_ZN5alloc4sync32arcinner_layout_for_value_layout17h57586c4dc56ab55aE
              local.get 0
              i32.load offset=12
              local.set 1
              block ;; label = @6
                local.get 0
                i32.load offset=8
                local.tee 4
                i32.eqz
                br_if 0 (;@6;)
                local.get 4
                local.get 1
                call $__rust_alloc
                local.set 1
              end
              local.get 1
              i32.eqz
              br_if 3 (;@2;)
              local.get 1
              i64.const 4294967297
              i64.store align=4
              local.get 1
              i32.const 0
              i32.store offset=8
              i32.const 0
              i64.load offset=1054864
              local.set 5
              loop ;; label = @6
                local.get 5
                i64.const 1
                i64.add
                local.tee 6
                i64.eqz
                br_if 5 (;@1;)
                i32.const 0
                local.get 6
                i32.const 0
                i64.load offset=1054864
                local.tee 7
                local.get 7
                local.get 5
                i64.eq
                local.tee 4
                select
                i64.store offset=1054864
                local.get 7
                local.set 5
                local.get 4
                i32.eqz
                br_if 0 (;@6;)
              end
              local.get 1
              i32.const 0
              i32.store16 offset=20
              i32.const 0
              local.get 1
              i32.store offset=1054884
              local.get 1
              i32.const 16
              i32.add
              i32.const 0
              i32.store
              local.get 1
              i32.const 24
              i32.add
              local.get 6
              i64.store
            end
            local.get 1
            local.get 1
            i32.load
            local.tee 4
            i32.const 1
            i32.add
            i32.store
            local.get 4
            i32.const -1
            i32.gt_s
            br_if 1 (;@3;)
            unreachable
            unreachable
          end
          i32.const 1051460
          i32.const 16
          local.get 0
          i32.const 24
          i32.add
          i32.const 1051476
          i32.const 1052008
          call $_ZN4core6result13unwrap_failed17he6bfae7ea6f8795eE
          unreachable
        end
        i32.const 0
        i32.const 0
        i32.load offset=1054880
        i32.const 1
        i32.add
        i32.store offset=1054880
        local.get 0
        i32.const 32
        i32.add
        global.set $__stack_pointer
        local.get 1
        return
      end
      local.get 3
      local.get 2
      call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
      unreachable
    end
    call $_ZN3std6thread8ThreadId3new9exhausted17h786ca0572314fee8E
    unreachable
  )
  (func $_ZN3std3env11current_dir17hb9d80cddcbfbdb2eE (;168;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 1
    global.set $__stack_pointer
    i32.const 512
    local.set 2
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            i32.const 512
            i32.const 1
            call $__rust_alloc
            local.tee 3
            i32.eqz
            br_if 0 (;@4;)
            local.get 1
            local.get 3
            i32.store offset=4
            local.get 1
            i32.const 512
            i32.store
            local.get 3
            i32.const 512
            call $getcwd
            br_if 1 (;@3;)
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  i32.const 0
                  i32.load offset=1055388
                  local.tee 2
                  i32.const 68
                  i32.ne
                  br_if 0 (;@7;)
                  i32.const 512
                  local.set 2
                  br 1 (;@6;)
                end
                local.get 0
                i64.const 1
                i64.store align=4
                local.get 0
                i32.const 8
                i32.add
                local.get 2
                i32.store
                i32.const 512
                local.set 2
                br 1 (;@5;)
              end
              loop ;; label = @6
                local.get 1
                local.get 2
                i32.store offset=8
                local.get 1
                local.get 2
                i32.const 1
                call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE
                local.get 1
                i32.load offset=4
                local.tee 3
                local.get 1
                i32.load
                local.tee 2
                call $getcwd
                br_if 3 (;@3;)
                i32.const 0
                i32.load offset=1055388
                local.tee 4
                i32.const 68
                i32.eq
                br_if 0 (;@6;)
              end
              local.get 0
              i64.const 1
              i64.store align=4
              local.get 0
              i32.const 8
              i32.add
              local.get 4
              i32.store
              local.get 2
              i32.eqz
              br_if 3 (;@2;)
            end
            local.get 3
            local.get 2
            i32.const 1
            call $__rust_dealloc
            br 2 (;@2;)
          end
          i32.const 512
          i32.const 1
          call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
          unreachable
        end
        local.get 1
        local.get 3
        call $_ZN4core3ffi5c_str4CStr8from_ptr9strlen_rt17h0159b444b16e3465E
        local.tee 4
        i32.store offset=8
        block ;; label = @3
          local.get 2
          local.get 4
          i32.le_u
          br_if 0 (;@3;)
          block ;; label = @4
            block ;; label = @5
              local.get 4
              br_if 0 (;@5;)
              i32.const 1
              local.set 5
              local.get 3
              local.get 2
              i32.const 1
              call $__rust_dealloc
              br 1 (;@4;)
            end
            local.get 3
            local.get 2
            i32.const 1
            local.get 4
            call $__rust_realloc
            local.tee 5
            i32.eqz
            br_if 3 (;@1;)
          end
          local.get 1
          local.get 4
          i32.store
          local.get 1
          local.get 5
          i32.store offset=4
        end
        local.get 0
        local.get 1
        i64.load
        i64.store offset=4 align=4
        local.get 0
        i32.const 0
        i32.store
        local.get 0
        i32.const 12
        i32.add
        local.get 1
        i32.const 8
        i32.add
        i32.load
        i32.store
      end
      local.get 1
      i32.const 16
      i32.add
      global.set $__stack_pointer
      return
    end
    local.get 4
    i32.const 1
    call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
    unreachable
  )
  (func $_ZN3std3env7_var_os17hcf2213876bb081deE (;169;) (type 2) (param i32 i32 i32)
    (local i32 i64 i32 i32)
    global.get $__stack_pointer
    i32.const 416
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 2
        i32.const 383
        i32.gt_u
        br_if 0 (;@2;)
        local.get 3
        i32.const 16
        i32.add
        local.get 1
        local.get 2
        call $memcpy
        drop
        local.get 3
        i32.const 16
        i32.add
        local.get 2
        i32.add
        i32.const 0
        i32.store8
        local.get 3
        i32.const 400
        i32.add
        local.get 3
        i32.const 16
        i32.add
        local.get 2
        i32.const 1
        i32.add
        call $_ZN4core3ffi5c_str4CStr19from_bytes_with_nul17h3bcfbfec0c9c291cE
        block ;; label = @3
          local.get 3
          i32.load offset=400
          br_if 0 (;@3;)
          i32.const 4
          local.set 2
          local.get 3
          i32.load offset=404
          call $getenv
          local.set 1
          local.get 3
          i32.const 4
          i32.store8 offset=8
          local.get 3
          local.get 1
          i32.store offset=12
          br 2 (;@1;)
        end
        local.get 3
        i32.const 0
        i64.load offset=1051832
        local.tee 4
        i64.store offset=8
        local.get 4
        i32.wrap_i64
        local.set 2
        br 1 (;@1;)
      end
      local.get 3
      i32.const 8
      i32.add
      local.get 1
      local.get 2
      call $_ZN3std3sys6common14small_c_string24run_with_cstr_allocating17h827ae54031d1a1a7E
      local.get 3
      i32.load8_u offset=8
      local.set 2
    end
    block ;; label = @1
      block ;; label = @2
        local.get 2
        i32.const 255
        i32.and
        i32.const 4
        i32.eq
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 3
          i32.load8_u offset=8
          i32.const 3
          i32.ne
          br_if 0 (;@3;)
          local.get 3
          i32.load offset=12
          local.tee 2
          i32.load
          local.get 2
          i32.load offset=4
          i32.load
          call_indirect (type $.rodata)
          block ;; label = @4
            local.get 2
            i32.load offset=4
            local.tee 1
            i32.const 4
            i32.add
            i32.load
            local.tee 5
            i32.eqz
            br_if 0 (;@4;)
            local.get 2
            i32.load
            local.get 5
            local.get 1
            i32.const 8
            i32.add
            i32.load
            call $__rust_dealloc
          end
          local.get 2
          i32.const 12
          i32.const 4
          call $__rust_dealloc
        end
        local.get 0
        i32.const 0
        i32.store offset=4
        br 1 (;@1;)
      end
      block ;; label = @2
        local.get 3
        i32.load offset=12
        local.tee 1
        i32.eqz
        br_if 0 (;@2;)
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                local.get 1
                call $_ZN4core3ffi5c_str4CStr8from_ptr9strlen_rt17h0159b444b16e3465E
                local.tee 2
                br_if 0 (;@6;)
                i32.const 1
                local.set 5
                br 1 (;@5;)
              end
              local.get 2
              i32.const -1
              i32.gt_s
              local.tee 6
              i32.eqz
              br_if 1 (;@4;)
              local.get 2
              local.get 6
              call $__rust_alloc
              local.tee 5
              i32.eqz
              br_if 2 (;@3;)
            end
            local.get 5
            local.get 1
            local.get 2
            call $memcpy
            local.set 1
            local.get 0
            local.get 2
            i32.store offset=8
            local.get 0
            local.get 1
            i32.store offset=4
            local.get 0
            local.get 2
            i32.store
            br 3 (;@1;)
          end
          call $_ZN5alloc7raw_vec17capacity_overflow17h38ac120e37f2568fE
          unreachable
        end
        local.get 2
        local.get 6
        call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
        unreachable
      end
      local.get 0
      i32.const 0
      i32.store offset=4
    end
    local.get 3
    i32.const 416
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN3std3sys6common14small_c_string24run_with_cstr_allocating17h827ae54031d1a1a7E (;170;) (type 2) (param i32 i32 i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    local.get 3
    local.get 1
    local.get 2
    call $_ZN72_$LT$$RF$str$u20$as$u20$alloc..ffi..c_str..CString..new..SpecNewImpl$GT$13spec_new_impl17h340d4b599af20849E
    block ;; label = @1
      block ;; label = @2
        local.get 3
        i32.load offset=8
        local.tee 2
        br_if 0 (;@2;)
        local.get 3
        i32.load offset=4
        local.set 2
        local.get 3
        i32.load
        local.tee 1
        call $getenv
        local.set 4
        local.get 0
        i32.const 4
        i32.store8
        local.get 0
        local.get 4
        i32.store offset=4
        local.get 1
        i32.const 0
        i32.store8
        local.get 2
        i32.eqz
        br_if 1 (;@1;)
        local.get 1
        local.get 2
        i32.const 1
        call $__rust_dealloc
        br 1 (;@1;)
      end
      local.get 0
      i32.const 0
      i64.load offset=1051832
      i64.store align=4
      local.get 3
      i32.load offset=4
      local.tee 0
      i32.eqz
      br_if 0 (;@1;)
      local.get 2
      local.get 0
      i32.const 1
      call $__rust_dealloc
    end
    local.get 3
    i32.const 16
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN3std3sys4wasi17decode_error_kind17hf13b07452e633c92E (;171;) (type 9) (param i32) (result i32)
    (local i32)
    i32.const 40
    local.set 1
    block ;; label = @1
      local.get 0
      i32.const 65535
      i32.gt_u
      br_if 0 (;@1;)
      i32.const 2
      local.set 1
      i32.const 1053080
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 3
      local.set 1
      i32.const 1053082
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 1
      local.set 1
      i32.const 1053084
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 1053086
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 11
      local.set 1
      i32.const 1053088
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 7
      local.set 1
      i32.const 1053090
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 6
      local.set 1
      i32.const 1053092
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 9
      local.set 1
      i32.const 1053094
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 8
      local.set 1
      i32.const 1053096
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 0
      local.set 1
      i32.const 1053098
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 35
      local.set 1
      i32.const 1053100
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 20
      local.set 1
      i32.const 1053102
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 22
      local.set 1
      i32.const 1053104
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 12
      local.set 1
      i32.const 1053106
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 13
      local.set 1
      i32.const 1053108
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 36
      local.set 1
      i32.const 1053110
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      br_if 0 (;@1;)
      i32.const 38
      i32.const 40
      i32.const 1053112
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i32.const 65535
      i32.and
      local.get 0
      i32.eq
      select
      local.set 1
    end
    local.get 1
  )
  (func $_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$5write17h31125b29efb4f619E (;172;) (type 8) (param i32 i32 i32 i32)
    (local i32)
    block ;; label = @1
      local.get 1
      i32.load
      local.get 1
      i32.load offset=8
      local.tee 4
      i32.sub
      local.get 3
      i32.ge_u
      br_if 0 (;@1;)
      local.get 1
      local.get 4
      local.get 3
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE
      local.get 1
      i32.load offset=8
      local.set 4
    end
    local.get 1
    i32.load offset=4
    local.get 4
    i32.add
    local.get 2
    local.get 3
    call $memcpy
    drop
    local.get 0
    local.get 3
    i32.store offset=4
    local.get 1
    local.get 4
    local.get 3
    i32.add
    i32.store offset=8
    local.get 0
    i32.const 4
    i32.store8
  )
  (func $_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$14write_vectored17he20320b606539ce1E (;173;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32)
    block ;; label = @1
      block ;; label = @2
        local.get 3
        br_if 0 (;@2;)
        i32.const 0
        local.set 4
        br 1 (;@1;)
      end
      local.get 3
      i32.const -1
      i32.add
      i32.const 536870911
      i32.and
      local.tee 5
      i32.const 1
      i32.add
      local.tee 4
      i32.const 7
      i32.and
      local.set 6
      block ;; label = @2
        block ;; label = @3
          local.get 5
          i32.const 7
          i32.ge_u
          br_if 0 (;@3;)
          i32.const 0
          local.set 4
          local.get 2
          local.set 5
          br 1 (;@2;)
        end
        local.get 2
        i32.const 60
        i32.add
        local.set 5
        local.get 4
        i32.const 1073741816
        i32.and
        local.set 7
        i32.const 0
        local.set 4
        loop ;; label = @3
          local.get 5
          i32.load
          local.get 5
          i32.const -8
          i32.add
          i32.load
          local.get 5
          i32.const -16
          i32.add
          i32.load
          local.get 5
          i32.const -24
          i32.add
          i32.load
          local.get 5
          i32.const -32
          i32.add
          i32.load
          local.get 5
          i32.const -40
          i32.add
          i32.load
          local.get 5
          i32.const -48
          i32.add
          i32.load
          local.get 5
          i32.const -56
          i32.add
          i32.load
          local.get 4
          i32.add
          i32.add
          i32.add
          i32.add
          i32.add
          i32.add
          i32.add
          i32.add
          local.set 4
          local.get 5
          i32.const 64
          i32.add
          local.set 5
          local.get 7
          i32.const -8
          i32.add
          local.tee 7
          br_if 0 (;@3;)
        end
        local.get 5
        i32.const -60
        i32.add
        local.set 5
      end
      block ;; label = @2
        local.get 6
        i32.eqz
        br_if 0 (;@2;)
        local.get 5
        i32.const 4
        i32.add
        local.set 5
        loop ;; label = @3
          local.get 5
          i32.load
          local.get 4
          i32.add
          local.set 4
          local.get 5
          i32.const 8
          i32.add
          local.set 5
          local.get 6
          i32.const -1
          i32.add
          local.tee 6
          br_if 0 (;@3;)
        end
      end
      block ;; label = @2
        local.get 1
        i32.load
        local.get 1
        i32.load offset=8
        local.tee 5
        i32.sub
        local.get 4
        i32.ge_u
        br_if 0 (;@2;)
        local.get 1
        local.get 5
        local.get 4
        call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE
      end
      local.get 3
      i32.eqz
      br_if 0 (;@1;)
      local.get 2
      local.get 3
      i32.const 3
      i32.shl
      i32.add
      local.set 3
      local.get 1
      i32.load offset=8
      local.set 5
      loop ;; label = @2
        local.get 2
        i32.load
        local.set 7
        block ;; label = @3
          local.get 1
          i32.load
          local.get 5
          i32.sub
          local.get 2
          i32.const 4
          i32.add
          i32.load
          local.tee 6
          i32.ge_u
          br_if 0 (;@3;)
          local.get 1
          local.get 5
          local.get 6
          call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE
          local.get 1
          i32.load offset=8
          local.set 5
        end
        local.get 1
        i32.load offset=4
        local.get 5
        i32.add
        local.get 7
        local.get 6
        call $memcpy
        drop
        local.get 1
        local.get 5
        local.get 6
        i32.add
        local.tee 5
        i32.store offset=8
        local.get 2
        i32.const 8
        i32.add
        local.tee 2
        local.get 3
        i32.ne
        br_if 0 (;@2;)
      end
    end
    local.get 0
    i32.const 4
    i32.store8
    local.get 0
    local.get 4
    i32.store offset=4
  )
  (func $_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$17is_write_vectored17hc7b9f7c56ce6f0ceE (;174;) (type 9) (param i32) (result i32)
    i32.const 1
  )
  (func $_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h30621f068535731eE (;175;) (type 8) (param i32 i32 i32 i32)
    (local i32)
    block ;; label = @1
      local.get 1
      i32.load
      local.get 1
      i32.load offset=8
      local.tee 4
      i32.sub
      local.get 3
      i32.ge_u
      br_if 0 (;@1;)
      local.get 1
      local.get 4
      local.get 3
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE
      local.get 1
      i32.load offset=8
      local.set 4
    end
    local.get 1
    i32.load offset=4
    local.get 4
    i32.add
    local.get 2
    local.get 3
    call $memcpy
    drop
    local.get 0
    i32.const 4
    i32.store8
    local.get 1
    local.get 4
    local.get 3
    i32.add
    i32.store offset=8
  )
  (func $_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$5flush17h63afd92b838412a5E (;176;) (type 3) (param i32 i32)
    local.get 0
    i32.const 4
    i32.store8
  )
  (func $_ZN3std2io5Write18write_all_vectored17h4a3f8eead6bfe2c3E (;177;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i64 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 4
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 3
            i32.eqz
            br_if 0 (;@4;)
            local.get 2
            i32.const 4
            i32.add
            local.set 5
            local.get 3
            i32.const 3
            i32.shl
            local.set 6
            local.get 3
            i32.const -1
            i32.add
            i32.const 536870911
            i32.and
            i32.const 1
            i32.add
            local.set 7
            i32.const 0
            local.set 8
            block ;; label = @5
              loop ;; label = @6
                local.get 5
                i32.load
                br_if 1 (;@5;)
                local.get 5
                i32.const 8
                i32.add
                local.set 5
                local.get 8
                i32.const 1
                i32.add
                local.set 8
                local.get 6
                i32.const -8
                i32.add
                local.tee 6
                br_if 0 (;@6;)
              end
              local.get 7
              local.set 8
            end
            block ;; label = @5
              local.get 8
              local.get 3
              i32.le_u
              br_if 0 (;@5;)
              local.get 8
              local.get 3
              i32.const 1051520
              call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
              unreachable
            end
            local.get 3
            local.get 8
            i32.sub
            local.tee 9
            i32.eqz
            br_if 0 (;@4;)
            local.get 2
            local.get 8
            i32.const 3
            i32.shl
            i32.add
            local.set 10
            i32.const 1051644
            i64.extend_i32_u
            i64.const 32
            i64.shl
            i64.const 2
            i64.or
            local.set 11
            loop ;; label = @5
              local.get 4
              i32.const 8
              i32.add
              i32.const 2
              local.get 10
              local.get 9
              call $_ZN4wasi13lib_generated8fd_write17h26c52996b83e471dE
              block ;; label = @6
                block ;; label = @7
                  block ;; label = @8
                    block ;; label = @9
                      local.get 4
                      i32.load16_u offset=8
                      br_if 0 (;@9;)
                      local.get 4
                      i32.load offset=12
                      local.tee 7
                      i32.eqz
                      br_if 1 (;@8;)
                      local.get 10
                      i32.const 4
                      i32.add
                      local.set 5
                      local.get 9
                      i32.const 3
                      i32.shl
                      local.set 2
                      local.get 9
                      i32.const -1
                      i32.add
                      i32.const 536870911
                      i32.and
                      i32.const 1
                      i32.add
                      local.set 12
                      i32.const 0
                      local.set 8
                      i32.const 0
                      local.set 6
                      block ;; label = @10
                        loop ;; label = @11
                          local.get 5
                          i32.load
                          local.get 6
                          i32.add
                          local.tee 3
                          local.get 7
                          i32.gt_u
                          br_if 1 (;@10;)
                          local.get 5
                          i32.const 8
                          i32.add
                          local.set 5
                          local.get 8
                          i32.const 1
                          i32.add
                          local.set 8
                          local.get 3
                          local.set 6
                          local.get 2
                          i32.const -8
                          i32.add
                          local.tee 2
                          br_if 0 (;@11;)
                        end
                        local.get 3
                        local.set 6
                        local.get 12
                        local.set 8
                      end
                      local.get 9
                      local.get 8
                      i32.lt_u
                      br_if 7 (;@2;)
                      local.get 9
                      local.get 8
                      i32.sub
                      local.set 3
                      local.get 10
                      local.get 8
                      i32.const 3
                      i32.shl
                      local.tee 2
                      i32.add
                      local.set 5
                      local.get 9
                      local.get 8
                      i32.ne
                      br_if 2 (;@7;)
                      local.get 5
                      local.set 10
                      local.get 3
                      local.set 9
                      local.get 7
                      local.get 6
                      i32.eq
                      br_if 3 (;@6;)
                      local.get 4
                      i32.const 20
                      i32.add
                      i32.const 1
                      i32.store
                      local.get 4
                      i32.const 28
                      i32.add
                      i32.const 0
                      i32.store
                      local.get 4
                      i32.const 1051576
                      i32.store offset=16
                      local.get 4
                      i32.const 1051184
                      i32.store offset=24
                      local.get 4
                      i32.const 0
                      i32.store offset=8
                      local.get 4
                      i32.const 8
                      i32.add
                      i32.const 1051584
                      call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
                      unreachable
                    end
                    local.get 4
                    local.get 4
                    i32.load16_u offset=10
                    i32.store16 offset=6
                    local.get 4
                    i32.const 6
                    i32.add
                    call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
                    local.tee 5
                    i32.const 65535
                    i32.and
                    call $_ZN3std3sys4wasi17decode_error_kind17hf13b07452e633c92E
                    i32.const 255
                    i32.and
                    i32.const 35
                    i32.eq
                    br_if 2 (;@6;)
                    local.get 5
                    i64.extend_i32_u
                    i64.const 65535
                    i64.and
                    i64.const 32
                    i64.shl
                    local.set 11
                  end
                  local.get 0
                  local.get 11
                  i64.store align=4
                  br 4 (;@3;)
                end
                local.get 10
                local.get 2
                i32.add
                local.tee 2
                i32.load offset=4
                local.tee 9
                local.get 7
                local.get 6
                i32.sub
                local.tee 8
                i32.lt_u
                br_if 5 (;@1;)
                local.get 2
                i32.const 4
                i32.add
                local.get 9
                local.get 8
                i32.sub
                i32.store
                local.get 5
                local.get 5
                i32.load
                local.get 8
                i32.add
                i32.store
                local.get 5
                local.set 10
                local.get 3
                local.set 9
              end
              local.get 9
              br_if 0 (;@5;)
            end
          end
          local.get 0
          i32.const 4
          i32.store8
        end
        local.get 4
        i32.const 32
        i32.add
        global.set $__stack_pointer
        return
      end
      local.get 8
      local.get 9
      i32.const 1051520
      call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
      unreachable
    end
    local.get 4
    i32.const 20
    i32.add
    i32.const 1
    i32.store
    local.get 4
    i32.const 28
    i32.add
    i32.const 0
    i32.store
    local.get 4
    i32.const 1052876
    i32.store offset=16
    local.get 4
    i32.const 1051184
    i32.store offset=24
    local.get 4
    i32.const 0
    i32.store offset=8
    local.get 4
    i32.const 8
    i32.add
    i32.const 1052916
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN3std2io5Write9write_all17h544eaae0cf5cf6cdE (;178;) (type 8) (param i32 i32 i32 i32)
    (local i32 i64 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 4
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 3
        i32.eqz
        br_if 0 (;@2;)
        i32.const 1051644
        i64.extend_i32_u
        i64.const 32
        i64.shl
        i64.const 2
        i64.or
        local.set 5
        loop ;; label = @3
          local.get 4
          local.get 3
          i32.store offset=12
          local.get 4
          local.get 2
          i32.store offset=8
          local.get 4
          i32.const 16
          i32.add
          i32.const 2
          local.get 4
          i32.const 8
          i32.add
          i32.const 1
          call $_ZN4wasi13lib_generated8fd_write17h26c52996b83e471dE
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  local.get 4
                  i32.load16_u offset=16
                  br_if 0 (;@7;)
                  local.get 4
                  i32.load offset=20
                  local.tee 6
                  i32.eqz
                  br_if 1 (;@6;)
                  local.get 3
                  local.get 6
                  i32.lt_u
                  br_if 2 (;@5;)
                  local.get 3
                  local.get 6
                  i32.sub
                  local.set 3
                  local.get 2
                  local.get 6
                  i32.add
                  local.set 2
                  br 3 (;@4;)
                end
                local.get 4
                local.get 4
                i32.load16_u offset=18
                i32.store16 offset=30
                local.get 4
                i32.const 30
                i32.add
                call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
                local.tee 6
                i32.const 65535
                i32.and
                call $_ZN3std3sys4wasi17decode_error_kind17hf13b07452e633c92E
                i32.const 255
                i32.and
                i32.const 35
                i32.eq
                br_if 2 (;@4;)
                local.get 6
                i64.extend_i32_u
                i64.const 65535
                i64.and
                i64.const 32
                i64.shl
                local.set 5
              end
              local.get 0
              local.get 5
              i64.store align=4
              br 4 (;@1;)
            end
            local.get 6
            local.get 3
            i32.const 1051600
            call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
            unreachable
          end
          local.get 3
          br_if 0 (;@3;)
        end
      end
      local.get 0
      i32.const 4
      i32.store8
    end
    local.get 4
    i32.const 32
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN3std2io5Write18write_all_vectored17h7d2f89f47ec58282E (;179;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 4
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 3
            i32.eqz
            br_if 0 (;@4;)
            local.get 2
            i32.const 4
            i32.add
            local.set 5
            local.get 3
            i32.const 3
            i32.shl
            local.set 6
            local.get 3
            i32.const -1
            i32.add
            i32.const 536870911
            i32.and
            i32.const 1
            i32.add
            local.set 7
            i32.const 0
            local.set 8
            block ;; label = @5
              loop ;; label = @6
                local.get 5
                i32.load
                br_if 1 (;@5;)
                local.get 5
                i32.const 8
                i32.add
                local.set 5
                local.get 8
                i32.const 1
                i32.add
                local.set 8
                local.get 6
                i32.const -8
                i32.add
                local.tee 6
                br_if 0 (;@6;)
              end
              local.get 7
              local.set 8
            end
            block ;; label = @5
              local.get 8
              local.get 3
              i32.le_u
              br_if 0 (;@5;)
              local.get 8
              local.get 3
              i32.const 1051520
              call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
              unreachable
            end
            local.get 3
            local.get 8
            i32.sub
            local.tee 9
            i32.eqz
            br_if 0 (;@4;)
            local.get 2
            local.get 8
            i32.const 3
            i32.shl
            i32.add
            local.set 10
            loop ;; label = @5
              local.get 9
              i32.const -1
              i32.add
              i32.const 536870911
              i32.and
              local.tee 6
              i32.const 1
              i32.add
              local.tee 11
              i32.const 7
              i32.and
              local.set 8
              i32.const 0
              local.set 3
              local.get 10
              local.set 5
              block ;; label = @6
                local.get 6
                i32.const 7
                i32.lt_u
                br_if 0 (;@6;)
                local.get 10
                i32.const 60
                i32.add
                local.set 5
                local.get 11
                i32.const 1073741816
                i32.and
                local.set 6
                i32.const 0
                local.set 3
                loop ;; label = @7
                  local.get 5
                  i32.load
                  local.get 5
                  i32.const -8
                  i32.add
                  i32.load
                  local.get 5
                  i32.const -16
                  i32.add
                  i32.load
                  local.get 5
                  i32.const -24
                  i32.add
                  i32.load
                  local.get 5
                  i32.const -32
                  i32.add
                  i32.load
                  local.get 5
                  i32.const -40
                  i32.add
                  i32.load
                  local.get 5
                  i32.const -48
                  i32.add
                  i32.load
                  local.get 5
                  i32.const -56
                  i32.add
                  i32.load
                  local.get 3
                  i32.add
                  i32.add
                  i32.add
                  i32.add
                  i32.add
                  i32.add
                  i32.add
                  i32.add
                  local.set 3
                  local.get 5
                  i32.const 64
                  i32.add
                  local.set 5
                  local.get 6
                  i32.const -8
                  i32.add
                  local.tee 6
                  br_if 0 (;@7;)
                end
                local.get 5
                i32.const -60
                i32.add
                local.set 5
              end
              block ;; label = @6
                local.get 8
                i32.eqz
                br_if 0 (;@6;)
                local.get 5
                i32.const 4
                i32.add
                local.set 5
                loop ;; label = @7
                  local.get 5
                  i32.load
                  local.get 3
                  i32.add
                  local.set 3
                  local.get 5
                  i32.const 8
                  i32.add
                  local.set 5
                  local.get 8
                  i32.const -1
                  i32.add
                  local.tee 8
                  br_if 0 (;@7;)
                end
              end
              local.get 9
              i32.const 3
              i32.shl
              local.set 12
              block ;; label = @6
                local.get 1
                i32.load
                local.get 1
                i32.load offset=8
                local.tee 5
                i32.sub
                local.get 3
                i32.ge_u
                br_if 0 (;@6;)
                local.get 1
                local.get 5
                local.get 3
                call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE
                local.get 1
                i32.load offset=8
                local.set 5
              end
              local.get 10
              local.get 12
              i32.add
              local.set 7
              local.get 10
              local.set 8
              loop ;; label = @6
                local.get 8
                i32.load
                local.set 2
                block ;; label = @7
                  local.get 1
                  i32.load
                  local.get 5
                  i32.sub
                  local.get 8
                  i32.const 4
                  i32.add
                  i32.load
                  local.tee 6
                  i32.ge_u
                  br_if 0 (;@7;)
                  local.get 1
                  local.get 5
                  local.get 6
                  call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE
                  local.get 1
                  i32.load offset=8
                  local.set 5
                end
                local.get 1
                i32.load offset=4
                local.get 5
                i32.add
                local.get 2
                local.get 6
                call $memcpy
                drop
                local.get 1
                local.get 5
                local.get 6
                i32.add
                local.tee 5
                i32.store offset=8
                local.get 8
                i32.const 8
                i32.add
                local.tee 8
                local.get 7
                i32.ne
                br_if 0 (;@6;)
              end
              block ;; label = @6
                local.get 3
                br_if 0 (;@6;)
                local.get 0
                i32.const 1051644
                i64.extend_i32_u
                i64.const 32
                i64.shl
                i64.const 2
                i64.or
                i64.store align=4
                br 3 (;@3;)
              end
              local.get 10
              i32.const 4
              i32.add
              local.set 5
              i32.const 0
              local.set 8
              i32.const 0
              local.set 6
              block ;; label = @6
                loop ;; label = @7
                  local.get 5
                  i32.load
                  local.get 6
                  i32.add
                  local.tee 2
                  local.get 3
                  i32.gt_u
                  br_if 1 (;@6;)
                  local.get 5
                  i32.const 8
                  i32.add
                  local.set 5
                  local.get 8
                  i32.const 1
                  i32.add
                  local.set 8
                  local.get 2
                  local.set 6
                  local.get 12
                  i32.const -8
                  i32.add
                  local.tee 12
                  br_if 0 (;@7;)
                end
                local.get 2
                local.set 6
                local.get 11
                local.set 8
              end
              local.get 9
              local.get 8
              i32.lt_u
              br_if 3 (;@2;)
              local.get 10
              local.get 8
              i32.const 3
              i32.shl
              local.tee 2
              i32.add
              local.set 5
              block ;; label = @6
                block ;; label = @7
                  local.get 9
                  local.get 8
                  i32.ne
                  br_if 0 (;@7;)
                  local.get 3
                  local.get 6
                  i32.eq
                  br_if 1 (;@6;)
                  local.get 4
                  i32.const 20
                  i32.add
                  i32.const 1
                  i32.store
                  local.get 4
                  i32.const 28
                  i32.add
                  i32.const 0
                  i32.store
                  local.get 4
                  i32.const 1051576
                  i32.store offset=16
                  local.get 4
                  i32.const 1051184
                  i32.store offset=24
                  local.get 4
                  i32.const 0
                  i32.store offset=8
                  local.get 4
                  i32.const 8
                  i32.add
                  i32.const 1051584
                  call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
                  unreachable
                end
                local.get 10
                local.get 2
                i32.add
                local.tee 2
                i32.load offset=4
                local.tee 7
                local.get 3
                local.get 6
                i32.sub
                local.tee 6
                i32.lt_u
                br_if 5 (;@1;)
                local.get 2
                i32.const 4
                i32.add
                local.get 7
                local.get 6
                i32.sub
                i32.store
                local.get 5
                local.get 5
                i32.load
                local.get 6
                i32.add
                i32.store
              end
              local.get 5
              local.set 10
              local.get 9
              local.get 8
              i32.sub
              local.tee 9
              br_if 0 (;@5;)
            end
          end
          local.get 0
          i32.const 4
          i32.store8
        end
        local.get 4
        i32.const 32
        i32.add
        global.set $__stack_pointer
        return
      end
      local.get 8
      local.get 9
      i32.const 1051520
      call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
      unreachable
    end
    local.get 4
    i32.const 20
    i32.add
    i32.const 1
    i32.store
    local.get 4
    i32.const 28
    i32.add
    i32.const 0
    i32.store
    local.get 4
    i32.const 1052876
    i32.store offset=16
    local.get 4
    i32.const 1051184
    i32.store offset=24
    local.get 4
    i32.const 0
    i32.store offset=8
    local.get 4
    i32.const 8
    i32.add
    i32.const 1052916
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN3std2io5Write9write_fmt17h80e619ee06f416f6E (;180;) (type 2) (param i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    local.get 3
    i32.const 4
    i32.store8 offset=8
    local.get 3
    local.get 1
    i32.store offset=16
    local.get 3
    i32.const 24
    i32.add
    i32.const 16
    i32.add
    local.get 2
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 3
    i32.const 24
    i32.add
    i32.const 8
    i32.add
    local.get 2
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 3
    local.get 2
    i64.load align=4
    i64.store offset=24
    block ;; label = @1
      block ;; label = @2
        local.get 3
        i32.const 8
        i32.add
        i32.const 1051684
        local.get 3
        i32.const 24
        i32.add
        call $_ZN4core3fmt5write17h7558535140974479E
        i32.eqz
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 3
          i32.load8_u offset=8
          i32.const 4
          i32.ne
          br_if 0 (;@3;)
          local.get 0
          i32.const 1051672
          i32.store offset=4
          local.get 0
          i32.const 2
          i32.store
          br 2 (;@1;)
        end
        local.get 0
        local.get 3
        i64.load offset=8
        i64.store align=4
        br 1 (;@1;)
      end
      local.get 0
      i32.const 4
      i32.store8
      local.get 3
      i32.load8_u offset=8
      i32.const 3
      i32.ne
      br_if 0 (;@1;)
      local.get 3
      i32.load offset=12
      local.tee 2
      i32.load
      local.get 2
      i32.load offset=4
      i32.load
      call_indirect (type $.rodata)
      block ;; label = @2
        local.get 2
        i32.load offset=4
        local.tee 0
        i32.const 4
        i32.add
        i32.load
        local.tee 1
        i32.eqz
        br_if 0 (;@2;)
        local.get 2
        i32.load
        local.get 1
        local.get 0
        i32.const 8
        i32.add
        i32.load
        call $__rust_dealloc
      end
      local.get 3
      i32.load offset=12
      i32.const 12
      i32.const 4
      call $__rust_dealloc
    end
    local.get 3
    i32.const 48
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN80_$LT$std..io..Write..write_fmt..Adapter$LT$T$GT$$u20$as$u20$core..fmt..Write$GT$9write_str17hc76d2b6fa3488422E (;181;) (type 4) (param i32 i32 i32) (result i32)
    (local i32)
    block ;; label = @1
      local.get 0
      i32.load offset=8
      local.tee 0
      i32.load
      local.get 0
      i32.load offset=8
      local.tee 3
      i32.sub
      local.get 2
      i32.ge_u
      br_if 0 (;@1;)
      local.get 0
      local.get 3
      local.get 2
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h38d580c29fc2385cE
      local.get 0
      i32.load offset=8
      local.set 3
    end
    local.get 0
    i32.load offset=4
    local.get 3
    i32.add
    local.get 1
    local.get 2
    call $memcpy
    drop
    local.get 0
    local.get 3
    local.get 2
    i32.add
    i32.store offset=8
    i32.const 0
  )
  (func $_ZN3std5panic19get_backtrace_style17h1cc96ffe00155ad1E (;182;) (type 12) (result i32)
    (local i32 i32 i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 0
    global.set $__stack_pointer
    i32.const 0
    local.set 1
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              i32.const 0
              i32.load offset=1054832
              br_table 3 (;@2;) 4 (;@1;) 1 (;@4;) 2 (;@3;) 0 (;@5;)
            end
            i32.const 1051247
            i32.const 40
            i32.const 1051756
            call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
            unreachable
          end
          i32.const 1
          local.set 1
          br 2 (;@1;)
        end
        i32.const 2
        local.set 1
        br 1 (;@1;)
      end
      local.get 0
      i32.const 1051436
      i32.const 14
      call $_ZN3std3env7_var_os17hcf2213876bb081deE
      block ;; label = @2
        block ;; label = @3
          local.get 0
          i32.load offset=4
          local.tee 1
          i32.eqz
          br_if 0 (;@3;)
          i32.const 0
          local.set 2
          local.get 0
          i32.load
          local.set 3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                local.get 0
                i32.load offset=8
                i32.const -1
                i32.add
                br_table 0 (;@6;) 2 (;@4;) 2 (;@4;) 1 (;@5;) 2 (;@4;)
              end
              i32.const -2
              i32.const 0
              local.get 1
              i32.load8_u
              i32.const 48
              i32.eq
              select
              local.set 2
              br 1 (;@4;)
            end
            local.get 1
            i32.load align=1
            i32.const 1819047270
            i32.eq
            local.set 2
          end
          block ;; label = @4
            local.get 3
            i32.eqz
            br_if 0 (;@4;)
            local.get 1
            local.get 3
            i32.const 1
            call $__rust_dealloc
          end
          i32.const 1
          local.set 3
          i32.const 0
          local.set 1
          block ;; label = @4
            local.get 2
            i32.const 3
            i32.and
            br_table 2 (;@2;) 0 (;@4;) 1 (;@3;) 2 (;@2;)
          end
          i32.const 2
          local.set 3
          i32.const 1
          local.set 1
          br 1 (;@2;)
        end
        i32.const 3
        local.set 3
        i32.const 2
        local.set 1
      end
      i32.const 0
      local.get 3
      i32.store offset=1054832
    end
    local.get 0
    i32.const 16
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN3std7process5abort17hced5683ecdf4a442E (;183;) (type 7)
    call $_ZN3std3sys4wasi14abort_internal17h761afe555b0460d5E
    unreachable
  )
  (func $_ZN3std10sys_common9backtrace5print17hfed6eeff6e740e7cE (;184;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 4
    global.set $__stack_pointer
    i32.const 0
    i32.load8_u offset=1054836
    local.set 5
    i32.const 1
    local.set 6
    i32.const 0
    i32.const 1
    i32.store8 offset=1054836
    local.get 4
    local.get 5
    i32.store8 offset=32
    block ;; label = @1
      local.get 5
      br_if 0 (;@1;)
      block ;; label = @2
        i32.const 0
        i32.load offset=1054860
        i32.const 2147483647
        i32.and
        i32.eqz
        br_if 0 (;@2;)
        call $_ZN3std9panicking11panic_count17is_zero_slow_path17he73cea3e605a507aE
        local.set 6
      end
      local.get 2
      i32.const 36
      i32.add
      i32.load
      local.set 5
      local.get 4
      i32.const 20
      i32.add
      i32.const 1
      i32.store
      local.get 4
      i32.const 28
      i32.add
      i32.const 1
      i32.store
      local.get 4
      i32.const 1051452
      i32.store offset=16
      local.get 4
      i32.const 0
      i32.store offset=8
      local.get 4
      i32.const 10
      i32.store offset=36
      local.get 4
      local.get 3
      i32.store8 offset=47
      local.get 4
      local.get 4
      i32.const 32
      i32.add
      i32.store offset=24
      local.get 4
      local.get 4
      i32.const 47
      i32.add
      i32.store offset=32
      local.get 0
      local.get 1
      local.get 4
      i32.const 8
      i32.add
      local.get 5
      call_indirect (type 2)
      block ;; label = @2
        local.get 6
        i32.eqz
        br_if 0 (;@2;)
        i32.const 0
        i32.load offset=1054860
        i32.const 2147483647
        i32.and
        i32.eqz
        br_if 0 (;@2;)
        call $_ZN3std9panicking11panic_count17is_zero_slow_path17he73cea3e605a507aE
        br_if 0 (;@2;)
        i32.const 0
        i32.const 1
        i32.store8 offset=1054837
      end
      i32.const 0
      i32.const 0
      i32.store8 offset=1054836
      local.get 4
      i32.const 48
      i32.add
      global.set $__stack_pointer
      return
    end
    local.get 4
    i32.const 0
    i32.store offset=28
    local.get 4
    i32.const 1051184
    i32.store offset=24
    local.get 4
    i32.const 1
    i32.store offset=20
    local.get 4
    i32.const 1052964
    i32.store offset=16
    local.get 4
    i32.const 0
    i32.store offset=8
    local.get 4
    i32.const 32
    i32.add
    local.get 4
    i32.const 8
    i32.add
    call $_ZN4core9panicking13assert_failed17hd77b42a9e8961af9E
    unreachable
  )
  (func $_ZN91_$LT$std..sys_common..backtrace.._print..DisplayBacktrace$u20$as$u20$core..fmt..Display$GT$3fmt17h6e8846cac7369070E (;185;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 0
    i32.load8_u
    local.set 3
    local.get 2
    i32.const 8
    i32.add
    call $_ZN3std3env11current_dir17hb9d80cddcbfbdb2eE
    block ;; label = @1
      block ;; label = @2
        local.get 2
        i32.load offset=8
        br_if 0 (;@2;)
        local.get 2
        i32.const 16
        i32.add
        i32.load
        local.set 0
        local.get 2
        i32.load offset=12
        local.set 4
        br 1 (;@1;)
      end
      i32.const 0
      local.set 0
      block ;; label = @2
        local.get 2
        i32.load8_u offset=12
        i32.const 3
        i32.ne
        br_if 0 (;@2;)
        local.get 2
        i32.const 8
        i32.add
        i32.const 8
        i32.add
        i32.load
        local.tee 5
        i32.load
        local.get 5
        i32.load offset=4
        i32.load
        call_indirect (type $.rodata)
        block ;; label = @3
          local.get 5
          i32.load offset=4
          local.tee 4
          i32.const 4
          i32.add
          i32.load
          local.tee 6
          i32.eqz
          br_if 0 (;@3;)
          local.get 5
          i32.load
          local.get 6
          local.get 4
          i32.const 8
          i32.add
          i32.load
          call $__rust_dealloc
        end
        local.get 5
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
    end
    i32.const 1
    local.set 5
    local.get 2
    i32.const 20
    i32.add
    i32.const 1
    i32.store
    local.get 2
    i32.const 28
    i32.add
    i32.const 0
    i32.store
    local.get 2
    i32.const 1051860
    i32.store offset=16
    local.get 2
    i32.const 1051184
    i32.store offset=24
    local.get 2
    i32.const 0
    i32.store offset=8
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 1
            local.get 2
            i32.const 8
            i32.add
            call $_ZN4core3fmt9Formatter9write_fmt17hdae39eebc223cfffE
            br_if 0 (;@4;)
            local.get 3
            i32.const 255
            i32.and
            br_if 1 (;@3;)
            local.get 2
            i32.const 20
            i32.add
            i32.const 1
            i32.store
            local.get 2
            i32.const 28
            i32.add
            i32.const 0
            i32.store
            local.get 2
            i32.const 1051956
            i32.store offset=16
            local.get 2
            i32.const 1051184
            i32.store offset=24
            local.get 2
            i32.const 0
            i32.store offset=8
            local.get 1
            local.get 2
            i32.const 8
            i32.add
            call $_ZN4core3fmt9Formatter9write_fmt17hdae39eebc223cfffE
            i32.eqz
            br_if 1 (;@3;)
          end
          local.get 0
          i32.eqz
          br_if 2 (;@1;)
          local.get 4
          i32.eqz
          br_if 2 (;@1;)
          br 1 (;@2;)
        end
        i32.const 0
        local.set 5
        local.get 0
        i32.eqz
        br_if 1 (;@1;)
        local.get 4
        i32.eqz
        br_if 1 (;@1;)
      end
      local.get 0
      local.get 4
      i32.const 1
      call $__rust_dealloc
    end
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 5
  )
  (func $_ZN3std10sys_common9backtrace26__rust_end_short_backtrace17h426b71926848cb31E (;186;) (type $.rodata) (param i32)
    local.get 0
    call $_ZN3std9panicking19begin_panic_handler28_$u7b$$u7b$closure$u7d$$u7d$17h749586aa4ef76f6fE
    unreachable
  )
  (func $_ZN3std9panicking19begin_panic_handler28_$u7b$$u7b$closure$u7d$$u7d$17h749586aa4ef76f6fE (;187;) (type $.rodata) (param i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 1
    global.set $__stack_pointer
    local.get 0
    i32.load
    local.tee 2
    i32.const 20
    i32.add
    i32.load
    local.set 3
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 2
            i32.const 12
            i32.add
            i32.load
            br_table 0 (;@4;) 1 (;@3;) 3 (;@1;)
          end
          local.get 3
          br_if 2 (;@1;)
          i32.const 1051184
          local.set 2
          i32.const 0
          local.set 3
          br 1 (;@2;)
        end
        local.get 3
        br_if 1 (;@1;)
        local.get 2
        i32.load offset=8
        local.tee 2
        i32.load offset=4
        local.set 3
        local.get 2
        i32.load
        local.set 2
      end
      local.get 1
      local.get 3
      i32.store offset=4
      local.get 1
      local.get 2
      i32.store
      local.get 1
      i32.const 1052528
      local.get 0
      i32.load offset=4
      local.tee 2
      call $_ZN4core5panic10panic_info9PanicInfo7message17hbfef73d098d3c2a5E
      local.get 0
      i32.load offset=8
      local.get 2
      call $_ZN4core5panic10panic_info9PanicInfo10can_unwind17h23da1c404642e99aE
      call $_ZN3std9panicking20rust_panic_with_hook17h1c67ce6bc4eb31b7E
      unreachable
    end
    local.get 1
    i32.const 0
    i32.store offset=4
    local.get 1
    local.get 2
    i32.store offset=12
    local.get 1
    i32.const 1052508
    local.get 0
    i32.load offset=4
    local.tee 2
    call $_ZN4core5panic10panic_info9PanicInfo7message17hbfef73d098d3c2a5E
    local.get 0
    i32.load offset=8
    local.get 2
    call $_ZN4core5panic10panic_info9PanicInfo10can_unwind17h23da1c404642e99aE
    call $_ZN3std9panicking20rust_panic_with_hook17h1c67ce6bc4eb31b7E
    unreachable
  )
  (func $_ZN3std5alloc24default_alloc_error_hook17h1faf522cf81e449fE (;188;) (type 3) (param i32 i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 64
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      i32.const 0
      i32.load8_u offset=1054816
      br_if 0 (;@1;)
      local.get 2
      i32.const 7
      i32.store offset=4
      local.get 2
      local.get 0
      i32.store offset=12
      local.get 2
      local.get 2
      i32.const 12
      i32.add
      i32.store
      local.get 2
      i32.const 4
      i32.store8 offset=16
      local.get 2
      local.get 2
      i32.const 56
      i32.add
      i32.store offset=24
      local.get 2
      i32.const 1
      i32.store offset=52
      local.get 2
      i32.const 2
      i32.store offset=44
      local.get 2
      i32.const 1052132
      i32.store offset=40
      local.get 2
      i32.const 0
      i32.store offset=32
      local.get 2
      local.get 2
      i32.store offset=48
      local.get 2
      i32.const 16
      i32.add
      i32.const 1051708
      local.get 2
      i32.const 32
      i32.add
      call $_ZN4core3fmt5write17h7558535140974479E
      local.set 0
      local.get 2
      i32.load8_u offset=16
      local.set 3
      block ;; label = @2
        block ;; label = @3
          local.get 0
          i32.eqz
          br_if 0 (;@3;)
          local.get 3
          i32.const 255
          i32.and
          i32.const 4
          i32.eq
          br_if 1 (;@2;)
          local.get 2
          i32.load8_u offset=16
          i32.const 3
          i32.ne
          br_if 1 (;@2;)
          local.get 2
          i32.load offset=20
          local.tee 0
          i32.load
          local.get 0
          i32.load offset=4
          i32.load
          call_indirect (type $.rodata)
          block ;; label = @4
            local.get 0
            i32.load offset=4
            local.tee 3
            i32.const 4
            i32.add
            i32.load
            local.tee 4
            i32.eqz
            br_if 0 (;@4;)
            local.get 0
            i32.load
            local.get 4
            local.get 3
            i32.const 8
            i32.add
            i32.load
            call $__rust_dealloc
          end
          local.get 0
          i32.const 12
          i32.const 4
          call $__rust_dealloc
          br 1 (;@2;)
        end
        local.get 3
        i32.const 255
        i32.and
        i32.const 3
        i32.ne
        br_if 0 (;@2;)
        local.get 2
        i32.load offset=20
        local.tee 0
        i32.load
        local.get 0
        i32.load offset=4
        i32.load
        call_indirect (type $.rodata)
        block ;; label = @3
          local.get 0
          i32.load offset=4
          local.tee 3
          i32.const 4
          i32.add
          i32.load
          local.tee 4
          i32.eqz
          br_if 0 (;@3;)
          local.get 0
          i32.load
          local.get 4
          local.get 3
          i32.const 8
          i32.add
          i32.load
          call $__rust_dealloc
        end
        local.get 2
        i32.load offset=20
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      local.get 2
      i32.const 64
      i32.add
      global.set $__stack_pointer
      return
    end
    local.get 2
    i32.const 44
    i32.add
    i32.const 2
    i32.store
    local.get 2
    i32.const 52
    i32.add
    i32.const 1
    i32.store
    local.get 2
    i32.const 1052060
    i32.store offset=40
    local.get 2
    i32.const 0
    i32.store offset=32
    local.get 2
    i32.const 7
    i32.store offset=20
    local.get 2
    local.get 0
    i32.store
    local.get 2
    local.get 2
    i32.const 16
    i32.add
    i32.store offset=48
    local.get 2
    local.get 2
    i32.store offset=16
    local.get 2
    i32.const 32
    i32.add
    i32.const 1052100
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $__rdl_alloc (;189;) (type 5) (param i32 i32) (result i32)
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.const 8
        i32.gt_u
        br_if 0 (;@2;)
        local.get 1
        local.get 0
        i32.le_u
        br_if 1 (;@1;)
      end
      local.get 1
      local.get 0
      call $aligned_alloc
      return
    end
    local.get 0
    call $malloc
  )
  (func $__rdl_dealloc (;190;) (type 2) (param i32 i32 i32)
    local.get 0
    call $free
  )
  (func $__rdl_realloc (;191;) (type 6) (param i32 i32 i32 i32) (result i32)
    block ;; label = @1
      block ;; label = @2
        local.get 2
        i32.const 8
        i32.gt_u
        br_if 0 (;@2;)
        local.get 2
        local.get 3
        i32.le_u
        br_if 1 (;@1;)
      end
      block ;; label = @2
        local.get 2
        local.get 3
        call $aligned_alloc
        local.tee 2
        br_if 0 (;@2;)
        i32.const 0
        return
      end
      local.get 2
      local.get 0
      local.get 1
      local.get 3
      local.get 1
      local.get 3
      i32.lt_u
      select
      call $memcpy
      local.set 3
      local.get 0
      call $free
      local.get 3
      return
    end
    local.get 0
    local.get 3
    call $realloc
  )
  (func $__rdl_alloc_zeroed (;192;) (type 5) (param i32 i32) (result i32)
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          local.get 1
          i32.const 8
          i32.gt_u
          br_if 0 (;@3;)
          local.get 1
          local.get 0
          i32.le_u
          br_if 1 (;@2;)
        end
        local.get 1
        local.get 0
        call $aligned_alloc
        local.tee 1
        br_if 1 (;@1;)
        i32.const 0
        return
      end
      local.get 0
      i32.const 1
      call $calloc
      return
    end
    local.get 1
    i32.const 0
    local.get 0
    call $memset
  )
  (func $_ZN3std9panicking12default_hook28_$u7b$$u7b$closure$u7d$$u7d$17h623f4dc81025ab51E (;193;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    i32.const 64
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    local.get 3
    i32.const 16
    i32.add
    i32.const 12
    i32.add
    i32.const 4
    i32.store
    local.get 3
    i32.const 16
    i32.add
    i32.const 20
    i32.add
    i32.const 3
    i32.store
    local.get 3
    i32.const 40
    i32.add
    i32.const 20
    i32.add
    i32.const 11
    i32.store
    local.get 3
    i32.const 40
    i32.add
    i32.const 12
    i32.add
    i32.const 12
    i32.store
    local.get 3
    i32.const 1052324
    i32.store offset=24
    local.get 3
    i32.const 0
    i32.store offset=16
    local.get 3
    i32.const 12
    i32.store offset=44
    local.get 3
    local.get 0
    i32.load offset=8
    i32.store offset=56
    local.get 3
    local.get 0
    i32.load offset=4
    i32.store offset=48
    local.get 3
    local.get 0
    i32.load
    i32.store offset=40
    local.get 3
    local.get 3
    i32.const 40
    i32.add
    i32.store offset=32
    local.get 3
    i32.const 8
    i32.add
    local.get 1
    local.get 3
    i32.const 16
    i32.add
    local.get 2
    i32.load offset=36
    local.tee 4
    call_indirect (type 2)
    block ;; label = @1
      local.get 3
      i32.load8_u offset=8
      i32.const 3
      i32.ne
      br_if 0 (;@1;)
      local.get 3
      i32.load offset=12
      local.tee 5
      i32.load
      local.get 5
      i32.load offset=4
      i32.load
      call_indirect (type $.rodata)
      block ;; label = @2
        local.get 5
        i32.load offset=4
        local.tee 6
        i32.const 4
        i32.add
        i32.load
        local.tee 7
        i32.eqz
        br_if 0 (;@2;)
        local.get 5
        i32.load
        local.get 7
        local.get 6
        i32.const 8
        i32.add
        i32.load
        call $__rust_dealloc
      end
      local.get 5
      i32.const 12
      i32.const 4
      call $__rust_dealloc
    end
    block ;; label = @1
      local.get 0
      i32.load offset=12
      i32.load8_u
      local.tee 0
      i32.const 3
      i32.eq
      br_if 0 (;@1;)
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 0
            br_table 0 (;@4;) 1 (;@3;) 2 (;@2;) 0 (;@4;)
          end
          local.get 3
          i32.const 40
          i32.add
          local.get 1
          local.get 2
          i32.const 0
          call $_ZN3std10sys_common9backtrace5print17hfed6eeff6e740e7cE
          local.get 3
          i32.load8_u offset=40
          i32.const 3
          i32.ne
          br_if 2 (;@1;)
          local.get 3
          i32.load offset=44
          local.tee 0
          i32.load
          local.get 0
          i32.load offset=4
          i32.load
          call_indirect (type $.rodata)
          block ;; label = @4
            local.get 0
            i32.load offset=4
            local.tee 1
            i32.const 4
            i32.add
            i32.load
            local.tee 2
            i32.eqz
            br_if 0 (;@4;)
            local.get 0
            i32.load
            local.get 2
            local.get 1
            i32.const 8
            i32.add
            i32.load
            call $__rust_dealloc
          end
          local.get 0
          i32.const 12
          i32.const 4
          call $__rust_dealloc
          br 2 (;@1;)
        end
        local.get 3
        i32.const 40
        i32.add
        local.get 1
        local.get 2
        i32.const 1
        call $_ZN3std10sys_common9backtrace5print17hfed6eeff6e740e7cE
        local.get 3
        i32.load8_u offset=40
        i32.const 3
        i32.ne
        br_if 1 (;@1;)
        local.get 3
        i32.load offset=44
        local.tee 0
        i32.load
        local.get 0
        i32.load offset=4
        i32.load
        call_indirect (type $.rodata)
        block ;; label = @3
          local.get 0
          i32.load offset=4
          local.tee 1
          i32.const 4
          i32.add
          i32.load
          local.tee 2
          i32.eqz
          br_if 0 (;@3;)
          local.get 0
          i32.load
          local.get 2
          local.get 1
          i32.const 8
          i32.add
          i32.load
          call $__rust_dealloc
        end
        local.get 0
        i32.const 12
        i32.const 4
        call $__rust_dealloc
        br 1 (;@1;)
      end
      i32.const 0
      i32.load8_u offset=1054804
      local.set 0
      i32.const 0
      i32.const 0
      i32.store8 offset=1054804
      local.get 0
      i32.eqz
      br_if 0 (;@1;)
      local.get 3
      i32.const 52
      i32.add
      i32.const 1
      i32.store
      local.get 3
      i32.const 60
      i32.add
      i32.const 0
      i32.store
      local.get 3
      i32.const 1052436
      i32.store offset=48
      local.get 3
      i32.const 1051184
      i32.store offset=56
      local.get 3
      i32.const 0
      i32.store offset=40
      local.get 3
      i32.const 16
      i32.add
      local.get 1
      local.get 3
      i32.const 40
      i32.add
      local.get 4
      call_indirect (type 2)
      local.get 3
      i32.load8_u offset=16
      i32.const 3
      i32.ne
      br_if 0 (;@1;)
      local.get 3
      i32.load offset=20
      local.tee 0
      i32.load
      local.get 0
      i32.load offset=4
      i32.load
      call_indirect (type $.rodata)
      block ;; label = @2
        local.get 0
        i32.load offset=4
        local.tee 1
        i32.const 4
        i32.add
        i32.load
        local.tee 2
        i32.eqz
        br_if 0 (;@2;)
        local.get 0
        i32.load
        local.get 2
        local.get 1
        i32.const 8
        i32.add
        i32.load
        call $__rust_dealloc
      end
      local.get 0
      i32.const 12
      i32.const 4
      call $__rust_dealloc
    end
    local.get 3
    i32.const 64
    i32.add
    global.set $__stack_pointer
  )
  (func $rust_begin_unwind (;194;) (type $.rodata) (param i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 1
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 0
        call $_ZN4core5panic10panic_info9PanicInfo8location17h73a8e3c8110f5f4eE
        local.tee 2
        i32.eqz
        br_if 0 (;@2;)
        local.get 0
        call $_ZN4core5panic10panic_info9PanicInfo7message17hbfef73d098d3c2a5E
        local.tee 3
        i32.eqz
        br_if 1 (;@1;)
        local.get 1
        local.get 2
        i32.store offset=8
        local.get 1
        local.get 0
        i32.store offset=4
        local.get 1
        local.get 3
        i32.store
        local.get 1
        call $_ZN3std10sys_common9backtrace26__rust_end_short_backtrace17h426b71926848cb31E
        unreachable
      end
      i32.const 1051204
      i32.const 43
      i32.const 1052460
      call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
      unreachable
    end
    i32.const 1051204
    i32.const 43
    i32.const 1052444
    call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
    unreachable
  )
  (func $_ZN90_$LT$std..panicking..begin_panic_handler..PanicPayload$u20$as$u20$core..panic..BoxMeUp$GT$8take_box17h0fa45657b266d809E (;195;) (type 3) (param i32 i32)
    (local i32 i32 i32 i64)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      local.get 1
      i32.load offset=4
      br_if 0 (;@1;)
      local.get 1
      i32.load offset=12
      local.set 3
      local.get 2
      i32.const 8
      i32.add
      i32.const 8
      i32.add
      local.tee 4
      i32.const 0
      i32.store
      local.get 2
      i64.const 4294967296
      i64.store offset=8
      local.get 2
      local.get 2
      i32.const 8
      i32.add
      i32.store offset=20
      local.get 2
      i32.const 24
      i32.add
      i32.const 16
      i32.add
      local.get 3
      i32.const 16
      i32.add
      i64.load align=4
      i64.store
      local.get 2
      i32.const 24
      i32.add
      i32.const 8
      i32.add
      local.get 3
      i32.const 8
      i32.add
      i64.load align=4
      i64.store
      local.get 2
      local.get 3
      i64.load align=4
      i64.store offset=24
      local.get 2
      i32.const 20
      i32.add
      i32.const 1051112
      local.get 2
      i32.const 24
      i32.add
      call $_ZN4core3fmt5write17h7558535140974479E
      drop
      local.get 1
      i32.const 8
      i32.add
      local.get 4
      i32.load
      i32.store
      local.get 1
      local.get 2
      i64.load offset=8
      i64.store align=4
    end
    local.get 1
    i64.load align=4
    local.set 5
    local.get 1
    i64.const 4294967296
    i64.store align=4
    local.get 2
    i32.const 24
    i32.add
    i32.const 8
    i32.add
    local.tee 3
    local.get 1
    i32.const 8
    i32.add
    local.tee 1
    i32.load
    i32.store
    local.get 1
    i32.const 0
    i32.store
    local.get 2
    local.get 5
    i64.store offset=24
    block ;; label = @1
      i32.const 12
      i32.const 4
      call $__rust_alloc
      local.tee 1
      br_if 0 (;@1;)
      i32.const 12
      i32.const 4
      call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
      unreachable
    end
    local.get 1
    local.get 2
    i64.load offset=24
    i64.store align=4
    local.get 1
    i32.const 8
    i32.add
    local.get 3
    i32.load
    i32.store
    local.get 0
    i32.const 1052476
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store
    local.get 2
    i32.const 48
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN90_$LT$std..panicking..begin_panic_handler..PanicPayload$u20$as$u20$core..panic..BoxMeUp$GT$3get17h9ce6f22ca87c10fcE (;196;) (type 3) (param i32 i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      local.get 1
      i32.load offset=4
      br_if 0 (;@1;)
      local.get 1
      i32.load offset=12
      local.set 3
      local.get 2
      i32.const 8
      i32.add
      i32.const 8
      i32.add
      local.tee 4
      i32.const 0
      i32.store
      local.get 2
      i64.const 4294967296
      i64.store offset=8
      local.get 2
      local.get 2
      i32.const 8
      i32.add
      i32.store offset=20
      local.get 2
      i32.const 24
      i32.add
      i32.const 16
      i32.add
      local.get 3
      i32.const 16
      i32.add
      i64.load align=4
      i64.store
      local.get 2
      i32.const 24
      i32.add
      i32.const 8
      i32.add
      local.get 3
      i32.const 8
      i32.add
      i64.load align=4
      i64.store
      local.get 2
      local.get 3
      i64.load align=4
      i64.store offset=24
      local.get 2
      i32.const 20
      i32.add
      i32.const 1051112
      local.get 2
      i32.const 24
      i32.add
      call $_ZN4core3fmt5write17h7558535140974479E
      drop
      local.get 1
      i32.const 8
      i32.add
      local.get 4
      i32.load
      i32.store
      local.get 1
      local.get 2
      i64.load offset=8
      i64.store align=4
    end
    local.get 0
    i32.const 1052476
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store
    local.get 2
    i32.const 48
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN93_$LT$std..panicking..begin_panic_handler..StrPanicPayload$u20$as$u20$core..panic..BoxMeUp$GT$8take_box17h61beb27f3cc94c1dE (;197;) (type 3) (param i32 i32)
    (local i32 i32)
    local.get 1
    i32.load offset=4
    local.set 2
    local.get 1
    i32.load
    local.set 3
    block ;; label = @1
      i32.const 8
      i32.const 4
      call $__rust_alloc
      local.tee 1
      br_if 0 (;@1;)
      i32.const 8
      i32.const 4
      call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
      unreachable
    end
    local.get 1
    local.get 2
    i32.store offset=4
    local.get 1
    local.get 3
    i32.store
    local.get 0
    i32.const 1052492
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store
  )
  (func $_ZN93_$LT$std..panicking..begin_panic_handler..StrPanicPayload$u20$as$u20$core..panic..BoxMeUp$GT$3get17h4b420efd9f0fe8bdE (;198;) (type 3) (param i32 i32)
    local.get 0
    i32.const 1052492
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store
  )
  (func $_ZN3std9panicking20rust_panic_with_hook17h1c67ce6bc4eb31b7E (;199;) (type 10) (param i32 i32 i32 i32 i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 112
    i32.sub
    local.tee 5
    global.set $__stack_pointer
    i32.const 0
    i32.const 0
    i32.load offset=1054860
    local.tee 6
    i32.const 1
    i32.add
    i32.store offset=1054860
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  block ;; label = @8
                    local.get 6
                    i32.const -1
                    i32.gt_s
                    br_if 0 (;@8;)
                    local.get 6
                    i32.const 2147483647
                    i32.and
                    i32.const 2
                    i32.gt_u
                    br_if 2 (;@6;)
                    local.get 5
                    local.get 4
                    i32.store8 offset=64
                    local.get 5
                    local.get 3
                    i32.store offset=60
                    local.get 5
                    local.get 2
                    i32.store offset=56
                    local.get 5
                    i32.const 1052608
                    i32.store offset=52
                    local.get 5
                    i32.const 1051184
                    i32.store offset=48
                    local.get 5
                    i32.const 13
                    i32.store offset=76
                    local.get 5
                    local.get 5
                    i32.const 48
                    i32.add
                    i32.store offset=72
                    local.get 5
                    i32.const 4
                    i32.store8 offset=16
                    local.get 5
                    local.get 5
                    i32.const 104
                    i32.add
                    i32.store offset=24
                    local.get 5
                    i32.const 1
                    i32.store offset=100
                    local.get 5
                    i32.const 2
                    i32.store offset=92
                    local.get 5
                    i32.const 1052676
                    i32.store offset=88
                    local.get 5
                    i32.const 0
                    i32.store offset=80
                    local.get 5
                    local.get 5
                    i32.const 72
                    i32.add
                    i32.store offset=96
                    local.get 5
                    i32.const 16
                    i32.add
                    i32.const 1051708
                    local.get 5
                    i32.const 80
                    i32.add
                    call $_ZN4core3fmt5write17h7558535140974479E
                    local.set 6
                    local.get 5
                    i32.load8_u offset=16
                    local.set 4
                    local.get 6
                    i32.eqz
                    br_if 1 (;@7;)
                    local.get 4
                    i32.const 255
                    i32.and
                    i32.const 4
                    i32.eq
                    br_if 7 (;@1;)
                    local.get 5
                    i32.load8_u offset=16
                    i32.const 3
                    i32.ne
                    br_if 7 (;@1;)
                    local.get 5
                    i32.load offset=20
                    local.tee 5
                    i32.load
                    local.get 5
                    i32.load offset=4
                    i32.load
                    call_indirect (type $.rodata)
                    block ;; label = @9
                      local.get 5
                      i32.load offset=4
                      local.tee 6
                      i32.const 4
                      i32.add
                      i32.load
                      local.tee 4
                      i32.eqz
                      br_if 0 (;@9;)
                      local.get 5
                      i32.load
                      local.get 4
                      local.get 6
                      i32.const 8
                      i32.add
                      i32.load
                      call $__rust_dealloc
                    end
                    local.get 5
                    i32.const 12
                    i32.const 4
                    call $__rust_dealloc
                    call $_ZN3std3sys4wasi14abort_internal17h761afe555b0460d5E
                    unreachable
                  end
                  i32.const 0
                  i32.const 0
                  i32.load offset=1054888
                  i32.const 1
                  i32.add
                  local.tee 6
                  i32.store offset=1054888
                  local.get 6
                  i32.const 2
                  i32.gt_u
                  br_if 1 (;@6;)
                  local.get 5
                  local.get 4
                  i32.store8 offset=32
                  local.get 5
                  local.get 3
                  i32.store offset=28
                  local.get 5
                  local.get 2
                  i32.store offset=24
                  local.get 5
                  i32.const 1052608
                  i32.store offset=20
                  local.get 5
                  i32.const 1051184
                  i32.store offset=16
                  i32.const 0
                  i32.load offset=1054844
                  local.tee 3
                  i32.const -1
                  i32.le_s
                  br_if 4 (;@3;)
                  i32.const 0
                  local.get 3
                  i32.const 1
                  i32.add
                  i32.store offset=1054844
                  i32.const 0
                  i32.load offset=1054852
                  local.set 3
                  local.get 5
                  i32.const 8
                  i32.add
                  local.get 0
                  local.get 1
                  i32.load offset=16
                  call_indirect (type 3)
                  local.get 5
                  local.get 5
                  i64.load offset=8
                  i64.store offset=16
                  local.get 3
                  br_if 2 (;@5;)
                  local.get 5
                  i32.const 16
                  i32.add
                  call $_ZN3std9panicking12default_hook17h516b5ae38093c678E
                  br 3 (;@4;)
                end
                local.get 4
                i32.const 255
                i32.and
                i32.const 3
                i32.ne
                br_if 5 (;@1;)
                local.get 5
                i32.load offset=20
                local.tee 6
                i32.load
                local.get 6
                i32.load offset=4
                i32.load
                call_indirect (type $.rodata)
                block ;; label = @7
                  local.get 6
                  i32.load offset=4
                  local.tee 4
                  i32.const 4
                  i32.add
                  i32.load
                  local.tee 3
                  i32.eqz
                  br_if 0 (;@7;)
                  local.get 6
                  i32.load
                  local.get 3
                  local.get 4
                  i32.const 8
                  i32.add
                  i32.load
                  call $__rust_dealloc
                end
                local.get 5
                i32.load offset=20
                i32.const 12
                i32.const 4
                call $__rust_dealloc
                call $_ZN3std3sys4wasi14abort_internal17h761afe555b0460d5E
                unreachable
              end
              local.get 5
              i32.const 4
              i32.store8 offset=48
              local.get 5
              local.get 5
              i32.const 104
              i32.add
              i32.store offset=56
              local.get 5
              i32.const 0
              i32.store offset=100
              local.get 5
              i32.const 1051184
              i32.store offset=96
              local.get 5
              i32.const 1
              i32.store offset=92
              local.get 5
              i32.const 1052600
              i32.store offset=88
              local.get 5
              i32.const 0
              i32.store offset=80
              local.get 5
              i32.const 48
              i32.add
              i32.const 1051708
              local.get 5
              i32.const 80
              i32.add
              call $_ZN4core3fmt5write17h7558535140974479E
              local.set 6
              local.get 5
              i32.load8_u offset=48
              local.set 4
              block ;; label = @6
                local.get 6
                i32.eqz
                br_if 0 (;@6;)
                local.get 4
                i32.const 255
                i32.and
                i32.const 4
                i32.eq
                br_if 5 (;@1;)
                local.get 5
                i32.load8_u offset=48
                i32.const 3
                i32.ne
                br_if 5 (;@1;)
                local.get 5
                i32.load offset=52
                local.tee 5
                i32.load
                local.get 5
                i32.load offset=4
                i32.load
                call_indirect (type $.rodata)
                block ;; label = @7
                  local.get 5
                  i32.load offset=4
                  local.tee 6
                  i32.const 4
                  i32.add
                  i32.load
                  local.tee 4
                  i32.eqz
                  br_if 0 (;@7;)
                  local.get 5
                  i32.load
                  local.get 4
                  local.get 6
                  i32.const 8
                  i32.add
                  i32.load
                  call $__rust_dealloc
                end
                local.get 5
                i32.const 12
                i32.const 4
                call $__rust_dealloc
                call $_ZN3std3sys4wasi14abort_internal17h761afe555b0460d5E
                unreachable
              end
              local.get 4
              i32.const 255
              i32.and
              i32.const 3
              i32.ne
              br_if 4 (;@1;)
              local.get 5
              i32.load offset=52
              local.tee 6
              i32.load
              local.get 6
              i32.load offset=4
              i32.load
              call_indirect (type $.rodata)
              block ;; label = @6
                local.get 6
                i32.load offset=4
                local.tee 4
                i32.const 4
                i32.add
                i32.load
                local.tee 3
                i32.eqz
                br_if 0 (;@6;)
                local.get 6
                i32.load
                local.get 3
                local.get 4
                i32.const 8
                i32.add
                i32.load
                call $__rust_dealloc
              end
              local.get 5
              i32.load offset=52
              i32.const 12
              i32.const 4
              call $__rust_dealloc
              br 4 (;@1;)
            end
            i32.const 0
            i32.load offset=1054852
            local.get 5
            i32.const 16
            i32.add
            i32.const 0
            i32.load offset=1054856
            i32.load offset=20
            call_indirect (type 3)
          end
          i32.const 0
          i32.const 0
          i32.load offset=1054844
          i32.const -1
          i32.add
          i32.store offset=1054844
          block ;; label = @4
            local.get 6
            i32.const 1
            i32.gt_u
            br_if 0 (;@4;)
            local.get 4
            br_if 2 (;@2;)
          end
          block ;; label = @4
            local.get 4
            i32.eqz
            br_if 0 (;@4;)
            local.get 5
            i32.const 4
            i32.store8 offset=48
            local.get 5
            local.get 5
            i32.const 104
            i32.add
            i32.store offset=56
            local.get 5
            i32.const 0
            i32.store offset=100
            local.get 5
            i32.const 1051184
            i32.store offset=96
            local.get 5
            i32.const 1
            i32.store offset=92
            local.get 5
            i32.const 1052792
            i32.store offset=88
            local.get 5
            i32.const 0
            i32.store offset=80
            local.get 5
            i32.const 48
            i32.add
            i32.const 1051708
            local.get 5
            i32.const 80
            i32.add
            call $_ZN4core3fmt5write17h7558535140974479E
            local.set 6
            local.get 5
            i32.load8_u offset=48
            local.set 4
            block ;; label = @5
              local.get 6
              i32.eqz
              br_if 0 (;@5;)
              local.get 4
              i32.const 255
              i32.and
              i32.const 4
              i32.eq
              br_if 4 (;@1;)
              local.get 5
              i32.load8_u offset=48
              i32.const 3
              i32.ne
              br_if 4 (;@1;)
              local.get 5
              i32.load offset=52
              local.tee 5
              i32.load
              local.get 5
              i32.load offset=4
              i32.load
              call_indirect (type $.rodata)
              block ;; label = @6
                local.get 5
                i32.load offset=4
                local.tee 6
                i32.const 4
                i32.add
                i32.load
                local.tee 4
                i32.eqz
                br_if 0 (;@6;)
                local.get 5
                i32.load
                local.get 4
                local.get 6
                i32.const 8
                i32.add
                i32.load
                call $__rust_dealloc
              end
              local.get 5
              i32.const 12
              i32.const 4
              call $__rust_dealloc
              call $_ZN3std3sys4wasi14abort_internal17h761afe555b0460d5E
              unreachable
            end
            local.get 4
            i32.const 255
            i32.and
            i32.const 3
            i32.ne
            br_if 3 (;@1;)
            local.get 5
            i32.load offset=52
            local.tee 6
            i32.load
            local.get 6
            i32.load offset=4
            i32.load
            call_indirect (type $.rodata)
            block ;; label = @5
              local.get 6
              i32.load offset=4
              local.tee 4
              i32.const 4
              i32.add
              i32.load
              local.tee 3
              i32.eqz
              br_if 0 (;@5;)
              local.get 6
              i32.load
              local.get 3
              local.get 4
              i32.const 8
              i32.add
              i32.load
              call $__rust_dealloc
            end
            local.get 5
            i32.load offset=52
            i32.const 12
            i32.const 4
            call $__rust_dealloc
            call $_ZN3std3sys4wasi14abort_internal17h761afe555b0460d5E
            unreachable
          end
          local.get 5
          i32.const 4
          i32.store8 offset=48
          local.get 5
          local.get 5
          i32.const 104
          i32.add
          i32.store offset=56
          local.get 5
          i32.const 0
          i32.store offset=100
          local.get 5
          i32.const 1051184
          i32.store offset=96
          local.get 5
          i32.const 1
          i32.store offset=92
          local.get 5
          i32.const 1052740
          i32.store offset=88
          local.get 5
          i32.const 0
          i32.store offset=80
          local.get 5
          i32.const 48
          i32.add
          i32.const 1051708
          local.get 5
          i32.const 80
          i32.add
          call $_ZN4core3fmt5write17h7558535140974479E
          local.set 6
          local.get 5
          i32.load8_u offset=48
          local.set 4
          block ;; label = @4
            local.get 6
            i32.eqz
            br_if 0 (;@4;)
            local.get 4
            i32.const 255
            i32.and
            i32.const 4
            i32.eq
            br_if 3 (;@1;)
            local.get 5
            i32.load8_u offset=48
            i32.const 3
            i32.ne
            br_if 3 (;@1;)
            local.get 5
            i32.load offset=52
            local.tee 5
            i32.load
            local.get 5
            i32.load offset=4
            i32.load
            call_indirect (type $.rodata)
            block ;; label = @5
              local.get 5
              i32.load offset=4
              local.tee 6
              i32.const 4
              i32.add
              i32.load
              local.tee 4
              i32.eqz
              br_if 0 (;@5;)
              local.get 5
              i32.load
              local.get 4
              local.get 6
              i32.const 8
              i32.add
              i32.load
              call $__rust_dealloc
            end
            local.get 5
            i32.const 12
            i32.const 4
            call $__rust_dealloc
            call $_ZN3std3sys4wasi14abort_internal17h761afe555b0460d5E
            unreachable
          end
          local.get 4
          i32.const 255
          i32.and
          i32.const 3
          i32.ne
          br_if 2 (;@1;)
          local.get 5
          i32.load offset=52
          local.tee 6
          i32.load
          local.get 6
          i32.load offset=4
          i32.load
          call_indirect (type $.rodata)
          block ;; label = @4
            local.get 6
            i32.load offset=4
            local.tee 4
            i32.const 4
            i32.add
            i32.load
            local.tee 3
            i32.eqz
            br_if 0 (;@4;)
            local.get 6
            i32.load
            local.get 3
            local.get 4
            i32.const 8
            i32.add
            i32.load
            call $__rust_dealloc
          end
          local.get 5
          i32.load offset=52
          i32.const 12
          i32.const 4
          call $__rust_dealloc
          call $_ZN3std3sys4wasi14abort_internal17h761afe555b0460d5E
          unreachable
        end
        local.get 5
        i32.const 48
        i32.add
        i32.const 12
        i32.add
        i32.const 2
        i32.store
        local.get 5
        i32.const 48
        i32.add
        i32.const 20
        i32.add
        i32.const 1
        i32.store
        local.get 5
        i32.const 80
        i32.add
        i32.const 12
        i32.add
        i32.const 1
        i32.store
        local.get 5
        i32.const 80
        i32.add
        i32.const 20
        i32.add
        i32.const 0
        i32.store
        local.get 5
        i32.const 1051312
        i32.store offset=56
        local.get 5
        i32.const 0
        i32.store offset=48
        local.get 5
        i32.const 14
        i32.store offset=76
        local.get 5
        i32.const 1053072
        i32.store offset=88
        local.get 5
        i32.const 1051184
        i32.store offset=96
        local.get 5
        i32.const 0
        i32.store offset=80
        local.get 5
        local.get 5
        i32.const 72
        i32.add
        i32.store offset=64
        local.get 5
        local.get 5
        i32.const 80
        i32.add
        i32.store offset=72
        local.get 5
        i32.const 40
        i32.add
        local.get 5
        i32.const 104
        i32.add
        local.get 5
        i32.const 48
        i32.add
        call $_ZN3std2io5Write9write_fmt17hba5fcb56a4c5cebaE
        local.get 5
        i32.const 40
        i32.add
        call $_ZN4core3ptr81drop_in_place$LT$core..result..Result$LT$$LP$$RP$$C$std..io..error..Error$GT$$GT$17h0ad9adc9a67d38b6E
        call $_ZN3std3sys4wasi14abort_internal17h761afe555b0460d5E
        unreachable
      end
      local.get 0
      local.get 1
      call $rust_panic
      unreachable
    end
    call $_ZN3std3sys4wasi14abort_internal17h761afe555b0460d5E
    unreachable
  )
  (func $rust_panic (;200;) (type 3) (param i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 96
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    local.get 1
    i32.store offset=4
    local.get 2
    local.get 0
    i32.store
    local.get 2
    local.get 2
    call $__rust_start_panic
    i32.store offset=12
    local.get 2
    i32.const 24
    i32.add
    i32.const 12
    i32.add
    i32.const 2
    i32.store
    local.get 2
    i32.const 24
    i32.add
    i32.const 20
    i32.add
    i32.const 1
    i32.store
    local.get 2
    i32.const 56
    i32.add
    i32.const 12
    i32.add
    i32.const 1
    i32.store
    local.get 2
    i32.const 56
    i32.add
    i32.const 20
    i32.add
    i32.const 1
    i32.store
    local.get 2
    i32.const 1051312
    i32.store offset=32
    local.get 2
    i32.const 0
    i32.store offset=24
    local.get 2
    i32.const 14
    i32.store offset=52
    local.get 2
    i32.const 1052832
    i32.store offset=64
    local.get 2
    i32.const 0
    i32.store offset=56
    local.get 2
    i32.const 7
    i32.store offset=84
    local.get 2
    local.get 2
    i32.const 48
    i32.add
    i32.store offset=40
    local.get 2
    local.get 2
    i32.const 56
    i32.add
    i32.store offset=48
    local.get 2
    local.get 2
    i32.const 80
    i32.add
    i32.store offset=72
    local.get 2
    local.get 2
    i32.const 12
    i32.add
    i32.store offset=80
    local.get 2
    i32.const 16
    i32.add
    local.get 2
    i32.const 88
    i32.add
    local.get 2
    i32.const 24
    i32.add
    call $_ZN3std2io5Write9write_fmt17hba5fcb56a4c5cebaE
    local.get 2
    i32.const 16
    i32.add
    call $_ZN4core3ptr81drop_in_place$LT$core..result..Result$LT$$LP$$RP$$C$std..io..error..Error$GT$$GT$17h0ad9adc9a67d38b6E
    call $_ZN3std3sys4wasi14abort_internal17h761afe555b0460d5E
    unreachable
  )
  (func $_ZN64_$LT$std..sys..wasi..stdio..Stderr$u20$as$u20$std..io..Write$GT$5write17he47e049b369162fdE (;201;) (type 8) (param i32 i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 4
    global.set $__stack_pointer
    local.get 4
    local.get 3
    i32.store offset=12
    local.get 4
    local.get 2
    i32.store offset=8
    local.get 4
    i32.const 16
    i32.add
    i32.const 2
    local.get 4
    i32.const 8
    i32.add
    i32.const 1
    call $_ZN4wasi13lib_generated8fd_write17h26c52996b83e471dE
    block ;; label = @1
      block ;; label = @2
        local.get 4
        i32.load16_u offset=16
        br_if 0 (;@2;)
        local.get 0
        local.get 4
        i32.load offset=20
        i32.store offset=4
        local.get 0
        i32.const 4
        i32.store8
        br 1 (;@1;)
      end
      local.get 4
      local.get 4
      i32.load16_u offset=18
      i32.store16 offset=30
      local.get 0
      local.get 4
      i32.const 30
      i32.add
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i64.extend_i32_u
      i64.const 65535
      i64.and
      i64.const 32
      i64.shl
      i64.store align=4
    end
    local.get 4
    i32.const 32
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN64_$LT$std..sys..wasi..stdio..Stderr$u20$as$u20$std..io..Write$GT$14write_vectored17h7464986e1d313f43E (;202;) (type 8) (param i32 i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 4
    global.set $__stack_pointer
    local.get 4
    i32.const 2
    local.get 2
    local.get 3
    call $_ZN4wasi13lib_generated8fd_write17h26c52996b83e471dE
    block ;; label = @1
      block ;; label = @2
        local.get 4
        i32.load16_u
        br_if 0 (;@2;)
        local.get 0
        local.get 4
        i32.load offset=4
        i32.store offset=4
        local.get 0
        i32.const 4
        i32.store8
        br 1 (;@1;)
      end
      local.get 4
      local.get 4
      i32.load16_u offset=2
      i32.store16 offset=14
      local.get 0
      local.get 4
      i32.const 14
      i32.add
      call $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E
      i64.extend_i32_u
      i64.const 65535
      i64.and
      i64.const 32
      i64.shl
      i64.store align=4
    end
    local.get 4
    i32.const 16
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN64_$LT$std..sys..wasi..stdio..Stderr$u20$as$u20$std..io..Write$GT$17is_write_vectored17h3220da0d279580c7E (;203;) (type 9) (param i32) (result i32)
    i32.const 1
  )
  (func $_ZN64_$LT$std..sys..wasi..stdio..Stderr$u20$as$u20$std..io..Write$GT$5flush17hb4fd558eb40a0fc2E (;204;) (type 3) (param i32 i32)
    local.get 0
    i32.const 4
    i32.store8
  )
  (func $_ZN3std5alloc8rust_oom17hbef86726bc88af5bE (;205;) (type 3) (param i32 i32)
    (local i32)
    local.get 0
    local.get 1
    i32.const 0
    i32.load offset=1054840
    local.tee 2
    i32.const 15
    local.get 2
    select
    call_indirect (type 3)
    call $_ZN3std7process5abort17hced5683ecdf4a442E
    unreachable
  )
  (func $__rg_oom (;206;) (type 3) (param i32 i32)
    local.get 0
    local.get 1
    call $_ZN3std5alloc8rust_oom17hbef86726bc88af5bE
    unreachable
  )
  (func $__rust_start_panic (;207;) (type 9) (param i32) (result i32)
    unreachable
    unreachable
  )
  (func $_ZN4wasi13lib_generated5Errno3raw17hac277b009e036094E (;208;) (type 9) (param i32) (result i32)
    local.get 0
    i32.load16_u
  )
  (func $_ZN4wasi13lib_generated8fd_write17h26c52996b83e471dE (;209;) (type 8) (param i32 i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 4
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 1
        local.get 2
        local.get 3
        local.get 4
        i32.const 12
        i32.add
        call $_ZN4wasi13lib_generated22wasi_snapshot_preview18fd_write17h1fddf6a5171ac8d1E
        local.tee 3
        br_if 0 (;@2;)
        local.get 0
        local.get 4
        i32.load offset=12
        i32.store offset=4
        i32.const 0
        local.set 3
        br 1 (;@1;)
      end
      local.get 0
      local.get 3
      i32.store16 offset=2
      i32.const 1
      local.set 3
    end
    local.get 0
    local.get 3
    i32.store16
    local.get 4
    i32.const 16
    i32.add
    global.set $__stack_pointer
  )
  (func $malloc (;210;) (type 9) (param i32) (result i32)
    local.get 0
    call $dlmalloc
  )
  (func $dlmalloc (;211;) (type 9) (param i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 1
    global.set $__stack_pointer
    block ;; label = @1
      i32.const 0
      i32.load offset=1054916
      local.tee 2
      br_if 0 (;@1;)
      block ;; label = @2
        block ;; label = @3
          i32.const 0
          i32.load offset=1055364
          local.tee 3
          i32.eqz
          br_if 0 (;@3;)
          i32.const 0
          i32.load offset=1055368
          local.set 4
          br 1 (;@2;)
        end
        i32.const 0
        i64.const -1
        i64.store offset=1055376 align=4
        i32.const 0
        i64.const 281474976776192
        i64.store offset=1055368 align=4
        i32.const 0
        local.get 1
        i32.const 8
        i32.add
        i32.const -16
        i32.and
        i32.const 1431655768
        i32.xor
        local.tee 3
        i32.store offset=1055364
        i32.const 0
        i32.const 0
        i32.store offset=1055384
        i32.const 0
        i32.const 0
        i32.store offset=1055336
        i32.const 65536
        local.set 4
      end
      i32.const 0
      local.set 2
      i32.const 1114112
      i32.const 1055408
      local.get 4
      i32.add
      i32.const -1
      i32.add
      i32.const 0
      local.get 4
      i32.sub
      i32.and
      i32.const 1114112
      select
      i32.const 1055408
      i32.sub
      local.tee 5
      i32.const 89
      i32.lt_u
      br_if 0 (;@1;)
      i32.const 0
      local.set 4
      i32.const 0
      local.get 5
      i32.store offset=1055344
      i32.const 0
      i32.const 1055408
      i32.store offset=1055340
      i32.const 0
      i32.const 1055408
      i32.store offset=1054908
      i32.const 0
      local.get 3
      i32.store offset=1054928
      i32.const 0
      i32.const -1
      i32.store offset=1054924
      loop ;; label = @2
        local.get 4
        i32.const 1054952
        i32.add
        local.get 4
        i32.const 1054940
        i32.add
        local.tee 3
        i32.store
        local.get 3
        local.get 4
        i32.const 1054932
        i32.add
        local.tee 6
        i32.store
        local.get 4
        i32.const 1054944
        i32.add
        local.get 6
        i32.store
        local.get 4
        i32.const 1054960
        i32.add
        local.get 4
        i32.const 1054948
        i32.add
        local.tee 6
        i32.store
        local.get 6
        local.get 3
        i32.store
        local.get 4
        i32.const 1054968
        i32.add
        local.get 4
        i32.const 1054956
        i32.add
        local.tee 3
        i32.store
        local.get 3
        local.get 6
        i32.store
        local.get 4
        i32.const 1054964
        i32.add
        local.get 3
        i32.store
        local.get 4
        i32.const 32
        i32.add
        local.tee 4
        i32.const 256
        i32.ne
        br_if 0 (;@2;)
      end
      i32.const 1055408
      i32.const -8
      i32.const 1055408
      i32.sub
      i32.const 15
      i32.and
      i32.const 0
      i32.const 1055408
      i32.const 8
      i32.add
      i32.const 15
      i32.and
      select
      local.tee 4
      i32.add
      local.tee 2
      i32.const 4
      i32.add
      local.get 5
      i32.const -56
      i32.add
      local.tee 3
      local.get 4
      i32.sub
      local.tee 4
      i32.const 1
      i32.or
      i32.store
      i32.const 0
      i32.const 0
      i32.load offset=1055380
      i32.store offset=1054920
      i32.const 0
      local.get 4
      i32.store offset=1054904
      i32.const 0
      local.get 2
      i32.store offset=1054916
      i32.const 1055408
      local.get 3
      i32.add
      i32.const 56
      i32.store offset=4
    end
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  block ;; label = @8
                    block ;; label = @9
                      block ;; label = @10
                        block ;; label = @11
                          block ;; label = @12
                            local.get 0
                            i32.const 236
                            i32.gt_u
                            br_if 0 (;@12;)
                            block ;; label = @13
                              i32.const 0
                              i32.load offset=1054892
                              local.tee 7
                              i32.const 16
                              local.get 0
                              i32.const 19
                              i32.add
                              i32.const -16
                              i32.and
                              local.get 0
                              i32.const 11
                              i32.lt_u
                              select
                              local.tee 5
                              i32.const 3
                              i32.shr_u
                              local.tee 3
                              i32.shr_u
                              local.tee 4
                              i32.const 3
                              i32.and
                              i32.eqz
                              br_if 0 (;@13;)
                              block ;; label = @14
                                block ;; label = @15
                                  local.get 4
                                  i32.const 1
                                  i32.and
                                  local.get 3
                                  i32.or
                                  i32.const 1
                                  i32.xor
                                  local.tee 6
                                  i32.const 3
                                  i32.shl
                                  local.tee 3
                                  i32.const 1054932
                                  i32.add
                                  local.tee 4
                                  local.get 3
                                  i32.const 1054940
                                  i32.add
                                  i32.load
                                  local.tee 3
                                  i32.load offset=8
                                  local.tee 5
                                  i32.ne
                                  br_if 0 (;@15;)
                                  i32.const 0
                                  local.get 7
                                  i32.const -2
                                  local.get 6
                                  i32.rotl
                                  i32.and
                                  i32.store offset=1054892
                                  br 1 (;@14;)
                                end
                                local.get 4
                                local.get 5
                                i32.store offset=8
                                local.get 5
                                local.get 4
                                i32.store offset=12
                              end
                              local.get 3
                              i32.const 8
                              i32.add
                              local.set 4
                              local.get 3
                              local.get 6
                              i32.const 3
                              i32.shl
                              local.tee 6
                              i32.const 3
                              i32.or
                              i32.store offset=4
                              local.get 3
                              local.get 6
                              i32.add
                              local.tee 3
                              local.get 3
                              i32.load offset=4
                              i32.const 1
                              i32.or
                              i32.store offset=4
                              br 12 (;@1;)
                            end
                            local.get 5
                            i32.const 0
                            i32.load offset=1054900
                            local.tee 8
                            i32.le_u
                            br_if 1 (;@11;)
                            block ;; label = @13
                              local.get 4
                              i32.eqz
                              br_if 0 (;@13;)
                              block ;; label = @14
                                block ;; label = @15
                                  local.get 4
                                  local.get 3
                                  i32.shl
                                  i32.const 2
                                  local.get 3
                                  i32.shl
                                  local.tee 4
                                  i32.const 0
                                  local.get 4
                                  i32.sub
                                  i32.or
                                  i32.and
                                  local.tee 4
                                  i32.const 0
                                  local.get 4
                                  i32.sub
                                  i32.and
                                  i32.const -1
                                  i32.add
                                  local.tee 4
                                  local.get 4
                                  i32.const 12
                                  i32.shr_u
                                  i32.const 16
                                  i32.and
                                  local.tee 4
                                  i32.shr_u
                                  local.tee 3
                                  i32.const 5
                                  i32.shr_u
                                  i32.const 8
                                  i32.and
                                  local.tee 6
                                  local.get 4
                                  i32.or
                                  local.get 3
                                  local.get 6
                                  i32.shr_u
                                  local.tee 4
                                  i32.const 2
                                  i32.shr_u
                                  i32.const 4
                                  i32.and
                                  local.tee 3
                                  i32.or
                                  local.get 4
                                  local.get 3
                                  i32.shr_u
                                  local.tee 4
                                  i32.const 1
                                  i32.shr_u
                                  i32.const 2
                                  i32.and
                                  local.tee 3
                                  i32.or
                                  local.get 4
                                  local.get 3
                                  i32.shr_u
                                  local.tee 4
                                  i32.const 1
                                  i32.shr_u
                                  i32.const 1
                                  i32.and
                                  local.tee 3
                                  i32.or
                                  local.get 4
                                  local.get 3
                                  i32.shr_u
                                  i32.add
                                  local.tee 3
                                  i32.const 3
                                  i32.shl
                                  local.tee 4
                                  i32.const 1054932
                                  i32.add
                                  local.tee 6
                                  local.get 4
                                  i32.const 1054940
                                  i32.add
                                  i32.load
                                  local.tee 4
                                  i32.load offset=8
                                  local.tee 0
                                  i32.ne
                                  br_if 0 (;@15;)
                                  i32.const 0
                                  local.get 7
                                  i32.const -2
                                  local.get 3
                                  i32.rotl
                                  i32.and
                                  local.tee 7
                                  i32.store offset=1054892
                                  br 1 (;@14;)
                                end
                                local.get 6
                                local.get 0
                                i32.store offset=8
                                local.get 0
                                local.get 6
                                i32.store offset=12
                              end
                              local.get 4
                              local.get 5
                              i32.const 3
                              i32.or
                              i32.store offset=4
                              local.get 4
                              local.get 3
                              i32.const 3
                              i32.shl
                              local.tee 3
                              i32.add
                              local.get 3
                              local.get 5
                              i32.sub
                              local.tee 6
                              i32.store
                              local.get 4
                              local.get 5
                              i32.add
                              local.tee 0
                              local.get 6
                              i32.const 1
                              i32.or
                              i32.store offset=4
                              block ;; label = @14
                                local.get 8
                                i32.eqz
                                br_if 0 (;@14;)
                                local.get 8
                                i32.const -8
                                i32.and
                                i32.const 1054932
                                i32.add
                                local.set 5
                                i32.const 0
                                i32.load offset=1054912
                                local.set 3
                                block ;; label = @15
                                  block ;; label = @16
                                    local.get 7
                                    i32.const 1
                                    local.get 8
                                    i32.const 3
                                    i32.shr_u
                                    i32.shl
                                    local.tee 9
                                    i32.and
                                    br_if 0 (;@16;)
                                    i32.const 0
                                    local.get 7
                                    local.get 9
                                    i32.or
                                    i32.store offset=1054892
                                    local.get 5
                                    local.set 9
                                    br 1 (;@15;)
                                  end
                                  local.get 5
                                  i32.load offset=8
                                  local.set 9
                                end
                                local.get 9
                                local.get 3
                                i32.store offset=12
                                local.get 5
                                local.get 3
                                i32.store offset=8
                                local.get 3
                                local.get 5
                                i32.store offset=12
                                local.get 3
                                local.get 9
                                i32.store offset=8
                              end
                              local.get 4
                              i32.const 8
                              i32.add
                              local.set 4
                              i32.const 0
                              local.get 0
                              i32.store offset=1054912
                              i32.const 0
                              local.get 6
                              i32.store offset=1054900
                              br 12 (;@1;)
                            end
                            i32.const 0
                            i32.load offset=1054896
                            local.tee 10
                            i32.eqz
                            br_if 1 (;@11;)
                            local.get 10
                            i32.const 0
                            local.get 10
                            i32.sub
                            i32.and
                            i32.const -1
                            i32.add
                            local.tee 4
                            local.get 4
                            i32.const 12
                            i32.shr_u
                            i32.const 16
                            i32.and
                            local.tee 4
                            i32.shr_u
                            local.tee 3
                            i32.const 5
                            i32.shr_u
                            i32.const 8
                            i32.and
                            local.tee 6
                            local.get 4
                            i32.or
                            local.get 3
                            local.get 6
                            i32.shr_u
                            local.tee 4
                            i32.const 2
                            i32.shr_u
                            i32.const 4
                            i32.and
                            local.tee 3
                            i32.or
                            local.get 4
                            local.get 3
                            i32.shr_u
                            local.tee 4
                            i32.const 1
                            i32.shr_u
                            i32.const 2
                            i32.and
                            local.tee 3
                            i32.or
                            local.get 4
                            local.get 3
                            i32.shr_u
                            local.tee 4
                            i32.const 1
                            i32.shr_u
                            i32.const 1
                            i32.and
                            local.tee 3
                            i32.or
                            local.get 4
                            local.get 3
                            i32.shr_u
                            i32.add
                            i32.const 2
                            i32.shl
                            i32.const 1055196
                            i32.add
                            i32.load
                            local.tee 0
                            i32.load offset=4
                            i32.const -8
                            i32.and
                            local.get 5
                            i32.sub
                            local.set 3
                            local.get 0
                            local.set 6
                            block ;; label = @13
                              loop ;; label = @14
                                block ;; label = @15
                                  local.get 6
                                  i32.load offset=16
                                  local.tee 4
                                  br_if 0 (;@15;)
                                  local.get 6
                                  i32.const 20
                                  i32.add
                                  i32.load
                                  local.tee 4
                                  i32.eqz
                                  br_if 2 (;@13;)
                                end
                                local.get 4
                                i32.load offset=4
                                i32.const -8
                                i32.and
                                local.get 5
                                i32.sub
                                local.tee 6
                                local.get 3
                                local.get 6
                                local.get 3
                                i32.lt_u
                                local.tee 6
                                select
                                local.set 3
                                local.get 4
                                local.get 0
                                local.get 6
                                select
                                local.set 0
                                local.get 4
                                local.set 6
                                br 0 (;@14;)
                              end
                            end
                            local.get 0
                            i32.load offset=24
                            local.set 11
                            block ;; label = @13
                              local.get 0
                              i32.load offset=12
                              local.tee 9
                              local.get 0
                              i32.eq
                              br_if 0 (;@13;)
                              local.get 0
                              i32.load offset=8
                              local.tee 4
                              i32.const 0
                              i32.load offset=1054908
                              i32.lt_u
                              drop
                              local.get 9
                              local.get 4
                              i32.store offset=8
                              local.get 4
                              local.get 9
                              i32.store offset=12
                              br 11 (;@2;)
                            end
                            block ;; label = @13
                              local.get 0
                              i32.const 20
                              i32.add
                              local.tee 6
                              i32.load
                              local.tee 4
                              br_if 0 (;@13;)
                              local.get 0
                              i32.load offset=16
                              local.tee 4
                              i32.eqz
                              br_if 3 (;@10;)
                              local.get 0
                              i32.const 16
                              i32.add
                              local.set 6
                            end
                            loop ;; label = @13
                              local.get 6
                              local.set 2
                              local.get 4
                              local.tee 9
                              i32.const 20
                              i32.add
                              local.tee 6
                              i32.load
                              local.tee 4
                              br_if 0 (;@13;)
                              local.get 9
                              i32.const 16
                              i32.add
                              local.set 6
                              local.get 9
                              i32.load offset=16
                              local.tee 4
                              br_if 0 (;@13;)
                            end
                            local.get 2
                            i32.const 0
                            i32.store
                            br 10 (;@2;)
                          end
                          i32.const -1
                          local.set 5
                          local.get 0
                          i32.const -65
                          i32.gt_u
                          br_if 0 (;@11;)
                          local.get 0
                          i32.const 19
                          i32.add
                          local.tee 4
                          i32.const -16
                          i32.and
                          local.set 5
                          i32.const 0
                          i32.load offset=1054896
                          local.tee 10
                          i32.eqz
                          br_if 0 (;@11;)
                          i32.const 0
                          local.set 8
                          block ;; label = @12
                            local.get 5
                            i32.const 256
                            i32.lt_u
                            br_if 0 (;@12;)
                            i32.const 31
                            local.set 8
                            local.get 5
                            i32.const 16777215
                            i32.gt_u
                            br_if 0 (;@12;)
                            local.get 4
                            i32.const 8
                            i32.shr_u
                            local.tee 4
                            local.get 4
                            i32.const 1048320
                            i32.add
                            i32.const 16
                            i32.shr_u
                            i32.const 8
                            i32.and
                            local.tee 4
                            i32.shl
                            local.tee 3
                            local.get 3
                            i32.const 520192
                            i32.add
                            i32.const 16
                            i32.shr_u
                            i32.const 4
                            i32.and
                            local.tee 3
                            i32.shl
                            local.tee 6
                            local.get 6
                            i32.const 245760
                            i32.add
                            i32.const 16
                            i32.shr_u
                            i32.const 2
                            i32.and
                            local.tee 6
                            i32.shl
                            i32.const 15
                            i32.shr_u
                            local.get 4
                            local.get 3
                            i32.or
                            local.get 6
                            i32.or
                            i32.sub
                            local.tee 4
                            i32.const 1
                            i32.shl
                            local.get 5
                            local.get 4
                            i32.const 21
                            i32.add
                            i32.shr_u
                            i32.const 1
                            i32.and
                            i32.or
                            i32.const 28
                            i32.add
                            local.set 8
                          end
                          i32.const 0
                          local.get 5
                          i32.sub
                          local.set 3
                          block ;; label = @12
                            block ;; label = @13
                              block ;; label = @14
                                block ;; label = @15
                                  local.get 8
                                  i32.const 2
                                  i32.shl
                                  i32.const 1055196
                                  i32.add
                                  i32.load
                                  local.tee 6
                                  br_if 0 (;@15;)
                                  i32.const 0
                                  local.set 4
                                  i32.const 0
                                  local.set 9
                                  br 1 (;@14;)
                                end
                                i32.const 0
                                local.set 4
                                local.get 5
                                i32.const 0
                                i32.const 25
                                local.get 8
                                i32.const 1
                                i32.shr_u
                                i32.sub
                                local.get 8
                                i32.const 31
                                i32.eq
                                select
                                i32.shl
                                local.set 0
                                i32.const 0
                                local.set 9
                                loop ;; label = @15
                                  block ;; label = @16
                                    local.get 6
                                    i32.load offset=4
                                    i32.const -8
                                    i32.and
                                    local.get 5
                                    i32.sub
                                    local.tee 7
                                    local.get 3
                                    i32.ge_u
                                    br_if 0 (;@16;)
                                    local.get 7
                                    local.set 3
                                    local.get 6
                                    local.set 9
                                    local.get 7
                                    br_if 0 (;@16;)
                                    i32.const 0
                                    local.set 3
                                    local.get 6
                                    local.set 9
                                    local.get 6
                                    local.set 4
                                    br 3 (;@13;)
                                  end
                                  local.get 4
                                  local.get 6
                                  i32.const 20
                                  i32.add
                                  i32.load
                                  local.tee 7
                                  local.get 7
                                  local.get 6
                                  local.get 0
                                  i32.const 29
                                  i32.shr_u
                                  i32.const 4
                                  i32.and
                                  i32.add
                                  i32.const 16
                                  i32.add
                                  i32.load
                                  local.tee 6
                                  i32.eq
                                  select
                                  local.get 4
                                  local.get 7
                                  select
                                  local.set 4
                                  local.get 0
                                  i32.const 1
                                  i32.shl
                                  local.set 0
                                  local.get 6
                                  br_if 0 (;@15;)
                                end
                              end
                              block ;; label = @14
                                local.get 4
                                local.get 9
                                i32.or
                                br_if 0 (;@14;)
                                i32.const 0
                                local.set 9
                                i32.const 2
                                local.get 8
                                i32.shl
                                local.tee 4
                                i32.const 0
                                local.get 4
                                i32.sub
                                i32.or
                                local.get 10
                                i32.and
                                local.tee 4
                                i32.eqz
                                br_if 3 (;@11;)
                                local.get 4
                                i32.const 0
                                local.get 4
                                i32.sub
                                i32.and
                                i32.const -1
                                i32.add
                                local.tee 4
                                local.get 4
                                i32.const 12
                                i32.shr_u
                                i32.const 16
                                i32.and
                                local.tee 4
                                i32.shr_u
                                local.tee 6
                                i32.const 5
                                i32.shr_u
                                i32.const 8
                                i32.and
                                local.tee 0
                                local.get 4
                                i32.or
                                local.get 6
                                local.get 0
                                i32.shr_u
                                local.tee 4
                                i32.const 2
                                i32.shr_u
                                i32.const 4
                                i32.and
                                local.tee 6
                                i32.or
                                local.get 4
                                local.get 6
                                i32.shr_u
                                local.tee 4
                                i32.const 1
                                i32.shr_u
                                i32.const 2
                                i32.and
                                local.tee 6
                                i32.or
                                local.get 4
                                local.get 6
                                i32.shr_u
                                local.tee 4
                                i32.const 1
                                i32.shr_u
                                i32.const 1
                                i32.and
                                local.tee 6
                                i32.or
                                local.get 4
                                local.get 6
                                i32.shr_u
                                i32.add
                                i32.const 2
                                i32.shl
                                i32.const 1055196
                                i32.add
                                i32.load
                                local.set 4
                              end
                              local.get 4
                              i32.eqz
                              br_if 1 (;@12;)
                            end
                            loop ;; label = @13
                              local.get 4
                              i32.load offset=4
                              i32.const -8
                              i32.and
                              local.get 5
                              i32.sub
                              local.tee 7
                              local.get 3
                              i32.lt_u
                              local.set 0
                              block ;; label = @14
                                local.get 4
                                i32.load offset=16
                                local.tee 6
                                br_if 0 (;@14;)
                                local.get 4
                                i32.const 20
                                i32.add
                                i32.load
                                local.set 6
                              end
                              local.get 7
                              local.get 3
                              local.get 0
                              select
                              local.set 3
                              local.get 4
                              local.get 9
                              local.get 0
                              select
                              local.set 9
                              local.get 6
                              local.set 4
                              local.get 6
                              br_if 0 (;@13;)
                            end
                          end
                          local.get 9
                          i32.eqz
                          br_if 0 (;@11;)
                          local.get 3
                          i32.const 0
                          i32.load offset=1054900
                          local.get 5
                          i32.sub
                          i32.ge_u
                          br_if 0 (;@11;)
                          local.get 9
                          i32.load offset=24
                          local.set 2
                          block ;; label = @12
                            local.get 9
                            i32.load offset=12
                            local.tee 0
                            local.get 9
                            i32.eq
                            br_if 0 (;@12;)
                            local.get 9
                            i32.load offset=8
                            local.tee 4
                            i32.const 0
                            i32.load offset=1054908
                            i32.lt_u
                            drop
                            local.get 0
                            local.get 4
                            i32.store offset=8
                            local.get 4
                            local.get 0
                            i32.store offset=12
                            br 9 (;@3;)
                          end
                          block ;; label = @12
                            local.get 9
                            i32.const 20
                            i32.add
                            local.tee 6
                            i32.load
                            local.tee 4
                            br_if 0 (;@12;)
                            local.get 9
                            i32.load offset=16
                            local.tee 4
                            i32.eqz
                            br_if 3 (;@9;)
                            local.get 9
                            i32.const 16
                            i32.add
                            local.set 6
                          end
                          loop ;; label = @12
                            local.get 6
                            local.set 7
                            local.get 4
                            local.tee 0
                            i32.const 20
                            i32.add
                            local.tee 6
                            i32.load
                            local.tee 4
                            br_if 0 (;@12;)
                            local.get 0
                            i32.const 16
                            i32.add
                            local.set 6
                            local.get 0
                            i32.load offset=16
                            local.tee 4
                            br_if 0 (;@12;)
                          end
                          local.get 7
                          i32.const 0
                          i32.store
                          br 8 (;@3;)
                        end
                        block ;; label = @11
                          i32.const 0
                          i32.load offset=1054900
                          local.tee 4
                          local.get 5
                          i32.lt_u
                          br_if 0 (;@11;)
                          i32.const 0
                          i32.load offset=1054912
                          local.set 3
                          block ;; label = @12
                            block ;; label = @13
                              local.get 4
                              local.get 5
                              i32.sub
                              local.tee 6
                              i32.const 16
                              i32.lt_u
                              br_if 0 (;@13;)
                              local.get 3
                              local.get 5
                              i32.add
                              local.tee 0
                              local.get 6
                              i32.const 1
                              i32.or
                              i32.store offset=4
                              i32.const 0
                              local.get 6
                              i32.store offset=1054900
                              i32.const 0
                              local.get 0
                              i32.store offset=1054912
                              local.get 3
                              local.get 4
                              i32.add
                              local.get 6
                              i32.store
                              local.get 3
                              local.get 5
                              i32.const 3
                              i32.or
                              i32.store offset=4
                              br 1 (;@12;)
                            end
                            local.get 3
                            local.get 4
                            i32.const 3
                            i32.or
                            i32.store offset=4
                            local.get 3
                            local.get 4
                            i32.add
                            local.tee 4
                            local.get 4
                            i32.load offset=4
                            i32.const 1
                            i32.or
                            i32.store offset=4
                            i32.const 0
                            i32.const 0
                            i32.store offset=1054912
                            i32.const 0
                            i32.const 0
                            i32.store offset=1054900
                          end
                          local.get 3
                          i32.const 8
                          i32.add
                          local.set 4
                          br 10 (;@1;)
                        end
                        block ;; label = @11
                          i32.const 0
                          i32.load offset=1054904
                          local.tee 6
                          local.get 5
                          i32.le_u
                          br_if 0 (;@11;)
                          local.get 2
                          local.get 5
                          i32.add
                          local.tee 4
                          local.get 6
                          local.get 5
                          i32.sub
                          local.tee 3
                          i32.const 1
                          i32.or
                          i32.store offset=4
                          i32.const 0
                          local.get 4
                          i32.store offset=1054916
                          i32.const 0
                          local.get 3
                          i32.store offset=1054904
                          local.get 2
                          local.get 5
                          i32.const 3
                          i32.or
                          i32.store offset=4
                          local.get 2
                          i32.const 8
                          i32.add
                          local.set 4
                          br 10 (;@1;)
                        end
                        block ;; label = @11
                          block ;; label = @12
                            i32.const 0
                            i32.load offset=1055364
                            i32.eqz
                            br_if 0 (;@12;)
                            i32.const 0
                            i32.load offset=1055372
                            local.set 3
                            br 1 (;@11;)
                          end
                          i32.const 0
                          i64.const -1
                          i64.store offset=1055376 align=4
                          i32.const 0
                          i64.const 281474976776192
                          i64.store offset=1055368 align=4
                          i32.const 0
                          local.get 1
                          i32.const 12
                          i32.add
                          i32.const -16
                          i32.and
                          i32.const 1431655768
                          i32.xor
                          i32.store offset=1055364
                          i32.const 0
                          i32.const 0
                          i32.store offset=1055384
                          i32.const 0
                          i32.const 0
                          i32.store offset=1055336
                          i32.const 65536
                          local.set 3
                        end
                        i32.const 0
                        local.set 4
                        block ;; label = @11
                          local.get 3
                          local.get 5
                          i32.const 71
                          i32.add
                          local.tee 8
                          i32.add
                          local.tee 0
                          i32.const 0
                          local.get 3
                          i32.sub
                          local.tee 7
                          i32.and
                          local.tee 9
                          local.get 5
                          i32.gt_u
                          br_if 0 (;@11;)
                          i32.const 0
                          i32.const 48
                          i32.store offset=1055388
                          br 10 (;@1;)
                        end
                        block ;; label = @11
                          i32.const 0
                          i32.load offset=1055332
                          local.tee 4
                          i32.eqz
                          br_if 0 (;@11;)
                          block ;; label = @12
                            i32.const 0
                            i32.load offset=1055324
                            local.tee 3
                            local.get 9
                            i32.add
                            local.tee 10
                            local.get 3
                            i32.le_u
                            br_if 0 (;@12;)
                            local.get 10
                            local.get 4
                            i32.le_u
                            br_if 1 (;@11;)
                          end
                          i32.const 0
                          local.set 4
                          i32.const 0
                          i32.const 48
                          i32.store offset=1055388
                          br 10 (;@1;)
                        end
                        i32.const 0
                        i32.load8_u offset=1055336
                        i32.const 4
                        i32.and
                        br_if 4 (;@6;)
                        block ;; label = @11
                          block ;; label = @12
                            block ;; label = @13
                              local.get 2
                              i32.eqz
                              br_if 0 (;@13;)
                              i32.const 1055340
                              local.set 4
                              loop ;; label = @14
                                block ;; label = @15
                                  local.get 4
                                  i32.load
                                  local.tee 3
                                  local.get 2
                                  i32.gt_u
                                  br_if 0 (;@15;)
                                  local.get 3
                                  local.get 4
                                  i32.load offset=4
                                  i32.add
                                  local.get 2
                                  i32.gt_u
                                  br_if 3 (;@12;)
                                end
                                local.get 4
                                i32.load offset=8
                                local.tee 4
                                br_if 0 (;@14;)
                              end
                            end
                            i32.const 0
                            call $sbrk
                            local.tee 0
                            i32.const -1
                            i32.eq
                            br_if 5 (;@7;)
                            local.get 9
                            local.set 7
                            block ;; label = @13
                              i32.const 0
                              i32.load offset=1055368
                              local.tee 4
                              i32.const -1
                              i32.add
                              local.tee 3
                              local.get 0
                              i32.and
                              i32.eqz
                              br_if 0 (;@13;)
                              local.get 9
                              local.get 0
                              i32.sub
                              local.get 3
                              local.get 0
                              i32.add
                              i32.const 0
                              local.get 4
                              i32.sub
                              i32.and
                              i32.add
                              local.set 7
                            end
                            local.get 7
                            local.get 5
                            i32.le_u
                            br_if 5 (;@7;)
                            local.get 7
                            i32.const 2147483646
                            i32.gt_u
                            br_if 5 (;@7;)
                            block ;; label = @13
                              i32.const 0
                              i32.load offset=1055332
                              local.tee 4
                              i32.eqz
                              br_if 0 (;@13;)
                              i32.const 0
                              i32.load offset=1055324
                              local.tee 3
                              local.get 7
                              i32.add
                              local.tee 6
                              local.get 3
                              i32.le_u
                              br_if 6 (;@7;)
                              local.get 6
                              local.get 4
                              i32.gt_u
                              br_if 6 (;@7;)
                            end
                            local.get 7
                            call $sbrk
                            local.tee 4
                            local.get 0
                            i32.ne
                            br_if 1 (;@11;)
                            br 7 (;@5;)
                          end
                          local.get 0
                          local.get 6
                          i32.sub
                          local.get 7
                          i32.and
                          local.tee 7
                          i32.const 2147483646
                          i32.gt_u
                          br_if 4 (;@7;)
                          local.get 7
                          call $sbrk
                          local.tee 0
                          local.get 4
                          i32.load
                          local.get 4
                          i32.load offset=4
                          i32.add
                          i32.eq
                          br_if 3 (;@8;)
                          local.get 0
                          local.set 4
                        end
                        block ;; label = @11
                          local.get 4
                          i32.const -1
                          i32.eq
                          br_if 0 (;@11;)
                          local.get 5
                          i32.const 72
                          i32.add
                          local.get 7
                          i32.le_u
                          br_if 0 (;@11;)
                          block ;; label = @12
                            local.get 8
                            local.get 7
                            i32.sub
                            i32.const 0
                            i32.load offset=1055372
                            local.tee 3
                            i32.add
                            i32.const 0
                            local.get 3
                            i32.sub
                            i32.and
                            local.tee 3
                            i32.const 2147483646
                            i32.le_u
                            br_if 0 (;@12;)
                            local.get 4
                            local.set 0
                            br 7 (;@5;)
                          end
                          block ;; label = @12
                            local.get 3
                            call $sbrk
                            i32.const -1
                            i32.eq
                            br_if 0 (;@12;)
                            local.get 3
                            local.get 7
                            i32.add
                            local.set 7
                            local.get 4
                            local.set 0
                            br 7 (;@5;)
                          end
                          i32.const 0
                          local.get 7
                          i32.sub
                          call $sbrk
                          drop
                          br 4 (;@7;)
                        end
                        local.get 4
                        local.set 0
                        local.get 4
                        i32.const -1
                        i32.ne
                        br_if 5 (;@5;)
                        br 3 (;@7;)
                      end
                      i32.const 0
                      local.set 9
                      br 7 (;@2;)
                    end
                    i32.const 0
                    local.set 0
                    br 5 (;@3;)
                  end
                  local.get 0
                  i32.const -1
                  i32.ne
                  br_if 2 (;@5;)
                end
                i32.const 0
                i32.const 0
                i32.load offset=1055336
                i32.const 4
                i32.or
                i32.store offset=1055336
              end
              local.get 9
              i32.const 2147483646
              i32.gt_u
              br_if 1 (;@4;)
              local.get 9
              call $sbrk
              local.set 0
              i32.const 0
              call $sbrk
              local.set 4
              local.get 0
              i32.const -1
              i32.eq
              br_if 1 (;@4;)
              local.get 4
              i32.const -1
              i32.eq
              br_if 1 (;@4;)
              local.get 0
              local.get 4
              i32.ge_u
              br_if 1 (;@4;)
              local.get 4
              local.get 0
              i32.sub
              local.tee 7
              local.get 5
              i32.const 56
              i32.add
              i32.le_u
              br_if 1 (;@4;)
            end
            i32.const 0
            i32.const 0
            i32.load offset=1055324
            local.get 7
            i32.add
            local.tee 4
            i32.store offset=1055324
            block ;; label = @5
              local.get 4
              i32.const 0
              i32.load offset=1055328
              i32.le_u
              br_if 0 (;@5;)
              i32.const 0
              local.get 4
              i32.store offset=1055328
            end
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  block ;; label = @8
                    i32.const 0
                    i32.load offset=1054916
                    local.tee 3
                    i32.eqz
                    br_if 0 (;@8;)
                    i32.const 1055340
                    local.set 4
                    loop ;; label = @9
                      local.get 0
                      local.get 4
                      i32.load
                      local.tee 6
                      local.get 4
                      i32.load offset=4
                      local.tee 9
                      i32.add
                      i32.eq
                      br_if 2 (;@7;)
                      local.get 4
                      i32.load offset=8
                      local.tee 4
                      br_if 0 (;@9;)
                      br 3 (;@6;)
                    end
                  end
                  block ;; label = @8
                    block ;; label = @9
                      i32.const 0
                      i32.load offset=1054908
                      local.tee 4
                      i32.eqz
                      br_if 0 (;@9;)
                      local.get 0
                      local.get 4
                      i32.ge_u
                      br_if 1 (;@8;)
                    end
                    i32.const 0
                    local.get 0
                    i32.store offset=1054908
                  end
                  i32.const 0
                  local.set 4
                  i32.const 0
                  local.get 7
                  i32.store offset=1055344
                  i32.const 0
                  local.get 0
                  i32.store offset=1055340
                  i32.const 0
                  i32.const -1
                  i32.store offset=1054924
                  i32.const 0
                  i32.const 0
                  i32.load offset=1055364
                  i32.store offset=1054928
                  i32.const 0
                  i32.const 0
                  i32.store offset=1055352
                  loop ;; label = @8
                    local.get 4
                    i32.const 1054952
                    i32.add
                    local.get 4
                    i32.const 1054940
                    i32.add
                    local.tee 3
                    i32.store
                    local.get 3
                    local.get 4
                    i32.const 1054932
                    i32.add
                    local.tee 6
                    i32.store
                    local.get 4
                    i32.const 1054944
                    i32.add
                    local.get 6
                    i32.store
                    local.get 4
                    i32.const 1054960
                    i32.add
                    local.get 4
                    i32.const 1054948
                    i32.add
                    local.tee 6
                    i32.store
                    local.get 6
                    local.get 3
                    i32.store
                    local.get 4
                    i32.const 1054968
                    i32.add
                    local.get 4
                    i32.const 1054956
                    i32.add
                    local.tee 3
                    i32.store
                    local.get 3
                    local.get 6
                    i32.store
                    local.get 4
                    i32.const 1054964
                    i32.add
                    local.get 3
                    i32.store
                    local.get 4
                    i32.const 32
                    i32.add
                    local.tee 4
                    i32.const 256
                    i32.ne
                    br_if 0 (;@8;)
                  end
                  local.get 0
                  i32.const -8
                  local.get 0
                  i32.sub
                  i32.const 15
                  i32.and
                  i32.const 0
                  local.get 0
                  i32.const 8
                  i32.add
                  i32.const 15
                  i32.and
                  select
                  local.tee 4
                  i32.add
                  local.tee 3
                  local.get 7
                  i32.const -56
                  i32.add
                  local.tee 6
                  local.get 4
                  i32.sub
                  local.tee 4
                  i32.const 1
                  i32.or
                  i32.store offset=4
                  i32.const 0
                  i32.const 0
                  i32.load offset=1055380
                  i32.store offset=1054920
                  i32.const 0
                  local.get 4
                  i32.store offset=1054904
                  i32.const 0
                  local.get 3
                  i32.store offset=1054916
                  local.get 0
                  local.get 6
                  i32.add
                  i32.const 56
                  i32.store offset=4
                  br 2 (;@5;)
                end
                local.get 4
                i32.load8_u offset=12
                i32.const 8
                i32.and
                br_if 0 (;@6;)
                local.get 3
                local.get 6
                i32.lt_u
                br_if 0 (;@6;)
                local.get 3
                local.get 0
                i32.ge_u
                br_if 0 (;@6;)
                local.get 3
                i32.const -8
                local.get 3
                i32.sub
                i32.const 15
                i32.and
                i32.const 0
                local.get 3
                i32.const 8
                i32.add
                i32.const 15
                i32.and
                select
                local.tee 6
                i32.add
                local.tee 0
                i32.const 0
                i32.load offset=1054904
                local.get 7
                i32.add
                local.tee 2
                local.get 6
                i32.sub
                local.tee 6
                i32.const 1
                i32.or
                i32.store offset=4
                local.get 4
                local.get 9
                local.get 7
                i32.add
                i32.store offset=4
                i32.const 0
                i32.const 0
                i32.load offset=1055380
                i32.store offset=1054920
                i32.const 0
                local.get 6
                i32.store offset=1054904
                i32.const 0
                local.get 0
                i32.store offset=1054916
                local.get 3
                local.get 2
                i32.add
                i32.const 56
                i32.store offset=4
                br 1 (;@5;)
              end
              block ;; label = @6
                local.get 0
                i32.const 0
                i32.load offset=1054908
                local.tee 9
                i32.ge_u
                br_if 0 (;@6;)
                i32.const 0
                local.get 0
                i32.store offset=1054908
                local.get 0
                local.set 9
              end
              local.get 0
              local.get 7
              i32.add
              local.set 6
              i32.const 1055340
              local.set 4
              block ;; label = @6
                block ;; label = @7
                  block ;; label = @8
                    block ;; label = @9
                      block ;; label = @10
                        block ;; label = @11
                          block ;; label = @12
                            loop ;; label = @13
                              local.get 4
                              i32.load
                              local.get 6
                              i32.eq
                              br_if 1 (;@12;)
                              local.get 4
                              i32.load offset=8
                              local.tee 4
                              br_if 0 (;@13;)
                              br 2 (;@11;)
                            end
                          end
                          local.get 4
                          i32.load8_u offset=12
                          i32.const 8
                          i32.and
                          i32.eqz
                          br_if 1 (;@10;)
                        end
                        i32.const 1055340
                        local.set 4
                        loop ;; label = @11
                          block ;; label = @12
                            local.get 4
                            i32.load
                            local.tee 6
                            local.get 3
                            i32.gt_u
                            br_if 0 (;@12;)
                            local.get 6
                            local.get 4
                            i32.load offset=4
                            i32.add
                            local.tee 6
                            local.get 3
                            i32.gt_u
                            br_if 3 (;@9;)
                          end
                          local.get 4
                          i32.load offset=8
                          local.set 4
                          br 0 (;@11;)
                        end
                      end
                      local.get 4
                      local.get 0
                      i32.store
                      local.get 4
                      local.get 4
                      i32.load offset=4
                      local.get 7
                      i32.add
                      i32.store offset=4
                      local.get 0
                      i32.const -8
                      local.get 0
                      i32.sub
                      i32.const 15
                      i32.and
                      i32.const 0
                      local.get 0
                      i32.const 8
                      i32.add
                      i32.const 15
                      i32.and
                      select
                      i32.add
                      local.tee 2
                      local.get 5
                      i32.const 3
                      i32.or
                      i32.store offset=4
                      local.get 6
                      i32.const -8
                      local.get 6
                      i32.sub
                      i32.const 15
                      i32.and
                      i32.const 0
                      local.get 6
                      i32.const 8
                      i32.add
                      i32.const 15
                      i32.and
                      select
                      i32.add
                      local.tee 7
                      local.get 2
                      local.get 5
                      i32.add
                      local.tee 5
                      i32.sub
                      local.set 4
                      block ;; label = @10
                        local.get 7
                        local.get 3
                        i32.ne
                        br_if 0 (;@10;)
                        i32.const 0
                        local.get 5
                        i32.store offset=1054916
                        i32.const 0
                        i32.const 0
                        i32.load offset=1054904
                        local.get 4
                        i32.add
                        local.tee 4
                        i32.store offset=1054904
                        local.get 5
                        local.get 4
                        i32.const 1
                        i32.or
                        i32.store offset=4
                        br 3 (;@7;)
                      end
                      block ;; label = @10
                        local.get 7
                        i32.const 0
                        i32.load offset=1054912
                        i32.ne
                        br_if 0 (;@10;)
                        i32.const 0
                        local.get 5
                        i32.store offset=1054912
                        i32.const 0
                        i32.const 0
                        i32.load offset=1054900
                        local.get 4
                        i32.add
                        local.tee 4
                        i32.store offset=1054900
                        local.get 5
                        local.get 4
                        i32.const 1
                        i32.or
                        i32.store offset=4
                        local.get 5
                        local.get 4
                        i32.add
                        local.get 4
                        i32.store
                        br 3 (;@7;)
                      end
                      block ;; label = @10
                        local.get 7
                        i32.load offset=4
                        local.tee 3
                        i32.const 3
                        i32.and
                        i32.const 1
                        i32.ne
                        br_if 0 (;@10;)
                        local.get 3
                        i32.const -8
                        i32.and
                        local.set 8
                        block ;; label = @11
                          block ;; label = @12
                            local.get 3
                            i32.const 255
                            i32.gt_u
                            br_if 0 (;@12;)
                            local.get 7
                            i32.load offset=8
                            local.tee 6
                            local.get 3
                            i32.const 3
                            i32.shr_u
                            local.tee 9
                            i32.const 3
                            i32.shl
                            i32.const 1054932
                            i32.add
                            local.tee 0
                            i32.eq
                            drop
                            block ;; label = @13
                              local.get 7
                              i32.load offset=12
                              local.tee 3
                              local.get 6
                              i32.ne
                              br_if 0 (;@13;)
                              i32.const 0
                              i32.const 0
                              i32.load offset=1054892
                              i32.const -2
                              local.get 9
                              i32.rotl
                              i32.and
                              i32.store offset=1054892
                              br 2 (;@11;)
                            end
                            local.get 3
                            local.get 0
                            i32.eq
                            drop
                            local.get 3
                            local.get 6
                            i32.store offset=8
                            local.get 6
                            local.get 3
                            i32.store offset=12
                            br 1 (;@11;)
                          end
                          local.get 7
                          i32.load offset=24
                          local.set 10
                          block ;; label = @12
                            block ;; label = @13
                              local.get 7
                              i32.load offset=12
                              local.tee 0
                              local.get 7
                              i32.eq
                              br_if 0 (;@13;)
                              local.get 7
                              i32.load offset=8
                              local.tee 3
                              local.get 9
                              i32.lt_u
                              drop
                              local.get 0
                              local.get 3
                              i32.store offset=8
                              local.get 3
                              local.get 0
                              i32.store offset=12
                              br 1 (;@12;)
                            end
                            block ;; label = @13
                              local.get 7
                              i32.const 20
                              i32.add
                              local.tee 3
                              i32.load
                              local.tee 6
                              br_if 0 (;@13;)
                              local.get 7
                              i32.const 16
                              i32.add
                              local.tee 3
                              i32.load
                              local.tee 6
                              br_if 0 (;@13;)
                              i32.const 0
                              local.set 0
                              br 1 (;@12;)
                            end
                            loop ;; label = @13
                              local.get 3
                              local.set 9
                              local.get 6
                              local.tee 0
                              i32.const 20
                              i32.add
                              local.tee 3
                              i32.load
                              local.tee 6
                              br_if 0 (;@13;)
                              local.get 0
                              i32.const 16
                              i32.add
                              local.set 3
                              local.get 0
                              i32.load offset=16
                              local.tee 6
                              br_if 0 (;@13;)
                            end
                            local.get 9
                            i32.const 0
                            i32.store
                          end
                          local.get 10
                          i32.eqz
                          br_if 0 (;@11;)
                          block ;; label = @12
                            block ;; label = @13
                              local.get 7
                              local.get 7
                              i32.load offset=28
                              local.tee 6
                              i32.const 2
                              i32.shl
                              i32.const 1055196
                              i32.add
                              local.tee 3
                              i32.load
                              i32.ne
                              br_if 0 (;@13;)
                              local.get 3
                              local.get 0
                              i32.store
                              local.get 0
                              br_if 1 (;@12;)
                              i32.const 0
                              i32.const 0
                              i32.load offset=1054896
                              i32.const -2
                              local.get 6
                              i32.rotl
                              i32.and
                              i32.store offset=1054896
                              br 2 (;@11;)
                            end
                            local.get 10
                            i32.const 16
                            i32.const 20
                            local.get 10
                            i32.load offset=16
                            local.get 7
                            i32.eq
                            select
                            i32.add
                            local.get 0
                            i32.store
                            local.get 0
                            i32.eqz
                            br_if 1 (;@11;)
                          end
                          local.get 0
                          local.get 10
                          i32.store offset=24
                          block ;; label = @12
                            local.get 7
                            i32.load offset=16
                            local.tee 3
                            i32.eqz
                            br_if 0 (;@12;)
                            local.get 0
                            local.get 3
                            i32.store offset=16
                            local.get 3
                            local.get 0
                            i32.store offset=24
                          end
                          local.get 7
                          i32.load offset=20
                          local.tee 3
                          i32.eqz
                          br_if 0 (;@11;)
                          local.get 0
                          i32.const 20
                          i32.add
                          local.get 3
                          i32.store
                          local.get 3
                          local.get 0
                          i32.store offset=24
                        end
                        local.get 8
                        local.get 4
                        i32.add
                        local.set 4
                        local.get 7
                        local.get 8
                        i32.add
                        local.tee 7
                        i32.load offset=4
                        local.set 3
                      end
                      local.get 7
                      local.get 3
                      i32.const -2
                      i32.and
                      i32.store offset=4
                      local.get 5
                      local.get 4
                      i32.add
                      local.get 4
                      i32.store
                      local.get 5
                      local.get 4
                      i32.const 1
                      i32.or
                      i32.store offset=4
                      block ;; label = @10
                        local.get 4
                        i32.const 255
                        i32.gt_u
                        br_if 0 (;@10;)
                        local.get 4
                        i32.const -8
                        i32.and
                        i32.const 1054932
                        i32.add
                        local.set 3
                        block ;; label = @11
                          block ;; label = @12
                            i32.const 0
                            i32.load offset=1054892
                            local.tee 6
                            i32.const 1
                            local.get 4
                            i32.const 3
                            i32.shr_u
                            i32.shl
                            local.tee 4
                            i32.and
                            br_if 0 (;@12;)
                            i32.const 0
                            local.get 6
                            local.get 4
                            i32.or
                            i32.store offset=1054892
                            local.get 3
                            local.set 4
                            br 1 (;@11;)
                          end
                          local.get 3
                          i32.load offset=8
                          local.set 4
                        end
                        local.get 4
                        local.get 5
                        i32.store offset=12
                        local.get 3
                        local.get 5
                        i32.store offset=8
                        local.get 5
                        local.get 3
                        i32.store offset=12
                        local.get 5
                        local.get 4
                        i32.store offset=8
                        br 3 (;@7;)
                      end
                      i32.const 31
                      local.set 3
                      block ;; label = @10
                        local.get 4
                        i32.const 16777215
                        i32.gt_u
                        br_if 0 (;@10;)
                        local.get 4
                        i32.const 8
                        i32.shr_u
                        local.tee 3
                        local.get 3
                        i32.const 1048320
                        i32.add
                        i32.const 16
                        i32.shr_u
                        i32.const 8
                        i32.and
                        local.tee 3
                        i32.shl
                        local.tee 6
                        local.get 6
                        i32.const 520192
                        i32.add
                        i32.const 16
                        i32.shr_u
                        i32.const 4
                        i32.and
                        local.tee 6
                        i32.shl
                        local.tee 0
                        local.get 0
                        i32.const 245760
                        i32.add
                        i32.const 16
                        i32.shr_u
                        i32.const 2
                        i32.and
                        local.tee 0
                        i32.shl
                        i32.const 15
                        i32.shr_u
                        local.get 3
                        local.get 6
                        i32.or
                        local.get 0
                        i32.or
                        i32.sub
                        local.tee 3
                        i32.const 1
                        i32.shl
                        local.get 4
                        local.get 3
                        i32.const 21
                        i32.add
                        i32.shr_u
                        i32.const 1
                        i32.and
                        i32.or
                        i32.const 28
                        i32.add
                        local.set 3
                      end
                      local.get 5
                      local.get 3
                      i32.store offset=28
                      local.get 5
                      i64.const 0
                      i64.store offset=16 align=4
                      local.get 3
                      i32.const 2
                      i32.shl
                      i32.const 1055196
                      i32.add
                      local.set 6
                      block ;; label = @10
                        i32.const 0
                        i32.load offset=1054896
                        local.tee 0
                        i32.const 1
                        local.get 3
                        i32.shl
                        local.tee 9
                        i32.and
                        br_if 0 (;@10;)
                        local.get 6
                        local.get 5
                        i32.store
                        i32.const 0
                        local.get 0
                        local.get 9
                        i32.or
                        i32.store offset=1054896
                        local.get 5
                        local.get 6
                        i32.store offset=24
                        local.get 5
                        local.get 5
                        i32.store offset=8
                        local.get 5
                        local.get 5
                        i32.store offset=12
                        br 3 (;@7;)
                      end
                      local.get 4
                      i32.const 0
                      i32.const 25
                      local.get 3
                      i32.const 1
                      i32.shr_u
                      i32.sub
                      local.get 3
                      i32.const 31
                      i32.eq
                      select
                      i32.shl
                      local.set 3
                      local.get 6
                      i32.load
                      local.set 0
                      loop ;; label = @10
                        local.get 0
                        local.tee 6
                        i32.load offset=4
                        i32.const -8
                        i32.and
                        local.get 4
                        i32.eq
                        br_if 2 (;@8;)
                        local.get 3
                        i32.const 29
                        i32.shr_u
                        local.set 0
                        local.get 3
                        i32.const 1
                        i32.shl
                        local.set 3
                        local.get 6
                        local.get 0
                        i32.const 4
                        i32.and
                        i32.add
                        i32.const 16
                        i32.add
                        local.tee 9
                        i32.load
                        local.tee 0
                        br_if 0 (;@10;)
                      end
                      local.get 9
                      local.get 5
                      i32.store
                      local.get 5
                      local.get 6
                      i32.store offset=24
                      local.get 5
                      local.get 5
                      i32.store offset=12
                      local.get 5
                      local.get 5
                      i32.store offset=8
                      br 2 (;@7;)
                    end
                    local.get 0
                    i32.const -8
                    local.get 0
                    i32.sub
                    i32.const 15
                    i32.and
                    i32.const 0
                    local.get 0
                    i32.const 8
                    i32.add
                    i32.const 15
                    i32.and
                    select
                    local.tee 4
                    i32.add
                    local.tee 2
                    local.get 7
                    i32.const -56
                    i32.add
                    local.tee 9
                    local.get 4
                    i32.sub
                    local.tee 4
                    i32.const 1
                    i32.or
                    i32.store offset=4
                    local.get 0
                    local.get 9
                    i32.add
                    i32.const 56
                    i32.store offset=4
                    local.get 3
                    local.get 6
                    i32.const 55
                    local.get 6
                    i32.sub
                    i32.const 15
                    i32.and
                    i32.const 0
                    local.get 6
                    i32.const -55
                    i32.add
                    i32.const 15
                    i32.and
                    select
                    i32.add
                    i32.const -63
                    i32.add
                    local.tee 9
                    local.get 9
                    local.get 3
                    i32.const 16
                    i32.add
                    i32.lt_u
                    select
                    local.tee 9
                    i32.const 35
                    i32.store offset=4
                    i32.const 0
                    i32.const 0
                    i32.load offset=1055380
                    i32.store offset=1054920
                    i32.const 0
                    local.get 4
                    i32.store offset=1054904
                    i32.const 0
                    local.get 2
                    i32.store offset=1054916
                    local.get 9
                    i32.const 16
                    i32.add
                    i32.const 0
                    i64.load offset=1055348 align=4
                    i64.store align=4
                    local.get 9
                    i32.const 0
                    i64.load offset=1055340 align=4
                    i64.store offset=8 align=4
                    i32.const 0
                    local.get 9
                    i32.const 8
                    i32.add
                    i32.store offset=1055348
                    i32.const 0
                    local.get 7
                    i32.store offset=1055344
                    i32.const 0
                    local.get 0
                    i32.store offset=1055340
                    i32.const 0
                    i32.const 0
                    i32.store offset=1055352
                    local.get 9
                    i32.const 36
                    i32.add
                    local.set 4
                    loop ;; label = @9
                      local.get 4
                      i32.const 7
                      i32.store
                      local.get 4
                      i32.const 4
                      i32.add
                      local.tee 4
                      local.get 6
                      i32.lt_u
                      br_if 0 (;@9;)
                    end
                    local.get 9
                    local.get 3
                    i32.eq
                    br_if 3 (;@5;)
                    local.get 9
                    local.get 9
                    i32.load offset=4
                    i32.const -2
                    i32.and
                    i32.store offset=4
                    local.get 9
                    local.get 9
                    local.get 3
                    i32.sub
                    local.tee 0
                    i32.store
                    local.get 3
                    local.get 0
                    i32.const 1
                    i32.or
                    i32.store offset=4
                    block ;; label = @9
                      local.get 0
                      i32.const 255
                      i32.gt_u
                      br_if 0 (;@9;)
                      local.get 0
                      i32.const -8
                      i32.and
                      i32.const 1054932
                      i32.add
                      local.set 4
                      block ;; label = @10
                        block ;; label = @11
                          i32.const 0
                          i32.load offset=1054892
                          local.tee 6
                          i32.const 1
                          local.get 0
                          i32.const 3
                          i32.shr_u
                          i32.shl
                          local.tee 0
                          i32.and
                          br_if 0 (;@11;)
                          i32.const 0
                          local.get 6
                          local.get 0
                          i32.or
                          i32.store offset=1054892
                          local.get 4
                          local.set 6
                          br 1 (;@10;)
                        end
                        local.get 4
                        i32.load offset=8
                        local.set 6
                      end
                      local.get 6
                      local.get 3
                      i32.store offset=12
                      local.get 4
                      local.get 3
                      i32.store offset=8
                      local.get 3
                      local.get 4
                      i32.store offset=12
                      local.get 3
                      local.get 6
                      i32.store offset=8
                      br 4 (;@5;)
                    end
                    i32.const 31
                    local.set 4
                    block ;; label = @9
                      local.get 0
                      i32.const 16777215
                      i32.gt_u
                      br_if 0 (;@9;)
                      local.get 0
                      i32.const 8
                      i32.shr_u
                      local.tee 4
                      local.get 4
                      i32.const 1048320
                      i32.add
                      i32.const 16
                      i32.shr_u
                      i32.const 8
                      i32.and
                      local.tee 4
                      i32.shl
                      local.tee 6
                      local.get 6
                      i32.const 520192
                      i32.add
                      i32.const 16
                      i32.shr_u
                      i32.const 4
                      i32.and
                      local.tee 6
                      i32.shl
                      local.tee 9
                      local.get 9
                      i32.const 245760
                      i32.add
                      i32.const 16
                      i32.shr_u
                      i32.const 2
                      i32.and
                      local.tee 9
                      i32.shl
                      i32.const 15
                      i32.shr_u
                      local.get 4
                      local.get 6
                      i32.or
                      local.get 9
                      i32.or
                      i32.sub
                      local.tee 4
                      i32.const 1
                      i32.shl
                      local.get 0
                      local.get 4
                      i32.const 21
                      i32.add
                      i32.shr_u
                      i32.const 1
                      i32.and
                      i32.or
                      i32.const 28
                      i32.add
                      local.set 4
                    end
                    local.get 3
                    local.get 4
                    i32.store offset=28
                    local.get 3
                    i64.const 0
                    i64.store offset=16 align=4
                    local.get 4
                    i32.const 2
                    i32.shl
                    i32.const 1055196
                    i32.add
                    local.set 6
                    block ;; label = @9
                      i32.const 0
                      i32.load offset=1054896
                      local.tee 9
                      i32.const 1
                      local.get 4
                      i32.shl
                      local.tee 7
                      i32.and
                      br_if 0 (;@9;)
                      local.get 6
                      local.get 3
                      i32.store
                      i32.const 0
                      local.get 9
                      local.get 7
                      i32.or
                      i32.store offset=1054896
                      local.get 3
                      local.get 6
                      i32.store offset=24
                      local.get 3
                      local.get 3
                      i32.store offset=8
                      local.get 3
                      local.get 3
                      i32.store offset=12
                      br 4 (;@5;)
                    end
                    local.get 0
                    i32.const 0
                    i32.const 25
                    local.get 4
                    i32.const 1
                    i32.shr_u
                    i32.sub
                    local.get 4
                    i32.const 31
                    i32.eq
                    select
                    i32.shl
                    local.set 4
                    local.get 6
                    i32.load
                    local.set 9
                    loop ;; label = @9
                      local.get 9
                      local.tee 6
                      i32.load offset=4
                      i32.const -8
                      i32.and
                      local.get 0
                      i32.eq
                      br_if 3 (;@6;)
                      local.get 4
                      i32.const 29
                      i32.shr_u
                      local.set 9
                      local.get 4
                      i32.const 1
                      i32.shl
                      local.set 4
                      local.get 6
                      local.get 9
                      i32.const 4
                      i32.and
                      i32.add
                      i32.const 16
                      i32.add
                      local.tee 7
                      i32.load
                      local.tee 9
                      br_if 0 (;@9;)
                    end
                    local.get 7
                    local.get 3
                    i32.store
                    local.get 3
                    local.get 6
                    i32.store offset=24
                    local.get 3
                    local.get 3
                    i32.store offset=12
                    local.get 3
                    local.get 3
                    i32.store offset=8
                    br 3 (;@5;)
                  end
                  local.get 6
                  i32.load offset=8
                  local.tee 4
                  local.get 5
                  i32.store offset=12
                  local.get 6
                  local.get 5
                  i32.store offset=8
                  local.get 5
                  i32.const 0
                  i32.store offset=24
                  local.get 5
                  local.get 6
                  i32.store offset=12
                  local.get 5
                  local.get 4
                  i32.store offset=8
                end
                local.get 2
                i32.const 8
                i32.add
                local.set 4
                br 5 (;@1;)
              end
              local.get 6
              i32.load offset=8
              local.tee 4
              local.get 3
              i32.store offset=12
              local.get 6
              local.get 3
              i32.store offset=8
              local.get 3
              i32.const 0
              i32.store offset=24
              local.get 3
              local.get 6
              i32.store offset=12
              local.get 3
              local.get 4
              i32.store offset=8
            end
            i32.const 0
            i32.load offset=1054904
            local.tee 4
            local.get 5
            i32.le_u
            br_if 0 (;@4;)
            i32.const 0
            i32.load offset=1054916
            local.tee 3
            local.get 5
            i32.add
            local.tee 6
            local.get 4
            local.get 5
            i32.sub
            local.tee 4
            i32.const 1
            i32.or
            i32.store offset=4
            i32.const 0
            local.get 4
            i32.store offset=1054904
            i32.const 0
            local.get 6
            i32.store offset=1054916
            local.get 3
            local.get 5
            i32.const 3
            i32.or
            i32.store offset=4
            local.get 3
            i32.const 8
            i32.add
            local.set 4
            br 3 (;@1;)
          end
          i32.const 0
          local.set 4
          i32.const 0
          i32.const 48
          i32.store offset=1055388
          br 2 (;@1;)
        end
        block ;; label = @3
          local.get 2
          i32.eqz
          br_if 0 (;@3;)
          block ;; label = @4
            block ;; label = @5
              local.get 9
              local.get 9
              i32.load offset=28
              local.tee 6
              i32.const 2
              i32.shl
              i32.const 1055196
              i32.add
              local.tee 4
              i32.load
              i32.ne
              br_if 0 (;@5;)
              local.get 4
              local.get 0
              i32.store
              local.get 0
              br_if 1 (;@4;)
              i32.const 0
              local.get 10
              i32.const -2
              local.get 6
              i32.rotl
              i32.and
              local.tee 10
              i32.store offset=1054896
              br 2 (;@3;)
            end
            local.get 2
            i32.const 16
            i32.const 20
            local.get 2
            i32.load offset=16
            local.get 9
            i32.eq
            select
            i32.add
            local.get 0
            i32.store
            local.get 0
            i32.eqz
            br_if 1 (;@3;)
          end
          local.get 0
          local.get 2
          i32.store offset=24
          block ;; label = @4
            local.get 9
            i32.load offset=16
            local.tee 4
            i32.eqz
            br_if 0 (;@4;)
            local.get 0
            local.get 4
            i32.store offset=16
            local.get 4
            local.get 0
            i32.store offset=24
          end
          local.get 9
          i32.const 20
          i32.add
          i32.load
          local.tee 4
          i32.eqz
          br_if 0 (;@3;)
          local.get 0
          i32.const 20
          i32.add
          local.get 4
          i32.store
          local.get 4
          local.get 0
          i32.store offset=24
        end
        block ;; label = @3
          block ;; label = @4
            local.get 3
            i32.const 15
            i32.gt_u
            br_if 0 (;@4;)
            local.get 9
            local.get 3
            local.get 5
            i32.add
            local.tee 4
            i32.const 3
            i32.or
            i32.store offset=4
            local.get 9
            local.get 4
            i32.add
            local.tee 4
            local.get 4
            i32.load offset=4
            i32.const 1
            i32.or
            i32.store offset=4
            br 1 (;@3;)
          end
          local.get 9
          local.get 5
          i32.add
          local.tee 0
          local.get 3
          i32.const 1
          i32.or
          i32.store offset=4
          local.get 9
          local.get 5
          i32.const 3
          i32.or
          i32.store offset=4
          local.get 0
          local.get 3
          i32.add
          local.get 3
          i32.store
          block ;; label = @4
            local.get 3
            i32.const 255
            i32.gt_u
            br_if 0 (;@4;)
            local.get 3
            i32.const -8
            i32.and
            i32.const 1054932
            i32.add
            local.set 4
            block ;; label = @5
              block ;; label = @6
                i32.const 0
                i32.load offset=1054892
                local.tee 6
                i32.const 1
                local.get 3
                i32.const 3
                i32.shr_u
                i32.shl
                local.tee 3
                i32.and
                br_if 0 (;@6;)
                i32.const 0
                local.get 6
                local.get 3
                i32.or
                i32.store offset=1054892
                local.get 4
                local.set 3
                br 1 (;@5;)
              end
              local.get 4
              i32.load offset=8
              local.set 3
            end
            local.get 3
            local.get 0
            i32.store offset=12
            local.get 4
            local.get 0
            i32.store offset=8
            local.get 0
            local.get 4
            i32.store offset=12
            local.get 0
            local.get 3
            i32.store offset=8
            br 1 (;@3;)
          end
          i32.const 31
          local.set 4
          block ;; label = @4
            local.get 3
            i32.const 16777215
            i32.gt_u
            br_if 0 (;@4;)
            local.get 3
            i32.const 8
            i32.shr_u
            local.tee 4
            local.get 4
            i32.const 1048320
            i32.add
            i32.const 16
            i32.shr_u
            i32.const 8
            i32.and
            local.tee 4
            i32.shl
            local.tee 6
            local.get 6
            i32.const 520192
            i32.add
            i32.const 16
            i32.shr_u
            i32.const 4
            i32.and
            local.tee 6
            i32.shl
            local.tee 5
            local.get 5
            i32.const 245760
            i32.add
            i32.const 16
            i32.shr_u
            i32.const 2
            i32.and
            local.tee 5
            i32.shl
            i32.const 15
            i32.shr_u
            local.get 4
            local.get 6
            i32.or
            local.get 5
            i32.or
            i32.sub
            local.tee 4
            i32.const 1
            i32.shl
            local.get 3
            local.get 4
            i32.const 21
            i32.add
            i32.shr_u
            i32.const 1
            i32.and
            i32.or
            i32.const 28
            i32.add
            local.set 4
          end
          local.get 0
          local.get 4
          i32.store offset=28
          local.get 0
          i64.const 0
          i64.store offset=16 align=4
          local.get 4
          i32.const 2
          i32.shl
          i32.const 1055196
          i32.add
          local.set 6
          block ;; label = @4
            local.get 10
            i32.const 1
            local.get 4
            i32.shl
            local.tee 5
            i32.and
            br_if 0 (;@4;)
            local.get 6
            local.get 0
            i32.store
            i32.const 0
            local.get 10
            local.get 5
            i32.or
            i32.store offset=1054896
            local.get 0
            local.get 6
            i32.store offset=24
            local.get 0
            local.get 0
            i32.store offset=8
            local.get 0
            local.get 0
            i32.store offset=12
            br 1 (;@3;)
          end
          local.get 3
          i32.const 0
          i32.const 25
          local.get 4
          i32.const 1
          i32.shr_u
          i32.sub
          local.get 4
          i32.const 31
          i32.eq
          select
          i32.shl
          local.set 4
          local.get 6
          i32.load
          local.set 5
          block ;; label = @4
            loop ;; label = @5
              local.get 5
              local.tee 6
              i32.load offset=4
              i32.const -8
              i32.and
              local.get 3
              i32.eq
              br_if 1 (;@4;)
              local.get 4
              i32.const 29
              i32.shr_u
              local.set 5
              local.get 4
              i32.const 1
              i32.shl
              local.set 4
              local.get 6
              local.get 5
              i32.const 4
              i32.and
              i32.add
              i32.const 16
              i32.add
              local.tee 7
              i32.load
              local.tee 5
              br_if 0 (;@5;)
            end
            local.get 7
            local.get 0
            i32.store
            local.get 0
            local.get 6
            i32.store offset=24
            local.get 0
            local.get 0
            i32.store offset=12
            local.get 0
            local.get 0
            i32.store offset=8
            br 1 (;@3;)
          end
          local.get 6
          i32.load offset=8
          local.tee 4
          local.get 0
          i32.store offset=12
          local.get 6
          local.get 0
          i32.store offset=8
          local.get 0
          i32.const 0
          i32.store offset=24
          local.get 0
          local.get 6
          i32.store offset=12
          local.get 0
          local.get 4
          i32.store offset=8
        end
        local.get 9
        i32.const 8
        i32.add
        local.set 4
        br 1 (;@1;)
      end
      block ;; label = @2
        local.get 11
        i32.eqz
        br_if 0 (;@2;)
        block ;; label = @3
          block ;; label = @4
            local.get 0
            local.get 0
            i32.load offset=28
            local.tee 6
            i32.const 2
            i32.shl
            i32.const 1055196
            i32.add
            local.tee 4
            i32.load
            i32.ne
            br_if 0 (;@4;)
            local.get 4
            local.get 9
            i32.store
            local.get 9
            br_if 1 (;@3;)
            i32.const 0
            local.get 10
            i32.const -2
            local.get 6
            i32.rotl
            i32.and
            i32.store offset=1054896
            br 2 (;@2;)
          end
          local.get 11
          i32.const 16
          i32.const 20
          local.get 11
          i32.load offset=16
          local.get 0
          i32.eq
          select
          i32.add
          local.get 9
          i32.store
          local.get 9
          i32.eqz
          br_if 1 (;@2;)
        end
        local.get 9
        local.get 11
        i32.store offset=24
        block ;; label = @3
          local.get 0
          i32.load offset=16
          local.tee 4
          i32.eqz
          br_if 0 (;@3;)
          local.get 9
          local.get 4
          i32.store offset=16
          local.get 4
          local.get 9
          i32.store offset=24
        end
        local.get 0
        i32.const 20
        i32.add
        i32.load
        local.tee 4
        i32.eqz
        br_if 0 (;@2;)
        local.get 9
        i32.const 20
        i32.add
        local.get 4
        i32.store
        local.get 4
        local.get 9
        i32.store offset=24
      end
      block ;; label = @2
        block ;; label = @3
          local.get 3
          i32.const 15
          i32.gt_u
          br_if 0 (;@3;)
          local.get 0
          local.get 3
          local.get 5
          i32.add
          local.tee 4
          i32.const 3
          i32.or
          i32.store offset=4
          local.get 0
          local.get 4
          i32.add
          local.tee 4
          local.get 4
          i32.load offset=4
          i32.const 1
          i32.or
          i32.store offset=4
          br 1 (;@2;)
        end
        local.get 0
        local.get 5
        i32.add
        local.tee 6
        local.get 3
        i32.const 1
        i32.or
        i32.store offset=4
        local.get 0
        local.get 5
        i32.const 3
        i32.or
        i32.store offset=4
        local.get 6
        local.get 3
        i32.add
        local.get 3
        i32.store
        block ;; label = @3
          local.get 8
          i32.eqz
          br_if 0 (;@3;)
          local.get 8
          i32.const -8
          i32.and
          i32.const 1054932
          i32.add
          local.set 5
          i32.const 0
          i32.load offset=1054912
          local.set 4
          block ;; label = @4
            block ;; label = @5
              i32.const 1
              local.get 8
              i32.const 3
              i32.shr_u
              i32.shl
              local.tee 9
              local.get 7
              i32.and
              br_if 0 (;@5;)
              i32.const 0
              local.get 9
              local.get 7
              i32.or
              i32.store offset=1054892
              local.get 5
              local.set 9
              br 1 (;@4;)
            end
            local.get 5
            i32.load offset=8
            local.set 9
          end
          local.get 9
          local.get 4
          i32.store offset=12
          local.get 5
          local.get 4
          i32.store offset=8
          local.get 4
          local.get 5
          i32.store offset=12
          local.get 4
          local.get 9
          i32.store offset=8
        end
        i32.const 0
        local.get 6
        i32.store offset=1054912
        i32.const 0
        local.get 3
        i32.store offset=1054900
      end
      local.get 0
      i32.const 8
      i32.add
      local.set 4
    end
    local.get 1
    i32.const 16
    i32.add
    global.set $__stack_pointer
    local.get 4
  )
  (func $free (;212;) (type $.rodata) (param i32)
    local.get 0
    call $dlfree
  )
  (func $dlfree (;213;) (type $.rodata) (param i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    block ;; label = @1
      local.get 0
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.const -8
      i32.add
      local.tee 1
      local.get 0
      i32.const -4
      i32.add
      i32.load
      local.tee 2
      i32.const -8
      i32.and
      local.tee 0
      i32.add
      local.set 3
      block ;; label = @2
        local.get 2
        i32.const 1
        i32.and
        br_if 0 (;@2;)
        local.get 2
        i32.const 3
        i32.and
        i32.eqz
        br_if 1 (;@1;)
        local.get 1
        local.get 1
        i32.load
        local.tee 2
        i32.sub
        local.tee 1
        i32.const 0
        i32.load offset=1054908
        local.tee 4
        i32.lt_u
        br_if 1 (;@1;)
        local.get 2
        local.get 0
        i32.add
        local.set 0
        block ;; label = @3
          local.get 1
          i32.const 0
          i32.load offset=1054912
          i32.eq
          br_if 0 (;@3;)
          block ;; label = @4
            local.get 2
            i32.const 255
            i32.gt_u
            br_if 0 (;@4;)
            local.get 1
            i32.load offset=8
            local.tee 4
            local.get 2
            i32.const 3
            i32.shr_u
            local.tee 5
            i32.const 3
            i32.shl
            i32.const 1054932
            i32.add
            local.tee 6
            i32.eq
            drop
            block ;; label = @5
              local.get 1
              i32.load offset=12
              local.tee 2
              local.get 4
              i32.ne
              br_if 0 (;@5;)
              i32.const 0
              i32.const 0
              i32.load offset=1054892
              i32.const -2
              local.get 5
              i32.rotl
              i32.and
              i32.store offset=1054892
              br 3 (;@2;)
            end
            local.get 2
            local.get 6
            i32.eq
            drop
            local.get 2
            local.get 4
            i32.store offset=8
            local.get 4
            local.get 2
            i32.store offset=12
            br 2 (;@2;)
          end
          local.get 1
          i32.load offset=24
          local.set 7
          block ;; label = @4
            block ;; label = @5
              local.get 1
              i32.load offset=12
              local.tee 6
              local.get 1
              i32.eq
              br_if 0 (;@5;)
              local.get 1
              i32.load offset=8
              local.tee 2
              local.get 4
              i32.lt_u
              drop
              local.get 6
              local.get 2
              i32.store offset=8
              local.get 2
              local.get 6
              i32.store offset=12
              br 1 (;@4;)
            end
            block ;; label = @5
              local.get 1
              i32.const 20
              i32.add
              local.tee 2
              i32.load
              local.tee 4
              br_if 0 (;@5;)
              local.get 1
              i32.const 16
              i32.add
              local.tee 2
              i32.load
              local.tee 4
              br_if 0 (;@5;)
              i32.const 0
              local.set 6
              br 1 (;@4;)
            end
            loop ;; label = @5
              local.get 2
              local.set 5
              local.get 4
              local.tee 6
              i32.const 20
              i32.add
              local.tee 2
              i32.load
              local.tee 4
              br_if 0 (;@5;)
              local.get 6
              i32.const 16
              i32.add
              local.set 2
              local.get 6
              i32.load offset=16
              local.tee 4
              br_if 0 (;@5;)
            end
            local.get 5
            i32.const 0
            i32.store
          end
          local.get 7
          i32.eqz
          br_if 1 (;@2;)
          block ;; label = @4
            block ;; label = @5
              local.get 1
              local.get 1
              i32.load offset=28
              local.tee 4
              i32.const 2
              i32.shl
              i32.const 1055196
              i32.add
              local.tee 2
              i32.load
              i32.ne
              br_if 0 (;@5;)
              local.get 2
              local.get 6
              i32.store
              local.get 6
              br_if 1 (;@4;)
              i32.const 0
              i32.const 0
              i32.load offset=1054896
              i32.const -2
              local.get 4
              i32.rotl
              i32.and
              i32.store offset=1054896
              br 3 (;@2;)
            end
            local.get 7
            i32.const 16
            i32.const 20
            local.get 7
            i32.load offset=16
            local.get 1
            i32.eq
            select
            i32.add
            local.get 6
            i32.store
            local.get 6
            i32.eqz
            br_if 2 (;@2;)
          end
          local.get 6
          local.get 7
          i32.store offset=24
          block ;; label = @4
            local.get 1
            i32.load offset=16
            local.tee 2
            i32.eqz
            br_if 0 (;@4;)
            local.get 6
            local.get 2
            i32.store offset=16
            local.get 2
            local.get 6
            i32.store offset=24
          end
          local.get 1
          i32.load offset=20
          local.tee 2
          i32.eqz
          br_if 1 (;@2;)
          local.get 6
          i32.const 20
          i32.add
          local.get 2
          i32.store
          local.get 2
          local.get 6
          i32.store offset=24
          br 1 (;@2;)
        end
        local.get 3
        i32.load offset=4
        local.tee 2
        i32.const 3
        i32.and
        i32.const 3
        i32.ne
        br_if 0 (;@2;)
        local.get 3
        local.get 2
        i32.const -2
        i32.and
        i32.store offset=4
        i32.const 0
        local.get 0
        i32.store offset=1054900
        local.get 1
        local.get 0
        i32.add
        local.get 0
        i32.store
        local.get 1
        local.get 0
        i32.const 1
        i32.or
        i32.store offset=4
        return
      end
      local.get 1
      local.get 3
      i32.ge_u
      br_if 0 (;@1;)
      local.get 3
      i32.load offset=4
      local.tee 2
      i32.const 1
      i32.and
      i32.eqz
      br_if 0 (;@1;)
      block ;; label = @2
        block ;; label = @3
          local.get 2
          i32.const 2
          i32.and
          br_if 0 (;@3;)
          block ;; label = @4
            local.get 3
            i32.const 0
            i32.load offset=1054916
            i32.ne
            br_if 0 (;@4;)
            i32.const 0
            local.get 1
            i32.store offset=1054916
            i32.const 0
            i32.const 0
            i32.load offset=1054904
            local.get 0
            i32.add
            local.tee 0
            i32.store offset=1054904
            local.get 1
            local.get 0
            i32.const 1
            i32.or
            i32.store offset=4
            local.get 1
            i32.const 0
            i32.load offset=1054912
            i32.ne
            br_if 3 (;@1;)
            i32.const 0
            i32.const 0
            i32.store offset=1054900
            i32.const 0
            i32.const 0
            i32.store offset=1054912
            return
          end
          block ;; label = @4
            local.get 3
            i32.const 0
            i32.load offset=1054912
            i32.ne
            br_if 0 (;@4;)
            i32.const 0
            local.get 1
            i32.store offset=1054912
            i32.const 0
            i32.const 0
            i32.load offset=1054900
            local.get 0
            i32.add
            local.tee 0
            i32.store offset=1054900
            local.get 1
            local.get 0
            i32.const 1
            i32.or
            i32.store offset=4
            local.get 1
            local.get 0
            i32.add
            local.get 0
            i32.store
            return
          end
          local.get 2
          i32.const -8
          i32.and
          local.get 0
          i32.add
          local.set 0
          block ;; label = @4
            block ;; label = @5
              local.get 2
              i32.const 255
              i32.gt_u
              br_if 0 (;@5;)
              local.get 3
              i32.load offset=8
              local.tee 4
              local.get 2
              i32.const 3
              i32.shr_u
              local.tee 5
              i32.const 3
              i32.shl
              i32.const 1054932
              i32.add
              local.tee 6
              i32.eq
              drop
              block ;; label = @6
                local.get 3
                i32.load offset=12
                local.tee 2
                local.get 4
                i32.ne
                br_if 0 (;@6;)
                i32.const 0
                i32.const 0
                i32.load offset=1054892
                i32.const -2
                local.get 5
                i32.rotl
                i32.and
                i32.store offset=1054892
                br 2 (;@4;)
              end
              local.get 2
              local.get 6
              i32.eq
              drop
              local.get 2
              local.get 4
              i32.store offset=8
              local.get 4
              local.get 2
              i32.store offset=12
              br 1 (;@4;)
            end
            local.get 3
            i32.load offset=24
            local.set 7
            block ;; label = @5
              block ;; label = @6
                local.get 3
                i32.load offset=12
                local.tee 6
                local.get 3
                i32.eq
                br_if 0 (;@6;)
                local.get 3
                i32.load offset=8
                local.tee 2
                i32.const 0
                i32.load offset=1054908
                i32.lt_u
                drop
                local.get 6
                local.get 2
                i32.store offset=8
                local.get 2
                local.get 6
                i32.store offset=12
                br 1 (;@5;)
              end
              block ;; label = @6
                local.get 3
                i32.const 20
                i32.add
                local.tee 2
                i32.load
                local.tee 4
                br_if 0 (;@6;)
                local.get 3
                i32.const 16
                i32.add
                local.tee 2
                i32.load
                local.tee 4
                br_if 0 (;@6;)
                i32.const 0
                local.set 6
                br 1 (;@5;)
              end
              loop ;; label = @6
                local.get 2
                local.set 5
                local.get 4
                local.tee 6
                i32.const 20
                i32.add
                local.tee 2
                i32.load
                local.tee 4
                br_if 0 (;@6;)
                local.get 6
                i32.const 16
                i32.add
                local.set 2
                local.get 6
                i32.load offset=16
                local.tee 4
                br_if 0 (;@6;)
              end
              local.get 5
              i32.const 0
              i32.store
            end
            local.get 7
            i32.eqz
            br_if 0 (;@4;)
            block ;; label = @5
              block ;; label = @6
                local.get 3
                local.get 3
                i32.load offset=28
                local.tee 4
                i32.const 2
                i32.shl
                i32.const 1055196
                i32.add
                local.tee 2
                i32.load
                i32.ne
                br_if 0 (;@6;)
                local.get 2
                local.get 6
                i32.store
                local.get 6
                br_if 1 (;@5;)
                i32.const 0
                i32.const 0
                i32.load offset=1054896
                i32.const -2
                local.get 4
                i32.rotl
                i32.and
                i32.store offset=1054896
                br 2 (;@4;)
              end
              local.get 7
              i32.const 16
              i32.const 20
              local.get 7
              i32.load offset=16
              local.get 3
              i32.eq
              select
              i32.add
              local.get 6
              i32.store
              local.get 6
              i32.eqz
              br_if 1 (;@4;)
            end
            local.get 6
            local.get 7
            i32.store offset=24
            block ;; label = @5
              local.get 3
              i32.load offset=16
              local.tee 2
              i32.eqz
              br_if 0 (;@5;)
              local.get 6
              local.get 2
              i32.store offset=16
              local.get 2
              local.get 6
              i32.store offset=24
            end
            local.get 3
            i32.load offset=20
            local.tee 2
            i32.eqz
            br_if 0 (;@4;)
            local.get 6
            i32.const 20
            i32.add
            local.get 2
            i32.store
            local.get 2
            local.get 6
            i32.store offset=24
          end
          local.get 1
          local.get 0
          i32.add
          local.get 0
          i32.store
          local.get 1
          local.get 0
          i32.const 1
          i32.or
          i32.store offset=4
          local.get 1
          i32.const 0
          i32.load offset=1054912
          i32.ne
          br_if 1 (;@2;)
          i32.const 0
          local.get 0
          i32.store offset=1054900
          return
        end
        local.get 3
        local.get 2
        i32.const -2
        i32.and
        i32.store offset=4
        local.get 1
        local.get 0
        i32.add
        local.get 0
        i32.store
        local.get 1
        local.get 0
        i32.const 1
        i32.or
        i32.store offset=4
      end
      block ;; label = @2
        local.get 0
        i32.const 255
        i32.gt_u
        br_if 0 (;@2;)
        local.get 0
        i32.const -8
        i32.and
        i32.const 1054932
        i32.add
        local.set 2
        block ;; label = @3
          block ;; label = @4
            i32.const 0
            i32.load offset=1054892
            local.tee 4
            i32.const 1
            local.get 0
            i32.const 3
            i32.shr_u
            i32.shl
            local.tee 0
            i32.and
            br_if 0 (;@4;)
            i32.const 0
            local.get 4
            local.get 0
            i32.or
            i32.store offset=1054892
            local.get 2
            local.set 0
            br 1 (;@3;)
          end
          local.get 2
          i32.load offset=8
          local.set 0
        end
        local.get 0
        local.get 1
        i32.store offset=12
        local.get 2
        local.get 1
        i32.store offset=8
        local.get 1
        local.get 2
        i32.store offset=12
        local.get 1
        local.get 0
        i32.store offset=8
        return
      end
      i32.const 31
      local.set 2
      block ;; label = @2
        local.get 0
        i32.const 16777215
        i32.gt_u
        br_if 0 (;@2;)
        local.get 0
        i32.const 8
        i32.shr_u
        local.tee 2
        local.get 2
        i32.const 1048320
        i32.add
        i32.const 16
        i32.shr_u
        i32.const 8
        i32.and
        local.tee 2
        i32.shl
        local.tee 4
        local.get 4
        i32.const 520192
        i32.add
        i32.const 16
        i32.shr_u
        i32.const 4
        i32.and
        local.tee 4
        i32.shl
        local.tee 6
        local.get 6
        i32.const 245760
        i32.add
        i32.const 16
        i32.shr_u
        i32.const 2
        i32.and
        local.tee 6
        i32.shl
        i32.const 15
        i32.shr_u
        local.get 2
        local.get 4
        i32.or
        local.get 6
        i32.or
        i32.sub
        local.tee 2
        i32.const 1
        i32.shl
        local.get 0
        local.get 2
        i32.const 21
        i32.add
        i32.shr_u
        i32.const 1
        i32.and
        i32.or
        i32.const 28
        i32.add
        local.set 2
      end
      local.get 1
      local.get 2
      i32.store offset=28
      local.get 1
      i64.const 0
      i64.store offset=16 align=4
      local.get 2
      i32.const 2
      i32.shl
      i32.const 1055196
      i32.add
      local.set 4
      block ;; label = @2
        block ;; label = @3
          i32.const 0
          i32.load offset=1054896
          local.tee 6
          i32.const 1
          local.get 2
          i32.shl
          local.tee 3
          i32.and
          br_if 0 (;@3;)
          local.get 4
          local.get 1
          i32.store
          i32.const 0
          local.get 6
          local.get 3
          i32.or
          i32.store offset=1054896
          local.get 1
          local.get 4
          i32.store offset=24
          local.get 1
          local.get 1
          i32.store offset=8
          local.get 1
          local.get 1
          i32.store offset=12
          br 1 (;@2;)
        end
        local.get 0
        i32.const 0
        i32.const 25
        local.get 2
        i32.const 1
        i32.shr_u
        i32.sub
        local.get 2
        i32.const 31
        i32.eq
        select
        i32.shl
        local.set 2
        local.get 4
        i32.load
        local.set 6
        block ;; label = @3
          loop ;; label = @4
            local.get 6
            local.tee 4
            i32.load offset=4
            i32.const -8
            i32.and
            local.get 0
            i32.eq
            br_if 1 (;@3;)
            local.get 2
            i32.const 29
            i32.shr_u
            local.set 6
            local.get 2
            i32.const 1
            i32.shl
            local.set 2
            local.get 4
            local.get 6
            i32.const 4
            i32.and
            i32.add
            i32.const 16
            i32.add
            local.tee 3
            i32.load
            local.tee 6
            br_if 0 (;@4;)
          end
          local.get 3
          local.get 1
          i32.store
          local.get 1
          local.get 4
          i32.store offset=24
          local.get 1
          local.get 1
          i32.store offset=12
          local.get 1
          local.get 1
          i32.store offset=8
          br 1 (;@2;)
        end
        local.get 4
        i32.load offset=8
        local.tee 0
        local.get 1
        i32.store offset=12
        local.get 4
        local.get 1
        i32.store offset=8
        local.get 1
        i32.const 0
        i32.store offset=24
        local.get 1
        local.get 4
        i32.store offset=12
        local.get 1
        local.get 0
        i32.store offset=8
      end
      i32.const 0
      i32.const 0
      i32.load offset=1054924
      i32.const -1
      i32.add
      local.tee 1
      i32.const -1
      local.get 1
      select
      i32.store offset=1054924
    end
  )
  (func $calloc (;214;) (type 5) (param i32 i32) (result i32)
    (local i32 i64)
    block ;; label = @1
      block ;; label = @2
        local.get 0
        br_if 0 (;@2;)
        i32.const 0
        local.set 2
        br 1 (;@1;)
      end
      local.get 0
      i64.extend_i32_u
      local.get 1
      i64.extend_i32_u
      i64.mul
      local.tee 3
      i32.wrap_i64
      local.set 2
      local.get 1
      local.get 0
      i32.or
      i32.const 65536
      i32.lt_u
      br_if 0 (;@1;)
      i32.const -1
      local.get 2
      local.get 3
      i64.const 32
      i64.shr_u
      i32.wrap_i64
      i32.const 0
      i32.ne
      select
      local.set 2
    end
    block ;; label = @1
      local.get 2
      call $dlmalloc
      local.tee 0
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.const -4
      i32.add
      i32.load8_u
      i32.const 3
      i32.and
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.const 0
      local.get 2
      call $memset
      drop
    end
    local.get 0
  )
  (func $realloc (;215;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    block ;; label = @1
      local.get 0
      br_if 0 (;@1;)
      local.get 1
      call $dlmalloc
      return
    end
    block ;; label = @1
      local.get 1
      i32.const -64
      i32.lt_u
      br_if 0 (;@1;)
      i32.const 0
      i32.const 48
      i32.store offset=1055388
      i32.const 0
      return
    end
    i32.const 16
    local.get 1
    i32.const 19
    i32.add
    i32.const -16
    i32.and
    local.get 1
    i32.const 11
    i32.lt_u
    select
    local.set 2
    local.get 0
    i32.const -4
    i32.add
    local.tee 3
    i32.load
    local.tee 4
    i32.const -8
    i32.and
    local.set 5
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          local.get 4
          i32.const 3
          i32.and
          br_if 0 (;@3;)
          local.get 2
          i32.const 256
          i32.lt_u
          br_if 1 (;@2;)
          local.get 5
          local.get 2
          i32.const 4
          i32.or
          i32.lt_u
          br_if 1 (;@2;)
          local.get 5
          local.get 2
          i32.sub
          i32.const 0
          i32.load offset=1055372
          i32.const 1
          i32.shl
          i32.le_u
          br_if 2 (;@1;)
          br 1 (;@2;)
        end
        local.get 0
        i32.const -8
        i32.add
        local.tee 6
        local.get 5
        i32.add
        local.set 7
        block ;; label = @3
          local.get 5
          local.get 2
          i32.lt_u
          br_if 0 (;@3;)
          local.get 5
          local.get 2
          i32.sub
          local.tee 1
          i32.const 16
          i32.lt_u
          br_if 2 (;@1;)
          local.get 3
          local.get 2
          local.get 4
          i32.const 1
          i32.and
          i32.or
          i32.const 2
          i32.or
          i32.store
          local.get 6
          local.get 2
          i32.add
          local.tee 2
          local.get 1
          i32.const 3
          i32.or
          i32.store offset=4
          local.get 7
          local.get 7
          i32.load offset=4
          i32.const 1
          i32.or
          i32.store offset=4
          local.get 2
          local.get 1
          call $dispose_chunk
          local.get 0
          return
        end
        block ;; label = @3
          local.get 7
          i32.const 0
          i32.load offset=1054916
          i32.ne
          br_if 0 (;@3;)
          i32.const 0
          i32.load offset=1054904
          local.get 5
          i32.add
          local.tee 5
          local.get 2
          i32.le_u
          br_if 1 (;@2;)
          local.get 3
          local.get 2
          local.get 4
          i32.const 1
          i32.and
          i32.or
          i32.const 2
          i32.or
          i32.store
          i32.const 0
          local.get 6
          local.get 2
          i32.add
          local.tee 1
          i32.store offset=1054916
          i32.const 0
          local.get 5
          local.get 2
          i32.sub
          local.tee 2
          i32.store offset=1054904
          local.get 1
          local.get 2
          i32.const 1
          i32.or
          i32.store offset=4
          local.get 0
          return
        end
        block ;; label = @3
          local.get 7
          i32.const 0
          i32.load offset=1054912
          i32.ne
          br_if 0 (;@3;)
          i32.const 0
          i32.load offset=1054900
          local.get 5
          i32.add
          local.tee 5
          local.get 2
          i32.lt_u
          br_if 1 (;@2;)
          block ;; label = @4
            block ;; label = @5
              local.get 5
              local.get 2
              i32.sub
              local.tee 1
              i32.const 16
              i32.lt_u
              br_if 0 (;@5;)
              local.get 3
              local.get 2
              local.get 4
              i32.const 1
              i32.and
              i32.or
              i32.const 2
              i32.or
              i32.store
              local.get 6
              local.get 2
              i32.add
              local.tee 2
              local.get 1
              i32.const 1
              i32.or
              i32.store offset=4
              local.get 6
              local.get 5
              i32.add
              local.tee 5
              local.get 1
              i32.store
              local.get 5
              local.get 5
              i32.load offset=4
              i32.const -2
              i32.and
              i32.store offset=4
              br 1 (;@4;)
            end
            local.get 3
            local.get 4
            i32.const 1
            i32.and
            local.get 5
            i32.or
            i32.const 2
            i32.or
            i32.store
            local.get 6
            local.get 5
            i32.add
            local.tee 1
            local.get 1
            i32.load offset=4
            i32.const 1
            i32.or
            i32.store offset=4
            i32.const 0
            local.set 1
            i32.const 0
            local.set 2
          end
          i32.const 0
          local.get 2
          i32.store offset=1054912
          i32.const 0
          local.get 1
          i32.store offset=1054900
          local.get 0
          return
        end
        local.get 7
        i32.load offset=4
        local.tee 8
        i32.const 2
        i32.and
        br_if 0 (;@2;)
        local.get 8
        i32.const -8
        i32.and
        local.get 5
        i32.add
        local.tee 9
        local.get 2
        i32.lt_u
        br_if 0 (;@2;)
        local.get 9
        local.get 2
        i32.sub
        local.set 10
        block ;; label = @3
          block ;; label = @4
            local.get 8
            i32.const 255
            i32.gt_u
            br_if 0 (;@4;)
            local.get 7
            i32.load offset=8
            local.tee 1
            local.get 8
            i32.const 3
            i32.shr_u
            local.tee 11
            i32.const 3
            i32.shl
            i32.const 1054932
            i32.add
            local.tee 8
            i32.eq
            drop
            block ;; label = @5
              local.get 7
              i32.load offset=12
              local.tee 5
              local.get 1
              i32.ne
              br_if 0 (;@5;)
              i32.const 0
              i32.const 0
              i32.load offset=1054892
              i32.const -2
              local.get 11
              i32.rotl
              i32.and
              i32.store offset=1054892
              br 2 (;@3;)
            end
            local.get 5
            local.get 8
            i32.eq
            drop
            local.get 5
            local.get 1
            i32.store offset=8
            local.get 1
            local.get 5
            i32.store offset=12
            br 1 (;@3;)
          end
          local.get 7
          i32.load offset=24
          local.set 12
          block ;; label = @4
            block ;; label = @5
              local.get 7
              i32.load offset=12
              local.tee 8
              local.get 7
              i32.eq
              br_if 0 (;@5;)
              local.get 7
              i32.load offset=8
              local.tee 1
              i32.const 0
              i32.load offset=1054908
              i32.lt_u
              drop
              local.get 8
              local.get 1
              i32.store offset=8
              local.get 1
              local.get 8
              i32.store offset=12
              br 1 (;@4;)
            end
            block ;; label = @5
              local.get 7
              i32.const 20
              i32.add
              local.tee 1
              i32.load
              local.tee 5
              br_if 0 (;@5;)
              local.get 7
              i32.const 16
              i32.add
              local.tee 1
              i32.load
              local.tee 5
              br_if 0 (;@5;)
              i32.const 0
              local.set 8
              br 1 (;@4;)
            end
            loop ;; label = @5
              local.get 1
              local.set 11
              local.get 5
              local.tee 8
              i32.const 20
              i32.add
              local.tee 1
              i32.load
              local.tee 5
              br_if 0 (;@5;)
              local.get 8
              i32.const 16
              i32.add
              local.set 1
              local.get 8
              i32.load offset=16
              local.tee 5
              br_if 0 (;@5;)
            end
            local.get 11
            i32.const 0
            i32.store
          end
          local.get 12
          i32.eqz
          br_if 0 (;@3;)
          block ;; label = @4
            block ;; label = @5
              local.get 7
              local.get 7
              i32.load offset=28
              local.tee 5
              i32.const 2
              i32.shl
              i32.const 1055196
              i32.add
              local.tee 1
              i32.load
              i32.ne
              br_if 0 (;@5;)
              local.get 1
              local.get 8
              i32.store
              local.get 8
              br_if 1 (;@4;)
              i32.const 0
              i32.const 0
              i32.load offset=1054896
              i32.const -2
              local.get 5
              i32.rotl
              i32.and
              i32.store offset=1054896
              br 2 (;@3;)
            end
            local.get 12
            i32.const 16
            i32.const 20
            local.get 12
            i32.load offset=16
            local.get 7
            i32.eq
            select
            i32.add
            local.get 8
            i32.store
            local.get 8
            i32.eqz
            br_if 1 (;@3;)
          end
          local.get 8
          local.get 12
          i32.store offset=24
          block ;; label = @4
            local.get 7
            i32.load offset=16
            local.tee 1
            i32.eqz
            br_if 0 (;@4;)
            local.get 8
            local.get 1
            i32.store offset=16
            local.get 1
            local.get 8
            i32.store offset=24
          end
          local.get 7
          i32.load offset=20
          local.tee 1
          i32.eqz
          br_if 0 (;@3;)
          local.get 8
          i32.const 20
          i32.add
          local.get 1
          i32.store
          local.get 1
          local.get 8
          i32.store offset=24
        end
        block ;; label = @3
          local.get 10
          i32.const 15
          i32.gt_u
          br_if 0 (;@3;)
          local.get 3
          local.get 4
          i32.const 1
          i32.and
          local.get 9
          i32.or
          i32.const 2
          i32.or
          i32.store
          local.get 6
          local.get 9
          i32.add
          local.tee 1
          local.get 1
          i32.load offset=4
          i32.const 1
          i32.or
          i32.store offset=4
          local.get 0
          return
        end
        local.get 3
        local.get 2
        local.get 4
        i32.const 1
        i32.and
        i32.or
        i32.const 2
        i32.or
        i32.store
        local.get 6
        local.get 2
        i32.add
        local.tee 1
        local.get 10
        i32.const 3
        i32.or
        i32.store offset=4
        local.get 6
        local.get 9
        i32.add
        local.tee 2
        local.get 2
        i32.load offset=4
        i32.const 1
        i32.or
        i32.store offset=4
        local.get 1
        local.get 10
        call $dispose_chunk
        local.get 0
        return
      end
      block ;; label = @2
        local.get 1
        call $dlmalloc
        local.tee 2
        br_if 0 (;@2;)
        i32.const 0
        return
      end
      local.get 2
      local.get 0
      i32.const -4
      i32.const -8
      local.get 3
      i32.load
      local.tee 5
      i32.const 3
      i32.and
      select
      local.get 5
      i32.const -8
      i32.and
      i32.add
      local.tee 5
      local.get 1
      local.get 5
      local.get 1
      i32.lt_u
      select
      call $memcpy
      local.set 1
      local.get 0
      call $dlfree
      local.get 1
      local.set 0
    end
    local.get 0
  )
  (func $dispose_chunk (;216;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32)
    local.get 0
    local.get 1
    i32.add
    local.set 2
    block ;; label = @1
      block ;; label = @2
        local.get 0
        i32.load offset=4
        local.tee 3
        i32.const 1
        i32.and
        br_if 0 (;@2;)
        local.get 3
        i32.const 3
        i32.and
        i32.eqz
        br_if 1 (;@1;)
        local.get 0
        i32.load
        local.tee 3
        local.get 1
        i32.add
        local.set 1
        block ;; label = @3
          block ;; label = @4
            local.get 0
            local.get 3
            i32.sub
            local.tee 0
            i32.const 0
            i32.load offset=1054912
            i32.eq
            br_if 0 (;@4;)
            block ;; label = @5
              local.get 3
              i32.const 255
              i32.gt_u
              br_if 0 (;@5;)
              local.get 0
              i32.load offset=8
              local.tee 4
              local.get 3
              i32.const 3
              i32.shr_u
              local.tee 5
              i32.const 3
              i32.shl
              i32.const 1054932
              i32.add
              local.tee 6
              i32.eq
              drop
              local.get 0
              i32.load offset=12
              local.tee 3
              local.get 4
              i32.ne
              br_if 2 (;@3;)
              i32.const 0
              i32.const 0
              i32.load offset=1054892
              i32.const -2
              local.get 5
              i32.rotl
              i32.and
              i32.store offset=1054892
              br 3 (;@2;)
            end
            local.get 0
            i32.load offset=24
            local.set 7
            block ;; label = @5
              block ;; label = @6
                local.get 0
                i32.load offset=12
                local.tee 6
                local.get 0
                i32.eq
                br_if 0 (;@6;)
                local.get 0
                i32.load offset=8
                local.tee 3
                i32.const 0
                i32.load offset=1054908
                i32.lt_u
                drop
                local.get 6
                local.get 3
                i32.store offset=8
                local.get 3
                local.get 6
                i32.store offset=12
                br 1 (;@5;)
              end
              block ;; label = @6
                local.get 0
                i32.const 20
                i32.add
                local.tee 3
                i32.load
                local.tee 4
                br_if 0 (;@6;)
                local.get 0
                i32.const 16
                i32.add
                local.tee 3
                i32.load
                local.tee 4
                br_if 0 (;@6;)
                i32.const 0
                local.set 6
                br 1 (;@5;)
              end
              loop ;; label = @6
                local.get 3
                local.set 5
                local.get 4
                local.tee 6
                i32.const 20
                i32.add
                local.tee 3
                i32.load
                local.tee 4
                br_if 0 (;@6;)
                local.get 6
                i32.const 16
                i32.add
                local.set 3
                local.get 6
                i32.load offset=16
                local.tee 4
                br_if 0 (;@6;)
              end
              local.get 5
              i32.const 0
              i32.store
            end
            local.get 7
            i32.eqz
            br_if 2 (;@2;)
            block ;; label = @5
              block ;; label = @6
                local.get 0
                local.get 0
                i32.load offset=28
                local.tee 4
                i32.const 2
                i32.shl
                i32.const 1055196
                i32.add
                local.tee 3
                i32.load
                i32.ne
                br_if 0 (;@6;)
                local.get 3
                local.get 6
                i32.store
                local.get 6
                br_if 1 (;@5;)
                i32.const 0
                i32.const 0
                i32.load offset=1054896
                i32.const -2
                local.get 4
                i32.rotl
                i32.and
                i32.store offset=1054896
                br 4 (;@2;)
              end
              local.get 7
              i32.const 16
              i32.const 20
              local.get 7
              i32.load offset=16
              local.get 0
              i32.eq
              select
              i32.add
              local.get 6
              i32.store
              local.get 6
              i32.eqz
              br_if 3 (;@2;)
            end
            local.get 6
            local.get 7
            i32.store offset=24
            block ;; label = @5
              local.get 0
              i32.load offset=16
              local.tee 3
              i32.eqz
              br_if 0 (;@5;)
              local.get 6
              local.get 3
              i32.store offset=16
              local.get 3
              local.get 6
              i32.store offset=24
            end
            local.get 0
            i32.load offset=20
            local.tee 3
            i32.eqz
            br_if 2 (;@2;)
            local.get 6
            i32.const 20
            i32.add
            local.get 3
            i32.store
            local.get 3
            local.get 6
            i32.store offset=24
            br 2 (;@2;)
          end
          local.get 2
          i32.load offset=4
          local.tee 3
          i32.const 3
          i32.and
          i32.const 3
          i32.ne
          br_if 1 (;@2;)
          local.get 2
          local.get 3
          i32.const -2
          i32.and
          i32.store offset=4
          i32.const 0
          local.get 1
          i32.store offset=1054900
          local.get 2
          local.get 1
          i32.store
          local.get 0
          local.get 1
          i32.const 1
          i32.or
          i32.store offset=4
          return
        end
        local.get 3
        local.get 6
        i32.eq
        drop
        local.get 3
        local.get 4
        i32.store offset=8
        local.get 4
        local.get 3
        i32.store offset=12
      end
      block ;; label = @2
        block ;; label = @3
          local.get 2
          i32.load offset=4
          local.tee 3
          i32.const 2
          i32.and
          br_if 0 (;@3;)
          block ;; label = @4
            local.get 2
            i32.const 0
            i32.load offset=1054916
            i32.ne
            br_if 0 (;@4;)
            i32.const 0
            local.get 0
            i32.store offset=1054916
            i32.const 0
            i32.const 0
            i32.load offset=1054904
            local.get 1
            i32.add
            local.tee 1
            i32.store offset=1054904
            local.get 0
            local.get 1
            i32.const 1
            i32.or
            i32.store offset=4
            local.get 0
            i32.const 0
            i32.load offset=1054912
            i32.ne
            br_if 3 (;@1;)
            i32.const 0
            i32.const 0
            i32.store offset=1054900
            i32.const 0
            i32.const 0
            i32.store offset=1054912
            return
          end
          block ;; label = @4
            local.get 2
            i32.const 0
            i32.load offset=1054912
            i32.ne
            br_if 0 (;@4;)
            i32.const 0
            local.get 0
            i32.store offset=1054912
            i32.const 0
            i32.const 0
            i32.load offset=1054900
            local.get 1
            i32.add
            local.tee 1
            i32.store offset=1054900
            local.get 0
            local.get 1
            i32.const 1
            i32.or
            i32.store offset=4
            local.get 0
            local.get 1
            i32.add
            local.get 1
            i32.store
            return
          end
          local.get 3
          i32.const -8
          i32.and
          local.get 1
          i32.add
          local.set 1
          block ;; label = @4
            block ;; label = @5
              local.get 3
              i32.const 255
              i32.gt_u
              br_if 0 (;@5;)
              local.get 2
              i32.load offset=8
              local.tee 4
              local.get 3
              i32.const 3
              i32.shr_u
              local.tee 5
              i32.const 3
              i32.shl
              i32.const 1054932
              i32.add
              local.tee 6
              i32.eq
              drop
              block ;; label = @6
                local.get 2
                i32.load offset=12
                local.tee 3
                local.get 4
                i32.ne
                br_if 0 (;@6;)
                i32.const 0
                i32.const 0
                i32.load offset=1054892
                i32.const -2
                local.get 5
                i32.rotl
                i32.and
                i32.store offset=1054892
                br 2 (;@4;)
              end
              local.get 3
              local.get 6
              i32.eq
              drop
              local.get 3
              local.get 4
              i32.store offset=8
              local.get 4
              local.get 3
              i32.store offset=12
              br 1 (;@4;)
            end
            local.get 2
            i32.load offset=24
            local.set 7
            block ;; label = @5
              block ;; label = @6
                local.get 2
                i32.load offset=12
                local.tee 6
                local.get 2
                i32.eq
                br_if 0 (;@6;)
                local.get 2
                i32.load offset=8
                local.tee 3
                i32.const 0
                i32.load offset=1054908
                i32.lt_u
                drop
                local.get 6
                local.get 3
                i32.store offset=8
                local.get 3
                local.get 6
                i32.store offset=12
                br 1 (;@5;)
              end
              block ;; label = @6
                local.get 2
                i32.const 20
                i32.add
                local.tee 4
                i32.load
                local.tee 3
                br_if 0 (;@6;)
                local.get 2
                i32.const 16
                i32.add
                local.tee 4
                i32.load
                local.tee 3
                br_if 0 (;@6;)
                i32.const 0
                local.set 6
                br 1 (;@5;)
              end
              loop ;; label = @6
                local.get 4
                local.set 5
                local.get 3
                local.tee 6
                i32.const 20
                i32.add
                local.tee 4
                i32.load
                local.tee 3
                br_if 0 (;@6;)
                local.get 6
                i32.const 16
                i32.add
                local.set 4
                local.get 6
                i32.load offset=16
                local.tee 3
                br_if 0 (;@6;)
              end
              local.get 5
              i32.const 0
              i32.store
            end
            local.get 7
            i32.eqz
            br_if 0 (;@4;)
            block ;; label = @5
              block ;; label = @6
                local.get 2
                local.get 2
                i32.load offset=28
                local.tee 4
                i32.const 2
                i32.shl
                i32.const 1055196
                i32.add
                local.tee 3
                i32.load
                i32.ne
                br_if 0 (;@6;)
                local.get 3
                local.get 6
                i32.store
                local.get 6
                br_if 1 (;@5;)
                i32.const 0
                i32.const 0
                i32.load offset=1054896
                i32.const -2
                local.get 4
                i32.rotl
                i32.and
                i32.store offset=1054896
                br 2 (;@4;)
              end
              local.get 7
              i32.const 16
              i32.const 20
              local.get 7
              i32.load offset=16
              local.get 2
              i32.eq
              select
              i32.add
              local.get 6
              i32.store
              local.get 6
              i32.eqz
              br_if 1 (;@4;)
            end
            local.get 6
            local.get 7
            i32.store offset=24
            block ;; label = @5
              local.get 2
              i32.load offset=16
              local.tee 3
              i32.eqz
              br_if 0 (;@5;)
              local.get 6
              local.get 3
              i32.store offset=16
              local.get 3
              local.get 6
              i32.store offset=24
            end
            local.get 2
            i32.load offset=20
            local.tee 3
            i32.eqz
            br_if 0 (;@4;)
            local.get 6
            i32.const 20
            i32.add
            local.get 3
            i32.store
            local.get 3
            local.get 6
            i32.store offset=24
          end
          local.get 0
          local.get 1
          i32.add
          local.get 1
          i32.store
          local.get 0
          local.get 1
          i32.const 1
          i32.or
          i32.store offset=4
          local.get 0
          i32.const 0
          i32.load offset=1054912
          i32.ne
          br_if 1 (;@2;)
          i32.const 0
          local.get 1
          i32.store offset=1054900
          return
        end
        local.get 2
        local.get 3
        i32.const -2
        i32.and
        i32.store offset=4
        local.get 0
        local.get 1
        i32.add
        local.get 1
        i32.store
        local.get 0
        local.get 1
        i32.const 1
        i32.or
        i32.store offset=4
      end
      block ;; label = @2
        local.get 1
        i32.const 255
        i32.gt_u
        br_if 0 (;@2;)
        local.get 1
        i32.const -8
        i32.and
        i32.const 1054932
        i32.add
        local.set 3
        block ;; label = @3
          block ;; label = @4
            i32.const 0
            i32.load offset=1054892
            local.tee 4
            i32.const 1
            local.get 1
            i32.const 3
            i32.shr_u
            i32.shl
            local.tee 1
            i32.and
            br_if 0 (;@4;)
            i32.const 0
            local.get 4
            local.get 1
            i32.or
            i32.store offset=1054892
            local.get 3
            local.set 1
            br 1 (;@3;)
          end
          local.get 3
          i32.load offset=8
          local.set 1
        end
        local.get 1
        local.get 0
        i32.store offset=12
        local.get 3
        local.get 0
        i32.store offset=8
        local.get 0
        local.get 3
        i32.store offset=12
        local.get 0
        local.get 1
        i32.store offset=8
        return
      end
      i32.const 31
      local.set 3
      block ;; label = @2
        local.get 1
        i32.const 16777215
        i32.gt_u
        br_if 0 (;@2;)
        local.get 1
        i32.const 8
        i32.shr_u
        local.tee 3
        local.get 3
        i32.const 1048320
        i32.add
        i32.const 16
        i32.shr_u
        i32.const 8
        i32.and
        local.tee 3
        i32.shl
        local.tee 4
        local.get 4
        i32.const 520192
        i32.add
        i32.const 16
        i32.shr_u
        i32.const 4
        i32.and
        local.tee 4
        i32.shl
        local.tee 6
        local.get 6
        i32.const 245760
        i32.add
        i32.const 16
        i32.shr_u
        i32.const 2
        i32.and
        local.tee 6
        i32.shl
        i32.const 15
        i32.shr_u
        local.get 3
        local.get 4
        i32.or
        local.get 6
        i32.or
        i32.sub
        local.tee 3
        i32.const 1
        i32.shl
        local.get 1
        local.get 3
        i32.const 21
        i32.add
        i32.shr_u
        i32.const 1
        i32.and
        i32.or
        i32.const 28
        i32.add
        local.set 3
      end
      local.get 0
      local.get 3
      i32.store offset=28
      local.get 0
      i64.const 0
      i64.store offset=16 align=4
      local.get 3
      i32.const 2
      i32.shl
      i32.const 1055196
      i32.add
      local.set 4
      block ;; label = @2
        i32.const 0
        i32.load offset=1054896
        local.tee 6
        i32.const 1
        local.get 3
        i32.shl
        local.tee 2
        i32.and
        br_if 0 (;@2;)
        local.get 4
        local.get 0
        i32.store
        i32.const 0
        local.get 6
        local.get 2
        i32.or
        i32.store offset=1054896
        local.get 0
        local.get 4
        i32.store offset=24
        local.get 0
        local.get 0
        i32.store offset=8
        local.get 0
        local.get 0
        i32.store offset=12
        return
      end
      local.get 1
      i32.const 0
      i32.const 25
      local.get 3
      i32.const 1
      i32.shr_u
      i32.sub
      local.get 3
      i32.const 31
      i32.eq
      select
      i32.shl
      local.set 3
      local.get 4
      i32.load
      local.set 6
      block ;; label = @2
        loop ;; label = @3
          local.get 6
          local.tee 4
          i32.load offset=4
          i32.const -8
          i32.and
          local.get 1
          i32.eq
          br_if 1 (;@2;)
          local.get 3
          i32.const 29
          i32.shr_u
          local.set 6
          local.get 3
          i32.const 1
          i32.shl
          local.set 3
          local.get 4
          local.get 6
          i32.const 4
          i32.and
          i32.add
          i32.const 16
          i32.add
          local.tee 2
          i32.load
          local.tee 6
          br_if 0 (;@3;)
        end
        local.get 2
        local.get 0
        i32.store
        local.get 0
        local.get 4
        i32.store offset=24
        local.get 0
        local.get 0
        i32.store offset=12
        local.get 0
        local.get 0
        i32.store offset=8
        return
      end
      local.get 4
      i32.load offset=8
      local.tee 1
      local.get 0
      i32.store offset=12
      local.get 4
      local.get 0
      i32.store offset=8
      local.get 0
      i32.const 0
      i32.store offset=24
      local.get 0
      local.get 4
      i32.store offset=12
      local.get 0
      local.get 1
      i32.store offset=8
    end
  )
  (func $internal_memalign (;217;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32)
    block ;; label = @1
      block ;; label = @2
        local.get 0
        i32.const 16
        local.get 0
        i32.const 16
        i32.gt_u
        select
        local.tee 2
        local.get 2
        i32.const -1
        i32.add
        i32.and
        br_if 0 (;@2;)
        local.get 2
        local.set 0
        br 1 (;@1;)
      end
      i32.const 32
      local.set 3
      loop ;; label = @2
        local.get 3
        local.tee 0
        i32.const 1
        i32.shl
        local.set 3
        local.get 0
        local.get 2
        i32.lt_u
        br_if 0 (;@2;)
      end
    end
    block ;; label = @1
      i32.const -64
      local.get 0
      i32.sub
      local.get 1
      i32.gt_u
      br_if 0 (;@1;)
      i32.const 0
      i32.const 48
      i32.store offset=1055388
      i32.const 0
      return
    end
    block ;; label = @1
      local.get 0
      i32.const 16
      local.get 1
      i32.const 19
      i32.add
      i32.const -16
      i32.and
      local.get 1
      i32.const 11
      i32.lt_u
      select
      local.tee 1
      i32.add
      i32.const 12
      i32.add
      call $dlmalloc
      local.tee 3
      br_if 0 (;@1;)
      i32.const 0
      return
    end
    local.get 3
    i32.const -8
    i32.add
    local.set 2
    block ;; label = @1
      block ;; label = @2
        local.get 0
        i32.const -1
        i32.add
        local.get 3
        i32.and
        br_if 0 (;@2;)
        local.get 2
        local.set 0
        br 1 (;@1;)
      end
      local.get 3
      i32.const -4
      i32.add
      local.tee 4
      i32.load
      local.tee 5
      i32.const -8
      i32.and
      local.get 3
      local.get 0
      i32.add
      i32.const -1
      i32.add
      i32.const 0
      local.get 0
      i32.sub
      i32.and
      i32.const -8
      i32.add
      local.tee 3
      i32.const 0
      local.get 0
      local.get 3
      local.get 2
      i32.sub
      i32.const 15
      i32.gt_u
      select
      i32.add
      local.tee 0
      local.get 2
      i32.sub
      local.tee 3
      i32.sub
      local.set 6
      block ;; label = @2
        local.get 5
        i32.const 3
        i32.and
        br_if 0 (;@2;)
        local.get 0
        local.get 6
        i32.store offset=4
        local.get 0
        local.get 2
        i32.load
        local.get 3
        i32.add
        i32.store
        br 1 (;@1;)
      end
      local.get 0
      local.get 6
      local.get 0
      i32.load offset=4
      i32.const 1
      i32.and
      i32.or
      i32.const 2
      i32.or
      i32.store offset=4
      local.get 0
      local.get 6
      i32.add
      local.tee 6
      local.get 6
      i32.load offset=4
      i32.const 1
      i32.or
      i32.store offset=4
      local.get 4
      local.get 3
      local.get 4
      i32.load
      i32.const 1
      i32.and
      i32.or
      i32.const 2
      i32.or
      i32.store
      local.get 2
      local.get 3
      i32.add
      local.tee 6
      local.get 6
      i32.load offset=4
      i32.const 1
      i32.or
      i32.store offset=4
      local.get 2
      local.get 3
      call $dispose_chunk
    end
    block ;; label = @1
      local.get 0
      i32.load offset=4
      local.tee 3
      i32.const 3
      i32.and
      i32.eqz
      br_if 0 (;@1;)
      local.get 3
      i32.const -8
      i32.and
      local.tee 2
      local.get 1
      i32.const 16
      i32.add
      i32.le_u
      br_if 0 (;@1;)
      local.get 0
      local.get 1
      local.get 3
      i32.const 1
      i32.and
      i32.or
      i32.const 2
      i32.or
      i32.store offset=4
      local.get 0
      local.get 1
      i32.add
      local.tee 3
      local.get 2
      local.get 1
      i32.sub
      local.tee 1
      i32.const 3
      i32.or
      i32.store offset=4
      local.get 0
      local.get 2
      i32.add
      local.tee 2
      local.get 2
      i32.load offset=4
      i32.const 1
      i32.or
      i32.store offset=4
      local.get 3
      local.get 1
      call $dispose_chunk
    end
    local.get 0
    i32.const 8
    i32.add
  )
  (func $aligned_alloc (;218;) (type 5) (param i32 i32) (result i32)
    block ;; label = @1
      local.get 0
      i32.const 16
      i32.gt_u
      br_if 0 (;@1;)
      local.get 1
      call $dlmalloc
      return
    end
    local.get 0
    local.get 1
    call $internal_memalign
  )
  (func $_Exit (;219;) (type $.rodata) (param i32)
    local.get 0
    call $__wasi_proc_exit
    unreachable
  )
  (func $__wasilibc_ensure_environ (;220;) (type 7)
    block ;; label = @1
      i32.const 0
      i32.load offset=1054808
      i32.const -1
      i32.ne
      br_if 0 (;@1;)
      call $__wasilibc_initialize_environ
    end
  )
  (func $__wasilibc_initialize_environ (;221;) (type 7)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 0
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 0
        i32.const 12
        i32.add
        local.get 0
        i32.const 8
        i32.add
        call $__wasi_environ_sizes_get
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 0
          i32.load offset=12
          local.tee 1
          br_if 0 (;@3;)
          i32.const 1055392
          local.set 1
          br 2 (;@1;)
        end
        block ;; label = @3
          block ;; label = @4
            local.get 1
            i32.const 1
            i32.add
            local.tee 1
            i32.eqz
            br_if 0 (;@4;)
            local.get 0
            i32.load offset=8
            call $malloc
            local.tee 2
            i32.eqz
            br_if 0 (;@4;)
            local.get 1
            i32.const 4
            call $calloc
            local.tee 1
            br_if 1 (;@3;)
            local.get 2
            call $free
          end
          i32.const 70
          call $_Exit
          unreachable
        end
        local.get 1
        local.get 2
        call $__wasi_environ_get
        i32.eqz
        br_if 1 (;@1;)
        local.get 2
        call $free
        local.get 1
        call $free
      end
      i32.const 71
      call $_Exit
      unreachable
    end
    i32.const 0
    local.get 1
    i32.store offset=1054808
    local.get 0
    i32.const 16
    i32.add
    global.set $__stack_pointer
  )
  (func $__wasi_environ_get (;222;) (type 5) (param i32 i32) (result i32)
    local.get 0
    local.get 1
    call $__imported_wasi_snapshot_preview1_environ_get
    i32.const 65535
    i32.and
  )
  (func $__wasi_environ_sizes_get (;223;) (type 5) (param i32 i32) (result i32)
    local.get 0
    local.get 1
    call $__imported_wasi_snapshot_preview1_environ_sizes_get
    i32.const 65535
    i32.and
  )
  (func $__wasi_proc_exit (;224;) (type $.rodata) (param i32)
    local.get 0
    call $__imported_wasi_snapshot_preview1_proc_exit
    unreachable
  )
  (func $abort (;225;) (type 7)
    unreachable
    unreachable
  )
  (func $getcwd (;226;) (type 5) (param i32 i32) (result i32)
    (local i32)
    i32.const 0
    i32.load offset=1054812
    local.set 2
    block ;; label = @1
      block ;; label = @2
        local.get 0
        br_if 0 (;@2;)
        local.get 2
        call $strdup
        local.tee 0
        br_if 1 (;@1;)
        i32.const 0
        i32.const 48
        i32.store offset=1055388
        i32.const 0
        return
      end
      block ;; label = @2
        local.get 2
        call $strlen
        i32.const 1
        i32.add
        local.get 1
        i32.gt_u
        br_if 0 (;@2;)
        local.get 0
        local.get 2
        call $strcpy
        return
      end
      i32.const 0
      local.set 0
      i32.const 0
      i32.const 68
      i32.store offset=1055388
    end
    local.get 0
  )
  (func $sbrk (;227;) (type 9) (param i32) (result i32)
    block ;; label = @1
      local.get 0
      br_if 0 (;@1;)
      memory.size
      i32.const 16
      i32.shl
      return
    end
    block ;; label = @1
      local.get 0
      i32.const 65535
      i32.and
      br_if 0 (;@1;)
      local.get 0
      i32.const -1
      i32.le_s
      br_if 0 (;@1;)
      block ;; label = @2
        local.get 0
        i32.const 16
        i32.shr_u
        memory.grow
        local.tee 0
        i32.const -1
        i32.ne
        br_if 0 (;@2;)
        i32.const 0
        i32.const 48
        i32.store offset=1055388
        i32.const -1
        return
      end
      local.get 0
      i32.const 16
      i32.shl
      return
    end
    call $abort
    unreachable
  )
  (func $getenv (;228;) (type 9) (param i32) (result i32)
    (local i32 i32 i32 i32)
    call $__wasilibc_ensure_environ
    block ;; label = @1
      local.get 0
      i32.const 61
      call $__strchrnul
      local.tee 1
      local.get 0
      i32.ne
      br_if 0 (;@1;)
      i32.const 0
      return
    end
    i32.const 0
    local.set 2
    block ;; label = @1
      local.get 0
      local.get 1
      local.get 0
      i32.sub
      local.tee 3
      i32.add
      i32.load8_u
      br_if 0 (;@1;)
      i32.const 0
      i32.load offset=1054808
      local.tee 4
      i32.eqz
      br_if 0 (;@1;)
      local.get 4
      i32.load
      local.tee 1
      i32.eqz
      br_if 0 (;@1;)
      local.get 4
      i32.const 4
      i32.add
      local.set 4
      block ;; label = @2
        loop ;; label = @3
          block ;; label = @4
            local.get 0
            local.get 1
            local.get 3
            call $strncmp
            br_if 0 (;@4;)
            local.get 1
            local.get 3
            i32.add
            local.tee 1
            i32.load8_u
            i32.const 61
            i32.eq
            br_if 2 (;@2;)
          end
          local.get 4
          i32.load
          local.set 1
          local.get 4
          i32.const 4
          i32.add
          local.set 4
          local.get 1
          br_if 0 (;@3;)
          br 2 (;@1;)
        end
      end
      local.get 1
      i32.const 1
      i32.add
      local.set 2
    end
    local.get 2
  )
  (func $strdup (;229;) (type 9) (param i32) (result i32)
    (local i32 i32)
    block ;; label = @1
      local.get 0
      call $strlen
      i32.const 1
      i32.add
      local.tee 1
      call $malloc
      local.tee 2
      i32.eqz
      br_if 0 (;@1;)
      local.get 2
      local.get 0
      local.get 1
      call $memcpy
      drop
    end
    local.get 2
  )
  (func $__strchrnul (;230;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32)
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 1
            i32.const 255
            i32.and
            local.tee 2
            i32.eqz
            br_if 0 (;@4;)
            local.get 0
            i32.const 3
            i32.and
            i32.eqz
            br_if 2 (;@2;)
            block ;; label = @5
              local.get 0
              i32.load8_u
              local.tee 3
              br_if 0 (;@5;)
              local.get 0
              return
            end
            local.get 3
            local.get 1
            i32.const 255
            i32.and
            i32.ne
            br_if 1 (;@3;)
            local.get 0
            return
          end
          local.get 0
          local.get 0
          call $strlen
          i32.add
          return
        end
        block ;; label = @3
          local.get 0
          i32.const 1
          i32.add
          local.tee 3
          i32.const 3
          i32.and
          br_if 0 (;@3;)
          local.get 3
          local.set 0
          br 1 (;@2;)
        end
        local.get 3
        i32.load8_u
        local.tee 4
        i32.eqz
        br_if 1 (;@1;)
        local.get 4
        local.get 1
        i32.const 255
        i32.and
        i32.eq
        br_if 1 (;@1;)
        block ;; label = @3
          local.get 0
          i32.const 2
          i32.add
          local.tee 3
          i32.const 3
          i32.and
          br_if 0 (;@3;)
          local.get 3
          local.set 0
          br 1 (;@2;)
        end
        local.get 3
        i32.load8_u
        local.tee 4
        i32.eqz
        br_if 1 (;@1;)
        local.get 4
        local.get 1
        i32.const 255
        i32.and
        i32.eq
        br_if 1 (;@1;)
        block ;; label = @3
          local.get 0
          i32.const 3
          i32.add
          local.tee 3
          i32.const 3
          i32.and
          br_if 0 (;@3;)
          local.get 3
          local.set 0
          br 1 (;@2;)
        end
        local.get 3
        i32.load8_u
        local.tee 4
        i32.eqz
        br_if 1 (;@1;)
        local.get 4
        local.get 1
        i32.const 255
        i32.and
        i32.eq
        br_if 1 (;@1;)
        local.get 0
        i32.const 4
        i32.add
        local.set 0
      end
      block ;; label = @2
        local.get 0
        i32.load
        local.tee 3
        i32.const -1
        i32.xor
        local.get 3
        i32.const -16843009
        i32.add
        i32.and
        i32.const -2139062144
        i32.and
        br_if 0 (;@2;)
        local.get 2
        i32.const 16843009
        i32.mul
        local.set 2
        loop ;; label = @3
          local.get 3
          local.get 2
          i32.xor
          local.tee 3
          i32.const -1
          i32.xor
          local.get 3
          i32.const -16843009
          i32.add
          i32.and
          i32.const -2139062144
          i32.and
          br_if 1 (;@2;)
          local.get 0
          i32.const 4
          i32.add
          local.tee 0
          i32.load
          local.tee 3
          i32.const -1
          i32.xor
          local.get 3
          i32.const -16843009
          i32.add
          i32.and
          i32.const -2139062144
          i32.and
          i32.eqz
          br_if 0 (;@3;)
        end
      end
      local.get 0
      i32.const -1
      i32.add
      local.set 3
      loop ;; label = @2
        local.get 3
        i32.const 1
        i32.add
        local.tee 3
        i32.load8_u
        local.tee 0
        i32.eqz
        br_if 1 (;@1;)
        local.get 0
        local.get 1
        i32.const 255
        i32.and
        i32.ne
        br_if 0 (;@2;)
      end
    end
    local.get 3
  )
  (func $memcpy (;231;) (type 4) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32)
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          local.get 2
          i32.const 32
          i32.gt_u
          br_if 0 (;@3;)
          local.get 1
          i32.const 3
          i32.and
          i32.eqz
          br_if 1 (;@2;)
          local.get 2
          i32.eqz
          br_if 1 (;@2;)
          local.get 0
          local.get 1
          i32.load8_u
          i32.store8
          local.get 2
          i32.const -1
          i32.add
          local.set 3
          local.get 0
          i32.const 1
          i32.add
          local.set 4
          local.get 1
          i32.const 1
          i32.add
          local.tee 5
          i32.const 3
          i32.and
          i32.eqz
          br_if 2 (;@1;)
          local.get 3
          i32.eqz
          br_if 2 (;@1;)
          local.get 0
          local.get 1
          i32.load8_u offset=1
          i32.store8 offset=1
          local.get 2
          i32.const -2
          i32.add
          local.set 3
          local.get 0
          i32.const 2
          i32.add
          local.set 4
          local.get 1
          i32.const 2
          i32.add
          local.tee 5
          i32.const 3
          i32.and
          i32.eqz
          br_if 2 (;@1;)
          local.get 3
          i32.eqz
          br_if 2 (;@1;)
          local.get 0
          local.get 1
          i32.load8_u offset=2
          i32.store8 offset=2
          local.get 2
          i32.const -3
          i32.add
          local.set 3
          local.get 0
          i32.const 3
          i32.add
          local.set 4
          local.get 1
          i32.const 3
          i32.add
          local.tee 5
          i32.const 3
          i32.and
          i32.eqz
          br_if 2 (;@1;)
          local.get 3
          i32.eqz
          br_if 2 (;@1;)
          local.get 0
          local.get 1
          i32.load8_u offset=3
          i32.store8 offset=3
          local.get 2
          i32.const -4
          i32.add
          local.set 3
          local.get 0
          i32.const 4
          i32.add
          local.set 4
          local.get 1
          i32.const 4
          i32.add
          local.set 5
          br 2 (;@1;)
        end
        local.get 0
        local.get 1
        local.get 2
        memory.copy
        local.get 0
        return
      end
      local.get 2
      local.set 3
      local.get 0
      local.set 4
      local.get 1
      local.set 5
    end
    block ;; label = @1
      block ;; label = @2
        local.get 4
        i32.const 3
        i32.and
        local.tee 2
        br_if 0 (;@2;)
        block ;; label = @3
          block ;; label = @4
            local.get 3
            i32.const 16
            i32.ge_u
            br_if 0 (;@4;)
            local.get 3
            local.set 2
            br 1 (;@3;)
          end
          block ;; label = @4
            local.get 3
            i32.const -16
            i32.add
            local.tee 2
            i32.const 16
            i32.and
            br_if 0 (;@4;)
            local.get 4
            local.get 5
            i64.load align=4
            i64.store align=4
            local.get 4
            local.get 5
            i64.load offset=8 align=4
            i64.store offset=8 align=4
            local.get 4
            i32.const 16
            i32.add
            local.set 4
            local.get 5
            i32.const 16
            i32.add
            local.set 5
            local.get 2
            local.set 3
          end
          local.get 2
          i32.const 16
          i32.lt_u
          br_if 0 (;@3;)
          local.get 3
          local.set 2
          loop ;; label = @4
            local.get 4
            local.get 5
            i64.load align=4
            i64.store align=4
            local.get 4
            local.get 5
            i64.load offset=8 align=4
            i64.store offset=8 align=4
            local.get 4
            local.get 5
            i64.load offset=16 align=4
            i64.store offset=16 align=4
            local.get 4
            local.get 5
            i64.load offset=24 align=4
            i64.store offset=24 align=4
            local.get 4
            i32.const 32
            i32.add
            local.set 4
            local.get 5
            i32.const 32
            i32.add
            local.set 5
            local.get 2
            i32.const -32
            i32.add
            local.tee 2
            i32.const 15
            i32.gt_u
            br_if 0 (;@4;)
          end
        end
        block ;; label = @3
          local.get 2
          i32.const 8
          i32.and
          i32.eqz
          br_if 0 (;@3;)
          local.get 4
          local.get 5
          i64.load align=4
          i64.store align=4
          local.get 5
          i32.const 8
          i32.add
          local.set 5
          local.get 4
          i32.const 8
          i32.add
          local.set 4
        end
        block ;; label = @3
          local.get 2
          i32.const 4
          i32.and
          i32.eqz
          br_if 0 (;@3;)
          local.get 4
          local.get 5
          i32.load
          i32.store
          local.get 5
          i32.const 4
          i32.add
          local.set 5
          local.get 4
          i32.const 4
          i32.add
          local.set 4
        end
        block ;; label = @3
          local.get 2
          i32.const 2
          i32.and
          i32.eqz
          br_if 0 (;@3;)
          local.get 4
          local.get 5
          i32.load16_u align=1
          i32.store16 align=1
          local.get 4
          i32.const 2
          i32.add
          local.set 4
          local.get 5
          i32.const 2
          i32.add
          local.set 5
        end
        local.get 2
        i32.const 1
        i32.and
        i32.eqz
        br_if 1 (;@1;)
        local.get 4
        local.get 5
        i32.load8_u
        i32.store8
        local.get 0
        return
      end
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                local.get 3
                i32.const 32
                i32.lt_u
                br_if 0 (;@6;)
                block ;; label = @7
                  block ;; label = @8
                    local.get 2
                    i32.const -1
                    i32.add
                    br_table 3 (;@5;) 0 (;@8;) 1 (;@7;) 7 (;@1;)
                  end
                  local.get 4
                  local.get 5
                  i32.load
                  i32.store16 align=1
                  local.get 4
                  local.get 5
                  i32.const 2
                  i32.add
                  i32.load align=2
                  i32.store offset=2
                  local.get 4
                  local.get 5
                  i32.const 6
                  i32.add
                  i64.load align=2
                  i64.store offset=6 align=4
                  local.get 4
                  i32.const 18
                  i32.add
                  local.set 2
                  local.get 5
                  i32.const 18
                  i32.add
                  local.set 1
                  i32.const 14
                  local.set 6
                  local.get 5
                  i32.const 14
                  i32.add
                  i32.load align=2
                  local.set 5
                  i32.const 14
                  local.set 3
                  br 3 (;@4;)
                end
                local.get 4
                local.get 5
                i32.load
                i32.store8
                local.get 4
                local.get 5
                i32.const 1
                i32.add
                i32.load align=1
                i32.store offset=1
                local.get 4
                local.get 5
                i32.const 5
                i32.add
                i64.load align=1
                i64.store offset=5 align=4
                local.get 4
                i32.const 17
                i32.add
                local.set 2
                local.get 5
                i32.const 17
                i32.add
                local.set 1
                i32.const 13
                local.set 6
                local.get 5
                i32.const 13
                i32.add
                i32.load align=1
                local.set 5
                i32.const 15
                local.set 3
                br 2 (;@4;)
              end
              block ;; label = @6
                block ;; label = @7
                  local.get 3
                  i32.const 16
                  i32.and
                  br_if 0 (;@7;)
                  local.get 4
                  local.set 2
                  local.get 5
                  local.set 1
                  br 1 (;@6;)
                end
                local.get 4
                local.get 5
                i32.load8_u
                i32.store8
                local.get 4
                local.get 5
                i32.load offset=1 align=1
                i32.store offset=1 align=1
                local.get 4
                local.get 5
                i64.load offset=5 align=1
                i64.store offset=5 align=1
                local.get 4
                local.get 5
                i32.load16_u offset=13 align=1
                i32.store16 offset=13 align=1
                local.get 4
                local.get 5
                i32.load8_u offset=15
                i32.store8 offset=15
                local.get 4
                i32.const 16
                i32.add
                local.set 2
                local.get 5
                i32.const 16
                i32.add
                local.set 1
              end
              local.get 3
              i32.const 8
              i32.and
              br_if 2 (;@3;)
              br 3 (;@2;)
            end
            local.get 4
            local.get 5
            i32.load
            local.tee 2
            i32.store8
            local.get 4
            local.get 2
            i32.const 16
            i32.shr_u
            i32.store8 offset=2
            local.get 4
            local.get 2
            i32.const 8
            i32.shr_u
            i32.store8 offset=1
            local.get 4
            local.get 5
            i32.const 3
            i32.add
            i32.load align=1
            i32.store offset=3
            local.get 4
            local.get 5
            i32.const 7
            i32.add
            i64.load align=1
            i64.store offset=7 align=4
            local.get 4
            i32.const 19
            i32.add
            local.set 2
            local.get 5
            i32.const 19
            i32.add
            local.set 1
            i32.const 15
            local.set 6
            local.get 5
            i32.const 15
            i32.add
            i32.load align=1
            local.set 5
            i32.const 13
            local.set 3
          end
          local.get 4
          local.get 6
          i32.add
          local.get 5
          i32.store
        end
        local.get 2
        local.get 1
        i64.load align=1
        i64.store align=1
        local.get 2
        i32.const 8
        i32.add
        local.set 2
        local.get 1
        i32.const 8
        i32.add
        local.set 1
      end
      block ;; label = @2
        local.get 3
        i32.const 4
        i32.and
        i32.eqz
        br_if 0 (;@2;)
        local.get 2
        local.get 1
        i32.load align=1
        i32.store align=1
        local.get 2
        i32.const 4
        i32.add
        local.set 2
        local.get 1
        i32.const 4
        i32.add
        local.set 1
      end
      block ;; label = @2
        local.get 3
        i32.const 2
        i32.and
        i32.eqz
        br_if 0 (;@2;)
        local.get 2
        local.get 1
        i32.load16_u align=1
        i32.store16 align=1
        local.get 2
        i32.const 2
        i32.add
        local.set 2
        local.get 1
        i32.const 2
        i32.add
        local.set 1
      end
      local.get 3
      i32.const 1
      i32.and
      i32.eqz
      br_if 0 (;@1;)
      local.get 2
      local.get 1
      i32.load8_u
      i32.store8
    end
    local.get 0
  )
  (func $memset (;232;) (type 4) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i64)
    block ;; label = @1
      local.get 2
      i32.const 33
      i32.lt_u
      br_if 0 (;@1;)
      local.get 0
      local.get 1
      local.get 2
      memory.fill
      local.get 0
      return
    end
    block ;; label = @1
      local.get 2
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      local.get 1
      i32.store8
      local.get 2
      local.get 0
      i32.add
      local.tee 3
      i32.const -1
      i32.add
      local.get 1
      i32.store8
      local.get 2
      i32.const 3
      i32.lt_u
      br_if 0 (;@1;)
      local.get 0
      local.get 1
      i32.store8 offset=2
      local.get 0
      local.get 1
      i32.store8 offset=1
      local.get 3
      i32.const -3
      i32.add
      local.get 1
      i32.store8
      local.get 3
      i32.const -2
      i32.add
      local.get 1
      i32.store8
      local.get 2
      i32.const 7
      i32.lt_u
      br_if 0 (;@1;)
      local.get 0
      local.get 1
      i32.store8 offset=3
      local.get 3
      i32.const -4
      i32.add
      local.get 1
      i32.store8
      local.get 2
      i32.const 9
      i32.lt_u
      br_if 0 (;@1;)
      local.get 0
      i32.const 0
      local.get 0
      i32.sub
      i32.const 3
      i32.and
      local.tee 4
      i32.add
      local.tee 5
      local.get 1
      i32.const 255
      i32.and
      i32.const 16843009
      i32.mul
      local.tee 3
      i32.store
      local.get 5
      local.get 2
      local.get 4
      i32.sub
      i32.const -4
      i32.and
      local.tee 1
      i32.add
      local.tee 2
      i32.const -4
      i32.add
      local.get 3
      i32.store
      local.get 1
      i32.const 9
      i32.lt_u
      br_if 0 (;@1;)
      local.get 5
      local.get 3
      i32.store offset=8
      local.get 5
      local.get 3
      i32.store offset=4
      local.get 2
      i32.const -8
      i32.add
      local.get 3
      i32.store
      local.get 2
      i32.const -12
      i32.add
      local.get 3
      i32.store
      local.get 1
      i32.const 25
      i32.lt_u
      br_if 0 (;@1;)
      local.get 5
      local.get 3
      i32.store offset=24
      local.get 5
      local.get 3
      i32.store offset=20
      local.get 5
      local.get 3
      i32.store offset=16
      local.get 5
      local.get 3
      i32.store offset=12
      local.get 2
      i32.const -16
      i32.add
      local.get 3
      i32.store
      local.get 2
      i32.const -20
      i32.add
      local.get 3
      i32.store
      local.get 2
      i32.const -24
      i32.add
      local.get 3
      i32.store
      local.get 2
      i32.const -28
      i32.add
      local.get 3
      i32.store
      local.get 1
      local.get 5
      i32.const 4
      i32.and
      i32.const 24
      i32.or
      local.tee 2
      i32.sub
      local.tee 1
      i32.const 32
      i32.lt_u
      br_if 0 (;@1;)
      local.get 3
      i64.extend_i32_u
      i64.const 4294967297
      i64.mul
      local.set 6
      local.get 5
      local.get 2
      i32.add
      local.set 2
      loop ;; label = @2
        local.get 2
        local.get 6
        i64.store offset=24
        local.get 2
        local.get 6
        i64.store offset=16
        local.get 2
        local.get 6
        i64.store offset=8
        local.get 2
        local.get 6
        i64.store
        local.get 2
        i32.const 32
        i32.add
        local.set 2
        local.get 1
        i32.const -32
        i32.add
        local.tee 1
        i32.const 31
        i32.gt_u
        br_if 0 (;@2;)
      end
    end
    local.get 0
  )
  (func $strncmp (;233;) (type 4) (param i32 i32 i32) (result i32)
    (local i32 i32 i32)
    block ;; label = @1
      local.get 2
      br_if 0 (;@1;)
      i32.const 0
      return
    end
    i32.const 0
    local.set 3
    block ;; label = @1
      local.get 0
      i32.load8_u
      local.tee 4
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.const 1
      i32.add
      local.set 0
      local.get 2
      i32.const -1
      i32.add
      local.set 2
      loop ;; label = @2
        block ;; label = @3
          local.get 1
          i32.load8_u
          local.tee 5
          br_if 0 (;@3;)
          local.get 4
          local.set 3
          br 2 (;@1;)
        end
        block ;; label = @3
          local.get 2
          br_if 0 (;@3;)
          local.get 4
          local.set 3
          br 2 (;@1;)
        end
        block ;; label = @3
          local.get 4
          i32.const 255
          i32.and
          local.get 5
          i32.eq
          br_if 0 (;@3;)
          local.get 4
          local.set 3
          br 2 (;@1;)
        end
        local.get 2
        i32.const -1
        i32.add
        local.set 2
        local.get 1
        i32.const 1
        i32.add
        local.set 1
        local.get 0
        i32.load8_u
        local.set 4
        local.get 0
        i32.const 1
        i32.add
        local.set 0
        local.get 4
        br_if 0 (;@2;)
      end
    end
    local.get 3
    i32.const 255
    i32.and
    local.get 1
    i32.load8_u
    i32.sub
  )
  (func $__stpcpy (;234;) (type 5) (param i32 i32) (result i32)
    (local i32 i32)
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          local.get 1
          local.get 0
          i32.xor
          i32.const 3
          i32.and
          i32.eqz
          br_if 0 (;@3;)
          local.get 1
          i32.load8_u
          local.set 2
          br 1 (;@2;)
        end
        block ;; label = @3
          local.get 1
          i32.const 3
          i32.and
          i32.eqz
          br_if 0 (;@3;)
          local.get 0
          local.get 1
          i32.load8_u
          local.tee 2
          i32.store8
          block ;; label = @4
            local.get 2
            br_if 0 (;@4;)
            local.get 0
            return
          end
          local.get 0
          i32.const 1
          i32.add
          local.set 2
          block ;; label = @4
            local.get 1
            i32.const 1
            i32.add
            local.tee 3
            i32.const 3
            i32.and
            br_if 0 (;@4;)
            local.get 2
            local.set 0
            local.get 3
            local.set 1
            br 1 (;@3;)
          end
          local.get 2
          local.get 3
          i32.load8_u
          local.tee 3
          i32.store8
          local.get 3
          i32.eqz
          br_if 2 (;@1;)
          local.get 0
          i32.const 2
          i32.add
          local.set 2
          block ;; label = @4
            local.get 1
            i32.const 2
            i32.add
            local.tee 3
            i32.const 3
            i32.and
            br_if 0 (;@4;)
            local.get 2
            local.set 0
            local.get 3
            local.set 1
            br 1 (;@3;)
          end
          local.get 2
          local.get 3
          i32.load8_u
          local.tee 3
          i32.store8
          local.get 3
          i32.eqz
          br_if 2 (;@1;)
          local.get 0
          i32.const 3
          i32.add
          local.set 2
          block ;; label = @4
            local.get 1
            i32.const 3
            i32.add
            local.tee 3
            i32.const 3
            i32.and
            br_if 0 (;@4;)
            local.get 2
            local.set 0
            local.get 3
            local.set 1
            br 1 (;@3;)
          end
          local.get 2
          local.get 3
          i32.load8_u
          local.tee 3
          i32.store8
          local.get 3
          i32.eqz
          br_if 2 (;@1;)
          local.get 0
          i32.const 4
          i32.add
          local.set 0
          local.get 1
          i32.const 4
          i32.add
          local.set 1
        end
        local.get 1
        i32.load
        local.tee 2
        i32.const -1
        i32.xor
        local.get 2
        i32.const -16843009
        i32.add
        i32.and
        i32.const -2139062144
        i32.and
        br_if 0 (;@2;)
        loop ;; label = @3
          local.get 0
          local.get 2
          i32.store
          local.get 0
          i32.const 4
          i32.add
          local.set 0
          local.get 1
          i32.const 4
          i32.add
          local.tee 1
          i32.load
          local.tee 2
          i32.const -1
          i32.xor
          local.get 2
          i32.const -16843009
          i32.add
          i32.and
          i32.const -2139062144
          i32.and
          i32.eqz
          br_if 0 (;@3;)
        end
      end
      local.get 0
      local.get 2
      i32.store8
      block ;; label = @2
        local.get 2
        i32.const 255
        i32.and
        br_if 0 (;@2;)
        local.get 0
        return
      end
      local.get 1
      i32.const 1
      i32.add
      local.set 1
      local.get 0
      local.set 2
      loop ;; label = @2
        local.get 2
        local.get 1
        i32.load8_u
        local.tee 0
        i32.store8 offset=1
        local.get 1
        i32.const 1
        i32.add
        local.set 1
        local.get 2
        i32.const 1
        i32.add
        local.set 2
        local.get 0
        br_if 0 (;@2;)
      end
    end
    local.get 2
  )
  (func $strcpy (;235;) (type 5) (param i32 i32) (result i32)
    local.get 0
    local.get 1
    call $__stpcpy
    drop
    local.get 0
  )
  (func $strlen (;236;) (type 9) (param i32) (result i32)
    (local i32 i32)
    local.get 0
    local.set 1
    block ;; label = @1
      block ;; label = @2
        local.get 0
        i32.const 3
        i32.and
        i32.eqz
        br_if 0 (;@2;)
        local.get 0
        local.set 1
        local.get 0
        i32.load8_u
        i32.eqz
        br_if 1 (;@1;)
        local.get 0
        i32.const 1
        i32.add
        local.tee 1
        i32.const 3
        i32.and
        i32.eqz
        br_if 0 (;@2;)
        local.get 1
        i32.load8_u
        i32.eqz
        br_if 1 (;@1;)
        local.get 0
        i32.const 2
        i32.add
        local.tee 1
        i32.const 3
        i32.and
        i32.eqz
        br_if 0 (;@2;)
        local.get 1
        i32.load8_u
        i32.eqz
        br_if 1 (;@1;)
        local.get 0
        i32.const 3
        i32.add
        local.tee 1
        i32.const 3
        i32.and
        i32.eqz
        br_if 0 (;@2;)
        local.get 1
        i32.load8_u
        i32.eqz
        br_if 1 (;@1;)
        local.get 0
        i32.const 4
        i32.add
        local.set 1
      end
      local.get 1
      i32.const -5
      i32.add
      local.set 1
      loop ;; label = @2
        local.get 1
        i32.const 5
        i32.add
        local.set 2
        local.get 1
        i32.const 4
        i32.add
        local.set 1
        local.get 2
        i32.load
        local.tee 2
        i32.const -1
        i32.xor
        local.get 2
        i32.const -16843009
        i32.add
        i32.and
        i32.const -2139062144
        i32.and
        i32.eqz
        br_if 0 (;@2;)
      end
      loop ;; label = @2
        local.get 1
        i32.const 1
        i32.add
        local.tee 1
        i32.load8_u
        br_if 0 (;@2;)
      end
    end
    local.get 1
    local.get 0
    i32.sub
  )
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17ha27aad768d805012E (;237;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i32.load
    local.get 1
    call $_ZN64_$LT$core..str..error..Utf8Error$u20$as$u20$core..fmt..Debug$GT$3fmt17hda1fa3de94f6c9d3E
  )
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17hbcb65dd130a93744E (;238;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i32.load
    local.set 0
    block ;; label = @1
      local.get 1
      call $_ZN4core3fmt9Formatter15debug_lower_hex17hb31a3ef71c81bc79E
      br_if 0 (;@1;)
      block ;; label = @2
        local.get 1
        call $_ZN4core3fmt9Formatter15debug_upper_hex17h505100e6817602a1E
        br_if 0 (;@2;)
        local.get 0
        local.get 1
        call $_ZN4core3fmt3num3imp51_$LT$impl$u20$core..fmt..Display$u20$for$u20$u8$GT$3fmt17hde39d1f064a4150cE
        return
      end
      local.get 0
      local.get 1
      call $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..UpperHex$u20$for$u20$i8$GT$3fmt17h69613a8b6ac90b9dE
      return
    end
    local.get 0
    local.get 1
    call $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..LowerHex$u20$for$u20$i8$GT$3fmt17h6a1f1804261a5d78E
  )
  (func $_ZN4core3ptr205drop_in_place$LT$$LT$alloc..boxed..Box$LT$dyn$u20$core..error..Error$u2b$core..marker..Send$u2b$core..marker..Sync$GT$$u20$as$u20$core..convert..From$LT$alloc..string..String$GT$$GT$..from..StringError$GT$17hab57644d530a4320E (;239;) (type $.rodata) (param i32)
    (local i32)
    block ;; label = @1
      local.get 0
      i32.load
      local.tee 1
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.const 4
      i32.add
      i32.load
      local.get 1
      i32.const 1
      call $__rust_dealloc
    end
  )
  (func $_ZN4core3ptr26drop_in_place$LT$usize$GT$17h2a7616625bccfaeaE (;240;) (type $.rodata) (param i32))
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h2ab492e6e3089d90E (;241;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i32.load
    local.get 1
    call $_ZN5alloc6string6String4push17h8826a6144d067e63E
    i32.const 0
  )
  (func $_ZN5alloc6string6String4push17h8826a6144d067e63E (;242;) (type 3) (param i32 i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.const 127
        i32.gt_u
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 0
          i32.load offset=8
          local.tee 3
          local.get 0
          i32.load
          i32.ne
          br_if 0 (;@3;)
          local.get 0
          local.get 3
          call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$16reserve_for_push17h6b78444faa513e71E
          local.get 0
          i32.load offset=8
          local.set 3
        end
        local.get 0
        local.get 3
        i32.const 1
        i32.add
        i32.store offset=8
        local.get 0
        i32.load offset=4
        local.get 3
        i32.add
        local.get 1
        i32.store8
        br 1 (;@1;)
      end
      local.get 2
      i32.const 0
      i32.store offset=12
      block ;; label = @2
        block ;; label = @3
          local.get 1
          i32.const 2048
          i32.lt_u
          br_if 0 (;@3;)
          block ;; label = @4
            local.get 1
            i32.const 65536
            i32.lt_u
            br_if 0 (;@4;)
            local.get 2
            local.get 1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=15
            local.get 2
            local.get 1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=14
            local.get 2
            local.get 1
            i32.const 12
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            local.get 2
            local.get 1
            i32.const 18
            i32.shr_u
            i32.const 7
            i32.and
            i32.const 240
            i32.or
            i32.store8 offset=12
            i32.const 4
            local.set 1
            br 2 (;@2;)
          end
          local.get 2
          local.get 1
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=14
          local.get 2
          local.get 1
          i32.const 12
          i32.shr_u
          i32.const 224
          i32.or
          i32.store8 offset=12
          local.get 2
          local.get 1
          i32.const 6
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=13
          i32.const 3
          local.set 1
          br 1 (;@2;)
        end
        local.get 2
        local.get 1
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=13
        local.get 2
        local.get 1
        i32.const 6
        i32.shr_u
        i32.const 192
        i32.or
        i32.store8 offset=12
        i32.const 2
        local.set 1
      end
      block ;; label = @2
        local.get 0
        i32.load
        local.get 0
        i32.load offset=8
        local.tee 3
        i32.sub
        local.get 1
        i32.ge_u
        br_if 0 (;@2;)
        local.get 0
        local.get 3
        local.get 1
        call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h0b55e0118e192e67E
        local.get 0
        i32.load offset=8
        local.set 3
      end
      local.get 0
      i32.load offset=4
      local.get 3
      i32.add
      local.get 2
      i32.const 12
      i32.add
      local.get 1
      call $memcpy
      drop
      local.get 0
      local.get 3
      local.get 1
      i32.add
      i32.store offset=8
    end
    local.get 2
    i32.const 16
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17hc6000768d61b104eE (;243;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    local.get 0
    i32.load
    i32.store offset=4
    local.get 2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 1
    i64.load align=4
    i64.store offset=8
    local.get 2
    i32.const 4
    i32.add
    i32.const 1053116
    local.get 2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17h7558535140974479E
    local.set 1
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h6629847a357efb7bE (;244;) (type 4) (param i32 i32 i32) (result i32)
    (local i32)
    block ;; label = @1
      local.get 0
      i32.load
      local.tee 0
      i32.load
      local.get 0
      i32.load offset=8
      local.tee 3
      i32.sub
      local.get 2
      i32.ge_u
      br_if 0 (;@1;)
      local.get 0
      local.get 3
      local.get 2
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h0b55e0118e192e67E
      local.get 0
      i32.load offset=8
      local.set 3
    end
    local.get 0
    i32.load offset=4
    local.get 3
    i32.add
    local.get 1
    local.get 2
    call $memcpy
    drop
    local.get 0
    local.get 3
    local.get 2
    i32.add
    i32.store offset=8
    i32.const 0
  )
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$7reserve21do_reserve_and_handle17h0b55e0118e192e67E (;245;) (type 2) (param i32 i32 i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 1
        local.get 2
        i32.add
        local.tee 2
        local.get 1
        i32.lt_u
        br_if 0 (;@2;)
        local.get 0
        i32.load
        local.tee 1
        i32.const 1
        i32.shl
        local.tee 4
        local.get 2
        local.get 4
        local.get 2
        i32.gt_u
        select
        local.tee 2
        i32.const 8
        local.get 2
        i32.const 8
        i32.gt_u
        select
        local.tee 2
        i32.const -1
        i32.xor
        i32.const 31
        i32.shr_u
        local.set 4
        block ;; label = @3
          block ;; label = @4
            local.get 1
            i32.eqz
            br_if 0 (;@4;)
            local.get 3
            i32.const 1
            i32.store offset=24
            local.get 3
            local.get 1
            i32.store offset=20
            local.get 3
            local.get 0
            i32.const 4
            i32.add
            i32.load
            i32.store offset=16
            br 1 (;@3;)
          end
          local.get 3
          i32.const 0
          i32.store offset=24
        end
        local.get 3
        local.get 2
        local.get 4
        local.get 3
        i32.const 16
        i32.add
        call $_ZN5alloc7raw_vec11finish_grow17h7cf7fb6522e4581bE
        local.get 3
        i32.load offset=4
        local.set 1
        block ;; label = @3
          local.get 3
          i32.load
          br_if 0 (;@3;)
          local.get 0
          local.get 2
          i32.store
          local.get 0
          local.get 1
          i32.store offset=4
          br 2 (;@1;)
        end
        local.get 3
        i32.const 8
        i32.add
        i32.load
        local.tee 0
        i32.const -2147483647
        i32.eq
        br_if 1 (;@1;)
        local.get 0
        i32.eqz
        br_if 0 (;@2;)
        local.get 1
        local.get 0
        call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
        unreachable
      end
      call $_ZN5alloc7raw_vec17capacity_overflow17h38ac120e37f2568fE
      unreachable
    end
    local.get 3
    i32.const 32
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN5alloc7raw_vec11finish_grow17h7cf7fb6522e4581bE (;246;) (type 8) (param i32 i32 i32 i32)
    block ;; label = @1
      block ;; label = @2
        local.get 2
        i32.eqz
        br_if 0 (;@2;)
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  block ;; label = @8
                    local.get 1
                    i32.const 0
                    i32.lt_s
                    br_if 0 (;@8;)
                    local.get 3
                    i32.load offset=8
                    br_if 1 (;@7;)
                    local.get 1
                    br_if 2 (;@6;)
                    i32.const 1
                    local.set 2
                    br 4 (;@4;)
                  end
                  local.get 0
                  i32.const 8
                  i32.add
                  i32.const 0
                  i32.store
                  br 6 (;@1;)
                end
                block ;; label = @7
                  local.get 3
                  i32.load offset=4
                  local.tee 2
                  br_if 0 (;@7;)
                  block ;; label = @8
                    local.get 1
                    br_if 0 (;@8;)
                    i32.const 1
                    local.set 2
                    br 4 (;@4;)
                  end
                  local.get 1
                  i32.const 1
                  call $__rust_alloc
                  local.set 2
                  br 2 (;@5;)
                end
                local.get 3
                i32.load
                local.get 2
                i32.const 1
                local.get 1
                call $__rust_realloc
                local.set 2
                br 1 (;@5;)
              end
              local.get 1
              i32.const 1
              call $__rust_alloc
              local.set 2
            end
            local.get 2
            i32.eqz
            br_if 1 (;@3;)
          end
          local.get 0
          local.get 2
          i32.store offset=4
          local.get 0
          i32.const 8
          i32.add
          local.get 1
          i32.store
          local.get 0
          i32.const 0
          i32.store
          return
        end
        local.get 0
        local.get 1
        i32.store offset=4
        local.get 0
        i32.const 8
        i32.add
        i32.const 1
        i32.store
        local.get 0
        i32.const 1
        i32.store
        return
      end
      local.get 0
      local.get 1
      i32.store offset=4
      local.get 0
      i32.const 8
      i32.add
      i32.const 0
      i32.store
    end
    local.get 0
    i32.const 1
    i32.store
  )
  (func $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE (;247;) (type 3) (param i32 i32)
    local.get 0
    local.get 1
    call $_ZN5alloc5alloc18handle_alloc_error8rt_error17h606c627033d9706fE
    unreachable
  )
  (func $_ZN5alloc7raw_vec17capacity_overflow17h38ac120e37f2568fE (;248;) (type 7)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 0
    global.set $__stack_pointer
    local.get 0
    i32.const 20
    i32.add
    i32.const 1
    i32.store
    local.get 0
    i32.const 28
    i32.add
    i32.const 0
    i32.store
    local.get 0
    i32.const 1053204
    i32.store offset=16
    local.get 0
    i32.const 1053156
    i32.store offset=24
    local.get 0
    i32.const 0
    i32.store offset=8
    local.get 0
    i32.const 8
    i32.add
    i32.const 1053212
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$16reserve_for_push17h6b78444faa513e71E (;249;) (type 3) (param i32 i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.const 1
        i32.add
        local.tee 1
        i32.eqz
        br_if 0 (;@2;)
        local.get 0
        i32.load
        local.tee 3
        i32.const 1
        i32.shl
        local.tee 4
        local.get 1
        local.get 4
        local.get 1
        i32.gt_u
        select
        local.tee 1
        i32.const 8
        local.get 1
        i32.const 8
        i32.gt_u
        select
        local.tee 1
        i32.const -1
        i32.xor
        i32.const 31
        i32.shr_u
        local.set 4
        block ;; label = @3
          block ;; label = @4
            local.get 3
            i32.eqz
            br_if 0 (;@4;)
            local.get 2
            i32.const 1
            i32.store offset=24
            local.get 2
            local.get 3
            i32.store offset=20
            local.get 2
            local.get 0
            i32.const 4
            i32.add
            i32.load
            i32.store offset=16
            br 1 (;@3;)
          end
          local.get 2
          i32.const 0
          i32.store offset=24
        end
        local.get 2
        local.get 1
        local.get 4
        local.get 2
        i32.const 16
        i32.add
        call $_ZN5alloc7raw_vec11finish_grow17h7cf7fb6522e4581bE
        local.get 2
        i32.load offset=4
        local.set 3
        block ;; label = @3
          local.get 2
          i32.load
          br_if 0 (;@3;)
          local.get 0
          local.get 1
          i32.store
          local.get 0
          local.get 3
          i32.store offset=4
          br 2 (;@1;)
        end
        local.get 2
        i32.const 8
        i32.add
        i32.load
        local.tee 0
        i32.const -2147483647
        i32.eq
        br_if 1 (;@1;)
        local.get 0
        i32.eqz
        br_if 0 (;@2;)
        local.get 3
        local.get 0
        call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
        unreachable
      end
      call $_ZN5alloc7raw_vec17capacity_overflow17h38ac120e37f2568fE
      unreachable
    end
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN5alloc5alloc18handle_alloc_error8rt_error17h606c627033d9706fE (;250;) (type 3) (param i32 i32)
    local.get 0
    local.get 1
    call $__rust_alloc_error_handler
    unreachable
  )
  (func $_ZN72_$LT$$RF$str$u20$as$u20$alloc..ffi..c_str..CString..new..SpecNewImpl$GT$13spec_new_impl17h340d4b599af20849E (;251;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i64)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              local.get 2
              i32.const 1
              i32.add
              local.tee 4
              i32.eqz
              br_if 0 (;@5;)
              local.get 4
              i32.const -1
              i32.le_s
              br_if 1 (;@4;)
              local.get 4
              i32.const 1
              call $__rust_alloc
              local.tee 5
              i32.eqz
              br_if 2 (;@3;)
              local.get 3
              local.get 5
              i32.store offset=20
              local.get 3
              local.get 4
              i32.store offset=16
              local.get 5
              local.get 1
              local.get 2
              call $memcpy
              drop
              local.get 3
              local.get 2
              i32.store offset=24
              block ;; label = @6
                local.get 2
                i32.const 8
                i32.lt_u
                br_if 0 (;@6;)
                local.get 3
                i32.const 8
                i32.add
                i32.const 0
                local.get 1
                local.get 2
                call $_ZN4core5slice6memchr14memchr_aligned17h129bf890ef0ffda6E
                local.get 3
                i32.load offset=12
                local.set 5
                local.get 3
                i32.load offset=8
                local.set 4
                br 5 (;@1;)
              end
              block ;; label = @6
                local.get 2
                br_if 0 (;@6;)
                i32.const 0
                local.set 5
                i32.const 0
                local.set 4
                br 5 (;@1;)
              end
              block ;; label = @6
                local.get 1
                i32.load8_u
                br_if 0 (;@6;)
                i32.const 1
                local.set 4
                i32.const 0
                local.set 5
                br 5 (;@1;)
              end
              i32.const 1
              local.set 4
              local.get 2
              i32.const 1
              i32.eq
              br_if 3 (;@2;)
              block ;; label = @6
                local.get 1
                i32.load8_u offset=1
                br_if 0 (;@6;)
                i32.const 1
                local.set 5
                br 5 (;@1;)
              end
              i32.const 2
              local.set 5
              local.get 2
              i32.const 2
              i32.eq
              br_if 3 (;@2;)
              local.get 1
              i32.load8_u offset=2
              i32.eqz
              br_if 4 (;@1;)
              i32.const 3
              local.set 5
              local.get 2
              i32.const 3
              i32.eq
              br_if 3 (;@2;)
              local.get 1
              i32.load8_u offset=3
              i32.eqz
              br_if 4 (;@1;)
              i32.const 4
              local.set 5
              local.get 2
              i32.const 4
              i32.eq
              br_if 3 (;@2;)
              local.get 1
              i32.load8_u offset=4
              i32.eqz
              br_if 4 (;@1;)
              i32.const 5
              local.set 5
              local.get 2
              i32.const 5
              i32.eq
              br_if 3 (;@2;)
              local.get 1
              i32.load8_u offset=5
              i32.eqz
              br_if 4 (;@1;)
              local.get 2
              i32.const 6
              i32.eq
              br_if 3 (;@2;)
              local.get 2
              i32.const 6
              local.get 1
              i32.load8_u offset=6
              local.tee 4
              select
              local.set 5
              local.get 4
              i32.eqz
              local.set 4
              br 4 (;@1;)
            end
            i32.const 1053228
            i32.const 43
            i32.const 1053304
            call $_ZN4core9panicking5panic17h8fa39a92dcc1b069E
            unreachable
          end
          call $_ZN5alloc7raw_vec17capacity_overflow17h38ac120e37f2568fE
          unreachable
        end
        local.get 4
        i32.const 1
        call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
        unreachable
      end
      local.get 2
      local.set 5
      i32.const 0
      local.set 4
    end
    block ;; label = @1
      block ;; label = @2
        local.get 4
        br_if 0 (;@2;)
        local.get 3
        i32.const 32
        i32.add
        i32.const 8
        i32.add
        local.get 3
        i32.const 16
        i32.add
        i32.const 8
        i32.add
        i32.load
        i32.store
        local.get 3
        local.get 3
        i64.load offset=16
        i64.store offset=32
        local.get 3
        local.get 3
        i32.const 32
        i32.add
        call $_ZN5alloc3ffi5c_str7CString19_from_vec_unchecked17hac0da7602f10a2d1E
        local.get 3
        i64.load
        local.set 6
        local.get 0
        i32.const 0
        i32.store offset=8
        local.get 0
        local.get 6
        i64.store align=4
        br 1 (;@1;)
      end
      local.get 0
      local.get 3
      i64.load offset=16
      i64.store offset=4 align=4
      local.get 0
      local.get 5
      i32.store
      local.get 0
      i32.const 12
      i32.add
      local.get 3
      i32.const 24
      i32.add
      i32.load
      i32.store
    end
    local.get 3
    i32.const 48
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN5alloc3ffi5c_str7CString19_from_vec_unchecked17hac0da7602f10a2d1E (;252;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              local.get 1
              i32.load
              local.tee 3
              local.get 1
              i32.load offset=8
              local.tee 4
              i32.ne
              br_if 0 (;@5;)
              local.get 4
              i32.const 1
              i32.add
              local.tee 3
              i32.eqz
              br_if 2 (;@3;)
              local.get 3
              i32.const -1
              i32.xor
              i32.const 31
              i32.shr_u
              local.set 5
              block ;; label = @6
                block ;; label = @7
                  local.get 4
                  i32.eqz
                  br_if 0 (;@7;)
                  local.get 2
                  i32.const 1
                  i32.store offset=24
                  local.get 2
                  local.get 4
                  i32.store offset=20
                  local.get 2
                  local.get 1
                  i32.const 4
                  i32.add
                  i32.load
                  i32.store offset=16
                  br 1 (;@6;)
                end
                local.get 2
                i32.const 0
                i32.store offset=24
              end
              local.get 2
              local.get 3
              local.get 5
              local.get 2
              i32.const 16
              i32.add
              call $_ZN5alloc7raw_vec11finish_grow17h7cf7fb6522e4581bE
              local.get 2
              i32.load offset=4
              local.set 5
              local.get 2
              i32.load
              br_if 1 (;@4;)
              local.get 1
              local.get 3
              i32.store
              local.get 1
              local.get 5
              i32.store offset=4
            end
            local.get 4
            local.get 3
            i32.ne
            br_if 3 (;@1;)
            br 2 (;@2;)
          end
          local.get 2
          i32.const 8
          i32.add
          i32.load
          local.tee 3
          i32.const -2147483647
          i32.eq
          br_if 1 (;@2;)
          local.get 3
          i32.eqz
          br_if 0 (;@3;)
          local.get 5
          local.get 3
          call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
          unreachable
        end
        call $_ZN5alloc7raw_vec17capacity_overflow17h38ac120e37f2568fE
        unreachable
      end
      local.get 1
      local.get 4
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$16reserve_for_push17h6b78444faa513e71E
      local.get 1
      i32.load
      local.set 3
      local.get 1
      i32.load offset=8
      local.set 4
    end
    local.get 1
    local.get 4
    i32.const 1
    i32.add
    local.tee 5
    i32.store offset=8
    local.get 1
    i32.load offset=4
    local.tee 1
    local.get 4
    i32.add
    i32.const 0
    i32.store8
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          local.get 3
          local.get 5
          i32.gt_u
          br_if 0 (;@3;)
          local.get 1
          local.set 4
          br 1 (;@2;)
        end
        block ;; label = @3
          local.get 5
          br_if 0 (;@3;)
          i32.const 1
          local.set 4
          local.get 1
          local.get 3
          i32.const 1
          call $__rust_dealloc
          br 1 (;@2;)
        end
        local.get 1
        local.get 3
        i32.const 1
        local.get 5
        call $__rust_realloc
        local.tee 4
        i32.eqz
        br_if 1 (;@1;)
      end
      local.get 0
      local.get 5
      i32.store offset=4
      local.get 0
      local.get 4
      i32.store
      local.get 2
      i32.const 32
      i32.add
      global.set $__stack_pointer
      return
    end
    local.get 5
    i32.const 1
    call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
    unreachable
  )
  (func $_ZN5alloc3fmt6format12format_inner17h09cf2eb7625dc038E (;253;) (type 3) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                local.get 1
                i32.const 12
                i32.add
                i32.load
                local.tee 3
                i32.eqz
                br_if 0 (;@6;)
                local.get 1
                i32.load offset=8
                local.set 4
                local.get 3
                i32.const -1
                i32.add
                i32.const 536870911
                i32.and
                local.tee 3
                i32.const 1
                i32.add
                local.tee 5
                i32.const 7
                i32.and
                local.set 6
                block ;; label = @7
                  block ;; label = @8
                    local.get 3
                    i32.const 7
                    i32.ge_u
                    br_if 0 (;@8;)
                    i32.const 0
                    local.set 5
                    local.get 4
                    local.set 3
                    br 1 (;@7;)
                  end
                  local.get 4
                  i32.const 60
                  i32.add
                  local.set 3
                  local.get 5
                  i32.const 1073741816
                  i32.and
                  local.set 7
                  i32.const 0
                  local.set 5
                  loop ;; label = @8
                    local.get 3
                    i32.load
                    local.get 3
                    i32.const -8
                    i32.add
                    i32.load
                    local.get 3
                    i32.const -16
                    i32.add
                    i32.load
                    local.get 3
                    i32.const -24
                    i32.add
                    i32.load
                    local.get 3
                    i32.const -32
                    i32.add
                    i32.load
                    local.get 3
                    i32.const -40
                    i32.add
                    i32.load
                    local.get 3
                    i32.const -48
                    i32.add
                    i32.load
                    local.get 3
                    i32.const -56
                    i32.add
                    i32.load
                    local.get 5
                    i32.add
                    i32.add
                    i32.add
                    i32.add
                    i32.add
                    i32.add
                    i32.add
                    i32.add
                    local.set 5
                    local.get 3
                    i32.const 64
                    i32.add
                    local.set 3
                    local.get 7
                    i32.const -8
                    i32.add
                    local.tee 7
                    br_if 0 (;@8;)
                  end
                  local.get 3
                  i32.const -60
                  i32.add
                  local.set 3
                end
                block ;; label = @7
                  local.get 6
                  i32.eqz
                  br_if 0 (;@7;)
                  local.get 3
                  i32.const 4
                  i32.add
                  local.set 3
                  loop ;; label = @8
                    local.get 3
                    i32.load
                    local.get 5
                    i32.add
                    local.set 5
                    local.get 3
                    i32.const 8
                    i32.add
                    local.set 3
                    local.get 6
                    i32.const -1
                    i32.add
                    local.tee 6
                    br_if 0 (;@8;)
                  end
                end
                local.get 1
                i32.const 20
                i32.add
                i32.load
                br_if 1 (;@5;)
                local.get 5
                local.set 6
                br 3 (;@3;)
              end
              i32.const 0
              local.set 5
              local.get 1
              i32.const 20
              i32.add
              i32.load
              br_if 1 (;@4;)
              i32.const 1
              local.set 3
              br 4 (;@1;)
            end
            local.get 5
            i32.const 15
            i32.gt_u
            br_if 0 (;@4;)
            local.get 4
            i32.load offset=4
            i32.eqz
            br_if 2 (;@2;)
          end
          local.get 5
          local.get 5
          i32.add
          local.tee 6
          local.get 5
          i32.lt_u
          br_if 1 (;@2;)
        end
        local.get 6
        i32.eqz
        br_if 0 (;@2;)
        block ;; label = @3
          block ;; label = @4
            local.get 6
            i32.const -1
            i32.le_s
            br_if 0 (;@4;)
            local.get 6
            i32.const 1
            call $__rust_alloc
            local.tee 3
            i32.eqz
            br_if 1 (;@3;)
            local.get 6
            local.set 5
            br 3 (;@1;)
          end
          call $_ZN5alloc7raw_vec17capacity_overflow17h38ac120e37f2568fE
          unreachable
        end
        local.get 6
        i32.const 1
        call $_ZN5alloc5alloc18handle_alloc_error17h680df29e672ed57dE
        unreachable
      end
      i32.const 1
      local.set 3
      i32.const 0
      local.set 5
    end
    local.get 0
    i32.const 0
    i32.store offset=8
    local.get 0
    local.get 3
    i32.store offset=4
    local.get 0
    local.get 5
    i32.store
    local.get 2
    local.get 0
    i32.store offset=12
    local.get 2
    i32.const 16
    i32.add
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 16
    i32.add
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 1
    i64.load align=4
    i64.store offset=16
    block ;; label = @1
      local.get 2
      i32.const 12
      i32.add
      i32.const 1053116
      local.get 2
      i32.const 16
      i32.add
      call $_ZN4core3fmt5write17h7558535140974479E
      i32.eqz
      br_if 0 (;@1;)
      i32.const 1053320
      i32.const 51
      local.get 2
      i32.const 40
      i32.add
      i32.const 1053372
      i32.const 1053412
      call $_ZN4core6result13unwrap_failed17he6bfae7ea6f8795eE
      unreachable
    end
    local.get 2
    i32.const 48
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN5alloc4sync32arcinner_layout_for_value_layout17h57586c4dc56ab55aE (;254;) (type 2) (param i32 i32 i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    block ;; label = @1
      local.get 2
      i32.const 7
      i32.add
      i32.const 0
      local.get 2
      i32.sub
      i32.and
      local.tee 4
      local.get 4
      i32.const -8
      i32.add
      i32.lt_u
      br_if 0 (;@1;)
      local.get 4
      local.get 1
      i32.add
      local.tee 1
      local.get 4
      i32.lt_u
      br_if 0 (;@1;)
      i32.const -2147483648
      local.get 2
      i32.const 4
      local.get 2
      i32.const 4
      i32.gt_u
      select
      local.tee 2
      i32.sub
      local.get 1
      i32.lt_u
      br_if 0 (;@1;)
      local.get 0
      local.get 2
      i32.store offset=4
      local.get 0
      local.get 2
      local.get 1
      i32.add
      i32.const -1
      i32.add
      i32.const 0
      local.get 2
      i32.sub
      i32.and
      i32.store
      local.get 3
      i32.const 16
      i32.add
      global.set $__stack_pointer
      return
    end
    i32.const 1053428
    i32.const 43
    local.get 3
    i32.const 8
    i32.add
    i32.const 1053472
    i32.const 1053516
    call $_ZN4core6result13unwrap_failed17he6bfae7ea6f8795eE
    unreachable
  )
  (func $_ZN65_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..fmt..Debug$GT$3fmt17hb02f47fd02abae94E (;255;) (type 5) (param i32 i32) (result i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 0
    i32.const 8
    i32.add
    i32.load
    local.set 3
    local.get 0
    i32.const 4
    i32.add
    i32.load
    local.set 0
    local.get 2
    local.get 1
    call $_ZN4core3fmt9Formatter10debug_list17h7652738c8548c588E
    block ;; label = @1
      local.get 3
      i32.eqz
      br_if 0 (;@1;)
      loop ;; label = @2
        local.get 2
        local.get 0
        i32.store offset=12
        local.get 2
        local.get 2
        i32.const 12
        i32.add
        i32.const 1053140
        call $_ZN4core3fmt8builders8DebugSet5entry17hbf6eeee7f2aed797E
        drop
        local.get 0
        i32.const 1
        i32.add
        local.set 0
        local.get 3
        i32.const -1
        i32.add
        local.tee 3
        br_if 0 (;@2;)
      end
    end
    local.get 2
    call $_ZN4core3fmt8builders9DebugList6finish17hb67e8ba8401b18f3E
    local.set 0
    local.get 2
    i32.const 16
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN65_$LT$alloc..string..FromUtf8Error$u20$as$u20$core..fmt..Debug$GT$3fmt17h77ef681ab7fb9f89E (;256;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    local.get 0
    i32.store offset=12
    local.get 1
    i32.const 1053560
    i32.const 13
    i32.const 1053532
    i32.const 5
    local.get 0
    i32.const 8
    i32.add
    i32.const 1053576
    i32.const 1053537
    i32.const 5
    local.get 2
    i32.const 12
    i32.add
    i32.const 1053544
    call $_ZN4core3fmt9Formatter26debug_struct_field2_finish17h1a23e737736fcb8fE
    local.set 0
    local.get 2
    i32.const 16
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN4core3ops8function6FnOnce9call_once17h2709ecd011efc890E (;257;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i32.load
    drop
    loop (result i32) ;; label = @1
      br 0 (;@1;)
    end
  )
  (func $_ZN4core3ptr102drop_in_place$LT$$RF$core..iter..adapters..copied..Copied$LT$core..slice..iter..Iter$LT$u8$GT$$GT$$GT$17h4850089a660ee085E (;258;) (type $.rodata) (param i32))
  (func $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E (;259;) (type 3) (param i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    i32.const 1
    i32.store8 offset=24
    local.get 2
    local.get 1
    i32.store offset=20
    local.get 2
    local.get 0
    i32.store offset=16
    local.get 2
    i32.const 1053736
    i32.store offset=12
    local.get 2
    i32.const 1053592
    i32.store offset=8
    local.get 2
    i32.const 8
    i32.add
    call $rust_begin_unwind
    unreachable
  )
  (func $_ZN4core9panicking18panic_bounds_check17h11c3c861adfc2c89E (;260;) (type 2) (param i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 0
    i32.store
    local.get 3
    i32.const 8
    i32.add
    i32.const 12
    i32.add
    i32.const 2
    i32.store
    local.get 3
    i32.const 28
    i32.add
    i32.const 2
    i32.store
    local.get 3
    i32.const 32
    i32.add
    i32.const 12
    i32.add
    i32.const 7
    i32.store
    local.get 3
    i32.const 1053660
    i32.store offset=16
    local.get 3
    i32.const 0
    i32.store offset=8
    local.get 3
    i32.const 7
    i32.store offset=36
    local.get 3
    local.get 3
    i32.const 32
    i32.add
    i32.store offset=24
    local.get 3
    local.get 3
    i32.store offset=40
    local.get 3
    local.get 3
    i32.const 4
    i32.add
    i32.store offset=32
    local.get 3
    i32.const 8
    i32.add
    local.get 2
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE (;261;) (type 2) (param i32 i32 i32)
    local.get 0
    local.get 1
    local.get 2
    call $_ZN4core5slice5index29slice_start_index_len_fail_rt17h746adbf30693da97E
    unreachable
  )
  (func $_ZN4core5slice5index24slice_end_index_len_fail17h2ed49d5a2945907fE (;262;) (type 2) (param i32 i32 i32)
    local.get 0
    local.get 1
    local.get 2
    call $_ZN4core5slice5index27slice_end_index_len_fail_rt17h17bee9c953ba49cfE
    unreachable
  )
  (func $_ZN4core3fmt9Formatter3pad17hee1e19a8df95bdd9E (;263;) (type 4) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    local.get 0
    i32.load offset=16
    local.set 3
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          local.get 0
          i32.load offset=8
          local.tee 4
          i32.const 1
          i32.eq
          br_if 0 (;@3;)
          local.get 3
          i32.const 1
          i32.ne
          br_if 1 (;@2;)
        end
        block ;; label = @3
          local.get 3
          i32.const 1
          i32.ne
          br_if 0 (;@3;)
          local.get 1
          local.get 2
          i32.add
          local.set 5
          local.get 0
          i32.const 20
          i32.add
          i32.load
          i32.const 1
          i32.add
          local.set 6
          i32.const 0
          local.set 7
          local.get 1
          local.set 8
          block ;; label = @4
            loop ;; label = @5
              local.get 8
              local.set 3
              local.get 6
              i32.const -1
              i32.add
              local.tee 6
              i32.eqz
              br_if 1 (;@4;)
              local.get 3
              local.get 5
              i32.eq
              br_if 2 (;@3;)
              block ;; label = @6
                block ;; label = @7
                  local.get 3
                  i32.load8_s
                  local.tee 9
                  i32.const -1
                  i32.le_s
                  br_if 0 (;@7;)
                  local.get 3
                  i32.const 1
                  i32.add
                  local.set 8
                  local.get 9
                  i32.const 255
                  i32.and
                  local.set 9
                  br 1 (;@6;)
                end
                local.get 3
                i32.load8_u offset=1
                i32.const 63
                i32.and
                local.set 8
                local.get 9
                i32.const 31
                i32.and
                local.set 10
                block ;; label = @7
                  local.get 9
                  i32.const -33
                  i32.gt_u
                  br_if 0 (;@7;)
                  local.get 10
                  i32.const 6
                  i32.shl
                  local.get 8
                  i32.or
                  local.set 9
                  local.get 3
                  i32.const 2
                  i32.add
                  local.set 8
                  br 1 (;@6;)
                end
                local.get 8
                i32.const 6
                i32.shl
                local.get 3
                i32.load8_u offset=2
                i32.const 63
                i32.and
                i32.or
                local.set 8
                block ;; label = @7
                  local.get 9
                  i32.const -16
                  i32.ge_u
                  br_if 0 (;@7;)
                  local.get 8
                  local.get 10
                  i32.const 12
                  i32.shl
                  i32.or
                  local.set 9
                  local.get 3
                  i32.const 3
                  i32.add
                  local.set 8
                  br 1 (;@6;)
                end
                local.get 8
                i32.const 6
                i32.shl
                local.get 3
                i32.load8_u offset=3
                i32.const 63
                i32.and
                i32.or
                local.get 10
                i32.const 18
                i32.shl
                i32.const 1835008
                i32.and
                i32.or
                local.tee 9
                i32.const 1114112
                i32.eq
                br_if 3 (;@3;)
                local.get 3
                i32.const 4
                i32.add
                local.set 8
              end
              local.get 7
              local.get 3
              i32.sub
              local.get 8
              i32.add
              local.set 7
              local.get 9
              i32.const 1114112
              i32.ne
              br_if 0 (;@5;)
              br 2 (;@3;)
            end
          end
          local.get 3
          local.get 5
          i32.eq
          br_if 0 (;@3;)
          block ;; label = @4
            local.get 3
            i32.load8_s
            local.tee 8
            i32.const -1
            i32.gt_s
            br_if 0 (;@4;)
            local.get 8
            i32.const -32
            i32.lt_u
            br_if 0 (;@4;)
            local.get 8
            i32.const -16
            i32.lt_u
            br_if 0 (;@4;)
            local.get 3
            i32.load8_u offset=2
            i32.const 63
            i32.and
            i32.const 6
            i32.shl
            local.get 3
            i32.load8_u offset=1
            i32.const 63
            i32.and
            i32.const 12
            i32.shl
            i32.or
            local.get 3
            i32.load8_u offset=3
            i32.const 63
            i32.and
            i32.or
            local.get 8
            i32.const 255
            i32.and
            i32.const 18
            i32.shl
            i32.const 1835008
            i32.and
            i32.or
            i32.const 1114112
            i32.eq
            br_if 1 (;@3;)
          end
          block ;; label = @4
            block ;; label = @5
              local.get 7
              i32.eqz
              br_if 0 (;@5;)
              block ;; label = @6
                local.get 7
                local.get 2
                i32.lt_u
                br_if 0 (;@6;)
                i32.const 0
                local.set 3
                local.get 7
                local.get 2
                i32.eq
                br_if 1 (;@5;)
                br 2 (;@4;)
              end
              i32.const 0
              local.set 3
              local.get 1
              local.get 7
              i32.add
              i32.load8_s
              i32.const -64
              i32.lt_s
              br_if 1 (;@4;)
            end
            local.get 1
            local.set 3
          end
          local.get 7
          local.get 2
          local.get 3
          select
          local.set 2
          local.get 3
          local.get 1
          local.get 3
          select
          local.set 1
        end
        block ;; label = @3
          local.get 4
          br_if 0 (;@3;)
          local.get 0
          i32.load
          local.get 1
          local.get 2
          local.get 0
          i32.load offset=4
          i32.load offset=12
          call_indirect (type 4)
          return
        end
        local.get 0
        i32.const 12
        i32.add
        i32.load
        local.set 7
        block ;; label = @3
          block ;; label = @4
            local.get 2
            i32.const 16
            i32.lt_u
            br_if 0 (;@4;)
            local.get 1
            local.get 2
            call $_ZN4core3str5count14do_count_chars17h9555fdd2933f4e49E
            local.set 8
            br 1 (;@3;)
          end
          block ;; label = @4
            local.get 2
            br_if 0 (;@4;)
            i32.const 0
            local.set 8
            br 1 (;@3;)
          end
          local.get 2
          i32.const 3
          i32.and
          local.set 9
          block ;; label = @4
            block ;; label = @5
              local.get 2
              i32.const -1
              i32.add
              i32.const 3
              i32.ge_u
              br_if 0 (;@5;)
              i32.const 0
              local.set 8
              local.get 1
              local.set 3
              br 1 (;@4;)
            end
            local.get 2
            i32.const -4
            i32.and
            local.set 6
            i32.const 0
            local.set 8
            local.get 1
            local.set 3
            loop ;; label = @5
              local.get 8
              local.get 3
              i32.load8_s
              i32.const -65
              i32.gt_s
              i32.add
              local.get 3
              i32.load8_s offset=1
              i32.const -65
              i32.gt_s
              i32.add
              local.get 3
              i32.load8_s offset=2
              i32.const -65
              i32.gt_s
              i32.add
              local.get 3
              i32.load8_s offset=3
              i32.const -65
              i32.gt_s
              i32.add
              local.set 8
              local.get 3
              i32.const 4
              i32.add
              local.set 3
              local.get 6
              i32.const -4
              i32.add
              local.tee 6
              br_if 0 (;@5;)
            end
          end
          local.get 9
          i32.eqz
          br_if 0 (;@3;)
          loop ;; label = @4
            local.get 8
            local.get 3
            i32.load8_s
            i32.const -65
            i32.gt_s
            i32.add
            local.set 8
            local.get 3
            i32.const 1
            i32.add
            local.set 3
            local.get 9
            i32.const -1
            i32.add
            local.tee 9
            br_if 0 (;@4;)
          end
        end
        block ;; label = @3
          local.get 7
          local.get 8
          i32.le_u
          br_if 0 (;@3;)
          local.get 7
          local.get 8
          i32.sub
          local.tee 8
          local.set 6
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                i32.const 0
                local.get 0
                i32.load8_u offset=32
                local.tee 3
                local.get 3
                i32.const 3
                i32.eq
                select
                i32.const 3
                i32.and
                local.tee 3
                br_table 2 (;@4;) 0 (;@6;) 1 (;@5;) 2 (;@4;)
              end
              i32.const 0
              local.set 6
              local.get 8
              local.set 3
              br 1 (;@4;)
            end
            local.get 8
            i32.const 1
            i32.shr_u
            local.set 3
            local.get 8
            i32.const 1
            i32.add
            i32.const 1
            i32.shr_u
            local.set 6
          end
          local.get 3
          i32.const 1
          i32.add
          local.set 3
          local.get 0
          i32.const 4
          i32.add
          i32.load
          local.set 9
          local.get 0
          i32.load offset=28
          local.set 8
          local.get 0
          i32.load
          local.set 0
          block ;; label = @4
            loop ;; label = @5
              local.get 3
              i32.const -1
              i32.add
              local.tee 3
              i32.eqz
              br_if 1 (;@4;)
              local.get 0
              local.get 8
              local.get 9
              i32.load offset=16
              call_indirect (type 5)
              i32.eqz
              br_if 0 (;@5;)
            end
            i32.const 1
            return
          end
          i32.const 1
          local.set 3
          local.get 8
          i32.const 1114112
          i32.eq
          br_if 2 (;@1;)
          local.get 0
          local.get 1
          local.get 2
          local.get 9
          i32.load offset=12
          call_indirect (type 4)
          br_if 2 (;@1;)
          i32.const 0
          local.set 3
          loop ;; label = @4
            block ;; label = @5
              local.get 6
              local.get 3
              i32.ne
              br_if 0 (;@5;)
              local.get 6
              local.get 6
              i32.lt_u
              return
            end
            local.get 3
            i32.const 1
            i32.add
            local.set 3
            local.get 0
            local.get 8
            local.get 9
            i32.load offset=16
            call_indirect (type 5)
            i32.eqz
            br_if 0 (;@4;)
          end
          local.get 3
          i32.const -1
          i32.add
          local.get 6
          i32.lt_u
          return
        end
        local.get 0
        i32.load
        local.get 1
        local.get 2
        local.get 0
        i32.load offset=4
        i32.load offset=12
        call_indirect (type 4)
        return
      end
      local.get 0
      i32.load
      local.get 1
      local.get 2
      local.get 0
      i32.load offset=4
      i32.load offset=12
      call_indirect (type 4)
      local.set 3
    end
    local.get 3
  )
  (func $_ZN4core9panicking5panic17h8fa39a92dcc1b069E (;264;) (type 2) (param i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    local.get 3
    i32.const 12
    i32.add
    i32.const 1
    i32.store
    local.get 3
    i32.const 20
    i32.add
    i32.const 0
    i32.store
    local.get 3
    i32.const 1053592
    i32.store offset=16
    local.get 3
    i32.const 0
    i32.store
    local.get 3
    local.get 1
    i32.store offset=28
    local.get 3
    local.get 0
    i32.store offset=24
    local.get 3
    local.get 3
    i32.const 24
    i32.add
    i32.store offset=8
    local.get 3
    local.get 2
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN4core5slice5index22slice_index_order_fail17h23aab599a56da6feE (;265;) (type 2) (param i32 i32 i32)
    local.get 0
    local.get 1
    local.get 2
    call $_ZN4core5slice5index25slice_index_order_fail_rt17hf9b218a3e9a3735eE
    unreachable
  )
  (func $_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$u32$GT$3fmt17hca64045c3402134cE (;266;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i64.load32_u
    i32.const 1
    local.get 1
    call $_ZN4core3fmt3num3imp7fmt_u6417hf4eec24457ffc084E
  )
  (func $_ZN4core3fmt3num50_$LT$impl$u20$core..fmt..Debug$u20$for$u20$u32$GT$3fmt17hd969844fd9888156E (;267;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 128
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              local.get 1
              i32.load offset=24
              local.tee 3
              i32.const 16
              i32.and
              br_if 0 (;@5;)
              local.get 3
              i32.const 32
              i32.and
              br_if 1 (;@4;)
              local.get 0
              i64.load32_u
              i32.const 1
              local.get 1
              call $_ZN4core3fmt3num3imp7fmt_u6417hf4eec24457ffc084E
              local.set 0
              br 4 (;@1;)
            end
            local.get 0
            i32.load
            local.set 0
            i32.const 0
            local.set 3
            loop ;; label = @5
              local.get 2
              local.get 3
              i32.add
              i32.const 127
              i32.add
              i32.const 48
              i32.const 87
              local.get 0
              i32.const 15
              i32.and
              local.tee 4
              i32.const 10
              i32.lt_u
              select
              local.get 4
              i32.add
              i32.store8
              local.get 3
              i32.const -1
              i32.add
              local.set 3
              local.get 0
              i32.const 15
              i32.gt_u
              local.set 4
              local.get 0
              i32.const 4
              i32.shr_u
              local.set 0
              local.get 4
              br_if 0 (;@5;)
            end
            local.get 3
            i32.const 128
            i32.add
            local.tee 0
            i32.const 129
            i32.ge_u
            br_if 1 (;@3;)
            local.get 1
            i32.const 1
            i32.const 1054020
            i32.const 2
            local.get 2
            local.get 3
            i32.add
            i32.const 128
            i32.add
            i32.const 0
            local.get 3
            i32.sub
            call $_ZN4core3fmt9Formatter12pad_integral17hcc3b56246532f1b4E
            local.set 0
            br 3 (;@1;)
          end
          local.get 0
          i32.load
          local.set 0
          i32.const 0
          local.set 3
          loop ;; label = @4
            local.get 2
            local.get 3
            i32.add
            i32.const 127
            i32.add
            i32.const 48
            i32.const 55
            local.get 0
            i32.const 15
            i32.and
            local.tee 4
            i32.const 10
            i32.lt_u
            select
            local.get 4
            i32.add
            i32.store8
            local.get 3
            i32.const -1
            i32.add
            local.set 3
            local.get 0
            i32.const 15
            i32.gt_u
            local.set 4
            local.get 0
            i32.const 4
            i32.shr_u
            local.set 0
            local.get 4
            br_if 0 (;@4;)
          end
          local.get 3
          i32.const 128
          i32.add
          local.tee 0
          i32.const 129
          i32.ge_u
          br_if 1 (;@2;)
          local.get 1
          i32.const 1
          i32.const 1054020
          i32.const 2
          local.get 2
          local.get 3
          i32.add
          i32.const 128
          i32.add
          i32.const 0
          local.get 3
          i32.sub
          call $_ZN4core3fmt9Formatter12pad_integral17hcc3b56246532f1b4E
          local.set 0
          br 2 (;@1;)
        end
        local.get 0
        i32.const 128
        i32.const 1054004
        call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
        unreachable
      end
      local.get 0
      i32.const 128
      i32.const 1054004
      call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
      unreachable
    end
    local.get 2
    i32.const 128
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN4core3fmt5write17h7558535140974479E (;268;) (type 4) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    local.get 3
    i32.const 3
    i32.store8 offset=40
    local.get 3
    i64.const 137438953472
    i64.store offset=32
    i32.const 0
    local.set 4
    local.get 3
    i32.const 0
    i32.store offset=24
    local.get 3
    i32.const 0
    i32.store offset=16
    local.get 3
    local.get 1
    i32.store offset=12
    local.get 3
    local.get 0
    i32.store offset=8
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 2
            i32.load
            local.tee 5
            br_if 0 (;@4;)
            local.get 2
            i32.const 20
            i32.add
            i32.load
            local.tee 0
            i32.eqz
            br_if 1 (;@3;)
            local.get 2
            i32.load offset=16
            local.set 1
            local.get 0
            i32.const 3
            i32.shl
            local.set 6
            local.get 0
            i32.const -1
            i32.add
            i32.const 536870911
            i32.and
            i32.const 1
            i32.add
            local.set 4
            local.get 2
            i32.load offset=8
            local.set 0
            loop ;; label = @5
              block ;; label = @6
                local.get 0
                i32.const 4
                i32.add
                i32.load
                local.tee 7
                i32.eqz
                br_if 0 (;@6;)
                local.get 3
                i32.load offset=8
                local.get 0
                i32.load
                local.get 7
                local.get 3
                i32.load offset=12
                i32.load offset=12
                call_indirect (type 4)
                br_if 4 (;@2;)
              end
              local.get 1
              i32.load
              local.get 3
              i32.const 8
              i32.add
              local.get 1
              i32.const 4
              i32.add
              i32.load
              call_indirect (type 5)
              br_if 3 (;@2;)
              local.get 1
              i32.const 8
              i32.add
              local.set 1
              local.get 0
              i32.const 8
              i32.add
              local.set 0
              local.get 6
              i32.const -8
              i32.add
              local.tee 6
              br_if 0 (;@5;)
              br 2 (;@3;)
            end
          end
          local.get 2
          i32.load offset=4
          local.tee 1
          i32.eqz
          br_if 0 (;@3;)
          local.get 1
          i32.const 5
          i32.shl
          local.set 8
          local.get 1
          i32.const -1
          i32.add
          i32.const 134217727
          i32.and
          i32.const 1
          i32.add
          local.set 4
          local.get 2
          i32.load offset=8
          local.set 0
          i32.const 0
          local.set 6
          loop ;; label = @4
            block ;; label = @5
              local.get 0
              i32.const 4
              i32.add
              i32.load
              local.tee 1
              i32.eqz
              br_if 0 (;@5;)
              local.get 3
              i32.load offset=8
              local.get 0
              i32.load
              local.get 1
              local.get 3
              i32.load offset=12
              i32.load offset=12
              call_indirect (type 4)
              br_if 3 (;@2;)
            end
            local.get 3
            local.get 5
            local.get 6
            i32.add
            local.tee 1
            i32.const 28
            i32.add
            i32.load8_u
            i32.store8 offset=40
            local.get 3
            local.get 1
            i32.const 20
            i32.add
            i64.load align=4
            i64.store offset=32
            local.get 1
            i32.const 16
            i32.add
            i32.load
            local.set 9
            local.get 2
            i32.load offset=16
            local.set 10
            i32.const 0
            local.set 11
            i32.const 0
            local.set 7
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  local.get 1
                  i32.const 12
                  i32.add
                  i32.load
                  br_table 1 (;@6;) 0 (;@7;) 2 (;@5;) 1 (;@6;)
                end
                local.get 9
                i32.const 3
                i32.shl
                local.set 12
                i32.const 0
                local.set 7
                local.get 10
                local.get 12
                i32.add
                local.tee 12
                i32.const 4
                i32.add
                i32.load
                i32.const 68
                i32.ne
                br_if 1 (;@5;)
                local.get 12
                i32.load
                i32.load
                local.set 9
              end
              i32.const 1
              local.set 7
            end
            local.get 3
            local.get 9
            i32.store offset=20
            local.get 3
            local.get 7
            i32.store offset=16
            local.get 1
            i32.const 8
            i32.add
            i32.load
            local.set 7
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  local.get 1
                  i32.const 4
                  i32.add
                  i32.load
                  br_table 1 (;@6;) 0 (;@7;) 2 (;@5;) 1 (;@6;)
                end
                local.get 7
                i32.const 3
                i32.shl
                local.set 9
                local.get 10
                local.get 9
                i32.add
                local.tee 9
                i32.const 4
                i32.add
                i32.load
                i32.const 68
                i32.ne
                br_if 1 (;@5;)
                local.get 9
                i32.load
                i32.load
                local.set 7
              end
              i32.const 1
              local.set 11
            end
            local.get 3
            local.get 7
            i32.store offset=28
            local.get 3
            local.get 11
            i32.store offset=24
            local.get 10
            local.get 1
            i32.load
            i32.const 3
            i32.shl
            i32.add
            local.tee 1
            i32.load
            local.get 3
            i32.const 8
            i32.add
            local.get 1
            i32.load offset=4
            call_indirect (type 5)
            br_if 2 (;@2;)
            local.get 0
            i32.const 8
            i32.add
            local.set 0
            local.get 8
            local.get 6
            i32.const 32
            i32.add
            local.tee 6
            i32.ne
            br_if 0 (;@4;)
          end
        end
        block ;; label = @3
          local.get 4
          local.get 2
          i32.const 12
          i32.add
          i32.load
          i32.ge_u
          br_if 0 (;@3;)
          local.get 3
          i32.load offset=8
          local.get 2
          i32.load offset=8
          local.get 4
          i32.const 3
          i32.shl
          i32.add
          local.tee 1
          i32.load
          local.get 1
          i32.load offset=4
          local.get 3
          i32.load offset=12
          i32.load offset=12
          call_indirect (type 4)
          br_if 1 (;@2;)
        end
        i32.const 0
        local.set 1
        br 1 (;@1;)
      end
      i32.const 1
      local.set 1
    end
    local.get 3
    i32.const 48
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17hb25fc4480d8905d3E (;269;) (type $.data) (param i32) (result i64)
    i64.const -816388632080319500
  )
  (func $_ZN63_$LT$core..cell..BorrowMutError$u20$as$u20$core..fmt..Debug$GT$3fmt17h145bcc23e1a12888E (;270;) (type 5) (param i32 i32) (result i32)
    local.get 1
    i32.load
    i32.const 1053593
    i32.const 14
    local.get 1
    i32.load offset=4
    i32.load offset=12
    call_indirect (type 4)
  )
  (func $_ZN4core3ffi5c_str4CStr8from_ptr9strlen_rt17h0159b444b16e3465E (;271;) (type 9) (param i32) (result i32)
    local.get 0
    call $strlen
  )
  (func $_ZN4core5slice6memchr14memchr_aligned17h129bf890ef0ffda6E (;272;) (type 8) (param i32 i32 i32 i32)
    (local i32 i32 i32 i32 i32)
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                local.get 2
                i32.const 3
                i32.add
                i32.const -4
                i32.and
                local.tee 4
                local.get 2
                i32.eq
                br_if 0 (;@6;)
                local.get 4
                local.get 2
                i32.sub
                local.tee 4
                local.get 3
                local.get 4
                local.get 3
                i32.lt_u
                select
                local.tee 4
                i32.eqz
                br_if 0 (;@6;)
                i32.const 0
                local.set 5
                local.get 1
                i32.const 255
                i32.and
                local.set 6
                i32.const 1
                local.set 7
                loop ;; label = @7
                  local.get 2
                  local.get 5
                  i32.add
                  i32.load8_u
                  local.get 6
                  i32.eq
                  br_if 6 (;@1;)
                  local.get 4
                  local.get 5
                  i32.const 1
                  i32.add
                  local.tee 5
                  i32.ne
                  br_if 0 (;@7;)
                end
                local.get 4
                local.get 3
                i32.const -8
                i32.add
                local.tee 8
                i32.gt_u
                br_if 2 (;@4;)
                br 1 (;@5;)
              end
              local.get 3
              i32.const -8
              i32.add
              local.set 8
              i32.const 0
              local.set 4
            end
            local.get 1
            i32.const 255
            i32.and
            i32.const 16843009
            i32.mul
            local.set 5
            block ;; label = @5
              loop ;; label = @6
                local.get 2
                local.get 4
                i32.add
                local.tee 7
                i32.load
                local.get 5
                i32.xor
                local.tee 6
                i32.const -1
                i32.xor
                local.get 6
                i32.const -16843009
                i32.add
                i32.and
                i32.const -2139062144
                i32.and
                br_if 1 (;@5;)
                local.get 7
                i32.const 4
                i32.add
                i32.load
                local.get 5
                i32.xor
                local.tee 6
                i32.const -1
                i32.xor
                local.get 6
                i32.const -16843009
                i32.add
                i32.and
                i32.const -2139062144
                i32.and
                br_if 1 (;@5;)
                local.get 4
                i32.const 8
                i32.add
                local.tee 4
                local.get 8
                i32.le_u
                br_if 0 (;@6;)
              end
            end
            local.get 4
            local.get 3
            i32.gt_u
            br_if 1 (;@3;)
          end
          i32.const 0
          local.set 7
          local.get 4
          local.get 3
          i32.eq
          br_if 1 (;@2;)
          local.get 1
          i32.const 255
          i32.and
          local.set 5
          loop ;; label = @4
            block ;; label = @5
              local.get 2
              local.get 4
              i32.add
              i32.load8_u
              local.get 5
              i32.ne
              br_if 0 (;@5;)
              local.get 4
              local.set 5
              i32.const 1
              local.set 7
              br 4 (;@1;)
            end
            local.get 3
            local.get 4
            i32.const 1
            i32.add
            local.tee 4
            i32.eq
            br_if 2 (;@2;)
            br 0 (;@4;)
          end
        end
        local.get 4
        local.get 3
        i32.const 1054292
        call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
        unreachable
      end
      local.get 3
      local.set 5
    end
    local.get 0
    local.get 5
    i32.store offset=4
    local.get 0
    local.get 7
    i32.store
  )
  (func $_ZN4core3ffi5c_str4CStr19from_bytes_with_nul17h3bcfbfec0c9c291cE (;273;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 2
        i32.const 8
        i32.lt_u
        br_if 0 (;@2;)
        local.get 3
        i32.const 8
        i32.add
        i32.const 0
        local.get 1
        local.get 2
        call $_ZN4core5slice6memchr14memchr_aligned17h129bf890ef0ffda6E
        local.get 3
        i32.load offset=12
        local.set 4
        local.get 3
        i32.load offset=8
        local.set 5
        br 1 (;@1;)
      end
      block ;; label = @2
        local.get 2
        br_if 0 (;@2;)
        i32.const 0
        local.set 4
        i32.const 0
        local.set 5
        br 1 (;@1;)
      end
      block ;; label = @2
        local.get 1
        i32.load8_u
        br_if 0 (;@2;)
        i32.const 1
        local.set 5
        i32.const 0
        local.set 4
        br 1 (;@1;)
      end
      i32.const 1
      local.set 5
      block ;; label = @2
        local.get 2
        i32.const 1
        i32.eq
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 1
          i32.load8_u offset=1
          br_if 0 (;@3;)
          i32.const 1
          local.set 4
          br 2 (;@1;)
        end
        i32.const 2
        local.set 4
        local.get 2
        i32.const 2
        i32.eq
        br_if 0 (;@2;)
        local.get 1
        i32.load8_u offset=2
        i32.eqz
        br_if 1 (;@1;)
        i32.const 3
        local.set 4
        local.get 2
        i32.const 3
        i32.eq
        br_if 0 (;@2;)
        local.get 1
        i32.load8_u offset=3
        i32.eqz
        br_if 1 (;@1;)
        i32.const 4
        local.set 4
        local.get 2
        i32.const 4
        i32.eq
        br_if 0 (;@2;)
        local.get 1
        i32.load8_u offset=4
        i32.eqz
        br_if 1 (;@1;)
        i32.const 5
        local.set 4
        local.get 2
        i32.const 5
        i32.eq
        br_if 0 (;@2;)
        local.get 1
        i32.load8_u offset=5
        i32.eqz
        br_if 1 (;@1;)
        local.get 2
        local.set 4
        i32.const 0
        local.set 5
        local.get 2
        i32.const 6
        i32.eq
        br_if 1 (;@1;)
        local.get 2
        i32.const 6
        local.get 1
        i32.load8_u offset=6
        local.tee 5
        select
        local.set 4
        local.get 5
        i32.eqz
        local.set 5
        br 1 (;@1;)
      end
      local.get 2
      local.set 4
      i32.const 0
      local.set 5
    end
    block ;; label = @1
      block ;; label = @2
        local.get 5
        br_if 0 (;@2;)
        i32.const 1
        local.set 5
        local.get 0
        i32.const 1
        i32.store offset=4
        br 1 (;@1;)
      end
      i32.const 1
      local.set 5
      block ;; label = @2
        local.get 4
        i32.const 1
        i32.add
        local.get 2
        i32.eq
        br_if 0 (;@2;)
        local.get 0
        i32.const 0
        i32.store offset=4
        local.get 0
        i32.const 8
        i32.add
        local.get 4
        i32.store
        br 1 (;@1;)
      end
      local.get 0
      local.get 1
      i32.store offset=4
      local.get 0
      i32.const 8
      i32.add
      local.get 2
      i32.store
      i32.const 0
      local.set 5
    end
    local.get 0
    local.get 5
    i32.store
    local.get 3
    i32.const 16
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN4core3str8converts9from_utf817h4708668127040a35E (;274;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32)
    block ;; label = @1
      local.get 2
      i32.eqz
      br_if 0 (;@1;)
      i32.const 0
      local.get 2
      i32.const -7
      i32.add
      local.tee 3
      local.get 3
      local.get 2
      i32.gt_u
      select
      local.set 4
      local.get 1
      i32.const 3
      i32.add
      i32.const -4
      i32.and
      local.get 1
      i32.sub
      local.tee 5
      i32.const -1
      i32.eq
      local.set 6
      i32.const 0
      local.set 3
      loop ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                block ;; label = @7
                  block ;; label = @8
                    block ;; label = @9
                      block ;; label = @10
                        block ;; label = @11
                          block ;; label = @12
                            local.get 1
                            local.get 3
                            i32.add
                            i32.load8_u
                            local.tee 7
                            i32.const 24
                            i32.shl
                            i32.const 24
                            i32.shr_s
                            local.tee 8
                            i32.const 0
                            i32.lt_s
                            br_if 0 (;@12;)
                            local.get 6
                            br_if 1 (;@11;)
                            local.get 5
                            local.get 3
                            i32.sub
                            i32.const 3
                            i32.and
                            br_if 1 (;@11;)
                            local.get 3
                            local.get 4
                            i32.lt_u
                            br_if 2 (;@10;)
                            br 8 (;@4;)
                          end
                          i32.const 1
                          local.set 9
                          i32.const 1
                          local.set 10
                          block ;; label = @12
                            block ;; label = @13
                              block ;; label = @14
                                block ;; label = @15
                                  block ;; label = @16
                                    block ;; label = @17
                                      block ;; label = @18
                                        block ;; label = @19
                                          local.get 7
                                          i32.const 1054460
                                          i32.add
                                          i32.load8_u
                                          i32.const -2
                                          i32.add
                                          br_table 0 (;@19;) 1 (;@18;) 2 (;@17;) 14 (;@5;)
                                        end
                                        local.get 3
                                        i32.const 1
                                        i32.add
                                        local.tee 7
                                        local.get 2
                                        i32.lt_u
                                        br_if 6 (;@12;)
                                        i32.const 0
                                        local.set 10
                                        br 13 (;@5;)
                                      end
                                      i32.const 1
                                      local.set 9
                                      i32.const 0
                                      local.set 10
                                      local.get 3
                                      i32.const 1
                                      i32.add
                                      local.tee 11
                                      local.get 2
                                      i32.ge_u
                                      br_if 12 (;@5;)
                                      local.get 1
                                      local.get 11
                                      i32.add
                                      i32.load8_s
                                      local.set 11
                                      local.get 7
                                      i32.const -224
                                      i32.add
                                      br_table 1 (;@16;) 3 (;@14;) 3 (;@14;) 3 (;@14;) 3 (;@14;) 3 (;@14;) 3 (;@14;) 3 (;@14;) 3 (;@14;) 3 (;@14;) 3 (;@14;) 3 (;@14;) 3 (;@14;) 2 (;@15;) 3 (;@14;)
                                    end
                                    i32.const 1
                                    local.set 9
                                    block ;; label = @17
                                      local.get 3
                                      i32.const 1
                                      i32.add
                                      local.tee 10
                                      local.get 2
                                      i32.lt_u
                                      br_if 0 (;@17;)
                                      i32.const 0
                                      local.set 10
                                      br 12 (;@5;)
                                    end
                                    local.get 1
                                    local.get 10
                                    i32.add
                                    i32.load8_s
                                    local.set 11
                                    block ;; label = @17
                                      block ;; label = @18
                                        block ;; label = @19
                                          local.get 7
                                          i32.const -240
                                          i32.add
                                          br_table 1 (;@18;) 0 (;@19;) 0 (;@19;) 0 (;@19;) 2 (;@17;) 0 (;@19;)
                                        end
                                        i32.const 1
                                        local.set 9
                                        local.get 8
                                        i32.const 15
                                        i32.add
                                        i32.const 255
                                        i32.and
                                        i32.const 2
                                        i32.le_u
                                        br_if 9 (;@9;)
                                        i32.const 1
                                        local.set 10
                                        br 13 (;@5;)
                                      end
                                      local.get 11
                                      i32.const 112
                                      i32.add
                                      i32.const 255
                                      i32.and
                                      i32.const 48
                                      i32.lt_u
                                      br_if 9 (;@8;)
                                      br 11 (;@6;)
                                    end
                                    local.get 11
                                    i32.const -113
                                    i32.gt_s
                                    br_if 10 (;@6;)
                                    br 8 (;@8;)
                                  end
                                  local.get 11
                                  i32.const -32
                                  i32.and
                                  i32.const -96
                                  i32.ne
                                  br_if 9 (;@6;)
                                  br 2 (;@13;)
                                end
                                local.get 11
                                i32.const -96
                                i32.ge_s
                                br_if 8 (;@6;)
                                br 1 (;@13;)
                              end
                              block ;; label = @14
                                block ;; label = @15
                                  local.get 8
                                  i32.const 31
                                  i32.add
                                  i32.const 255
                                  i32.and
                                  i32.const 12
                                  i32.lt_u
                                  br_if 0 (;@15;)
                                  i32.const 1
                                  local.set 9
                                  local.get 8
                                  i32.const -2
                                  i32.and
                                  i32.const -18
                                  i32.eq
                                  br_if 1 (;@14;)
                                  i32.const 1
                                  local.set 10
                                  br 10 (;@5;)
                                end
                                local.get 11
                                i32.const -65
                                i32.gt_s
                                br_if 8 (;@6;)
                                br 1 (;@13;)
                              end
                              i32.const 1
                              local.set 10
                              local.get 11
                              i32.const -64
                              i32.ge_s
                              br_if 8 (;@5;)
                            end
                            i32.const 0
                            local.set 10
                            local.get 3
                            i32.const 2
                            i32.add
                            local.tee 7
                            local.get 2
                            i32.ge_u
                            br_if 7 (;@5;)
                            local.get 1
                            local.get 7
                            i32.add
                            i32.load8_s
                            i32.const -65
                            i32.le_s
                            br_if 5 (;@7;)
                            i32.const 1
                            local.set 10
                            i32.const 2
                            local.set 9
                            br 7 (;@5;)
                          end
                          local.get 1
                          local.get 7
                          i32.add
                          i32.load8_s
                          i32.const -65
                          i32.gt_s
                          br_if 5 (;@6;)
                          br 4 (;@7;)
                        end
                        local.get 3
                        i32.const 1
                        i32.add
                        local.set 3
                        br 7 (;@3;)
                      end
                      loop ;; label = @10
                        local.get 1
                        local.get 3
                        i32.add
                        local.tee 7
                        i32.load
                        i32.const -2139062144
                        i32.and
                        br_if 6 (;@4;)
                        local.get 7
                        i32.const 4
                        i32.add
                        i32.load
                        i32.const -2139062144
                        i32.and
                        br_if 6 (;@4;)
                        local.get 3
                        i32.const 8
                        i32.add
                        local.tee 3
                        local.get 4
                        i32.ge_u
                        br_if 6 (;@4;)
                        br 0 (;@10;)
                      end
                    end
                    i32.const 1
                    local.set 10
                    local.get 11
                    i32.const -64
                    i32.ge_s
                    br_if 3 (;@5;)
                  end
                  block ;; label = @8
                    local.get 3
                    i32.const 2
                    i32.add
                    local.tee 7
                    local.get 2
                    i32.lt_u
                    br_if 0 (;@8;)
                    i32.const 0
                    local.set 10
                    br 3 (;@5;)
                  end
                  block ;; label = @8
                    local.get 1
                    local.get 7
                    i32.add
                    i32.load8_s
                    i32.const -65
                    i32.le_s
                    br_if 0 (;@8;)
                    i32.const 2
                    local.set 9
                    i32.const 1
                    local.set 10
                    br 3 (;@5;)
                  end
                  i32.const 0
                  local.set 10
                  local.get 3
                  i32.const 3
                  i32.add
                  local.tee 7
                  local.get 2
                  i32.ge_u
                  br_if 2 (;@5;)
                  local.get 1
                  local.get 7
                  i32.add
                  i32.load8_s
                  i32.const -65
                  i32.le_s
                  br_if 0 (;@7;)
                  i32.const 3
                  local.set 9
                  i32.const 1
                  local.set 10
                  br 2 (;@5;)
                end
                local.get 7
                i32.const 1
                i32.add
                local.set 3
                br 3 (;@3;)
              end
              i32.const 1
              local.set 9
              i32.const 1
              local.set 10
            end
            local.get 0
            local.get 3
            i32.store offset=4
            local.get 0
            i32.const 9
            i32.add
            local.get 9
            i32.store8
            local.get 0
            i32.const 8
            i32.add
            local.get 10
            i32.store8
            local.get 0
            i32.const 1
            i32.store
            return
          end
          local.get 3
          local.get 2
          i32.ge_u
          br_if 0 (;@3;)
          loop ;; label = @4
            local.get 1
            local.get 3
            i32.add
            i32.load8_s
            i32.const 0
            i32.lt_s
            br_if 1 (;@3;)
            local.get 2
            local.get 3
            i32.const 1
            i32.add
            local.tee 3
            i32.ne
            br_if 0 (;@4;)
            br 3 (;@1;)
          end
        end
        local.get 3
        local.get 2
        i32.lt_u
        br_if 0 (;@2;)
      end
    end
    local.get 0
    local.get 1
    i32.store offset=4
    local.get 0
    i32.const 8
    i32.add
    local.get 2
    i32.store
    local.get 0
    i32.const 0
    i32.store
  )
  (func $_ZN4core3fmt8builders11DebugStruct5field17h39e991b766bcf568E (;275;) (type 14) (param i32 i32 i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i64 i64)
    global.get $__stack_pointer
    i32.const 64
    i32.sub
    local.tee 5
    global.set $__stack_pointer
    i32.const 1
    local.set 6
    block ;; label = @1
      local.get 0
      i32.load8_u offset=4
      br_if 0 (;@1;)
      local.get 0
      i32.load8_u offset=5
      local.set 7
      block ;; label = @2
        local.get 0
        i32.load
        local.tee 8
        i32.load offset=24
        local.tee 9
        i32.const 4
        i32.and
        br_if 0 (;@2;)
        i32.const 1
        local.set 6
        local.get 8
        i32.load
        i32.const 1053945
        i32.const 1053947
        local.get 7
        i32.const 255
        i32.and
        local.tee 7
        select
        i32.const 2
        i32.const 3
        local.get 7
        select
        local.get 8
        i32.load offset=4
        i32.load offset=12
        call_indirect (type 4)
        br_if 1 (;@1;)
        i32.const 1
        local.set 6
        local.get 8
        i32.load
        local.get 1
        local.get 2
        local.get 8
        i32.load offset=4
        i32.load offset=12
        call_indirect (type 4)
        br_if 1 (;@1;)
        i32.const 1
        local.set 6
        local.get 8
        i32.load
        i32.const 1053892
        i32.const 2
        local.get 8
        i32.load offset=4
        i32.load offset=12
        call_indirect (type 4)
        br_if 1 (;@1;)
        local.get 3
        local.get 8
        local.get 4
        i32.load offset=12
        call_indirect (type 5)
        local.set 6
        br 1 (;@1;)
      end
      block ;; label = @2
        local.get 7
        i32.const 255
        i32.and
        br_if 0 (;@2;)
        i32.const 1
        local.set 6
        local.get 8
        i32.load
        i32.const 1053940
        i32.const 3
        local.get 8
        i32.load offset=4
        i32.load offset=12
        call_indirect (type 4)
        br_if 1 (;@1;)
        local.get 8
        i32.load offset=24
        local.set 9
      end
      i32.const 1
      local.set 6
      local.get 5
      i32.const 1
      i32.store8 offset=23
      local.get 5
      i32.const 1053912
      i32.store offset=28
      local.get 5
      local.get 8
      i64.load align=4
      i64.store offset=8
      local.get 5
      local.get 5
      i32.const 23
      i32.add
      i32.store offset=16
      local.get 8
      i64.load offset=8 align=4
      local.set 10
      local.get 8
      i64.load offset=16 align=4
      local.set 11
      local.get 5
      local.get 8
      i32.load8_u offset=32
      i32.store8 offset=56
      local.get 5
      local.get 8
      i32.load offset=28
      i32.store offset=52
      local.get 5
      local.get 9
      i32.store offset=48
      local.get 5
      local.get 11
      i64.store offset=40
      local.get 5
      local.get 10
      i64.store offset=32
      local.get 5
      local.get 5
      i32.const 8
      i32.add
      i32.store offset=24
      local.get 5
      i32.const 8
      i32.add
      local.get 1
      local.get 2
      call $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h37d46f421ca2b081E
      br_if 0 (;@1;)
      local.get 5
      i32.const 8
      i32.add
      i32.const 1053892
      i32.const 2
      call $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h37d46f421ca2b081E
      br_if 0 (;@1;)
      local.get 3
      local.get 5
      i32.const 24
      i32.add
      local.get 4
      i32.load offset=12
      call_indirect (type 5)
      br_if 0 (;@1;)
      local.get 5
      i32.load offset=24
      i32.const 1053943
      i32.const 2
      local.get 5
      i32.load offset=28
      i32.load offset=12
      call_indirect (type 4)
      local.set 6
    end
    local.get 0
    i32.const 1
    i32.store8 offset=5
    local.get 0
    local.get 6
    i32.store8 offset=4
    local.get 5
    i32.const 64
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN4core3fmt3num3imp51_$LT$impl$u20$core..fmt..Display$u20$for$u20$u8$GT$3fmt17hde39d1f064a4150cE (;276;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i64.load8_u
    i32.const 1
    local.get 1
    call $_ZN4core3fmt3num3imp7fmt_u6417hf4eec24457ffc084E
  )
  (func $_ZN4core6result13unwrap_failed17he6bfae7ea6f8795eE (;277;) (type 10) (param i32 i32 i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 64
    i32.sub
    local.tee 5
    global.set $__stack_pointer
    local.get 5
    local.get 1
    i32.store offset=12
    local.get 5
    local.get 0
    i32.store offset=8
    local.get 5
    local.get 3
    i32.store offset=20
    local.get 5
    local.get 2
    i32.store offset=16
    local.get 5
    i32.const 24
    i32.add
    i32.const 12
    i32.add
    i32.const 2
    i32.store
    local.get 5
    i32.const 44
    i32.add
    i32.const 2
    i32.store
    local.get 5
    i32.const 48
    i32.add
    i32.const 12
    i32.add
    i32.const 69
    i32.store
    local.get 5
    i32.const 1053896
    i32.store offset=32
    local.get 5
    i32.const 0
    i32.store offset=24
    local.get 5
    i32.const 70
    i32.store offset=52
    local.get 5
    local.get 5
    i32.const 48
    i32.add
    i32.store offset=40
    local.get 5
    local.get 5
    i32.const 16
    i32.add
    i32.store offset=56
    local.get 5
    local.get 5
    i32.const 8
    i32.add
    i32.store offset=48
    local.get 5
    i32.const 24
    i32.add
    local.get 4
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN70_$LT$core..panic..location..Location$u20$as$u20$core..fmt..Display$GT$3fmt17h9c3dd31b52e6f54eE (;278;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    i32.const 20
    i32.add
    i32.const 7
    i32.store
    local.get 2
    i32.const 12
    i32.add
    i32.const 7
    i32.store
    local.get 2
    i32.const 70
    i32.store offset=4
    local.get 2
    local.get 0
    i32.store
    local.get 2
    local.get 0
    i32.const 12
    i32.add
    i32.store offset=16
    local.get 2
    local.get 0
    i32.const 8
    i32.add
    i32.store offset=8
    local.get 1
    i32.load
    local.set 0
    local.get 1
    i32.load offset=4
    local.set 1
    local.get 2
    i32.const 3
    i32.store offset=44
    local.get 2
    i32.const 3
    i32.store offset=36
    local.get 2
    i32.const 1053680
    i32.store offset=32
    local.get 2
    i32.const 0
    i32.store offset=24
    local.get 2
    local.get 2
    i32.store offset=40
    local.get 0
    local.get 1
    local.get 2
    i32.const 24
    i32.add
    call $_ZN4core3fmt5write17h7558535140974479E
    local.set 0
    local.get 2
    i32.const 48
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17hd168602520dd2091E (;279;) (type 5) (param i32 i32) (result i32)
    local.get 1
    local.get 0
    i32.load
    local.get 0
    i32.load offset=4
    call $_ZN4core3fmt9Formatter3pad17hee1e19a8df95bdd9E
  )
  (func $_ZN4core5panic10panic_info9PanicInfo7payload17h2c14f7d93cbd0d04E (;280;) (type 3) (param i32 i32)
    local.get 0
    local.get 1
    i64.load align=4
    i64.store
  )
  (func $_ZN4core5panic10panic_info9PanicInfo7message17hbfef73d098d3c2a5E (;281;) (type 9) (param i32) (result i32)
    local.get 0
    i32.load offset=8
  )
  (func $_ZN4core5panic10panic_info9PanicInfo8location17h73a8e3c8110f5f4eE (;282;) (type 9) (param i32) (result i32)
    local.get 0
    i32.load offset=12
  )
  (func $_ZN4core5panic10panic_info9PanicInfo10can_unwind17h23da1c404642e99aE (;283;) (type 9) (param i32) (result i32)
    local.get 0
    i32.load8_u offset=16
  )
  (func $_ZN73_$LT$core..panic..panic_info..PanicInfo$u20$as$u20$core..fmt..Display$GT$3fmt17h66e4e62ff3323c23E (;284;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 64
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    i32.const 1
    local.set 3
    block ;; label = @1
      local.get 1
      i32.load
      local.tee 4
      i32.const 1053704
      i32.const 12
      local.get 1
      i32.load offset=4
      local.tee 1
      i32.load offset=12
      call_indirect (type 4)
      br_if 0 (;@1;)
      block ;; label = @2
        block ;; label = @3
          local.get 0
          i32.load offset=8
          local.tee 3
          i32.eqz
          br_if 0 (;@3;)
          local.get 2
          local.get 3
          i32.store offset=12
          local.get 2
          i32.const 71
          i32.store offset=20
          local.get 2
          local.get 2
          i32.const 12
          i32.add
          i32.store offset=16
          i32.const 1
          local.set 3
          local.get 2
          i32.const 1
          i32.store offset=60
          local.get 2
          i32.const 2
          i32.store offset=52
          local.get 2
          i32.const 1053720
          i32.store offset=48
          local.get 2
          i32.const 0
          i32.store offset=40
          local.get 2
          local.get 2
          i32.const 16
          i32.add
          i32.store offset=56
          local.get 4
          local.get 1
          local.get 2
          i32.const 40
          i32.add
          call $_ZN4core3fmt5write17h7558535140974479E
          i32.eqz
          br_if 1 (;@2;)
          br 2 (;@1;)
        end
        local.get 0
        i32.load
        local.tee 3
        local.get 0
        i32.load offset=4
        i32.const 12
        i32.add
        i32.load
        call_indirect (type $.data)
        i64.const -8527728395957036344
        i64.ne
        br_if 0 (;@2;)
        local.get 2
        local.get 3
        i32.store offset=12
        local.get 2
        i32.const 72
        i32.store offset=20
        local.get 2
        local.get 2
        i32.const 12
        i32.add
        i32.store offset=16
        i32.const 1
        local.set 3
        local.get 2
        i32.const 1
        i32.store offset=60
        local.get 2
        i32.const 2
        i32.store offset=52
        local.get 2
        i32.const 1053720
        i32.store offset=48
        local.get 2
        i32.const 0
        i32.store offset=40
        local.get 2
        local.get 2
        i32.const 16
        i32.add
        i32.store offset=56
        local.get 4
        local.get 1
        local.get 2
        i32.const 40
        i32.add
        call $_ZN4core3fmt5write17h7558535140974479E
        br_if 1 (;@1;)
      end
      local.get 0
      i32.load offset=12
      local.set 3
      local.get 2
      i32.const 36
      i32.add
      i32.const 7
      i32.store
      local.get 2
      i32.const 16
      i32.add
      i32.const 12
      i32.add
      i32.const 7
      i32.store
      local.get 2
      local.get 3
      i32.const 12
      i32.add
      i32.store offset=32
      local.get 2
      local.get 3
      i32.const 8
      i32.add
      i32.store offset=24
      local.get 2
      i32.const 70
      i32.store offset=20
      local.get 2
      local.get 3
      i32.store offset=16
      local.get 2
      i32.const 3
      i32.store offset=60
      local.get 2
      i32.const 3
      i32.store offset=52
      local.get 2
      i32.const 1053680
      i32.store offset=48
      local.get 2
      i32.const 0
      i32.store offset=40
      local.get 2
      local.get 2
      i32.const 16
      i32.add
      i32.store offset=56
      local.get 4
      local.get 1
      local.get 2
      i32.const 40
      i32.add
      call $_ZN4core3fmt5write17h7558535140974479E
      local.set 3
    end
    local.get 2
    i32.const 64
    i32.add
    global.set $__stack_pointer
    local.get 3
  )
  (func $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17h4292964f1c9daeffE (;285;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 1
    i32.load offset=4
    local.set 3
    local.get 1
    i32.load
    local.set 4
    local.get 2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get 0
    i32.load
    local.tee 1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 1
    i64.load align=4
    i64.store offset=8
    local.get 4
    local.get 3
    local.get 2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17h7558535140974479E
    local.set 1
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17he9a145660f417571E (;286;) (type 5) (param i32 i32) (result i32)
    local.get 1
    local.get 0
    i32.load
    local.tee 0
    i32.load
    local.get 0
    i32.load offset=4
    call $_ZN4core3fmt9Formatter3pad17hee1e19a8df95bdd9E
  )
  (func $_ZN4core9panicking19assert_failed_inner17hf30758b978d1cad1E (;287;) (type 11) (param i32 i32 i32 i32 i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 112
    i32.sub
    local.tee 7
    global.set $__stack_pointer
    local.get 7
    local.get 2
    i32.store offset=12
    local.get 7
    local.get 1
    i32.store offset=8
    local.get 7
    local.get 4
    i32.store offset=20
    local.get 7
    local.get 3
    i32.store offset=16
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 0
            i32.const 255
            i32.and
            br_table 0 (;@4;) 1 (;@3;) 2 (;@2;) 0 (;@4;)
          end
          local.get 7
          i32.const 1053761
          i32.store offset=24
          i32.const 2
          local.set 2
          br 2 (;@1;)
        end
        local.get 7
        i32.const 1053759
        i32.store offset=24
        i32.const 2
        local.set 2
        br 1 (;@1;)
      end
      local.get 7
      i32.const 1053752
      i32.store offset=24
      i32.const 7
      local.set 2
    end
    local.get 7
    local.get 2
    i32.store offset=28
    block ;; label = @1
      local.get 5
      i32.load offset=8
      br_if 0 (;@1;)
      local.get 7
      i32.const 56
      i32.add
      i32.const 20
      i32.add
      i32.const 69
      i32.store
      local.get 7
      i32.const 56
      i32.add
      i32.const 12
      i32.add
      i32.const 69
      i32.store
      local.get 7
      i32.const 88
      i32.add
      i32.const 12
      i32.add
      i32.const 4
      i32.store
      local.get 7
      i32.const 88
      i32.add
      i32.const 20
      i32.add
      i32.const 3
      i32.store
      local.get 7
      i32.const 1053860
      i32.store offset=96
      local.get 7
      i32.const 0
      i32.store offset=88
      local.get 7
      i32.const 70
      i32.store offset=60
      local.get 7
      local.get 7
      i32.const 56
      i32.add
      i32.store offset=104
      local.get 7
      local.get 7
      i32.const 16
      i32.add
      i32.store offset=72
      local.get 7
      local.get 7
      i32.const 8
      i32.add
      i32.store offset=64
      local.get 7
      local.get 7
      i32.const 24
      i32.add
      i32.store offset=56
      local.get 7
      i32.const 88
      i32.add
      local.get 6
      call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
      unreachable
    end
    local.get 7
    i32.const 32
    i32.add
    i32.const 16
    i32.add
    local.get 5
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 7
    i32.const 32
    i32.add
    i32.const 8
    i32.add
    local.get 5
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 7
    local.get 5
    i64.load align=4
    i64.store offset=32
    local.get 7
    i32.const 88
    i32.add
    i32.const 12
    i32.add
    i32.const 4
    i32.store
    local.get 7
    i32.const 88
    i32.add
    i32.const 20
    i32.add
    i32.const 4
    i32.store
    local.get 7
    i32.const 84
    i32.add
    i32.const 14
    i32.store
    local.get 7
    i32.const 56
    i32.add
    i32.const 20
    i32.add
    i32.const 69
    i32.store
    local.get 7
    i32.const 56
    i32.add
    i32.const 12
    i32.add
    i32.const 69
    i32.store
    local.get 7
    i32.const 1053824
    i32.store offset=96
    local.get 7
    i32.const 0
    i32.store offset=88
    local.get 7
    i32.const 70
    i32.store offset=60
    local.get 7
    local.get 7
    i32.const 56
    i32.add
    i32.store offset=104
    local.get 7
    local.get 7
    i32.const 32
    i32.add
    i32.store offset=80
    local.get 7
    local.get 7
    i32.const 16
    i32.add
    i32.store offset=72
    local.get 7
    local.get 7
    i32.const 8
    i32.add
    i32.store offset=64
    local.get 7
    local.get 7
    i32.const 24
    i32.add
    i32.store offset=56
    local.get 7
    i32.const 88
    i32.add
    local.get 6
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h20f7957e80c7e530E (;288;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i32.load
    local.get 1
    local.get 0
    i32.load offset=4
    i32.load offset=12
    call_indirect (type 5)
  )
  (func $_ZN59_$LT$core..fmt..Arguments$u20$as$u20$core..fmt..Display$GT$3fmt17h6ae0c0f6e4b417fcE (;289;) (type 5) (param i32 i32) (result i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 1
    i32.load offset=4
    local.set 3
    local.get 1
    i32.load
    local.set 1
    local.get 2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get 0
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get 0
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 0
    i64.load align=4
    i64.store offset=8
    local.get 1
    local.get 3
    local.get 2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17h7558535140974479E
    local.set 0
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h37d46f421ca2b081E (;290;) (type 4) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    local.get 3
    i64.const 42949672961
    i64.store offset=32
    local.get 3
    local.get 2
    i32.store offset=28
    i32.const 0
    local.set 4
    local.get 3
    i32.const 0
    i32.store offset=24
    local.get 3
    local.get 2
    i32.store offset=20
    local.get 3
    local.get 1
    i32.store offset=16
    local.get 3
    local.get 2
    i32.store offset=12
    local.get 3
    i32.const 0
    i32.store offset=8
    local.get 0
    i32.load offset=4
    local.set 5
    local.get 0
    i32.load
    local.set 6
    local.get 0
    i32.load offset=8
    local.set 7
    i32.const 0
    local.set 8
    i32.const 0
    local.set 9
    block ;; label = @1
      loop ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 9
            i32.const 255
            i32.and
            br_if 0 (;@4;)
            block ;; label = @5
              local.get 8
              local.get 2
              i32.gt_u
              br_if 0 (;@5;)
              loop ;; label = @6
                local.get 1
                local.get 8
                i32.add
                local.set 10
                block ;; label = @7
                  block ;; label = @8
                    local.get 2
                    local.get 8
                    i32.sub
                    local.tee 11
                    i32.const 8
                    i32.lt_u
                    br_if 0 (;@8;)
                    local.get 3
                    i32.const 10
                    local.get 10
                    local.get 11
                    call $_ZN4core5slice6memchr14memchr_aligned17h129bf890ef0ffda6E
                    local.get 3
                    i32.load offset=4
                    local.set 0
                    local.get 3
                    i32.load
                    local.set 10
                    br 1 (;@7;)
                  end
                  i32.const 0
                  local.set 0
                  block ;; label = @8
                    local.get 11
                    br_if 0 (;@8;)
                    i32.const 0
                    local.set 10
                    br 1 (;@7;)
                  end
                  loop ;; label = @8
                    block ;; label = @9
                      local.get 10
                      local.get 0
                      i32.add
                      i32.load8_u
                      i32.const 10
                      i32.ne
                      br_if 0 (;@9;)
                      i32.const 1
                      local.set 10
                      br 2 (;@7;)
                    end
                    local.get 11
                    local.get 0
                    i32.const 1
                    i32.add
                    local.tee 0
                    i32.ne
                    br_if 0 (;@8;)
                  end
                  i32.const 0
                  local.set 10
                  local.get 11
                  local.set 0
                end
                block ;; label = @7
                  local.get 10
                  i32.const 1
                  i32.eq
                  br_if 0 (;@7;)
                  local.get 2
                  local.set 8
                  br 2 (;@5;)
                end
                local.get 8
                local.get 0
                i32.add
                local.tee 0
                i32.const 1
                i32.add
                local.set 8
                block ;; label = @7
                  local.get 0
                  local.get 2
                  i32.ge_u
                  br_if 0 (;@7;)
                  local.get 1
                  local.get 0
                  i32.add
                  i32.load8_u
                  i32.const 10
                  i32.ne
                  br_if 0 (;@7;)
                  i32.const 0
                  local.set 9
                  local.get 8
                  local.set 12
                  local.get 8
                  local.set 0
                  br 4 (;@3;)
                end
                local.get 8
                local.get 2
                i32.le_u
                br_if 0 (;@6;)
              end
            end
            i32.const 1
            local.set 9
            local.get 4
            local.set 12
            local.get 2
            local.set 0
            local.get 4
            local.get 2
            i32.ne
            br_if 1 (;@3;)
          end
          i32.const 0
          local.set 0
          br 2 (;@1;)
        end
        block ;; label = @3
          block ;; label = @4
            local.get 7
            i32.load8_u
            i32.eqz
            br_if 0 (;@4;)
            local.get 6
            i32.const 1053936
            i32.const 4
            local.get 5
            i32.load offset=12
            call_indirect (type 4)
            br_if 1 (;@3;)
          end
          local.get 1
          local.get 4
          i32.add
          local.set 11
          local.get 0
          local.get 4
          i32.sub
          local.set 10
          i32.const 0
          local.set 13
          block ;; label = @4
            local.get 0
            local.get 4
            i32.eq
            br_if 0 (;@4;)
            local.get 10
            local.get 11
            i32.add
            i32.const -1
            i32.add
            i32.load8_u
            i32.const 10
            i32.eq
            local.set 13
          end
          local.get 7
          local.get 13
          i32.store8
          local.get 12
          local.set 4
          local.get 6
          local.get 11
          local.get 10
          local.get 5
          i32.load offset=12
          call_indirect (type 4)
          i32.eqz
          br_if 1 (;@2;)
        end
      end
      i32.const 1
      local.set 0
    end
    local.get 3
    i32.const 48
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN4core3fmt8builders10DebugTuple5field17h0996cc37bba625e1E (;291;) (type 4) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i64 i64)
    global.get $__stack_pointer
    i32.const 64
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 0
        i32.load8_u offset=8
        i32.eqz
        br_if 0 (;@2;)
        local.get 0
        i32.load
        local.set 4
        i32.const 1
        local.set 5
        br 1 (;@1;)
      end
      local.get 0
      i32.load
      local.set 4
      block ;; label = @2
        local.get 0
        i32.const 4
        i32.add
        i32.load
        local.tee 6
        i32.load offset=24
        local.tee 7
        i32.const 4
        i32.and
        br_if 0 (;@2;)
        i32.const 1
        local.set 5
        local.get 6
        i32.load
        i32.const 1053945
        i32.const 1053955
        local.get 4
        select
        i32.const 2
        i32.const 1
        local.get 4
        select
        local.get 6
        i32.load offset=4
        i32.load offset=12
        call_indirect (type 4)
        br_if 1 (;@1;)
        local.get 1
        local.get 6
        local.get 2
        i32.load offset=12
        call_indirect (type 5)
        local.set 5
        br 1 (;@1;)
      end
      block ;; label = @2
        local.get 4
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 6
          i32.load
          i32.const 1053953
          i32.const 2
          local.get 6
          i32.load offset=4
          i32.load offset=12
          call_indirect (type 4)
          i32.eqz
          br_if 0 (;@3;)
          i32.const 1
          local.set 5
          i32.const 0
          local.set 4
          br 2 (;@1;)
        end
        local.get 6
        i32.load offset=24
        local.set 7
      end
      i32.const 1
      local.set 5
      local.get 3
      i32.const 1
      i32.store8 offset=23
      local.get 3
      i32.const 1053912
      i32.store offset=28
      local.get 3
      local.get 6
      i64.load align=4
      i64.store offset=8
      local.get 3
      local.get 3
      i32.const 23
      i32.add
      i32.store offset=16
      local.get 6
      i64.load offset=8 align=4
      local.set 8
      local.get 6
      i64.load offset=16 align=4
      local.set 9
      local.get 3
      local.get 6
      i32.load8_u offset=32
      i32.store8 offset=56
      local.get 3
      local.get 6
      i32.load offset=28
      i32.store offset=52
      local.get 3
      local.get 7
      i32.store offset=48
      local.get 3
      local.get 9
      i64.store offset=40
      local.get 3
      local.get 8
      i64.store offset=32
      local.get 3
      local.get 3
      i32.const 8
      i32.add
      i32.store offset=24
      local.get 1
      local.get 3
      i32.const 24
      i32.add
      local.get 2
      i32.load offset=12
      call_indirect (type 5)
      br_if 0 (;@1;)
      local.get 3
      i32.load offset=24
      i32.const 1053943
      i32.const 2
      local.get 3
      i32.load offset=28
      i32.load offset=12
      call_indirect (type 4)
      local.set 5
    end
    local.get 0
    local.get 5
    i32.store8 offset=8
    local.get 0
    local.get 4
    i32.const 1
    i32.add
    i32.store
    local.get 3
    i32.const 64
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN4core3fmt8builders10DebugInner5entry17h309725793a35d11dE (;292;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i64 i64)
    global.get $__stack_pointer
    i32.const 64
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    i32.const 1
    local.set 4
    block ;; label = @1
      local.get 0
      i32.load8_u offset=4
      br_if 0 (;@1;)
      local.get 0
      i32.load8_u offset=5
      local.set 4
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              local.get 0
              i32.load
              local.tee 5
              i32.load offset=24
              local.tee 6
              i32.const 4
              i32.and
              br_if 0 (;@5;)
              local.get 4
              i32.const 255
              i32.and
              br_if 1 (;@4;)
              br 3 (;@2;)
            end
            local.get 4
            i32.const 255
            i32.and
            br_if 1 (;@3;)
            i32.const 1
            local.set 4
            local.get 5
            i32.load
            i32.const 1053957
            i32.const 1
            local.get 5
            i32.load offset=4
            i32.load offset=12
            call_indirect (type 4)
            br_if 3 (;@1;)
            local.get 5
            i32.load offset=24
            local.set 6
            br 1 (;@3;)
          end
          i32.const 1
          local.set 4
          local.get 5
          i32.load
          i32.const 1053945
          i32.const 2
          local.get 5
          i32.load offset=4
          i32.load offset=12
          call_indirect (type 4)
          i32.eqz
          br_if 1 (;@2;)
          br 2 (;@1;)
        end
        i32.const 1
        local.set 4
        local.get 3
        i32.const 1
        i32.store8 offset=23
        local.get 3
        i32.const 1053912
        i32.store offset=28
        local.get 3
        local.get 5
        i64.load align=4
        i64.store offset=8
        local.get 3
        local.get 3
        i32.const 23
        i32.add
        i32.store offset=16
        local.get 5
        i64.load offset=8 align=4
        local.set 7
        local.get 5
        i64.load offset=16 align=4
        local.set 8
        local.get 3
        local.get 5
        i32.load8_u offset=32
        i32.store8 offset=56
        local.get 3
        local.get 5
        i32.load offset=28
        i32.store offset=52
        local.get 3
        local.get 6
        i32.store offset=48
        local.get 3
        local.get 8
        i64.store offset=40
        local.get 3
        local.get 7
        i64.store offset=32
        local.get 3
        local.get 3
        i32.const 8
        i32.add
        i32.store offset=24
        local.get 1
        local.get 3
        i32.const 24
        i32.add
        local.get 2
        i32.load offset=12
        call_indirect (type 5)
        br_if 1 (;@1;)
        local.get 3
        i32.load offset=24
        i32.const 1053943
        i32.const 2
        local.get 3
        i32.load offset=28
        i32.load offset=12
        call_indirect (type 4)
        local.set 4
        br 1 (;@1;)
      end
      local.get 1
      local.get 5
      local.get 2
      i32.load offset=12
      call_indirect (type 5)
      local.set 4
    end
    local.get 0
    i32.const 1
    i32.store8 offset=5
    local.get 0
    local.get 4
    i32.store8 offset=4
    local.get 3
    i32.const 64
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN4core3fmt8builders8DebugSet5entry17hbf6eeee7f2aed797E (;293;) (type 4) (param i32 i32 i32) (result i32)
    local.get 0
    local.get 1
    local.get 2
    call $_ZN4core3fmt8builders10DebugInner5entry17h309725793a35d11dE
    local.get 0
  )
  (func $_ZN4core3fmt8builders9DebugList6finish17hb67e8ba8401b18f3E (;294;) (type 9) (param i32) (result i32)
    (local i32)
    i32.const 1
    local.set 1
    block ;; label = @1
      local.get 0
      i32.load8_u offset=4
      br_if 0 (;@1;)
      local.get 0
      i32.load
      local.tee 0
      i32.load
      i32.const 1053976
      i32.const 1
      local.get 0
      i32.const 4
      i32.add
      i32.load
      i32.load offset=12
      call_indirect (type 4)
      local.set 1
    end
    local.get 1
  )
  (func $_ZN4core3fmt9Formatter12pad_integral17hcc3b56246532f1b4E (;295;) (type 15) (param i32 i32 i32 i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.eqz
        br_if 0 (;@2;)
        i32.const 43
        i32.const 1114112
        local.get 0
        i32.load offset=24
        local.tee 6
        i32.const 1
        i32.and
        local.tee 1
        select
        local.set 7
        local.get 1
        local.get 5
        i32.add
        local.set 8
        br 1 (;@1;)
      end
      local.get 5
      i32.const 1
      i32.add
      local.set 8
      local.get 0
      i32.load offset=24
      local.set 6
      i32.const 45
      local.set 7
    end
    block ;; label = @1
      block ;; label = @2
        local.get 6
        i32.const 4
        i32.and
        br_if 0 (;@2;)
        i32.const 0
        local.set 2
        br 1 (;@1;)
      end
      block ;; label = @2
        block ;; label = @3
          local.get 3
          i32.const 16
          i32.lt_u
          br_if 0 (;@3;)
          local.get 2
          local.get 3
          call $_ZN4core3str5count14do_count_chars17h9555fdd2933f4e49E
          local.set 9
          br 1 (;@2;)
        end
        block ;; label = @3
          local.get 3
          br_if 0 (;@3;)
          i32.const 0
          local.set 9
          br 1 (;@2;)
        end
        local.get 3
        i32.const 3
        i32.and
        local.set 10
        block ;; label = @3
          block ;; label = @4
            local.get 3
            i32.const -1
            i32.add
            i32.const 3
            i32.ge_u
            br_if 0 (;@4;)
            i32.const 0
            local.set 9
            local.get 2
            local.set 1
            br 1 (;@3;)
          end
          local.get 3
          i32.const -4
          i32.and
          local.set 11
          i32.const 0
          local.set 9
          local.get 2
          local.set 1
          loop ;; label = @4
            local.get 9
            local.get 1
            i32.load8_s
            i32.const -65
            i32.gt_s
            i32.add
            local.get 1
            i32.load8_s offset=1
            i32.const -65
            i32.gt_s
            i32.add
            local.get 1
            i32.load8_s offset=2
            i32.const -65
            i32.gt_s
            i32.add
            local.get 1
            i32.load8_s offset=3
            i32.const -65
            i32.gt_s
            i32.add
            local.set 9
            local.get 1
            i32.const 4
            i32.add
            local.set 1
            local.get 11
            i32.const -4
            i32.add
            local.tee 11
            br_if 0 (;@4;)
          end
        end
        local.get 10
        i32.eqz
        br_if 0 (;@2;)
        loop ;; label = @3
          local.get 9
          local.get 1
          i32.load8_s
          i32.const -65
          i32.gt_s
          i32.add
          local.set 9
          local.get 1
          i32.const 1
          i32.add
          local.set 1
          local.get 10
          i32.const -1
          i32.add
          local.tee 10
          br_if 0 (;@3;)
        end
      end
      local.get 9
      local.get 8
      i32.add
      local.set 8
    end
    block ;; label = @1
      block ;; label = @2
        local.get 0
        i32.load offset=8
        br_if 0 (;@2;)
        i32.const 1
        local.set 1
        local.get 0
        i32.load
        local.tee 9
        local.get 0
        i32.const 4
        i32.add
        i32.load
        local.tee 0
        local.get 7
        local.get 2
        local.get 3
        call $_ZN4core3fmt9Formatter12pad_integral12write_prefix17hf3cd6df73ed78638E
        br_if 1 (;@1;)
        local.get 9
        local.get 4
        local.get 5
        local.get 0
        i32.load offset=12
        call_indirect (type 4)
        return
      end
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                local.get 0
                i32.const 12
                i32.add
                i32.load
                local.tee 11
                local.get 8
                i32.le_u
                br_if 0 (;@6;)
                local.get 6
                i32.const 8
                i32.and
                br_if 4 (;@2;)
                local.get 11
                local.get 8
                i32.sub
                local.tee 9
                local.set 11
                i32.const 1
                local.get 0
                i32.load8_u offset=32
                local.tee 1
                local.get 1
                i32.const 3
                i32.eq
                select
                i32.const 3
                i32.and
                local.tee 1
                br_table 3 (;@3;) 1 (;@5;) 2 (;@4;) 3 (;@3;)
              end
              i32.const 1
              local.set 1
              local.get 0
              i32.load
              local.tee 9
              local.get 0
              i32.const 4
              i32.add
              i32.load
              local.tee 0
              local.get 7
              local.get 2
              local.get 3
              call $_ZN4core3fmt9Formatter12pad_integral12write_prefix17hf3cd6df73ed78638E
              br_if 4 (;@1;)
              local.get 9
              local.get 4
              local.get 5
              local.get 0
              i32.load offset=12
              call_indirect (type 4)
              return
            end
            i32.const 0
            local.set 11
            local.get 9
            local.set 1
            br 1 (;@3;)
          end
          local.get 9
          i32.const 1
          i32.shr_u
          local.set 1
          local.get 9
          i32.const 1
          i32.add
          i32.const 1
          i32.shr_u
          local.set 11
        end
        local.get 1
        i32.const 1
        i32.add
        local.set 1
        local.get 0
        i32.const 4
        i32.add
        i32.load
        local.set 10
        local.get 0
        i32.load offset=28
        local.set 9
        local.get 0
        i32.load
        local.set 0
        block ;; label = @3
          loop ;; label = @4
            local.get 1
            i32.const -1
            i32.add
            local.tee 1
            i32.eqz
            br_if 1 (;@3;)
            local.get 0
            local.get 9
            local.get 10
            i32.load offset=16
            call_indirect (type 5)
            i32.eqz
            br_if 0 (;@4;)
          end
          i32.const 1
          return
        end
        i32.const 1
        local.set 1
        local.get 9
        i32.const 1114112
        i32.eq
        br_if 1 (;@1;)
        local.get 0
        local.get 10
        local.get 7
        local.get 2
        local.get 3
        call $_ZN4core3fmt9Formatter12pad_integral12write_prefix17hf3cd6df73ed78638E
        br_if 1 (;@1;)
        local.get 0
        local.get 4
        local.get 5
        local.get 10
        i32.load offset=12
        call_indirect (type 4)
        br_if 1 (;@1;)
        i32.const 0
        local.set 1
        block ;; label = @3
          loop ;; label = @4
            block ;; label = @5
              local.get 11
              local.get 1
              i32.ne
              br_if 0 (;@5;)
              local.get 11
              local.set 1
              br 2 (;@3;)
            end
            local.get 1
            i32.const 1
            i32.add
            local.set 1
            local.get 0
            local.get 9
            local.get 10
            i32.load offset=16
            call_indirect (type 5)
            i32.eqz
            br_if 0 (;@4;)
          end
          local.get 1
          i32.const -1
          i32.add
          local.set 1
        end
        local.get 1
        local.get 11
        i32.lt_u
        local.set 1
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=28
      local.set 6
      local.get 0
      i32.const 48
      i32.store offset=28
      local.get 0
      i32.load8_u offset=32
      local.set 12
      i32.const 1
      local.set 1
      local.get 0
      i32.const 1
      i32.store8 offset=32
      local.get 0
      i32.load
      local.tee 9
      local.get 0
      i32.const 4
      i32.add
      i32.load
      local.tee 10
      local.get 7
      local.get 2
      local.get 3
      call $_ZN4core3fmt9Formatter12pad_integral12write_prefix17hf3cd6df73ed78638E
      br_if 0 (;@1;)
      local.get 11
      local.get 8
      i32.sub
      i32.const 1
      i32.add
      local.set 1
      block ;; label = @2
        loop ;; label = @3
          local.get 1
          i32.const -1
          i32.add
          local.tee 1
          i32.eqz
          br_if 1 (;@2;)
          local.get 9
          i32.const 48
          local.get 10
          i32.load offset=16
          call_indirect (type 5)
          i32.eqz
          br_if 0 (;@3;)
        end
        i32.const 1
        return
      end
      i32.const 1
      local.set 1
      local.get 9
      local.get 4
      local.get 5
      local.get 10
      i32.load offset=12
      call_indirect (type 4)
      br_if 0 (;@1;)
      local.get 0
      local.get 12
      i32.store8 offset=32
      local.get 0
      local.get 6
      i32.store offset=28
      i32.const 0
      return
    end
    local.get 1
  )
  (func $_ZN4core3fmt5Write10write_char17hf19f273a49a82ceaE (;296;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    i32.const 0
    i32.store offset=12
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.const 128
        i32.lt_u
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 1
          i32.const 2048
          i32.lt_u
          br_if 0 (;@3;)
          block ;; label = @4
            local.get 1
            i32.const 65536
            i32.lt_u
            br_if 0 (;@4;)
            local.get 2
            local.get 1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=15
            local.get 2
            local.get 1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=14
            local.get 2
            local.get 1
            i32.const 12
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            local.get 2
            local.get 1
            i32.const 18
            i32.shr_u
            i32.const 7
            i32.and
            i32.const 240
            i32.or
            i32.store8 offset=12
            i32.const 4
            local.set 1
            br 3 (;@1;)
          end
          local.get 2
          local.get 1
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=14
          local.get 2
          local.get 1
          i32.const 12
          i32.shr_u
          i32.const 224
          i32.or
          i32.store8 offset=12
          local.get 2
          local.get 1
          i32.const 6
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=13
          i32.const 3
          local.set 1
          br 2 (;@1;)
        end
        local.get 2
        local.get 1
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=13
        local.get 2
        local.get 1
        i32.const 6
        i32.shr_u
        i32.const 192
        i32.or
        i32.store8 offset=12
        i32.const 2
        local.set 1
        br 1 (;@1;)
      end
      local.get 2
      local.get 1
      i32.store8 offset=12
      i32.const 1
      local.set 1
    end
    local.get 0
    local.get 2
    i32.const 12
    i32.add
    local.get 1
    call $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h37d46f421ca2b081E
    local.set 1
    local.get 2
    i32.const 16
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN4core3fmt5Write9write_fmt17hd3cc343066351280E (;297;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    local.get 0
    i32.store offset=4
    local.get 2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 1
    i64.load align=4
    i64.store offset=8
    local.get 2
    i32.const 4
    i32.add
    i32.const 1054224
    local.get 2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17h7558535140974479E
    local.set 1
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h955563679bd7795bE (;298;) (type 4) (param i32 i32 i32) (result i32)
    local.get 0
    i32.load
    local.get 1
    local.get 2
    call $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h37d46f421ca2b081E
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h301275e729a36d98E (;299;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 0
    i32.load
    local.set 0
    local.get 2
    i32.const 0
    i32.store offset=12
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.const 128
        i32.lt_u
        br_if 0 (;@2;)
        block ;; label = @3
          local.get 1
          i32.const 2048
          i32.lt_u
          br_if 0 (;@3;)
          block ;; label = @4
            local.get 1
            i32.const 65536
            i32.lt_u
            br_if 0 (;@4;)
            local.get 2
            local.get 1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=15
            local.get 2
            local.get 1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=14
            local.get 2
            local.get 1
            i32.const 12
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            local.get 2
            local.get 1
            i32.const 18
            i32.shr_u
            i32.const 7
            i32.and
            i32.const 240
            i32.or
            i32.store8 offset=12
            i32.const 4
            local.set 1
            br 3 (;@1;)
          end
          local.get 2
          local.get 1
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=14
          local.get 2
          local.get 1
          i32.const 12
          i32.shr_u
          i32.const 224
          i32.or
          i32.store8 offset=12
          local.get 2
          local.get 1
          i32.const 6
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=13
          i32.const 3
          local.set 1
          br 2 (;@1;)
        end
        local.get 2
        local.get 1
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=13
        local.get 2
        local.get 1
        i32.const 6
        i32.shr_u
        i32.const 192
        i32.or
        i32.store8 offset=12
        i32.const 2
        local.set 1
        br 1 (;@1;)
      end
      local.get 2
      local.get 1
      i32.store8 offset=12
      i32.const 1
      local.set 1
    end
    local.get 0
    local.get 2
    i32.const 12
    i32.add
    local.get 1
    call $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h37d46f421ca2b081E
    local.set 1
    local.get 2
    i32.const 16
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17h9a8c87329b057ce1E (;300;) (type 5) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    local.get 0
    i32.load
    i32.store offset=4
    local.get 2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 1
    i64.load align=4
    i64.store offset=8
    local.get 2
    i32.const 4
    i32.add
    i32.const 1054224
    local.get 2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17h7558535140974479E
    local.set 1
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN4core3str5count14do_count_chars17h9555fdd2933f4e49E (;301;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32)
    block ;; label = @1
      block ;; label = @2
        local.get 0
        i32.const 3
        i32.add
        i32.const -4
        i32.and
        local.tee 2
        local.get 0
        i32.sub
        local.tee 3
        local.get 1
        i32.gt_u
        br_if 0 (;@2;)
        local.get 3
        i32.const 4
        i32.gt_u
        br_if 0 (;@2;)
        local.get 1
        local.get 3
        i32.sub
        local.tee 4
        i32.const 4
        i32.lt_u
        br_if 0 (;@2;)
        local.get 4
        i32.const 3
        i32.and
        local.set 5
        i32.const 0
        local.set 6
        i32.const 0
        local.set 1
        block ;; label = @3
          local.get 2
          local.get 0
          i32.eq
          br_if 0 (;@3;)
          local.get 3
          i32.const 3
          i32.and
          local.set 7
          block ;; label = @4
            block ;; label = @5
              local.get 2
              local.get 0
              i32.const -1
              i32.xor
              i32.add
              i32.const 3
              i32.ge_u
              br_if 0 (;@5;)
              i32.const 0
              local.set 1
              local.get 0
              local.set 2
              br 1 (;@4;)
            end
            local.get 3
            i32.const -4
            i32.and
            local.set 8
            i32.const 0
            local.set 1
            local.get 0
            local.set 2
            loop ;; label = @5
              local.get 1
              local.get 2
              i32.load8_s
              i32.const -65
              i32.gt_s
              i32.add
              local.get 2
              i32.load8_s offset=1
              i32.const -65
              i32.gt_s
              i32.add
              local.get 2
              i32.load8_s offset=2
              i32.const -65
              i32.gt_s
              i32.add
              local.get 2
              i32.load8_s offset=3
              i32.const -65
              i32.gt_s
              i32.add
              local.set 1
              local.get 2
              i32.const 4
              i32.add
              local.set 2
              local.get 8
              i32.const -4
              i32.add
              local.tee 8
              br_if 0 (;@5;)
            end
          end
          local.get 7
          i32.eqz
          br_if 0 (;@3;)
          loop ;; label = @4
            local.get 1
            local.get 2
            i32.load8_s
            i32.const -65
            i32.gt_s
            i32.add
            local.set 1
            local.get 2
            i32.const 1
            i32.add
            local.set 2
            local.get 7
            i32.const -1
            i32.add
            local.tee 7
            br_if 0 (;@4;)
          end
        end
        local.get 0
        local.get 3
        i32.add
        local.set 0
        block ;; label = @3
          local.get 5
          i32.eqz
          br_if 0 (;@3;)
          local.get 0
          local.get 4
          i32.const -4
          i32.and
          i32.add
          local.tee 2
          i32.load8_s
          i32.const -65
          i32.gt_s
          local.set 6
          local.get 5
          i32.const 1
          i32.eq
          br_if 0 (;@3;)
          local.get 6
          local.get 2
          i32.load8_s offset=1
          i32.const -65
          i32.gt_s
          i32.add
          local.set 6
          local.get 5
          i32.const 2
          i32.eq
          br_if 0 (;@3;)
          local.get 6
          local.get 2
          i32.load8_s offset=2
          i32.const -65
          i32.gt_s
          i32.add
          local.set 6
        end
        local.get 4
        i32.const 2
        i32.shr_u
        local.set 3
        local.get 6
        local.get 1
        i32.add
        local.set 7
        loop ;; label = @3
          local.get 0
          local.set 6
          local.get 3
          i32.eqz
          br_if 2 (;@1;)
          local.get 3
          i32.const 192
          local.get 3
          i32.const 192
          i32.lt_u
          select
          local.tee 4
          i32.const 3
          i32.and
          local.set 5
          local.get 4
          i32.const 2
          i32.shl
          local.set 9
          block ;; label = @4
            block ;; label = @5
              local.get 4
              i32.const 252
              i32.and
              local.tee 10
              br_if 0 (;@5;)
              i32.const 0
              local.set 2
              br 1 (;@4;)
            end
            local.get 6
            local.get 10
            i32.const 2
            i32.shl
            i32.add
            local.set 8
            i32.const 0
            local.set 2
            local.get 6
            local.set 0
            loop ;; label = @5
              local.get 0
              i32.eqz
              br_if 1 (;@4;)
              local.get 0
              i32.const 12
              i32.add
              i32.load
              local.tee 1
              i32.const -1
              i32.xor
              i32.const 7
              i32.shr_u
              local.get 1
              i32.const 6
              i32.shr_u
              i32.or
              i32.const 16843009
              i32.and
              local.get 0
              i32.const 8
              i32.add
              i32.load
              local.tee 1
              i32.const -1
              i32.xor
              i32.const 7
              i32.shr_u
              local.get 1
              i32.const 6
              i32.shr_u
              i32.or
              i32.const 16843009
              i32.and
              local.get 0
              i32.const 4
              i32.add
              i32.load
              local.tee 1
              i32.const -1
              i32.xor
              i32.const 7
              i32.shr_u
              local.get 1
              i32.const 6
              i32.shr_u
              i32.or
              i32.const 16843009
              i32.and
              local.get 0
              i32.load
              local.tee 1
              i32.const -1
              i32.xor
              i32.const 7
              i32.shr_u
              local.get 1
              i32.const 6
              i32.shr_u
              i32.or
              i32.const 16843009
              i32.and
              local.get 2
              i32.add
              i32.add
              i32.add
              i32.add
              local.set 2
              local.get 0
              i32.const 16
              i32.add
              local.tee 0
              local.get 8
              i32.ne
              br_if 0 (;@5;)
            end
          end
          local.get 3
          local.get 4
          i32.sub
          local.set 3
          local.get 6
          local.get 9
          i32.add
          local.set 0
          local.get 2
          i32.const 8
          i32.shr_u
          i32.const 16711935
          i32.and
          local.get 2
          i32.const 16711935
          i32.and
          i32.add
          i32.const 65537
          i32.mul
          i32.const 16
          i32.shr_u
          local.get 7
          i32.add
          local.set 7
          local.get 5
          i32.eqz
          br_if 0 (;@3;)
        end
        block ;; label = @3
          block ;; label = @4
            local.get 6
            br_if 0 (;@4;)
            i32.const 0
            local.set 2
            br 1 (;@3;)
          end
          local.get 6
          local.get 10
          i32.const 2
          i32.shl
          i32.add
          local.set 0
          local.get 5
          i32.const -1
          i32.add
          i32.const 1073741823
          i32.and
          local.tee 2
          i32.const 1
          i32.add
          local.tee 8
          i32.const 3
          i32.and
          local.set 1
          block ;; label = @4
            block ;; label = @5
              local.get 2
              i32.const 3
              i32.ge_u
              br_if 0 (;@5;)
              i32.const 0
              local.set 2
              br 1 (;@4;)
            end
            local.get 8
            i32.const 2147483644
            i32.and
            local.set 8
            i32.const 0
            local.set 2
            loop ;; label = @5
              local.get 0
              i32.const 12
              i32.add
              i32.load
              local.tee 3
              i32.const -1
              i32.xor
              i32.const 7
              i32.shr_u
              local.get 3
              i32.const 6
              i32.shr_u
              i32.or
              i32.const 16843009
              i32.and
              local.get 0
              i32.const 8
              i32.add
              i32.load
              local.tee 3
              i32.const -1
              i32.xor
              i32.const 7
              i32.shr_u
              local.get 3
              i32.const 6
              i32.shr_u
              i32.or
              i32.const 16843009
              i32.and
              local.get 0
              i32.const 4
              i32.add
              i32.load
              local.tee 3
              i32.const -1
              i32.xor
              i32.const 7
              i32.shr_u
              local.get 3
              i32.const 6
              i32.shr_u
              i32.or
              i32.const 16843009
              i32.and
              local.get 0
              i32.load
              local.tee 3
              i32.const -1
              i32.xor
              i32.const 7
              i32.shr_u
              local.get 3
              i32.const 6
              i32.shr_u
              i32.or
              i32.const 16843009
              i32.and
              local.get 2
              i32.add
              i32.add
              i32.add
              i32.add
              local.set 2
              local.get 0
              i32.const 16
              i32.add
              local.set 0
              local.get 8
              i32.const -4
              i32.add
              local.tee 8
              br_if 0 (;@5;)
            end
          end
          local.get 1
          i32.eqz
          br_if 0 (;@3;)
          loop ;; label = @4
            local.get 0
            i32.load
            local.tee 8
            i32.const -1
            i32.xor
            i32.const 7
            i32.shr_u
            local.get 8
            i32.const 6
            i32.shr_u
            i32.or
            i32.const 16843009
            i32.and
            local.get 2
            i32.add
            local.set 2
            local.get 0
            i32.const 4
            i32.add
            local.set 0
            local.get 1
            i32.const -1
            i32.add
            local.tee 1
            br_if 0 (;@4;)
          end
        end
        local.get 2
        i32.const 8
        i32.shr_u
        i32.const 16711935
        i32.and
        local.get 2
        i32.const 16711935
        i32.and
        i32.add
        i32.const 65537
        i32.mul
        i32.const 16
        i32.shr_u
        local.get 7
        i32.add
        return
      end
      block ;; label = @2
        local.get 1
        br_if 0 (;@2;)
        i32.const 0
        return
      end
      local.get 1
      i32.const 3
      i32.and
      local.set 2
      block ;; label = @2
        block ;; label = @3
          local.get 1
          i32.const -1
          i32.add
          i32.const 3
          i32.ge_u
          br_if 0 (;@3;)
          i32.const 0
          local.set 7
          br 1 (;@2;)
        end
        local.get 1
        i32.const -4
        i32.and
        local.set 1
        i32.const 0
        local.set 7
        loop ;; label = @3
          local.get 7
          local.get 0
          i32.load8_s
          i32.const -65
          i32.gt_s
          i32.add
          local.get 0
          i32.load8_s offset=1
          i32.const -65
          i32.gt_s
          i32.add
          local.get 0
          i32.load8_s offset=2
          i32.const -65
          i32.gt_s
          i32.add
          local.get 0
          i32.load8_s offset=3
          i32.const -65
          i32.gt_s
          i32.add
          local.set 7
          local.get 0
          i32.const 4
          i32.add
          local.set 0
          local.get 1
          i32.const -4
          i32.add
          local.tee 1
          br_if 0 (;@3;)
        end
      end
      local.get 2
      i32.eqz
      br_if 0 (;@1;)
      loop ;; label = @2
        local.get 7
        local.get 0
        i32.load8_s
        i32.const -65
        i32.gt_s
        i32.add
        local.set 7
        local.get 0
        i32.const 1
        i32.add
        local.set 0
        local.get 2
        i32.const -1
        i32.add
        local.tee 2
        br_if 0 (;@2;)
      end
    end
    local.get 7
  )
  (func $_ZN4core3fmt9Formatter12pad_integral12write_prefix17hf3cd6df73ed78638E (;302;) (type 14) (param i32 i32 i32 i32 i32) (result i32)
    (local i32)
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          local.get 2
          i32.const 1114112
          i32.eq
          br_if 0 (;@3;)
          i32.const 1
          local.set 5
          local.get 0
          local.get 2
          local.get 1
          i32.load offset=16
          call_indirect (type 5)
          br_if 1 (;@2;)
        end
        local.get 3
        br_if 1 (;@1;)
        i32.const 0
        local.set 5
      end
      local.get 5
      return
    end
    local.get 0
    local.get 3
    local.get 4
    local.get 1
    i32.load offset=12
    call_indirect (type 4)
  )
  (func $_ZN4core3fmt9Formatter9write_str17h556030d2063bd0caE (;303;) (type 4) (param i32 i32 i32) (result i32)
    local.get 0
    i32.load
    local.get 1
    local.get 2
    local.get 0
    i32.load offset=4
    i32.load offset=12
    call_indirect (type 4)
  )
  (func $_ZN4core3fmt9Formatter9write_fmt17hdae39eebc223cfffE (;304;) (type 5) (param i32 i32) (result i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 0
    i32.load offset=4
    local.set 3
    local.get 0
    i32.load
    local.set 0
    local.get 2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get 2
    local.get 1
    i64.load align=4
    i64.store offset=8
    local.get 0
    local.get 3
    local.get 2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17h7558535140974479E
    local.set 1
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN4core3fmt9Formatter15debug_lower_hex17hb31a3ef71c81bc79E (;305;) (type 9) (param i32) (result i32)
    local.get 0
    i32.load8_u offset=24
    i32.const 16
    i32.and
    i32.const 4
    i32.shr_u
  )
  (func $_ZN4core3fmt9Formatter15debug_upper_hex17h505100e6817602a1E (;306;) (type 9) (param i32) (result i32)
    local.get 0
    i32.load8_u offset=24
    i32.const 32
    i32.and
    i32.const 5
    i32.shr_u
  )
  (func $_ZN4core3fmt9Formatter26debug_struct_field2_finish17h1a23e737736fcb8fE (;307;) (type 16) (param i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 11
    global.set $__stack_pointer
    local.get 0
    i32.load
    local.get 1
    local.get 2
    local.get 0
    i32.load offset=4
    i32.load offset=12
    call_indirect (type 4)
    local.set 2
    local.get 11
    i32.const 0
    i32.store8 offset=13
    local.get 11
    local.get 2
    i32.store8 offset=12
    local.get 11
    local.get 0
    i32.store offset=8
    local.get 11
    i32.const 8
    i32.add
    local.get 3
    local.get 4
    local.get 5
    local.get 6
    call $_ZN4core3fmt8builders11DebugStruct5field17h39e991b766bcf568E
    local.get 7
    local.get 8
    local.get 9
    local.get 10
    call $_ZN4core3fmt8builders11DebugStruct5field17h39e991b766bcf568E
    local.set 2
    local.get 11
    i32.load8_u offset=12
    local.set 0
    block ;; label = @1
      local.get 11
      i32.load8_u offset=13
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.const 255
      i32.and
      local.set 1
      i32.const 1
      local.set 0
      local.get 1
      br_if 0 (;@1;)
      block ;; label = @2
        local.get 2
        i32.load
        local.tee 0
        i32.load8_u offset=24
        i32.const 4
        i32.and
        br_if 0 (;@2;)
        local.get 0
        i32.load
        i32.const 1053951
        i32.const 2
        local.get 0
        i32.load offset=4
        i32.load offset=12
        call_indirect (type 4)
        local.set 0
        br 1 (;@1;)
      end
      local.get 0
      i32.load
      i32.const 1053950
      i32.const 1
      local.get 0
      i32.load offset=4
      i32.load offset=12
      call_indirect (type 4)
      local.set 0
    end
    local.get 11
    i32.const 16
    i32.add
    global.set $__stack_pointer
    local.get 0
    i32.const 255
    i32.and
    i32.const 0
    i32.ne
  )
  (func $_ZN4core3fmt9Formatter10debug_list17h7652738c8548c588E (;308;) (type 3) (param i32 i32)
    (local i32)
    local.get 1
    i32.load
    i32.const 1053677
    i32.const 1
    local.get 1
    i32.load offset=4
    i32.load offset=12
    call_indirect (type 4)
    local.set 2
    local.get 0
    i32.const 0
    i32.store8 offset=5
    local.get 0
    local.get 2
    i32.store8 offset=4
    local.get 0
    local.get 1
    i32.store
  )
  (func $_ZN43_$LT$bool$u20$as$u20$core..fmt..Display$GT$3fmt17h3687ae6db1632d84E (;309;) (type 5) (param i32 i32) (result i32)
    block ;; label = @1
      local.get 0
      i32.load8_u
      br_if 0 (;@1;)
      local.get 1
      i32.const 1054252
      i32.const 5
      call $_ZN4core3fmt9Formatter3pad17hee1e19a8df95bdd9E
      return
    end
    local.get 1
    i32.const 1054248
    i32.const 4
    call $_ZN4core3fmt9Formatter3pad17hee1e19a8df95bdd9E
  )
  (func $_ZN42_$LT$str$u20$as$u20$core..fmt..Display$GT$3fmt17hcd33a3726c86db1aE (;310;) (type 4) (param i32 i32 i32) (result i32)
    local.get 2
    local.get 0
    local.get 1
    call $_ZN4core3fmt9Formatter3pad17hee1e19a8df95bdd9E
  )
  (func $_ZN4core5slice5index29slice_start_index_len_fail_rt17h746adbf30693da97E (;311;) (type 2) (param i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 0
    i32.store
    local.get 3
    i32.const 8
    i32.add
    i32.const 12
    i32.add
    i32.const 2
    i32.store
    local.get 3
    i32.const 28
    i32.add
    i32.const 2
    i32.store
    local.get 3
    i32.const 32
    i32.add
    i32.const 12
    i32.add
    i32.const 7
    i32.store
    local.get 3
    i32.const 1054360
    i32.store offset=16
    local.get 3
    i32.const 0
    i32.store offset=8
    local.get 3
    i32.const 7
    i32.store offset=36
    local.get 3
    local.get 3
    i32.const 32
    i32.add
    i32.store offset=24
    local.get 3
    local.get 3
    i32.const 4
    i32.add
    i32.store offset=40
    local.get 3
    local.get 3
    i32.store offset=32
    local.get 3
    i32.const 8
    i32.add
    local.get 2
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN4core5slice5index27slice_end_index_len_fail_rt17h17bee9c953ba49cfE (;312;) (type 2) (param i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 0
    i32.store
    local.get 3
    i32.const 8
    i32.add
    i32.const 12
    i32.add
    i32.const 2
    i32.store
    local.get 3
    i32.const 28
    i32.add
    i32.const 2
    i32.store
    local.get 3
    i32.const 32
    i32.add
    i32.const 12
    i32.add
    i32.const 7
    i32.store
    local.get 3
    i32.const 1054392
    i32.store offset=16
    local.get 3
    i32.const 0
    i32.store offset=8
    local.get 3
    i32.const 7
    i32.store offset=36
    local.get 3
    local.get 3
    i32.const 32
    i32.add
    i32.store offset=24
    local.get 3
    local.get 3
    i32.const 4
    i32.add
    i32.store offset=40
    local.get 3
    local.get 3
    i32.store offset=32
    local.get 3
    i32.const 8
    i32.add
    local.get 2
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN4core5slice5index25slice_index_order_fail_rt17hf9b218a3e9a3735eE (;313;) (type 2) (param i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    local.get 3
    local.get 1
    i32.store offset=4
    local.get 3
    local.get 0
    i32.store
    local.get 3
    i32.const 8
    i32.add
    i32.const 12
    i32.add
    i32.const 2
    i32.store
    local.get 3
    i32.const 28
    i32.add
    i32.const 2
    i32.store
    local.get 3
    i32.const 32
    i32.add
    i32.const 12
    i32.add
    i32.const 7
    i32.store
    local.get 3
    i32.const 1054444
    i32.store offset=16
    local.get 3
    i32.const 0
    i32.store offset=8
    local.get 3
    i32.const 7
    i32.store offset=36
    local.get 3
    local.get 3
    i32.const 32
    i32.add
    i32.store offset=24
    local.get 3
    local.get 3
    i32.const 4
    i32.add
    i32.store offset=40
    local.get 3
    local.get 3
    i32.store offset=32
    local.get 3
    i32.const 8
    i32.add
    local.get 2
    call $_ZN4core9panicking9panic_fmt17hf4ce15c1b219b988E
    unreachable
  )
  (func $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..UpperHex$u20$for$u20$i8$GT$3fmt17h69613a8b6ac90b9dE (;314;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 128
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 0
    i32.load8_u
    local.set 3
    i32.const 0
    local.set 0
    loop ;; label = @1
      local.get 2
      local.get 0
      i32.add
      i32.const 127
      i32.add
      i32.const 48
      i32.const 55
      local.get 3
      i32.const 15
      i32.and
      local.tee 4
      i32.const 10
      i32.lt_u
      select
      local.get 4
      i32.add
      i32.store8
      local.get 0
      i32.const -1
      i32.add
      local.set 0
      local.get 3
      i32.const 255
      i32.and
      local.tee 4
      i32.const 4
      i32.shr_u
      local.set 3
      local.get 4
      i32.const 15
      i32.gt_u
      br_if 0 (;@1;)
    end
    block ;; label = @1
      local.get 0
      i32.const 128
      i32.add
      local.tee 3
      i32.const 129
      i32.lt_u
      br_if 0 (;@1;)
      local.get 3
      i32.const 128
      i32.const 1054004
      call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
      unreachable
    end
    local.get 1
    i32.const 1
    i32.const 1054020
    i32.const 2
    local.get 2
    local.get 0
    i32.add
    i32.const 128
    i32.add
    i32.const 0
    local.get 0
    i32.sub
    call $_ZN4core3fmt9Formatter12pad_integral17hcc3b56246532f1b4E
    local.set 0
    local.get 2
    i32.const 128
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN4core3fmt3num53_$LT$impl$u20$core..fmt..LowerHex$u20$for$u20$i32$GT$3fmt17h9059b66bffaf1ac2E (;315;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 128
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 0
    i32.load
    local.set 0
    i32.const 0
    local.set 3
    loop ;; label = @1
      local.get 2
      local.get 3
      i32.add
      i32.const 127
      i32.add
      i32.const 48
      i32.const 87
      local.get 0
      i32.const 15
      i32.and
      local.tee 4
      i32.const 10
      i32.lt_u
      select
      local.get 4
      i32.add
      i32.store8
      local.get 3
      i32.const -1
      i32.add
      local.set 3
      local.get 0
      i32.const 15
      i32.gt_u
      local.set 4
      local.get 0
      i32.const 4
      i32.shr_u
      local.set 0
      local.get 4
      br_if 0 (;@1;)
    end
    block ;; label = @1
      local.get 3
      i32.const 128
      i32.add
      local.tee 0
      i32.const 129
      i32.lt_u
      br_if 0 (;@1;)
      local.get 0
      i32.const 128
      i32.const 1054004
      call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
      unreachable
    end
    local.get 1
    i32.const 1
    i32.const 1054020
    i32.const 2
    local.get 2
    local.get 3
    i32.add
    i32.const 128
    i32.add
    i32.const 0
    local.get 3
    i32.sub
    call $_ZN4core3fmt9Formatter12pad_integral17hcc3b56246532f1b4E
    local.set 0
    local.get 2
    i32.const 128
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..LowerHex$u20$for$u20$i8$GT$3fmt17h6a1f1804261a5d78E (;316;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 128
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 0
    i32.load8_u
    local.set 3
    i32.const 0
    local.set 0
    loop ;; label = @1
      local.get 2
      local.get 0
      i32.add
      i32.const 127
      i32.add
      i32.const 48
      i32.const 87
      local.get 3
      i32.const 15
      i32.and
      local.tee 4
      i32.const 10
      i32.lt_u
      select
      local.get 4
      i32.add
      i32.store8
      local.get 0
      i32.const -1
      i32.add
      local.set 0
      local.get 3
      i32.const 255
      i32.and
      local.tee 4
      i32.const 4
      i32.shr_u
      local.set 3
      local.get 4
      i32.const 15
      i32.gt_u
      br_if 0 (;@1;)
    end
    block ;; label = @1
      local.get 0
      i32.const 128
      i32.add
      local.tee 3
      i32.const 129
      i32.lt_u
      br_if 0 (;@1;)
      local.get 3
      i32.const 128
      i32.const 1054004
      call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
      unreachable
    end
    local.get 1
    i32.const 1
    i32.const 1054020
    i32.const 2
    local.get 2
    local.get 0
    i32.add
    i32.const 128
    i32.add
    i32.const 0
    local.get 0
    i32.sub
    call $_ZN4core3fmt9Formatter12pad_integral17hcc3b56246532f1b4E
    local.set 0
    local.get 2
    i32.const 128
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN4core3fmt3num49_$LT$impl$u20$core..fmt..Debug$u20$for$u20$u8$GT$3fmt17hb4bc95fb14892f6aE (;317;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 128
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              local.get 1
              i32.load offset=24
              local.tee 3
              i32.const 16
              i32.and
              br_if 0 (;@5;)
              local.get 3
              i32.const 32
              i32.and
              br_if 1 (;@4;)
              local.get 0
              i64.load8_u
              i32.const 1
              local.get 1
              call $_ZN4core3fmt3num3imp7fmt_u6417hf4eec24457ffc084E
              local.set 0
              br 4 (;@1;)
            end
            local.get 0
            i32.load8_u
            local.set 3
            i32.const 0
            local.set 0
            loop ;; label = @5
              local.get 2
              local.get 0
              i32.add
              i32.const 127
              i32.add
              i32.const 48
              i32.const 87
              local.get 3
              i32.const 15
              i32.and
              local.tee 4
              i32.const 10
              i32.lt_u
              select
              local.get 4
              i32.add
              i32.store8
              local.get 0
              i32.const -1
              i32.add
              local.set 0
              local.get 3
              i32.const 255
              i32.and
              local.tee 4
              i32.const 4
              i32.shr_u
              local.set 3
              local.get 4
              i32.const 15
              i32.gt_u
              br_if 0 (;@5;)
            end
            local.get 0
            i32.const 128
            i32.add
            local.tee 3
            i32.const 129
            i32.ge_u
            br_if 1 (;@3;)
            local.get 1
            i32.const 1
            i32.const 1054020
            i32.const 2
            local.get 2
            local.get 0
            i32.add
            i32.const 128
            i32.add
            i32.const 0
            local.get 0
            i32.sub
            call $_ZN4core3fmt9Formatter12pad_integral17hcc3b56246532f1b4E
            local.set 0
            br 3 (;@1;)
          end
          local.get 0
          i32.load8_u
          local.set 3
          i32.const 0
          local.set 0
          loop ;; label = @4
            local.get 2
            local.get 0
            i32.add
            i32.const 127
            i32.add
            i32.const 48
            i32.const 55
            local.get 3
            i32.const 15
            i32.and
            local.tee 4
            i32.const 10
            i32.lt_u
            select
            local.get 4
            i32.add
            i32.store8
            local.get 0
            i32.const -1
            i32.add
            local.set 0
            local.get 3
            i32.const 255
            i32.and
            local.tee 4
            i32.const 4
            i32.shr_u
            local.set 3
            local.get 4
            i32.const 15
            i32.gt_u
            br_if 0 (;@4;)
          end
          local.get 0
          i32.const 128
          i32.add
          local.tee 3
          i32.const 129
          i32.ge_u
          br_if 1 (;@2;)
          local.get 1
          i32.const 1
          i32.const 1054020
          i32.const 2
          local.get 2
          local.get 0
          i32.add
          i32.const 128
          i32.add
          i32.const 0
          local.get 0
          i32.sub
          call $_ZN4core3fmt9Formatter12pad_integral17hcc3b56246532f1b4E
          local.set 0
          br 2 (;@1;)
        end
        local.get 3
        i32.const 128
        i32.const 1054004
        call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
        unreachable
      end
      local.get 3
      i32.const 128
      i32.const 1054004
      call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
      unreachable
    end
    local.get 2
    i32.const 128
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN4core3fmt3num3imp7fmt_u6417hf4eec24457ffc084E (;318;) (type 17) (param i64 i32 i32) (result i32)
    (local i32 i32 i64 i32 i32 i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    i32.const 39
    local.set 4
    block ;; label = @1
      block ;; label = @2
        local.get 0
        i64.const 10000
        i64.ge_u
        br_if 0 (;@2;)
        local.get 0
        local.set 5
        br 1 (;@1;)
      end
      i32.const 39
      local.set 4
      loop ;; label = @2
        local.get 3
        i32.const 9
        i32.add
        local.get 4
        i32.add
        local.tee 6
        i32.const -4
        i32.add
        local.get 0
        local.get 0
        i64.const 10000
        i64.div_u
        local.tee 5
        i64.const 10000
        i64.mul
        i64.sub
        i32.wrap_i64
        local.tee 7
        i32.const 65535
        i32.and
        i32.const 100
        i32.div_u
        local.tee 8
        i32.const 1
        i32.shl
        i32.const 1054022
        i32.add
        i32.load16_u align=1
        i32.store16 align=1
        local.get 6
        i32.const -2
        i32.add
        local.get 7
        local.get 8
        i32.const 100
        i32.mul
        i32.sub
        i32.const 65535
        i32.and
        i32.const 1
        i32.shl
        i32.const 1054022
        i32.add
        i32.load16_u align=1
        i32.store16 align=1
        local.get 4
        i32.const -4
        i32.add
        local.set 4
        local.get 0
        i64.const 99999999
        i64.gt_u
        local.set 6
        local.get 5
        local.set 0
        local.get 6
        br_if 0 (;@2;)
      end
    end
    block ;; label = @1
      local.get 5
      i32.wrap_i64
      local.tee 6
      i32.const 99
      i32.le_u
      br_if 0 (;@1;)
      local.get 3
      i32.const 9
      i32.add
      local.get 4
      i32.const -2
      i32.add
      local.tee 4
      i32.add
      local.get 5
      i32.wrap_i64
      local.tee 6
      local.get 6
      i32.const 65535
      i32.and
      i32.const 100
      i32.div_u
      local.tee 6
      i32.const 100
      i32.mul
      i32.sub
      i32.const 65535
      i32.and
      i32.const 1
      i32.shl
      i32.const 1054022
      i32.add
      i32.load16_u align=1
      i32.store16 align=1
    end
    block ;; label = @1
      block ;; label = @2
        local.get 6
        i32.const 10
        i32.lt_u
        br_if 0 (;@2;)
        local.get 3
        i32.const 9
        i32.add
        local.get 4
        i32.const -2
        i32.add
        local.tee 4
        i32.add
        local.get 6
        i32.const 1
        i32.shl
        i32.const 1054022
        i32.add
        i32.load16_u align=1
        i32.store16 align=1
        br 1 (;@1;)
      end
      local.get 3
      i32.const 9
      i32.add
      local.get 4
      i32.const -1
      i32.add
      local.tee 4
      i32.add
      local.get 6
      i32.const 48
      i32.add
      i32.store8
    end
    local.get 2
    local.get 1
    i32.const 1053592
    i32.const 0
    local.get 3
    i32.const 9
    i32.add
    local.get 4
    i32.add
    i32.const 39
    local.get 4
    i32.sub
    call $_ZN4core3fmt9Formatter12pad_integral17hcc3b56246532f1b4E
    local.set 4
    local.get 3
    i32.const 48
    i32.add
    global.set $__stack_pointer
    local.get 4
  )
  (func $_ZN4core3fmt3num53_$LT$impl$u20$core..fmt..UpperHex$u20$for$u20$i32$GT$3fmt17h80cdb4a5bd8baacaE (;319;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 128
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 0
    i32.load
    local.set 0
    i32.const 0
    local.set 3
    loop ;; label = @1
      local.get 2
      local.get 3
      i32.add
      i32.const 127
      i32.add
      i32.const 48
      i32.const 55
      local.get 0
      i32.const 15
      i32.and
      local.tee 4
      i32.const 10
      i32.lt_u
      select
      local.get 4
      i32.add
      i32.store8
      local.get 3
      i32.const -1
      i32.add
      local.set 3
      local.get 0
      i32.const 15
      i32.gt_u
      local.set 4
      local.get 0
      i32.const 4
      i32.shr_u
      local.set 0
      local.get 4
      br_if 0 (;@1;)
    end
    block ;; label = @1
      local.get 3
      i32.const 128
      i32.add
      local.tee 0
      i32.const 129
      i32.lt_u
      br_if 0 (;@1;)
      local.get 0
      i32.const 128
      i32.const 1054004
      call $_ZN4core5slice5index26slice_start_index_len_fail17h4b6807d169d5a5ccE
      unreachable
    end
    local.get 1
    i32.const 1
    i32.const 1054020
    i32.const 2
    local.get 2
    local.get 3
    i32.add
    i32.const 128
    i32.add
    i32.const 0
    local.get 3
    i32.sub
    call $_ZN4core3fmt9Formatter12pad_integral17hcc3b56246532f1b4E
    local.set 0
    local.get 2
    i32.const 128
    i32.add
    global.set $__stack_pointer
    local.get 0
  )
  (func $_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$i32$GT$3fmt17hc0b612d33a62afb1E (;320;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i32.load
    local.tee 0
    i64.extend_i32_u
    i64.const 0
    local.get 0
    i64.extend_i32_s
    i64.sub
    local.get 0
    i32.const -1
    i32.gt_s
    local.tee 0
    select
    local.get 0
    local.get 1
    call $_ZN4core3fmt3num3imp7fmt_u6417hf4eec24457ffc084E
  )
  (func $_ZN53_$LT$core..fmt..Error$u20$as$u20$core..fmt..Debug$GT$3fmt17hc14235e2ce17a7e9E (;321;) (type 5) (param i32 i32) (result i32)
    local.get 1
    i32.load
    i32.const 1054740
    i32.const 5
    local.get 1
    i32.load offset=4
    i32.load offset=12
    call_indirect (type 4)
  )
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17haf8cfddece906a05E (;322;) (type 5) (param i32 i32) (result i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 0
        i32.load
        local.tee 3
        i32.load8_u
        br_if 0 (;@2;)
        local.get 1
        i32.load
        i32.const 1054720
        i32.const 4
        local.get 1
        i32.load offset=4
        i32.load offset=12
        call_indirect (type 4)
        local.set 1
        br 1 (;@1;)
      end
      i32.const 1
      local.set 0
      local.get 2
      local.get 3
      i32.const 1
      i32.add
      i32.store offset=12
      local.get 2
      local.get 1
      i32.load
      i32.const 1054716
      i32.const 4
      local.get 1
      i32.load offset=4
      i32.load offset=12
      call_indirect (type 4)
      i32.store8 offset=24
      local.get 2
      local.get 1
      i32.store offset=20
      local.get 2
      i32.const 0
      i32.store8 offset=25
      local.get 2
      i32.const 0
      i32.store offset=16
      local.get 2
      i32.const 16
      i32.add
      local.get 2
      i32.const 12
      i32.add
      i32.const 1053960
      call $_ZN4core3fmt8builders10DebugTuple5field17h0996cc37bba625e1E
      local.set 1
      local.get 2
      i32.load8_u offset=24
      local.set 3
      block ;; label = @2
        block ;; label = @3
          local.get 1
          i32.load
          local.tee 1
          br_if 0 (;@3;)
          local.get 3
          local.set 0
          br 1 (;@2;)
        end
        local.get 3
        i32.const 255
        i32.and
        br_if 0 (;@2;)
        local.get 2
        i32.load offset=20
        local.set 3
        block ;; label = @3
          local.get 1
          i32.const 1
          i32.ne
          br_if 0 (;@3;)
          local.get 2
          i32.load8_u offset=25
          i32.const 255
          i32.and
          i32.eqz
          br_if 0 (;@3;)
          local.get 3
          i32.load8_u offset=24
          i32.const 4
          i32.and
          br_if 0 (;@3;)
          i32.const 1
          local.set 0
          local.get 3
          i32.load
          i32.const 1053956
          i32.const 1
          local.get 3
          i32.load offset=4
          i32.load offset=12
          call_indirect (type 4)
          br_if 1 (;@2;)
        end
        local.get 3
        i32.load
        i32.const 1053592
        i32.const 1
        local.get 3
        i32.load offset=4
        i32.load offset=12
        call_indirect (type 4)
        local.set 0
      end
      local.get 0
      i32.const 255
      i32.and
      i32.const 0
      i32.ne
      local.set 1
    end
    local.get 2
    i32.const 32
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17hb95bb275f973c6daE (;323;) (type 5) (param i32 i32) (result i32)
    local.get 0
    i32.load
    local.get 1
    call $_ZN4core3fmt3num49_$LT$impl$u20$core..fmt..Debug$u20$for$u20$u8$GT$3fmt17hb4bc95fb14892f6aE
  )
  (func $_ZN64_$LT$core..str..error..Utf8Error$u20$as$u20$core..fmt..Debug$GT$3fmt17hda1fa3de94f6c9d3E (;324;) (type 5) (param i32 i32) (result i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    local.get 2
    local.get 0
    i32.const 4
    i32.add
    i32.store offset=4
    local.get 1
    i32.load
    i32.const 1054745
    i32.const 9
    local.get 1
    i32.load offset=4
    i32.load offset=12
    call_indirect (type 4)
    local.set 3
    local.get 2
    i32.const 0
    i32.store8 offset=13
    local.get 2
    local.get 3
    i32.store8 offset=12
    local.get 2
    local.get 1
    i32.store offset=8
    local.get 2
    i32.const 8
    i32.add
    i32.const 1054754
    i32.const 11
    local.get 0
    i32.const 1054724
    call $_ZN4core3fmt8builders11DebugStruct5field17h39e991b766bcf568E
    i32.const 1054765
    i32.const 9
    local.get 2
    i32.const 4
    i32.add
    i32.const 1054776
    call $_ZN4core3fmt8builders11DebugStruct5field17h39e991b766bcf568E
    local.set 0
    local.get 2
    i32.load8_u offset=12
    local.set 1
    block ;; label = @1
      local.get 2
      i32.load8_u offset=13
      i32.eqz
      br_if 0 (;@1;)
      local.get 1
      i32.const 255
      i32.and
      local.set 3
      i32.const 1
      local.set 1
      local.get 3
      br_if 0 (;@1;)
      block ;; label = @2
        local.get 0
        i32.load
        local.tee 1
        i32.load8_u offset=24
        i32.const 4
        i32.and
        br_if 0 (;@2;)
        local.get 1
        i32.load
        i32.const 1053951
        i32.const 2
        local.get 1
        i32.load offset=4
        i32.load offset=12
        call_indirect (type 4)
        local.set 1
        br 1 (;@1;)
      end
      local.get 1
      i32.load
      i32.const 1053950
      i32.const 1
      local.get 1
      i32.load offset=4
      i32.load offset=12
      call_indirect (type 4)
      local.set 1
    end
    local.get 2
    i32.const 16
    i32.add
    global.set $__stack_pointer
    local.get 1
    i32.const 255
    i32.and
    i32.const 0
    i32.ne
  )
  (func $_ZN69_$LT$core..alloc..layout..LayoutError$u20$as$u20$core..fmt..Debug$GT$3fmt17h52f211bc771dfb44E (;325;) (type 5) (param i32 i32) (result i32)
    local.get 1
    i32.load
    i32.const 1054792
    i32.const 11
    local.get 1
    i32.load offset=4
    i32.load offset=12
    call_indirect (type 4)
  )
  (table (;0;) 84 84 funcref)
  (memory (;0;) 17 32768 shared)
  (global $__stack_pointer (;0;) (mut i32) i32.const 1048576)
  (export "memory" (memory 0))
  (export "hello" (func $hello))
  (export "cabi_post_hello" (func $cabi_post_hello))
  (export "uuid" (func $uuid))
  (export "cabi_post_uuid" (func $cabi_post_uuid))
  (export "cabi_realloc" (func $cabi_realloc))
  (elem (;0;) (i32.const 1) func $_ZN60_$LT$alloc..string..String$u20$as$u20$core..fmt..Display$GT$3fmt17h5a9196d4d980ba2bE $_ZN4uuid3fmt59_$LT$impl$u20$core..fmt..Display$u20$for$u20$uuid..Uuid$GT$3fmt17hdefb8f3088fb574dE $_ZN4core3ptr49drop_in_place$LT$alloc..string..FromUtf8Error$GT$17h46c70c0eaaaf171bE $_ZN65_$LT$alloc..string..FromUtf8Error$u20$as$u20$core..fmt..Debug$GT$3fmt17h77ef681ab7fb9f89E $_ZN62_$LT$getrandom..error..Error$u20$as$u20$core..fmt..Display$GT$3fmt17hdccdbaf0f53358fbE $_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$i32$GT$3fmt17hc0b612d33a62afb1E $_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$u32$GT$3fmt17hca64045c3402134cE $_ZN4core3ptr30drop_in_place$LT$$RF$usize$GT$17haf5756b469e6b041E $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h76ab5160729e5d61E $_ZN91_$LT$std..sys_common..backtrace.._print..DisplayBacktrace$u20$as$u20$core..fmt..Display$GT$3fmt17h6e8846cac7369070E $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17h9f91f4a02f7722e6E $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17h553f113e10db4e4dE $_ZN73_$LT$core..panic..panic_info..PanicInfo$u20$as$u20$core..fmt..Display$GT$3fmt17h66e4e62ff3323c23E $_ZN59_$LT$core..fmt..Arguments$u20$as$u20$core..fmt..Display$GT$3fmt17h6ae0c0f6e4b417fcE $_ZN3std5alloc24default_alloc_error_hook17h1faf522cf81e449fE $_ZN4core3ptr100drop_in_place$LT$$RF$mut$u20$std..io..Write..write_fmt..Adapter$LT$alloc..vec..Vec$LT$u8$GT$$GT$$GT$17hde21ae438dab7501E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h303b0dcaf54ff4d5E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17hd9f4a6d08a482859E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17ha2835ff278cbfecbE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17hd4e24d7828055adbE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h97dcd5289d066230E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17h19a1acee2e3fe47bE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h92bdbb051fdd6c01E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h488f14e19ec7ceafE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17h4ab582e0a50bf665E $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17had3a23ed2b0f9a78E $_ZN63_$LT$core..cell..BorrowMutError$u20$as$u20$core..fmt..Debug$GT$3fmt17h145bcc23e1a12888E $_ZN4core3ptr88drop_in_place$LT$std..io..Write..write_fmt..Adapter$LT$alloc..vec..Vec$LT$u8$GT$$GT$$GT$17hf78d30d59fb86c0dE $_ZN80_$LT$std..io..Write..write_fmt..Adapter$LT$T$GT$$u20$as$u20$core..fmt..Write$GT$9write_str17hc76d2b6fa3488422E $_ZN4core3fmt5Write10write_char17haa46f9e30bca77f3E $_ZN4core3fmt5Write9write_fmt17he26b07feb918eff5E $_ZN80_$LT$std..io..Write..write_fmt..Adapter$LT$T$GT$$u20$as$u20$core..fmt..Write$GT$9write_str17h1468756d66c20292E $_ZN4core3fmt5Write10write_char17hb36c4fc26ddebae1E $_ZN4core3fmt5Write9write_fmt17hadcd24a979fa7d5dE $_ZN64_$LT$std..sys..wasi..stdio..Stderr$u20$as$u20$std..io..Write$GT$5write17he47e049b369162fdE $_ZN64_$LT$std..sys..wasi..stdio..Stderr$u20$as$u20$std..io..Write$GT$14write_vectored17h7464986e1d313f43E $_ZN64_$LT$std..sys..wasi..stdio..Stderr$u20$as$u20$std..io..Write$GT$17is_write_vectored17h3220da0d279580c7E $_ZN64_$LT$std..sys..wasi..stdio..Stderr$u20$as$u20$std..io..Write$GT$5flush17hb4fd558eb40a0fc2E $_ZN3std2io5Write9write_all17h544eaae0cf5cf6cdE $_ZN3std2io5Write18write_all_vectored17h4a3f8eead6bfe2c3E $_ZN3std2io5Write9write_fmt17hba5fcb56a4c5cebaE $_ZN4core3ptr205drop_in_place$LT$$LT$alloc..boxed..Box$LT$dyn$u20$core..error..Error$u2b$core..marker..Send$u2b$core..marker..Sync$GT$$u20$as$u20$core..convert..From$LT$alloc..string..String$GT$$GT$..from..StringError$GT$17h6486a4eecfa8ec50E $_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$5write17h31125b29efb4f619E $_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$14write_vectored17he20320b606539ce1E $_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$17is_write_vectored17hc7b9f7c56ce6f0ceE $_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$5flush17h63afd92b838412a5E $_ZN3std2io5impls74_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..vec..Vec$LT$u8$C$A$GT$$GT$9write_all17h30621f068535731eE $_ZN3std2io5Write18write_all_vectored17h7d2f89f47ec58282E $_ZN3std2io5Write9write_fmt17h80e619ee06f416f6E $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17hbcf83b65e788092eE $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17hcff55bed44912628E $_ZN4core3ptr70drop_in_place$LT$core..option..Option$LT$alloc..string..String$GT$$GT$17h6743b4145838f5adE $_ZN90_$LT$std..panicking..begin_panic_handler..PanicPayload$u20$as$u20$core..panic..BoxMeUp$GT$8take_box17h0fa45657b266d809E $_ZN90_$LT$std..panicking..begin_panic_handler..PanicPayload$u20$as$u20$core..panic..BoxMeUp$GT$3get17h9ce6f22ca87c10fcE $_ZN93_$LT$std..panicking..begin_panic_handler..StrPanicPayload$u20$as$u20$core..panic..BoxMeUp$GT$8take_box17h61beb27f3cc94c1dE $_ZN93_$LT$std..panicking..begin_panic_handler..StrPanicPayload$u20$as$u20$core..panic..BoxMeUp$GT$3get17h4b420efd9f0fe8bdE $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17h176cc91ce5e817f1E $_ZN4core3ptr26drop_in_place$LT$usize$GT$17h2a7616625bccfaeaE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h6629847a357efb7bE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h2ab492e6e3089d90E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17hc6000768d61b104eE $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17hbcb65dd130a93744E $_ZN53_$LT$core..fmt..Error$u20$as$u20$core..fmt..Debug$GT$3fmt17hc14235e2ce17a7e9E $_ZN69_$LT$core..alloc..layout..LayoutError$u20$as$u20$core..fmt..Debug$GT$3fmt17h52f211bc771dfb44E $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17ha27aad768d805012E $_ZN4core3ptr205drop_in_place$LT$$LT$alloc..boxed..Box$LT$dyn$u20$core..error..Error$u2b$core..marker..Send$u2b$core..marker..Sync$GT$$u20$as$u20$core..convert..From$LT$alloc..string..String$GT$$GT$..from..StringError$GT$17hab57644d530a4320E $_ZN65_$LT$alloc..vec..Vec$LT$T$C$A$GT$$u20$as$u20$core..fmt..Debug$GT$3fmt17hb02f47fd02abae94E $_ZN4core3ops8function6FnOnce9call_once17h2709ecd011efc890E $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h20f7957e80c7e530E $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17hd168602520dd2091E $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17h4292964f1c9daeffE $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17he9a145660f417571E $_ZN4core3ptr102drop_in_place$LT$$RF$core..iter..adapters..copied..Copied$LT$core..slice..iter..Iter$LT$u8$GT$$GT$$GT$17h4850089a660ee085E $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17hb25fc4480d8905d3E $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h37d46f421ca2b081E $_ZN4core3fmt5Write10write_char17hf19f273a49a82ceaE $_ZN4core3fmt5Write9write_fmt17hd3cc343066351280E $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17hb95bb275f973c6daE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h955563679bd7795bE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h301275e729a36d98E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17h9a8c87329b057ce1E $_ZN4core3fmt3num50_$LT$impl$u20$core..fmt..Debug$u20$for$u20$u32$GT$3fmt17hd969844fd9888156E $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17haf8cfddece906a05E)
  (data (;0;) (i32.const 1048576) "invalid args\00\00\10\00\0c\00\00\00/rustc/84c898d65adf2f39a5a98507f1fe0ce10a2b8dbc/library/core/src/fmt/mod.rs\00\14\00\10\00K\00\00\00\93\01\00\00\0d\00\00\00/rustc/84c898d65adf2f39a5a98507f1fe0ce10a2b8dbc/library/core/src/alloc/layout.rsp\00\10\00P\00\00\00\c4\01\00\00)\00\00\00attempt to divide by zeroHello !\e9\00\10\00\06\00\00\00\ef\00\10\00\01\00\00\00\00\01\10\00\00\00\00\00Tried to shrink to a larger capacity\08\01\10\00$\00\00\00/rustc/84c898d65adf2f39a5a98507f1fe0ce10a2b8dbc/library/alloc/src/raw_vec.rs4\01\10\00L\00\00\00\af\01\00\00\09\00\00\00/Users/tryggvil/Development/netapp/wasm/wasm-env/apps/wasi-reactor/target/bindings/wasi-reactor/src/lib.rs\00\00\90\01\10\00j\00\00\00\22\00\00\00P\00\00\00\90\01\10\00j\00\00\00*\00\00\00\07\00\00\00\00\00\00\00attempt to add with overflow\90\01\10\00j\00\00\00+\00\00\00\07\00\00\00\90\01\10\00j\00\00\00Y\00\00\00\0b\00\00\00\90\01\10\00j\00\00\00Z\00\00\00\0c\00\00\00\90\01\10\00j\00\00\002\00\00\00\0b\00\00\00\90\01\10\00j\00\00\003\00\00\00\0c\00\00\00\90\01\10\00j\00\00\00Q\00\00\00\07\00\00\00\90\01\10\00j\00\00\00R\00\00\00\07\00\00\00called `Result::unwrap()` on an `Err` value\00\03\00\00\00\14\00\00\00\04\00\00\00\04\00\00\000123456789ABCDEF0123456789abcdef/Users/tryggvil/.cargo/registry/src/github.com-1ecc6299db9ec823/uuid-1.3.3/src/fmt.rs\00\00\00attempt to add with overflow\00\00\00\00\08\00\00\00\09\00\00\00\0d\00\00\00\0e\00\00\00\12\00\00\00\13\00\00\00\17\00\00\00\18\00\00\00$\00\00\00\08\03\10\00U\00\00\00\a4\00\00\00\1c\00\00\00\08\03\10\00U\00\00\00\a7\00\00\00\15\00\00\00\08\03\10\00U\00\00\00\a8\00\00\00\0d\00\00\00\08\03\10\00U\00\00\00\aa\00\00\00\16\00\00\00\08\03\10\00U\00\00\00\aa\00\00\00\0d\00\00\00\08\03\10\00U\00\00\00\ab\00\00\00\1a\00\00\00\08\03\10\00U\00\00\00\ab\00\00\00\11\00\00\00\08\03\10\00U\00\00\00\ab\00\00\00\0d\00\00\00\08\03\10\00U\00\00\00\ac\00\00\00\0d\00\00\00\08\03\10\00U\00\00\00\af\00\00\00\0d\00\00\00\08\03\10\00U\00\00\00\b1\00\00\00\09\00\00\00\08\03\10\00U\00\00\00\c5\00\00\00\14\00\00\00could not retrieve random bytes for uuid: \00\00d\04\10\00*\00\00\00/Users/tryggvil/.cargo/registry/src/github.com-1ecc6299db9ec823/uuid-1.3.3/src/rng.rs\00\00\00\98\04\10\00U\00\00\00\09\00\00\00\0d\00\00\00invalid args\00\05\10\00\0c\00\00\00/rustc/84c898d65adf2f39a5a98507f1fe0ce10a2b8dbc/library/core/src/fmt/mod.rs\00\14\05\10\00K\00\00\00\93\01\00\00\0d\00\00\00/Users/tryggvil/.cargo/registry/src/github.com-1ecc6299db9ec823/getrandom-0.2.9/src/lib.rs\00\00p\05\10\00Z\00\00\00Q\01\00\00\09\00\00\00p\05\10\00Z\00\00\005\01\00\00\05\00\00\00invalid args\ec\05\10\00\0c\00\00\00/rustc/84c898d65adf2f39a5a98507f1fe0ce10a2b8dbc/library/core/src/fmt/mod.rs\00\00\06\10\00K\00\00\00\93\01\00\00\0d\00\00\00Unknown Error: \00\5c\06\10\00\0f\00\00\00OS Error: \00\00t\06\10\00\0a\00\00\00Node.js ES modules are not directly supported, see https://docs.rs/getrandom#nodejs-es-module-supportCalling Node.js API crypto.randomFillSync failedNode.js crypto CommonJS module is unavailablerandSecure: VxWorks RNG module is not initializedCalling Web API crypto.getRandomValues failedWeb Crypto API is unavailableRDRAND: instruction not supportedRDRAND: failed multiple times: CPU issue likelyRtlGenRandom: Windows system function failureSecRandomCopyBytes: iOS Security framework failureerrno: did not return a positive valuegetrandom: this target is not supportedinvalid args\00\00\00\c1\08\10\00\0c\00\00\00/rustc/84c898d65adf2f39a5a98507f1fe0ce10a2b8dbc/library/core/src/fmt/mod.rs\00\d8\08\10\00K\00\00\00\93\01\00\00\0d\00\00\00\08\00\00\00\04\00\00\00\04\00\00\00\09\00\00\00\00\00\00\00non-zero old_len requires non-zero new_len!\00H\09\10\00+\00\00\00/Users/tryggvil/.cargo/registry/src/github.com-1ecc6299db9ec823/wit-bindgen-0.6.0/src/lib.rs|\09\10\00\5c\00\00\00A\00\00\00\0d\00\00\00\10\00\00\00\04\00\00\00\04\00\00\00\11\00\00\00\12\00\00\00\13\00\00\00\10\00\00\00\04\00\00\00\04\00\00\00\14\00\00\00\15\00\00\00\16\00\00\00\10\00\00\00\04\00\00\00\04\00\00\00\17\00\00\00\18\00\00\00\19\00\00\00\00\00\00\00\10\00\00\00\04\00\00\00\04\00\00\00\1a\00\00\00called `Option::unwrap()` on a `None` valueinternal error: entered unreachable codefatal runtime error: \0a\00\00\00\97\0a\10\00\15\00\00\00\ac\0a\10\00\01\00\00\00library/std/src/thread/mod.rsfailed to generate unique thread ID: bitspace exhausted\dd\0a\10\007\00\00\00\c0\0a\10\00\1d\00\00\00_\04\00\00\0d\00\00\00RUST_BACKTRACE\00\000\0a\10\00\00\00\00\00already borrowed\10\00\00\00\00\00\00\00\01\00\00\00\1b\00\00\00library/std/src/io/mod.rs\00\00\00d\0b\10\00\19\00\00\00&\05\00\00\16\00\00\00advancing io slices beyond their length\00\90\0b\10\00'\00\00\00d\0b\10\00\19\00\00\00(\05\00\00\0d\00\00\00d\0b\10\00\19\00\00\00\0f\06\00\00!\00\00\00failed to write whole buffer\e0\0b\10\00\1c\00\00\00\17\00\00\00formatter error\00\08\0c\10\00\0f\00\00\00(\00\00\00\1c\00\00\00\0c\00\00\00\04\00\00\00\1d\00\00\00\1e\00\00\00\1f\00\00\00\1c\00\00\00\0c\00\00\00\04\00\00\00 \00\00\00!\00\00\00\22\00\00\00library/std/src/panic.rsT\0c\10\00\18\00\00\00\f3\00\00\00\12\00\00\00file name contained an unexpected NUL byte\00\00|\0c\10\00*\00\00\00\14\00\00\00\00\00\00\00\02\00\00\00\a8\0c\10\00stack backtrace:\0a\00\00\00\c0\0c\10\00\11\00\00\00note: Some details are omitted, run with `RUST_BACKTRACE=full` for a verbose backtrace.\0a\dc\0c\10\00X\00\00\00library/std/src/sys_common/thread_info.rs\00\00\00<\0d\10\00)\00\00\00\16\00\00\003\00\00\00memory allocation of  bytes failed\00\00x\0d\10\00\15\00\00\00\8d\0d\10\00\0d\00\00\00library/std/src/alloc.rs\ac\0d\10\00\18\00\00\00U\01\00\00\09\00\00\00 bytes failed\0a\00\00x\0d\10\00\15\00\00\00\d4\0d\10\00\0e\00\00\00library/std/src/panicking.rsBox<dyn Any><unnamed>\00\00\00\10\00\00\00\00\00\00\00\01\00\00\00#\00\00\00$\00\00\00%\00\00\00&\00\00\00'\00\00\00(\00\00\00)\00\00\00*\00\00\00\0c\00\00\00\04\00\00\00+\00\00\00,\00\00\00-\00\00\00.\00\00\00/\00\00\000\00\00\001\00\00\00\f4\0d\10\00\1c\00\00\00\f9\00\00\00$\00\00\00thread '' panicked at '', \00\00\88\0e\10\00\08\00\00\00\90\0e\10\00\0f\00\00\00\9f\0e\10\00\03\00\00\00\ac\0a\10\00\01\00\00\00note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace\0a\00\00\c4\0e\10\00N\00\00\00\f4\0d\10\00\1c\00\00\00B\02\00\00\1e\00\00\00\f4\0d\10\00\1c\00\00\00A\02\00\00\1f\00\00\00*\00\00\00\0c\00\00\00\04\00\00\002\00\00\00\10\00\00\00\08\00\00\00\04\00\00\003\00\00\004\00\00\00\10\00\00\00\04\00\00\005\00\00\006\00\00\00\10\00\00\00\08\00\00\00\04\00\00\007\00\00\008\00\00\00thread panicked while processing panic. aborting.\0a\00\00\84\0f\10\002\00\00\00\10\00\00\00\00\00\00\00\01\00\00\009\00\00\00\0apanicked after panic::always_abort(), aborting.\0a\00\00\000\0a\10\00\00\00\00\00\d0\0f\10\001\00\00\00thread caused non-unwinding panic. aborting.\0a\00\00\00\14\10\10\00-\00\00\00thread panicked while panicking. aborting.\0a\00L\10\10\00+\00\00\00failed to initiate panic, error \80\10\10\00 \00\00\00advancing IoSlice beyond its length\00\a8\10\10\00#\00\00\00library/std/src/sys/wasi/io.rs\00\00\d4\10\10\00\1e\00\00\00\17\00\00\00\0d\00\00\00cannot recursively acquire mutex\04\11\10\00 \00\00\00library/std/src/sys/wasi/../unsupported/locks/mutex.rs\00\00,\11\10\006\00\00\00\14\00\00\00\09\00\00\00rwlock locked for writing\00\00\00t\11\10\00\19\00\00\00\0e\00\0f\00?\00\02\00@\005\00\0d\00\04\00\03\00,\00\1b\00\1c\00I\00\14\00\06\004\000\00/\00:\00\00\00\04\00\00\00\04\00\00\00;\00\00\00<\00\00\00=\00\00\00:\00\00\00\04\00\00\00\04\00\00\00>\00\00\00library/alloc/src/raw_vec.rscapacity overflow\00\00\00\00\12\10\00\11\00\00\00\e4\11\10\00\1c\00\00\00\0d\02\00\00\05\00\00\00called `Option::unwrap()` on a `None` valuelibrary/alloc/src/ffi/c_str.rs\00\00\00W\12\10\00\1e\00\00\00\1b\01\00\007\00\00\00a formatting trait implementation returned an error\00:\00\00\00\00\00\00\00\01\00\00\00?\00\00\00library/alloc/src/fmt.rs\cc\12\10\00\18\00\00\00d\02\00\00 \00\00\00called `Result::unwrap()` on an `Err` value\00:\00\00\00\00\00\00\00\01\00\00\00@\00\00\00library/alloc/src/sync.rs\00\00\000\13\10\00\19\00\00\00V\01\00\002\00\00\00byteserror\00\00:\00\00\00\04\00\00\00\04\00\00\00A\00\00\00FromUtf8Error\00\00\00B\00\00\00\0c\00\00\00\04\00\00\00C\00\00\00)BorrowMutErrorindex out of bounds: the len is  but the index is \00\00\00\a7\13\10\00 \00\00\00\c7\13\10\00\12\00\00\00:[\00\00\98\13\10\00\00\00\00\00\ec\13\10\00\01\00\00\00\ec\13\10\00\01\00\00\00panicked at '', \14\14\10\00\01\00\00\00\15\14\10\00\03\00\00\00I\00\00\00\00\00\00\00\01\00\00\00J\00\00\00matches!===assertion failed: `(left  right)`\0a  left: ``,\0a right: ``: \00\00\00C\14\10\00\19\00\00\00\5c\14\10\00\12\00\00\00n\14\10\00\0c\00\00\00z\14\10\00\03\00\00\00`\00\00\00C\14\10\00\19\00\00\00\5c\14\10\00\12\00\00\00n\14\10\00\0c\00\00\00\a0\14\10\00\01\00\00\00: \00\00\98\13\10\00\00\00\00\00\c4\14\10\00\02\00\00\00I\00\00\00\0c\00\00\00\04\00\00\00K\00\00\00L\00\00\00M\00\00\00     {\0a,\0a,  { } }(\0a(,\0a\00\00I\00\00\00\04\00\00\00\04\00\00\00N\00\00\00]library/core/src/fmt/num.rs\19\15\10\00\1b\00\00\00e\00\00\00\14\00\00\000x00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899\00\00I\00\00\00\04\00\00\00\04\00\00\00O\00\00\00P\00\00\00Q\00\00\00truefalselibrary/core/src/slice/memchr.rs\00\00\001\16\10\00 \00\00\00q\00\00\00'\00\00\00range start index  out of range for slice of length d\16\10\00\12\00\00\00v\16\10\00\22\00\00\00range end index \a8\16\10\00\10\00\00\00v\16\10\00\22\00\00\00slice index starts at  but ends at \00\c8\16\10\00\16\00\00\00\de\16\10\00\0d\00\00\00\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\03\03\03\03\03\03\03\03\03\03\03\03\03\03\03\03\04\04\04\04\04\00\00\00\00\00\00\00\00\00\00\00SomeNoneI\00\00\00\04\00\00\00\04\00\00\00R\00\00\00ErrorUtf8Errorvalid_up_toerror_len\00\00I\00\00\00\04\00\00\00\04\00\00\00S\00\00\00LayoutError")
  (data (;1;) (i32.const 1054804) "\01\00\00\00\ff\ff\ff\ff\ba\11\10\00")
)