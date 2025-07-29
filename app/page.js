"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

export default function ConfigPage() {
  const [config, setConfig] = useState({
    bot_enabled: true,
    start_time: "08:00",
    end_time: "20:00",
    prompt: "",
    ignore_schedule: false,
  });
  const [loading, setLoading] = useState(true);

  // Obtener última configuración
  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    const { data, error } = await supabase
      .from("agent_config")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error al obtener config:", error.message);
    } else if (data) {
      setConfig({
        bot_enabled: data.bot_enabled,
        start_time: data.start_time,
        end_time: data.end_time,
        prompt: data.prompt || "",
        ignore_schedule: !data.start_time && !data.end_time,
      });
    }
    setLoading(false);
  }

  async function saveConfig() {
    // Validación del prompt
    if (!config.prompt.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El prompt no puede estar vacío",
      });
      return;
    }

    // Preparar payload (si ignore_schedule, null en horarios)
    const payload = {
      bot_enabled: config.bot_enabled,
      start_time: config.ignore_schedule ? null : config.start_time,
      end_time: config.ignore_schedule ? null : config.end_time,
      prompt: config.prompt,
      agent_phone: '5491164229109', // Reemplazar con el número de teléfono del agente
      ignore_schedule: config.ignore_schedule,
      created_by: 'Lucas Martinez'
    };

    const { error } = await supabase.from("agent_config").insert([payload]);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Guardado",
        text: "Configuración actualizada correctamente",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchConfig();
    }
  }

  if (loading) return <div className="p-4">Cargando configuración...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      {/* Header con logo y título */}
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <img src="/fratelli-logo.svg" alt="Fratelli" className="h-10" />
        <h1 className="text-2xl font-semibold ms-15">Configuración</h1>
      </div>

      {/* Toggle Bot */}
      <label className="flex items-center gap-2 cursor-pointer border-b pb-6 mb-4">
        <input
          type="checkbox"
          checked={config.bot_enabled}
          onChange={(e) => setConfig({ ...config, bot_enabled: e.target.checked })}
          className="h-5 w-5 accent-blue-500 rounded focus:ring-2 focus:ring-blue-400"
        />
        <span className="fw-bold text-2xl">Bot habilitado</span>
      </label>

      {/* Opción ignorar horario */}
      <div className="mb-6 pb-6 border-b">
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={config.ignore_schedule}
            onChange={(e) => setConfig({ ...config, ignore_schedule: e.target.checked })}
            className="h-5 w-5 accent-blue-500 rounded focus:ring-2 focus:ring-blue-400"
          />
          <span>Ignorar horario (siempre activo)</span>
        </label>

        {/* Horario inicio */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Horario de inicio</label>
          <Flatpickr
            value={config.start_time}
            options={{ enableTime: true, noCalendar: true, dateFormat: "H:i" }}
            onChange={(date) =>
              setConfig({
                ...config,
                start_time: date.length
                  ? date[0].toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "",
              })
            }
            className={`border p-2 rounded w-full ${
              config.ignore_schedule ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
            disabled={config.ignore_schedule}
          />
        </div>

        {/* Horario fin */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Horario de fin</label>
          <Flatpickr
            value={config.end_time}
            options={{ enableTime: true, noCalendar: true, dateFormat: "H:i" }}
            onChange={(date) =>
              setConfig({
                ...config,
                end_time: date.length
                  ? date[0].toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "",
              })
            }
            className={`border p-2 rounded w-full ${
              config.ignore_schedule ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
            disabled={config.ignore_schedule}
          />
        </div>
      </div>

      {/* Prompt */}
      <div>
        <label className="block text-sm mb-1">Prompt principal</label>
        <textarea
          value={config.prompt}
          onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
          className="border p-2 rounded w-full"
          rows={6}
        />
      </div>

      {/* Botón Guardar */}
      <button
        onClick={saveConfig}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-100"
      >
        Guardar configuración
      </button>
    </div>
  );
}