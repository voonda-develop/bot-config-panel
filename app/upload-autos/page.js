"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function StockUploadPage() {
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState("")
    const [uploading, setUploading] = useState(false)

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        setMessage("")
    }

    const handleUpload = async () => {
        if (!file) return setMessage("Seleccioná un archivo primero.")

        setUploading(true)
        setMessage("Subiendo archivo...")

        const fileExt = file.name.split(".").pop()
        const fileName = `stock_actual.${fileExt}`
        const filePath = `importaciones/${fileName}`

        const { error } = await supabase.storage.from("importaciones").upload(filePath, file, {
            upsert: true,
            contentType: file.type
        })

        if (error) {
            console.error(error)
            setMessage("Error al subir el archivo.")
        } else {
            setMessage("Archivo subido correctamente.")
        }

        setUploading(false)
    }

    return (
        <div className='p-6 max-w-xl mx-auto space-y-4'>
            <div className='flex items-center gap-3 mb-6 border-b pb-4'>
                <img src='/fratelli-logo.svg' alt='Logo' className='h-15' />
                <h1 className='text-2xl font-semibold ms-6'>Carga de Stock</h1>
            </div>

            <p className='text-gray-700'>Subí el archivo actualizado del stock en formato Excel (.xlsx o .xlsm).</p>

            <input type='file' accept='.xlsx,.xlsm' onChange={handleFileChange} className='block w-full border border-gray-300 p-2 rounded mt-2' />

            <button onClick={handleUpload} disabled={uploading || !file} className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50 mt-4'>
                {uploading ? "Subiendo..." : "Subir archivo"}
            </button>

            {message && <div className={`mt-4 p-3 rounded-lg text-center font-medium ${message.includes("correctamente") ? "bg-green-100 text-green-700 border border-green-300" : "bg-red-100 text-red-700 border border-red-300"}`}>{message}</div>}
        </div>
    )
}
