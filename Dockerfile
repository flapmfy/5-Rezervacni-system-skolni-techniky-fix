FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
    libcurl4-openssl-dev \
    libxml2-dev \
    libonig-dev \
    supervisor \
    nodejs \
    npm \
    libldap2-dev \
    libldap-common \
    libwebp-dev

# Configure and install LDAP extension
RUN docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu/ \
    && docker-php-ext-install ldap

# Configure and install GD extension
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install gd

# Install basic extensions
RUN docker-php-ext-install pdo pdo_mysql zip

# Install commonly bundled extensions (but avoid 'tokenizer' as it's built-in)
RUN docker-php-ext-install \
    bcmath \
    ctype \
    fileinfo \
    pcntl \
    xml

# The following are typically built-in or don't need explicit installation:
# - curl (usually built-in)
# - dom (part of xml)
# - mbstring (newer PHP versions have it built-in)
# - openssl (built-in)
# - tokenizer (built-in)

# Enable these extensions through php.ini if needed
RUN docker-php-ext-enable opcache

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Supervisor configuration
COPY docker/supervisor/dev.conf /etc/supervisor/conf.d/laravel.conf

WORKDIR /var/www/html

# Entrypoint will handle permissions and startup
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
