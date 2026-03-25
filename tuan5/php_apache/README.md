# Bai 10 - PHP 8.2 Apache voi Docker

## 1) Build image

cd php_apache
docker build -t php-apache-lab10 .

## 2) Chay container va mount source tu host

PowerShell:
docker run -d --name php-lab10 -p 8081:80 -v ${PWD}:/var/www/html php-apache-lab10

Neu dung CMD:
docker run -d --name php-lab10 -p 8081:80 -v %cd%:/var/www/html php-apache-lab10

## 3) Mo trinh duyet

http://localhost:8081

## 4) Kiem tra mount source

- Sua file index.php tren may host.
- Reload trinh duyet se thay doi ngay.

## 5) Dung va xoa container

docker stop php-lab10
docker rm php-lab10
