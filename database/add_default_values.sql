-- Script to add default values to required fields

-- Add default value for marca
ALTER TABLE vehiculos ALTER COLUMN marca SET DEFAULT 'Sin especificar';

-- Add default value for modelo
ALTER TABLE vehiculos ALTER COLUMN modelo SET DEFAULT 'Sin especificar';

-- Add default value for año (current year)
ALTER TABLE vehiculos ALTER COLUMN año SET DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;

