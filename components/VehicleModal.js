import { useState, useEffect } from "react"
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa"

export default function VehicleModal({ vehicle, onSave, onClose }) {
    const [formData, setFormData] = useState({
        marca: "",
        modelo: "",
        año: new Date().getFullYear(),
        color: "",
        combustible: "Nafta",
        motor: "",
        cilindrada: "",
        potencia: "",
        transmision: "Manual",
        traccion: "Delantera",
        precio: "",
        kilometraje: 0,
        estado: "Disponible",
        ubicacion: "",
        descripcion: "",
        equipamiento: [],
        imagenes: [],
        vin: "",
        patente: "",
        contacto_nombre: "",
        contacto_telefono: "",
        contacto_email: ""
    })

    const [errors, setErrors] = useState({})
    const [newEquipamiento, setNewEquipamiento] = useState("")
    const [newImagen, setNewImagen] = useState("")

    useEffect(() => {
        if (vehicle) {
            setFormData({
                ...vehicle,
                equipamiento: vehicle.equipamiento || [],
                imagenes: vehicle.imagenes || []
            })
        }
    }, [vehicle])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    const addEquipamiento = () => {
        if (newEquipamiento.trim()) {
            setFormData((prev) => ({
                ...prev,
                equipamiento: [...prev.equipamiento, newEquipamiento.trim()]
            }))
            setNewEquipamiento("")
        }
    }

    const removeEquipamiento = (index) => {
        setFormData((prev) => ({
            ...prev,
            equipamiento: prev.equipamiento.filter((_, i) => i !== index)
        }))
    }

    const addImagen = () => {
        if (newImagen.trim()) {
            setFormData((prev) => ({
                ...prev,
                imagenes: [...prev.imagenes, newImagen.trim()]
            }))
            setNewImagen("")
        }
    }

    const removeImagen = (index) => {
        setFormData((prev) => ({
            ...prev,
            imagenes: prev.imagenes.filter((_, i) => i !== index)
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.marca.trim()) newErrors.marca = "La marca es requerida"
        if (!formData.modelo.trim()) newErrors.modelo = "El modelo es requerido"
        if (!formData.año || formData.año < 1900 || formData.año > new Date().getFullYear() + 1) {
            newErrors.año = "Año inválido"
        }
        if (formData.precio && formData.precio < 0) {
            newErrors.precio = "El precio no puede ser negativo"
        }
        if (formData.kilometraje < 0) {
            newErrors.kilometraje = "El kilometraje no puede ser negativo"
        }
        if (formData.contacto_email && !/\S+@\S+\.\S+/.test(formData.contacto_email)) {
            newErrors.contacto_email = "Email inválido"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validateForm()) {
            // Convertir strings vacíos en null para campos numéricos
            const cleanData = {
                ...formData,
                precio: formData.precio ? parseFloat(formData.precio) : null,
                kilometraje: parseInt(formData.kilometraje) || 0,
                año: parseInt(formData.año)
            }

            onSave(cleanData)
        }
    }

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b'>
                    <h2 className='text-2xl font-bold'>{vehicle ? "Editar Vehículo" : "Nuevo Vehículo"}</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
                        <FaTimes size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className='p-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Información básica */}
                        <div className='space-y-4'>
                            <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Información Básica</h3>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Marca *</label>
                                <input type='text' name='marca' value={formData.marca} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 ${errors.marca ? "border-red-500" : "border-gray-300"}`} required />
                                {errors.marca && <p className='text-red-500 text-sm mt-1'>{errors.marca}</p>}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Modelo *</label>
                                <input type='text' name='modelo' value={formData.modelo} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 ${errors.modelo ? "border-red-500" : "border-gray-300"}`} required />
                                {errors.modelo && <p className='text-red-500 text-sm mt-1'>{errors.modelo}</p>}
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Año *</label>
                                    <input type='number' name='año' value={formData.año} onChange={handleChange} min='1900' max={new Date().getFullYear() + 1} className={`w-full border rounded-lg px-3 py-2 ${errors.año ? "border-red-500" : "border-gray-300"}`} required />
                                    {errors.año && <p className='text-red-500 text-sm mt-1'>{errors.año}</p>}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Color</label>
                                    <input type='text' name='color' value={formData.color} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Combustible</label>
                                <select name='combustible' value={formData.combustible} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2'>
                                    <option value='Nafta'>Nafta</option>
                                    <option value='Diesel'>Diesel</option>
                                    <option value='GNC'>GNC</option>
                                    <option value='Eléctrico'>Eléctrico</option>
                                    <option value='Híbrido'>Híbrido</option>
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Estado</label>
                                <select name='estado' value={formData.estado} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2'>
                                    <option value='Disponible'>Disponible</option>
                                    <option value='Reservado'>Reservado</option>
                                    <option value='Vendido'>Vendido</option>
                                    <option value='Mantenimiento'>Mantenimiento</option>
                                </select>
                            </div>
                        </div>

                        {/* Información técnica */}
                        <div className='space-y-4'>
                            <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Información Técnica</h3>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Motor</label>
                                <input type='text' name='motor' value={formData.motor} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: 1.6 16V' />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Cilindrada</label>
                                    <input type='text' name='cilindrada' value={formData.cilindrada} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: 1600cc' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Potencia</label>
                                    <input type='text' name='potencia' value={formData.potencia} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: 110 HP' />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Transmisión</label>
                                    <select name='transmision' value={formData.transmision} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2'>
                                        <option value='Manual'>Manual</option>
                                        <option value='Automática'>Automática</option>
                                        <option value='CVT'>CVT</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Tracción</label>
                                    <select name='traccion' value={formData.traccion} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2'>
                                        <option value='Delantera'>Delantera</option>
                                        <option value='Trasera'>Trasera</option>
                                        <option value='4x4'>4x4</option>
                                        <option value='AWD'>AWD</option>
                                    </select>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Precio</label>
                                    <input type='number' name='precio' value={formData.precio} onChange={handleChange} min='0' step='0.01' className={`w-full border rounded-lg px-3 py-2 ${errors.precio ? "border-red-500" : "border-gray-300"}`} placeholder='0.00' />
                                    {errors.precio && <p className='text-red-500 text-sm mt-1'>{errors.precio}</p>}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Kilometraje</label>
                                    <input type='number' name='kilometraje' value={formData.kilometraje} onChange={handleChange} min='0' className={`w-full border rounded-lg px-3 py-2 ${errors.kilometraje ? "border-red-500" : "border-gray-300"}`} />
                                    {errors.kilometraje && <p className='text-red-500 text-sm mt-1'>{errors.kilometraje}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información adicional - Span completo */}
                    <div className='mt-6 space-y-6'>
                        <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Información Adicional</h3>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>VIN</label>
                                <input type='text' name='vin' value={formData.vin} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' maxLength='17' />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Patente</label>
                                <input type='text' name='patente' value={formData.patente} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Ubicación</label>
                            <input type='text' name='ubicacion' value={formData.ubicacion} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: Buenos Aires, Argentina' />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Descripción</label>
                            <textarea name='descripcion' value={formData.descripcion} onChange={handleChange} rows='3' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='Descripción detallada del vehículo...' />
                        </div>

                        {/* Equipamiento */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Equipamiento</label>
                            <div className='flex gap-2 mb-2'>
                                <input
                                    type='text'
                                    value={newEquipamiento}
                                    onChange={(e) => setNewEquipamiento(e.target.value)}
                                    className='flex-1 border border-gray-300 rounded-lg px-3 py-2'
                                    placeholder='ej: Aire acondicionado'
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEquipamiento())}
                                />
                                <button type='button' onClick={addEquipamiento} className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg'>
                                    <FaPlus />
                                </button>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {formData.equipamiento.map((item, index) => (
                                    <span key={index} className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1'>
                                        {item}
                                        <button type='button' onClick={() => removeEquipamiento(index)} className='text-blue-600 hover:text-blue-800'>
                                            <FaTrash size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Imágenes */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>URLs de Imágenes</label>
                            <div className='flex gap-2 mb-2'>
                                <input type='url' value={newImagen} onChange={(e) => setNewImagen(e.target.value)} className='flex-1 border border-gray-300 rounded-lg px-3 py-2' placeholder='https://ejemplo.com/imagen.jpg' onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImagen())} />
                                <button type='button' onClick={addImagen} className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg'>
                                    <FaPlus />
                                </button>
                            </div>
                            <div className='space-y-2'>
                                {formData.imagenes.map((url, index) => (
                                    <div key={index} className='flex items-center gap-2 p-2 bg-gray-50 rounded'>
                                        <span className='flex-1 text-sm truncate'>{url}</span>
                                        <button type='button' onClick={() => removeImagen(index)} className='text-red-600 hover:text-red-800'>
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Información de contacto */}
                        <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Información de Contacto</h3>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Nombre de Contacto</label>
                                <input type='text' name='contacto_nombre' value={formData.contacto_nombre} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Teléfono</label>
                                <input type='tel' name='contacto_telefono' value={formData.contacto_telefono} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
                                <input type='email' name='contacto_email' value={formData.contacto_email} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 ${errors.contacto_email ? "border-red-500" : "border-gray-300"}`} />
                                {errors.contacto_email && <p className='text-red-500 text-sm mt-1'>{errors.contacto_email}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className='flex justify-end gap-3 mt-6 pt-6 border-t'>
                        <button type='button' onClick={onClose} className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'>
                            Cancelar
                        </button>
                        <button type='submit' className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg'>
                            {vehicle ? "Actualizar" : "Crear"} Vehículo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
