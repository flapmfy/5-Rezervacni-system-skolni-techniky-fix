#!/bin/sh
set -e

# Always generate app key if not properly set
if ! grep -q "^APP_KEY=base64:" .env; then
    php artisan key:generate --force
    echo "Generated new application key"
else
    echo "Application key exists: $(grep APP_KEY .env)"
fi

# Create directories with proper permissions
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/bootstrap/cache

# Set correct ownership
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache

# Set permissive permissions
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Create storage link if it doesn't exist
if [ ! -L "/var/www/html/public/storage" ]; then
    php artisan storage:link || echo "Could not create storage link, try again after database is ready"
fi

# Wait for database to be ready
echo "Waiting for database connection..."
max_tries=30
count=0
until php artisan migrate:status > /dev/null 2>&1; do
    echo "Database not ready yet... waiting"
    sleep 2
    count=$((count+1))
    if [ $count -gt $max_tries ]; then
        echo "Error: Could not connect to database after $max_tries attempts"
        break
    fi
done

# Run migrations if database is ready
if php artisan migrate:status > /dev/null 2>&1; then
    echo "Running database migrations..."
    php artisan migrate --force
    echo "Migrations complete!"
else
    echo "WARNING: Could not run migrations. Database may not be ready."
fi

# Cache for production
if [ "$APP_ENV" = "production" ]; then
    php artisan config:clear # First clear any cached config
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Start cron service
service cron start

# Start supervisor in foreground
exec supervisord -n
