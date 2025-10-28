-- Script de migración para añadir campos consolidados a la tabla vehiculos existente
-- Este script se ejecuta de forma segura sin perder datos existentes

-- 1. Añadir campos de la primera estructura que faltan
ALTER TABLE vehiculos 
ADD COLUMN IF NOT EXISTS version VARCHAR(200),
ADD COLUMN IF NOT EXISTS vehiculo_ano INTEGER,
ADD COLUMN IF NOT EXISTS modelo_ano INTEGER,
ADD COLUMN IF NOT EXISTS valor DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS moneda VARCHAR(10) DEFAULT 'ARS',
ADD COLUMN IF NOT EXISTS publicacion_web BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS publicacion_api_call BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS motorizacion VARCHAR(100),
ADD COLUMN IF NOT EXISTS caja VARCHAR(50),
ADD COLUMN IF NOT EXISTS puertas INTEGER,
ADD COLUMN IF NOT EXISTS segmento_modelo VARCHAR(50),
ADD COLUMN IF NOT EXISTS potencia_hp INTEGER,
ADD COLUMN IF NOT EXISTS torque_nm INTEGER,
ADD COLUMN IF NOT EXISTS airbags INTEGER,
ADD COLUMN IF NOT EXISTS abs BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS control_estabilidad BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS climatizador VARCHAR(50),
ADD COLUMN IF NOT EXISTS multimedia TEXT,
ADD COLUMN IF NOT EXISTS frenos VARCHAR(100),
ADD COLUMN IF NOT EXISTS neumaticos VARCHAR(100),
ADD COLUMN IF NOT EXISTS llantas VARCHAR(100),
ADD COLUMN IF NOT EXISTS asistencia_manejo TEXT[],
ADD COLUMN IF NOT EXISTS rendimiento_mixto DECIMAL(4,2),
ADD COLUMN IF NOT EXISTS capacidad_baul INTEGER,
ADD COLUMN IF NOT EXISTS capacidad_combustible INTEGER,
ADD COLUMN IF NOT EXISTS velocidad_max INTEGER,
ADD COLUMN IF NOT EXISTS largo DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS ancho DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS alto DECIMAL(6,2),
ADD COLUMN IF NOT EXISTS url_ficha TEXT,
ADD COLUMN IF NOT EXISTS modelo_rag TEXT,
ADD COLUMN IF NOT EXISTS titulo_legible TEXT,
ADD COLUMN IF NOT EXISTS ficha_breve TEXT;

-- 2. Añadir campos de la segunda estructura que faltan
ALTER TABLE vehiculos 
ADD COLUMN IF NOT EXISTS dominio VARCHAR(15),
ADD COLUMN IF NOT EXISTS fecha_ingreso DATE,
ADD COLUMN IF NOT EXISTS publi_insta BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS publi_face BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS publi_mer_lib BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS publi_mark_p BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pendientes_preparacion TEXT,
ADD COLUMN IF NOT EXISTS fecha_reserva DATE,
ADD COLUMN IF NOT EXISTS fecha_entrega DATE,
ADD COLUMN IF NOT EXISTS condicion VARCHAR(50) DEFAULT 'Usado',
ADD COLUMN IF NOT EXISTS vendedor VARCHAR(100);

-- 3. Migrar datos existentes a los nuevos campos (mapeo)
-- NOTA: Solo migrar campos que existen en la tabla actual
UPDATE vehiculos SET 
    dominio = patente
WHERE dominio IS NULL AND patente IS NOT NULL;

-- Los siguientes campos no existen en la tabla actual, se deben llenar manualmente:
-- vehiculo_ano (no existe columna 'año')
-- valor (no existe columna 'precio') 
-- motorizacion (no existe columna 'motor')
-- caja (no existe columna 'transmision')

-- 4. Añadir nuevos índices para los campos añadidos
CREATE INDEX IF NOT EXISTS idx_vehiculos_vehiculo_ano ON vehiculos(vehiculo_ano);
CREATE INDEX IF NOT EXISTS idx_vehiculos_valor ON vehiculos(valor);
CREATE INDEX IF NOT EXISTS idx_vehiculos_patente ON vehiculos(patente);
CREATE INDEX IF NOT EXISTS idx_vehiculos_vendedor ON vehiculos(vendedor);
CREATE INDEX IF NOT EXISTS idx_vehiculos_fecha_ingreso ON vehiculos(fecha_ingreso);
CREATE INDEX IF NOT EXISTS idx_vehiculos_dominio ON vehiculos(dominio);

