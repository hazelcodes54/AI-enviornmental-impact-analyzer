import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-hero">
          <div className="hero-icon">🌍</div>
          <h1 className="hero-title">EcoAnalyzer</h1>
          <p className="hero-subtitle">
            Make Informed, Sustainable Choices
          </p>
          <p className="hero-description">
            Analyze the environmental impact of consumer products using AI-powered insights. 
            Get detailed scores on carbon footprint, water usage, energy consumption, and more.
          </p>
          
          <div className="hero-buttons">
            <Link to="/register" className="btn-hero-primary">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              Sign In
            </Link>
          </div>
        </div>

        <div className="features-section">
          <h2 className="features-title">Why Choose EcoAnalyzer?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Analysis</h3>
              <p>Advanced machine learning algorithms analyze product details to provide accurate environmental impact scores.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Comprehensive Metrics</h3>
              <p>Get detailed breakdowns of carbon footprint, water usage, energy consumption, recyclability, and sustainability.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Smart Recommendations</h3>
              <p>Receive actionable insights and suggestions for more environmentally friendly alternatives.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Track Your Impact</h3>
              <p>Monitor your product analysis history and track your journey toward sustainable living.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with industry-standard security. We respect your privacy.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Easy</h3>
              <p>Get instant results. Simply add your product details and receive comprehensive analysis in seconds.</p>
            </div>
          </div>
        </div>

        <div className="how-it-works">
          <h2 className="section-title">How It Works</h2>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create an Account</h3>
              <p>Sign up for free in seconds. No credit card required.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Add Products</h3>
              <p>Enter details about the products you want to analyze.</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Insights</h3>
              <p>Receive detailed environmental impact scores and recommendations.</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of users making more sustainable choices every day.</p>
          <Link to="/register" className="btn-cta">
            Start Analyzing Now
          </Link>
        </div>

        <footer className="landing-footer">
          <p>© 2025 EcoAnalyzer. Making the world greener, one product at a time.</p>
        </footer>
      </div>
    </div>
  );
}

export default Landing;
