import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, analysisAPI } from '../services/api';
import ScoreCard from '../components/ScoreCard';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  manufacturer?: string;
  manufacturingLocation?: string;
  materials?: string[];
  supplyChainInfo?: string;
}

interface Analysis {
  _id: string;
  score: {
    overall: number;
    carbonFootprint: number;
    waterUsage: number;
    energyConsumption: number;
    recyclability: number;
    sustainability: number;
  };
  insights: string[];
  recommendations: string[];
}

function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id!);
      setProduct(response.data.product);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError('');

    try {
      const response = await analysisAPI.analyze(id!);
      setAnalysis(response.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze product');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="error-message">Product not found</div>;
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate('/dashboard')} className="btn-back">
        ← Back to Dashboard
      </button>

      <div className="product-details">
        <div className="product-header">
          <h1>{product.name}</h1>
          <span className="category-badge">{product.category}</span>
        </div>

        <div className="product-info">
          <div className="info-section">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.manufacturer && (
            <div className="info-section">
              <h3>Manufacturer</h3>
              <p>{product.manufacturer}</p>
            </div>
          )}

          {product.manufacturingLocation && (
            <div className="info-section">
              <h3>Manufacturing Location</h3>
              <p>{product.manufacturingLocation}</p>
            </div>
          )}

          {product.materials && product.materials.length > 0 && (
            <div className="info-section">
              <h3>Materials</h3>
              <div className="materials-list">
                {product.materials.map((material, index) => (
                  <span key={index} className="material-tag">{material}</span>
                ))}
              </div>
            </div>
          )}

          {product.supplyChainInfo && (
            <div className="info-section">
              <h3>Supply Chain Information</h3>
              <p>{product.supplyChainInfo}</p>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {!analysis ? (
          <div className="analyze-section">
            <h2>Environmental Impact Analysis</h2>
            <p>Click the button below to analyze the environmental impact of this product.</p>
            <button 
              onClick={handleAnalyze} 
              className="btn-primary btn-large"
              disabled={analyzing}
            >
              {analyzing ? 'Analyzing...' : '🌍 Analyze Environmental Impact'}
            </button>
          </div>
        ) : (
          <div className="analysis-results">
            <h2>Environmental Impact Analysis</h2>
            
            <ScoreCard score={analysis.score} />

            <div className="insights-section">
              <h3>📊 Key Insights</h3>
              <ul className="insights-list">
                {analysis.insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>

            <div className="recommendations-section">
              <h3>💡 Recommendations</h3>
              <ul className="recommendations-list">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
