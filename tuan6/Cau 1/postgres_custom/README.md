# Bai 8 - PostgreSQL tuy chinh voi Docker

## 1) Build image

cd postgres_custom
docker build -t postgres-custom:15 .

## 2) Chay container voi volume de luu du lieu lau dai

docker run -d \
  --name pg-lab8 \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -v pgdata_lab8:/var/lib/postgresql/data \
  postgres-custom:15

Giai thich:
- File init.sql trong /docker-entrypoint-initdb.d chi chay 1 lan duy nhat khi volume data rong.
- Volume pgdata_lab8 giu du lieu khi stop/start container, khi reboot may.

## 3) Kiem tra database va du lieu da tao tu dong

docker exec -it pg-lab8 psql -U admin -d labdb -c "SELECT * FROM students;"

## 4) Thu stop/start de xac nhan du lieu van con

docker stop pg-lab8
docker start pg-lab8
docker exec -it pg-lab8 psql -U admin -d labdb -c "SELECT * FROM students;"

## 5) Neu xoa container van giu du lieu (mien la khong xoa volume)

docker rm -f pg-lab8
docker run -d \
  --name pg-lab8 \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -v pgdata_lab8:/var/lib/postgresql/data \
  postgres-custom:15

## 6) Xoa hoan toan ca du lieu

docker rm -f pg-lab8
docker volume rm pgdata_lab8
