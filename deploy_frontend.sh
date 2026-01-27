#!/bin/bash
sudo cp -r /home/dev148/public_html/* /var/www/html/telehealth/
sudo chown -R www-data:www-data /var/www/html/telehealth/
sudo systemctl reload nginx