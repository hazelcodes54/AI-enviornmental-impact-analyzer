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
