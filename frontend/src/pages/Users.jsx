import { useEffect, useState } from "react";

const roleColors = {
  Admin: { bg: "#dbeafe", text: "#1e3a8a" },
  Engineer: { bg: "#dcfce7", text: "#16a34a" },
  Viewer: { bg: "#f3f4f6", text: "#374151" },
};

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "4px" }}>User Management</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>Manage system access and roles.</p>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280", fontSize: "13px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "12px" }}>Employee ID</th>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px" }}>{u.employee_id}</td>
                <td style={{ padding: "12px" }}>{u.name}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{
                    background: roleColors[u.role]?.bg || "#f3f4f6",
                    color: roleColors[u.role]?.text || "#374151",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p style={{ padding: "16px", color: "#6b7280" }}>No users found.</p>}
      </div>
    </div>
  );
}