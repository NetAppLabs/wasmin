#!/bin/bash

PLATFORM=$1
if [ -n "$PLATFORM" ]; then
  # PLATFORM="linux/amd64"
  echo "Building for platform $PLATFORM"
  docker buildx build --platform $PLATFORM \
    -t wasmin:latest \
    .
else
  docker build -t wasmin:latest .
fi