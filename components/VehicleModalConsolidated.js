import { useState, useEffect } from "react"
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa"

export default function VehicleModalConsolidated({ vehicle, onSave, onClose }) {
    const [formData, setFormData] = useState({
        // Información básica
        marca: "",
        modelo: "",
        version: "",
        vehiculo_ano: new Date().getFullYear(),
        modelo_ano: "",

        // Identificación
        patente: "",
        dominio: "",
        kilometros: 0,

        // Información comercial
        valor: "",
        moneda: "ARS",
        condicion: "Usado",
        vendedor: "",

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

        // Información técnica
        motorizacion: "",
        combustible: "Nafta",
        cilindrada: "",
        potencia_hp: "",
        torque_nm: "",

        // Transmisión y tracción
        caja: "Manual",
        traccion: "Delantera",

        // Características físicas
        puertas: "",
        segmento_modelo: "",
        largo: "",
        ancho: "",
        alto: "",

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
        velocidad_max: "",

        // URLs
        url_ficha: "",

        // IA/ML
        modelo_rag: "",
        titulo_legible: "",
        ficha_breve: "",

        // Estado
        estado: "Disponible",
        pendientes_preparacion: ""
    })

    const [errors, setErrors] = useState({})
    const [newAsistencia, setNewAsistencia] = useState("")
    const [activeTab, setActiveTab] = useState("basica")

    useEffect(() => {
        if (vehicle) {
            setFormData({
                ...formData,
                ...vehicle,
                asistencia_manejo: vehicle.asistencia_manejo || []
            })
        }
    }, [vehicle])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))

        // Limpiar error del campo
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ""
            }))
        }
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
        if (!formData.vehiculo_ano || formData.vehiculo_ano < 1900 || formData.vehiculo_ano > new Date().getFullYear() + 2) {
            newErrors.vehiculo_ano = "Año inválido"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (validateForm()) {
            // Convertir campos numéricos
            const cleanData = {
                ...formData,
                vehiculo_ano: parseInt(formData.vehiculo_ano),
                modelo_ano: formData.modelo_ano ? parseInt(formData.modelo_ano) : null,
                kilometros: parseInt(formData.kilometros) || 0,
                valor: formData.valor ? parseFloat(formData.valor) : null,
                potencia_hp: formData.potencia_hp ? parseInt(formData.potencia_hp) : null,
                torque_nm: formData.torque_nm ? parseInt(formData.torque_nm) : null,
                puertas: formData.puertas ? parseInt(formData.puertas) : null,
                airbags: formData.airbags ? parseInt(formData.airbags) : null,
                largo: formData.largo ? parseFloat(formData.largo) : null,
                ancho: formData.ancho ? parseFloat(formData.ancho) : null,
                alto: formData.alto ? parseFloat(formData.alto) : null,
                rendimiento_mixto: formData.rendimiento_mixto ? parseFloat(formData.rendimiento_mixto) : null,
                capacidad_baul: formData.capacidad_baul ? parseInt(formData.capacidad_baul) : null,
                capacidad_combustible: formData.capacidad_combustible ? parseInt(formData.capacidad_combustible) : null,
                velocidad_max: formData.velocidad_max ? parseInt(formData.velocidad_max) : null
            }

            onSave(cleanData)
        }
    }

    const tabs = [
        { id: "basica", label: "Información Básica" },
        { id: "comercial", label: "Comercial" },
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
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Año del Vehículo *</label>
                                    <input type='number' name='vehiculo_ano' value={formData.vehiculo_ano} onChange={handleChange} min='1900' max={new Date().getFullYear() + 2} className={`w-full border rounded-lg px-3 py-2 ${errors.vehiculo_ano ? "border-red-500" : "border-gray-300"}`} required />
                                    {errors.vehiculo_ano && <p className='text-red-500 text-sm mt-1'>{errors.vehiculo_ano}</p>}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Año del Modelo</label>
                                    <input type='number' name='modelo_ano' value={formData.modelo_ano} onChange={handleChange} min='1900' max={new Date().getFullYear() + 2} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Segmento</label>
                                    <select name='segmento_modelo' value={formData.segmento_modelo} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2'>
                                        <option value=''>Seleccionar segmento</option>
                                        <option value='Sedán'>Sedán</option>
                                        <option value='Hatchback'>Hatchback</option>
                                        <option value='SUV'>SUV</option>
                                        <option value='Pickup'>Pickup</option>
                                        <option value='Coupé'>Coupé</option>
                                        <option value='Convertible'>Convertible</option>
                                        <option value='Station Wagon'>Station Wagon</option>
                                        <option value='Utilitario'>Utilitario</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Patente</label>
                                    <input type='text' name='patente' value={formData.patente} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ABC123' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Kilómetros</label>
                                    <input type='number' name='kilometros' value={formData.kilometros} onChange={handleChange} min='0' className='w-full border border-gray-300 rounded-lg px-3 py-2' />
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

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Largo (m)</label>
                                    <input type='number' name='largo' value={formData.largo} onChange={handleChange} step='0.01' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='4.50' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Ancho (m)</label>
                                    <input type='number' name='ancho' value={formData.ancho} onChange={handleChange} step='0.01' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='1.80' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Alto (m)</label>
                                    <input type='number' name='alto' value={formData.alto} onChange={handleChange} step='0.01' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='1.50' />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab: Información Comercial */}
                    {activeTab === "comercial" && (
                        <div className='space-y-6'>
                            <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Información Comercial</h3>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Valor</label>
                                    <input type='number' name='valor' value={formData.valor} onChange={handleChange} step='0.01' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='0.00' />
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
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Estado</label>
                                    <select name='estado' value={formData.estado} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2'>
                                        <option value='Disponible'>Disponible</option>
                                        <option value='Reservado'>Reservado</option>
                                        <option value='Vendido'>Vendido</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Vendedor</label>
                                    <input type='text' name='vendedor' value={formData.vendedor} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' />
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
                        </div>
                    )}

                    {/* Tab: Información Técnica */}
                    {activeTab === "tecnica" && (
                        <div className='space-y-6'>
                            <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Información Técnica</h3>

                            {/* Motor */}
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Motorización</label>
                                    <input type='text' name='motorizacion' value={formData.motorizacion} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: 1.6 16V Turbo' />
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
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Cilindrada</label>
                                    <input type='text' name='cilindrada' value={formData.cilindrada} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: 1600cc' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Potencia (HP)</label>
                                    <input type='number' name='potencia_hp' value={formData.potencia_hp} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='110' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Torque (Nm)</label>
                                    <input type='number' name='torque_nm' value={formData.torque_nm} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='150' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Velocidad Máxima (km/h)</label>
                                    <input type='number' name='velocidad_max' value={formData.velocidad_max} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='180' />
                                </div>
                            </div>

                            {/* Transmisión */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Caja de Cambios</label>
                                    <select name='caja' value={formData.caja} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2'>
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
                            </div>

                            {/* Capacidades */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Rendimiento Mixto (km/l)</label>
                                    <input type='number' name='rendimiento_mixto' value={formData.rendimiento_mixto} onChange={handleChange} step='0.1' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='12.5' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Capacidad Baúl (L)</label>
                                    <input type='number' name='capacidad_baul' value={formData.capacidad_baul} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='500' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Capacidad Combustible (L)</label>
                                    <input type='number' name='capacidad_combustible' value={formData.capacidad_combustible} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='60' />
                                </div>
                            </div>

                            {/* Frenos y Neumáticos */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Frenos</label>
                                    <input type='text' name='frenos' value={formData.frenos} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: Discos ventilados adelante' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Neumáticos</label>
                                    <input type='text' name='neumaticos' value={formData.neumaticos} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: 205/55 R16' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Llantas</label>
                                    <input type='text' name='llantas' value={formData.llantas} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: Aleación 16' />
                                </div>
                            </div>

                            {/* Seguridad */}
                            <h4 className='text-md font-semibold text-gray-800 border-b pb-1'>Seguridad</h4>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Airbags</label>
                                    <input type='number' name='airbags' value={formData.airbags} onChange={handleChange} min='0' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='6' />
                                </div>

                                <div className='flex items-center'>
                                    <input type='checkbox' name='abs' checked={formData.abs} onChange={handleChange} className='mr-2' />
                                    <label className='text-sm font-medium text-gray-700'>ABS</label>
                                </div>

                                <div className='flex items-center'>
                                    <input type='checkbox' name='control_estabilidad' checked={formData.control_estabilidad} onChange={handleChange} className='mr-2' />
                                    <label className='text-sm font-medium text-gray-700'>Control de Estabilidad</label>
                                </div>
                            </div>

                            {/* Confort */}
                            <h4 className='text-md font-semibold text-gray-800 border-b pb-1'>Confort</h4>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Climatizador</label>
                                    <select name='climatizador' value={formData.climatizador} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2'>
                                        <option value=''>Sin climatización</option>
                                        <option value='Manual'>Manual</option>
                                        <option value='Automático'>Automático</option>
                                        <option value='Dual Zone'>Dual Zone</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Sistema Multimedia</label>
                                    <input type='text' name='multimedia' value={formData.multimedia} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: Pantalla tactil 8 con Android Auto' />
                                </div>
                            </div>

                            {/* Asistencias de Manejo */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Asistencias de Manejo</label>
                                <div className='flex gap-2 mb-2'>
                                    <input
                                        type='text'
                                        value={newAsistencia}
                                        onChange={(e) => setNewAsistencia(e.target.value)}
                                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2'
                                        placeholder='ej: Control de crucero adaptativo'
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAsistencia())}
                                    />
                                    <button type='button' onClick={addAsistencia} className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg'>
                                        <FaPlus />
                                    </button>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {formData.asistencia_manejo.map((item, index) => (
                                        <span key={index} className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1'>
                                            {item}
                                            <button type='button' onClick={() => removeAsistencia(index)} className='text-blue-600 hover:text-blue-800'>
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
                                    <input type='checkbox' name='publicacion_api_call' checked={formData.publicacion_api_call} onChange={handleChange} className='w-4 h-4' />
                                    <label className='text-sm font-medium text-gray-700'>API Call</label>
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
                            </div>
                        </div>
                    )}

                    {/* Tab: Información Adicional */}
                    {activeTab === "adicional" && (
                        <div className='space-y-6'>
                            <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Información Adicional</h3>

                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>URL Ficha Técnica</label>
                                    <input type='url' name='url_ficha' value={formData.url_ficha} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='https://ejemplo.com/ficha-tecnica' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Título Legible</label>
                                    <input type='text' name='titulo_legible' value={formData.titulo_legible} onChange={handleChange} className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='ej: Ford Focus 1.6 Titanium 2020' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Ficha Breve</label>
                                    <textarea name='ficha_breve' value={formData.ficha_breve} onChange={handleChange} rows='4' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='Resumen breve del vehículo con sus características principales...' />
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Modelo RAG (IA)</label>
                                    <textarea name='modelo_rag' value={formData.modelo_rag} onChange={handleChange} rows='3' className='w-full border border-gray-300 rounded-lg px-3 py-2' placeholder='Información para procesamiento con IA...' />
                                </div>
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
