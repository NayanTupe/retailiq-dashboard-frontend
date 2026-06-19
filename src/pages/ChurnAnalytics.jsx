import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from "recharts";
import { FiAlertTriangle, FiShield } from "react-icons/fi";
import { getDashboardDetails } from "../api/dashboard";

export default function ChurnAnalytics() {
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
        setError("Could not load churn analytics. Please ensure backend is running.");
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
          Loading Churn Analytics...
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

  const { summary, revenue_by_city, membership_mix, churn_distribution, rating_quality } = data;

  const numberFormat = (val) => new Intl.NumberFormat("en-US").format(val);

  // Recharts formatted overall churn data
  const pieChurnData = [
    { name: "No Churn", value: churn_distribution.no_churn },
    { name: "Churn Risk", value: churn_distribution.churn_risk }
  ];

  const CHURN_COLORS = ["#10b981", "#f43f5e"];

  // Sort city by churn rate for chart readability
  const sortedCityChurn = [...revenue_by_city].sort((a, b) => b.churn_rate - a.churn_rate);

  // Business Action Plan Data
  const actionPlans = [
    { priority: "1", group: "At Risk Customers", action: "Retention offer, feedback call, service recovery", goal: "Reduce churn", badge: "badge-rose" },
    { priority: "2", group: "Low Engagement Customers", action: "Re-engagement campaign and product recommendations", goal: "Increase repeat purchase", badge: "badge-amber" },
    { priority: "3", group: "Satisfied Regular Customers", action: "Membership upgrade and bundled offers", goal: "Increase customer lifetime value", badge: "badge-cyan" },
    { priority: "4", group: "High Value Customers", action: "Loyalty rewards and premium communication", goal: "Protect revenue", badge: "badge-green" }
  ];

  return (
    <div className="main-content">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-banner"
        style={{ padding: "30px 40px", marginBottom: "24px" }}
      >
        <span className="badge badge-rose" style={{ display: "inline-flex", gap: "6px", alignItems: "center", marginBottom: "10px" }}>
          <FiAlertTriangle /> Risk Management
        </span>
        <h1 style={{ fontSize: "36px", fontWeight: 800 }}>Churn Intelligence</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>
          Diagnose, target, and mitigate customer churn risk using machine learning risk classification.
        </p>
      </motion.div>

      {/* KPI Highlight */}
      <div className="grid-cols-4" style={{ marginBottom: "24px" }}>
        <div className="glass-card" style={{ borderLeft: "4px solid var(--rose)" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Average Churn Risk</span>
          <h2 style={{ fontSize: "28px", color: "var(--rose)", margin: "4px 0" }}>{summary.churn_rate}%</h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Total portfolio exposure</p>
        </div>
        <div className="glass-card" style={{ borderLeft: "4px solid var(--green)" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Healthy Portfolio</span>
          <h2 style={{ fontSize: "28px", color: "var(--green)", margin: "4px 0" }}>{(100 - summary.churn_rate).toFixed(2)}%</h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Safe retention rate</p>
        </div>
        <div className="glass-card" style={{ borderLeft: "4px solid var(--cyan)" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>Avg Customer Rating</span>
          <h2 style={{ fontSize: "28px", color: "var(--cyan)", margin: "4px 0" }}>{summary.average_rating} / 5</h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Brand satisfaction level</p>
        </div>
        <div className="glass-card" style={{ borderLeft: "4px solid var(--secondary)" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>At-Risk Accounts</span>
          <h2 style={{ fontSize: "28px", color: "var(--secondary)", margin: "4px 0" }}>{numberFormat(churn_distribution.churn_risk)}</h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Active mitigation needed</p>
        </div>
      </div>

      {/* Grid for core Churn Charts */}
      <div className="grid-cols-2">
        {/* Overall Churn Mix */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
        >
          <h3 style={{ fontSize: "17px", marginBottom: "16px", fontFamily: "var(--font-display)" }}>
            Overall Churn Risk Distribution
          </h3>
          <div style={{ width: "100%", height: "260px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={pieChurnData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieChurnData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHURN_COLORS[index % CHURN_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "50%", paddingLeft: "10px" }}>
              {pieChurnData.map((c, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: CHURN_COLORS[idx] }} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>{c.name}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{numberFormat(c.value)} customers ({((c.value / summary.total_customers) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Churn Rate by Membership */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
        >
          <h3 style={{ fontSize: "17px", marginBottom: "16px", fontFamily: "var(--font-display)" }}>
            Churn Rate by Membership Type
          </h3>
          <div style={{ width: "100%", height: "260px" }}>
            <ResponsiveContainer>
              <BarChart data={membership_mix} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="churnMembershipGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--rose)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="var(--rose)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="membership_type" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: "10px" }}
                  formatter={(value) => [`${value}%`, "Churn Rate"]}
                />
                <Bar dataKey="churn_rate" fill="url(#churnMembershipGlow)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Churn Rate by City */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <h3 style={{ fontSize: "17px", marginBottom: "16px", fontFamily: "var(--font-display)" }}>
            Churn Risk by Location (City)
          </h3>
          <div style={{ width: "100%", height: "260px" }}>
            <ResponsiveContainer>
              <BarChart data={sortedCityChurn} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="churnCityGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--secondary)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="var(--secondary)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="city" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: "10px" }}
                  formatter={(value) => [`${value}%`, "Churn Rate"]}
                />
                <Bar dataKey="churn_rate" fill="url(#churnCityGlow)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Churn Rate by Rating Quality */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
        >
          <h3 style={{ fontSize: "17px", marginBottom: "16px", fontFamily: "var(--font-display)" }}>
            Churn Rate by Customer Rating Behavior
          </h3>
          <div style={{ width: "100%", height: "260px" }}>
            <ResponsiveContainer>
              <BarChart data={rating_quality} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="churnRatingGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--amber)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="var(--amber)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="rating_group" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: "10px" }}
                  formatter={(value) => [`${value}%`, "Churn Rate"]}
                />
                <Bar dataKey="churn_rate" fill="url(#churnRatingGlow)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Business Action Plan Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card" 
        style={{ marginTop: "24px" }}
      >
        <h3 style={{ fontSize: "19px", marginBottom: "10px", fontFamily: "var(--font-display)", display: "flex", alignItems: "center", gap: "8px" }}>
          <FiShield color="var(--primary)" /> Owner-Level Business Actions
        </h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "14px" }}>
          Tactical campaigns mapped to specific customer hazard tiers to maximize lifetime value and retain revenue.
        </p>

        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Target Customer Group</th>
                <th>Recommended Action</th>
                <th>Strategic Objective</th>
              </tr>
            </thead>
            <tbody>
              {actionPlans.map((plan, idx) => (
                <tr key={idx}>
                  <td>
                    <span className={`badge ${plan.badge}`}>
                      P{plan.priority}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{plan.group}</td>
                  <td>{plan.action}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{plan.goal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}