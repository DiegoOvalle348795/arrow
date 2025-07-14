import { NextResponse } from 'next/server';
import PortfolioWork from '@/models/PortfolioWork';
import connectMongo from '@/libs/mongoose';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  await connectMongo();
  const works = await PortfolioWork.find().sort({ doneAt: -1 });
  return NextResponse.json(works);
}

export async function POST(req) {
  await connectMongo();
  const formData = await req.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const category = formData.get('category');
  const doneAt = formData.get('doneAt');
  const imageFile = formData.get('image');

  if (!imageFile) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  // Subir imagen a Cloudinary
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: 'portfolio' }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    }).end(buffer);
  });

  const work = await PortfolioWork.create({
    title,
    description,
    category,
    imageUrl: uploadResult.secure_url,
    doneAt,
  });

  return NextResponse.json(work);
} 