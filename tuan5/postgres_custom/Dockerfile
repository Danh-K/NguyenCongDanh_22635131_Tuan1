FROM postgres:15

# SQL files in this folder are executed only on first container start
# when PGDATA is empty.
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql
