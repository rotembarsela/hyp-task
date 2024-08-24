CREATE DATABASE IF NOT EXISTS excel_upload_db;

USE excel_upload_db;

CREATE TABLE IF NOT EXISTS users
(
    u_id    INT AUTO_INCREMENT PRIMARY KEY,
    u_token VARCHAR(255) NOT NULL,
    u_name  VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS files (
    f_id           INT AUTO_INCREMENT PRIMARY KEY,
    f_name         VARCHAR(255) NOT NULL,
    f_path         VARCHAR(255) NOT NULL,
    f_upload_date  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    f_last_author    VARCHAR(255) NULL,
    f_author         VARCHAR(255) NULL,
    f_created_date   DATETIME NULL,
    f_modified_date  DATETIME NULL,
    f_application    VARCHAR(255) NULL,
    f_app_version    VARCHAR(50) NULL,
    f_doc_security   INT NULL DEFAULT 0,
    f_scale_crop     BOOLEAN NULL DEFAULT FALSE,
    f_worksheets     INT NULL
);

CREATE TABLE IF NOT EXISTS customers
(
    c_id         INT AUTO_INCREMENT PRIMARY KEY,
    c_name       VARCHAR(255) NOT NULL,
    c_email      VARCHAR(255) NOT NULL,
    c_israeli_id VARCHAR(255) NOT NULL,
    c_phone      VARCHAR(255) NOT NULL,
    f_id         INT,
    FOREIGN KEY (f_id) REFERENCES files (f_id) ON DELETE CASCADE
);

-- Inserting 5 fake users into the 'users' table with UUID tokens
INSERT INTO users (u_token, u_name)
VALUES (UUID(), 'John Doe'),
       (UUID(), 'Jane Smith'),
       (UUID(), 'Alice Johnson'),
       (UUID(), 'Bob Brown'),
       (UUID(), 'Charlie Davis');