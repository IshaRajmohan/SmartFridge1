import mongoose from 'mongoose';

const FoodItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  barcode: String,
  category: String,
  imageUrl: String,
  expiryDate: Date,
  scannedAt: { type: Date, default: Date.now },
  quantity: { type: Number, default: 1 },
  metadata: Object
}, { timestamps: true });

export default mongoose.model('FoodItem', FoodItemSchema);
