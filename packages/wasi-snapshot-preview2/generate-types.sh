#!/bin/bash
set -e

JCO="$HOME/Development/netapp/wasm/jco/src/jco.js"
$JCO generate-types \
	--wit ./wit \
	--world command-extended \
	--pure-interface \
	--async-mode \
	-o src/async

$JCO generate-types \
    --wit ./wit \
    --world command-extended \
    --pure-interface \
    -o src/sync

