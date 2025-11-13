import mongoose, { Document, Schema } from 'mongoose';

export interface IEnvironmentalScore {
  overall: number; // 0-100
  carbonFootprint: number; // 0-100
  waterUsage: number; // 0-100
  energyConsumption: number; // 0-100
  recyclability: number; // 0-100
  sustainability: number; // 0-100
}

export interface IAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  score: IEnvironmentalScore;
  insights: string[];
  recommendations: string[];
  rawAnalysis: string;
  createdAt: Date;
}

const environmentalScoreSchema = new Schema<IEnvironmentalScore>({
  overall: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  carbonFootprint: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  waterUsage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  energyConsumption: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  recyclability: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  sustainability: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, { _id: false });

const analysisSchema = new Schema<IAnalysis>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  score: {
    type: environmentalScoreSchema,
    required: true
  },
  insights: [{
    type: String
  }],
  recommendations: [{
    type: String
  }],
  rawAnalysis: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ productId: 1 });

export default mongoose.model<IAnalysis>('Analysis', analysisSchema);
