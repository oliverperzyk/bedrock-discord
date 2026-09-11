#!/usr/bin/env bash
# This script is used to deploy the project to the production environment.
# It deploys both applications - API and documentation website to production.
set -euo pipefail

cd "${VPS_DEPLOY_PATH:?VPS_DEPLOY_PATH is required}"

docker compose pull
docker compose up -d
docker image prune -f
