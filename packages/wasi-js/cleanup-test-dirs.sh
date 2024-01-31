#!/bin/bash

rm -rf tests/fixtures
git checkout tests/fixtures

rm -rf tests/wasi-testsuite/tests/rust/testsuite/fs-tests.dir/*.cleanup
rm -rf tests/wasi-testsuite/tests/c/testsuite/fs-tests.dir/*.cleanup
rm -rf tests/wasi-testsuite/tests/c/testsuite/fs-tests.dir/writeable/*.cleanup
