import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, User, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Login failed");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError("Cannot connect to server");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eef1f6",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          width: "380px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <div style={{ background: "#1e3a8a", borderRadius: "12px", padding: "14px" }}>
            <Zap size={26} color="white" />
          </div>
        </div>

        <h1 style={{ textAlign: "center", fontSize: "22px", margin: "0 0 4px 0" }}>MAHAGENCO DSM</h1>
        <p style={{ textAlign: "center", color: "#6b7280", fontSize: "14px", marginBottom: "28px" }}>
          Demand Side Management System
        </p>

        <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>
          Employee ID / Username
        </label>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", marginBottom: "18px" }}>
          <User size={18} color="#9ca3af" style={{ marginRight: "8px" }} />
          <input
            type="text"
            placeholder="Enter your ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={{ border: "none", outline: "none", flex: 1, fontSize: "14px" }}
          />
        </div>

        <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>
          Password
        </label>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", marginBottom: "18px" }}>
          <Lock size={18} color="#9ca3af" style={{ marginRight: "8px" }} />
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ border: "none", outline: "none", flex: 1, fontSize: "14px" }}
          />
        </div>

        {error && (
          <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", fontSize: "13px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "#374151" }}>
            <input type="checkbox" /> Remember me
          </label>
          <a href="#" style={{ color: "#1e3a8a", textDecoration: "none" }}>Forgot password?</a>
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            background: "#1e3a8a",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          Sign In <ArrowRight size={18} />
        </button>

        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "12px", marginTop: "20px" }}>
          Authorized Personnel Only
        </p>
      </form>
    </div>
  );
}