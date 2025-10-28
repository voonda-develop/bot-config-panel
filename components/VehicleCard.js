import { FaEdit, FaTrash, FaEye, FaCar, FaGasPump, FaDollarSign, FaCalendarAlt } from "react-icons/fa"

export default function VehicleCard({ vehiculo, onEdit, onDelete }) {
    const formatPrice = (price) => {
        if (!price) return "Precio a consultar"
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0
        }).format(price)
    }

    const getEstadoColor = (estado) => {
        switch (estado) {
            case "Disponible":
                return "bg-green-100 text-green-800"
            case "Vendido":
                return "bg-red-100 text-red-800"
            case "Reservado":
                return "bg-yellow-100 text-yellow-800"
            case "Mantenimiento":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const formatKilometraje = (km) => {
        if (!km) return "0 km"
        return new Intl.NumberFormat("es-AR").format(km) + " km"
    }

    return (
        <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
            {/* Imagen principal */}
            <div className='h-48 bg-gray-200 flex items-center justify-center'>
                {vehiculo.imagenes && vehiculo.imagenes.length > 0 ? <img src={vehiculo.imagenes[0]} alt={`${vehiculo.marca} ${vehiculo.modelo}`} className='w-full h-full object-cover' /> : <FaCar className='text-gray-400 text-6xl' />}
            </div>

            <div className='p-4'>
                {/* Header con marca, modelo y año */}
                <div className='flex justify-between items-start mb-2'>
                    <h3 className='text-lg font-bold text-gray-900'>
                        {vehiculo.marca} {vehiculo.modelo}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(vehiculo.estado)}`}>{vehiculo.estado}</span>
                </div>

                {/* Año y color */}
                <div className='flex items-center gap-4 mb-3 text-sm text-gray-600'>
                    <div className='flex items-center gap-1'>
                        <FaCalendarAlt className='text-xs' />
                        <span>{vehiculo.año}</span>
                    </div>
                    {vehiculo.color && <span>• {vehiculo.color}</span>}
                </div>

                {/* Información técnica */}
                <div className='space-y-2 mb-4'>
                    {vehiculo.motor && (
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <FaCar className='text-xs' />
                            <span>{vehiculo.motor}</span>
                        </div>
                    )}

                    {vehiculo.combustible && (
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                            <FaGasPump className='text-xs' />
                            <span>{vehiculo.combustible}</span>
                        </div>
                    )}

                    <div className='flex items-center justify-between text-sm text-gray-600'>
                        <span>Kilometraje:</span>
                        <span className='font-medium'>{formatKilometraje(vehiculo.kilometraje)}</span>
                    </div>
                </div>

                {/* Precio */}
                <div className='flex items-center gap-2 mb-4'>
                    <FaDollarSign className='text-green-600' />
                    <span className='text-xl font-bold text-green-600'>{formatPrice(vehiculo.precio)}</span>
                </div>

                {/* Descripción */}
                {vehiculo.descripcion && <p className='text-sm text-gray-600 mb-4 line-clamp-2'>{vehiculo.descripcion}</p>}

                {/* Información de contacto */}
                {vehiculo.contacto_nombre && (
                    <div className='text-xs text-gray-500 mb-4'>
                        <p>Contacto: {vehiculo.contacto_nombre}</p>
                        {vehiculo.contacto_telefono && <p>Tel: {vehiculo.contacto_telefono}</p>}
                    </div>
                )}

                {/* Botones de acción */}
                <div className='flex gap-2'>
                    <button onClick={() => onEdit(vehiculo)} className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1'>
                        <FaEdit /> Editar
                    </button>
                    <button onClick={() => onDelete(vehiculo.id)} className='bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center'>
                        <FaTrash />
                    </button>
                </div>
            </div>
        </div>
    )
}
