#!/usr/bin/env bash

set -Eeuo pipefail

project_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$project_directory"

info() {
    printf '\n\033[1;34m%s\033[0m\n' "$1"
}

fail() {
    printf '\n\033[1;31mError: %s\033[0m\n' "$1" >&2
    exit 1
}

command -v docker >/dev/null 2>&1 || fail 'Docker is not installed.'

if ! docker info >/dev/null 2>&1; then
    info 'Docker is not running. The application is already stopped.'
    exit 0
fi

info 'Stopping the Sail containers'

if [[ -x ./vendor/bin/sail ]]; then
    ./vendor/bin/sail down --remove-orphans
else
    docker compose down --remove-orphans
fi

info 'Application stopped. Database volumes were preserved.'
