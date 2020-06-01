CREATE DATABASE queVeoHoy;

CREATE TABLE queVeoHoy.pelicula(
  id int NOT NULL auto_increment,
  titulo varchar(100),
  duracion int(5),
  director varchar(400),
  anio int(5),
  fecha_lanzamiento date, 
  puntuacion int(2),
  poster varchar(300),
  trama varchar(700),
  PRIMARY KEY (id)
);

CREATE TABLE queVeoHoy.genero(
  id int NOT NULL auto_increment,
  nombre varchar(30),
  PRIMARY KEY (id)
);

alter table queVeoHoy.pelicula
add column genero_id int;

alter table queVeoHoy.pelicula
add FOREIGN KEY (genero_id) REFERENCES queVeoHoy.genero (id);

CREATE TABLE queVeoHoy.actor(
  id int NOT NULL auto_increment,
  nombre varchar(70),
  PRIMARY KEY (id)
);

CREATE TABLE queVeoHoy.actor_pelicula(
  id int NOT NULL auto_increment,
  actor_id int NOT NULL,
  pelicula_id int NOT NULL,
  FOREIGN KEY (actor_id) REFERENCES queVeoHoy.actor(id),
  FOREIGN KEY (pelicula_id) REFERENCES queVeoHoy.pelicula(id),
  PRIMARY KEY (id)
);