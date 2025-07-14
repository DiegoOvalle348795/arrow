"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPortfolioWork() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Residential",
    doneAt: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("doneAt", formData.doneAt);
      if (image) {
        formDataToSend.append("image", image);
      }

      const response = await fetch("/api/portfolio", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        router.push("/portfolio");
      } else {
        const error = await response.json();
        alert("Error: " + error.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add Portfolio Work</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Soundproofing">Soundproofing</option>
              <option value="Insulation Removal">Insulation Removal</option>
              <option value="Blowing Insulation">Blowing Insulation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Completion Date</label>
            <input
              type="date"
              value={formData.doneAt}
              onChange={(e) => setFormData({ ...formData, doneAt: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Work"}
          </button>
        </form>
      </div>
    </div>
  );
} 