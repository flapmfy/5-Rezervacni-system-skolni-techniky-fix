#!/bin/bash
# Run this script from your project root with sudo

# Create directories if they don't exist
mkdir -p storage/logs
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p bootstrap/cache

# Set ownership that matches www-data in container
# This assumes your user can write to these files
chmod -R 777 storage
chmod -R 777 bootstrap/cache

echo "Permissions fixed!"