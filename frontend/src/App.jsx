
import { useState } from 'react';
import './App.css';
import Admin from './Admin';
import AdminLogin from './AdminLogin';
import Shares from './Shares';

function App() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PAGE ROUTING
  const currentPath = window.location.pathname;

  if (currentPath === '/admin-login') {
    return <AdminLogin />;
  }

  if (currentPath === '/admin') {
    return <Admin />;
  }

  if (currentPath === '/shares') {
    return <Shares />;
  }

  // INPUT HANDLING
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // INVESTOR ENQUIRY SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Submitting your enquiry...');

    try {
      const response = await fetch(
        '${import.meta.env.VITE_API_URL}/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      setStatus('Thank you! Your enquiry was submitted successfully.');

      setFormData({
        full_name: '',
        email: '',
        phone: '',
        message: ''
      });

    } catch (error) {
      console.error('Enquiry error:', error);
      setStatus(
        'Unable to submit your enquiry. Please check that the backend server is running.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">

      {/* NAVIGATION */}
      <header className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">🧂</span>
          <span>Salt<span>Share</span></span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#company">Company</a>
          <a href="#growth">Growth Plan</a>
          <a href="/shares" className="shares-nav-link">
            Shares
          </a>
          <a href="#investors">Investors</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">
          <a href="#enquiry" className="nav-btn">
            Investor Enquiry →
          </a>

          <a href="/admin-login" className="nav-btn">
            Admin Login →
          </a>
        </div>
      </header>

      <main>

        {/* HERO */}
        <section className="hero" id="home">
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <p className="eyebrow">
              SALT INDUSTRY · RAMANATHAPURAM
            </p>

            <h1>
              Small Investors.
              <span>Big Business Dreams.</span>
            </h1>

            <p className="hero-description">
              Building a stronger future through salt manufacturing,
              business growth and transparent investor relations.
            </p>

            <a href="#company" className="primary-btn">
              Explore Our Company →
            </a>

            <div className="hero-trust">
              <span>✓ Quality-focused production</span>
              <span>✓ Sustainable growth vision</span>
            </div>
          </div>

          <div className="hero-side-card">
            <span className="side-card-icon">🧂</span>
            <h3>Pure Salt.</h3>
            <h3>Strong Future.</h3>
            <p>Growing from Ramanathapuram</p>
          </div>
        </section>

        {/* COMPANY */}
        <section className="company section" id="company">
          <div className="company-text">
            <p className="section-label">WHO WE ARE</p>
            <h2>About Our Company</h2>
            <div className="title-line"></div>

            <p>
              We are a salt manufacturing business based in
              Ramanathapuram, Tamil Nadu, focused on quality production,
              business expansion and sustainable growth.
            </p>

            <p>
              Our vision is to strengthen our manufacturing capabilities
              and build long-term business relationships through
              transparency and responsible growth.
            </p>

            <a href="#growth" className="text-link">
              Discover our growth vision →
            </a>
          </div>

          <div className="company-image">
            <div className="image-caption">
              <span>OUR ROOTS</span>
              <h3>From Ramanathapuram to a stronger future</h3>
            </div>
          </div>
        </section>

        {/* GROWTH PLAN */}
        <section className="growth section" id="growth">
          <div className="section-heading">
            <p className="section-label">OUR FUTURE VISION</p>
            <h2>Our Growth Plan</h2>
            <p>
              Building the next stage of our business with clear priorities.
            </p>
          </div>

          <div className="growth-cards">
            <article className="growth-card">
              <div className="growth-icon">🏭</div>
              <h3>Modern Machinery</h3>
              <p>
                Improve production processes with modern equipment
                and efficient manufacturing methods.
              </p>
            </article>

            <article className="growth-card">
              <div className="growth-icon">📈</div>
              <h3>Business Expansion</h3>
              <p>
                Explore opportunities to expand manufacturing,
                distribution and business reach.
              </p>
            </article>

            <article className="growth-card">
              <div className="growth-icon">🤝</div>
              <h3>Investor Relations</h3>
              <p>
                Build trust through clear company information
                and transparent communication.
              </p>
            </article>
          </div>
        </section>

        {/* SHARES SECTION */}
        <section className="shares-home-section section" id="shares">
          <div className="shares-home-content">
            <p className="section-label">SALTSHARE SHARE INFORMATION</p>

            <h2>Explore Our Shares Page</h2>

            <div className="title-line"></div>

            <p>
              Visit our dedicated Shares Page to view illustrative
              share information and submit an interest request.
            </p>

            <a href="/shares" className="primary-btn">
              Explore Shares →
            </a>

            <p className="legal-note">
              The displayed share price and ownership figures are
              illustrative examples only. This page does not constitute
              an offer to sell securities or an actual share allotment.
            </p>
          </div>
        </section>

        {/* INVESTOR INFORMATION */}
        <section className="investors section" id="investors">
          <div className="investor-content">
            <p className="section-label">GROW TOGETHER</p>
            <h2>Investor Information</h2>
            <div className="title-line"></div>

            <p>
              Learn more about our company, business plans and
              future growth vision. We welcome enquiries from
              people interested in understanding our business.
            </p>

            <p className="legal-note">
              This website is for company information and enquiries
              only. It does not constitute an offer to sell securities
              or a solicitation to invest.
            </p>

            <a href="/shares" className="primary-btn">
              Explore Shares Page →
            </a>
          </div>

          <div className="investor-visual">
            <div className="coin coin-one">₹</div>
            <div className="coin coin-two">₹</div>
            <div className="coin coin-three">₹</div>
            <div className="growth-arrow">↗</div>
            <p>Growing with a vision</p>
          </div>
        </section>

        {/* CONTACT AND ENQUIRY */}
        <section className="contact-area" id="contact">
          <div className="contact-info">
            <p className="section-label">LET'S CONNECT</p>
            <h2>Connect With Us</h2>
            <div className="title-line"></div>

            <p className="contact-description">
              Interested in learning more about SaltShare?
              Send us your enquiry. Our team will be happy to hear from you.
            </p>

            <div className="contact-detail">
              <span>📍</span>
              <p>Ramanathapuram, Tamil Nadu, India</p>
            </div>

            <a href="#enquiry" className="contact-link">
              Send us a message →
            </a>
          </div>

          <div className="enquiry-card" id="enquiry">
            <p className="section-label">GET IN TOUCH</p>
            <h2>Investor Enquiry Form</h2>

            <p className="form-description">
              Submit your details to learn more about SaltShare.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9+\-\s()]{7,15}"
                title="Enter a valid phone number"
                required
              />

              <textarea
                name="message"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>

              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : '➤ Submit Enquiry'}
              </button>

              {status && (
                <p className="form-status" role="status">
                  {status}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <a href="#home" className="footer-brand">
          🧂 SaltShare
        </a>

        <p>
          © 2026 SaltShare – Ramanathapuram. All rights reserved.
        </p>

        <p className="footer-tagline">
          Small Investors. Big Business Dreams.
        </p>
      </footer>
    </div>
  );
}

export default App;
