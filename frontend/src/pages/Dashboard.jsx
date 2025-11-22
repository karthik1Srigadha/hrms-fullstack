// src/pages/Dashboard.jsx
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "../pages/Styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    employees: 0,
    teams: 0,
  });

  function handleLogout() {
    localStorage.removeItem("hrms_token");
    navigate("/login");
  }

  async function loadCounts() {
    try {
      const empRes = await api.get("/employees");
      const teamRes = await api.get("/teams");

      setCounts({
        employees: empRes.data.length,
        teams: teamRes.data.length,
      });
    } catch (err) {
      console.error("Error loading dashboard counts:", err);
    }
  }

  useEffect(() => {
  loadCounts();
}, []);


  return (
    <div className="dashboard-page">

      <header className="dashboard-header">
        <h1>HRMS Dashboard</h1>
        
      </header>
      <button onClick={handleLogout} className="logout-btn">Logout</button>

      <main className="dashboard-content">
        <div className="dashboard-card-container">

          <Link to="/employees" className="dashboard-card">
            <h3>Employees</h3>
            <p>Manage employees</p>
            <span className="count-badge">{counts.employees}</span>
          </Link>

          <Link to="/teams" className="dashboard-card">
            <h3>Teams</h3>
            <p>Manage teams and members</p>
            <span className="count-badge">{counts.teams}</span>
          </Link>

        </div>
      </main>
    </div>
  );
}
