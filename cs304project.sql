-- Delete all the table if it exist
DROP TABLE celestial_body CASCADE CONSTRAINTS;
DROP TABLE Star1 CASCADE CONSTRAINTS;
DROP TABLE Star CASCADE CONSTRAINTS;
DROP TABLE Planet1 CASCADE CONSTRAINTS;
DROP TABLE Planet CASCADE CONSTRAINTS;
DROP TABLE Blackhole CASCADE CONSTRAINTS;
DROP TABLE Galaxy CASCADE CONSTRAINTS;
DROP TABLE Observatory1 CASCADE CONSTRAINTS;
DROP TABLE Observatory CASCADE CONSTRAINTS;
DROP TABLE Astronomer CASCADE CONSTRAINTS;
DROP TABLE ph_location_found CASCADE CONSTRAINTS;
DROP TABLE tel_housed_at1 CASCADE CONSTRAINTS;
DROP TABLE tel_housed_at CASCADE CONSTRAINTS;
DROP TABLE picture_taken_by CASCADE CONSTRAINTS; 
DROP TABLE found CASCADE CONSTRAINTS;
DROP TABLE described CASCADE CONSTRAINTS;
DROP TABLE th_explained_by CASCADE CONSTRAINTS;
DROP TABLE Authored CASCADE CONSTRAINTS;
DROP TABLE has CASCADE CONSTRAINTS;
DROP TABLE taken_of CASCADE CONSTRAINTS;
-- Create the table
CREATE TABLE celestial_body (
    cb_name VARCHAR(40),
    coordinate VARCHAR(100),
    visible NUMBER(1) DEFAULT 1,
    distance DOUBLE PRECISION,
    diameter DOUBLE PRECISION,
    PRIMARY KEY (cb_name, coordinate)
);

CREATE TABLE Star1 (
  temperature INTEGER,
  spectral_class VARCHAR(40),
  luminosity_class VARCHAR(40),
  color VARCHAR(40),
  PRIMARY KEY(temperature)
);

CREATE TABLE Star (
    cb_name VARCHAR(40),
    coordinate VARCHAR(100),
    age INTEGER,
    temperature INTEGER,
    PRIMARY KEY(cb_name, coordinate),
    FOREIGN KEY(cb_name, coordinate) REFERENCES celestial_body(cb_name, coordinate) ON DELETE CASCADE,
    FOREIGN KEY(temperature) REFERENCES Star1(temperature)
);

CREATE TABLE Planet1 (
  habitable NUMBER(1) DEFAULT 1,
  water NUMBER(1) DEFAULT 1,
  PRIMARY KEY(habitable)
);

CREATE TABLE Planet (
  cb_name VARCHAR(40),
  coordinate VARCHAR(100),
  habitable NUMBER(1) DEFAULT 1,
  rotational_tilt DOUBLE PRECISION,
  axial_tilt DOUBLE PRECISION,
  shape VARCHAR(10),
  PRIMARY KEY(cb_name, coordinate),
  FOREIGN KEY(cb_name, coordinate)REFERENCES celestial_body(cb_name, coordinate) ON DELETE CASCADE,
  FOREIGN KEY(habitable) REFERENCES Planet1(habitable)
);

CREATE TABLE Blackhole (
  cb_name VARCHAR(40),
  coordinate VARCHAR(100),
  charge DOUBLE PRECISION,
  angular_momentum DOUBLE PRECISION,
  mass DOUBLE PRECISION,
  FOREIGN KEY(cb_name, coordinate)REFERENCES celestial_body(cb_name, coordinate)
  ON DELETE CASCADE,
  PRIMARY KEY(cb_name, coordinate)
);

CREATE TABLE Galaxy (
  cb_name VARCHAR(40),
  coordinate VARCHAR(100),
  shape VARCHAR(40),
  color	VARCHAR(40),
  FOREIGN KEY(cb_name, coordinate)REFERENCES celestial_body(cb_name, coordinate)
  ON DELETE CASCADE,
  PRIMARY KEY(cb_name, coordinate)
);

CREATE TABLE Observatory1 (
  obs_name VARCHAR(40),
  address VARCHAR(100) NOT NULL,
  PRIMARY KEY(obs_name)
);

