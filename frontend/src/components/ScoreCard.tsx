import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ScoreCardProps {
  score: {
    overall: number;
    carbonFootprint: number;
    waterUsage: number;
    energyConsumption: number;
    recyclability: number;
    sustainability: number;
  };
}

function ScoreCard({ score }: ScoreCardProps) {
  const getScoreColor = (value: number) => {
    if (value >= 70) return '#2ecc71';
    if (value >= 40) return '#f39c12';
    return '#e74c3c';
  };

  const getScoreLabel = (value: number) => {
    if (value >= 70) return 'Good';
    if (value >= 40) return 'Moderate';
    return 'Poor';
  };

  const metrics = [
    { key: 'carbonFootprint', label: 'Carbon Footprint', icon: '🏭' },
    { key: 'waterUsage', label: 'Water Usage', icon: '💧' },
    { key: 'energyConsumption', label: 'Energy Consumption', icon: '⚡' },
    { key: 'recyclability', label: 'Recyclability', icon: '♻️' },
    { key: 'sustainability', label: 'Sustainability', icon: '🌱' },
  ];

  // Prepare data for the chart
  const chartData = metrics.map((metric) => ({
    name: metric.label,
    score: score[metric.key as keyof typeof score],
    icon: metric.icon
  }));

  return (
    <div className="score-card">
      <div className="overall-score">
        <div 
          className="score-circle"
          style={{ borderColor: getScoreColor(score.overall) }}
        >
          <div className="score-number" style={{ color: getScoreColor(score.overall) }}>
            {score.overall}
          </div>
          <div className="score-max">/100</div>
        </div>
        <div className="score-info">
          <h3>Overall Environmental Score</h3>
          <p style={{ color: getScoreColor(score.overall) }}>
            {getScoreLabel(score.overall)}
          </p>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="chart-container">
        <h3>📊 Environmental Metrics Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="score" name="Score" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => {
          const value = score[metric.key as keyof typeof score];
          return (
            <div key={metric.key} className="metric-item">
              <div className="metric-icon">{metric.icon}</div>
              <div className="metric-info">
                <div className="metric-label">{metric.label}</div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill"
                    style={{ 
                      width: `${value}%`,
                      backgroundColor: getScoreColor(value)
                    }}
                  ></div>
                </div>
                <div className="metric-value" style={{ color: getScoreColor(value) }}>
                  {value}/100
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ScoreCard;
