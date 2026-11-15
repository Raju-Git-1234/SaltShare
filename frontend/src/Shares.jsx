
import { useState } from 'react';
import './Shares.css';

function Shares() {
  const sharePrice = 20000;

  const shareholders = [
    { name: 'Founder', shares: 60, percentage: 60 },
    { name: 'Investor 1', shares: 20, percentage: 20 },
    { name: 'Investor 2', shares: 10, percentage: 10 },
    { name: 'Investor 3', shares: 10, percentage: 10 }
  ];

  const [formData, setFormData] = useState({
    buyer_name: '',
    email: '',
    phone: '',
    shares_requested: '1'
  });

  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quantity = Number(formData.shares_requested);
  const totalAmount = quantity * sharePrice;

  // Dark text and white background for visible input values
 const inputStyle = {
  color: '#17351f',
  backgroundColor: '#ffffff',
  WebkitTextFillColor: '#17351f',
  caretColor: '#17351f',
  opacity: 1
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // SUBMIT SHARE INTEREST REQUEST
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    if (
      !formData.buyer_name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setStatus('Please fill in all required fields.');
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      setStatus('Please enter a quantity between 1 and 100.');
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error('Backend API URL is not configured.');
      }

      const response = await fetch(
        `${apiUrl.replace(/\/$/, '')}/api/share-requests`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            buyer_name: formData.buyer_name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            shares_requested: quantity
          })
        }
      );

      // Safely handle empty or non-JSON responses
      const responseText = await response.text();

      let result = {};

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          throw new Error(
            'The server returned an invalid response. Please try again.'
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          result.message || `Request failed with status ${response.status}`
        );
      }

      if (!result.success) {
        throw new Error(
          result.message || 'Unable to save your interest request.'
        );
      }

      setStatus(
        `Success! Your request ID is ${result.requestId}. Your interest request has been saved.`
      );

      setFormData({
        buyer_name: '',
        email: '',
        phone: '',
        shares_requested: '1'
      });

    } catch (error) {
      console.error('Share request error:', error);

      setStatus(
        error.message || 'Backend connection failed. Please try again.'
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shares-page">

      {/* NAVIGATION */}
      <nav className="shares-navbar">
        <a href="/" className="shares-logo">
          Salt<span>Share</span>
        </a>

        <div className="shares-nav-links">
          <a href="/">Home</a>
          <a href="#buyers">Shareholders</a>
          <a href="#distribution">Distribution</a>
          <a href="#buy-shares">Buy Shares</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="shares-hero">
        <div className="hero-content">
          <span className="hero-label">
            SALT MANUFACTURING COMPANY
          </span>

          <h1>
            Welcome to <span>SaltShare</span>
          </h1>

          <p>
            Explore our company profile and example share structure.
            Submit an interest request to learn more.
          </p>

          <a href="#buy-shares" className="red-button">
            Explore Shares
          </a>
        </div>

        <div className="price-card">
          <span className="price-card-label">DEMO SHARE PRICE</span>
          <h2>₹20,000</h2>
          <p>Illustrative price per share</p>

          <div className="price-card-bottom">
            <span>100 example shares</span>
            <span className="demo-badge">DEMO</span>
          </div>
        </div>
      </header>

      <main>

        {/* SHAREHOLDERS */}
        <section className="buyers-section" id="buyers">
          <div className="section-heading">
            <span>EXAMPLE SHAREHOLDERS</span>
            <h2>Shareholder Overview</h2>
            <p>
              Illustrative ownership allocation, not verified ownership records.
            </p>
          </div>

          <div className="buyer-grid">
            {shareholders.map((person) => (
              <article className="buyer-card" key={person.name}>
                <div className="buyer-avatar">
                  {person.name.charAt(0)}
                </div>

                <div className="buyer-info">
                  <h3>{person.name}</h3>
                  <span>Example shareholder</span>
                </div>

                <div className="buyer-share-count">
                  <strong>{person.shares}</strong>
                  <span>Shares</span>
                </div>

                <div className="buyer-percent">
                  {person.percentage}%
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* COMPANY DETAILS */}
        <section className="market-section">
          <div className="section-heading">
            <span>COMPANY DETAILS</span>
            <h2>SaltShare Overview</h2>
          </div>

          <div className="market-grid">
            <div className="market-card">
              <span>Total Example Shares</span>
              <h3>100</h3>
              <p>Illustrative structure</p>
            </div>

            <div className="market-card">
              <span>Demo Price Per Share</span>
              <h3>₹20,000</h3>
              <p>Not an established market price</p>
            </div>

            <div className="market-card">
              <span>Illustrative Total Value</span>
              <h3>₹20,00,000</h3>
              <p>Calculation for demonstration only</p>
            </div>

            <div className="market-card">
              <span>Business</span>
              <h3>SaltShare</h3>
              <p>Salt manufacturing</p>
            </div>
          </div>
        </section>

        {/* SHARE DISTRIBUTION */}
        <section className="distribution-section" id="distribution">
          <div className="section-heading">
            <span>OWNERSHIP BREAKDOWN</span>
            <h2>Share Distribution</h2>
            <p>Example distribution of 100 shares.</p>
          </div>

          <div className="distribution-panel">
            <div className="distribution-total">
              <span>Total Example Shares</span>
              <h3>100</h3>
              <p>100% illustrative ownership</p>
            </div>

            <div className="distribution-bars">
              {shareholders.map((person, index) => (
                <div className="distribution-item" key={person.name}>
                  <div className="distribution-label">
                    <strong>{person.name}</strong>
                    <span>
                      {person.shares} shares · {person.percentage}%
                    </span>
                  </div>

                  <div className="distribution-track">
                    <div
                      className={`distribution-fill fill-${index}`}
                      style={{ width: `${person.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SHARE INTEREST FORM */}
        <section className="buy-shares-section" id="buy-shares">
          <div className="section-heading">
            <span>BUYER INTEREST FORM</span>
            <h2>Interested in SaltShare?</h2>
            <p>Submit your details to register your interest.</p>
          </div>

          <div className="buy-form-card">
            <div className="buy-form-intro">
              <h3>Share Interest Request</h3>
              <p>Enter your details below.</p>

              <div className="form-price">
                <span>Illustrative price per share</span>
                <strong>₹20,000</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="buy-shares-form">

              <label htmlFor="buyer_name">Full Name</label>
              <input
                id="buyer_name"
                name="buyer_name"
                type="text"
                placeholder="Enter your full name"
                value={formData.buyer_name}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <label htmlFor="shares_requested">
                Number of Shares
              </label>

              <input
                id="shares_requested"
                name="shares_requested"
                type="number"
                min="1"
                max="100"
                step="1"
                value={formData.shares_requested}
                onChange={handleChange}
                style={inputStyle}
                required
              />

              <div className="purchase-total">
                <span>Illustrative total amount</span>

                <strong>
                  ₹{Number.isFinite(totalAmount)
                    ? totalAmount.toLocaleString('en-IN')
                    : '0'}
                </strong>
              </div>

              <button
                type="submit"
                className="submit-share-btn"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Submitting...'
                  : 'Submit Interest Request'}
              </button>

              {status && (
                <p className="share-form-status" role="status">
                  {status}
                </p>
              )}

            </form>
          </div>

          <p className="demo-disclaimer">
            This is an interest-registration demonstration only.
            Submitting this form does not purchase, reserve or allot
            shares, and no payment is collected. The displayed price
            is illustrative.
          </p>
        </section>

        {/* CONTACT */}
        <section className="shares-contact" id="contact">
          <h2>Grow Together with SaltShare</h2>
          <p>Contact our team to learn more about our company.</p>
          <a href="/#contact" className="red-button">
            Contact Us
          </a>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="shares-footer">
        <a href="/" className="shares-logo">
          Salt<span>Share</span>
        </a>

        <p>Growing Together. Building Opportunities.</p>

        <small>
          © 2026 SaltShare. All Rights Reserved.
        </small>
      </footer>

    </div>
  );
}

export default Shares;