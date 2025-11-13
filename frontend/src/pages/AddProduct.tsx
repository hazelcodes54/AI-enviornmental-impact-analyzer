import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'electronics',
    manufacturer: '',
    manufacturingLocation: '',
    materials: '',
    supplyChainInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const productData = {
        ...formData,
        materials: formData.materials ? formData.materials.split(',').map(m => m.trim()) : [],
      };
      
      const response = await productsAPI.create(productData);
      navigate(`/product/${response.data.product._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., iPhone 15 Pro"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the product in detail..."
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="food">Food</option>
            <option value="furniture">Furniture</option>
            <option value="transportation">Transportation</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="manufacturer">Manufacturer</label>
          <input
            type="text"
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            placeholder="e.g., Apple Inc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="manufacturingLocation">Manufacturing Location</label>
          <input
            type="text"
            id="manufacturingLocation"
            name="manufacturingLocation"
            value={formData.manufacturingLocation}
            onChange={handleChange}
            placeholder="e.g., Shenzhen, China"
          />
        </div>

        <div className="form-group">
          <label htmlFor="materials">Materials (comma-separated)</label>
          <input
            type="text"
            id="materials"
            name="materials"
            value={formData.materials}
            onChange={handleChange}
            placeholder="e.g., aluminum, glass, lithium, plastic"
          />
        </div>

        <div className="form-group">
          <label htmlFor="supplyChainInfo">Supply Chain Information</label>
          <textarea
            id="supplyChainInfo"
            name="supplyChainInfo"
            value={formData.supplyChainInfo}
            onChange={handleChange}
            placeholder="Provide any supply chain details you know..."
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')} 
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
