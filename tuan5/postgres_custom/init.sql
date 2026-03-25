CREATE DATABASE labdb;
\connect labdb;

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO students (full_name)
VALUES ('Nguyen Van A'), ('Tran Thi B');
