import { useEffect, useState } from "react";
import { Building2, CheckCircle2, Zap, Gauge, IndianRupee } from "lucide-react";

export default function Dashboard() {
  const [readings, setReadings] = useState([]);
  const [plants, setPlants] = useState([]);

  const fetchData = async () => {
    try {
      const [readingsRes, plantsRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/latest"),
        fetch("http://127.0.0.1:8000/api/plants"),
      ]);
      setReadings(await readingsRes.json());
      setPlants(await plantsRes.json());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const latest = readings[0];

  const statCards = [
    { label: "TOTAL PLANTS", value: plants.length, icon: Building2, color: "#1e3a8a" },
    { label: "ONLINE PLANTS", value: plants.length, icon: CheckCircle2, color: "#16a34a" },
    { label: "LATEST POWER (MW)", value: latest ? latest.power : "--", icon: Zap, color: "#1e3a8a" },
    { label: "GRID FREQ (HZ)", value: latest ? latest.frequency : "--", icon: Gauge, color: "#d97706" },
    { label: "LATEST VOLTAGE (V)", value: latest ? latest.voltage : "--", icon: IndianRupee, color: "#1e3a8a" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "4px" }}>Dashboard</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>Real-time grid performance and compliance metrics</p>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ background: "white", borderRadius: "12px", padding: "18px", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>{card.label}</span>
                <Icon size={20} color={card.color} />
              </div>
              <div style={{ fontSize: "26px", fontWeight: "bold", marginTop: "8px" }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Live table */}
      <div style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0 }}>Live Telemetry</h3>
          <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
            ● Live Data Active
          </span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280", fontSize: "13px", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "10px" }}>ID</th>
              <th style={{ padding: "10px" }}>Plant ID</th>
              <th style={{ padding: "10px" }}>Frequency (Hz)</th>
              <th style={{ padding: "10px" }}>Voltage (V)</th>
              <th style={{ padding: "10px" }}>Power (MW)</th>
              <th style={{ padding: "10px" }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "10px" }}>{r.id}</td>
                <td style={{ padding: "10px" }}>{r.plant_id}</td>
                <td style={{ padding: "10px" }}>{r.frequency}</td>
                <td style={{ padding: "10px" }}>{r.voltage}</td>
                <td style={{ padding: "10px" }}>{r.power}</td>
                <td style={{ padding: "10px" }}>{r.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}