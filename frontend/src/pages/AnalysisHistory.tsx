import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

  // Prepare data for trend chart
  const trendData = analyses
    .slice()
    .reverse()
    .map((analysis, index) => ({
      index: index + 1,
      score: analysis.score.overall,
      product: analysis.productId.name.substring(0, 15) + '...',
      date: new Date(analysis.createdAt).toLocaleDateString()
    }));

  // Calculate average score
  const averageScore = analyses.length > 0 
    ? Math.round(analyses.reduce((sum, a) => sum + a.score.overall, 0) / analyses.length)
    : 0;

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
        <>
          {/* Statistics Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-value">{analyses.length}</div>
                <div className="stat-label">Total Analyses</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <div className="stat-value" style={{ color: getScoreColor(averageScore) }}>
                  {averageScore}
                </div>
                <div className="stat-label">Average Score</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <div className="stat-value" style={{ color: '#2ecc71' }}>
                  {analyses.filter(a => a.score.overall >= 70).length}
                </div>
                <div className="stat-label">Eco-Friendly Products</div>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          {analyses.length > 1 && (
            <div className="chart-container" style={{ marginBottom: '2rem' }}>
              <h3>📈 Environmental Score Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" label={{ value: 'Analysis #', position: 'insideBottom', offset: -5 }} />
                  <YAxis domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '8px'
                          }}>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>{data.product}</p>
                            <p style={{ margin: '5px 0 0 0', color: getScoreColor(data.score) }}>
                              Score: {data.score}
                            </p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                              {data.date}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#667eea" 
                    strokeWidth={3}
                    dot={{ fill: '#667eea', r: 5 }}
                    activeDot={{ r: 8 }}
                    name="Environmental Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

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
        </>
      )}
    </div>
  );
}

export default AnalysisHistory;
