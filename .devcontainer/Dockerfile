FROM php:8.1-fpm

RUN apt-get update && apt-get install -y \
    mariadb-client \
    zip \
    unzip \
    curl \
    ca-certificates \
    gnupg \
  && docker-php-ext-install -j$(nproc) \
    mysqli \
    pdo_mysql \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Node.js + npm (choose an LTS; 20 is a safe default)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get update \
  && apt-get install -y nodejs \
  && node -v \
  && npm -v \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
  && chmod +x wp-cli.phar \
  && mv wp-cli.phar /usr/local/bin/wp

WORKDIR /roots/app