-- 5. Función para sincronizar patente y dominio automáticamente
CREATE OR REPLACE FUNCTION sync_patente_dominio()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se actualiza patente, sincronizar dominio
    IF NEW.patente IS NOT NULL AND (OLD IS NULL OR OLD.patente IS NULL OR NEW.patente != OLD.patente) THEN
        NEW.dominio = NEW.patente;
    END IF;
    
    -- Si se actualiza dominio, sincronizar patente  
    IF NEW.dominio IS NOT NULL AND (OLD IS NULL OR OLD.dominio IS NULL OR NEW.dominio != OLD.dominio) AND NEW.patente IS NULL THEN
        NEW.patente = NEW.dominio;
    END IF;
    
    -- NOTA: Los siguientes campos no existen en la tabla actual, se comentan
    -- hasta que se añadan manualmente:
    /*
    IF NEW.año IS NOT NULL AND (NEW.vehiculo_ano IS NULL OR NEW.año != OLD.año) THEN
        NEW.vehiculo_ano = NEW.año;
    END IF;
    
    IF NEW.precio IS NOT NULL AND (NEW.valor IS NULL OR NEW.precio != OLD.precio) THEN
        NEW.valor = NEW.precio;
    END IF;
    
    IF NEW.motor IS NOT NULL AND (NEW.motorizacion IS NULL OR NEW.motor != OLD.motor) THEN
        NEW.motorizacion = NEW.motor;
    END IF;
    
    IF NEW.transmision IS NOT NULL AND (NEW.caja IS NULL OR NEW.transmision != OLD.transmision) THEN
        NEW.caja = NEW.transmision;
    END IF;
    */
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Crear trigger para sincronización automática
DROP TRIGGER IF EXISTS sync_patente_dominio_trigger ON vehiculos;
CREATE TRIGGER sync_patente_dominio_trigger
    BEFORE INSERT OR UPDATE ON vehiculos 
    FOR EACH ROW 
    EXECUTE FUNCTION sync_patente_dominio();

-- 7. Función para mantener compatibilidad inversa
CREATE OR REPLACE FUNCTION sync_legacy_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- NOTA: Los campos legacy (año, precio, motor, transmision) no existen en la tabla actual
    -- Esta función se mantiene comentada hasta que dichos campos se añadan manualmente:
    /*
    -- Sincronizar de campos nuevos a campos legacy
    IF NEW.vehiculo_ano IS NOT NULL AND (NEW.año IS NULL OR NEW.vehiculo_ano != OLD.vehiculo_ano) THEN
        NEW.año = NEW.vehiculo_ano;
    END IF;
    
    IF NEW.valor IS NOT NULL AND (NEW.precio IS NULL OR NEW.valor != OLD.valor) THEN
        NEW.precio = NEW.valor;
    END IF;
    
    IF NEW.motorizacion IS NOT NULL AND (NEW.motor IS NULL OR NEW.motorizacion != OLD.motorizacion) THEN
        NEW.motor = NEW.motorizacion;
    END IF;
    
    IF NEW.caja IS NOT NULL AND (NEW.transmision IS NULL OR NEW.caja != OLD.caja) THEN
        NEW.transmision = NEW.caja;
    END IF;
    */
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Crear trigger para compatibilidad inversa
DROP TRIGGER IF EXISTS sync_legacy_fields_trigger ON vehiculos;
CREATE TRIGGER sync_legacy_fields_trigger
    BEFORE INSERT OR UPDATE ON vehiculos 
    FOR EACH ROW 
    EXECUTE FUNCTION sync_legacy_fields();

-- 9. Actualizar campos existentes con valores por defecto donde sea necesario
UPDATE vehiculos SET 
    moneda = COALESCE(moneda, 'ARS'),
    condicion = COALESCE(condicion, 'Usado'),
    publicacion_web = COALESCE(publicacion_web, false),
    publicacion_api_call = COALESCE(publicacion_api_call, false),
    publi_insta = COALESCE(publi_insta, false),
    publi_face = COALESCE(publi_face, false),
    publi_mer_lib = COALESCE(publi_mer_lib, false),
    publi_mark_p = COALESCE(publi_mark_p, false),
    abs = COALESCE(abs, false),
    control_estabilidad = COALESCE(control_estabilidad, false)
WHERE moneda IS NULL 
   OR condicion IS NULL 
   OR publicacion_web IS NULL 
   OR publicacion_api_call IS NULL 
   OR publi_insta IS NULL 
   OR publi_face IS NULL 
   OR publi_mer_lib IS NULL 
   OR publi_mark_p IS NULL 
   OR abs IS NULL 
   OR control_estabilidad IS NULL;

-- 10. Verificar la migración
SELECT 
    COUNT(*) as total_vehiculos,
    COUNT(vehiculo_ano) as con_vehiculo_ano,
    COUNT(valor) as con_valor,
    COUNT(dominio) as con_dominio,
    COUNT(motorizacion) as con_motorizacion
FROM vehiculos 
WHERE activo = true;

-- Comentarios para documentar los cambios
COMMENT ON COLUMN vehiculos.vehiculo_ano IS 'Año del vehículo (sincronizado con año)';
COMMENT ON COLUMN vehiculos.valor IS 'Precio del vehículo (sincronizado con precio)';
COMMENT ON COLUMN vehiculos.dominio IS 'Alias para patente (sincronizado automáticamente)';
COMMENT ON COLUMN vehiculos.motorizacion IS 'Motorización (sincronizado con motor)';
COMMENT ON COLUMN vehiculos.caja IS 'Caja de cambios (sincronizado con transmision)';
COMMENT ON COLUMN vehiculos.pendientes_preparacion IS 'Tareas o preparaciones pendientes del vehículo';
COMMENT ON COLUMN vehiculos.asistencia_manejo IS 'Array de sistemas de asistencia al manejo';

COMMENT ON TABLE vehiculos IS 'Tabla principal de vehículos - Migrada para incluir campos consolidados de ambas estructuras';