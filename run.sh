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

setup_reasons=()

require_setup() {
    setup_reasons+=("$1")
}

command -v docker >/dev/null 2>&1 || fail 'Docker is not installed.'
docker info >/dev/null 2>&1 || fail 'Docker is not running. Start Docker Desktop and run this script again.'

[[ -x ./setup.sh ]] || fail 'setup.sh is missing or is not executable.'

if [[ ! -f .setup-complete ]]; then
    require_setup 'setup has not completed successfully'
fi

if [[ ! -f .env ]]; then
    require_setup '.env is missing'
else
    required_environment_values=(
        'APP_URL=http://localhost:8001'
        'APP_PORT=8001'
        'DB_CONNECTION=pgsql'
        'DB_HOST=pgsql'
        'DB_PORT=5432'
        'DB_DATABASE=laravel'
        'DB_USERNAME=sail'
        'DB_PASSWORD=password'
    )

    for required_environment_value in "${required_environment_values[@]}"; do
        if ! grep -Fqx "$required_environment_value" .env; then
            require_setup ".env value for ${required_environment_value%%=*} is not configured"
        fi
    done

    if ! grep -Eq '^APP_KEY=.+$' .env; then
        require_setup 'APP_KEY has not been generated'
    fi
fi

if [[ ! -x ./vendor/bin/sail || ! -f ./vendor/autoload.php ]]; then
    require_setup 'Composer dependencies are missing'
fi

if [[ ! -d node_modules ]]; then
    require_setup 'frontend dependencies are missing'
fi

if [[ ! -f public/build/manifest.json ]]; then
    require_setup 'built frontend assets are missing'
fi

if [[ -f .setup-complete ]]; then
    setup_inputs=(
        composer.json
        composer.lock
        package.json
        package-lock.json
        compose.yaml
        .env.example
        setup.sh
    )

    for setup_input in "${setup_inputs[@]}"; do
        if [[ "$setup_input" -nt .setup-complete ]]; then
            require_setup "$setup_input changed after the last setup"
        fi
    done
fi

if [[ -x ./vendor/bin/sail ]] && ! docker image inspect sail-8.5/app >/dev/null 2>&1; then
    require_setup 'the Sail application image is missing'
fi

if (( ${#setup_reasons[@]} > 0 )); then
    info 'Setup is required:'
    printf '  - %s\n' "${setup_reasons[@]}"
    exec ./setup.sh
fi

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

info 'Clearing cached application configuration'
./vendor/bin/sail artisan config:clear --no-interaction

info 'Applying pending database migrations'
./vendor/bin/sail artisan migrate --force --no-interaction

info 'Application running: http://localhost:8001'
