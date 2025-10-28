"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { FaPlus, FaEdit, FaTrash, FaEye, FaSync } from "react-icons/fa"
import VehicleModalHybrid from "../../components/VehicleModalHybrid"
import VehicleCard from "../../components/VehicleCard"
import VehicleTable from "../../components/VehicleTable"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function VehiculosPage() {
    const [vehiculos, setVehiculos] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState(null)
    const [viewMode, setViewMode] = useState("cards") // 'cards' o 'table'
    const [filtros, setFiltros] = useState({
        marca: "",
        estado: "",
        año_desde: "",
        año_hasta: "",
        precio_desde: "",
        precio_hasta: ""
    })
    const [message, setMessage] = useState("")

    // Cargar vehículos al montar el componente
    useEffect(() => {
        cargarVehiculos()
    }, [])

    const cargarVehiculos = async () => {
        try {
            setLoading(true)
            let query = supabase.from("vehiculos").select("*").eq("activo", true).order("created_at", { ascending: false })

            // Aplicar filtros si existen
            if (filtros.marca) {
                query = query.ilike("marca", `%${filtros.marca}%`)
            }
            if (filtros.estado) {
                query = query.eq("estado", filtros.estado)
            }
            if (filtros.año_desde) {
                query = query.gte("vehiculo_ano", parseInt(filtros.año_desde))
            }
            if (filtros.año_hasta) {
                query = query.lte("vehiculo_ano", parseInt(filtros.año_hasta))
            }
            if (filtros.precio_desde) {
                query = query.gte("valor", parseFloat(filtros.precio_desde))
            }
            if (filtros.precio_hasta) {
                query = query.lte("valor", parseFloat(filtros.precio_hasta))
            }

            const { data, error } = await query

            if (error) {
                console.error("Error cargando vehículos:", error)
                setMessage(`Error cargando vehículos: ${error.message}`)
            } else {
                setVehiculos(data || [])
            }
        } catch (error) {
            console.error("Error:", error)
            setMessage(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const sincronizarConSheets = async () => {
        try {
            setMessage("Sincronizando con Google Sheets...")
            const response = await fetch("/api/sync-sheets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const result = await response.json()

            if (response.ok) {
                setMessage("Sincronización completada correctamente")
                cargarVehiculos() // Recargar datos
            } else {
                setMessage(`Error en sincronización: ${result.error}`)
            }
        } catch (error) {
            console.error("Error sincronizando:", error)
            setMessage(`Error sincronizando: ${error.message}`)
        }
    }

    const eliminarVehiculo = async (id) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este vehículo?")) return

        try {
            const { error } = await supabase.from("vehiculos").update({ activo: false }).eq("id", id)

            if (error) {
                setMessage(`Error eliminando vehículo: ${error.message}`)
            } else {
                setMessage("Vehículo eliminado correctamente")
                cargarVehiculos()
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`)
        }
    }

    const handleSave = async (vehicleData) => {
        try {
            let error

            if (selectedVehicle) {
                // Actualizar vehículo existente
                const result = await supabase
                    .from("vehiculos")
                    .update({
                        ...vehicleData,
                        updated_at: new Date().toISOString(),
                        sincronizado_sheets: false
                    })
                    .eq("id", selectedVehicle.id)

                error = result.error
            } else {
                // Crear nuevo vehículo
                const result = await supabase.from("vehiculos").insert([
                    {
                        ...vehicleData,
                        sincronizado_sheets: false
                    }
                ])

                error = result.error
            }

            if (error) {
                setMessage(`Error guardando vehículo: ${error.message}`)
            } else {
                setMessage(selectedVehicle ? "Vehículo actualizado correctamente" : "Vehículo creado correctamente")
                setShowModal(false)
                setSelectedVehicle(null)
                cargarVehiculos()
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`)
        }
    }

    const aplicarFiltros = () => {
        cargarVehiculos()
    }

    const limpiarFiltros = () => {
        setFiltros({
            marca: "",
            estado: "",
            año_desde: "",
            año_hasta: "",
            precio_desde: "",
            precio_hasta: ""
        })
        setTimeout(() => cargarVehiculos(), 100)
    }

    return (
        <div className='p-6 max-w-7xl mx-auto'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6 border-b pb-4'>
                <div className='flex items-center gap-3'>
                    <img src='/fratelli-logo.svg' alt='Logo' className='h-12' />
                    <h1 className='text-3xl font-bold'>Gestión de Vehículos</h1>
                </div>
                <div className='flex gap-3'>
                    <button onClick={sincronizarConSheets} className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2'>
                        <FaSync /> Sincronizar Sheets
                    </button>
                    <button
                        onClick={() => {
                            setSelectedVehicle(null)
                            setShowModal(true)
                        }}
                        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2'
                    >
                        <FaPlus /> Nuevo Vehículo
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className='bg-gray-50 p-4 rounded-lg mb-6'>
                <h3 className='text-lg font-semibold mb-3'>Filtros</h3>
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                    <input type='text' placeholder='Marca' value={filtros.marca} onChange={(e) => setFiltros({ ...filtros, marca: e.target.value })} className='border border-gray-300 p-2 rounded' />
                    <select value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })} className='border border-gray-300 p-2 rounded'>
                        <option value=''>Todos los estados</option>
                        <option value='Disponible'>Disponible</option>
                        <option value='Vendido'>Vendido</option>
                        <option value='Reservado'>Reservado</option>
                        <option value='Mantenimiento'>Mantenimiento</option>
                    </select>
                    <input type='number' placeholder='Año desde' value={filtros.año_desde} onChange={(e) => setFiltros({ ...filtros, año_desde: e.target.value })} className='border border-gray-300 p-2 rounded' />
                    <input type='number' placeholder='Año hasta' value={filtros.año_hasta} onChange={(e) => setFiltros({ ...filtros, año_hasta: e.target.value })} className='border border-gray-300 p-2 rounded' />
                    <input type='number' placeholder='Precio desde' value={filtros.precio_desde} onChange={(e) => setFiltros({ ...filtros, precio_desde: e.target.value })} className='border border-gray-300 p-2 rounded' />
                    <input type='number' placeholder='Precio hasta' value={filtros.precio_hasta} onChange={(e) => setFiltros({ ...filtros, precio_hasta: e.target.value })} className='border border-gray-300 p-2 rounded' />
                </div>
                <div className='flex gap-3 mt-4'>
                    <button onClick={aplicarFiltros} className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'>
                        Aplicar Filtros
                    </button>
                    <button onClick={limpiarFiltros} className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded'>
                        Limpiar
                    </button>
                </div>
            </div>

            {/* Selector de vista */}
            <div className='flex justify-between items-center mb-4'>
                <div className='flex gap-2'>
                    <button onClick={() => setViewMode("cards")} className={`px-4 py-2 rounded ${viewMode === "cards" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
                        Vista Cards
                    </button>
                    <button onClick={() => setViewMode("table")} className={`px-4 py-2 rounded ${viewMode === "table" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
                        Vista Tabla
                    </button>
                </div>
                <span className='text-gray-600'>Total: {vehiculos.length} vehículos</span>
            </div>

            {/* Mensajes */}
            {message && <div className={`mb-4 p-3 rounded-lg ${message.includes("Error") || message.includes("error") ? "bg-red-100 text-red-700 border border-red-300" : "bg-green-100 text-green-700 border border-green-300"}`}>{message}</div>}

            {/* Contenido principal */}
            {loading ? (
                <div className='text-center py-8'>
                    <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                    <p className='mt-2'>Cargando vehículos...</p>
                </div>
            ) : vehiculos.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    <FaEye className='mx-auto text-4xl mb-4' />
                    <p>No hay vehículos para mostrar</p>
                </div>
            ) : viewMode === "cards" ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {vehiculos.map((vehiculo) => (
                        <VehicleCard
                            key={vehiculo.id}
                            vehiculo={vehiculo}
                            onEdit={(vehicle) => {
                                setSelectedVehicle(vehicle)
                                setShowModal(true)
                            }}
                            onDelete={eliminarVehiculo}
                        />
                    ))}
                </div>
            ) : (
                <VehicleTable
                    vehiculos={vehiculos}
                    onEdit={(vehicle) => {
                        setSelectedVehicle(vehicle)
                        setShowModal(true)
                    }}
                    onDelete={eliminarVehiculo}
                />
            )}

            {/* Modal */}
            {showModal && (
                <VehicleModalHybrid
                    vehicle={selectedVehicle}
                    onSave={handleSave}
                    onClose={() => {
                        setShowModal(false)
                        setSelectedVehicle(null)
                        setMessage("")
                    }}
                />
            )}
        </div>
    )
}
