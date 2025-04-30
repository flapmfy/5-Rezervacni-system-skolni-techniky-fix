#!/bin/bash
# Run this script from your project root with sudo

# Create directories if they don't exist
mkdir -p storage/logs
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p bootstrap/cache

# Set proper ownership to the web server user
# Replace www-data:www-data with your server's web user:group if different
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache

# Set more secure permissions
# 755 for directories: owner can read/write/execute, others can read/execute
# 644 for files: owner can read/write, others can read
find storage -type d -exec chmod 755 {} \;
find storage -type f -exec chmod 644 {} \;
find bootstrap/cache -type d -exec chmod 755 {} \;
find bootstrap/cache -type f -exec chmod 644 {} \;

echo "Server permissions fixed!"
