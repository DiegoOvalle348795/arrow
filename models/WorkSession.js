import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date },
}, { _id: false });

const WorkSessionSchema = new mongoose.Schema({
  date: { type: String, required: true }, // formato YYYY-MM-DD
  sessions: [SessionSchema],
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // opcional para multiusuario
});

export default mongoose.models.WorkSession || mongoose.model('WorkSession', WorkSessionSchema); 