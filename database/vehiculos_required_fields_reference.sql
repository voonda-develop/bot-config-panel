-- Vehiculos Table - Required Fields Reference
-- Updated: October 27, 2025

-- RESOLVED: Added default values to handle NOT NULL constraints
-- The following fields now have automatic default values:

-- 1. marca: 'Sin especificar'
-- 2. modelo: 'Sin especificar' 
-- 3. año: Current year (2025 as of now)

-- SOLUTION IMPLEMENTED:
-- ✅ Default values added successfully
-- ✅ NULL constraint violations are now prevented
-- ✅ Records can be inserted without providing these fields

-- EXAMPLES OF VALID INSERTIONS:

-- Example 1: Minimal insert (uses all defaults)
INSERT INTO vehiculos (color) VALUES ('Rojo');
-- Result: marca='Sin especificar', modelo='Sin especificar', año=2025, color='Rojo'

-- Example 2: Partial insert (uses some defaults)
INSERT INTO vehiculos (marca, color, precio) VALUES ('Toyota', 'Azul', 3000000);
-- Result: marca='Toyota', modelo='Sin especificar', año=2025, color='Azul', precio=3000000

-- Example 3: Complete insert (no defaults needed)
INSERT INTO vehiculos (marca, modelo, año, color, precio) 
VALUES ('Ford', 'Focus', 2020, 'Blanco', 2500000);

-- OPTIONAL FIELDS (can be NULL):
-- - color
-- - combustible  
-- - kilometraje
-- - precio
-- - estado (has default 'Disponible')
-- - motor
-- - patente
-- - categoria

-- AUTOMATIC FIELDS (handled by database):
-- - id (UUID, auto-generated)
-- - created_at (timestamp, auto-generated)
-- - updated_at (timestamp, auto-updated)
-- - activo (boolean, default true)

-- TROUBLESHOOTING:
-- If you still get NOT NULL constraint errors, check:
-- 1. Verify the field name spelling (año not vehiculo_ano)
-- 2. Ensure you're using the correct column names
-- 3. Check if other fields might have been added with NOT NULL constraints

-- TO CHECK CURRENT DEFAULTS:
SELECT column_name, column_default, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vehiculos' 
  AND table_schema = 'public'
  AND column_default IS NOT NULL;