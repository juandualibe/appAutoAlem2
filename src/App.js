import React, { useState } from 'react';
import './App.css';

function App() {
  const [vehiculos, setVehiculos] = useState([
    { id: 1, marca: 'Ford', modelo: 'Fiesta', anio: 2019, color: 'Azul', estado: 'Usado', propietario: 'Otros', ubicacion: 'Taller', estadoProceso: 'En taller', vendido: false, precio: 12000 },
    { id: 2, marca: 'Toyota', modelo: 'Corolla', anio: 2020, color: 'Rojo', estado: 'Usado', propietario: 'Agencia', ubicacion: 'Agencia', estadoProceso: 'Listo para entrega', vendido: false, precio: 18000 },
    { id: 3, marca: 'VW', modelo: 'Gol', anio: 2023, color: 'Blanco', estado: 'Nuevo', propietario: 'Agencia', ubicacion: 'Agencia', estadoProceso: 'Listo para entrega', vendido: false, precio: 25000 },
    { id: 4, marca: 'Renault', modelo: 'Clio', anio: 2020, color: 'Negro', estado: 'Usado', propietario: 'Otros', ubicacion: 'Chapista', estadoProceso: 'En chapista', vendido: false, precio: 10000 },
  ]);

  const [revisiones, setRevisiones] = useState([
    { id_revision: 1, id_vehiculo: 1, tipo: 'Service completo', fecha_ingreso: '2025-02-01T10:00:00', fecha_salida: '2025-02-03T14:00:00', ubicacion: 'Taller', costo: 500 },
    { id_revision: 2, id_vehiculo: 4, tipo: 'Reparación de chapa', fecha_ingreso: '2025-02-02T09:00:00', fecha_salida: null, ubicacion: 'Chapista', costo: 300 },
  ]);

  const [turnos, setTurnos] = useState([
    { id_turno: 1, id_vehiculo: 4, tipo: 'Service básico', fecha: '2025-02-07T10:00:00', ubicacion: 'Taller' },
  ]);

  const [seccion, setSeccion] = useState('Inicio');
  const [notificacion, setNotificacion] = useState('');
  const [nuevoTurno, setNuevoTurno] = useState({ id_vehiculo: '', tipo: '', fecha: '', ubicacion: '' });
  const [menuAbierto, setMenuAbierto] = useState(false); // Nuevo estado para el menú

  const moverVehiculo = (id, nuevaUbicacion) => {
    setVehiculos(vehiculos.map(v => {
      if (v.id === id) {
        const mensaje = `${v.marca} ${v.modelo} pasó de ${v.ubicacion} a ${nuevaUbicacion}`;
        setNotificacion(mensaje);
        setTimeout(() => setNotificacion(''), 3000);
        return { ...v, ubicacion: nuevaUbicacion, estadoProceso: nuevaUbicacion === 'Agencia' ? 'Listo para entrega' : `En ${nuevaUbicacion.toLowerCase()}` };
      }
      return v;
    }));
  };

  const marcarVendido = (id) => {
    setVehiculos(vehiculos.map(v => {
      if (v.id === id) {
        setNotificacion(`¡${v.marca} ${v.modelo} vendido por $${v.precio}!`);
        setTimeout(() => setNotificacion(''), 3000);
        return { ...v, vendido: true };
      }
      return v;
    }));
  };

  const agregarVehiculo = (nuevo) => {
    setVehiculos([...vehiculos, { ...nuevo, id: vehiculos.length + 1, vendido: false }]);
    setNotificacion(`Vehículo ${nuevo.marca} ${nuevo.modelo} agregado`);
    setTimeout(() => setNotificacion(''), 3000);
  };

  const programarTurno = (e) => {
    e.preventDefault();
    const nuevo = {
      id_turno: turnos.length + 1,
      id_vehiculo: parseInt(nuevoTurno.id_vehiculo),
      tipo: nuevoTurno.tipo,
      fecha: nuevoTurno.fecha,
      ubicacion: nuevoTurno.ubicacion,
    };
    setTurnos([...turnos, nuevo]);
    setNotificacion(`Turno programado para ${vehiculos.find(v => v.id === nuevo.id_vehiculo)?.marca} ${vehiculos.find(v => v.id === nuevo.id_vehiculo)?.modelo}: ${nuevo.tipo}`);
    setTimeout(() => setNotificacion(''), 3000);
    setNuevoTurno({ id_vehiculo: '', tipo: '', fecha: '', ubicacion: '' });
  };

  const finalizarRevision = (id_revision) => {
    setRevisiones(revisiones.map(r => {
      if (r.id_revision === id_revision && !r.fecha_salida) {
        setNotificacion(`Revisión ${r.tipo} finalizada`);
        setTimeout(() => setNotificacion(''), 3000);
        return { ...r, fecha_salida: new Date().toISOString() };
      }
      return r;
    }));
  };

  const cancelarTurno = (id_turno) => {
    setTurnos(turnos.filter(t => t.id_turno !== id_turno));
    setNotificacion(`Turno ${id_turno} cancelado`);
    setTimeout(() => setNotificacion(''), 3000);
  };

  const renderInicio = () => {
    const total = vehiculos.filter(v => !v.vendido).length;
    const nuevos = vehiculos.filter(v => !v.vendido && v.estado === 'Nuevo').length;
    const usados = vehiculos.filter(v => !v.vendido && v.estado === 'Usado').length;
    const enAgencia = vehiculos.filter(v => !v.vendido && v.ubicacion === 'Agencia').length;
    const enTaller = vehiculos.filter(v => !v.vendido && v.ubicacion === 'Taller').length;
    const enChapista = vehiculos.filter(v => !v.vendido && v.ubicacion === 'Chapista').length;

    return (
      <div className="seccion">
        <h2>Gestiones AutoAlem</h2>
        <div className="stats">
          <h3>Vehículos en Stock</h3>
          <p>Total: {total} | Nuevos: {nuevos} | Usados: {usados}</p>
          <p>📍 En agencia: {enAgencia} | 🔧 En taller: {enTaller} | 🎨 En chapista: {enChapista}</p>
        </div>
        <div className="entregas">
          <h3>📅 Próximas Entregas</h3>
          <table>
            <thead><tr><th>Fecha</th><th>Hora</th><th>Vehículo</th><th>Estado</th></tr></thead>
            <tbody>
              {vehiculos.filter(v => v.estadoProceso === 'Listo para entrega').map(v => (
                <tr key={v.id}>
                  <td>05/02</td>
                  <td>15:00</td>
                  <td>{v.marca} {v.modelo} {v.anio}</td>
                  <td>{v.estadoProceso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="alertas">
          <h3>🔔 Alertas Activas</h3>
          <ul>
            <li>⚠️ Ford Fiesta 2019 debe entregarse el 02/02 a las 12:00</li>
            <li>🔧 Toyota Corolla 2020 pasó de Taller → Agencia</li>
            <li>⏳ Renault Clio 2020 tiene mantenimiento el 07/02</li>
          </ul>
          <button>Ver todas las alertas</button>
        </div>
        <div className="accesos">
          <h3>🚀 Accesos Rápidos</h3>
          <button onClick={() => setSeccion('Vehiculos')}>Gestionar Vehículos</button>
          <button onClick={() => setSeccion('Mantenimiento')}>Ver Mantenimiento</button>
          <button onClick={() => setSeccion('Inicio')}>Ver Alertas</button>
        </div>
      </div>
    );
  };

  const renderVehiculos = () => (
    <div className="seccion">
      <h2>Vehículos</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const nuevo = {
          marca: e.target.marca.value,
          modelo: e.target.modelo.value,
          anio: parseInt(e.target.anio.value),
          color: e.target.color.value,
          estado: e.target.estado.value,
          propietario: e.target.propietario.value,
          ubicacion: e.target.ubicacion.value,
          estadoProceso: e.target.ubicacion.value === 'Agencia' ? 'Listo para entrega' : `En ${e.target.ubicacion.value.toLowerCase()}`,
          precio: parseFloat(e.target.precio.value),
        };
        agregarVehiculo(nuevo);
        e.target.reset();
      }}>
        <input name="marca" placeholder="Marca" required />
        <input name="modelo" placeholder="Modelo" required />
        <input name="anio" type="number" placeholder="Año" required />
        <input name="color" placeholder="Color" required />
        <select name="estado" required>
          <option value="Nuevo">Nuevo</option>
          <option value="Usado">Usado</option>
        </select>
        <select name="propietario" required>
          <option value="Agencia">Agencia</option>
          <option value="Otros">Otros</option>
        </select>
        <select name="ubicacion" required>
          <option value="Agencia">Agencia</option>
          <option value="Taller">Taller</option>
          <option value="Chapista">Chapista</option>
        </select>
        <input name="precio" type="number" placeholder="Precio" required />
        <button type="submit">Agregar Vehículo</button>
      </form>
      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Color</th><th>Estado</th><th>Propietario</th><th>Ubicación</th><th>Estado Proceso</th><th>Precio</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.filter(v => !v.vendido).map(v => (
              <tr key={v.id}>
                <td>{v.id}</td><td>{v.marca}</td><td>{v.modelo}</td><td>{v.anio}</td><td>{v.color}</td><td>{v.estado}</td><td>{v.propietario}</td><td>{v.ubicacion}</td><td>{v.estadoProceso}</td><td>${v.precio}</td>
                <td>
                  <button onClick={() => moverVehiculo(v.id, 'Agencia')}>A Agencia</button>
                  <button onClick={() => moverVehiculo(v.id, 'Taller')}>A Taller</button>
                  <button onClick={() => moverVehiculo(v.id, 'Chapista')}>A Chapista</button>
                  <button onClick={() => marcarVendido(v.id)}>Vendido</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHistorial = () => (
    <div className="seccion">
      <h2>Historial Vendidos</h2>
      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Color</th><th>Estado</th><th>Propietario</th><th>Precio</th><th>Fecha Venta</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.filter(v => v.vendido).map(v => (
              <tr key={v.id}>
                <td>{v.id}</td><td>{v.marca}</td><td>{v.modelo}</td><td>{v.anio}</td><td>{v.color}</td><td>{v.estado}</td><td>{v.propietario}</td><td>${v.precio}</td><td>{new Date().toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMantenimiento = () => (
    <div className="seccion">
      <h2>Mantenimiento</h2>
      <p>Consulta y gestiona el mantenimiento de los vehículos.</p>
      <h3>Programar Nuevo Turno</h3>
      <form onSubmit={programarTurno} className="form-turno">
        <select value={nuevoTurno.id_vehiculo} onChange={(e) => setNuevoTurno({ ...nuevoTurno, id_vehiculo: e.target.value })} required>
          <option value="">Seleccionar Vehículo</option>
          {vehiculos.filter(v => !v.vendido).map(v => (
            <option key={v.id} value={v.id}>{v.marca} {v.modelo} ({v.anio})</option>
          ))}
        </select>
        <input type="text" value={nuevoTurno.tipo} onChange={(e) => setNuevoTurno({ ...nuevoTurno, tipo: e.target.value })} placeholder="Tipo de reparación" required />
        <input type="datetime-local" value={nuevoTurno.fecha} onChange={(e) => setNuevoTurno({ ...nuevoTurno, fecha: e.target.value })} required />
        <select value={nuevoTurno.ubicacion} onChange={(e) => setNuevoTurno({ ...nuevoTurno, ubicacion: e.target.value })} required>
          <option value="">Seleccionar Ubicación</option>
          <option value="Taller">Taller</option>
          <option value="Chapista">Chapista</option>
        </select>
        <button type="submit">Programar</button>
      </form>
      <h3>Revisiones</h3>
      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Vehículo</th><th>Tipo</th><th>Fecha Ingreso</th><th>Fecha Salida</th><th>Ubicación</th><th>Costo</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {revisiones.map(r => {
              const v = vehiculos.find(v => v.id === r.id_vehiculo);
              return (
                <tr key={r.id_revision}>
                  <td>{r.id_revision}</td>
                  <td>{v ? `${v.marca} ${v.modelo}` : 'N/A'}</td>
                  <td>{r.tipo}</td>
                  <td>{new Date(r.fecha_ingreso).toLocaleString()}</td>
                  <td>{r.fecha_salida ? new Date(r.fecha_salida).toLocaleString() : 'Pendiente'}</td>
                  <td>{r.ubicacion}</td>
                  <td>${r.costo}</td>
                  <td>{!r.fecha_salida && <button onClick={() => finalizarRevision(r.id_revision)}>Finalizar</button>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h3>Turnos</h3>
      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Vehículo</th><th>Tipo</th><th>Fecha</th><th>Ubicación</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map(t => {
              const v = vehiculos.find(v => v.id === t.id_vehiculo);
              return (
                <tr key={t.id_turno}>
                  <td>{t.id_turno}</td>
                  <td>{v ? `${v.marca} ${v.modelo}` : 'N/A'}</td>
                  <td>{t.tipo}</td>
                  <td>{new Date(t.fecha).toLocaleString()}</td>
                  <td>{t.ubicacion}</td>
                  <td><button onClick={() => cancelarTurno(t.id_turno)}>Cancelar</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="App">
      <div className="sidebar">
        <div className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
          ☰
        </div>
        <div className={`menu ${menuAbierto ? 'abierto' : ''}`}>
          <h1>AutoAlem</h1>
          <button onClick={() => { setSeccion('Inicio'); setMenuAbierto(false); }}>Inicio</button>
          <button onClick={() => { setSeccion('Vehiculos'); setMenuAbierto(false); }}>Vehículos</button>
          <button onClick={() => { setSeccion('Historial'); setMenuAbierto(false); }}>Historial Vendidos</button>
          <button onClick={() => { setSeccion('Mantenimiento'); setMenuAbierto(false); }}>Mantenimiento</button>
        </div>
      </div>
      <div className="contenido">
        {notificacion && <div className="notificacion">{notificacion}</div>}
        {seccion === 'Inicio' && renderInicio()}
        {seccion === 'Vehiculos' && renderVehiculos()}
        {seccion === 'Historial' && renderHistorial()}
        {seccion === 'Mantenimiento' && renderMantenimiento()}
      </div>
    </div>
  );
}

export default App;
