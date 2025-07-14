import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
const Work = require('@/models/Work');

export async function GET(req, { params }) {
  await connectMongo();
  const trabajo = await Work.findById(params.id);
  if (!trabajo) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(trabajo);
}

export async function PUT(req, { params }) {
  await connectMongo();
  const data = await req.json();
  // Forzar tipos correctos
  if (data.fecha) data.fecha = new Date(data.fecha);
  if (data.fechaFin) data.fechaFin = new Date(data.fechaFin);
  const trabajo = await Work.findByIdAndUpdate(params.id, data, { new: true });
  if (!trabajo) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(trabajo);
}

export async function DELETE(req, { params }) {
  await connectMongo();
  const trabajo = await Work.findByIdAndDelete(params.id);
  if (!trabajo) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json({ ok: true });
} 