import { createClient } from "@supabase/supabase-js"
import { google } from "googleapis"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" })
    }

    try {
        // Configurar Google Sheets API
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"]
        })

        const sheets = google.sheets({ version: "v4", auth })
        const spreadsheetId = process.env.GOOGLE_SHEETS_ID

        // Obtener todos los vehículos activos de la base de datos
        const { data: vehiculos, error: dbError } = await supabase.from("vehiculos").select("*").eq("activo", true).order("created_at", { ascending: false })

        if (dbError) {
            console.error("Error obteniendo vehículos:", dbError)
            return res.status(500).json({ error: "Error obteniendo datos de la base de datos" })
        }

        // Definir las columnas consolidadas para Google Sheets
        const headers = [
            "patente",
            "kilometros",
            "vehiculo_ano",
            "valor",
            "moneda",
            "publicacion_web",
            "publicacion_api_call",
            "marca",
            "modelo",
            "modelo_ano",
            "version",
            "motorizacion",
            "combustible",
            "caja",
            "traccion",
            "puertas",
            "segmento_modelo",
            "cilindrada",
            "potencia_hp",
            "torque_nm",
            "airbags",
            "abs",
            "control_estabilidad",
            "climatizador",
            "multimedia",
            "frenos",
            "neumaticos",
            "llantas",
            "asistencia_manejo",
            "rendimiento_mixto",
            "capacidad_baul",
            "capacidad_combustible",
            "velocidad_max",
            "largo",
            "ancho",
            "alto",
            "url_ficha",
            "modelo_rag",
            "titulo_legible",
            "ficha_breve",
            "Marca",
            "Modelo",
            "Version",
            "Año",
            "Kilometros",
            "Dominio",
            "Fecha ingreso",
            "Publi Insta",
            "Publi Face",
            "Publi Mer. Lib.",
            "Publi Web",
            "Publi Mark. P",
            "Valor",
            "Pendientes preparacion",
            "FECHA DE RESERVA",
            "FECHA DE ENTREGA",
            "Condicion",
            "Vendedor"
        ]

        // Convertir datos de vehículos al formato consolidado de Google Sheets
        // Usar mapeo híbrido para compatibilidad total con campos existentes y nuevos
        const rows = vehiculos.map((vehiculo) => [
            // Primera estructura
            vehiculo.patente || "",
            vehiculo.kilometros || vehiculo.kilometraje || "",
            vehiculo.vehiculo_ano || vehiculo.año || "",
            vehiculo.valor || vehiculo.precio || "",
            vehiculo.moneda || "ARS",
            vehiculo.publicacion_web ? "TRUE" : "FALSE",
            vehiculo.publicacion_api_call ? "TRUE" : "FALSE",
            vehiculo.marca || "",
            vehiculo.modelo || "",
            vehiculo.modelo_ano || "",
            vehiculo.version || "",
            vehiculo.motorizacion || vehiculo.motor || "",
            vehiculo.combustible || "",
            vehiculo.caja || vehiculo.transmision || "",
            vehiculo.traccion || "",
            vehiculo.puertas || "",
            vehiculo.segmento_modelo || "",
            vehiculo.cilindrada || "",
            vehiculo.potencia_hp || "",
            vehiculo.torque_nm || "",
            vehiculo.airbags || "",
            vehiculo.abs ? "TRUE" : "FALSE",
            vehiculo.control_estabilidad ? "TRUE" : "FALSE",
            vehiculo.climatizador || "",
            vehiculo.multimedia || "",
            vehiculo.frenos || "",
            vehiculo.neumaticos || "",
            vehiculo.llantas || "",
            vehiculo.asistencia_manejo ? vehiculo.asistencia_manejo.join(", ") : "",
            vehiculo.rendimiento_mixto || "",
            vehiculo.capacidad_baul || "",
            vehiculo.capacidad_combustible || "",
            vehiculo.velocidad_max || "",
            vehiculo.largo || "",
            vehiculo.ancho || "",
            vehiculo.alto || "",
            vehiculo.url_ficha || "",
            vehiculo.modelo_rag || "",
            vehiculo.titulo_legible || "",
            vehiculo.ficha_breve || "",

            // Segunda estructura (duplicados consolidados)
            vehiculo.marca || "", // Marca
            vehiculo.modelo || "", // Modelo
            vehiculo.version || "", // Version
            vehiculo.vehiculo_ano || vehiculo.año || "", // Año
            vehiculo.kilometros || vehiculo.kilometraje || "", // Kilometros
            vehiculo.dominio || vehiculo.patente || "", // Dominio
            vehiculo.fecha_ingreso ? new Date(vehiculo.fecha_ingreso).toLocaleDateString("es-AR") : "", // Fecha ingreso
            vehiculo.publi_insta ? "TRUE" : "FALSE", // Publi Insta
            vehiculo.publi_face ? "TRUE" : "FALSE", // Publi Face
            vehiculo.publi_mer_lib ? "TRUE" : "FALSE", // Publi Mer. Lib.
            vehiculo.publicacion_web ? "TRUE" : "FALSE", // Publi Web
            vehiculo.publi_mark_p ? "TRUE" : "FALSE", // Publi Mark. P
            vehiculo.valor || vehiculo.precio || "", // Valor
            vehiculo.pendientes_preparacion || "", // Pendientes preparacion
            vehiculo.fecha_reserva ? new Date(vehiculo.fecha_reserva).toLocaleDateString("es-AR") : "", // FECHA DE RESERVA
            vehiculo.fecha_entrega ? new Date(vehiculo.fecha_entrega).toLocaleDateString("es-AR") : "", // FECHA DE ENTREGA
            vehiculo.condicion || "Usado", // Condicion
            vehiculo.vendedor || vehiculo.contacto_nombre || "" // Vendedor
        ]) // Limpiar la hoja existente y escribir nuevos datos
        const range = "Hoja1"

        // Primero, limpiar la hoja
        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: `${range}!A:Z`
        })

        // Luego, escribir headers y datos
        const values = [headers, ...rows]

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${range}!A1`,
            valueInputOption: "RAW",
            requestBody: {
                values
            }
        })

        // Formatear la hoja
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [
                    // Hacer la primera fila bold (headers)
                    {
                        repeatCell: {
                            range: {
                                sheetId: 0,
                                startRowIndex: 0,
                                endRowIndex: 1
                            },
                            cell: {
                                userEnteredFormat: {
                                    textFormat: {
                                        bold: true
                                    },
                                    backgroundColor: {
                                        red: 0.9,
                                        green: 0.9,
                                        blue: 0.9
                                    }
                                }
                            },
                            fields: "userEnteredFormat(textFormat,backgroundColor)"
                        }
                    },
                    // Auto-resize columns
                    {
                        autoResizeDimensions: {
                            dimensions: {
                                sheetId: 0,
                                dimension: "COLUMNS",
                                startIndex: 0,
                                endIndex: headers.length
                            }
                        }
                    }
                ]
            }
        })

        // Marcar todos los vehículos como sincronizados
        await supabase.from("vehiculos").update({ sincronizado_sheets: true }).eq("activo", true)

        console.log(`Sincronizados ${vehiculos.length} vehículos con Google Sheets`)

        res.status(200).json({
            message: `Sincronización completada. ${vehiculos.length} vehículos actualizados en Google Sheets.`,
            count: vehiculos.length
        })
    } catch (error) {
        console.error("Error sincronizando con Google Sheets:", error)
        res.status(500).json({
            error: "Error sincronizando con Google Sheets",
            details: error.message
        })
    }
}
