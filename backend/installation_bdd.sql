-- Créer la base
CREATE DATABASE "JO2024";

-- Créer l'utilisateur
CREATE USER admin WITH PASSWORD 'JO.PARIS.2024';

-- Donner tous les droits sur la base
GRANT ALL PRIVILEGES ON DATABASE "JO2024" TO admin;

