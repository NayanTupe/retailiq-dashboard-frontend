import { useDashboard } from "../context/useDashboard";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { FiUsers, FiDollarSign, FiActivity, FiTrendingUp, FiGrid } from "react-icons/fi";
import KPICard from "../components/KPICard";

export default function Dashboard() {
  const { data, loading, error } = useDashboard();


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
          Loading RetailIQ Dashboard...
        </h3>
      </div>
    );
  }


  const { summary, revenue_by_city, membership_mix, age_distribution } = data;

  const moneyFormat = (val) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  const numberFormat = (val) => new Intl.NumberFormat("en-US").format(val);

  const kpis = [
    { title: "Total Customers", value: numberFormat(summary.total_customers), subtext: "Active across regions", icon: <FiUsers />, color: "var(--cyan)", glow: "var(--glow-cyan)" },
    { title: "Total Revenue", value: moneyFormat(summary.total_revenue), subtext: "Aggregated gross spend", icon: <FiDollarSign />, color: "var(--green)", glow: "var(--glow-green)" },
    { title: "Average Spend", value: moneyFormat(summary.average_spend), subtext: "Per customer checkout", icon: <FiActivity />, color: "var(--secondary)", glow: "var(--glow-secondary)" },
    { title: "Churn Rate", value: `${summary.churn_rate}%`, subtext: "Calculated risk percentage", icon: <FiTrendingUp />, color: "var(--rose)", glow: "var(--glow-rose)" }
  ];

  const MEMBERSHIP_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"];

  return (
    <div className="main-content">
      {error === "demo" && (
        <div style={{
          background: "linear-gradient(90deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.03) 100%)",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: "12px",
          padding: "10px 20px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "13px",
          color: "var(--amber)"
        }}>
          <span style={{ fontSize: "16px" }}>⚡</span>
          <span><strong>Demo Mode</strong> — Displaying sample analytics data. Live API backend is waking up.</span>
        </div>
      )}
      {/* 3D Glass Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hero-banner"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start" }}>
            <span className="badge badge-cyan" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FiGrid /> ML-Powered Analytics Platform
            </span>
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: 800, lineHeight: 1.1 }}>
            RetailIQ Executive Dashboard
          </h1>
          <p style={{ maxWidth: "800px", fontSize: "16px", color: "var(--text-secondary)" }}>
            Real-time business insights covering customer distribution, loyalty mix, revenue contribution, 
            and predictive retention risk metrics. Generated dynamically from machine learning customer modeling.
          </p>
          <div className="hero-tag-container">
            <span className="hero-tag">FastAPI API</span>
            <span className="hero-tag">Recharts Integration</span>
            <span className="hero-tag">3D Animations</span>
            <span className="hero-tag">Active Segment Tuning</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid-cols-4"
        style={{ marginTop: "24px" }}
      >
        {kpis.map((k, idx) => (
          <KPICard 
            key={idx}
            title={k.title}
            value={k.value}
            subtext={k.subtext}
            icon={k.icon}
            color={k.color}
            glow={k.glow}
          />
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid-cols-2">
        {/* Revenue by City Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <h3 style={{ fontSize: "18px", marginBottom: "20px", fontFamily: "var(--font-display)" }}>
            Revenue contribution by City
          </h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <BarChart data={revenue_by_city} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--secondary)" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="city" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: "10px" }}
                  labelStyle={{ color: "var(--text-primary)", fontWeight: 600 }}
                  itemStyle={{ color: "var(--cyan)" }}
                  formatter={(value) => [moneyFormat(value), "Revenue"]}
                />
                <Bar dataKey="revenue" fill="url(#barGlow)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Membership Mix Donut Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <h3 style={{ fontSize: "18px", marginBottom: "20px", fontFamily: "var(--font-display)" }}>
            Membership Mix
          </h3>
          <div style={{ width: "100%", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={membership_mix}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="customers"
                  nameKey="membership_type"
                >
                  {membership_mix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={MEMBERSHIP_COLORS[index % MEMBERSHIP_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: "10px" }}
                  formatter={(value) => [numberFormat(value), "Customers"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "50%", paddingLeft: "20px" }}>
              {membership_mix.map((m, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "10px" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: MEMBERSHIP_COLORS[idx % MEMBERSHIP_COLORS.length] }} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{m.membership_type}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{numberFormat(m.customers)} customers ({moneyFormat(m.revenue)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Age Distribution Area Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
        >
          <h3 style={{ fontSize: "18px", marginBottom: "20px", fontFamily: "var(--font-display)" }}>
            Customer Age Distribution
          </h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <AreaChart data={age_distribution} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="age_group" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: "10px" }}
                  formatter={(value) => [numberFormat(value), "Customers"]}
                />
                <Area type="monotone" dataKey="customers" stroke="var(--cyan)" strokeWidth={2} fillOpacity={1} fill="url(#areaGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Average Rating by Membership Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
        >
          <h3 style={{ fontSize: "18px", marginBottom: "20px", fontFamily: "var(--font-display)" }}>
            Average Satisfaction Rating by Membership
          </h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <BarChart data={membership_mix} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="ratingGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--green)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--green)" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="membership_type" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-glass)", borderRadius: "10px" }}
                  formatter={(value) => [`${value} / 5.0`, "Avg Rating"]}
                />
                <Bar dataKey="average_rating" fill="url(#ratingGlow)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
