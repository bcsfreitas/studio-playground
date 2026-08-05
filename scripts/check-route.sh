#!/usr/bin/env bash
# Smoke-check a route against the running dev server.
#
# The repo has no test runner, so route assertions are how plan tasks verify
# their work. Checks status and body together because Nuxt renders a 200 for
# a page that threw during setup — status alone proves nothing.
#
# Usage: scripts/check-route.sh /learn/explore-godot "Explore: Godot"
set -uo pipefail

BASE="${BASE_URL:-http://localhost:3000}"
path="${1:?usage: check-route.sh <path> <expected-substring>}"
expected="${2:?usage: check-route.sh <path> <expected-substring>}"

body="$(mktemp)"
trap 'rm -f "$body"' EXIT

status="$(curl -sS -o "$body" -w '%{http_code}' "$BASE$path")" || {
  echo "FAIL $path — could not reach $BASE (is 'npm run dev' running?)"
  exit 1
}

if [ "$status" != "200" ]; then
  echo "FAIL $path — HTTP $status (expected 200)"
  exit 1
fi

if ! grep -qF -- "$expected" "$body"; then
  echo "FAIL $path — HTTP 200 but body is missing: $expected"
  exit 1
fi

echo "PASS $path — 200, found: $expected"
