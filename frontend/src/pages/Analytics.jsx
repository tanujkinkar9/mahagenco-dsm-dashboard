import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { IndianRupee, Gauge, Database } from "lucide-react";

const STATUS_COLORS = { Normal: "#16a34a", Warning: "#d97706", Critical: "#dc2626" };

const PLANTS = [
  { code: "", name: "All Plants" },
  { code: "P001", name: "Koradi TPS" },
  { code: "P002", name: "Chandrapur STPS" },
  { code: "P003", name: "Khaparkheda TPS" },
  { code: "P004", name: "Bhusawal TPS" },
  { code: "P005", name: "Paras TPS" },
  { code: "P006", name: "Parli TPS" },
  { code: "P007", name: "Nashik TPS" },
  { code: "P008", name: "Uran GTPS" },
];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [plantCode, setPlantCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchAnalytics = async () => {
    const params = new URLSearchParams();
    if (plantCode) params.append("plant_code", plantCode);
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/analytics?${params}`);
      setData(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [plantCode, startDate, endDate]);

  if (!data) return <p>Loading analytics...</p>;

  const statCards = [
    { label: "Total Penalty", value: `Rs. ${(data.total_penalty / 100000).toFixed(1)}L`, icon: IndianRupee },
    { label: "Avg PLF", value: `${data.avg_plf}%`, icon: Gauge },
    { label: "Total Records", value: data.total_records, icon: Database },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "4px" }}>Analytics Overview</h1>
      <p style={{ color: "#6b7280", marginBottom: "20px" }}>Comprehensive data analysis for Grid Stability and Penalties.</p>

      <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "20px", display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div>
          <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px" }}>Plant</label>
          <select
            value={plantCode}
            onChange={(e) => setPlantCode(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", minWidth: "180px" }}
          >
            {PLANTS.map((p) => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px" }}>From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          />
        </div>

        <div>
          <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px" }}>To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          />
        </div>

        {(startDate || endDate || plantCode) && (
          <button
            onClick={() => { setStartDate(""); setEndDate(""); setPlantCode(""); }}
            style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #d1d5db", background: "white", cursor: "pointer", fontSize: "14px" }}
          >
            Clear filters
          </button>
        )}
      </div>

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

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb" }}>
          <h3 style={{ marginTop: 0 }}>Total Penalty by Plant</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.penalty_by_plant} margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="plant" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
              <Bar dataKey="penalty" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb" }}>
          <h3 style={{ marginTop: 0 }}>Compliance Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.status_distribution} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
                {data.status_distribution.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: "10px" }}>
            {data.status_distribution.map((s) => (
              <div key={s.status} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "4px 0" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: STATUS_COLORS[s.status], display: "inline-block" }}></span>
                  {s.status}
                </span>
                <span style={{ fontWeight: "600" }}>{s.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", padding: "20px", border: "1px solid #e5e7eb" }}>
        <h3 style={{ marginTop: 0 }}>PLF Trend {plantCode || startDate || endDate ? "" : "(Last 30 Days)"}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.plf_trend} margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11 }} domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip />
            <Line type="monotone" dataKey="avg_plf" stroke="#1e3a8a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
