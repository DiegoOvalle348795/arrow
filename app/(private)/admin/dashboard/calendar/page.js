"use client";
import { useEffect, useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

function rangoIncluyeFinde(startDate, endDate) {
  let d = new Date(startDate);
  let findes = [];
  while (d <= endDate) {
    if (d.getDay() === 0 || d.getDay() === 6) {
      findes.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return findes;
}

const locales = {
  "es": es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarPage() {
  const [trabajos, setTrabajos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTrabajo, setEditTrabajo] = useState(null);
  const [form, setForm] = useState({
    cliente: "",
    direccion: "",
    tipoServicio: "",
    fecha: "",
    fechaFin: "",
    precio: "",
    estado: "pendiente",
    notas: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formMsg, setFormMsg] = useState("");
  const [showWeekendModal, setShowWeekendModal] = useState(false);
  const [weekendDays, setWeekendDays] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchTrabajos();
  }, []);

  function fetchTrabajos() {
    setFormLoading(true);
    fetch("/api/work")
      .then(res => res.json())
      .then(data => {
        setTrabajos(data);
        setFormLoading(false);
      });
  }

  function openModal(trabajo = null) {
    setEditTrabajo(trabajo);
    if (trabajo) {
      setForm({
        cliente: trabajo.cliente,
        direccion: trabajo.direccion,
        tipoServicio: trabajo.tipoServicio,
        fecha: trabajo.fecha ? trabajo.fecha.slice(0, 16) : "",
        fechaFin: trabajo.fechaFin ? trabajo.fechaFin.slice(0, 16) : "",
        precio: trabajo.precio,
        estado: trabajo.estado,
        notas: trabajo.notas || ""
      });
    } else {
      setForm({
        cliente: "",
        direccion: "",
        tipoServicio: "",
        fecha: "",
        fechaFin: "",
        precio: "",
        estado: "pendiente",
        notas: ""
      });
    }
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTrabajo(null);
    setFormMsg("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormLoading(true);
    setFormMsg("");
    const start = new Date(form.fecha);
    const end = new Date(form.fechaFin);
    const findes = rangoIncluyeFinde(start, end);
    if (findes.length > 0 && !showWeekendModal) {
      setWeekendDays(findes);
      setShowWeekendModal(true);
      setFormLoading(false);
      return;
    }
    try {
      const body = { ...form, fecha: new Date(form.fecha), fechaFin: new Date(form.fechaFin) };
      const res = await fetch(editTrabajo ? `/api/work/${editTrabajo._id}` : "/api/work", {
        method: editTrabajo ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setFormMsg(editTrabajo ? "Trabajo actualizado" : "Trabajo creado");
        fetchTrabajos();
        closeModal();
      } else {
        setFormMsg("Error al guardar el trabajo");
      }
    } catch {
      setFormMsg("Error al guardar el trabajo");
    }
    setFormLoading(false);
    setTimeout(() => setFormMsg(""), 2000);
  }

  async function cambiarEstado(trabajo, nuevoEstado) {
    await fetch(`/api/work/${trabajo._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...trabajo, estado: nuevoEstado })
    });
    fetchTrabajos();
  }

  // Eventos para el calendario
  const events = useMemo(() => {
    // Filtrar trabajos con fechas válidas
    const validTrabajos = trabajos.filter(t => {
      if (!t.fecha || !t.fechaFin) return false;
      const start = new Date(t.fecha);
      const end = new Date(t.fechaFin);
      return start instanceof Date && !isNaN(start) && end instanceof Date && !isNaN(end) && start <= end;
    });
    const mapped = validTrabajos.map(trabajo => {
      let start = trabajo.fecha instanceof Date ? trabajo.fecha : new Date(trabajo.fecha);
      let end = trabajo.fechaFin instanceof Date ? trabajo.fechaFin : new Date(trabajo.fechaFin);
      let endPlus;
      // Si es un solo día, no sumar; si es varios días, sumar uno para que se muestre completo
      if (
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth() &&
        start.getDate() === end.getDate()
      ) {
        endPlus = new Date(end);
      } else {
        endPlus = new Date(end);
        endPlus.setDate(endPlus.getDate() + 1);
      }
      return {
        id: trabajo._id,
        title: trabajo.cliente + " - " + trabajo.tipoServicio,
        start,
        end: endPlus,
        resource: trabajo,
      };
    });
    console.log("Eventos para el calendario:", mapped);
    return mapped;
  }, [trabajos]);

  // Trabajos pendientes o en curso
  const pendientes = trabajos.filter(t => t.estado === "pendiente" || t.estado === "en curso").sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Calendario */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-orange-600">Calendario de Trabajos</h2>
          <button onClick={() => openModal()} className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors">+ Nuevo trabajo</button>
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          date={currentDate}
          onNavigate={date => setCurrentDate(date)}
          onSelectEvent={event => openModal(event.resource)}
          eventPropGetter={(event) => {
            let bg = "";
            if (event.resource.estado === "pendiente") bg = "#fb923c"; // naranja
            else if (event.resource.estado === "en curso") bg = "#3b82f6"; // azul
            else if (event.resource.estado === "completado") bg = "#22c55e"; // verde
            return {
              style: {
                backgroundColor: bg,
                color: "white",
                borderRadius: "8px",
                border: "none"
              }
            };
          }}
          messages={{
            next: "Sig.",
            previous: "Ant.",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            date: "Fecha",
            time: "Hora",
            event: "Trabajo"
          }}
        />
      </div>
      {/* Panel lateral de pendientes */}
      <div className="w-full md:w-80 bg-orange-100 rounded-xl shadow-lg p-4 h-[660px] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-orange-700">Trabajos pendientes</h2>
        {pendientes.length === 0 && <div className="text-orange-500">No hay trabajos pendientes</div>}
        <ul className="space-y-4">
          {pendientes.map(t => (
            <li key={t._id} className="bg-white rounded-lg p-3 shadow border-l-4 border-orange-400">
              <div className="font-semibold text-orange-700">{t.cliente}</div>
              <div className="text-sm text-orange-600">{t.tipoServicio}</div>
              <div className="text-xs text-orange-500">{format(new Date(t.fecha), 'dd/MM/yyyy HH:mm')}</div>
              <div className="text-xs text-orange-400">{t.direccion}</div>
              <div className="flex gap-2 mt-2">
                {t.estado === "pendiente" && (
                  <button onClick={() => cambiarEstado(t, "en curso")} className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-blue-600 transition-colors">En curso</button>
                )}
                {(t.estado === "pendiente" || t.estado === "en curso") && (
                  <button onClick={() => cambiarEstado(t, "completado")} className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-600 transition-colors">Completado</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Modal para crear/editar trabajo */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button onClick={closeModal} className="absolute top-3 right-3 text-orange-600 hover:text-orange-800 text-2xl font-bold">&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-orange-600 text-center">{editTrabajo ? "Editar trabajo" : "Nuevo trabajo"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })} required placeholder="Cliente" className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500" />
              <input type="text" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} required placeholder="Dirección" className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500" />
              <input type="text" value={form.tipoServicio} onChange={e => setForm({ ...form, tipoServicio: e.target.value })} required placeholder="Tipo de servicio" className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500" />
              <input type="datetime-local" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} required placeholder="Fecha de inicio" className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500" />
              <input type="datetime-local" value={form.fechaFin} onChange={e => setForm({ ...form, fechaFin: e.target.value })} required placeholder="Fecha de finalización" className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500" />
              <input type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} required placeholder="Precio" className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500" />
              <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500">
                <option value="pendiente">Pendiente</option>
                <option value="en curso">En curso</option>
                <option value="completado">Completado</option>
              </select>
              <textarea value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} placeholder="Notas" rows={2} className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500" />
              <button type="submit" disabled={formLoading} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all">
                {formLoading ? (editTrabajo ? "Guardando..." : "Creando...") : (editTrabajo ? "Guardar cambios" : "Crear trabajo")}
              </button>
              {formMsg && <div className="text-center text-orange-600 font-semibold mt-2">{formMsg}</div>}
            </form>
          </div>
        </div>
      )}
      {/* Modal de confirmación de fines de semana */}
      {showWeekendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <h3 className="text-xl font-bold mb-4 text-orange-600 text-center">El trabajo abarca fin de semana</h3>
            <div className="mb-4 text-orange-700 text-center">
              Los siguientes días caen en sábado o domingo:<br />
              {weekendDays.map(d => (
                <span key={d.toISOString()} className="block">{format(d, 'EEEE dd/MM/yyyy', { locale: es })}</span>
              ))}
              <br />¿Quieres trabajar esos días?
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={() => { setShowWeekendModal(false); handleSubmit({ preventDefault: () => {} }); }} className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors">Sí</button>
              <button onClick={() => { setShowWeekendModal(false); }} className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors">No, elige otras fechas</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 