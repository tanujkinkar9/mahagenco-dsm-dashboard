import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid, Building2, Radio, BarChart3, FileBarChart,
  AlertTriangle, Users, Settings, Zap
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutGrid },
  { name: "Plants", path: "/plants", icon: Building2 },
  { name: "Live Monitoring", path: "/live", icon: Radio },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Reports", path: "/reports", icon: FileBarChart },
  { name: "Alerts", path: "/alerts", icon: AlertTriangle },
  { name: "Users", path: "/users", icon: Users },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Segoe UI, Arial, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "260px", background: "#1e3a8a", color: "white", padding: "20px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 20px 24px 20px" }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "6px" }}>
            <Zap size={22} color="#1e3a8a" />
          </div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: "18px" }}>DSM System</div>
            <div style={{ fontSize: "12px", opacity: 0.7 }}>Power Grid Monitoring</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 20px",
                  margin: "2px 12px",
                  borderRadius: "8px",
                  color: "white",
                  textDecoration: "none",
                  background: active ? "rgba(255,255,255,0.15)" : "transparent",
                  fontWeight: active ? "600" : "400",
                }}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, background: "#f5f6fa" }}>
        <div style={{ background: "white", padding: "16px 32px", borderBottom: "1px solid #e5e7eb" }}>
          <strong style={{ color: "#1e3a8a" }}>MAHAGENCO DSM</strong>
        </div>
        <div style={{ padding: "32px" }}>{children}</div>
      </div>
    </div>
  );
}