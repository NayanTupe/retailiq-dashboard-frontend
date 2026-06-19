import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis
} from "recharts";
import { FiPieChart, FiActivity, FiStar, FiAlertCircle } from "react-icons/fi";
import { getDashboardDetails } from "../api/dashboard";

export default function Segments() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardDetails()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load details", err);
        setError("Could not load segment data. Please ensure backend is running.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        gap: "16px"
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "3px solid rgba(59,130,246,0.1)",
            borderTopColor: "var(--primary)"
          }}
        />
        <h3 style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)" }}>
          Loading Customer Segments...
        </h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px 0", maxWidth: "600px", margin: "0 auto" }}>
        <div className="glass-card" style={{ borderLeft: "4px solid var(--rose)" }}>
          <h2 style={{ color: "var(--rose)", fontFamily: "var(--font-display)" }}>Connection Failed</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const { segments } = data;

  const moneyFormat = (val) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  const numberFormat = (val) => new Intl.NumberFormat("en-US").format(val);

  if (!segments || segments.length === 0) {
    return (
      <div className="main-content" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div className="hero-banner">
          <h1 style={{ fontSize: "36px", fontWeight: 800 }}>Customer Segments</h1>
        </div>
        <div className="glass-card" style={{ borderLeft: "4px solid var(--amber)", display: "flex", gap: "16px", alignItems: "center" }}>
          <FiAlertCircle size={32} color="var(--amber)" />
          <div>
            <h3 style={{ color: "var(--amber)", fontFamily: "var(--font-display)", marginBottom: "4px" }}>No Segment Data Found</h3>
            <p>Please train the K-Means clustering model in Python to generate segments.</p>
          </div>
        </div>
      </div>
    );
  }

  // Format segment data for scatter plot: x=avg spend, y=churn rate, z=customers
  const scatterData = segments.map(s => ({
    name: s.segment_name,
    x: s.average_spend,
    y: s.churn_rate,
    z: s.customers
  }));

  const SEGMENT_COLORS = {
    "Churn Risk Customers": "var(--rose)",
    "High Value Customers": "var(--green)",
    "Satisfied Regular Customers": "var(--cyan)",
    "Low Engagement Customers": "var(--amber)"
  };

  const getSegmentColor = (name) => SEGMENT_COLORS[name] || "var(--primary)";

  const getSegmentTag = (name) => {
    if (name.includes("High Value")) return "badge-green";
    if (name.includes("Risk")) return "badge-rose";
    if (name.includes("Regular")) return "badge-cyan";
    return "badge-amber";
  };

  const getSegmentAdvice = (name) => {
    if (name.includes("High Value")) return "Protect revenue with loyalty schemes & dedicated support.";
    if (name.includes("Risk")) return "Initiate support calls, surveys, and recovery discounts immediately.";
    if (name.includes("Regular")) return "Promote membership upgrades and custom bundle packages.";
    return "Target with engagement newsletters and personalized coupons.";
  };

  return (
    <div className="main-content">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-banner"
        style={{ padding: "30px 40px", marginBottom: "24px" }}
      >
        <span className="badge badge-cyan" style={{ display: "inline-flex", gap: "6px", alignItems: "center", marginBottom: "10px" }}>
          <FiPieChart /> Customer Segmentation
        </span>
        <h1 style={{ fontSize: "36px", fontWeight: 800 }}>Clustering Insights</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>
          K-Means clustering divides your users into distinct customer types to deliver targeted brand messages.
        </p>
      </motion.div>

      {/* Grid of Segmentation Charts */}
      <div className="grid-cols-2">
        {/* Scatter Plot: Spend vs Churn Risk Matrix */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
        >
          <h3 style={{ fontSize: "17px", marginBottom: "16px", fontFamily: "var(--font-display)" }}>
            Segment Spend vs Churn Risk Matrix
          </h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: -10 }}>
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Average Spend" 
                  unit="$" 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Churn Risk" 
                  unit="%" 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                />
                <ZAxis type="number" dataKey="z" range={[60, 450]} name="Customers" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: "10px" }}
                  formatter={(value, name) => [name === "Average Spend" ? moneyFormat(value) : name === "Churn Risk" ? `${value}%` : numberFormat(value), name]}
                />
                {scatterData.map((item, idx) => (
                  <Scatter 
                    key={idx} 
                    name={item.name} 
                    data={[item]} 
                    fill={getSegmentColor(item.name)} 
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px", justifyContent: "center" }}>
            {segments.map((s, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: getSegmentColor(s.segment_name) }} />
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{s.segment_name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart: Revenue Contribution by Segment */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
        >
          <h3 style={{ fontSize: "17px", marginBottom: "16px", fontFamily: "var(--font-display)" }}>
            Revenue Contribution by Segment
          </h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <BarChart data={segments} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="segmentRevenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--secondary)" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="segment_name" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: "10px" }}
                  formatter={(value) => [moneyFormat(value), "Revenue"]}
                />
                <Bar dataKey="total_revenue" fill="url(#segmentRevenueGlow)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Cluster Detail Cards */}
      <h3 style={{ fontSize: "19px", marginTop: "30px", marginBottom: "16px", fontFamily: "var(--font-display)" }}>
        Detailed Cluster Analytics
      </h3>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid-cols-2"
        style={{ marginTop: "16px" }}
      >
        {segments.map((s, idx) => (
          <div 
            key={idx} 
            className="glass-card" 
            style={{ 
              borderLeft: `4px solid ${getSegmentColor(s.segment_name)}`,
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h4 style={{ fontSize: "18px", fontWeight: 700 }}>
                {s.segment_name}
              </h4>
              <span className={`badge ${getSegmentTag(s.segment_name)}`}>
                {numberFormat(s.customers)} Customers
              </span>
            </div>

            {/* Metrics Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "12px" }}>
              <div>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>Avg Spend</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{moneyFormat(s.average_spend)}</span>
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>Avg Rating</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--cyan)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <FiStar style={{ fill: "currentColor" }} /> {s.average_rating}
                </span>
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>Churn Rate</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--rose)" }}>{s.churn_rate}%</span>
              </div>
            </div>

            {/* Advice Panel */}
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "4px" }}>
              <div style={{ marginTop: "3px", color: getSegmentColor(s.segment_name) }}>
                <FiActivity size={16} />
              </div>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", display: "block", textTransform: "uppercase" }}>Strategic Guideline</span>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>{getSegmentAdvice(s.segment_name)}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}