import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Zap, Gauge, Activity, ArrowLeft, IndianRupee } from "lucide-react";

export default function PlantDetail() {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [readings, setReadings] = useState([]);
  const [deviation, setDeviation] = useState(null);

  const fetchData = async () => {
    try {
      const [plantsRes, readingsRes, deviationRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/plants"),
        fetch("http://127.0.0.1:8000/api/latest"),
        fetch(`http://127.0.0.1:8000/api/deviation/${id}`),
      ]);
      const plantsData = await plantsRes.json();
      const readingsData = await readingsRes.json();

      setPlant(plantsData.find((p) => p.id === parseInt(id)));
      setReadings(readingsData.filter((r) => r.plant_id === parseInt(id)));

      if (deviationRes.ok) {
        setDeviation(await deviationRes.json());
      }
    } catch (err) {
      console.error("Error fetching plant detail:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [id]);

  if (!plant) return <p>Loading plant details...</p>;

  const latest = readings[0];

  const statCards = [
    { label: "Latest Power", value: latest ? `${latest.power} MW` : "--", icon: Zap },
    { label: "Frequency", value: latest ? `${latest.frequency} Hz` : "--", icon: Gauge },
    { label: "Voltage", value: latest ? `${latest.voltage} V` : "--", icon: Activity },
  ];

  const statusColors = {
    Normal: { bg: "#dcfce7", text: "#16a34a" },
    Warning: { bg: "#fef3c7", text: "#d97706" },
    Critical: { bg: "#fee2e2", text: "#dc2626" },
  };

  return (
    <div>
      <Link to="/plants" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#1e3a8a", textDecoration: "none", marginBottom: "16px", fontSize: "14px" }}>
        <ArrowLeft size={16} /> Back to Plants
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
        <span style={{ background: "#dcfce7", color: "#16a34a", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
          ● LIVE
        </span>
        <span style={{ color: "#6b7280", fontSize: "13px" }}>ID: PLANT-{plant.id}</span>
      </div>
      <h1 style={{ fontSize: "32px", margin: "8px 0" }}>{plant.name}</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>{plant.location || "Location not set"}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#6b7280", fontSize: "14px" }}>{card.label}</span>
                <Icon size={20} color="#1e3a8a" />
              </div>
              <div style={{ fontSize: "26px", fontWeight: "bold", marginTop: "8px" }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* DSM Deviation & Penalty Section */}
      {deviation && (
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0 }}>DSM Deviation & Penalty</h3>
            <span
              style={{
                background: statusColors[deviation.status]?.bg || "#f3f4f6",
                color: statusColors[deviation.status]?.text || "#374151",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              {deviation.status}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            <div>
              <div style={{ color: "#6b7280", fontSize: "13px" }}>Scheduled</div>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>{deviation.scheduled_power} MW</div>
            </div>
            <div>
              <div style={{ color: "#6b7280", fontSize: "13px" }}>Actual</div>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>{deviation.actual_power} MW</div>
            </div>
            <div>
              <div style={{ color: "#6b7280", fontSize: "13px" }}>Deviation</div>
              <div style={{ fontSize: "20px", fontWeight: "bold", color: deviation.deviation_percent >= 0 ? "#16a34a" : "#dc2626" }}>
                {deviation.deviation_percent > 0 ? "+" : ""}{deviation.deviation_percent}%
              </div>
            </div>
            <div>
              <div style={{ color: "#6b7280", fontSize: "13px" }}>Penalty</div>
              <div style={{ fontSize: "20px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "2px" }}>
                <IndianRupee size={16} />{deviation.penalty_amount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb" }}>
        <h3 style={{ marginTop: 0 }}>Recent Readings</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280", fontSize: "13px", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "10px" }}>ID</th>
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