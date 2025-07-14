"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-200">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <img src="/logo-arrow-insulation.png" alt="Arrow Insulation Logo" className="w-24 h-24 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4 text-orange-600">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Usuario" className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Contraseña" className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500" />
          <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all">Iniciar sesión</button>
        </form>
        {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
      </div>
    </div>
  );
} 