CREATE TABLE Observatory (
  obs_id INTEGER,
  obs_name VARCHAR(40) NOT NULL,
  FOREIGN KEY(obs_name)REFERENCES Observatory1(obs_name)
  ON DELETE CASCADE,
  PRIMARY KEY(obs_id)
);

CREATE TABLE Astronomer (
  ast_id INTEGER,
  ast_name VARCHAR(40) NOT NULL,
  active NUMBER(1) DEFAULT 1,
  PRIMARY KEY(ast_id),
  UNIQUE(ast_name)
);

CREATE TABLE ph_location_found (
  obs_id INTEGER,
  ph_name VARCHAR(50),
  explained NUMBER(1) DEFAULT 1,
  PRIMARY KEY(ph_name),
  FOREIGN KEY(obs_id)REFERENCES Observatory(obs_id)
  ON DELETE SET NULL
);

CREATE TABLE tel_housed_at1(
  tel_name VARCHAR(40),
  obs_id INTEGER,
  PRIMARY KEY(tel_name),
  FOREIGN KEY(obs_id)REFERENCES Observatory(obs_id) ON DELETE CASCADE
);

CREATE TABLE tel_housed_at(
  tel_name VARCHAR(40),
  manufactured_date DATE,
  model VARCHAR(40),
  PRIMARY KEY(tel_name),
  FOREIGN KEY(tel_name)REFERENCES tel_housed_at1(tel_name) ON DELETE CASCADE
);

CREATE TABLE picture_taken_by(
  picture_id INTEGER,
  date_taken DATE,
  link VARCHAR(2048),
  tel_name VARCHAR(40),
  PRIMARY KEY(picture_id),
  FOREIGN KEY(tel_name)REFERENCES tel_housed_at1(tel_name)
  ON DELETE SET NULL
);

CREATE TABLE found (
  ast_id INTEGER,
  cb_name VARCHAR(40),
  coordinate VARCHAR(100),
  FOREIGN KEY(ast_id) REFERENCES Astronomer(ast_id)
  ON DELETE CASCADE,
  FOREIGN KEY(cb_name, coordinate)REFERENCES celestial_body(cb_name, coordinate) ON DELETE CASCADE,
  PRIMARY KEY(ast_id, cb_name, coordinate)
);

CREATE TABLE described (
  ast_id INTEGER,
  ph_name VARCHAR(40),
  FOREIGN KEY(ast_id) REFERENCES Astronomer(ast_id) ON DELETE CASCADE,
  FOREIGN KEY(ph_name) REFERENCES ph_location_found(ph_name) ON DELETE CASCADE,
  PRIMARY KEY(ast_id, ph_name)
);

CREATE TABLE th_explained_by (
  th_name VARCHAR(40),
  ph_name VARCHAR(40),
  date_found DATE,
  content VARCHAR(4000),
  solved NUMBER(1) DEFAULT 1,
  FOREIGN KEY(ph_name) REFERENCES ph_location_found(ph_name)
  ON DELETE CASCADE,
  PRIMARY KEY(th_name, ph_name)
);

CREATE TABLE Authored (
  ast_id INTEGER,
  th_name VARCHAR(40),
  ph_name VARCHAR(40),
  FOREIGN KEY(ast_id) REFERENCES Astronomer(ast_id)  ON DELETE CASCADE,
  FOREIGN KEY(th_name, ph_name) REFERENCES th_explained_by(th_name, ph_name) ON DELETE CASCADE,
  PRIMARY KEY(ast_id, th_name, ph_name)
);

CREATE TABLE has(
  ph_name VARCHAR(40),
  coordinate VARCHAR(100),
  cb_name VARCHAR(40),
  PRIMARY KEY(ph_name, cb_name, coordinate),
  FOREIGN KEY(ph_name)REFERENCES ph_location_found(ph_name) ON DELETE CASCADE,
  FOREIGN KEY(cb_name, coordinate)REFERENCES celestial_body(cb_name, coordinate) ON DELETE CASCADE
);

CREATE TABLE taken_of(
  picture_id INTEGER,
  coordinate VARCHAR(100),
  cb_name VARCHAR(40),
  PRIMARY KEY(picture_id, cb_name, coordinate),
  FOREIGN KEY(picture_id)REFERENCES picture_taken_by(picture_id) ON DELETE CASCADE,
  FOREIGN KEY(cb_name, coordinate)REFERENCES celestial_body(cb_name, coordinate) ON DELETE CASCADE
);
-- /
-- -- Insert statement
INSERT INTO celestial_body(cb_name, coordinate, visible, distance, diameter) VALUES
('Planet2', 'RA 06h 45m, Dec -16degree 43', 1, 8.6, 1.81);

