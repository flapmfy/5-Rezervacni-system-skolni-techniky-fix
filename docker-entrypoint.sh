#!/bin/sh
set -e

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
chmod -R 777 /var/www/html/storage
chmod -R 777 /var/www/html/bootstrap/cache

# Install dependencies if needed
if [ ! -d "vendor" ] || [ ! -f "vendor/autoload.php" ]; then
    composer install
fi

# Make sure the frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    npm install
fi

# Create ziggy routes file
php artisan ziggy:generate

# Create storage link if it doesn't exist
if [ ! -L "/var/www/html/public/storage" ]; then
    php artisan storage:link || echo "Could not create storage link, try again after database is ready"
fi

# Start supervisor in foreground
exec supervisord -n
