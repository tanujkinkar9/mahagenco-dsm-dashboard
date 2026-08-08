import { useEffect, useState } from "react";
import { AlertTriangle, AlertCircle } from "lucide-react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/alerts?limit=30")
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const styleFor = (status) =>
    status === "Critical"
      ? { border: "#fecaca", bg: "#fef2f2", icon: "#dc2626" }
      : { border: "#fde68a", bg: "#fffbeb", icon: "#d97706" };

  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "4px" }}>Alerts</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        DSM compliance warnings and critical deviations from historical data.
      </p>

      {loading && <p style={{ color: "#6b7280" }}>Loading alerts...</p>}
      {!loading && alerts.length === 0 && <p style={{ color: "#6b7280" }}>No alerts found.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {alerts.map((a, idx) => {
          const s = styleFor(a.status);
          const Icon = a.status === "Critical" ? AlertCircle : AlertTriangle;
          return (
            <div
              key={idx}
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: "10px",
                padding: "16px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <Icon size={20} color={s.icon} style={{ marginTop: "2px", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <strong style={{ fontSize: "14px" }}>{a.status}</strong>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>{a.date.split("T")[0]}</span>
                </div>
                <p style={{ margin: 0, fontSize: "14px", color: "#374151" }}>{a.message}</p>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6b7280" }}>
                  Penalty: ₹{a.penalty_amount.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}