INSERT INTO celestial_body(cb_name, coordinate, visible, distance, diameter) VALUES
('Planet3', 'RA 00h 42m, Dec +41degree 16', 1, 2.53, 0.0233);

INSERT INTO celestial_body(cb_name, coordinate, visible, distance, diameter) VALUES
('Blackhole1', 'RA 12h 30m 49.4s, Dec +12degree 23 28', 0, 53000000, NULL);

INSERT INTO celestial_body(cb_name, coordinate, visible, distance, diameter) VALUES
('Star1','RA 14h 29m, Dec -62degree 41', NULL, NULL, NULL);

INSERT INTO celestial_body(cb_name, coordinate, visible, distance, diameter) VALUES
('Star2', 'RA 18h 36m, Dec +38degree 47', NULL, NULL, NULL);

INSERT INTO celestial_body(cb_name, coordinate, visible, distance, diameter) VALUES
('Star3', 'RA 14h 39m, Dec -60degree 50', NULL, NULL, NULL);

INSERT INTO celestial_body(cb_name, coordinate, visible, distance, diameter) VALUES
('Star4', 'RA 17h 45m, Dec -29degree 00',  NULL, NULL, NULL);

INSERT INTO celestial_body(cb_name, coordinate, visible, distance, diameter) VALUES
('Star5', 'RA 12h 30m, Dec +12degree 23', NULL, NULL, NULL);

INSERT INTO Star1(temperature, spectral_class, luminosity_class, color) VALUES
(9940, 'A1', 'V', 'White');

INSERT INTO Star1(temperature, spectral_class, luminosity_class, color) VALUES
(3500, 'M1', 'I', 'Red');

INSERT INTO Star1(temperature, spectral_class, luminosity_class, color) VALUES
(3042, 'M5', 'V', 'Red');

INSERT INTO Star1(temperature, spectral_class, luminosity_class, color) VALUES
(9602, 'A0', 'V', 'White');

INSERT INTO Star1(temperature, spectral_class, luminosity_class, color) VALUES
(5790, 'G2', 'V', 'Yellow');

INSERT INTO Star(cb_name, coordinate, age, temperature) VALUES
('Star1', 'RA 14h 29m, Dec -62degree 41', 0.25, 9940);

INSERT INTO Star(cb_name, coordinate, age, temperature) VALUES
('Star2', 'RA 18h 36m, Dec +38degree 47',  8.0, 3500);

INSERT INTO Star(cb_name, coordinate, age, temperature) VALUES
('Star3', 'RA 14h 39m, Dec -60degree 50', 4.85, 3042);

INSERT INTO Star(cb_name, coordinate, age, temperature) VALUES
('Star4', 'RA 17h 45m, Dec -29degree 00',  4.85, 3042);

INSERT INTO Star(cb_name, coordinate, age, temperature) VALUES
('Star5', 'RA 12h 30m, Dec +12degree 23', 0.45, 9602);

-- ones to populate other subclasses
INSERT INTO Blackhole (cb_name, coordinate, charge, angular_momentum, mass) VALUES
('Blackhole1', 'RA 12h 30m 49.4s, Dec +12degree 23 28', 0, 0.99, 6500000000);

INSERT INTO Planet1(habitable, water) VALUES
(1, 1);
INSERT INTO Planet1(habitable, water) VALUES
(0, 0);
INSERT INTO Planet(cb_name, coordinate, habitable, rotational_tilt, axial_tilt, shape) VALUES
('Planet2', 'RA 06h 45m, Dec -16degree 43' , 1, 23.5, 23.5, 'Oblate');
INSERT INTO Planet(cb_name, coordinate, habitable, rotational_tilt, axial_tilt, shape) VALUES
('Planet3', 'RA 00h 42m, Dec +41degree 16' , 0, 23.5, 23.5, 'Spherical');

INSERT INTO celestial_body(cb_name, coordinate, visible, distance, diameter) VALUES
('Galaxy4', 'RA 16h 55m, Dec -40degree 44',  NULL, NULL, NULL);
INSERT INTO Galaxy(cb_name, coordinate,  shape, color) VALUES
('Galaxy4', 'RA 16h 55m, Dec -40degree 44',  'Elliptical', 'Yellow');


