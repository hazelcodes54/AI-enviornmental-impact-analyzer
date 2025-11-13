import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  manufacturer?: string;
  createdAt: string;
}

function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 50 });
      setProducts(response.data.products);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      electronics: '#3498db',
      clothing: '#e74c3c',
      food: '#2ecc71',
      furniture: '#f39c12',
      transportation: '#9b59b6',
      other: '#95a5a6'
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>
            Manage and analyze your products
          </p>
        </div>
        <Link to="/add-product" className="btn-primary">
          + Add New Product
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products yet</h2>
          <p>Start by adding your first product to analyze its environmental impact</p>
          <Link to="/add-product" className="btn-primary">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <Link 
              to={`/product/${product._id}`} 
              key={product._id} 
              className="product-card"
            >
              <div 
                className="product-category-badge"
                style={{ backgroundColor: getCategoryColor(product.category) }}
              >
                {product.category}
              </div>
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              {product.manufacturer && (
                <p className="product-manufacturer">By {product.manufacturer}</p>
              )}
              <p className="product-date">
                Added {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
