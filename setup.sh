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

set_environment_value() {
    local key="$1"
    local value="$2"
    local temporary_file

    temporary_file="$(mktemp "${TMPDIR:-/tmp}/stcs-workshop-env.XXXXXX")"

    awk -v key="$key" -v value="$value" '
        BEGIN { found = 0 }
        $0 ~ "^" key "=" {
            print key "=" value
            found = 1
            next
        }
        { print }
        END {
            if (! found) {
                print key "=" value
            }
        }
    ' .env > "$temporary_file"

    mv "$temporary_file" .env
}

command -v docker >/dev/null 2>&1 || fail 'Docker is not installed.'

docker info >/dev/null 2>&1 || fail 'Docker is not running. Start Docker Desktop and run this script again.'

if [[ ! -f .env ]]; then
    info 'Creating .env from .env.example'
    cp .env.example .env
fi

info 'Configuring the local Sail environment'
set_environment_value APP_URL http://localhost:8001
set_environment_value APP_PORT 8001
set_environment_value DB_CONNECTION pgsql
set_environment_value DB_HOST pgsql
set_environment_value DB_PORT 5432
set_environment_value DB_DATABASE laravel
set_environment_value DB_USERNAME sail
set_environment_value DB_PASSWORD password

info 'Bootstrapping PHP dependencies'
docker run --rm \
    --user "$(id -u):$(id -g)" \
    --volume "$project_directory:/app" \
    --workdir /app \
    composer:2 \
    install --no-interaction --ignore-platform-reqs --no-scripts

[[ -x ./vendor/bin/sail ]] || fail 'Laravel Sail was not installed by Composer.'

info 'Building the Sail application image'
./vendor/bin/sail build laravel.test

info 'Starting the Sail containers'
./vendor/bin/sail up -d --remove-orphans

info 'Waiting for PostgreSQL'
database_ready=false

for attempt in {1..30}; do
    if ./vendor/bin/sail exec -T pgsql pg_isready -q; then
        database_ready=true
        break
    fi

    sleep 1
done

[[ "$database_ready" == true ]] || fail 'PostgreSQL did not become ready within 30 seconds.'

info 'Finalizing PHP dependencies in Sail'
./vendor/bin/sail composer install --no-interaction

info 'Clearing cached application configuration'
./vendor/bin/sail artisan config:clear --no-interaction

if ! grep -Eq '^APP_KEY=.+$' .env; then
    info 'Generating the application key'
    ./vendor/bin/sail artisan key:generate --force --no-interaction
fi

info 'Running database migrations'
./vendor/bin/sail artisan migrate --force --no-interaction

info 'Installing frontend dependencies'
./vendor/bin/sail npm install

info 'Building frontend assets'
./vendor/bin/sail npm run build

touch .setup-complete

info 'Setup complete: http://localhost:8001'
