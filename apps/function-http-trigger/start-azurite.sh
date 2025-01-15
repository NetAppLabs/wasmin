#!/bin/bash
set -e

if ! command -v azurite 2>&1 ; then
    echo "please install azurite"
    exit 1
fi

AZURITE_LOCATION="$HOME/.azurite"
mkdir -p $AZURITE_LOCATION

azurite --silent --location $AZURITE_LOCATION--debug $AZURITE_LOCATION/debug.log
