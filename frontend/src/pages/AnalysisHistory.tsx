import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analysisAPI } from '../services/api';

interface Analysis {
  _id: string;
  productId: {
    _id: string;
    name: string;
    category: string;
  };
  score: {
    overall: number;
  };
  createdAt: string;
}

function AnalysisHistory() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await analysisAPI.getHistory({ limit: 50 });
      setAnalyses(response.data.analyses);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#2ecc71';
    if (score >= 40) return '#f39c12';
    return '#e74c3c';
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
        <h1>Analysis History</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {analyses.length === 0 ? (
        <div className="empty-state">
          <h2>No analyses yet</h2>
          <p>Start analyzing products to see your history here</p>
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="history-list">
          {analyses.map((analysis) => (
            <Link 
              to={`/product/${analysis.productId._id}`}
              key={analysis._id}
              className="history-item"
            >
              <div className="history-info">
                <h3>{analysis.productId.name}</h3>
                <p className="history-category">{analysis.productId.category}</p>
                <p className="history-date">
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div 
                className="history-score"
                style={{ color: getScoreColor(analysis.score.overall) }}
              >
                <div className="score-value">{analysis.score.overall}</div>
                <div className="score-label">Score</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default AnalysisHistory;
