#!/bin/bash
set -e

cd apps/bun-shell
rm -f dist/*.wasm
yarn build
sed_args=""
for from in `egrep -o "\./.*\.wasm" app.js `; do
   to=$(find . -name "$(echo $from | sed -e 's/\.\///g' -e 's/00000000/\*/')")
   to=$(echo $to | sed -e 's/\.\/dist\///g' -e 's/\./\\\./g')
   from=$(echo $from | sed -e 's/\.\///g' -e 's/\./\\\./g')
   sed_args="$sed_args -e 's/$from/$to/g'"
done
cat app.js | bash -c "sed $sed_args" > dist/app.js
cd ../..

bun build ./apps/bun-shell/dist/app.js --compile --asset-naming="[name].[ext]" --outfile=wasmin-bun