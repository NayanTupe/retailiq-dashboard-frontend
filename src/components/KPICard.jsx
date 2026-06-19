import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function KPICard({ title, value, subtext, icon, color = "var(--primary)", glow = "var(--glow-primary)" }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Calculate rotation with max 12 degrees tilt
    const rX = -(mouseY / height) * 12;
    const rY = (mouseX / width) * 12;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 800
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
      className="glass-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background radial glow */}
      <div style={{
        position: "absolute",
        top: "-40px",
        right: "-40px",
        width: "110px",
        height: "110px",
        borderRadius: "50%",
        background: glow,
        filter: "blur(35px)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1 }}>
        <span style={{
          fontSize: "12px",
          color: "var(--text-secondary)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontFamily: "var(--font-display)"
        }}>
          {title}
        </span>
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "rgba(255, 255, 255, 0.03)",
          border: `1px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          boxShadow: `0 0 12px ${glow}`,
          fontSize: "18px"
        }}>
          {icon}
        </div>
      </div>

      <div style={{ zIndex: 1, marginTop: "4px" }}>
        <h2 style={{
          fontSize: "30px",
          fontWeight: 800,
          fontFamily: "var(--font-display)",
          lineHeight: 1,
          letterSpacing: "-0.03em"
        }}>
          {value}
        </h2>
        {subtext && (
          <p style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            marginTop: "6px",
            fontWeight: 500
          }}>
            {subtext}
          </p>
        )}
      </div>
    </motion.div>
  );
}
