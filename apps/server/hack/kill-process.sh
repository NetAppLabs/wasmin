#!/bin/bash

pid=$1

if [ -z "${pid}" ]; then
	echo "please give process id as argument"
	exit 1
fi

get_post_data()
{
  cat <<EOF
{
}
EOF
}

curl \
-H "Content-Type: application/json" \
-X POST http://localhost:5001/processes/${pid} \
--data "$(get_post_data)"
