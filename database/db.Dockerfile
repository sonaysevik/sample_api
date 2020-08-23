FROM postgres:12

COPY ./init_db.sql  /docker-entrypoint-initdb.d

COPY ./init_db_test.sql  /docker-entrypoint-initdb.d