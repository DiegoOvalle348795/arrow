import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
const Work = require('@/models/Work');

export async function GET() {
  await connectMongo();
  const trabajos = await Work.find().sort({ fecha: 1 });
  return NextResponse.json(trabajos);
}

export async function POST(req) {
  await connectMongo();
  const data = await req.json();
  // Forzar tipos correctos
  if (data.fecha) data.fecha = new Date(data.fecha);
  if (data.fechaFin) data.fechaFin = new Date(data.fechaFin);
  const trabajo = await Work.create(data);
  return NextResponse.json(trabajo);
} 