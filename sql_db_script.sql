ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';
flush privileges;
SELECT * from netflix_titles;
ALTER TABLE netflix_titles ADD id int NOT NULL AUTO_INCREMENT primary key;
SET SQL_SAFE_UPDATES = 1;
