import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTarget, FiUser, FiAlertTriangle, FiCheckCircle, FiChevronRight } from "react-icons/fi";
import { api } from "../api/client";

export default function Prediction() {
  const [form, setForm] = useState({
    age: 32,
    total_spend: 250,
    items_purchased: 4,
    average_rating: 3.5,
    gender: "Male",
    city: "New York",
    membership_type: "Gold"
  });

  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const predict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRes(null);

    const payload = {
      age: Number(form.age),
      total_spend: Number(form.total_spend),
      items_purchased: Number(form.items_purchased),
      average_rating: Number(form.average_rating)
    };

    try {
      // Simulate slight processing lag for cinematic animation load
      await new Promise(resolve => setTimeout(resolve, 750));
      const response = await api.post("/predict/churn", payload);
      setRes(response.data);
    } catch (err) {
      console.error(err);
      setError("Model prediction failed. Please ensure the FastAPI server is running.");
    } finally {
      setLoading(false);
    }
  };

  // SVGCircle gauge math
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const probability = res ? res.churn_probability : 0;
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  const getRiskDetails = (level) => {
    switch (level) {
      case "High Risk":
        return {
          color: "var(--rose)",
          badgeClass: "badge-rose",
          icon: <FiAlertTriangle size={24} color="var(--rose)" />,
          actions: [
            "Send 30% retention loyalty coupon immediately.",
            "Schedule a call from senior customer success representative.",
            "Add to daily watch-list for active customer care follow-up."
          ]
        };
      case "Medium Risk":
        return {
          color: "var(--amber)",
          badgeClass: "badge-amber",
          icon: <FiAlertTriangle size={24} color="var(--amber)" />,
          actions: [
            "Trigger automated email listing tailored product bundle deals.",
            "Send feedback survey to identify primary pain points.",
            "Provide 10% discount on next scheduled order."
          ]
        };
      default:
        return {
          color: "var(--green)",
          badgeClass: "badge-green",
          icon: <FiCheckCircle size={24} color="var(--green)" />,
          actions: [
            "Include in standard loyalty newsletters.",
            "Recommend high-tier membership upgrades.",
            "Offer early-bird previews of seasonal store releases."
          ]
        };
    }
  };

  const riskInfo = res ? getRiskDetails(res.risk_level) : null;

  return (
    <div className="main-content">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-banner"
        style={{ padding: "30px 40px", marginBottom: "24px" }}
      >
        <span className="badge badge-rose" style={{ display: "inline-flex", gap: "6px", alignItems: "center", marginBottom: "10px" }}>
          <FiTarget /> Predictive AI Engine
        </span>
        <h1 style={{ fontSize: "36px", fontWeight: 800 }}>Churn Risk Predictor</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>
          Input user demographics and spending records to compute real-time retention probability scores.
        </p>
      </motion.div>

      {/* Main Layout Grid */}
      <div className="grid-cols-2" style={{ alignItems: "start" }}>
        {/* Left Column: Form Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
        >
          <h3 style={{ fontSize: "19px", marginBottom: "20px", fontFamily: "var(--font-display)" }}>
            Customer Profile Parameters
          </h3>

          <form onSubmit={predict}>
            {/* Input Row: Age & Rating */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Customer Age: {form.age}</label>
                <input 
                  type="range" 
                  name="age" 
                  min="18" 
                  max="80"
                  value={form.age}
                  onChange={handleInputChange}
                  className="form-slider"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Avg Rating: {form.average_rating}</label>
                <input 
                  type="range" 
                  name="average_rating" 
                  min="1.0" 
                  max="5.0"
                  step="0.1"
                  value={form.average_rating}
                  onChange={handleInputChange}
                  className="form-slider"
                />
              </div>
            </div>

            {/* Input Row: Spend & Items */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Total Spend ($)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "14px", top: "14px", color: "var(--text-muted)", fontSize: "14px" }}>$</span>
                  <input 
                    type="number" 
                    name="total_spend" 
                    value={form.total_spend}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ paddingLeft: "28px" }}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Items Purchased</label>
                <input 
                  type="number" 
                  name="items_purchased" 
                  value={form.items_purchased}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Profile context fields (visual only, matches training parameters) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "4px" }}>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" value={form.gender} onChange={handleInputChange} className="form-input" style={{ appearance: "none" }}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <select name="city" value={form.city} onChange={handleInputChange} className="form-input" style={{ appearance: "none" }}>
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>Chicago</option>
                  <option>Houston</option>
                  <option>Miami</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Membership</label>
                <select name="membership_type" value={form.membership_type} onChange={handleInputChange} className="form-input" style={{ appearance: "none" }}>
                  <option>Bronze</option>
                  <option>Silver</option>
                  <option>Gold</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: "12px" }} disabled={loading}>
              {loading ? "Processing AI Scores..." : "Analyze Customer Churn Risk"}
            </button>
          </form>
        </motion.div>

        {/* Right Column: Prediction Result */}
        <div style={{ minHeight: "360px" }}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card" 
              style={{ borderLeft: "4px solid var(--rose)" }}
            >
              <h3 style={{ color: "var(--rose)", fontFamily: "var(--font-display)", marginBottom: "8px" }}>Connection Error</h3>
              <p>{error}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!res && !loading && !error && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card"
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  height: "360px",
                  border: "1px dashed var(--border-glass)",
                  background: "transparent"
                }}
              >
                <FiUser size={48} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
                <h4 style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)", fontWeight: 500 }}>Awaiting Customer Analysis</h4>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Click the analyze button to calculate prediction scores.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card"
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  height: "360px"
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                    boxShadow: "0 0 20px var(--glow-primary)",
                    marginBottom: "24px"
                  }}
                />
                <h4 style={{ fontFamily: "var(--font-display)" }}>Querying Machine Learning Model...</h4>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Calculating logistic gradients & weights</p>
              </motion.div>
            )}

            {res && !loading && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="glass-card"
                style={{ 
                  borderLeft: `4px solid ${riskInfo.color}`,
                  boxShadow: `0 15px 45px -10px rgba(0,0,0,0.5), 0 0 25px ${riskInfo.color}11`
                }}
              >
                {/* Score Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ fontSize: "19px", fontFamily: "var(--font-display)" }}>Risk Assessment</h3>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Calculated from ML parameters</span>
                  </div>
                  <span className={`badge ${riskInfo.badgeClass}`}>
                    {res.risk_level}
                  </span>
                </div>

                {/* Score Body */}
                <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                  {/* Circular Gauge */}
                  <div className="gauge-container">
                    <svg className="gauge-svg" width="180" height="180">
                      <circle className="gauge-bg" cx="90" cy="90" r={radius} />
                      <circle 
                        className="gauge-fill" 
                        cx="90" 
                        cy="90" 
                        r={radius} 
                        stroke={riskInfo.color}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ filter: `drop-shadow(0 0 6px ${riskInfo.color}55)` }}
                      />
                    </svg>
                    <div className="gauge-text">
                      <div className="gauge-value" style={{ color: riskInfo.color }}>{probability}%</div>
                      <div className="gauge-label">CHURN RISK</div>
                    </div>
                  </div>

                  {/* High level details */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      {riskInfo.icon}
                      <span style={{ fontSize: "15px", fontWeight: 700 }}>
                        Churn Prediction: {res.churn_prediction}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                      Risk profile scored as <b>{res.risk_level}</b> based on checkout history.
                    </p>
                  </div>
                </div>

                {/* Tactical Actions Checklist */}
                <div style={{ marginTop: "24px", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "18px" }}>
                  <h4 style={{ fontSize: "13px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", fontWeight: 700 }}>
                    Recommended Retention Campaign
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {riskInfo.actions.map((act, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                        <div style={{ marginTop: "2px", color: riskInfo.color }}>
                          <FiChevronRight size={14} />
                        </div>
                        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}