#!/bin/bash

set -e

if ! command -v jq 2>&1 ; then
    echo "please install jq"
    exit 1
fi

NODE_VERSION=$(cat local.settings.json | jq -r .Values.WEBSITE_NODE_DEFAULT_VERSION)
echo "Starting with node version: $NODE_VERSION"

export PATH="/opt/homebrew/opt/node@${NODE_VERSION}/bin:${PATH}"

func start --verbose
