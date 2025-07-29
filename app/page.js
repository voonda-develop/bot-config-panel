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

  // Obtener última configuración al cargar
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
      console.error("Error al obtener configuración:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo obtener la configuración inicial.",
      });
    } else if (data) {
      setConfig({
        bot_enabled: data.bot_enabled,
        start_time: data.start_time || "08:00",
        end_time: data.end_time || "20:00",
        prompt: data.prompt || "",
        ignore_schedule: !data.start_time && !data.end_time,
      });
    }
    setLoading(false);
  }

  // Guardar nueva configuración
  async function saveConfig() {
    if (!config.prompt.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El prompt no puede estar vacío",
      });
      return;
    }

    const payload = {
      bot_enabled: config.bot_enabled,
      start_time: config.ignore_schedule ? null : config.start_time,
      end_time: config.ignore_schedule ? null : config.end_time,
      prompt: config.prompt,
      created_by: "Lucas Martinez",         // Valor fijo en esta instancia
      agent_phone: "5491164229109",         // Valor fijo en esta instancia
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
      fetchConfig(); // Refresca la UI con la última configuración
    }
  }


  // Función para evaluar si el bot está activo
  function isBotActive() {
    if (!config.bot_enabled) return false;
    if (config.ignore_schedule) return true;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = config.start_time.split(":").map(Number);
    const [endHour, endMin] = config.end_time.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes <= endMinutes) {
      // Caso normal: dentro del mismo día
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      // Caso cruzando medianoche
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  }

  if (loading) return <div className="p-4">Cargando configuración...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <img src="/fratelli-logo.svg" alt="Logo" className="h-15" />
        <h1 className="text-2xl font-semibold ms-6">Configuración</h1>
      </div>

      {/* ALERT STATUS */}
      <div
        className={`p-3 rounded-lg border-2 font-normal text-center ${
          isBotActive()
            ? "border-green-500 bg-green-100 text-green-700"
            : "border-red-500 bg-red-100 text-red-700"
        }`}
      >
        {isBotActive()
          ? "El bot está ACTIVO en este momento"
          : "El bot está INACTIVO en este momento"}
      </div>

      {/* Toggle Bot */}
      <label className="flex items-start gap-3 cursor-pointer border-b pb-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={config.bot_enabled}
          onChange={(e) => setConfig({ ...config, bot_enabled: e.target.checked })}
          className="h-9 w-9 accent-blue-500 rounded focus:ring-2 focus:ring-blue-400"
        />

        {/* Título y descripción */}
        <div>
          <div className="font-medium text-gray-900">Bot habilitado</div>
          <p className="text-sm text-gray-500">
            Si desactivás esta opción, las respuestas deberán ser manuales ya que el
            agente de IA no intervendrá más en ninguna conversación.
          </p>
        </div>
      </label>

    {config.bot_enabled && (
      <div className=" border-b pb-4">
        {/* Ignorar horario */}
        <label className="flex items-start gap-3 cursor-pointer mb-3">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={config.ignore_schedule}
            onChange={(e) =>
              setConfig({ ...config, ignore_schedule: e.target.checked })
            }
            className="mt-1 h-9 w-9 accent-blue-500 rounded focus:ring-2 focus:ring-blue-400"
          />

          {/* Título y descripción */}
          <div>
            <div className="font-medium text-gray-900">Siempre activo</div>
            <p className="text-sm text-gray-500">
              Si desactivás esta opción, el bot solo funcionará dentro de la franja
              horaria definida en los campos de inicio y fin.
            </p>
          </div>
        </label>
        {!config.ignore_schedule && (
          <>
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
                    ? date[0].toLocaleTimeString("it-IT", {
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
          <label className="mb-4">
            <label className="block text-sm mb-1">Horario de fin</label>
            <Flatpickr
              value={config.end_time}
              options={{ enableTime: true, noCalendar: true, dateFormat: "H:i" }}
              onChange={(date) =>
                setConfig({
                  ...config,
                  end_time: date.length
                    ? date[0].toLocaleTimeString("it-IT", {
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
          </label>
        </>
        )}
      </div>
      )}

      {/* Prompt */}
      <div>
        <label className="block text-lg font-bold mb-1">Prompt principal</label>
        <textarea
          value={config.prompt}
          onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
          className="border p-2 rounded w-full"
          rows={6}
        />
      </div>

      {/* Botón guardar */}
      <button
        onClick={saveConfig}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Guardar configuración
      </button>
    </div>
  );
}