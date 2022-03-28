FROM php:8.0-fpm-alpine3.13

# Copy the application code
COPY ./backend /var/www/html

#RUN apk update update && apk add libpq-dev
RUN set -ex \
  && apk --no-cache add \
    postgresql-dev
RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql
RUN docker-php-ext-install pdo pdo_pgsql

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install

VOLUME ["/var/www/html"]
