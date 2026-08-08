import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Zap, Gauge, Activity } from "lucide-react";

export default function LiveMonitoring() {
  const [readings, setReadings] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/latest");
      const data = await res.json();
      setReadings(data.slice().reverse()); // oldest to newest for chart
    } catch (err) {
      console.error("Error fetching live data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const latest = readings[readings.length - 1];

  const chartData = readings.map((r) => ({
    time: r.timestamp.split("T")[1]?.slice(0, 8) || r.timestamp,
    frequency: r.frequency,
    voltage: r.voltage,
    power: r.power,
  }));

  const statCards = [
    { label: "Frequency", value: latest ? `${latest.frequency} Hz` : "--", icon: Gauge, color: "#d97706" },
    { label: "Voltage", value: latest ? `${latest.voltage} V` : "--", icon: Activity, color: "#1e3a8a" },
    { label: "Power", value: latest ? `${latest.power} MW` : "--", icon: Zap, color: "#16a34a" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <h1 style={{ fontSize: "28px", margin: 0 }}>Live Monitoring</h1>
        <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: "600" }}>
          ● Live Data Active
        </span>
      </div>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>Real-time sensor telemetry, updating every 2 seconds.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#6b7280", fontSize: "14px" }}>{card.label}</span>
                <Icon size={20} color={card.color} />
              </div>
              <div style={{ fontSize: "26px", fontWeight: "bold", marginTop: "8px" }}>{card.value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
        <h3 style={{ marginTop: 0 }}>Power Output (MW) — Live Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip />
            <Line type="monotone" dataKey="power" stroke="#16a34a" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb" }}>
        <h3 style={{ marginTop: 0 }}>Frequency (Hz) — Live Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[49.5, 50.5]} />
            <Tooltip />
            <Line type="monotone" dataKey="frequency" stroke="#d97706" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}