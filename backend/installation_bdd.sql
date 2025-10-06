-- Créer la base
CREATE DATABASE "local_db";

-- Créer l'utilisateur
CREATE USER local_admin WITH PASSWORD 'local_password';

-- Donner tous les droits sur la base
GRANT ALL PRIVILEGES ON DATABASE "local_db" TO local_admin;

