#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run "check-ts" && npm run "lint-staged"
