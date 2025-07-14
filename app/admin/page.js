"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function formatTime(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sumDaySessions(sessions) {
  let total = 0;
  sessions.forEach(s => {
    if (s.start && s.end) {
      total += (new Date(s.end) - new Date(s.start));
    }
  });
  return total / (1000 * 60 * 60); // horas
}

export default function AdminPage() {
  const router = useRouter();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editWork, setEditWork] = useState(null);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Residential");
  const [doneAt, setDoneAt] = useState("");
  const [message, setMessage] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // --- Horas laborales ---
  const [turnoLoading, setTurnoLoading] = useState(false);
  const [turnoMsg, setTurnoMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("isAdmin")) {
      router.push("/login");
    }
    fetchWorks();
    // eslint-disable-next-line
  }, []);

  async function fetchWorks() {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setWorks(Array.isArray(data) ? data : []);
    } catch {
      setWorks([]);
    }
    setLoading(false);
  }

  function openModal(work = null) {
    setEditWork(work);
    if (work) {
      setTitle(work.title);
      setDescription(work.description);
      setCategory(work.category);
      setDoneAt(work.doneAt ? work.doneAt.slice(0, 10) : "");
      setImage(work.imageUrl);
      setImageFile(null);
    } else {
      setTitle("");
      setDescription("");
      setCategory("Residential");
      setDoneAt("");
      setImage(null);
      setImageFile(null);
    }
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditWork(null);
    setTitle("");
    setDescription("");
    setCategory("Residential");
    setDoneAt("");
    setImage(null);
    setImageFile(null);
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("doneAt", doneAt);
    if (imageFile) formData.append("image", imageFile);
    try {
      let res;
      if (editWork) {
        res = await fetch(`/api/portfolio/${editWork._id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch("/api/portfolio", {
          method: "POST",
          body: formData,
        });
      }
      if (res.ok) {
        setMessage(editWork ? "Trabajo editado exitosamente." : "Trabajo subido exitosamente.");
        fetchWorks();
        closeModal();
      } else {
        setMessage("Error al guardar el trabajo.");
      }
    } catch (err) {
      setMessage("Error al guardar el trabajo.");
    }
    setFormLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este trabajo?")) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Trabajo eliminado.");
        fetchWorks();
      } else {
        setMessage("Error al eliminar el trabajo.");
      }
    } catch {
      setMessage("Error al eliminar el trabajo.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  async function handleStartTurn() {
    setTurnoLoading(true);
    setTurnoMsg("");
    try {
      const res = await fetch("/api/work-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" })
      });
      const data = await res.json();
      if (res.ok) {
        setTurnoMsg("Turno iniciado");
      } else {
        setTurnoMsg(data.error || "Error al iniciar turno");
      }
    } catch {
      setTurnoMsg("Error al iniciar turno");
    }
    setTurnoLoading(false);
    setTimeout(() => setTurnoMsg(""), 2000);
  }

  async function handleEndTurn() {
    setTurnoLoading(true);
    setTurnoMsg("");
    try {
      const res = await fetch("/api/work-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end" })
      });
      const data = await res.json();
      if (res.ok) {
        setTurnoMsg("Turno finalizado");
      } else {
        setTurnoMsg(data.error || "Error al finalizar turno");
      }
    } catch {
      setTurnoMsg("Error al finalizar turno");
    }
    setTurnoLoading(false);
    setTimeout(() => setTurnoMsg(""), 2000);
  }

  const [workModalOpen, setWorkModalOpen] = useState(false);
  const [workSummary, setWorkSummary] = useState([]);
  const [workSummaryLoading, setWorkSummaryLoading] = useState(false);
  const [workError, setWorkError] = useState("");

  async function openWorkModal() {
    setWorkModalOpen(true);
    setWorkSummaryLoading(true);
    setWorkError("");
    try {
      const res = await fetch("/api/work-sessions");
      const data = await res.json();
      setWorkSummary(Array.isArray(data) ? data : []);
    } catch {
      setWorkError("Error al cargar las horas");
      setWorkSummary([]);
    }
    setWorkSummaryLoading(false);
  }

  function closeWorkModal() {
    setWorkModalOpen(false);
    setWorkSummary([]);
    setWorkError("");
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-200 py-12">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img src="/logo-arrow-insulation.png" alt="Arrow Insulation Logo" className="w-20 h-20 object-contain bg-white rounded-full p-1" />
            <h2 className="ml-4 text-3xl font-bold text-orange-600">Panel de administración</h2>
          </div>
          <button onClick={handleLogout} className="bg-orange-100 text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-orange-200 transition-colors">Cerrar sesión</button>
        </div>
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button onClick={handleStartTurn} disabled={turnoLoading} className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors">Iniciar turno</button>
            <button onClick={handleEndTurn} disabled={turnoLoading} className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors">Finalizar turno</button>
            <button onClick={openWorkModal} className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors">Revisar horas</button>
          </div>
          {turnoMsg && <div className="text-green-700 font-semibold">{turnoMsg}</div>}
        </div>
        <div className="mb-8 text-right">
          <button onClick={() => openModal()} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl">Subir nuevo trabajo</button>
        </div>
        {message && <div className="mb-6 text-green-600 font-semibold text-center">{message}</div>}
        {loading ? (
          <div className="text-center text-orange-600 text-xl font-semibold py-20">Cargando trabajos...</div>
        ) : works.length === 0 ? (
          <div className="text-center text-orange-600 text-xl font-semibold py-20">No hay trabajos en el portfolio.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((work) => (
              <div key={work._id} className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-orange-100 relative">
                <div className="relative h-64 flex items-center justify-center bg-gradient-to-br from-orange-200 to-orange-300">
                  {work.imageUrl && (
                    <img src={work.imageUrl} alt={work.title} className="object-cover w-full h-full" />
                  )}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${work.category === "Residential" ? "bg-orange-500" : work.category === "Commercial" ? "bg-yellow-500" : "bg-red-500"} text-white`}>
                    {work.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-orange-600">{work.title}</h3>
                  <p className="text-orange-600 mb-4">{work.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-semibold">Finalizado: {work.doneAt ? new Date(work.doneAt).toLocaleDateString() : "-"}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => openModal(work)} className="bg-yellow-400 text-white px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-colors">Editar</button>
                    <button onClick={() => handleDelete(work._id)} className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors">Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal para crear/editar trabajo */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button onClick={closeModal} className="absolute top-3 right-3 text-orange-600 hover:text-orange-800 text-2xl font-bold">&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-orange-600 text-center">{editWork ? "Editar trabajo" : "Subir nuevo trabajo"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" required={!editWork} />
              {image && <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-2" />}
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Título del trabajo" className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500" />
              <textarea value={description} onChange={e => setDescription(e.target.value)} required placeholder="Descripción" rows={3} className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500" />
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500">
                <option>Residential</option>
                <option>Commercial</option>
                <option>Soundproofing</option>
              </select>
              <input type="date" value={doneAt} onChange={e => setDoneAt(e.target.value)} required placeholder="Fecha de finalización" className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500" />
              <button type="submit" disabled={formLoading} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all">
                {formLoading ? (editWork ? "Guardando..." : "Subiendo...") : (editWork ? "Guardar cambios" : "Subir trabajo")}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Modal de resumen de horas */}
      {workModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative animate-fade-in">
            <button onClick={closeWorkModal} className="absolute top-3 right-3 text-orange-600 hover:text-orange-800 text-2xl font-bold">&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-orange-600 text-center">Resumen de horas (últimos 7 días)</h3>
            {workSummaryLoading ? (
              <div className="text-center text-orange-600 font-semibold">Cargando...</div>
            ) : workError ? (
              <div className="text-center text-red-600 font-semibold">{workError}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border">
                  <thead>
                    <tr className="bg-orange-100">
                      <th className="px-4 py-2">Fecha</th>
                      <th className="px-4 py-2">Total horas</th>
                      <th className="px-4 py-2">Tramos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workSummary.map(day => (
                      <tr key={day.date} className="border-b">
                        <td className="px-4 py-2 font-semibold">{day.date}</td>
                        <td className="px-4 py-2">{sumDaySessions(day.sessions).toFixed(2)}</td>
                        <td className="px-4 py-2">
                          {day.sessions.length === 0 ? (
                            <span className="text-orange-400">-</span>
                          ) : (
                            <ul className="space-y-1">
                              {day.sessions.map((s, i) => (
                                <li key={i} className="text-sm">
                                  {formatTime(s.start)} - {formatTime(s.end)}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 