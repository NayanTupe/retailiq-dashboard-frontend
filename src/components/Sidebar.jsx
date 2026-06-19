import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiGrid, FiPieChart, FiTrendingUp, FiTarget } from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FiGrid size={18} /> },
    { name: "Segments", path: "/segments", icon: <FiPieChart size={18} /> },
    { name: "Churn", path: "/churn", icon: <FiTrendingUp size={18} /> },
    { name: "Prediction", path: "/prediction", icon: <FiTarget size={18} /> }
  ];

  return (
    <div style={{
      width: "var(--sidebar-width)",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      background: "rgba(10, 17, 32, 0.7)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderRight: "1px solid var(--border-glass)",
      padding: "30px 20px",
      display: "flex",
      flexDirection: "column",
      zIndex: 100
    }}>
      {/* Brand Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "40px",
        padding: "0 8px"
      }}>
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 15px var(--glow-primary)",
          fontWeight: 900,
          color: "white",
          fontFamily: "var(--font-display)",
          fontSize: "18px"
        }}>
          R
        </div>
        <div>
          <h2 style={{
            fontSize: "20px",
            fontWeight: 800,
            fontFamily: "var(--font-display)",
            background: "linear-gradient(to right, #ffffff, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            RetailIQ
          </h2>
          <span style={{
            fontSize: "10px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 700
          }}>
            Intelligence Hub
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                position: "relative",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                cursor: "pointer",
                borderRadius: "14px",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                transition: "color 0.25s ease"
              }}
            >
              {/* Sliding glowing capsule background for active state */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)",
                    borderLeft: "3px solid var(--primary)",
                    borderRadius: "14px",
                    zIndex: -1
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <span style={{
                color: isActive ? "var(--primary)" : "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                transition: "color 0.25s ease"
              }}>
                {item.icon}
              </span>

              <span style={{ fontFamily: "var(--font-display)" }}>
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div style={{
        marginTop: "auto",
        padding: "16px 8px",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "4px"
      }}>
        <div style={{
          fontSize: "11px",
          color: "var(--text-muted)",
          fontWeight: 600
        }}>
          ML PLATFORM
        </div>
        <div style={{
          fontSize: "12px",
          color: "var(--text-secondary)",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <span style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--green)",
            boxShadow: "0 0 8px var(--green)",
            display: "inline-block"
          }} />
          v1.0.0 Connected
        </div>
      </div>
    </div>
  );
}