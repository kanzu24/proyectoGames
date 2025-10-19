-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS videojuegos_xbox360;

USE videojuegos_xbox360;

-- Crear tabla de videojuegos
CREATE TABLE IF NOT EXISTS videojuegos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  genero VARCHAR(100) NOT NULL,
  anio INT NOT NULL,
  desarrollador VARCHAR(255) NOT NULL,
  calificacion DECIMAL(3,1) NOT NULL,
  imagen_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_genero (genero),
  INDEX idx_anio (anio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo
INSERT INTO videojuegos (nombre, genero, anio, desarrollador, calificacion, imagen_url) VALUES
('Halo 3', 'FPS', 2007, 'Bungie', 9.5, 'https://upload.wikimedia.org/wikipedia/en/3/39/Halo_3_final_boxshot.JPG'),
('Gears of War', 'Acción', 2006, 'Epic Games', 9.2, 'https://upload.wikimedia.org/wikipedia/en/0/0a/Gears_of_War_box_art.jpg'),
('BioShock', 'FPS', 2007, '2K Boston', 9.7, 'https://upload.wikimedia.org/wikipedia/en/9/9f/BioShock_cover.jpg'),
('Mass Effect', 'RPG', 2007, 'BioWare', 9.3, 'https://upload.wikimedia.org/wikipedia/en/8/89/Mass_Effect_box_art.jpg'),
('Fable II', 'RPG', 2008, 'Lionhead Studios', 8.8, 'https://upload.wikimedia.org/wikipedia/en/e/ed/Fable_II_Packshot.jpg'),
('Call of Duty 4', 'FPS', 2007, 'Infinity Ward', 9.4, 'https://upload.wikimedia.org/wikipedia/en/d/d5/Call_of_Duty_4_Modern_Warfare.jpg'),
('The Elder Scrolls IV: Oblivion', 'RPG', 2006, 'Bethesda', 9.4, 'https://upload.wikimedia.org/wikipedia/en/b/b9/Oblivion_cover.png'),
('Red Dead Redemption', 'Acción', 2010, 'Rockstar Games', 9.8, 'https://upload.wikimedia.org/wikipedia/en/a/a7/Red_Dead_Redemption.jpg')
ON DUPLICATE KEY UPDATE nombre=nombre;