import mongoose from 'mongoose';

const PortfolioWorkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  doneAt: { type: Date, required: true },
});

export default mongoose.models.PortfolioWork || mongoose.model('PortfolioWork', PortfolioWorkSchema); 