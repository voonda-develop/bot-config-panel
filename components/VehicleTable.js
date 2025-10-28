import { FaEdit, FaTrash } from "react-icons/fa"

export default function VehicleTable({ vehiculos, onEdit, onDelete }) {
    const formatPrice = (price) => {
        if (!price) return "A consultar"
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
        if (!km) return "0"
        return new Intl.NumberFormat("es-AR").format(km)
    }

    return (
        <div className='overflow-x-auto bg-white rounded-lg shadow'>
            <table className='min-w-full'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Vehículo</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Año</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Color</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Combustible</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Kilometraje</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Precio</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Estado</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Contacto</th>
                        <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>Acciones</th>
                    </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                    {vehiculos.map((vehiculo) => (
                        <tr key={vehiculo.id} className='hover:bg-gray-50'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <div className='text-sm font-medium text-gray-900'>
                                    {vehiculo.marca} {vehiculo.modelo}
                                </div>
                                {vehiculo.motor && <div className='text-sm text-gray-500'>{vehiculo.motor}</div>}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{vehiculo.año}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{vehiculo.color || "-"}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{vehiculo.combustible || "-"}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{formatKilometraje(vehiculo.kilometraje)} km</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600'>{formatPrice(vehiculo.precio)}</td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(vehiculo.estado)}`}>{vehiculo.estado}</span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                <div>
                                    <div>{vehiculo.contacto_nombre || "-"}</div>
                                    {vehiculo.contacto_telefono && <div className='text-xs text-gray-500'>{vehiculo.contacto_telefono}</div>}
                                </div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                <div className='flex justify-end gap-2'>
                                    <button onClick={() => onEdit(vehiculo)} className='text-blue-600 hover:text-blue-900 p-1' title='Editar'>
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => onDelete(vehiculo.id)} className='text-red-600 hover:text-red-900 p-1' title='Eliminar'>
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
