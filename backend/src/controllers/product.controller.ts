import { Response } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, category, manufacturer, manufacturingLocation, materials, supplyChainInfo } = req.body;

    if (!name || !description || !category) {
      res.status(400).json({ error: 'Name, description, and category are required' });
      return;
    }

    const product = new Product({
      userId: req.userId,
      name,
      description,
      category,
      manufacturer,
      manufacturingLocation,
      materials,
      supplyChainInfo
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    res.status(500).json({ error: error.message || 'Error creating product' });
  }
};

export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, limit = 20, skip = 0 } = req.query;

    const query: any = { userId: req.userId };
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      limit: Number(limit),
      skip: Number(skip)
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({ error: error.message || 'Error fetching products' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, userId: req.userId });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ product });
  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({ error: error.message || 'Error fetching product' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    res.status(500).json({ error: error.message || 'Error updating product' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id, userId: req.userId });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: error.message || 'Error deleting product' });
  }
};
