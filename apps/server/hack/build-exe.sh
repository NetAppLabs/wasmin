#!/bin/bash

mkdir -p exe || true

pkg -t node18-macos-x64 dist/server.cjs.js -o exe/server-macos-x86 -c pkg.json
#pkg -t node18-win-x64 dist/server.cjs.js -o exe/server-win-x86
#pkg -t node18-linuxstatic-x64 dist/server.cjs.js -o exe/server-linux-x86

#pkg -t node19-macos-x64 dist/server.cjs.js -o exe/server-macos-x86
