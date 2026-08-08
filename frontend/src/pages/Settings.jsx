import { useEffect, useState } from "react";

export default function Settings() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Settings</h1>

      <div style={{ background: "white", borderRadius: "12px", padding: "24px", border: "1px solid #e5e7eb", maxWidth: "500px" }}>
        <h3 style={{ marginTop: 0 }}>Profile Information</h3>
        {user ? (
          <>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px" }}>Employee ID</label>
              <div style={{ padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#f9fafb" }}>{user.employee_id}</div>
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px" }}>Name</label>
              <div style={{ padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#f9fafb" }}>{user.name}</div>
            </div>
            <div>
              <label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px" }}>Role</label>
              <div style={{ padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#f9fafb" }}>{user.role}</div>
            </div>
          </>
        ) : (
          <p style={{ color: "#6b7280" }}>No user data found.</p>
        )}
      </div>
    </div>
  );
}