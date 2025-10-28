-- Script to remove NOT NULL constraints if you want to allow null values

-- Remove NOT NULL constraint from marca (if needed)
ALTER TABLE vehiculos ALTER COLUMN marca DROP NOT NULL;

-- Remove NOT NULL constraint from año (if needed) 
ALTER TABLE vehiculos ALTER COLUMN año DROP NOT NULL;

-- Alternative: Add default values instead of removing NOT NULL
-- ALTER TABLE vehiculos ALTER COLUMN marca SET DEFAULT 'Sin especificar';
-- ALTER TABLE vehiculos ALTER COLUMN año SET DEFAULT EXTRACT(YEAR FROM CURRENT_DATE);