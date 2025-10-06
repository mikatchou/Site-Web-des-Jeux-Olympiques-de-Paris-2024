-- Se connecter à postgres (superuser)
-- psql -U postgres

-- Supprimer si existant
DROP DATABASE IF EXISTS local_db;
DROP USER IF EXISTS local_admin;

-- Créer la base
CREATE DATABASE local_db;

-- Créer l'utilisateur
CREATE USER local_admin WITH PASSWORD 'local_password';

-- Donner tous les droits sur la base
GRANT ALL PRIVILEGES ON DATABASE local_db TO local_admin;

-- Se connecter à la base
\c local_db;

-- Donner tous les droits sur le schéma public
GRANT ALL ON SCHEMA public TO local_admin;
ALTER ROLE local_admin SET search_path TO public;

