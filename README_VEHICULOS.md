# 🧩 Módulo de Gestión de Vehículos

Este módulo permite visualizar y editar la planilla de vehículos desde la web, conectada a una hoja de Google Sheets.

## ⚙️ Configuración

1. **Hacer pública la hoja de cálculo:**
   - Abrí tu hoja en Google Sheets.
   - Clic en *Compartir* → *Cualquier persona con el enlace puede editar*.

2. **Copiar el ID de la hoja:**
   - El ID es la parte entre `/d/` y `/edit` en la URL.
   - Ejemplo: `https://docs.google.com/spreadsheets/d/1AbCdEfGh1234567/edit` → ID = `1AbCdEfGh1234567`

3. **Crear una API Key pública:**
   - Entrá en [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
   - Seleccioná *Crear credenciales → Clave de API*.
   - Copiá la clave y guardala.

4. **Configurar variables de entorno (.env.local o en Vercel):**
   ```bash
   GOOGLE_API_KEY=tu_api_key_aqui
   GOOGLE_SHEETS_ID=tu_sheet_id_aqui
   ```

5. **Estructura del módulo:**
   - `/pages/api/vehiculos.js` → Conecta con la API pública de Google Sheets.
   - `/pages/vehiculos/index.js` → Interfaz de gestión y visualización.

6. **Deploy en Vercel:**
   - Subí el proyecto.
   - En *Settings → Environment Variables*, agregá las dos variables anteriores.

## 🧠 Notas

- Actualmente, el módulo carga todos los registros de la hoja (`A1:Z1000`).
- La edición directa en la hoja se verá reflejada en la web al actualizar.
- En próximas versiones se añadirá escritura bidireccional (guardar desde la web).

---

Autor: **VOONDA Dev Team**

