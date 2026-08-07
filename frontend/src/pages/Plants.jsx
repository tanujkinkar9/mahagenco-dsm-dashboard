import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

export default function Plants() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/plants")
      .then((res) => res.json())
      .then(setPlants)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "4px" }}>Plants</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>All registered power plants</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {plants.map((plant) => (
          <Link
            key={plant.id}
            to={`/plants/${plant.id}`}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid #e5e7eb",
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <Building2 size={20} color="#1e3a8a" />
              <strong>{plant.name}</strong>
            </div>
            <div style={{ color: "#6b7280", fontSize: "14px" }}>{plant.location || "Location not set"}</div>
          </Link>
        ))}
      </div>

      {plants.length === 0 && (
        <p style={{ color: "#9ca3af" }}>No plants found. Add one via the API.</p>
      )}
    </div>
  );
}