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

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER NOT NULL auto_increment,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    pending BOOL DEFAULT true,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
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

create table IF NOT EXISTS infos (
	id int NOT NULL AUTO_INCREMENT,
    apropos text NOT NULL,
    num_filieres INT NOT NULL,
    num_formateurs INT NOT NULL,
    num_stagiaires INT NOT NULL,
    PRIMARY KEY (id)
);

-- create admin
INSERT INTO users(username, email, password, power) VALUES("admin", "admin@gmail.com", "$2b$10$kx.shx5l1CGwRYFQGAj0GO4Qk6GreWpRHjiYZC4Ew8ojU0qnLNoPW", 3);

-- insert in secteur
INSERT INTO infos(apropos, num_filieres, num_formateurs, num_stagiaires) VALUES("In feugiat ligula quis turpis imperdiet, nec tempus nisi dapibus. Fusce a erat dictum, lacinia ipsum vel, sollicitudin ante. Duis lacus sapien, tincidunt in diam vitae, convallis posuere orci. Donec libero ante, convallis vitae dictum a, auctor vitae enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec elementum, magna nec feugiat mattis, est est iaculis magna, sed blandit ipsum augue ut massa. Vivamus euismod augue nec arcu volutpat mattis. Etiam ut sollicitudin mi. Mauris et eleifend ligula, in scelerisque est. Donec imperdiet, risus id tincidunt semper, justo lectus aliquet metus, accumsan egestas erat nisi quis est. Sed vel lacinia magna, non finibus tortor. Nullam dignissim aliquet mollis. Donec tincidunt venenatis ex, ut volutpat neque facilisis id. Ut sagittis elit id lacus faucibus, sit amet mattis orci mollis.", 28, 42, 1742);

-- insert in secteur
INSERT INTO secteurs(code, nom, description) VALUES("NTIC", "Technologies de l'information", "Le Maroc est conscient du fait que l’usage des technologies de l’information est un facteur essentiel pour l’émergence de la société du savoir et peut activement contribuer au développement humain, à l’amélioration de la cohésion sociale et à la croissance de l’économie nationale.");
INSERT INTO secteurs(code, nom, description) VALUES("AGC", "Administration Gestion et Commerce", "Les nouvelles tendances de l’économie mondiale montrent que les métiers du Tertiaire prennent une place de plus en plus importante dans le système de production en général en vue d’une plus grande productivité.");
INSERT INTO secteurs(code, nom, description) VALUES("TH", "Textile et Habillement", "L’industrie du Textile et de l’Habillement occupe une place stratégique dans l’industrie nationale de transformation aussi bien sur le plan des emplois et des exportations que sur le plan de l’équilibre socio-économique du pays.");

-- insert in filiere
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

-- insert in module
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