INSERT INTO Astronomer(ast_id, ast_name, active) VALUES
(1, 'Astronomer1', 0);

INSERT INTO Astronomer(ast_id, ast_name, active) VALUES
(2, 'Astronomer2', 1);

INSERT INTO Astronomer(ast_id, ast_name, active) VALUES
(3, 'Astronomer3', 1);

INSERT INTO Astronomer(ast_id, ast_name, active) VALUES
(4, 'Astronomer4', 0);

INSERT INTO Astronomer(ast_id, ast_name, active) VALUES
(5, 'Astronomer5', 0);

INSERT INTO Observatory1(obs_name, address) VALUES
('Observatory1', 'Somewhere in space, 500km above Earth'); 
INSERT INTO Observatory1(obs_name, address) VALUES
('Observatory2', '1234 Toronto, Ontario, Canada');
INSERT INTO Observatory1(obs_name, address) VALUES
('Observatory3', '4567, Hawaii, USA');
INSERT INTO Observatory1(obs_name, address) VALUES 
('Observatory4', 'Somewhere in space too, 1200km above Earth');
INSERT INTO Observatory1(obs_name, address) VALUES 
('Observatory5', '8910, Puerto Rico, USA');

INSERT INTO Observatory(obs_id, obs_name) VALUES 
(1, 'Observatory1');
INSERT INTO Observatory(obs_id, obs_name) VALUES   
(2, 'Observatory2');
INSERT INTO Observatory(obs_id, obs_name) VALUES   
(3, 'Observatory3');
INSERT INTO Observatory(obs_id, obs_name) VALUES  
(4, 'Observatory4');
INSERT INTO Observatory(obs_id, obs_name) VALUES  
(5, 'Observatory5');

INSERT INTO ph_location_found(ph_name, obs_id, explained) VALUES
('Phenomena1', 1, 1);
INSERT INTO ph_location_found(ph_name, obs_id, explained) VALUES
('Phenomena2', 2, 1);
INSERT INTO ph_location_found(ph_name, obs_id, explained) VALUES  
('Phenomena3', 3, 1);
INSERT INTO ph_location_found(ph_name, obs_id, explained) VALUES  
('Phenomena4', 4, 1);
INSERT INTO ph_location_found(ph_name, obs_id, explained) VALUES  
('Phenomena5', 5, 0);

-- all observatories have 1 telescope here
INSERT INTO tel_housed_at1(tel_name,obs_id) VALUES
('Telescop1', 1);
INSERT INTO tel_housed_at1(tel_name,obs_id) VALUES
('Telescope5', 2);
INSERT INTO tel_housed_at1(tel_name,obs_id) VALUES
('Telescope2', 3);
INSERT INTO tel_housed_at1(tel_name,obs_id) VALUES
('Telescope3', 4);
INSERT INTO tel_housed_at1(tel_name,obs_id) VALUES
('Telescope31', 4);
INSERT INTO tel_housed_at1(tel_name,obs_id) VALUES
('Telescope4', 5);


INSERT INTO tel_housed_at(tel_name, manufactured_date, model) VALUES
('Telescop1', TO_DATE('1990/04/24','YYYY/MM/DD'), 'Space-based Reflecting Telescope');
INSERT INTO tel_housed_at(tel_name, manufactured_date, model) VALUES
('Telescope2', TO_DATE('1998/05/05','YYYY/MM/DD'), 'Ground-based Optical Telescope');
INSERT INTO tel_housed_at(tel_name, manufactured_date, model) VALUES 
('Telescope3', TO_DATE('1999/07/23','YYYY/MM/DD'), 'Space-based X-ray Telescope');
INSERT INTO tel_housed_at(tel_name, manufactured_date, model) VALUES 
('Telescope31', TO_DATE('1999/10/23','YYYY/MM/DD'), 'Space-based X-ray Telescope');
INSERT INTO tel_housed_at(tel_name, manufactured_date, model) VALUES 
('Telescope4', TO_DATE('1963/11/01','YYYY/MM/DD'), 'Ground-based Radio Telescope');
INSERT INTO tel_housed_at(tel_name, manufactured_date, model) VALUES
('Telescope5', TO_DATE('1990/04/24','YYYY/MM/DD'), 'Space-based Reflecting Telescope');

