# Nginx HTML Docker App

Ung dung web tinh don gian hien thi thong diep "Xin chao" su dung Nginx.

## Build image

```bash
docker build -t nginx-xinchao .
```

## Run container

```bash
docker run -d --name nginx-xinchao -p 8080:80 nginx-xinchao
```

Mo trinh duyet: http://localhost:8080

## Stop va xoa container

```bash
docker stop nginx-xinchao
docker rm nginx-xinchao
```
