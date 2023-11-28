#!/bin/bash

#bun build ./apps/bun-shell/src/index.ts --compile --outfile wasmin-bun
#bun build ./apps/bun-shell/src/index.ts --compile --loader .js:js --outfile wasmin-bun
#bun build ./apps/bun-shell/src/index.ts --compile --loader .wjs:js --outfile wasmin-bun
bun build ./apps/bun-shell/dist/index.js --compile --loader .wjs:file --outfile wasmin-bun
#bun build ./apps/bun-shell/dist/index.js --compile --loader .js:file --outfile wasmin-bun
#cp ./apps/bun-shell/dist/wasmin-bun .
