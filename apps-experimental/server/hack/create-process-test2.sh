#!/bin/bash

get_post_data()
{
  cat <<EOF
{
    "cmd": "http://127.0.0.1:8080/go-endless.async.wasm"
}
EOF
}

curl \
-H "Content-Type: application/json" \
-X POST http://localhost:5001/processes \
--data "$(get_post_data)"
