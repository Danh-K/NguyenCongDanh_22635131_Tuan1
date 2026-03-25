# Bai 9 - Redis tuy chinh voi Docker

## 1) Build image

cd redis_custom
docker build -t redis-custom:latest .

## 2) Chay container

docker run -d \
  --name redis-lab9 \
  -p 6379:6379 \
  -v redisdata_lab9:/data \
  redis-custom:latest

## 3) Kiem tra Redis dang chay

docker exec -it redis-lab9 redis-cli ping

Ket qua mong doi: PONG

## 4) Thu ghi va doc du lieu

docker exec -it redis-lab9 redis-cli set mykey "xin chao"
docker exec -it redis-lab9 redis-cli get mykey

## 5) Stop/start van giu du lieu

docker stop redis-lab9
docker start redis-lab9
docker exec -it redis-lab9 redis-cli get mykey
