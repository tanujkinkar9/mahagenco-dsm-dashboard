import { useEffect, useState } from "react";
import { Download } from "lucide-react";

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

const statusColors = {
  Normal: { bg: "#dcfce7", text: "#16a34a" },
  Warning: { bg: "#fef3c7", text: "#d97706" },
  Critical: { bg: "#fee2e2", text: "#dc2626" },
};

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [plantCode, setPlantCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, page_size: 20 });
      if (plantCode) params.append("plant_code", plantCode);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const res = await fetch(`http://127.0.0.1:8000/api/reports?${params}`);
      const data = await res.json();
      setReports(data.data);
      setTotalPages(data.total_pages);
      setTotal(data.total);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [plantCode, startDate, endDate, page]);

  // Reset to page 1 when filters change
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const exportCSV = () => {
    const headers = ["Date", "Plant", "DSM Target (MW)", "DSM Achieved (MW)", "PLF %", "Deviation %", "Penalty (₹)", "Status"];
    const rows = reports.map((r) => [
  `"${r.date.split("T")[0]}"`,
  `"${r.plant_name}"`,
  r.dsm_target,
  r.dsm_achieved,
  r.plf_percent,
  r.deviation_percent,
  r.penalty_amount,
  r.status,
]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dsm_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "28px", marginBottom: "4px" }}>Reports</h1>
          <p style={{ color: "#6b7280", margin: 0 }}>Detailed analysis of scheduled vs actual generation data.</p>
        </div>
        <button
          onClick={exportCSV}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#1e3a8a",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "20px", display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
        <div>
          <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px" }}>Plant</label>
          <select
            value={plantCode}
            onChange={handleFilterChange(setPlantCode)}
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
            onChange={handleFilterChange(setStartDate)}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          />
        </div>

        <div>
          <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px" }}>To</label>
          <input
            type="date"
            value={endDate}
            onChange={handleFilterChange(setEndDate)}
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db" }}
          />
        </div>

        {(startDate || endDate || plantCode) && (
          <button
            onClick={() => { setStartDate(""); setEndDate(""); setPlantCode(""); setPage(1); }}
            style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #d1d5db", background: "white", cursor: "pointer", fontSize: "14px" }}
          >
            Clear filters
          </button>
        )}
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280", fontSize: "13px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "12px" }}>Date</th>
              <th style={{ padding: "12px" }}>Plant</th>
              <th style={{ padding: "12px" }}>DSM Target (MW)</th>
              <th style={{ padding: "12px" }}>DSM Achieved (MW)</th>
              <th style={{ padding: "12px" }}>PLF %</th>
              <th style={{ padding: "12px" }}>Deviation %</th>
              <th style={{ padding: "12px" }}>Penalty (₹)</th>
              <th style={{ padding: "12px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px" }}>{r.date.split("T")[0]}</td>
                <td style={{ padding: "12px" }}>{r.plant_name}</td>
                <td style={{ padding: "12px" }}>{r.dsm_target}</td>
                <td style={{ padding: "12px" }}>{r.dsm_achieved}</td>
                <td style={{ padding: "12px" }}>{r.plf_percent}%</td>
                <td style={{ padding: "12px", color: r.deviation_percent >= 0 ? "#16a34a" : "#dc2626", fontWeight: "600" }}>
                  {r.deviation_percent > 0 ? "+" : ""}{r.deviation_percent}%
                </td>
                <td style={{ padding: "12px" }}>{r.penalty_amount > 0 ? `₹${r.penalty_amount.toLocaleString()}` : "--"}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    background: statusColors[r.status]?.bg,
                    color: statusColors[r.status]?.text,
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p style={{ padding: "16px", color: "#6b7280" }}>Loading...</p>}
        {!loading && reports.length === 0 && <p style={{ padding: "16px", color: "#6b7280" }}>No data found.</p>}

        {/* Pagination */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderTop: "1px solid #e5e7eb" }}>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            Showing page {page} of {totalPages} ({total} total entries)
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #d1d5db", background: page === 1 ? "#f3f4f6" : "white", cursor: page === 1 ? "not-allowed" : "pointer" }}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #d1d5db", background: page === totalPages ? "#f3f4f6" : "white", cursor: page === totalPages ? "not-allowed" : "pointer" }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}