import { useState, useEffect } from "react"
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa"

export default function VehicleModalHybrid({ vehicle, onSave, onClose }) {
    const [formData, setFormData] = useState({
        // Campos existentes (compatibilidad)
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
        contacto_email: "",

        // Campos nuevos consolidados
        version: "",
        vehiculo_ano: new Date().getFullYear(),
        modelo_ano: "",
        valor: "",
        moneda: "ARS",
        condicion: "Usado",
        vendedor: "",
        dominio: "",

        // Fechas
        fecha_ingreso: "",
        fecha_reserva: "",
        fecha_entrega: "",

        // Publicaciones
        publicacion_web: false,
        publicacion_api_call: false,
        publi_insta: false,
        publi_face: false,
        publi_mer_lib: false,
        publi_mark_p: false,

        // Información técnica extendida
        motorizacion: "",
        caja: "Manual",
        puertas: "",
        segmento_modelo: "",
        potencia_hp: "",
        torque_nm: "",
        velocidad_max: "",

        // Seguridad
        airbags: "",
        abs: false,
        control_estabilidad: false,

        // Confort
        climatizador: "",
        multimedia: "",
        asistencia_manejo: [],

        // Información técnica adicional
        frenos: "",
        neumaticos: "",
        llantas: "",
        rendimiento_mixto: "",
        capacidad_baul: "",
        capacidad_combustible: "",

        // Dimensiones
        largo: "",
        ancho: "",
        alto: "",

        // URLs y documentación
        url_ficha: "",
        modelo_rag: "",
        titulo_legible: "",
        ficha_breve: "",

        // Gestión
        pendientes_preparacion: ""
    })

    const [errors, setErrors] = useState({})
    const [newEquipamiento, setNewEquipamiento] = useState("")
    const [newImagen, setNewImagen] = useState("")
    const [newAsistencia, setNewAsistencia] = useState("")
    const [activeTab, setActiveTab] = useState("basica")

    useEffect(() => {
        if (vehicle) {
            // Mapear campos existentes a nuevos y viceversa para compatibilidad total
            const mappedVehicle = {
                ...vehicle,
                equipamiento: vehicle.equipamiento || [],
                imagenes: vehicle.imagenes || [],
                asistencia_manejo: vehicle.asistencia_manejo || [],

                // Sincronización de campos duplicados
                vehiculo_ano: vehicle.vehiculo_ano || vehicle.año,
                año: vehicle.año || vehicle.vehiculo_ano,
                valor: vehicle.valor || vehicle.precio,
                precio: vehicle.precio || vehicle.valor,
                motorizacion: vehicle.motorizacion || vehicle.motor,
                motor: vehicle.motor || vehicle.motorizacion,
                caja: vehicle.caja || vehicle.transmision,
                transmision: vehicle.transmision || vehicle.caja,
                dominio: vehicle.dominio || vehicle.patente,
                vendedor: vehicle.vendedor || vehicle.contacto_nombre,
                contacto_nombre: vehicle.contacto_nombre || vehicle.vendedor
            }

            setFormData((prev) => ({ ...prev, ...mappedVehicle }))
        }
    }, [vehicle])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        const newValue = type === "checkbox" ? checked : value

        setFormData((prev) => {
            const updated = { ...prev, [name]: newValue }

            // Sincronización automática de campos relacionados
            if (name === "año") updated.vehiculo_ano = newValue
            if (name === "vehiculo_ano") updated.año = newValue
            if (name === "precio") updated.valor = newValue
            if (name === "valor") updated.precio = newValue
            if (name === "motor") updated.motorizacion = newValue
            if (name === "motorizacion") updated.motor = newValue
            if (name === "transmision") updated.caja = newValue
            if (name === "caja") updated.transmision = newValue
            if (name === "patente") updated.dominio = newValue
            if (name === "dominio") updated.patente = newValue
            if (name === "contacto_nombre") updated.vendedor = newValue
            if (name === "vendedor") updated.contacto_nombre = newValue

            return updated
        })

        // Limpiar error del campo
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
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

    const addAsistencia = () => {
        if (newAsistencia.trim()) {
            setFormData((prev) => ({
                ...prev,
                asistencia_manejo: [...prev.asistencia_manejo, newAsistencia.trim()]
            }))
            setNewAsistencia("")
        }
    }

    const removeAsistencia = (index) => {
        setFormData((prev) => ({
            ...prev,
            asistencia_manejo: prev.asistencia_manejo.filter((_, i) => i !== index)
        }))
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.marca.trim()) newErrors.marca = "La marca es requerida"
        if (!formData.modelo.trim()) newErrors.modelo = "El modelo es requerido"

        const año = formData.vehiculo_ano || formData.año
        if (!año || año < 1900 || año > new Date().getFullYear() + 2) {
            newErrors.año = "Año inválido"
            newErrors.vehiculo_ano = "Año inválido"
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
            // Limpiar y convertir datos
            const cleanData = {
                ...formData,
                // Asegurar sincronización de campos críticos
                año: parseInt(formData.vehiculo_ano || formData.año),
                vehiculo_ano: parseInt(formData.vehiculo_ano || formData.año),
                precio: formData.valor ? parseFloat(formData.valor) : formData.precio ? parseFloat(formData.precio) : null,
                valor: formData.valor ? parseFloat(formData.valor) : formData.precio ? parseFloat(formData.precio) : null,
                kilometraje: parseInt(formData.kilometraje) || 0,
                kilometros: parseInt(formData.kilometraje) || 0,
                motor: formData.motorizacion || formData.motor,
                motorizacion: formData.motorizacion || formData.motor,
                transmision: formData.caja || formData.transmision,
                caja: formData.caja || formData.transmision,
                dominio: formData.dominio || formData.patente,
                contacto_nombre: formData.vendedor || formData.contacto_nombre,
                vendedor: formData.vendedor || formData.contacto_nombre,

                // Convertir campos numéricos opcionales
                modelo_ano: formData.modelo_ano ? parseInt(formData.modelo_ano) : null,
                potencia_hp: formData.potencia_hp ? parseInt(formData.potencia_hp) : null,
                torque_nm: formData.torque_nm ? parseInt(formData.torque_nm) : null,
                puertas: formData.puertas ? parseInt(formData.puertas) : null,
                airbags: formData.airbags ? parseInt(formData.airbags) : null,
                velocidad_max: formData.velocidad_max ? parseInt(formData.velocidad_max) : null,
                largo: formData.largo ? parseFloat(formData.largo) : null,
                ancho: formData.ancho ? parseFloat(formData.ancho) : null,
                alto: formData.alto ? parseFloat(formData.alto) : null,
                rendimiento_mixto: formData.rendimiento_mixto ? parseFloat(formData.rendimiento_mixto) : null,
                capacidad_baul: formData.capacidad_baul ? parseInt(formData.capacidad_baul) : null,
                capacidad_combustible: formData.capacidad_combustible ? parseInt(formData.capacidad_combustible) : null
            }

            onSave(cleanData)
        }
    }

    const tabs = [
        { id: "basica", label: "Información Básica" },
        { id: "comercial", label: "Comercial & Fechas" },
        { id: "tecnica", label: "Técnica" },
        { id: "publicaciones", label: "Publicaciones" },
        { id: "adicional", label: "Adicional" }
    ]

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10'>
                    <h2 className='text-2xl font-bold'>{vehicle ? "Editar Vehículo" : "Nuevo Vehículo"}</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className='flex border-b bg-gray-50 sticky top-[85px] z-10'>
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id ? "border-blue-600 text-blue-600 bg-white" : "border-transparent text-gray-600 hover:text-gray-800"}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className='p-6'>
                    {/* Tab: Información Básica */}
                    {activeTab === "basica" && (
                        <div className='space-y-6'>
                            <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Información Básica del Vehículo</h3>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Versión</label>
                                    <input type='text' name='version' value={formData.version} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Año *</label>
                                    <input type='number' name='año' value={formData.año} onChange={handleChange} min='1900' max={new Date().getFullYear() + 2} className={`w-full border rounded-lg px-3 py-2 ${errors.año ? "border-red-500" : "border-gray-300"}`} required />
                                    {errors.año && <p className='text-red-500 text-sm mt-1'>{errors.año}</p>}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Color</label>
                                    <input type='text' name='color' value={formData.color} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
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
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Patente</label>
                                    <input type='text' name='patente' value={formData.patente} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ABC123' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Kilometraje</label>
                                    <input type='number' name='kilometraje' value={formData.kilometraje} onChange={handleChange} min='0' className='w-full border border-gray-300 rounded-lg px-3 py-2' />
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

                            {/* Equipamiento existente */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Equipamiento</label>
                                <div className='flex gap-2 mb-2'>
                                    <input type='text' value={newEquipamiento} onChange={(e) => setNewEquipamiento(e.target.value)} className='flex-1 border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: Aire acondicionado' />
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

                            {/* Imágenes existentes */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>URLs de Imágenes</label>
                                <div className='flex gap-2 mb-2'>
                                    <input type='url' value={newImagen} onChange={(e) => setNewImagen(e.target.value)} className='flex-1 border border-gray-300 rounded-lg px-3 py-2' placeholder='https://ejemplo.com/imagen.jpg' />
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
                        </div>
                    )}

                    {/* Tab: Información Comercial */}
                    {activeTab === "comercial" && (
                        <div className='space-y-6'>
                            <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Información Comercial y Fechas</h3>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Precio</label>
                                    <input type='number' name='precio' value={formData.precio} onChange={handleChange} step='0.01' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='0.00' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Moneda</label>
                                    <select name='moneda' value={formData.moneda} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2'>
                                        <option value='ARS'>ARS (Pesos)</option>
                                        <option value='USD'>USD (Dólares)</option>
                                        <option value='EUR'>EUR (Euros)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Condición</label>
                                    <select name='condicion' value={formData.condicion} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2'>
                                        <option value='Nuevo'>Nuevo</option>
                                        <option value='0km'>0km</option>
                                        <option value='Usado'>Usado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Vendedor</label>
                                    <input type='text' name='vendedor' value={formData.vendedor} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Ubicación</label>
                                    <input type='text' name='ubicacion' value={formData.ubicacion} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha de Ingreso</label>
                                    <input type='date' name='fecha_ingreso' value={formData.fecha_ingreso} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha de Reserva</label>
                                    <input type='date' name='fecha_reserva' value={formData.fecha_reserva} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha de Entrega</label>
                                    <input type='date' name='fecha_entrega' value={formData.fecha_entrega} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Pendientes de Preparación</label>
                                <textarea name='pendientes_preparacion' value={formData.pendientes_preparacion} onChange={handleChange} rows='3' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='Tareas pendientes para el vehículo...' />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Descripción</label>
                                <textarea name='descripcion' value={formData.descripcion} onChange={handleChange} rows='3' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='Descripción detallada del vehículo...' />
                            </div>
                        </div>
                    )}

                    {/* Tab: Información Técnica */}
                    {activeTab === "tecnica" && (
                        <div className='space-y-6'>
                            <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Información Técnica</h3>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Motor</label>
                                    <input type='text' name='motor' value={formData.motor} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: 1.6 16V Turbo' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Cilindrada</label>
                                    <input type='text' name='cilindrada' value={formData.cilindrada} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: 1600cc' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Potencia</label>
                                    <input type='text' name='potencia' value={formData.potencia} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: 110 HP' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Transmisión</label>
                                    <select name='transmision' value={formData.transmision} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2'>
                                        <option value='Manual'>Manual</option>
                                        <option value='Automática'>Automática</option>
                                        <option value='CVT'>CVT</option>
                                        <option value='Secuencial'>Secuencial</option>
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

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Puertas</label>
                                    <select name='puertas' value={formData.puertas} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2'>
                                        <option value=''>Seleccionar</option>
                                        <option value='2'>2 puertas</option>
                                        <option value='3'>3 puertas</option>
                                        <option value='4'>4 puertas</option>
                                        <option value='5'>5 puertas</option>
                                    </select>
                                </div>
                            </div>

                            {/* Asistencias de Manejo */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Asistencias de Manejo</label>
                                <div className='flex gap-2 mb-2'>
                                    <input type='text' value={newAsistencia} onChange={(e) => setNewAsistencia(e.target.value)} className='flex-1 border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: Control de crucero adaptativo' />
                                    <button type='button' onClick={addAsistencia} className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg'>
                                        <FaPlus />
                                    </button>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {formData.asistencia_manejo.map((item, index) => (
                                        <span key={index} className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1'>
                                            {item}
                                            <button type='button' onClick={() => removeAsistencia(index)} className='text-green-600 hover:text-green-800'>
                                                <FaTrash size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Publicaciones */}
                    {activeTab === "publicaciones" && (
                        <div className='space-y-6'>
                            <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Estado de Publicaciones</h3>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                <div className='flex items-center space-x-3'>
                                    <input type='checkbox' name='publicacion_web' checked={formData.publicacion_web} onChange={handleChange} className='w-4 h-4' />
                                    <label className='text-sm font-medium text-gray-700'>Publicación Web</label>
                                </div>

                                <div className='flex items-center space-x-3'>
                                    <input type='checkbox' name='publi_insta' checked={formData.publi_insta} onChange={handleChange} className='w-4 h-4' />
                                    <label className='text-sm font-medium text-gray-700'>Instagram</label>
                                </div>

                                <div className='flex items-center space-x-3'>
                                    <input type='checkbox' name='publi_face' checked={formData.publi_face} onChange={handleChange} className='w-4 h-4' />
                                    <label className='text-sm font-medium text-gray-700'>Facebook</label>
                                </div>

                                <div className='flex items-center space-x-3'>
                                    <input type='checkbox' name='publi_mer_lib' checked={formData.publi_mer_lib} onChange={handleChange} className='w-4 h-4' />
                                    <label className='text-sm font-medium text-gray-700'>Mercado Libre</label>
                                </div>

                                <div className='flex items-center space-x-3'>
                                    <input type='checkbox' name='publi_mark_p' checked={formData.publi_mark_p} onChange={handleChange} className='w-4 h-4' />
                                    <label className='text-sm font-medium text-gray-700'>Marketing Publicitario</label>
                                </div>

                                <div className='flex items-center space-x-3'>
                                    <input type='checkbox' name='publicacion_api_call' checked={formData.publicacion_api_call} onChange={handleChange} className='w-4 h-4' />
                                    <label className='text-sm font-medium text-gray-700'>API Call</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Información Adicional */}
                    {activeTab === "adicional" && (
                        <div className='space-y-6'>
                            <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Información Adicional</h3>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>VIN</label>
                                    <input type='text' name='vin' value={formData.vin} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' maxLength='17' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>URL Ficha Técnica</label>
                                    <input type='url' name='url_ficha' value={formData.url_ficha} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='https://ejemplo.com/ficha-tecnica' />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Contacto Nombre</label>
                                    <input type='text' name='contacto_nombre' value={formData.contacto_nombre} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Contacto Teléfono</label>
                                    <input type='tel' name='contacto_telefono' value={formData.contacto_telefono} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Contacto Email</label>
                                    <input type='email' name='contacto_email' value={formData.contacto_email} onChange={handleChange} className={`w-full border rounded-lg px-3 py-2 ${errors.contacto_email ? "border-red-500" : "border-gray-300"}`} />
                                    {errors.contacto_email && <p className='text-red-500 text-sm mt-1'>{errors.contacto_email}</p>}
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Título Legible</label>
                                <input type='text' name='titulo_legible' value={formData.titulo_legible} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: Ford Focus 1.6 Titanium 2020' />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Ficha Breve</label>
                                <textarea name='ficha_breve' value={formData.ficha_breve} onChange={handleChange} rows='4' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='Resumen breve del vehículo con sus características principales...' />
                            </div>
                        </div>
                    )}

                    {/* Botones */}
                    <div className='flex justify-end gap-3 mt-6 pt-6 border-t sticky bottom-0 bg-white'>
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
