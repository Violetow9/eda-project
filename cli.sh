#!/bin/sh

docker compose exec api npm run cli -- "$@"