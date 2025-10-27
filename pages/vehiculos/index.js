import { useState, useEffect } from 'react';

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vehiculos');
      const data = await res.json();
      setVehiculos(data);
    } catch (err) {
      console.error(err);
      setError('Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  if (loading) return <p>Cargando vehículos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Gestión de Vehículos</h1>
      <button onClick={fetchVehiculos}>Recargar</button>
      <table border="1" cellPadding="8" style={{ marginTop: '1rem', width: '100%' }}>
        <thead>
          <tr>
            {Object.keys(vehiculos[0] || {}).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v, i) => (
            <tr key={i}>
              {Object.values(v).map((val, j) => (
                <td key={j}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}