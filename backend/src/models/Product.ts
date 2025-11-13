import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  manufacturer?: string;
  manufacturingLocation?: string;
  materials?: string[];
  supplyChainInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['electronics', 'clothing', 'food', 'furniture', 'transportation', 'other']
  },
  manufacturer: {
    type: String,
    trim: true
  },
  manufacturingLocation: {
    type: String,
    trim: true
  },
  materials: [{
    type: String,
    trim: true
  }],
  supplyChainInfo: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
productSchema.index({ userId: 1, createdAt: -1 });
productSchema.index({ category: 1 });

export default mongoose.model<IProduct>('Product', productSchema);
