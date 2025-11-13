import { Response } from 'express';
import Product from '../models/Product';
import Analysis from '../models/Analysis';
import { AuthRequest } from '../middleware/auth';
import { analyzeEnvironmentalImpact } from '../services/ai.service';

export const analyzeProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    // Find the product
    const product = await Product.findOne({ _id: productId, userId: req.userId });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Check if analysis already exists
    const existingAnalysis = await Analysis.findOne({ productId, userId: req.userId });

    if (existingAnalysis) {
      res.json({
        message: 'Analysis already exists for this product',
        analysis: existingAnalysis
      });
      return;
    }

    // Perform AI analysis
    const aiResult = await analyzeEnvironmentalImpact(product);

    // Create new analysis
    const analysis = new Analysis({
      userId: req.userId,
      productId,
      score: aiResult.score,
      insights: aiResult.insights,
      recommendations: aiResult.recommendations,
      rawAnalysis: aiResult.rawAnalysis
    });

    await analysis.save();

    res.status(201).json({
      message: 'Environmental analysis completed',
      analysis
    });
  } catch (error: any) {
    console.error('Analyze product error:', error);
    res.status(500).json({ error: error.message || 'Error analyzing product' });
  }
};

export const getAnalysis = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { analysisId } = req.params;

    const analysis = await Analysis.findOne({ _id: analysisId, userId: req.userId })
      .populate('productId');

    if (!analysis) {
      res.status(404).json({ error: 'Analysis not found' });
      return;
    }

    res.json({ analysis });
  } catch (error: any) {
    console.error('Get analysis error:', error);
    res.status(500).json({ error: error.message || 'Error fetching analysis' });
  }
};

export const getUserAnalyses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { limit = 20, skip = 0 } = req.query;

    const analyses = await Analysis.find({ userId: req.userId })
      .populate('productId')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Analysis.countDocuments({ userId: req.userId });

    res.json({
      analyses,
      total,
      limit: Number(limit),
      skip: Number(skip)
    });
  } catch (error: any) {
    console.error('Get user analyses error:', error);
    res.status(500).json({ error: error.message || 'Error fetching analyses' });
  }
};
