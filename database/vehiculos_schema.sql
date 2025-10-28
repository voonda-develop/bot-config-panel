-- Tabla principal de vehículos
CREATE TABLE vehiculos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Información básica
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  año INTEGER NOT NULL,
  color VARCHAR(50),
  combustible VARCHAR(30) DEFAULT 'Nafta',
  
  -- Información técnica
  motor VARCHAR(100),
  cilindrada VARCHAR(50),
  potencia VARCHAR(50),
  transmision VARCHAR(50) DEFAULT 'Manual',
  traccion VARCHAR(30) DEFAULT 'Delantera',
  
  -- Información comercial
  precio DECIMAL(12,2),
  kilometraje INTEGER DEFAULT 0,
  estado VARCHAR(30) DEFAULT 'Disponible', -- Disponible, Vendido, Reservado, Mantenimiento
  ubicacion VARCHAR(100),
  
  -- Información adicional
  descripcion TEXT,
  equipamiento TEXT[],
  imagenes TEXT[],
  vin VARCHAR(17) UNIQUE,
  patente VARCHAR(10) UNIQUE,
  
  -- Información del vendedor/contacto
  contacto_nombre VARCHAR(100),
  contacto_telefono VARCHAR(20),
  contacto_email VARCHAR(100),
  
  -- Metadatos
  activo BOOLEAN DEFAULT true,
  sincronizado_sheets BOOLEAN DEFAULT false,
  sheets_row_id INTEGER
);

-- Índices para mejorar performance
CREATE INDEX idx_vehiculos_marca_modelo ON vehiculos(marca, modelo);
CREATE INDEX idx_vehiculos_año ON vehiculos(año);
CREATE INDEX idx_vehiculos_precio ON vehiculos(precio);
CREATE INDEX idx_vehiculos_estado ON vehiculos(estado);
CREATE INDEX idx_vehiculos_activo ON vehiculos(activo);

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

-- RLS (Row Level Security) - opcional, dependiendo de tus necesidades de seguridad
-- ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;