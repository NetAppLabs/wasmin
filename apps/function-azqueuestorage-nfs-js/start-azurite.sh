#!/bin/bash

AZURITE_LOCATION="$HOME/.azurite"
mkdir -p $AZURITE_LOCATION

azurite --silent --location $AZURITE_LOCATION--debug $AZURITE_LOCATION/debug.log
