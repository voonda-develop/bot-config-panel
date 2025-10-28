-- Tabla actualizada de vehículos con todos los campos consolidados
DROP TABLE IF EXISTS vehiculos CASCADE;

CREATE TABLE vehiculos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Información básica del vehículo
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  version VARCHAR(200),
  vehiculo_ano INTEGER NOT NULL, -- año del vehículo
  modelo_ano INTEGER, -- año del modelo (puede diferir del vehículo)
  
  -- Identificación
  patente VARCHAR(15) UNIQUE,
  dominio VARCHAR(15), -- alias para patente
  kilometros INTEGER DEFAULT 0,
  
  -- Información comercial
  valor DECIMAL(15,2),
  moneda VARCHAR(10) DEFAULT 'ARS',
  condicion VARCHAR(50) DEFAULT 'Usado', -- Nuevo, Usado, 0km
  vendedor VARCHAR(100),
  
  -- Fechas importantes
  fecha_ingreso DATE,
  fecha_reserva DATE,
  fecha_entrega DATE,
  
  -- Publicaciones
  publicacion_web BOOLEAN DEFAULT false,
  publicacion_api_call BOOLEAN DEFAULT false,
  publi_insta BOOLEAN DEFAULT false,
  publi_face BOOLEAN DEFAULT false,
  publi_mer_lib BOOLEAN DEFAULT false, -- Mercado Libre
  publi_mark_p BOOLEAN DEFAULT false, -- Marketing Publicitario
  
  -- Información técnica del motor
  motorizacion VARCHAR(100),
  combustible VARCHAR(30),
  cilindrada VARCHAR(50),
  potencia_hp INTEGER,
  torque_nm INTEGER,
  
  -- Transmisión y tracción
  caja VARCHAR(50), -- Manual, Automática, CVT
  traccion VARCHAR(30), -- Delantera, Trasera, 4x4, AWD
  
  -- Características físicas
  puertas INTEGER,
  segmento_modelo VARCHAR(50), -- Sedán, Hatchback, SUV, etc.
  largo DECIMAL(6,2), -- en metros
  ancho DECIMAL(6,2), -- en metros
  alto DECIMAL(6,2), -- en metros
  
  -- Seguridad
  airbags INTEGER,
  abs BOOLEAN DEFAULT false,
  control_estabilidad BOOLEAN DEFAULT false,
  
  -- Confort y equipamiento
  climatizador VARCHAR(50), -- Manual, Automático, Dual Zone
  multimedia TEXT, -- descripción del sistema multimedia
  asistencia_manejo TEXT[], -- array de asistencias
  
  -- Información técnica adicional
  frenos VARCHAR(100), -- tipo de frenos
  neumaticos VARCHAR(100), -- especificación de neumáticos
  llantas VARCHAR(100), -- especificación de llantas
  rendimiento_mixto DECIMAL(4,2), -- km/l
  capacidad_baul INTEGER, -- en litros
  capacidad_combustible INTEGER, -- en litros
  velocidad_max INTEGER, -- en km/h
  
  -- URLs y documentación
  url_ficha TEXT,
  
  -- Información de IA/ML
  modelo_rag TEXT, -- para procesamiento con IA
  titulo_legible TEXT, -- título optimizado para lectura
  ficha_breve TEXT, -- resumen breve del vehículo
  
  -- Estado y gestión
  estado VARCHAR(30) DEFAULT 'Disponible', -- Disponible, Reservado, Vendido
  pendientes_preparacion TEXT, -- tareas pendientes
  
  -- Metadatos del sistema
  activo BOOLEAN DEFAULT true,
  sincronizado_sheets BOOLEAN DEFAULT false,
  sheets_row_id INTEGER
);

-- Índices para mejorar performance
CREATE INDEX idx_vehiculos_marca_modelo ON vehiculos(marca, modelo);
CREATE INDEX idx_vehiculos_vehiculo_ano ON vehiculos(vehiculo_ano);
CREATE INDEX idx_vehiculos_valor ON vehiculos(valor);
CREATE INDEX idx_vehiculos_estado ON vehiculos(estado);
CREATE INDEX idx_vehiculos_activo ON vehiculos(activo);
CREATE INDEX idx_vehiculos_patente ON vehiculos(patente);
CREATE INDEX idx_vehiculos_vendedor ON vehiculos(vendedor);
CREATE INDEX idx_vehiculos_fecha_ingreso ON vehiculos(fecha_ingreso);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
CREATE TRIGGER update_vehiculos_updated_at 
    BEFORE UPDATE ON vehiculos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Función para sincronizar dominio con patente
CREATE OR REPLACE FUNCTION sync_patente_dominio()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se actualiza patente, sincronizar dominio
    IF NEW.patente IS NOT NULL AND NEW.patente != OLD.patente THEN
        NEW.dominio = NEW.patente;
    END IF;
    
    -- Si se actualiza dominio, sincronizar patente
    IF NEW.dominio IS NOT NULL AND NEW.dominio != OLD.dominio AND NEW.patente IS NULL THEN
        NEW.patente = NEW.dominio;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para sincronizar patente y dominio
CREATE TRIGGER sync_patente_dominio_trigger
    BEFORE INSERT OR UPDATE ON vehiculos 
    FOR EACH ROW 
    EXECUTE FUNCTION sync_patente_dominio();

-- Vista para compatibilidad con el sistema anterior
CREATE VIEW vehiculos_legacy AS
SELECT 
    id,
    marca,
    modelo,
    vehiculo_ano as año,
    kilometros as kilometraje,
    valor as precio,
    combustible,
    caja as transmision,
    traccion,
    patente,
    estado,
    vendedor as contacto_nombre,
    created_at,
    updated_at,
    activo
FROM vehiculos;

-- Comentarios para documentar la tabla
COMMENT ON TABLE vehiculos IS 'Tabla principal de vehículos con campos consolidados de ambas estructuras';
COMMENT ON COLUMN vehiculos.vehiculo_ano IS 'Año del vehículo';
COMMENT ON COLUMN vehiculos.modelo_ano IS 'Año del modelo (puede diferir del vehículo)';
COMMENT ON COLUMN vehiculos.dominio IS 'Alias para patente, se sincroniza automáticamente';
COMMENT ON COLUMN vehiculos.pendientes_preparacion IS 'Tareas o preparaciones pendientes del vehículo';