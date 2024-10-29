#!/bin/sh

if [ "$NODE_ENVIRONMENT" = "development" ]; then
    echo "Starting in watch mode…"
    node --watch dist/main.js
else
    echo "Starting in production mode with Node…"
    node dist/main.js
fi
