const mongoose = require('mongoose');

const WorkSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  direccion: { type: String, required: true },
  tipoServicio: { type: String, required: true },
  fecha: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  precio: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'en curso', 'completado'], default: 'pendiente' },
  notas: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.models.Work || mongoose.model('Work', WorkSchema); 