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

environment_value() {
    local key="$1"
    local fallback="$2"
    local value=''

    if [[ -f .env ]]; then
        value="$(grep -E "^${key}=" .env | tail -n 1 | cut -d '=' -f 2- || true)"
    fi

    if [[ -n "$value" ]]; then
        printf '%s' "$value"
    else
        printf '%s' "$fallback"
    fi
}

port_is_listening() {
    (exec 3<>"/dev/tcp/127.0.0.1/$1") >/dev/null 2>&1 || return 1
    exec 3<&- 3>&-
    return 0
}

running_project_containers() {
    if [[ -x ./vendor/bin/sail ]]; then
        ./vendor/bin/sail ps --quiet 2>/dev/null || true
    else
        docker compose ps --quiet 2>/dev/null || true
    fi
}

require_available_host_ports() {
    if [[ ! -f .env ]]; then
        return 0
    fi

    if [[ -n "$(running_project_containers)" ]]; then
        return 0
    fi

    local port_definitions=(
        "APP_PORT:$(environment_value APP_PORT 8001)"
        "VITE_PORT:$(environment_value VITE_PORT 5173)"
        "FORWARD_DB_PORT:$(environment_value FORWARD_DB_PORT 5433)"
    )
    local port_conflicts=()

    for port_definition in "${port_definitions[@]}"; do
        if port_is_listening "${port_definition##*:}"; then
            port_conflicts+=("${port_definition%%:*}=${port_definition##*:} is already used by another process")
        fi
    done

    if (( ${#port_conflicts[@]} > 0 )); then
        printf '\n\033[1;31mHost port conflict:\033[0m\n' >&2
        printf '  - %s\n' "${port_conflicts[@]}" >&2
        fail 'Set a free port for those keys in .env (for example FORWARD_DB_PORT=5434) and run this script again.'
    fi
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

    required_environment_keys=(
        'APP_PORT'
        'VITE_PORT'
        'FORWARD_DB_PORT'
    )

    for required_environment_key in "${required_environment_keys[@]}"; do
        if ! grep -Eq "^${required_environment_key}=.+$" .env; then
            require_setup ".env value for ${required_environment_key} is not configured"
        fi
    done

    if ! grep -Fqx "APP_URL=http://localhost:$(environment_value APP_PORT 8001)" .env; then
        require_setup 'APP_URL does not match APP_PORT'
    fi

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

require_available_host_ports

if (( ${#setup_reasons[@]} > 0 )); then
    info 'Setup is required:'
    printf '  - %s\n' "${setup_reasons[@]}"
    ./setup.sh
else
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
fi

info "Application running: http://localhost:$(environment_value APP_PORT 8001)"

info 'Starting the frontend development server'
exec ./vendor/bin/sail npm run dev -- --host 0.0.0.0
