import { NextResponse } from 'next/server';
import PortfolioWork from '@/models/PortfolioWork';
import { connectToDatabase } from '@/libs/mongo';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req, { params }) {
  await connectToDatabase();
  const { id } = params;
  const formData = await req.formData();
  const title = formData.get('title');
  const description = formData.get('description');
  const category = formData.get('category');
  const doneAt = formData.get('doneAt');
  let imageUrl = null;
  const imageFile = formData.get('image');

  if (imageFile && typeof imageFile === 'object') {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'portfolio' }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }).end(buffer);
    });
    imageUrl = uploadResult.secure_url;
  }

  const update = {
    title,
    description,
    category,
    doneAt,
  };
  if (imageUrl) update.imageUrl = imageUrl;

  const work = await PortfolioWork.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json(work);
}

export async function DELETE(req, { params }) {
  await connectToDatabase();
  const { id } = params;
  await PortfolioWork.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
} 