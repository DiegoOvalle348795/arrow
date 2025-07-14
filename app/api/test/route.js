import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';

export async function GET() {
  try {
    await connectMongo();
    return NextResponse.json({ message: 'MongoDB connection successful' });
  } catch (error) {
    console.error('Error in test API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 