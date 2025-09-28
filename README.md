# Site-Web-des-Jeux-Olympiques-de-Paris-2024
Site de billetterie pour les JO 2024 organisés à Paris.

## Etape 1 : Cloner le projet Git

1. Installer Git : https://git-scm.com/downloads
2. Ouvrez un terminal 
3. Saisissez la commande : git clone https://github.com/mikatchou/Site-Web-des-Jeux-Olympiques-de-Paris-2024

<br>

# Backend

## Etape 2 : Créer l'environnement virtuel

1. Installer Python : https://www.python.org/downloads/
2. Saisissez la commande : python -m venv env
3. Lancer l'environnement virtuel en tapant la commande : 
    - Linux/Mac : source env/bin/activate
    - Windows : env/Scripts/activate
4. Si tout va bien, la ligne de commande affichera "(env)" afin d'indiquer que l'environnemnt virtuel est actif.

## Etape 3 : Installer les dépendances

1. Dans le terminal, situez vous dans le dossier "backend"
2. verifiez que pip est bien installé en tapant la commande : pip --version
- si pip n'est pas installé, installez le en tapant la commande : python -m ensurepip --upgrade
3. Saisissez la commande : pip install -r requirements

## Etape 4 : Installer PostgreSQL et créer la base de données 

1. Installez et configurez PostgreSQL : https://www.postgresql.org/download/
2. Rendez vous dans les variables d'environnement et ajoutez le dossier bin (ex: C:\Program Files\PostgreSQL\18\bin) dans la variable PATH.
3. Afin de créer la base de données, ouvrez un terminal et tapez la commande : psql -U postgres -f installation_bdd.sql

## Etape 5 : Démarrer le serveur backend
1. Lancer le terminal
2. dans le terminal, situez vous dans le dossier backend en naviguant avec la commande 'cd'
3. afin de lancer le serveur, saissisez la commande : python manage.py runserver

<br>

# Frontend

## Etape 6 : Installer Nodes.js
1. Installer Nodes.js : https://nodejs.org/fr/download
2. vérifier que node est bien installé en tapant la commande : node -v

## Etape 7 : Installer les dépendances
1. Ouvrez le terminal et saisissez la commande : npm install
2. afin de démarrer le serveur, saisissez la commande : npm run dev

## Etape 7 : Démarrer le serveur frontend
1. Lancer le terminal
2. dans le terminal, situez vous dans le dossier frontend en naviguant avec la commande 'cd'
3. afin de lancer le serveur, saissisez la commande : npm run dev