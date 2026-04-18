#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/srv/tofu-ray-commerce}"
BRANCH="${BRANCH:-main}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

cd "$APP_DIR"

if [[ ! -d .git ]]; then
  echo "Not a git repository: $APP_DIR"
  exit 1
fi

PREVIOUS_COMMIT="$(git rev-parse HEAD)"
ROLLBACK_NEEDED=true

rollback() {
  if [[ "$ROLLBACK_NEEDED" != "true" ]]; then
    return
  fi

  echo "Deployment failed. Rolling back to $PREVIOUS_COMMIT"
  git fetch --all
  git checkout "$PREVIOUS_COMMIT"
  docker compose -f "$COMPOSE_FILE" up -d --build --remove-orphans
}

trap rollback ERR

echo "Deploying branch: $BRANCH"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

docker compose -f "$COMPOSE_FILE" up -d --build --remove-orphans

for i in {1..30}; do
  if curl -fsS http://127.0.0.1:3000/health > /dev/null; then
    echo "Deployment health check passed"
    ROLLBACK_NEEDED=false
    echo "$(git rev-parse HEAD)" > .deployed_commit
    exit 0
  fi
  sleep 2
done

echo "Deployment health check failed"
exit 1