-- all observatories have 1 picture taken here
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(1, TO_DATE('2016/07/08', 'YYYY/MM/DD'), 'https://dummy.com/image1.jpg', 'Telescop1');
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(2, TO_DATE('2016/07/08','YYYY/MM/DD'), 'https://dummy.com/image2.jpg', 'Telescope2');
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(3, TO_DATE('2016/07/08','YYYY/MM/DD'), 'https://dummy.com/image3.jpg', 'Telescope3');
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(4, TO_DATE('2016/07/08','YYYY/MM/DD'), 'https://dummy.com/image4.jpg', 'Telescope4');
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(5, TO_DATE('2016/07/08','YYYY/MM/DD'),'https://dummy.com/image5.jpg', 'Telescope5');

INSERT INTO described(ast_id, ph_name) VALUES
(1, 'Phenomena1');
INSERT INTO described(ast_id, ph_name) VALUES
(3, 'Phenomena2');


INSERT INTO found (ast_id, cb_name, coordinate) VALUES
(1, 'Planet2', 'RA 06h 45m, Dec -16degree 43' );
INSERT INTO found (ast_id, cb_name, coordinate) VALUES
(2, 'Star2', 'RA 18h 36m, Dec +38degree 47');
INSERT INTO found (ast_id, cb_name, coordinate) VALUES
(3, 'Galaxy4', 'RA 16h 55m, Dec -40degree 44')

INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(1,'Star1', 'RA 14h 29m, Dec -62degree 41');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(2,'Star2', 'RA 18h 36m, Dec +38degree 47');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(3, 'Planet3', 'RA 00h 42m, Dec +41degree 16');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(4, 'Planet2', 'RA 06h 45m, Dec -16degree 43');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES 
(5, 'Blackhole1', 'RA 12h 30m 49.4s, Dec +12degree 23 28');

INSERT INTO th_explained_by(th_name, ph_name, date_found, content, solved) VALUES
('Theory1', 'Phenomena1', TO_DATE('1966/06/06','YYYY/MM/DD'), 'Theory1 prove Phenomena1', 1);
INSERT INTO th_explained_by(th_name, ph_name, date_found, content, solved) VALUES
('Theory2', 'Phenomena1', TO_DATE('1980/07/07','YYYY/MM/DD'), 'Theory2 prove Phenomena1', 0);
INSERT INTO th_explained_by(th_name, ph_name, date_found, content, solved) VALUES
('Theory3', 'Phenomena2', TO_DATE('1970/08/05','YYYY/MM/DD'), 'Theory3 prove Phenomena2', 0);
INSERT INTO th_explained_by(th_name, ph_name, date_found, content, solved) VALUES
('Theory4', 'Phenomena3', TO_DATE('1900/09/04','YYYY/MM/DD'), 'Theory4 prove Phenomena3', 1);
INSERT INTO th_explained_by(th_name, ph_name, date_found, content, solved) VALUES
('Theory5', 'Phenomena4', TO_DATE('1901/10/03','YYYY/MM/DD'), 'Theory5 prove Phenomena4', 1);
INSERT INTO th_explained_by(th_name, ph_name, date_found, content, solved) VALUES
('Theory6', 'Phenomena5', TO_DATE('1910/11/02','YYYY/MM/DD'), 'Theory6 prove Phenomena5', 0);
INSERT INTO th_explained_by(th_name, ph_name, date_found, content, solved) VALUES
('Theory7', 'Phenomena5', TO_DATE('1920/12/01','YYYY/MM/DD'), 'Theory7 prove Phenomena5', 1);

INSERT INTO authored(ast_id, th_name, ph_name) VALUES
(1,'Theory1', 'Phenomena1');
INSERT INTO authored(ast_id, th_name, ph_name) VALUES
(1,'Theory2', 'Phenomena1');
INSERT INTO authored(ast_id, th_name, ph_name) VALUES
(2,'Theory3', 'Phenomena2');
INSERT INTO authored(ast_id, th_name, ph_name) VALUES
(3,'Theory4', 'Phenomena3');
INSERT INTO authored(ast_id, th_name, ph_name) VALUES
(4,'Theory5', 'Phenomena4');
INSERT INTO authored(ast_id, th_name, ph_name) VALUES
(5,'Theory6', 'Phenomena5');
INSERT INTO authored(ast_id, th_name, ph_name) VALUES
(5,'Theory7', 'Phenomena5');

