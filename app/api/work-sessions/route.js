import { NextResponse } from 'next/server';
import WorkSession from '@/models/WorkSession';
import { connectToDatabase } from '@/libs/mongo';

function getToday() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function POST(req) {
  await connectToDatabase();
  const { action } = await req.json();
  const today = getToday();
  let sessionDoc = await WorkSession.findOne({ date: today });
  if (!sessionDoc) {
    sessionDoc = await WorkSession.create({ date: today, sessions: [] });
  }
  if (action === 'start') {
    // Solo inicia si no hay un tramo abierto
    const last = sessionDoc.sessions[sessionDoc.sessions.length - 1];
    if (!last || last.end) {
      sessionDoc.sessions.push({ start: new Date() });
      await sessionDoc.save();
      return NextResponse.json({ success: true, started: true });
    } else {
      return NextResponse.json({ error: 'Ya hay un turno abierto' }, { status: 400 });
    }
  } else if (action === 'end') {
    // Solo finaliza si hay un tramo abierto
    const last = sessionDoc.sessions[sessionDoc.sessions.length - 1];
    if (last && !last.end) {
      last.end = new Date();
      await sessionDoc.save();
      return NextResponse.json({ success: true, ended: true });
    } else {
      return NextResponse.json({ error: 'No hay turno abierto para finalizar' }, { status: 400 });
    }
  }
  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
}

export async function GET() {
  await connectToDatabase();
  const today = new Date();
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    last7.push(d.toISOString().slice(0, 10));
  }
  const sessions = await WorkSession.find({ date: { $in: last7 } });
  // Ordenar por fecha ascendente
  const sessionsMap = Object.fromEntries(sessions.map(s => [s.date, s]));
  const result = last7.map(date => ({
    date,
    sessions: sessionsMap[date]?.sessions || [],
  }));
  return NextResponse.json(result);
} 