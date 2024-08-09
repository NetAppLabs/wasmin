#!/bin/bash

get_post_data()
{
  cat <<EOF
{
    "greeting": "hello sh"
}
EOF
}

curl \
-H "Content-Type: application/json" \
-X POST http://localhost:5001/say-hello/John \
--data "$(get_post_data)"