INSERT INTO Has(ph_name, cb_name, coordinate) VALUES
('Phenomena1','Planet2', 'RA 06h 45m, Dec -16degree 43');

INSERT INTO Has(ph_name, cb_name, coordinate) VALUES
('Phenomena3','Planet3', 'RA 00h 42m, Dec +41degree 16');

INSERT INTO Has(ph_name, cb_name, coordinate) VALUES
('Phenomena2','Blackhole1', 'RA 12h 30m 49.4s, Dec +12degree 23 28');

INSERT INTO Has(ph_name, cb_name, coordinate) VALUES
('Phenomena1','Star1','RA 14h 29m, Dec -62degree 41');

INSERT INTO Has(ph_name, cb_name, coordinate) VALUES
('Phenomena2','Star2', 'RA 18h 36m, Dec +38degree 47');

INSERT INTO Has(ph_name, cb_name, coordinate) VALUES
('Phenomena4','Star3', 'RA 14h 39m, Dec -60degree 50');

INSERT INTO Has(ph_name, cb_name, coordinate) VALUES
('Phenomena5','Star4', 'RA 17h 45m, Dec -29degree 00');

INSERT INTO Has(ph_name, cb_name, coordinate) VALUES
('Phenomena1','Star5', 'RA 12h 30m, Dec +12degree 23');
INSERT INTO Has(ph_name, cb_name, coordinate) VALUES
('Phenomena4','Galaxy4', 'RA 16h 55m, Dec -40degree 44');

-- for aggregation with having query
--add more telescopes to observatory 1 and 2, with 2 having a very OLD telescope. BUt observatory 5 has a older one 
-- (telescope 5) but only 1 so it doesn't count
INSERT INTO tel_housed_at1(tel_name,obs_id) VALUES
('Telescope11', 1);
INSERT INTO tel_housed_at(tel_name, manufactured_date, model) VALUES
('Telescope11', TO_DATE('1991/04/24','YYYY/MM/DD'), 'Space-based Reflecting Telescope');
INSERT INTO tel_housed_at1(tel_name,obs_id) VALUES
('Telescope12', 1);
INSERT INTO tel_housed_at(tel_name, manufactured_date, model) VALUES
('Telescope12', TO_DATE('1992/04/24','YYYY/MM/DD'), 'Space-based Reflecting Telescope');
-- Oldest telescope that meets condition
INSERT INTO tel_housed_at1(tel_name,obs_id) VALUES
('Telescope21', 2);
INSERT INTO tel_housed_at(tel_name, manufactured_date, model) VALUES
('Telescope21', TO_DATE('1970/04/24','YYYY/MM/DD'), 'Space-based Reflecting Telescope');
-- Add all picture of all celestial objects to observatory 1 for division query
-- Blackhole1
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(6, TO_DATE('2016/07/09','YYYY/MM/DD'),'https://dummy.com/image6.jpg', 'Telescop1');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(6,'Blackhole1', 'RA 12h 30m 49.4s, Dec +12degree 23 28');
-- Planet2
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(7, TO_DATE('2016/07/10','YYYY/MM/DD'),'https://dummy.com/image7.jpg', 'Telescop1');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(7,'Planet2', 'RA 06h 45m, Dec -16degree 43');
-- Planet3
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(8, TO_DATE('2016/07/11','YYYY/MM/DD'),'https://dummy.com/image8.jpg', 'Telescop1');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(8,'Planet3', 'RA 00h 42m, Dec +41degree 16');
-- Star1 image already added
-- Star2
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(9, TO_DATE('2016/07/12','YYYY/MM/DD'),'https://dummy.com/image9.jpg', 'Telescop1');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(9,'Star2', 'RA 18h 36m, Dec +38degree 47');
-- Star3
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(10, TO_DATE('2016/07/13','YYYY/MM/DD'),'https://dummy.com/image10.jpg', 'Telescop1');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(10,'Star3', 'RA 14h 39m, Dec -60degree 50');
-- Star4
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(11, TO_DATE('2016/07/14','YYYY/MM/DD'),'https://dummy.com/image11.jpg', 'Telescop1');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(11,'Star4', 'RA 17h 45m, Dec -29degree 00');
-- Star5 test if telescope 11 is in obs 1, so it should count
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(12, TO_DATE('2016/07/15','YYYY/MM/DD'),'https://dummy.com/image12.jpg', 'Telescope11');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(12,'Star5', 'RA 12h 30m, Dec +12degree 23');

INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(13, TO_DATE('2016/07/16','YYYY/MM/DD'),'https://dummy.com/image12.jpg', 'Telescope11');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(13,'Galaxy4', 'RA 16h 55m, Dec -40degree 44');

-- Add all picture of all celestial objects to observatory 3 for division query
--Star1
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(22, TO_DATE('2016/07/08', 'YYYY/MM/DD'), 'https://dummy.com/image1.jpg', 'Telescope3');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(22,'Star1', 'RA 14h 29m, Dec -62degree 41');

--Blackhole1
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(14, TO_DATE('2016/07/09','YYYY/MM/DD'),'https://dummy.com/image6.jpg', 'Telescope3');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(14,'Blackhole1', 'RA 12h 30m 49.4s, Dec +12degree 23 28');
-- Planet2
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(15, TO_DATE('2016/07/10','YYYY/MM/DD'),'https://dummy.com/image7.jpg', 'Telescope3');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(15,'Planet2', 'RA 06h 45m, Dec -16degree 43');
-- Planet3
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(16, TO_DATE('2016/07/11','YYYY/MM/DD'),'https://dummy.com/image8.jpg', 'Telescope3');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(16,'Planet3', 'RA 00h 42m, Dec +41degree 16');
-- Star1 image already added
-- Star2
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(17, TO_DATE('2016/07/12','YYYY/MM/DD'),'https://dummy.com/image9.jpg', 'Telescope31');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(17,'Star2', 'RA 18h 36m, Dec +38degree 47');
-- Star3
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(18, TO_DATE('2016/07/13','YYYY/MM/DD'),'https://dummy.com/image10.jpg', 'Telescope31');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(18,'Star3', 'RA 14h 39m, Dec -60degree 50');
-- Star4
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(19, TO_DATE('2016/07/14','YYYY/MM/DD'),'https://dummy.com/image11.jpg', 'Telescope3');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(19,'Star4', 'RA 17h 45m, Dec -29degree 00');
-- Star5 test if telescope 11 is in obs 1, so it should count
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(12, TO_DATE('2016/07/15','YYYY/MM/DD'),'https://dummy.com/image12.jpg', 'Telescope11');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(12,'Star5', 'RA 12h 30m, Dec +12degree 23');

INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(13, TO_DATE('2016/07/16','YYYY/MM/DD'),'https://dummy.com/image12.jpg', 'Telescope11');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(13,'Galaxy4', 'RA 16h 55m, Dec -40degree 44');

-- Star5 test if telescope 31 is in obs 4, so it should count
INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(20, TO_DATE('2016/07/15','YYYY/MM/DD'),'https://dummy.com/image12.jpg', 'Telescope31');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(20,'Star5', 'RA 12h 30m, Dec +12degree 23');

INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES 
(21, TO_DATE('2016/07/16','YYYY/MM/DD'),'https://dummy.com/image12.jpg', 'Telescope31');
INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES
(21,'Galaxy4', 'RA 16h 55m, Dec -40degree 44');



--spool to myresults.csv
--Reference to the code is at: https://stackoverflow.com/questions/11831254/export-from-sql-to-excel
SET UNDERLINE OFF
SET COLSEP ','
SET LINES 6000 PAGES 100
SET FEEDBACK off
SET HEADING ON 
Spool myresults.csv
SELECT * FROM celestial_body;
SELECT * FROM Star1;
SELECT * FROM Star;
SELECT * FROM Planet1;
SELECT * FROM Planet;
SELECT * FROM Blackhole;
SELECT * FROM Galaxy;
SELECT * FROM Observatory1;
SELECT * FROM Observatory;
SELECT * FROM  Astronomer;
SELECT * FROM ph_location_found;
SELECT * FROM tel_housed_at1;
SELECT * FROM tel_housed_at;
SELECT * FROM picture_taken_by;
SELECT * FROM found;
SELECT * FROM described;
SELECT * FROM th_explained_by;
SELECT * FROM Authored;
SELECT * FROM has;
SELECT * FROM taken_of;

Spool OFF