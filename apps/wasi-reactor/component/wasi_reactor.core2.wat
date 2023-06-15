(module $wit-component:adapter:wasi_snapshot_preview1
  (type (;0;) (func (param i32)))
  (type (;1;) (func (param i32 i32)))
  (type (;2;) (func (param i32 i32 i32)))
  (type (;3;) (func (param i32 i32 i32 i32)))
  (type (;4;) (func (param i32) (result i32)))
  (type (;5;) (func (param i64 i32)))
  (type (;6;) (func (param i32 i32 i32 i32) (result i32)))
  (type (;7;) (func (param i32 i64) (result i32)))
  (type (;8;) (func (result i32)))
  (type (;9;) (func (param i32 i32 i32) (result i32)))
  (type (;10;) (func (param i32 i32) (result i32)))
  (type (;11;) (func))
  (import "env" "memory" (memory (;0;) 0 32768 shared))
  (import "preopens" "get-directories" (func $_ZN22wasi_snapshot_preview111descriptors11Descriptors3new19get_preopens_import17h4241f776f78b2449E (;0;) (type 0)))
  (import "filesystem" "get-type" (func $_ZN22wasi_snapshot_preview18bindings10filesystem8get_type10wit_import17he3867288d707506cE (;1;) (type 1)))
  (import "random" "get-random-bytes" (func $_ZN22wasi_snapshot_preview18bindings6random16get_random_bytes10wit_import17h3138102f1d18bf28E (;2;) (type 5)))
  (import "__main_module__" "cabi_realloc" (func $_ZN22wasi_snapshot_preview15State3new12cabi_realloc17h56b5c7c3102816d7E (;3;) (type 6)))
  (import "environment" "get-environment" (func $_ZN22wasi_snapshot_preview15State15get_environment22get_environment_import17hede756e59cdee560E (;4;) (type 0)))
  (import "filesystem" "write-via-stream" (func $_ZN22wasi_snapshot_preview18bindings10filesystem16write_via_stream10wit_import17he4aa1e75d1f3ff3fE (;5;) (type 7)))
  (import "filesystem" "append-via-stream" (func $_ZN22wasi_snapshot_preview18bindings10filesystem17append_via_stream10wit_import17h1ae8ea36ec0e3411E (;6;) (type 4)))
  (import "filesystem" "drop-descriptor" (func $_ZN22wasi_snapshot_preview18bindings10filesystem15drop_descriptor10wit_import17h15d3d17e1804a33bE (;7;) (type 0)))
  (import "preopens" "get-stdio" (func $_ZN22wasi_snapshot_preview18bindings8preopens9get_stdio10wit_import17h957ce2cff126d882E (;8;) (type 0)))
  (import "exit" "exit" (func $_ZN22wasi_snapshot_preview18bindings4exit4exit10wit_import17hb410d1c9564402c1E (;9;) (type 0)))
  (import "streams" "drop-input-stream" (func $_ZN22wasi_snapshot_preview18bindings7streams17drop_input_stream10wit_import17h0ba18a7881cc7ccdE (;10;) (type 0)))
  (import "streams" "drop-output-stream" (func $_ZN22wasi_snapshot_preview18bindings7streams18drop_output_stream10wit_import17h1b34324aca2dc78dE (;11;) (type 0)))
  (import "streams" "write" (func $_ZN22wasi_snapshot_preview18bindings7streams5write10wit_import17h9a9cd40dae3dff24E (;12;) (type 3)))
  (func $cabi_import_realloc (;13;) (type 6) (param i32 i32 i32 i32) (result i32)
    (local i32)
    call $allocate_stack
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 4
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              local.get 0
              br_if 0 (;@5;)
              local.get 1
              br_if 0 (;@5;)
              call $_ZN22wasi_snapshot_preview15State3ptr17h92674dd7be3dd0feE
              local.tee 0
              i32.load
              local.tee 1
              i32.const 2147483647
              i32.ge_u
              br_if 1 (;@4;)
              local.get 0
              local.get 1
              i32.const 1
              i32.add
              i32.store
              local.get 0
              i32.load offset=8
              i32.const 560490357
              i32.ne
              br_if 2 (;@3;)
              block ;; label = @6
                local.get 0
                i32.const 65532
                i32.add
                i32.load
                i32.const 560490357
                i32.ne
                br_if 0 (;@6;)
                block ;; label = @7
                  local.get 0
                  i32.const 20
                  i32.add
                  i32.load
                  local.tee 1
                  i32.eqz
                  br_if 0 (;@7;)
                  local.get 1
                  local.get 2
                  local.get 3
                  call $_ZN22wasi_snapshot_preview19BumpArena5alloc17h7c893259a2cade9bE
                  local.set 2
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=12
                local.tee 1
                i32.eqz
                br_if 4 (;@2;)
                block ;; label = @7
                  local.get 2
                  local.get 1
                  i32.add
                  i32.const -1
                  i32.add
                  i32.const 0
                  local.get 2
                  i32.sub
                  i32.and
                  local.tee 2
                  local.get 3
                  i32.add
                  local.tee 3
                  local.get 2
                  i32.ge_u
                  local.get 3
                  call $_ZN97_$LT$core..option..Option$LT$T$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h977c3ade6004d22cE
                  local.get 1
                  local.get 0
                  i32.const 16
                  i32.add
                  i32.load
                  i32.add
                  local.tee 3
                  local.get 1
                  i32.ge_u
                  local.get 3
                  call $_ZN97_$LT$core..option..Option$LT$T$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h977c3ade6004d22cE
                  i32.gt_u
                  br_if 0 (;@7;)
                  local.get 0
                  i32.const 0
                  i32.store offset=12
                  br 6 (;@1;)
                end
                local.get 4
                i32.const 32
                i32.store8 offset=47
                local.get 4
                i32.const 1701734764
                i32.store offset=43 align=1
                local.get 4
                i64.const 2338042707334751329
                i64.store offset=35 align=1
                local.get 4
                i64.const 2338600898263348341
                i64.store offset=27 align=1
                local.get 4
                i64.const 7162263158133189730
                i64.store offset=19 align=1
                local.get 4
                i64.const 7018969289221893749
                i64.store offset=11 align=1
                local.get 4
                i32.const 11
                i32.add
                i32.const 37
                call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                i32.const 192
                call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
                local.get 4
                i32.const 8250
                i32.store16 offset=11 align=1
                local.get 4
                i32.const 11
                i32.add
                i32.const 2
                call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                local.get 4
                i32.const 2681
                i32.store16 offset=23 align=1
                local.get 4
                i32.const 1919905125
                i32.store offset=19 align=1
                local.get 4
                i64.const 7863397576860792175
                i64.store offset=11 align=1
                local.get 4
                i32.const 11
                i32.add
                i32.const 14
                call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                local.get 4
                i32.const 10
                i32.store8 offset=11
                local.get 4
                i32.const 11
                i32.add
                i32.const 1
                call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                unreachable
                unreachable
              end
              local.get 4
              i32.const 32
              i32.store8 offset=47
              local.get 4
              i32.const 1701734764
              i32.store offset=43 align=1
              local.get 4
              i64.const 2338042707334751329
              i64.store offset=35 align=1
              local.get 4
              i64.const 2338600898263348341
              i64.store offset=27 align=1
              local.get 4
              i64.const 7162263158133189730
              i64.store offset=19 align=1
              local.get 4
              i64.const 7018969289221893749
              i64.store offset=11 align=1
              local.get 4
              i32.const 11
              i32.add
              i32.const 37
              call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
              i32.const 2203
              call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
              local.get 4
              i32.const 8250
              i32.store16 offset=11 align=1
              local.get 4
              i32.const 11
              i32.add
              i32.const 2
              call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
              local.get 4
              i32.const 10
              i32.store8 offset=27
              local.get 4
              i64.const 7234307576302018670
              i64.store offset=19 align=1
              local.get 4
              i64.const 8028075845441778529
              i64.store offset=11 align=1
              local.get 4
              i32.const 11
              i32.add
              i32.const 17
              call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
              local.get 4
              i32.const 10
              i32.store8 offset=11
              local.get 4
              i32.const 11
              i32.add
              i32.const 1
              call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
              unreachable
              unreachable
            end
            local.get 4
            i32.const 32
            i32.store8 offset=47
            local.get 4
            i32.const 1701734764
            i32.store offset=43 align=1
            local.get 4
            i64.const 2338042707334751329
            i64.store offset=35 align=1
            local.get 4
            i64.const 2338600898263348341
            i64.store offset=27 align=1
            local.get 4
            i64.const 7162263158133189730
            i64.store offset=19 align=1
            local.get 4
            i64.const 7018969289221893749
            i64.store offset=11 align=1
            local.get 4
            i32.const 11
            i32.add
            i32.const 37
            call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
            i32.const 79
            call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
            local.get 4
            i32.const 10
            i32.store8 offset=11
            local.get 4
            i32.const 11
            i32.add
            i32.const 1
            call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
            unreachable
            unreachable
          end
          local.get 4
          i32.const 32
          i32.store8 offset=47
          local.get 4
          i32.const 1701734764
          i32.store offset=43 align=1
          local.get 4
          i64.const 2338042707334751329
          i64.store offset=35 align=1
          local.get 4
          i64.const 2338600898263348341
          i64.store offset=27 align=1
          local.get 4
          i64.const 7162263158133189730
          i64.store offset=19 align=1
          local.get 4
          i64.const 7018969289221893749
          i64.store offset=11 align=1
          local.get 4
          i32.const 11
          i32.add
          i32.const 37
          call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
          i32.const 2201
          call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
          local.get 4
          i32.const 10
          i32.store8 offset=11
          local.get 4
          i32.const 11
          i32.add
          i32.const 1
          call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
          unreachable
          unreachable
        end
        local.get 4
        i32.const 32
        i32.store8 offset=47
        local.get 4
        i32.const 1701734764
        i32.store offset=43 align=1
        local.get 4
        i64.const 2338042707334751329
        i64.store offset=35 align=1
        local.get 4
        i64.const 2338600898263348341
        i64.store offset=27 align=1
        local.get 4
        i64.const 7162263158133189730
        i64.store offset=19 align=1
        local.get 4
        i64.const 7018969289221893749
        i64.store offset=11 align=1
        local.get 4
        i32.const 11
        i32.add
        i32.const 37
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        i32.const 2202
        call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
        local.get 4
        i32.const 8250
        i32.store16 offset=11 align=1
        local.get 4
        i32.const 11
        i32.add
        i32.const 2
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        local.get 4
        i32.const 10
        i32.store8 offset=27
        local.get 4
        i64.const 7234307576302018670
        i64.store offset=19 align=1
        local.get 4
        i64.const 8028075845441778529
        i64.store offset=11 align=1
        local.get 4
        i32.const 11
        i32.add
        i32.const 17
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        local.get 4
        i32.const 10
        i32.store8 offset=11
        local.get 4
        i32.const 11
        i32.add
        i32.const 1
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        unreachable
        unreachable
      end
      local.get 4
      i32.const 32
      i32.store8 offset=47
      local.get 4
      i32.const 1701734764
      i32.store offset=43 align=1
      local.get 4
      i64.const 2338042707334751329
      i64.store offset=35 align=1
      local.get 4
      i64.const 2338600898263348341
      i64.store offset=27 align=1
      local.get 4
      i64.const 7162263158133189730
      i64.store offset=19 align=1
      local.get 4
      i64.const 7018969289221893749
      i64.store offset=11 align=1
      local.get 4
      i32.const 11
      i32.add
      i32.const 37
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      i32.const 185
      call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
      local.get 4
      i32.const 8250
      i32.store16 offset=11 align=1
      local.get 4
      i32.const 11
      i32.add
      i32.const 2
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 4
      i32.const 10
      i32.store8 offset=47
      local.get 4
      i32.const 1684370293
      i32.store offset=43 align=1
      local.get 4
      i64.const 2340011850872286305
      i64.store offset=35 align=1
      local.get 4
      i64.const 2338053340533122404
      i64.store offset=27 align=1
      local.get 4
      i64.const 7599383958532420719
      i64.store offset=19 align=1
      local.get 4
      i64.const 7935468323262068066
      i64.store offset=11 align=1
      local.get 4
      i32.const 11
      i32.add
      i32.const 37
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 4
      i32.const 10
      i32.store8 offset=11
      local.get 4
      i32.const 11
      i32.add
      i32.const 1
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      unreachable
      unreachable
    end
    local.get 0
    local.get 0
    i32.load
    i32.const -1
    i32.add
    i32.store
    local.get 4
    i32.const 48
    i32.add
    global.set $__stack_pointer
    local.get 2
  )
  (func $_ZN22wasi_snapshot_preview15State3ptr17h92674dd7be3dd0feE (;14;) (type 8) (result i32)
    (local i32)
    block ;; label = @1
      call $get_state_ptr
      local.tee 0
      br_if 0 (;@1;)
      call $_ZN22wasi_snapshot_preview15State3new17h28b739cf9a9d6feaE
      local.tee 0
      call $set_state_ptr
    end
    local.get 0
  )
  (func $_ZN22wasi_snapshot_preview19BumpArena5alloc17h7c893259a2cade9bE (;15;) (type 9) (param i32 i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    block ;; label = @1
      local.get 0
      local.get 1
      i32.add
      local.get 0
      i32.load offset=54904
      i32.add
      i32.const -1
      i32.add
      i32.const 0
      local.get 1
      i32.sub
      i32.and
      local.tee 1
      local.get 0
      i32.sub
      local.get 2
      i32.add
      local.tee 2
      i32.const 54904
      i32.gt_u
      br_if 0 (;@1;)
      local.get 0
      local.get 2
      i32.store offset=54904
      local.get 3
      i32.const 48
      i32.add
      global.set $__stack_pointer
      local.get 1
      return
    end
    local.get 3
    i32.const 32
    i32.store8 offset=47
    local.get 3
    i32.const 1701734764
    i32.store offset=43 align=1
    local.get 3
    i64.const 2338042707334751329
    i64.store offset=35 align=1
    local.get 3
    i64.const 2338600898263348341
    i64.store offset=27 align=1
    local.get 3
    i64.const 7162263158133189730
    i64.store offset=19 align=1
    local.get 3
    i64.const 7018969289221893749
    i64.store offset=11 align=1
    local.get 3
    i32.const 11
    i32.add
    i32.const 37
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    i32.const 109
    call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
    local.get 3
    i32.const 8250
    i32.store16 offset=11 align=1
    local.get 3
    i32.const 11
    i32.add
    i32.const 2
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 3
    i32.const 2681
    i32.store16 offset=23 align=1
    local.get 3
    i32.const 1919905125
    i32.store offset=19 align=1
    local.get 3
    i64.const 7863397576860792175
    i64.store offset=11 align=1
    local.get 3
    i32.const 11
    i32.add
    i32.const 14
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 3
    i32.const 10
    i32.store8 offset=11
    local.get 3
    i32.const 11
    i32.add
    i32.const 1
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    unreachable
    unreachable
  )
  (func $_ZN22wasi_snapshot_preview111ImportAlloc10with_arena17hc46d8ae8b753790bE (;16;) (type 2) (param i32 i32 i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 0
        i32.load
        br_if 0 (;@2;)
        local.get 0
        i32.load offset=8
        local.set 4
        local.get 0
        local.get 1
        i32.store offset=8
        local.get 4
        i32.eqz
        br_if 1 (;@1;)
        local.get 3
        i32.const 32
        i32.store8 offset=47
        local.get 3
        i32.const 1701734764
        i32.store offset=43 align=1
        local.get 3
        i64.const 2338042707334751329
        i64.store offset=35 align=1
        local.get 3
        i64.const 2338600898263348341
        i64.store offset=27 align=1
        local.get 3
        i64.const 7162263158133189730
        i64.store offset=19 align=1
        local.get 3
        i64.const 7018969289221893749
        i64.store offset=11 align=1
        local.get 3
        i32.const 11
        i32.add
        i32.const 37
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        i32.const 171
        call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
        local.get 3
        i32.const 8250
        i32.store16 offset=11 align=1
        local.get 3
        i32.const 11
        i32.add
        i32.const 2
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        local.get 3
        i64.const 748000395109933170
        i64.store offset=27 align=1
        local.get 3
        i64.const 7307218417350680677
        i64.store offset=19 align=1
        local.get 3
        i64.const 8390050488160450159
        i64.store offset=11 align=1
        local.get 3
        i32.const 11
        i32.add
        i32.const 24
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        local.get 3
        i32.const 10
        i32.store8 offset=11
        local.get 3
        i32.const 11
        i32.add
        i32.const 1
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        unreachable
        unreachable
      end
      local.get 3
      i32.const 32
      i32.store8 offset=47
      local.get 3
      i32.const 1701734764
      i32.store offset=43 align=1
      local.get 3
      i64.const 2338042707334751329
      i64.store offset=35 align=1
      local.get 3
      i64.const 2338600898263348341
      i64.store offset=27 align=1
      local.get 3
      i64.const 7162263158133189730
      i64.store offset=19 align=1
      local.get 3
      i64.const 7018969289221893749
      i64.store offset=11 align=1
      local.get 3
      i32.const 11
      i32.add
      i32.const 37
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      i32.const 164
      call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
      local.get 3
      i32.const 8250
      i32.store16 offset=11 align=1
      local.get 3
      i32.const 11
      i32.add
      i32.const 2
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 3
      i32.const 174417007
      i32.store offset=19 align=1
      local.get 3
      i64.const 7863410729224140130
      i64.store offset=11 align=1
      local.get 3
      i32.const 11
      i32.add
      i32.const 12
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 3
      i32.const 10
      i32.store8 offset=11
      local.get 3
      i32.const 11
      i32.add
      i32.const 1
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      unreachable
      unreachable
    end
    local.get 2
    call $_ZN22wasi_snapshot_preview111descriptors11Descriptors3new19get_preopens_import17h4241f776f78b2449E
    local.get 0
    i32.const 0
    i32.store offset=8
    local.get 3
    i32.const 48
    i32.add
    global.set $__stack_pointer
  )
  (func $cabi_export_realloc (;17;) (type 6) (param i32 i32 i32 i32) (result i32)
    (local i32)
    call $allocate_stack
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 4
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            local.get 0
            br_if 0 (;@4;)
            local.get 1
            br_if 0 (;@4;)
            call $_ZN22wasi_snapshot_preview15State3ptr17h92674dd7be3dd0feE
            local.tee 0
            i32.load
            br_if 1 (;@3;)
            local.get 0
            i32.const -1
            i32.store
            local.get 0
            i32.load offset=8
            i32.const 560490357
            i32.ne
            br_if 2 (;@2;)
            local.get 0
            i32.const 65532
            i32.add
            i32.load
            i32.const 560490357
            i32.ne
            br_if 3 (;@1;)
            local.get 0
            i32.const 10296
            i32.add
            local.get 2
            local.get 3
            call $_ZN22wasi_snapshot_preview19BumpArena5alloc17h7c893259a2cade9bE
            local.set 1
            local.get 0
            local.get 0
            i32.load
            i32.const 1
            i32.add
            i32.store
            local.get 4
            i32.const 48
            i32.add
            global.set $__stack_pointer
            local.get 1
            return
          end
          local.get 4
          i32.const 32
          i32.store8 offset=47
          local.get 4
          i32.const 1701734764
          i32.store offset=43 align=1
          local.get 4
          i64.const 2338042707334751329
          i64.store offset=35 align=1
          local.get 4
          i64.const 2338600898263348341
          i64.store offset=27 align=1
          local.get 4
          i64.const 7162263158133189730
          i64.store offset=19 align=1
          local.get 4
          i64.const 7018969289221893749
          i64.store offset=11 align=1
          local.get 4
          i32.const 11
          i32.add
          i32.const 37
          call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
          i32.const 215
          call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
          local.get 4
          i32.const 10
          i32.store8 offset=11
          local.get 4
          i32.const 11
          i32.add
          i32.const 1
          call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
          unreachable
          unreachable
        end
        local.get 4
        i32.const 32
        i32.store8 offset=47
        local.get 4
        i32.const 1701734764
        i32.store offset=43 align=1
        local.get 4
        i64.const 2338042707334751329
        i64.store offset=35 align=1
        local.get 4
        i64.const 2338600898263348341
        i64.store offset=27 align=1
        local.get 4
        i64.const 7162263158133189730
        i64.store offset=19 align=1
        local.get 4
        i64.const 7018969289221893749
        i64.store offset=11 align=1
        local.get 4
        i32.const 11
        i32.add
        i32.const 37
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        i32.const 2213
        call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
        local.get 4
        i32.const 10
        i32.store8 offset=11
        local.get 4
        i32.const 11
        i32.add
        i32.const 1
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        unreachable
        unreachable
      end
      local.get 4
      i32.const 32
      i32.store8 offset=47
      local.get 4
      i32.const 1701734764
      i32.store offset=43 align=1
      local.get 4
      i64.const 2338042707334751329
      i64.store offset=35 align=1
      local.get 4
      i64.const 2338600898263348341
      i64.store offset=27 align=1
      local.get 4
      i64.const 7162263158133189730
      i64.store offset=19 align=1
      local.get 4
      i64.const 7018969289221893749
      i64.store offset=11 align=1
      local.get 4
      i32.const 11
      i32.add
      i32.const 37
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      i32.const 2214
      call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
      local.get 4
      i32.const 8250
      i32.store16 offset=11 align=1
      local.get 4
      i32.const 11
      i32.add
      i32.const 2
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 4
      i32.const 10
      i32.store8 offset=27
      local.get 4
      i64.const 7234307576302018670
      i64.store offset=19 align=1
      local.get 4
      i64.const 8028075845441778529
      i64.store offset=11 align=1
      local.get 4
      i32.const 11
      i32.add
      i32.const 17
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 4
      i32.const 10
      i32.store8 offset=11
      local.get 4
      i32.const 11
      i32.add
      i32.const 1
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      unreachable
      unreachable
    end
    local.get 4
    i32.const 32
    i32.store8 offset=47
    local.get 4
    i32.const 1701734764
    i32.store offset=43 align=1
    local.get 4
    i64.const 2338042707334751329
    i64.store offset=35 align=1
    local.get 4
    i64.const 2338600898263348341
    i64.store offset=27 align=1
    local.get 4
    i64.const 7162263158133189730
    i64.store offset=19 align=1
    local.get 4
    i64.const 7018969289221893749
    i64.store offset=11 align=1
    local.get 4
    i32.const 11
    i32.add
    i32.const 37
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    i32.const 2215
    call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
    local.get 4
    i32.const 8250
    i32.store16 offset=11 align=1
    local.get 4
    i32.const 11
    i32.add
    i32.const 2
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 4
    i32.const 10
    i32.store8 offset=27
    local.get 4
    i64.const 7234307576302018670
    i64.store offset=19 align=1
    local.get 4
    i64.const 8028075845441778529
    i64.store offset=11 align=1
    local.get 4
    i32.const 11
    i32.add
    i32.const 17
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 4
    i32.const 10
    i32.store8 offset=11
    local.get 4
    i32.const 11
    i32.add
    i32.const 1
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    unreachable
    unreachable
  )
  (func $environ_get (;18;) (type 10) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32)
    call $allocate_stack
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          call $_ZN22wasi_snapshot_preview15State3ptr17h92674dd7be3dd0feE
          local.tee 3
          i32.load
          local.tee 4
          i32.const 2147483647
          i32.ge_u
          br_if 0 (;@3;)
          local.get 3
          local.get 4
          i32.const 1
          i32.add
          i32.store
          local.get 3
          i32.load offset=8
          i32.const 560490357
          i32.ne
          br_if 1 (;@2;)
          local.get 3
          i32.const 65532
          i32.add
          i32.load
          i32.const 560490357
          i32.ne
          br_if 2 (;@1;)
          local.get 2
          local.get 3
          i32.const 8
          i32.add
          call $_ZN22wasi_snapshot_preview15State15get_environment17h65794b194358af8aE
          block ;; label = @4
            local.get 2
            i32.load offset=4
            local.tee 5
            i32.eqz
            br_if 0 (;@4;)
            local.get 2
            i32.load
            local.tee 4
            local.get 5
            i32.const 4
            i32.shl
            i32.add
            local.set 6
            loop ;; label = @5
              local.get 0
              local.get 1
              i32.store
              local.get 1
              local.get 4
              i32.load
              local.get 4
              i32.const 4
              i32.add
              local.tee 5
              i32.load
              call $memcpy
              local.get 5
              i32.load
              i32.add
              local.tee 1
              i32.const 61
              i32.store8
              local.get 1
              i32.const 1
              i32.add
              local.get 4
              i32.const 8
              i32.add
              i32.load
              local.get 4
              i32.const 12
              i32.add
              local.tee 1
              i32.load
              call $memcpy
              local.get 1
              i32.load
              i32.add
              local.tee 1
              i32.const 0
              i32.store8
              local.get 1
              i32.const 1
              i32.add
              local.set 1
              local.get 0
              i32.const 4
              i32.add
              local.set 0
              local.get 4
              i32.const 16
              i32.add
              local.tee 4
              local.get 6
              i32.ne
              br_if 0 (;@5;)
            end
          end
          local.get 3
          local.get 3
          i32.load
          i32.const -1
          i32.add
          i32.store
          local.get 2
          i32.const 48
          i32.add
          global.set $__stack_pointer
          i32.const 0
          return
        end
        local.get 2
        i32.const 32
        i32.store8 offset=47
        local.get 2
        i32.const 1701734764
        i32.store offset=43 align=1
        local.get 2
        i64.const 2338042707334751329
        i64.store offset=35 align=1
        local.get 2
        i64.const 2338600898263348341
        i64.store offset=27 align=1
        local.get 2
        i64.const 7162263158133189730
        i64.store offset=19 align=1
        local.get 2
        i64.const 7018969289221893749
        i64.store offset=11 align=1
        local.get 2
        i32.const 11
        i32.add
        i32.const 37
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        i32.const 2201
        call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
        local.get 2
        i32.const 10
        i32.store8 offset=11
        local.get 2
        i32.const 11
        i32.add
        i32.const 1
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        unreachable
        unreachable
      end
      local.get 2
      i32.const 32
      i32.store8 offset=47
      local.get 2
      i32.const 1701734764
      i32.store offset=43 align=1
      local.get 2
      i64.const 2338042707334751329
      i64.store offset=35 align=1
      local.get 2
      i64.const 2338600898263348341
      i64.store offset=27 align=1
      local.get 2
      i64.const 7162263158133189730
      i64.store offset=19 align=1
      local.get 2
      i64.const 7018969289221893749
      i64.store offset=11 align=1
      local.get 2
      i32.const 11
      i32.add
      i32.const 37
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      i32.const 2202
      call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
      local.get 2
      i32.const 8250
      i32.store16 offset=11 align=1
      local.get 2
      i32.const 11
      i32.add
      i32.const 2
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 2
      i32.const 10
      i32.store8 offset=27
      local.get 2
      i64.const 7234307576302018670
      i64.store offset=19 align=1
      local.get 2
      i64.const 8028075845441778529
      i64.store offset=11 align=1
      local.get 2
      i32.const 11
      i32.add
      i32.const 17
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 2
      i32.const 10
      i32.store8 offset=11
      local.get 2
      i32.const 11
      i32.add
      i32.const 1
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      unreachable
      unreachable
    end
    local.get 2
    i32.const 32
    i32.store8 offset=47
    local.get 2
    i32.const 1701734764
    i32.store offset=43 align=1
    local.get 2
    i64.const 2338042707334751329
    i64.store offset=35 align=1
    local.get 2
    i64.const 2338600898263348341
    i64.store offset=27 align=1
    local.get 2
    i64.const 7162263158133189730
    i64.store offset=19 align=1
    local.get 2
    i64.const 7018969289221893749
    i64.store offset=11 align=1
    local.get 2
    i32.const 11
    i32.add
    i32.const 37
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    i32.const 2203
    call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
    local.get 2
    i32.const 8250
    i32.store16 offset=11 align=1
    local.get 2
    i32.const 11
    i32.add
    i32.const 2
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 2
    i32.const 10
    i32.store8 offset=27
    local.get 2
    i64.const 7234307576302018670
    i64.store offset=19 align=1
    local.get 2
    i64.const 8028075845441778529
    i64.store offset=11 align=1
    local.get 2
    i32.const 11
    i32.add
    i32.const 17
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 2
    i32.const 10
    i32.store8 offset=11
    local.get 2
    i32.const 11
    i32.add
    i32.const 1
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    unreachable
    unreachable
  )
  (func $_ZN22wasi_snapshot_preview15State15get_environment17h65794b194358af8aE (;19;) (type 1) (param i32 i32)
    (local i32 i32 i32)
    global.get $__stack_pointer
    i32.const 64
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.load offset=65204
        local.tee 3
        i32.eqz
        br_if 0 (;@2;)
        local.get 1
        i32.const 65208
        i32.add
        i32.load
        local.set 4
        br 1 (;@1;)
      end
      local.get 2
      i64.const 0
      i64.store offset=16
      block ;; label = @2
        block ;; label = @3
          local.get 1
          i32.load offset=4
          br_if 0 (;@3;)
          local.get 1
          i32.const 12
          i32.add
          local.tee 3
          i32.load
          local.set 4
          local.get 3
          local.get 1
          i32.const 10288
          i32.add
          i32.store
          local.get 4
          br_if 1 (;@2;)
          local.get 2
          i32.const 16
          i32.add
          call $_ZN22wasi_snapshot_preview15State15get_environment22get_environment_import17hede756e59cdee560E
          local.get 1
          i32.const 0
          i32.store offset=12
          local.get 1
          i32.const 65208
          i32.add
          local.get 2
          i32.load offset=20
          local.tee 4
          i32.store
          local.get 1
          local.get 2
          i32.load offset=16
          local.tee 3
          i32.store offset=65204
          br 2 (;@1;)
        end
        local.get 2
        i32.const 32
        i32.store8 offset=63
        local.get 2
        i32.const 1701734764
        i32.store offset=59 align=1
        local.get 2
        i64.const 2338042707334751329
        i64.store offset=51 align=1
        local.get 2
        i64.const 2338600898263348341
        i64.store offset=43 align=1
        local.get 2
        i64.const 7162263158133189730
        i64.store offset=35 align=1
        local.get 2
        i64.const 7018969289221893749
        i64.store offset=27 align=1
        local.get 2
        i32.const 27
        i32.add
        i32.const 37
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        i32.const 164
        call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
        local.get 2
        i32.const 8250
        i32.store16 offset=27 align=1
        local.get 2
        i32.const 27
        i32.add
        i32.const 2
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        local.get 2
        i32.const 174417007
        i32.store offset=35 align=1
        local.get 2
        i64.const 7863410729224140130
        i64.store offset=27 align=1
        local.get 2
        i32.const 27
        i32.add
        i32.const 12
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        local.get 2
        i32.const 10
        i32.store8 offset=27
        local.get 2
        i32.const 27
        i32.add
        i32.const 1
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        unreachable
        unreachable
      end
      local.get 2
      i32.const 32
      i32.store8 offset=63
      local.get 2
      i32.const 1701734764
      i32.store offset=59 align=1
      local.get 2
      i64.const 2338042707334751329
      i64.store offset=51 align=1
      local.get 2
      i64.const 2338600898263348341
      i64.store offset=43 align=1
      local.get 2
      i64.const 7162263158133189730
      i64.store offset=35 align=1
      local.get 2
      i64.const 7018969289221893749
      i64.store offset=27 align=1
      local.get 2
      i32.const 27
      i32.add
      i32.const 37
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      i32.const 171
      call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
      local.get 2
      i32.const 8250
      i32.store16 offset=27 align=1
      local.get 2
      i32.const 27
      i32.add
      i32.const 2
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 2
      i64.const 748000395109933170
      i64.store offset=43 align=1
      local.get 2
      i64.const 7307218417350680677
      i64.store offset=35 align=1
      local.get 2
      i64.const 8390050488160450159
      i64.store offset=27 align=1
      local.get 2
      i32.const 27
      i32.add
      i32.const 24
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 2
      i32.const 10
      i32.store8 offset=27
      local.get 2
      i32.const 27
      i32.add
      i32.const 1
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      unreachable
      unreachable
    end
    local.get 2
    i32.const 8
    i32.add
    local.get 3
    local.get 4
    call $_ZN97_$LT$core..option..Option$LT$T$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h435a00f44ab35638E
    local.get 2
    i32.load offset=12
    local.set 1
    local.get 0
    local.get 2
    i32.load offset=8
    i32.store
    local.get 0
    local.get 1
    i32.store offset=4
    local.get 2
    i32.const 64
    i32.add
    global.set $__stack_pointer
  )
  (func $environ_sizes_get (;20;) (type 10) (param i32 i32) (result i32)
    (local i32 i32 i32 i32 i32)
    call $allocate_stack
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
              call $get_allocation_state
              i32.const -2
              i32.add
              i32.const -3
              i32.and
              i32.eqz
              br_if 0 (;@5;)
              local.get 0
              i32.const 0
              i32.store
              local.get 1
              i32.const 0
              i32.store
              br 1 (;@4;)
            end
            call $_ZN22wasi_snapshot_preview15State3ptr17h92674dd7be3dd0feE
            local.tee 3
            i32.load
            local.tee 4
            i32.const 2147483647
            i32.ge_u
            br_if 1 (;@3;)
            local.get 3
            local.get 4
            i32.const 1
            i32.add
            i32.store
            local.get 3
            i32.load offset=8
            i32.const 560490357
            i32.ne
            br_if 2 (;@2;)
            local.get 3
            i32.const 65532
            i32.add
            i32.load
            i32.const 560490357
            i32.ne
            br_if 3 (;@1;)
            local.get 2
            local.get 3
            i32.const 8
            i32.add
            call $_ZN22wasi_snapshot_preview15State15get_environment17h65794b194358af8aE
            local.get 2
            i32.load
            local.set 5
            local.get 0
            local.get 2
            i32.load offset=4
            local.tee 4
            i32.store
            block ;; label = @5
              block ;; label = @6
                local.get 4
                br_if 0 (;@6;)
                i32.const 0
                local.set 4
                br 1 (;@5;)
              end
              local.get 4
              i32.const 4
              i32.shl
              local.set 6
              local.get 5
              i32.const 12
              i32.add
              local.set 0
              i32.const 0
              local.set 4
              loop ;; label = @6
                local.get 4
                local.get 0
                i32.const -8
                i32.add
                i32.load
                i32.add
                local.get 0
                i32.load
                i32.add
                i32.const 2
                i32.add
                local.set 4
                local.get 0
                i32.const 16
                i32.add
                local.set 0
                local.get 6
                i32.const -16
                i32.add
                local.tee 6
                br_if 0 (;@6;)
              end
            end
            local.get 1
            local.get 4
            i32.store
            local.get 3
            local.get 3
            i32.load
            i32.const -1
            i32.add
            i32.store
          end
          local.get 2
          i32.const 48
          i32.add
          global.set $__stack_pointer
          i32.const 0
          return
        end
        local.get 2
        i32.const 32
        i32.store8 offset=47
        local.get 2
        i32.const 1701734764
        i32.store offset=43 align=1
        local.get 2
        i64.const 2338042707334751329
        i64.store offset=35 align=1
        local.get 2
        i64.const 2338600898263348341
        i64.store offset=27 align=1
        local.get 2
        i64.const 7162263158133189730
        i64.store offset=19 align=1
        local.get 2
        i64.const 7018969289221893749
        i64.store offset=11 align=1
        local.get 2
        i32.const 11
        i32.add
        i32.const 37
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        i32.const 2201
        call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
        local.get 2
        i32.const 10
        i32.store8 offset=11
        local.get 2
        i32.const 11
        i32.add
        i32.const 1
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        unreachable
        unreachable
      end
      local.get 2
      i32.const 32
      i32.store8 offset=47
      local.get 2
      i32.const 1701734764
      i32.store offset=43 align=1
      local.get 2
      i64.const 2338042707334751329
      i64.store offset=35 align=1
      local.get 2
      i64.const 2338600898263348341
      i64.store offset=27 align=1
      local.get 2
      i64.const 7162263158133189730
      i64.store offset=19 align=1
      local.get 2
      i64.const 7018969289221893749
      i64.store offset=11 align=1
      local.get 2
      i32.const 11
      i32.add
      i32.const 37
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      i32.const 2202
      call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
      local.get 2
      i32.const 8250
      i32.store16 offset=11 align=1
      local.get 2
      i32.const 11
      i32.add
      i32.const 2
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 2
      i32.const 10
      i32.store8 offset=27
      local.get 2
      i64.const 7234307576302018670
      i64.store offset=19 align=1
      local.get 2
      i64.const 8028075845441778529
      i64.store offset=11 align=1
      local.get 2
      i32.const 11
      i32.add
      i32.const 17
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 2
      i32.const 10
      i32.store8 offset=11
      local.get 2
      i32.const 11
      i32.add
      i32.const 1
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      unreachable
      unreachable
    end
    local.get 2
    i32.const 32
    i32.store8 offset=47
    local.get 2
    i32.const 1701734764
    i32.store offset=43 align=1
    local.get 2
    i64.const 2338042707334751329
    i64.store offset=35 align=1
    local.get 2
    i64.const 2338600898263348341
    i64.store offset=27 align=1
    local.get 2
    i64.const 7162263158133189730
    i64.store offset=19 align=1
    local.get 2
    i64.const 7018969289221893749
    i64.store offset=11 align=1
    local.get 2
    i32.const 11
    i32.add
    i32.const 37
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    i32.const 2203
    call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
    local.get 2
    i32.const 8250
    i32.store16 offset=11 align=1
    local.get 2
    i32.const 11
    i32.add
    i32.const 2
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 2
    i32.const 10
    i32.store8 offset=27
    local.get 2
    i64.const 7234307576302018670
    i64.store offset=19 align=1
    local.get 2
    i64.const 8028075845441778529
    i64.store offset=11 align=1
    local.get 2
    i32.const 11
    i32.add
    i32.const 17
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 2
    i32.const 10
    i32.store8 offset=11
    local.get 2
    i32.const 11
    i32.add
    i32.const 1
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    unreachable
    unreachable
  )
  (func $_ZN22wasi_snapshot_preview15State11descriptors17h750c14be9ee62f42E (;21;) (type 1) (param i32 i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 6176
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 1
        i32.load offset=16
        br_if 0 (;@2;)
        local.get 1
        i32.const -1
        i32.store offset=16
        local.get 1
        i32.const 24
        i32.add
        local.set 3
        block ;; label = @3
          local.get 1
          i32.const 6172
          i32.add
          i32.load
          i32.const 2
          i32.ne
          br_if 0 (;@3;)
          local.get 2
          i32.const 8
          i32.add
          local.get 1
          i32.const 4
          i32.add
          local.get 1
          i32.const 10288
          i32.add
          call $_ZN22wasi_snapshot_preview111descriptors11Descriptors3new17h04c2effa43cd9ca8E
          local.get 3
          local.get 2
          i32.const 8
          i32.add
          i32.const 6168
          call $memcpy
          drop
          local.get 1
          i32.load offset=6172
          i32.const 2
          i32.eq
          br_if 2 (;@1;)
        end
        local.get 0
        local.get 1
        i32.const 16
        i32.add
        i32.store offset=4
        local.get 0
        local.get 3
        i32.store
        local.get 2
        i32.const 6176
        i32.add
        global.set $__stack_pointer
        return
      end
      local.get 2
      i32.const 32
      i32.store8 offset=44
      local.get 2
      i32.const 1701734764
      i32.store offset=40 align=1
      local.get 2
      i64.const 2338042707334751329
      i64.store offset=32 align=1
      local.get 2
      i64.const 2338600898263348341
      i64.store offset=24 align=1
      local.get 2
      i64.const 7162263158133189730
      i64.store offset=16 align=1
      local.get 2
      i64.const 7018969289221893749
      i64.store offset=8 align=1
      local.get 2
      i32.const 8
      i32.add
      i32.const 37
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      i32.const 2297
      call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
      local.get 2
      i32.const 10
      i32.store8 offset=8
      local.get 2
      i32.const 8
      i32.add
      i32.const 1
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      unreachable
      unreachable
    end
    local.get 2
    i32.const 32
    i32.store8 offset=44
    local.get 2
    i32.const 1701734764
    i32.store offset=40 align=1
    local.get 2
    i64.const 2338042707334751329
    i64.store offset=32 align=1
    local.get 2
    i64.const 2338600898263348341
    i64.store offset=24 align=1
    local.get 2
    i64.const 7162263158133189730
    i64.store offset=16 align=1
    local.get 2
    i64.const 7018969289221893749
    i64.store offset=8 align=1
    local.get 2
    i32.const 8
    i32.add
    i32.const 37
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    i32.const 2301
    call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
    local.get 2
    i32.const 10
    i32.store8 offset=8
    local.get 2
    i32.const 8
    i32.add
    i32.const 1
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    unreachable
    unreachable
  )
  (func $fd_write (;22;) (type 6) (param i32 i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i64)
    call $allocate_stack
    global.get $__stack_pointer
    i32.const 64
    i32.sub
    local.tee 4
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              block ;; label = @6
                call $get_allocation_state
                i32.const -2
                i32.add
                i32.const -3
                i32.and
                br_if 0 (;@6;)
                block ;; label = @7
                  block ;; label = @8
                    local.get 2
                    i32.eqz
                    br_if 0 (;@8;)
                    loop ;; label = @9
                      local.get 1
                      i32.const 4
                      i32.add
                      i32.load
                      local.tee 5
                      br_if 2 (;@7;)
                      local.get 1
                      i32.const 8
                      i32.add
                      local.set 1
                      local.get 2
                      i32.const -1
                      i32.add
                      local.tee 2
                      br_if 0 (;@9;)
                    end
                  end
                  i32.const 0
                  local.set 1
                  local.get 3
                  i32.const 0
                  i32.store
                  br 6 (;@1;)
                end
                local.get 1
                i32.load
                local.set 6
                call $_ZN22wasi_snapshot_preview15State3ptr17h92674dd7be3dd0feE
                local.tee 2
                i32.load
                local.tee 1
                i32.const 2147483647
                i32.ge_u
                br_if 1 (;@5;)
                local.get 2
                local.get 1
                i32.const 1
                i32.add
                i32.store
                local.get 2
                i32.load offset=8
                i32.const 560490357
                i32.ne
                br_if 2 (;@4;)
                block ;; label = @7
                  block ;; label = @8
                    local.get 2
                    i32.const 65532
                    i32.add
                    i32.load
                    i32.const 560490357
                    i32.ne
                    br_if 0 (;@8;)
                    local.get 4
                    i32.const 16
                    i32.add
                    local.get 2
                    i32.const 8
                    i32.add
                    call $_ZN22wasi_snapshot_preview15State11descriptors17h750c14be9ee62f42E
                    local.get 4
                    i32.load offset=16
                    local.tee 7
                    i32.load16_u offset=6144
                    local.set 8
                    local.get 4
                    i32.load offset=20
                    local.set 9
                    i32.const 8
                    local.set 1
                    i32.const 0
                    local.get 0
                    call $_ZN101_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h6f759e3f8235d62dE
                    local.tee 0
                    local.get 8
                    i32.ge_u
                    br_if 6 (;@2;)
                    local.get 7
                    local.get 0
                    i32.const 48
                    i32.mul
                    i32.add
                    local.tee 0
                    i32.load
                    i32.eqz
                    br_if 6 (;@2;)
                    local.get 4
                    i32.const 24
                    i32.add
                    local.get 0
                    i32.const 8
                    i32.add
                    call $_ZN22wasi_snapshot_preview111descriptors7Streams16get_write_stream17h56c746ccc014c727E
                    local.get 4
                    i32.load16_u offset=24
                    br_if 1 (;@7;)
                    local.get 4
                    local.get 4
                    i32.load offset=28
                    local.get 6
                    local.get 5
                    call $_ZN22wasi_snapshot_preview18bindings7streams5write17h66900a9084128928E
                    i32.const 29
                    local.set 1
                    local.get 4
                    i32.load
                    br_if 6 (;@2;)
                    local.get 4
                    i64.load offset=8
                    local.set 10
                    local.get 0
                    i32.const 40
                    i32.add
                    i32.load8_u
                    br_if 5 (;@3;)
                    local.get 0
                    i32.const 32
                    i32.add
                    local.tee 1
                    local.get 1
                    i64.load
                    local.get 10
                    i64.add
                    i64.store
                    br 5 (;@3;)
                  end
                  local.get 4
                  i32.const 32
                  i32.store8 offset=60
                  local.get 4
                  i32.const 1701734764
                  i32.store offset=56 align=1
                  local.get 4
                  i64.const 2338042707334751329
                  i64.store offset=48 align=1
                  local.get 4
                  i64.const 2338600898263348341
                  i64.store offset=40 align=1
                  local.get 4
                  i64.const 7162263158133189730
                  i64.store offset=32 align=1
                  local.get 4
                  i64.const 7018969289221893749
                  i64.store offset=24 align=1
                  local.get 4
                  i32.const 24
                  i32.add
                  i32.const 37
                  call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                  i32.const 2203
                  call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
                  local.get 4
                  i32.const 8250
                  i32.store16 offset=24 align=1
                  local.get 4
                  i32.const 24
                  i32.add
                  i32.const 2
                  call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                  local.get 4
                  i32.const 10
                  i32.store8 offset=40
                  local.get 4
                  i64.const 7234307576302018670
                  i64.store offset=32 align=1
                  local.get 4
                  i64.const 8028075845441778529
                  i64.store offset=24 align=1
                  local.get 4
                  i32.const 24
                  i32.add
                  i32.const 17
                  call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                  local.get 4
                  i32.const 10
                  i32.store8 offset=24
                  local.get 4
                  i32.const 24
                  i32.add
                  i32.const 1
                  call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                  unreachable
                  unreachable
                end
                local.get 4
                i32.load16_u offset=26
                local.set 1
                br 4 (;@2;)
              end
              local.get 3
              i32.const 0
              i32.store
              i32.const 29
              local.set 1
              br 4 (;@1;)
            end
            local.get 4
            i32.const 32
            i32.store8 offset=60
            local.get 4
            i32.const 1701734764
            i32.store offset=56 align=1
            local.get 4
            i64.const 2338042707334751329
            i64.store offset=48 align=1
            local.get 4
            i64.const 2338600898263348341
            i64.store offset=40 align=1
            local.get 4
            i64.const 7162263158133189730
            i64.store offset=32 align=1
            local.get 4
            i64.const 7018969289221893749
            i64.store offset=24 align=1
            local.get 4
            i32.const 24
            i32.add
            i32.const 37
            call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
            i32.const 2201
            call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
            local.get 4
            i32.const 10
            i32.store8 offset=24
            local.get 4
            i32.const 24
            i32.add
            i32.const 1
            call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
            unreachable
            unreachable
          end
          local.get 4
          i32.const 32
          i32.store8 offset=60
          local.get 4
          i32.const 1701734764
          i32.store offset=56 align=1
          local.get 4
          i64.const 2338042707334751329
          i64.store offset=48 align=1
          local.get 4
          i64.const 2338600898263348341
          i64.store offset=40 align=1
          local.get 4
          i64.const 7162263158133189730
          i64.store offset=32 align=1
          local.get 4
          i64.const 7018969289221893749
          i64.store offset=24 align=1
          local.get 4
          i32.const 24
          i32.add
          i32.const 37
          call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
          i32.const 2202
          call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
          local.get 4
          i32.const 8250
          i32.store16 offset=24 align=1
          local.get 4
          i32.const 24
          i32.add
          i32.const 2
          call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
          local.get 4
          i32.const 10
          i32.store8 offset=40
          local.get 4
          i64.const 7234307576302018670
          i64.store offset=32 align=1
          local.get 4
          i64.const 8028075845441778529
          i64.store offset=24 align=1
          local.get 4
          i32.const 24
          i32.add
          i32.const 17
          call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
          local.get 4
          i32.const 10
          i32.store8 offset=24
          local.get 4
          i32.const 24
          i32.add
          i32.const 1
          call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
          unreachable
          unreachable
        end
        local.get 3
        local.get 10
        i64.store32
        i32.const 0
        local.set 1
      end
      local.get 9
      local.get 9
      i32.load
      i32.const 1
      i32.add
      i32.store
      local.get 2
      local.get 2
      i32.load
      i32.const -1
      i32.add
      i32.store
    end
    local.get 4
    i32.const 64
    i32.add
    global.set $__stack_pointer
    local.get 1
    i32.const 65535
    i32.and
  )
  (func $proc_exit (;23;) (type 0) (param i32)
    (local i32)
    call $allocate_stack
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 1
    global.set $__stack_pointer
    local.get 0
    i32.const 0
    i32.ne
    call $_ZN22wasi_snapshot_preview18bindings4exit4exit17h5a273dd69824ced2E
    local.get 1
    i32.const 32
    i32.store8 offset=46
    local.get 1
    i32.const 1701734764
    i32.store offset=42 align=1
    local.get 1
    i64.const 2338042707334751329
    i64.store offset=34 align=1
    local.get 1
    i64.const 2338600898263348341
    i64.store offset=26 align=1
    local.get 1
    i64.const 7162263158133189730
    i64.store offset=18 align=1
    local.get 1
    i64.const 7018969289221893749
    i64.store offset=10 align=1
    local.get 1
    i32.const 10
    i32.add
    i32.const 37
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    i32.const 1829
    call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
    local.get 1
    i32.const 8250
    i32.store16 offset=10 align=1
    local.get 1
    i32.const 10
    i32.add
    i32.const 2
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 1
    i32.const 2593
    i32.store16 offset=46 align=1
    local.get 1
    i32.const 1953069157
    i32.store offset=42 align=1
    local.get 1
    i64.const 2338537461596644384
    i64.store offset=34 align=1
    local.get 1
    i64.const 7957695015159098981
    i64.store offset=26 align=1
    local.get 1
    i64.const 7882825952909664372
    i64.store offset=18 align=1
    local.get 1
    i64.const 7599935561254793064
    i64.store offset=10 align=1
    local.get 1
    i32.const 10
    i32.add
    i32.const 38
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 1
    i32.const 10
    i32.store8 offset=10
    local.get 1
    i32.const 10
    i32.add
    i32.const 1
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    unreachable
    unreachable
  )
  (func $random_get (;24;) (type 10) (param i32 i32) (result i32)
    (local i32 i32 i32)
    call $allocate_stack
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
              call $get_allocation_state
              i32.const -2
              i32.add
              i32.const -3
              i32.and
              br_if 0 (;@5;)
              call $_ZN22wasi_snapshot_preview15State3ptr17h92674dd7be3dd0feE
              local.tee 3
              i32.load
              local.tee 4
              i32.const 2147483647
              i32.ge_u
              br_if 1 (;@4;)
              local.get 3
              local.get 4
              i32.const 1
              i32.add
              i32.store
              local.get 3
              i32.load offset=8
              i32.const 560490357
              i32.ne
              br_if 2 (;@3;)
              block ;; label = @6
                block ;; label = @7
                  local.get 3
                  i32.const 65532
                  i32.add
                  i32.load
                  i32.const 560490357
                  i32.ne
                  br_if 0 (;@7;)
                  local.get 3
                  i32.const 20
                  i32.add
                  i32.load
                  br_if 5 (;@2;)
                  local.get 3
                  i32.load offset=12
                  local.set 4
                  local.get 3
                  local.get 0
                  i32.store offset=12
                  local.get 4
                  br_if 6 (;@1;)
                  local.get 3
                  i32.const 16
                  i32.add
                  local.get 1
                  i32.store
                  local.get 1
                  i64.extend_i32_u
                  local.get 2
                  i32.const 8
                  i32.add
                  call $_ZN22wasi_snapshot_preview18bindings6random16get_random_bytes10wit_import17h3138102f1d18bf28E
                  local.get 2
                  i32.load offset=8
                  local.set 1
                  local.get 3
                  i32.const 0
                  i32.store offset=12
                  local.get 1
                  local.get 0
                  i32.eq
                  br_if 1 (;@6;)
                  local.get 2
                  i32.const 32
                  i32.store8 offset=44
                  local.get 2
                  i32.const 1701734764
                  i32.store offset=40 align=1
                  local.get 2
                  i64.const 2338042707334751329
                  i64.store offset=32 align=1
                  local.get 2
                  i64.const 2338600898263348341
                  i64.store offset=24 align=1
                  local.get 2
                  i64.const 7162263158133189730
                  i64.store offset=16 align=1
                  local.get 2
                  i64.const 7018969289221893749
                  i64.store offset=8 align=1
                  local.get 2
                  i32.const 8
                  i32.add
                  i32.const 37
                  call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                  i32.const 1865
                  call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
                  local.get 2
                  i32.const 8250
                  i32.store16 offset=8 align=1
                  local.get 2
                  i32.const 8
                  i32.add
                  i32.const 2
                  call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                  local.get 2
                  i32.const 10
                  i32.store8 offset=24
                  local.get 2
                  i64.const 7234307576302018670
                  i64.store offset=16 align=1
                  local.get 2
                  i64.const 8028075845441778529
                  i64.store offset=8 align=1
                  local.get 2
                  i32.const 8
                  i32.add
                  i32.const 17
                  call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                  local.get 2
                  i32.const 10
                  i32.store8 offset=8
                  local.get 2
                  i32.const 8
                  i32.add
                  i32.const 1
                  call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                  unreachable
                  unreachable
                end
                local.get 2
                i32.const 32
                i32.store8 offset=44
                local.get 2
                i32.const 1701734764
                i32.store offset=40 align=1
                local.get 2
                i64.const 2338042707334751329
                i64.store offset=32 align=1
                local.get 2
                i64.const 2338600898263348341
                i64.store offset=24 align=1
                local.get 2
                i64.const 7162263158133189730
                i64.store offset=16 align=1
                local.get 2
                i64.const 7018969289221893749
                i64.store offset=8 align=1
                local.get 2
                i32.const 8
                i32.add
                i32.const 37
                call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                i32.const 2203
                call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
                local.get 2
                i32.const 8250
                i32.store16 offset=8 align=1
                local.get 2
                i32.const 8
                i32.add
                i32.const 2
                call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                local.get 2
                i32.const 10
                i32.store8 offset=24
                local.get 2
                i64.const 7234307576302018670
                i64.store offset=16 align=1
                local.get 2
                i64.const 8028075845441778529
                i64.store offset=8 align=1
                local.get 2
                i32.const 8
                i32.add
                i32.const 17
                call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                local.get 2
                i32.const 10
                i32.store8 offset=8
                local.get 2
                i32.const 8
                i32.add
                i32.const 1
                call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
                unreachable
                unreachable
              end
              local.get 3
              local.get 3
              i32.load
              i32.const -1
              i32.add
              i32.store
            end
            local.get 2
            i32.const 48
            i32.add
            global.set $__stack_pointer
            i32.const 0
            return
          end
          local.get 2
          i32.const 32
          i32.store8 offset=44
          local.get 2
          i32.const 1701734764
          i32.store offset=40 align=1
          local.get 2
          i64.const 2338042707334751329
          i64.store offset=32 align=1
          local.get 2
          i64.const 2338600898263348341
          i64.store offset=24 align=1
          local.get 2
          i64.const 7162263158133189730
          i64.store offset=16 align=1
          local.get 2
          i64.const 7018969289221893749
          i64.store offset=8 align=1
          local.get 2
          i32.const 8
          i32.add
          i32.const 37
          call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
          i32.const 2201
          call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
          local.get 2
          i32.const 10
          i32.store8 offset=8
          local.get 2
          i32.const 8
          i32.add
          i32.const 1
          call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
          unreachable
          unreachable
        end
        local.get 2
        i32.const 32
        i32.store8 offset=44
        local.get 2
        i32.const 1701734764
        i32.store offset=40 align=1
        local.get 2
        i64.const 2338042707334751329
        i64.store offset=32 align=1
        local.get 2
        i64.const 2338600898263348341
        i64.store offset=24 align=1
        local.get 2
        i64.const 7162263158133189730
        i64.store offset=16 align=1
        local.get 2
        i64.const 7018969289221893749
        i64.store offset=8 align=1
        local.get 2
        i32.const 8
        i32.add
        i32.const 37
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        i32.const 2202
        call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
        local.get 2
        i32.const 8250
        i32.store16 offset=8 align=1
        local.get 2
        i32.const 8
        i32.add
        i32.const 2
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        local.get 2
        i32.const 10
        i32.store8 offset=24
        local.get 2
        i64.const 7234307576302018670
        i64.store offset=16 align=1
        local.get 2
        i64.const 8028075845441778529
        i64.store offset=8 align=1
        local.get 2
        i32.const 8
        i32.add
        i32.const 17
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        local.get 2
        i32.const 10
        i32.store8 offset=8
        local.get 2
        i32.const 8
        i32.add
        i32.const 1
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        unreachable
        unreachable
      end
      local.get 2
      i32.const 32
      i32.store8 offset=44
      local.get 2
      i32.const 1701734764
      i32.store offset=40 align=1
      local.get 2
      i64.const 2338042707334751329
      i64.store offset=32 align=1
      local.get 2
      i64.const 2338600898263348341
      i64.store offset=24 align=1
      local.get 2
      i64.const 7162263158133189730
      i64.store offset=16 align=1
      local.get 2
      i64.const 7018969289221893749
      i64.store offset=8 align=1
      local.get 2
      i32.const 8
      i32.add
      i32.const 37
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      i32.const 147
      call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
      local.get 2
      i32.const 8250
      i32.store16 offset=8 align=1
      local.get 2
      i32.const 8
      i32.add
      i32.const 2
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 2
      i32.const 10
      i32.store8 offset=18
      local.get 2
      i32.const 25956
      i32.store16 offset=16 align=1
      local.get 2
      i64.const 8029109313507521121
      i64.store offset=8 align=1
      local.get 2
      i32.const 8
      i32.add
      i32.const 11
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      local.get 2
      i32.const 10
      i32.store8 offset=8
      local.get 2
      i32.const 8
      i32.add
      i32.const 1
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      unreachable
      unreachable
    end
    local.get 2
    i32.const 32
    i32.store8 offset=44
    local.get 2
    i32.const 1701734764
    i32.store offset=40 align=1
    local.get 2
    i64.const 2338042707334751329
    i64.store offset=32 align=1
    local.get 2
    i64.const 2338600898263348341
    i64.store offset=24 align=1
    local.get 2
    i64.const 7162263158133189730
    i64.store offset=16 align=1
    local.get 2
    i64.const 7018969289221893749
    i64.store offset=8 align=1
    local.get 2
    i32.const 8
    i32.add
    i32.const 37
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    i32.const 151
    call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
    local.get 2
    i32.const 8250
    i32.store16 offset=8 align=1
    local.get 2
    i32.const 8
    i32.add
    i32.const 2
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 2
    i32.const 10
    i32.store8 offset=32
    local.get 2
    i64.const 8243107283213623410
    i64.store offset=24 align=1
    local.get 2
    i64.const 7307218417350680677
    i64.store offset=16 align=1
    local.get 2
    i64.const 8390050488160450159
    i64.store offset=8 align=1
    local.get 2
    i32.const 8
    i32.add
    i32.const 25
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 2
    i32.const 10
    i32.store8 offset=8
    local.get 2
    i32.const 8
    i32.add
    i32.const 1
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    unreachable
    unreachable
  )
  (func $_ZN22wasi_snapshot_preview15State3new17h28b739cf9a9d6feaE (;25;) (type 8) (result i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 0
    global.set $__stack_pointer
    block ;; label = @1
      call $get_allocation_state
      i32.const 2
      i32.ne
      br_if 0 (;@1;)
      i32.const 3
      call $set_allocation_state
      i32.const 0
      i32.const 0
      i32.const 8
      i32.const 65536
      call $_ZN22wasi_snapshot_preview15State3new12cabi_realloc17h56b5c7c3102816d7E
      local.set 1
      i32.const 4
      call $set_allocation_state
      local.get 1
      i64.const 0
      i64.store offset=12 align=4
      local.get 1
      i32.const 560490357
      i32.store offset=8
      local.get 1
      i32.const 0
      i32.store
      local.get 1
      i32.const 20
      i32.add
      i64.const 0
      i64.store align=4
      local.get 1
      i64.const 0
      i64.store offset=65488 align=4
      local.get 1
      i32.const 0
      i32.store offset=65480
      local.get 1
      i32.const 0
      i32.store offset=65212
      local.get 1
      i64.const 0
      i64.store offset=65200 align=4
      local.get 1
      i32.const 2
      i32.store offset=6180
      local.get 1
      i32.const 65496
      i32.add
      i64.const 0
      i64.store align=4
      local.get 1
      i32.const 65504
      i32.add
      i64.const 0
      i64.store align=4
      local.get 1
      i32.const 65509
      i32.add
      i64.const 0
      i64.store align=1
      local.get 1
      i32.const 560490357
      i32.store offset=65532
      local.get 1
      i32.const 11822
      i32.store16 offset=65528
      local.get 1
      i32.const 0
      i32.store offset=65520
      local.get 0
      i32.const 48
      i32.add
      global.set $__stack_pointer
      local.get 1
      return
    end
    local.get 0
    i32.const 32
    i32.store8 offset=47
    local.get 0
    i32.const 1701734764
    i32.store offset=43 align=1
    local.get 0
    i64.const 2338042707334751329
    i64.store offset=35 align=1
    local.get 0
    i64.const 2338600898263348341
    i64.store offset=27 align=1
    local.get 0
    i64.const 7162263158133189730
    i64.store offset=19 align=1
    local.get 0
    i64.const 7018969289221893749
    i64.store offset=11 align=1
    local.get 0
    i32.const 11
    i32.add
    i32.const 37
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    i32.const 2246
    call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
    local.get 0
    i32.const 8250
    i32.store16 offset=11 align=1
    local.get 0
    i32.const 11
    i32.add
    i32.const 2
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 0
    i32.const 10
    i32.store8 offset=27
    local.get 0
    i64.const 7234307576302018670
    i64.store offset=19 align=1
    local.get 0
    i64.const 8028075845441778529
    i64.store offset=11 align=1
    local.get 0
    i32.const 11
    i32.add
    i32.const 17
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    local.get 0
    i32.const 10
    i32.store8 offset=11
    local.get 0
    i32.const 11
    i32.add
    i32.const 1
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    unreachable
    unreachable
  )
  (func $_ZN22wasi_snapshot_preview18bindings4exit4exit17h5a273dd69824ced2E (;26;) (type 0) (param i32)
    local.get 0
    call $_ZN22wasi_snapshot_preview18bindings4exit4exit10wit_import17hb410d1c9564402c1E
  )
  (func $_ZN4core3ptr68drop_in_place$LT$wasi_snapshot_preview1..descriptors..Descriptor$GT$17h6cdf162902a62932E.llvm.8737479026555142187 (;27;) (type 0) (param i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 1
    global.set $__stack_pointer
    block ;; label = @1
      local.get 0
      i32.load
      i32.eqz
      br_if 0 (;@1;)
      block ;; label = @2
        local.get 0
        i32.load offset=8
        i32.const 1
        i32.ne
        br_if 0 (;@2;)
        local.get 0
        i32.const 12
        i32.add
        i32.load
        call $_ZN22wasi_snapshot_preview18bindings7streams17drop_input_stream10wit_import17h0ba18a7881cc7ccdE
      end
      block ;; label = @2
        local.get 0
        i32.const 16
        i32.add
        i32.load
        i32.const 1
        i32.ne
        br_if 0 (;@2;)
        local.get 0
        i32.const 20
        i32.add
        i32.load
        call $_ZN22wasi_snapshot_preview18bindings7streams18drop_output_stream10wit_import17h1b34324aca2dc78dE
      end
      block ;; label = @2
        block ;; label = @3
          local.get 0
          i32.const 40
          i32.add
          i32.load8_u
          local.tee 2
          i32.const -2
          i32.add
          i32.const 1
          local.get 2
          i32.const 1
          i32.gt_u
          select
          i32.const 255
          i32.and
          br_table 2 (;@1;) 1 (;@2;) 0 (;@3;) 2 (;@1;)
        end
        local.get 1
        i32.const 32
        i32.store8 offset=47
        local.get 1
        i32.const 1701734764
        i32.store offset=43 align=1
        local.get 1
        i64.const 2338042707334751329
        i64.store offset=35 align=1
        local.get 1
        i64.const 2338600898263348341
        i64.store offset=27 align=1
        local.get 1
        i64.const 7162263158133189730
        i64.store offset=19 align=1
        local.get 1
        i64.const 7018969289221893749
        i64.store offset=11 align=1
        local.get 1
        i32.const 11
        i32.add
        i32.const 37
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        i32.const 32
        call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
        local.get 1
        i32.const 10
        i32.store8 offset=11
        local.get 1
        i32.const 11
        i32.add
        i32.const 1
        call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
        unreachable
        unreachable
      end
      local.get 0
      i32.const 24
      i32.add
      i32.load
      call $_ZN22wasi_snapshot_preview18bindings10filesystem15drop_descriptor10wit_import17h15d3d17e1804a33bE
    end
    local.get 1
    i32.const 48
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN22wasi_snapshot_preview111descriptors7Streams16get_write_stream17h56c746ccc014c727E (;28;) (type 1) (param i32 i32)
    (local i32 i32)
    block ;; label = @1
      block ;; label = @2
        block ;; label = @3
          block ;; label = @4
            block ;; label = @5
              local.get 1
              i32.load offset=8
              i32.const 1
              i32.eq
              br_if 0 (;@5;)
              local.get 1
              i32.const 32
              i32.add
              i32.load8_u
              local.tee 2
              i32.const 29
              i32.shl
              i32.const 29
              i32.shr_s
              i32.const 0
              i32.lt_s
              br_if 1 (;@4;)
              local.get 2
              i32.const 2
              i32.eq
              br_if 1 (;@4;)
              local.get 1
              i32.const 20
              i32.add
              i32.load8_u
              i32.const 3
              i32.ne
              br_if 2 (;@3;)
              local.get 0
              i32.const 8
              i32.store16 offset=2
              i32.const 1
              local.set 1
              br 4 (;@1;)
            end
            local.get 0
            local.get 1
            i32.const 12
            i32.add
            i32.load
            i32.store offset=4
            br 2 (;@2;)
          end
          local.get 0
          i32.const 8
          i32.store16 offset=2
          i32.const 1
          local.set 1
          br 2 (;@1;)
        end
        local.get 1
        i32.load offset=16
        local.set 3
        block ;; label = @3
          block ;; label = @4
            local.get 2
            br_if 0 (;@4;)
            local.get 3
            local.get 1
            i32.const 24
            i32.add
            i64.load
            call $_ZN22wasi_snapshot_preview18bindings10filesystem16write_via_stream10wit_import17he4aa1e75d1f3ff3fE
            local.set 2
            br 1 (;@3;)
          end
          local.get 3
          call $_ZN22wasi_snapshot_preview18bindings10filesystem17append_via_stream10wit_import17h1ae8ea36ec0e3411E
          local.set 2
        end
        local.get 1
        i32.const 1
        i32.store offset=8
        local.get 0
        local.get 2
        i32.store offset=4
        local.get 1
        i32.const 12
        i32.add
        local.get 2
        i32.store
      end
      i32.const 0
      local.set 1
    end
    local.get 0
    local.get 1
    i32.store16
  )
  (func $_ZN22wasi_snapshot_preview111descriptors11Descriptors3new17h04c2effa43cd9ca8E (;29;) (type 2) (param i32 i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    global.get $__stack_pointer
    i32.const 64
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    local.get 0
    i32.const 0
    i32.store offset=6156
    local.get 0
    i32.const 0
    i32.store offset=6148
    local.get 3
    i32.const 16
    i32.add
    call $_ZN22wasi_snapshot_preview18bindings8preopens9get_stdio10wit_import17h957ce2cff126d882E
    local.get 3
    i32.load offset=20
    local.set 4
    local.get 3
    i32.load offset=16
    local.set 5
    local.get 3
    i32.const 24
    i32.add
    i32.load
    local.tee 6
    call $set_stderr_stream
    local.get 0
    i32.const 2
    i32.store8 offset=40
    local.get 0
    i32.const 0
    i32.store offset=16
    local.get 0
    local.get 5
    i32.store offset=12
    local.get 0
    i32.const 1
    i32.store offset=8
    local.get 0
    i32.const 1
    i32.store
    local.get 3
    i32.const 0
    i32.store offset=20
    local.get 3
    i32.const 0
    i32.store16 offset=16
    local.get 3
    i32.const 16
    i32.add
    call $_ZN101_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h5fda775cac00d653E
    drop
    local.get 3
    i32.const 56
    i32.add
    local.tee 5
    i32.const 2
    i32.store8
    local.get 3
    i32.const 36
    i32.add
    local.tee 7
    local.get 4
    i32.store
    local.get 3
    i32.const 32
    i32.add
    local.tee 4
    i32.const 1
    i32.store
    local.get 3
    i32.const 0
    i32.store offset=24
    local.get 3
    i32.const 1
    i32.store offset=16
    local.get 0
    i32.const 48
    i32.add
    local.get 3
    i32.const 16
    i32.add
    i32.const 48
    call $memcpy
    drop
    local.get 3
    i32.const 0
    i32.store16 offset=8
    local.get 3
    i32.const 1
    i32.store offset=12
    local.get 3
    i32.const 8
    i32.add
    call $_ZN101_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h5fda775cac00d653E
    drop
    local.get 5
    i32.const 2
    i32.store8
    local.get 7
    local.get 6
    i32.store
    local.get 4
    i32.const 1
    i32.store
    local.get 3
    i32.const 0
    i32.store offset=24
    local.get 3
    i32.const 1
    i32.store offset=16
    local.get 0
    i32.const 96
    i32.add
    local.get 3
    i32.const 16
    i32.add
    i32.const 48
    call $memcpy
    drop
    i32.const 3
    local.set 4
    local.get 0
    i32.const 3
    i32.store16 offset=6144
    local.get 3
    i32.const 2
    i32.store offset=12
    local.get 3
    i32.const 0
    i32.store16 offset=8
    local.get 3
    i32.const 8
    i32.add
    call $_ZN101_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h5fda775cac00d653E
    drop
    local.get 3
    i64.const 0
    i64.store
    local.get 1
    local.get 2
    local.get 3
    call $_ZN22wasi_snapshot_preview111ImportAlloc10with_arena17hc46d8ae8b753790bE
    local.get 3
    i32.load
    local.set 8
    block ;; label = @1
      local.get 3
      i32.load offset=4
      local.tee 9
      i32.eqz
      br_if 0 (;@1;)
      local.get 9
      i32.const 12
      i32.mul
      local.set 1
      local.get 3
      i32.const 16
      i32.add
      i32.const 1
      i32.or
      local.set 7
      local.get 8
      local.set 2
      loop ;; label = @2
        local.get 2
        i32.load
        local.tee 5
        local.get 3
        i32.const 16
        i32.add
        call $_ZN22wasi_snapshot_preview18bindings10filesystem8get_type10wit_import17he3867288d707506cE
        local.get 3
        i32.load8_u offset=16
        i32.const 0
        i32.ne
        local.get 7
        i32.load8_u
        call $_ZN101_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h53e2d47972c41cceE
        local.set 6
        local.get 3
        i32.const 0
        i32.store8 offset=56
        local.get 3
        i64.const 0
        i64.store offset=48
        local.get 3
        local.get 5
        i32.store offset=40
        local.get 3
        i32.const 0
        i32.store offset=32
        local.get 3
        i32.const 0
        i32.store offset=24
        local.get 3
        i32.const 1
        i32.store offset=16
        local.get 3
        local.get 6
        i32.const 255
        i32.and
        i32.store8 offset=44
        block ;; label = @3
          block ;; label = @4
            local.get 4
            i32.const 65535
            i32.and
            local.tee 5
            i32.const 128
            i32.lt_u
            br_if 0 (;@4;)
            local.get 3
            i32.const 3145729
            i32.store offset=8
            local.get 3
            i32.const 16
            i32.add
            call $_ZN4core3ptr68drop_in_place$LT$wasi_snapshot_preview1..descriptors..Descriptor$GT$17h6cdf162902a62932E.llvm.8737479026555142187
            br 1 (;@3;)
          end
          local.get 0
          local.get 5
          i32.const 48
          i32.mul
          i32.add
          local.get 3
          i32.const 16
          i32.add
          i32.const 48
          call $memcpy
          drop
          local.get 0
          local.get 4
          i32.const 1
          i32.add
          local.tee 4
          i32.store16 offset=6144
          local.get 3
          local.get 5
          i32.store offset=12
          local.get 3
          i32.const 0
          i32.store16 offset=8
        end
        local.get 2
        i32.const 12
        i32.add
        local.set 2
        local.get 3
        i32.const 8
        i32.add
        call $_ZN101_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h5fda775cac00d653E
        drop
        local.get 1
        i32.const -12
        i32.add
        local.tee 1
        br_if 0 (;@2;)
      end
    end
    local.get 0
    local.get 8
    i32.store offset=6156
    local.get 0
    i32.const 6160
    i32.add
    local.get 9
    i32.store
    local.get 3
    i32.const 64
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN101_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h53e2d47972c41cceE (;30;) (type 10) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      local.get 0
      br_if 0 (;@1;)
      local.get 2
      i32.const 48
      i32.add
      global.set $__stack_pointer
      local.get 1
      return
    end
    local.get 2
    i32.const 32
    i32.store8 offset=47
    local.get 2
    i32.const 1701734764
    i32.store offset=43 align=1
    local.get 2
    i64.const 2338042707334751329
    i64.store offset=35 align=1
    local.get 2
    i64.const 2338600898263348341
    i64.store offset=27 align=1
    local.get 2
    i64.const 7162263158133189730
    i64.store offset=19 align=1
    local.get 2
    i64.const 7018969289221893749
    i64.store offset=11 align=1
    local.get 2
    i32.const 11
    i32.add
    i32.const 37
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    i32.const 66
    call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
    local.get 2
    i32.const 10
    i32.store8 offset=11
    local.get 2
    i32.const 11
    i32.add
    i32.const 1
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    unreachable
    unreachable
  )
  (func $_ZN101_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h5fda775cac00d653E (;31;) (type 4) (param i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 1
    global.set $__stack_pointer
    block ;; label = @1
      local.get 0
      i32.load16_u
      br_if 0 (;@1;)
      local.get 0
      i32.load offset=4
      local.set 0
      local.get 1
      i32.const 48
      i32.add
      global.set $__stack_pointer
      local.get 0
      return
    end
    local.get 1
    i32.const 32
    i32.store8 offset=47
    local.get 1
    i32.const 1701734764
    i32.store offset=43 align=1
    local.get 1
    i64.const 2338042707334751329
    i64.store offset=35 align=1
    local.get 1
    i64.const 2338600898263348341
    i64.store offset=27 align=1
    local.get 1
    i64.const 7162263158133189730
    i64.store offset=19 align=1
    local.get 1
    i64.const 7018969289221893749
    i64.store offset=11 align=1
    local.get 1
    i32.const 11
    i32.add
    i32.const 37
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    i32.const 66
    call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
    local.get 1
    i32.const 10
    i32.store8 offset=11
    local.get 1
    i32.const 11
    i32.add
    i32.const 1
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    unreachable
    unreachable
  )
  (func $_ZN101_$LT$core..result..Result$LT$T$C$E$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h6f759e3f8235d62dE (;32;) (type 10) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      local.get 0
      br_if 0 (;@1;)
      local.get 2
      i32.const 48
      i32.add
      global.set $__stack_pointer
      local.get 1
      return
    end
    local.get 2
    i32.const 32
    i32.store8 offset=47
    local.get 2
    i32.const 1701734764
    i32.store offset=43 align=1
    local.get 2
    i64.const 2338042707334751329
    i64.store offset=35 align=1
    local.get 2
    i64.const 2338600898263348341
    i64.store offset=27 align=1
    local.get 2
    i64.const 7162263158133189730
    i64.store offset=19 align=1
    local.get 2
    i64.const 7018969289221893749
    i64.store offset=11 align=1
    local.get 2
    i32.const 11
    i32.add
    i32.const 37
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    i32.const 66
    call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
    local.get 2
    i32.const 10
    i32.store8 offset=11
    local.get 2
    i32.const 11
    i32.add
    i32.const 1
    call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
    unreachable
    unreachable
  )
  (func $_ZN22wasi_snapshot_preview18bindings7streams5write17h66900a9084128928E (;33;) (type 3) (param i32 i32 i32 i32)
    (local i32 i64 i64)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 4
    global.set $__stack_pointer
    local.get 1
    local.get 2
    local.get 3
    local.get 4
    call $_ZN22wasi_snapshot_preview18bindings7streams5write10wit_import17h9a9cd40dae3dff24E
    block ;; label = @1
      block ;; label = @2
        local.get 4
        i32.load8_u
        i32.eqz
        br_if 0 (;@2;)
        i64.const 1
        local.set 5
        br 1 (;@1;)
      end
      local.get 4
      i32.const 8
      i32.add
      i64.load
      local.set 6
      i64.const 0
      local.set 5
    end
    local.get 0
    local.get 6
    i64.store offset=8
    local.get 0
    local.get 5
    i64.store
    local.get 4
    i32.const 16
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN97_$LT$core..option..Option$LT$T$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h435a00f44ab35638E (;34;) (type 2) (param i32 i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 3
    global.set $__stack_pointer
    block ;; label = @1
      local.get 1
      br_if 0 (;@1;)
      local.get 3
      i32.const 32
      i32.store8 offset=47
      local.get 3
      i32.const 1701734764
      i32.store offset=43 align=1
      local.get 3
      i64.const 2338042707334751329
      i64.store offset=35 align=1
      local.get 3
      i64.const 2338600898263348341
      i64.store offset=27 align=1
      local.get 3
      i64.const 7162263158133189730
      i64.store offset=19 align=1
      local.get 3
      i64.const 7018969289221893749
      i64.store offset=11 align=1
      local.get 3
      i32.const 11
      i32.add
      i32.const 37
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      i32.const 57
      call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
      local.get 3
      i32.const 10
      i32.store8 offset=11
      local.get 3
      i32.const 11
      i32.add
      i32.const 1
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      unreachable
      unreachable
    end
    local.get 0
    local.get 2
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store
    local.get 3
    i32.const 48
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN97_$LT$core..option..Option$LT$T$GT$$u20$as$u20$wasi_snapshot_preview1..TrappingUnwrap$LT$T$GT$$GT$15trapping_unwrap17h977c3ade6004d22cE (;35;) (type 10) (param i32 i32) (result i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 48
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    block ;; label = @1
      local.get 0
      br_if 0 (;@1;)
      local.get 2
      i32.const 32
      i32.store8 offset=47
      local.get 2
      i32.const 1701734764
      i32.store offset=43 align=1
      local.get 2
      i64.const 2338042707334751329
      i64.store offset=35 align=1
      local.get 2
      i64.const 2338600898263348341
      i64.store offset=27 align=1
      local.get 2
      i64.const 7162263158133189730
      i64.store offset=19 align=1
      local.get 2
      i64.const 7018969289221893749
      i64.store offset=11 align=1
      local.get 2
      i32.const 11
      i32.add
      i32.const 37
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      i32.const 57
      call $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E
      local.get 2
      i32.const 10
      i32.store8 offset=11
      local.get 2
      i32.const 11
      i32.add
      i32.const 1
      call $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E
      unreachable
      unreachable
    end
    local.get 2
    i32.const 48
    i32.add
    global.set $__stack_pointer
    local.get 1
  )
  (func $_ZN22wasi_snapshot_preview16macros5print17h896fa5783b92d653E (;36;) (type 1) (param i32 i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 16
    i32.sub
    local.tee 2
    global.set $__stack_pointer
    call $get_stderr_stream
    local.get 0
    local.get 1
    local.get 2
    call $_ZN22wasi_snapshot_preview18bindings7streams5write10wit_import17h9a9cd40dae3dff24E
    local.get 2
    i32.const 16
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN22wasi_snapshot_preview16macros10eprint_u3217haef7485598058920E (;37;) (type 0) (param i32)
    (local i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 1
    global.set $__stack_pointer
    block ;; label = @1
      block ;; label = @2
        local.get 0
        br_if 0 (;@2;)
        local.get 1
        i32.const 48
        i32.store8 offset=15
        call $get_stderr_stream
        local.get 1
        i32.const 15
        i32.add
        i32.const 1
        local.get 1
        i32.const 16
        i32.add
        call $_ZN22wasi_snapshot_preview18bindings7streams5write10wit_import17h9a9cd40dae3dff24E
        br 1 (;@1;)
      end
      local.get 0
      call $_ZN22wasi_snapshot_preview16macros10eprint_u3215eprint_u32_impl17h4f83132a9f4a3d61E.llvm.1804947642514527633
    end
    local.get 1
    i32.const 32
    i32.add
    global.set $__stack_pointer
  )
  (func $_ZN22wasi_snapshot_preview16macros10eprint_u3215eprint_u32_impl17h4f83132a9f4a3d61E.llvm.1804947642514527633 (;38;) (type 0) (param i32)
    (local i32 i32)
    global.get $__stack_pointer
    i32.const 32
    i32.sub
    local.tee 1
    global.set $__stack_pointer
    block ;; label = @1
      local.get 0
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.const 10
      i32.div_u
      local.tee 2
      call $_ZN22wasi_snapshot_preview16macros10eprint_u3215eprint_u32_impl17h4f83132a9f4a3d61E.llvm.1804947642514527633
      local.get 1
      local.get 0
      local.get 2
      i32.const 10
      i32.mul
      i32.sub
      i32.const 48
      i32.or
      i32.store8 offset=15
      call $get_stderr_stream
      local.get 1
      i32.const 15
      i32.add
      i32.const 1
      local.get 1
      i32.const 16
      i32.add
      call $_ZN22wasi_snapshot_preview18bindings7streams5write10wit_import17h9a9cd40dae3dff24E
    end
    local.get 1
    i32.const 32
    i32.add
    global.set $__stack_pointer
  )
  (func $get_state_ptr (;39;) (type 8) (result i32)
    global.get $internal_state_ptr
  )
  (func $set_state_ptr (;40;) (type 0) (param i32)
    local.get 0
    global.set $internal_state_ptr
  )
  (func $get_allocation_state (;41;) (type 8) (result i32)
    global.get $allocation_state
  )
  (func $set_allocation_state (;42;) (type 0) (param i32)
    local.get 0
    global.set $allocation_state
  )
  (func $get_stderr_stream (;43;) (type 8) (result i32)
    global.get $stderr_stream
  )
  (func $set_stderr_stream (;44;) (type 0) (param i32)
    local.get 0
    global.set $stderr_stream
  )
  (func $memcpy (;45;) (type 9) (param i32 i32 i32) (result i32)
    local.get 0
    local.get 1
    local.get 2
    call $_ZN17compiler_builtins3mem6memcpy17hc062a3a8dcc986ceE
  )
  (func $_ZN17compiler_builtins3mem6memcpy17hc062a3a8dcc986ceE (;46;) (type 9) (param i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32)
    block ;; label = @1
      block ;; label = @2
        local.get 2
        i32.const 15
        i32.gt_u
        br_if 0 (;@2;)
        local.get 0
        local.set 3
        br 1 (;@1;)
      end
      local.get 0
      i32.const 0
      local.get 0
      i32.sub
      i32.const 3
      i32.and
      local.tee 4
      i32.add
      local.set 5
      block ;; label = @2
        local.get 4
        i32.eqz
        br_if 0 (;@2;)
        local.get 0
        local.set 3
        local.get 1
        local.set 6
        loop ;; label = @3
          local.get 3
          local.get 6
          i32.load8_u
          i32.store8
          local.get 6
          i32.const 1
          i32.add
          local.set 6
          local.get 3
          i32.const 1
          i32.add
          local.tee 3
          local.get 5
          i32.lt_u
          br_if 0 (;@3;)
        end
      end
      local.get 5
      local.get 2
      local.get 4
      i32.sub
      local.tee 7
      i32.const -4
      i32.and
      local.tee 8
      i32.add
      local.set 3
      block ;; label = @2
        block ;; label = @3
          local.get 1
          local.get 4
          i32.add
          local.tee 9
          i32.const 3
          i32.and
          local.tee 6
          i32.eqz
          br_if 0 (;@3;)
          local.get 8
          i32.const 1
          i32.lt_s
          br_if 1 (;@2;)
          local.get 9
          i32.const -4
          i32.and
          local.tee 10
          i32.const 4
          i32.add
          local.set 1
          i32.const 0
          local.get 6
          i32.const 3
          i32.shl
          local.tee 2
          i32.sub
          i32.const 24
          i32.and
          local.set 4
          local.get 10
          i32.load
          local.set 6
          loop ;; label = @4
            local.get 5
            local.get 6
            local.get 2
            i32.shr_u
            local.get 1
            i32.load
            local.tee 6
            local.get 4
            i32.shl
            i32.or
            i32.store
            local.get 1
            i32.const 4
            i32.add
            local.set 1
            local.get 5
            i32.const 4
            i32.add
            local.tee 5
            local.get 3
            i32.lt_u
            br_if 0 (;@4;)
            br 2 (;@2;)
          end
        end
        local.get 8
        i32.const 1
        i32.lt_s
        br_if 0 (;@2;)
        local.get 9
        local.set 1
        loop ;; label = @3
          local.get 5
          local.get 1
          i32.load
          i32.store
          local.get 1
          i32.const 4
          i32.add
          local.set 1
          local.get 5
          i32.const 4
          i32.add
          local.tee 5
          local.get 3
          i32.lt_u
          br_if 0 (;@3;)
        end
      end
      local.get 7
      i32.const 3
      i32.and
      local.set 2
      local.get 9
      local.get 8
      i32.add
      local.set 1
    end
    block ;; label = @1
      local.get 2
      i32.eqz
      br_if 0 (;@1;)
      local.get 3
      local.get 2
      i32.add
      local.set 5
      loop ;; label = @2
        local.get 3
        local.get 1
        i32.load8_u
        i32.store8
        local.get 1
        i32.const 1
        i32.add
        local.set 1
        local.get 3
        i32.const 1
        i32.add
        local.tee 3
        local.get 5
        i32.lt_u
        br_if 0 (;@2;)
      end
    end
    local.get 0
  )
  (func $allocate_stack (;47;) (type 11)
    global.get $allocation_state
    i32.const 0
    i32.eq
    if ;; label = @1
      i32.const 1
      global.set $allocation_state
      i32.const 0
      i32.const 0
      i32.const 8
      i32.const 65536
      call $_ZN22wasi_snapshot_preview15State3new12cabi_realloc17h56b5c7c3102816d7E
      i32.const 65536
      i32.add
      global.set $__stack_pointer
      i32.const 2
      global.set $allocation_state
    end
  )
  (global $__stack_pointer (;0;) (mut i32) i32.const 0)
  (global $internal_state_ptr (;1;) (mut i32) i32.const 0)
  (global $allocation_state (;2;) (mut i32) i32.const 0)
  (global $stderr_stream (;3;) (mut i32) i32.const 123)
  (export "cabi_import_realloc" (func $cabi_import_realloc))
  (export "cabi_export_realloc" (func $cabi_export_realloc))
  (export "random_get" (func $random_get))
  (export "proc_exit" (func $proc_exit))
  (export "environ_get" (func $environ_get))
  (export "environ_sizes_get" (func $environ_sizes_get))
  (export "fd_write" (func $fd_write))
)