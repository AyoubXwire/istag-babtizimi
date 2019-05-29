-- CREATE DATABASE babtizimi;
-- USE babtizimi;

-- create tables
CREATE TABLE IF NOT EXISTS users (
    id INTEGER NOT NULL auto_increment,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    power INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS post_types (
    id INTEGER NOT NULL auto_increment,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER NOT NULL auto_increment,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    post_type INT,
    pending BOOL DEFAULT true,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_type) REFERENCES post_types (id)
);

CREATE TABLE IF NOT EXISTS files (
    id INTEGER NOT NULL auto_increment,
    name VARCHAR(255) NOT NULL,
    post_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);

create table IF NOT EXISTS secteurs (
    id int NOT NULL AUTO_INCREMENT,
    code varchar(255) NOT NULL,
    nom varchar(255) NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (id)
);

create table IF NOT EXISTS filieres (
    id int NOT NULL AUTO_INCREMENT,
    code varchar(255) NOT NULL,
    nom varchar(255) NOT NULL,
    description TEXT NOT NULL,
    id_secteur int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_secteur) REFERENCES secteurs(id)
);

create table IF NOT EXISTS modules (
    id int NOT NULL AUTO_INCREMENT,
    nom varchar(255) NOT NULL,
    id_filiere int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_filiere) REFERENCES filieres(id)
);

-- create webmaster (Webmaster@123)
INSERT INTO users(username, email, password, power) VALUES("webmaster", "webmaster@gmail.com", "$2b$10$J4u0fWfKTycMbJ3y6tCV.uxb4yIAxPYtdh.ryXo079DuIHVCB52Me", 3);

-- insert in post_types
INSERT INTO post_types(name) VALUES("actualite");
INSERT INTO post_types(name) VALUES("ressource");

-- insert in secteurs
INSERT INTO secteurs(code, nom, description) VALUES("NTIC", "Technologies de l'information", "Le Maroc est conscient du fait que l’usage des technologies de l’information est un facteur essentiel pour l’émergence de la société du savoir et peut activement contribuer au développement humain, à l’amélioration de la cohésion sociale et à la croissance de l’économie nationale.");
INSERT INTO secteurs(code, nom, description) VALUES("AGC", "Administration Gestion et Commerce", "Les nouvelles tendances de l’économie mondiale montrent que les métiers du Tertiaire prennent une place de plus en plus importante dans le système de production en général en vue d’une plus grande productivité.");
INSERT INTO secteurs(code, nom, description) VALUES("TH", "Textile et Habillement", "L’industrie du Textile et de l’Habillement occupe une place stratégique dans l’industrie nationale de transformation aussi bien sur le plan des emplois et des exportations que sur le plan de l’équilibre socio-économique du pays.");

-- insert in filieres
INSERT INTO filieres(code, nom, description, id_secteur) VALUES('TDI', "Techniques de développement informatiques (TS)", "description du filiere", 1);
INSERT INTO filieres(code, nom, description, id_secteur) VALUES('TRI', "Techniques des réseaux informatiques (TS)", "description du filiere", 1);
INSERT INTO filieres(code, nom, description, id_secteur) VALUES('TMSIR', "Technicien en Maintenance et Systèmes Informatiques et Réseaux (T)", "description du filiere", 1);
INSERT INTO filieres(code, nom, description, id_secteur) VALUES('TSGE', "Technicien Spécialisé en Gestion des Entreprises (TS)", "description du filiere", 2);
INSERT INTO filieres(code, nom, description, id_secteur) VALUES('TCE', "Technicien Comptable d’Entreprises (T)", "description du filiere", 2);
INSERT INTO filieres(code, nom, description, id_secteur) VALUES('TSB', "Technicien en Secrétariat Bureautique (T)", "description du filiere", 2);
INSERT INTO filieres(code, nom, description, id_secteur) VALUES('THP', "Techniques Habillement Production (T)", "description du filiere", 3);
INSERT INTO filieres(code, nom, description, id_secteur) VALUES('THI', "Technique Habillement Industrialisation (T)", "description du filiere", 3);
INSERT INTO filieres(code, nom, description, id_secteur) VALUES('TMI', "Technique Modélisme Industriel (T)", "description du filiere", 3);
INSERT INTO filieres(code, nom, description, id_secteur) VALUES('TMMC', "Techniques Maintenance de Machines à Coudre (T)", "description du filiere", 3);

-- insert in modules
INSERT INTO modules(nom, id_filiere) VALUES('arabe', 1);
INSERT INTO modules(nom, id_filiere) VALUES('arabe', 2);
INSERT INTO modules(nom, id_filiere) VALUES('arabe', 3);
INSERT INTO modules(nom, id_filiere) VALUES('francais', 1);
INSERT INTO modules(nom, id_filiere) VALUES('francais', 2);
INSERT INTO modules(nom, id_filiere) VALUES('francais', 3);
INSERT INTO modules(nom, id_filiere) VALUES('anglais', 1);
INSERT INTO modules(nom, id_filiere) VALUES('anglais', 2);
INSERT INTO modules(nom, id_filiere) VALUES('anglais', 3);
INSERT INTO modules(nom, id_filiere) VALUES('francais', 1);
INSERT INTO modules(nom, id_filiere) VALUES('francais', 2);
INSERT INTO modules(nom, id_filiere) VALUES('francais', 3);
INSERT INTO modules(nom, id_filiere) VALUES('anglais', 1);
INSERT INTO modules(nom, id_filiere) VALUES('anglais', 2);
INSERT INTO modules(nom, id_filiere) VALUES('anglais', 3);
INSERT INTO modules(nom, id_filiere) VALUES('c#', 1);
INSERT INTO modules(nom, id_filiere) VALUES('algorithme', 1);
INSERT INTO modules(nom, id_filiere) VALUES('database', 1);
INSERT INTO modules(nom, id_filiere) VALUES('backend', 1);
INSERT INTO modules(nom, id_filiere) VALUES('frontend', 1);
INSERT INTO modules(nom, id_filiere) VALUES('maintenance', 3);
INSERT INTO modules(nom, id_filiere) VALUES('VLSM', 3);
INSERT INTO modules(nom, id_filiere) VALUES('routage', 3);
INSERT INTO modules(nom, id_filiere) VALUES('commutation', 3);
INSERT INTO modules(nom, id_filiere) VALUES('securite', 2);
INSERT INTO modules(nom, id_filiere) VALUES('DNS', 2);
INSERT INTO modules(nom, id_filiere) VALUES('AD', 2);
INSERT INTO modules(nom, id_filiere) VALUES('DHCP', 2);
INSERT INTO modules(nom, id_filiere) VALUES('entreprenariat', 1);
INSERT INTO modules(nom, id_filiere) VALUES('entreprenariat', 2);
INSERT INTO modules(nom, id_filiere) VALUES('entreprenariat', 3);
INSERT INTO modules(nom, id_filiere) VALUES('emploi', 1);
INSERT INTO modules(nom, id_filiere) VALUES('emploi', 2);
INSERT INTO modules(nom, id_filiere) VALUES('emploi', 3);