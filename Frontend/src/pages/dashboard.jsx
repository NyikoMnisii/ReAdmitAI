import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { staff, logout } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ── Fetch patients on mount ───────────────────────────
  useEffect(() => {
    api.get("/api/patients/")
      .then((res) => setPatients(res.data))
      .catch(() => setError("Failed to load patients."))
      .finally(() => setLoading(false));
  }, []);

  // ── Compute stats from real data ──────────────────────
  const stats = useMemo(() => {
    if (!patients.length) return { total: 0, rate: 0, avgDays: 0, avgComorbidity: 0 };
    const total         = patients.length;
    const readmitted    = patients.filter((p) => p.readmitted).length;
    const rate          = ((readmitted / total) * 100).toFixed(1);
    const avgDays       = (patients.reduce((s, p) => s + p.days_in_hospital, 0) / total).toFixed(1);
    const avgComorbidity = (patients.reduce((s, p) => s + p.comorbidity_score, 0) / total).toFixed(1);
    return { total, readmitted, rate, avgDays, avgComorbidity };
  }, [patients]);

  // ── Recent 5 patients ─────────────────────────────────
  const recentPatients = useMemo(() => patients.slice(0, 5), [patients]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>ReAdmitAI</h2>
        <nav>
          <p className="active" onClick={() => navigate("/dashboard")}>Dashboard</p>
          <p onClick={() => navigate("/patients")}>Patients</p>
          <p onClick={() => navigate("/prediction")}>Predictions</p>
          <p onClick={() => navigate("/analytics")}>Analytics</p>
        </nav>
        {/* Staff info + logout */}
        <div className="sidebar-footer">
          {staff && (
            <div className="staff-info">
              <p className="staff-name">{staff.first_name} {staff.last_name}</p>
              <p className="staff-role">{staff.role}</p>
            </div>
          )}
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-header">
          <h1>Patient Readmission Dashboard</h1>
          <p>Welcome back, Dr. {staff?.last_name} </p>
        </div>

        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {/* Overview Cards */}
        <div className="card-grid">
          <div className="card">
            <h3>Total Patients</h3>
            <p>{loading ? "..." : stats.total}</p>
          </div>
          <div className="card danger">
            <h3>Readmitted</h3>
            <p>{loading ? "..." : stats.readmitted}</p>
          </div>
          <div className="card highlight">
            <h3>Readmission Rate</h3>
            <p>{loading ? "..." : `${stats.rate}%`}</p>
          </div>
          <div className="card">
            <h3>Avg. Days in Hospital</h3>
            <p>{loading ? "..." : stats.avgDays}</p>
          </div>
          <div className="card">
            <h3>Avg. Comorbidity Score</h3>
            <p>{loading ? "..." : stats.avgComorbidity}</p>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="patients-section">
          <div className="section-header">
            <h2>Recent Patients</h2>
            <button className="view-all-btn" onClick={() => navigate("/patients")}>
              View All →
            </button>
          </div>

          {loading ? (
            <p>Loading patients...</p>
          ) : patients.length === 0 ? (
            <p style={{ color: "#888" }}>No patients added yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Diagnosis</th>
                  <th>Days in Hospital</th>
                  <th>Readmitted</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className={selectedPatient?.id === p.id ? "selected" : ""}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{p.first_name} {p.last_name}</td>
                    <td>{p.age}</td>
                    <td>{p.gender}</td>
                    <td>{p.primary_diagnosis}</td>
                    <td>{p.days_in_hospital}</td>
                    <td>
                      <span className={p.readmitted ? "badge-red" : "badge-green"}>
                        {p.readmitted ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Selected Patient Details */}
        {selectedPatient && (
          <div className="patient-details">
            <div className="details-header">
              <h2>Patient Details</h2>
              <button onClick={() => setSelectedPatient(null)}>✕ Close</button>
            </div>
            <ul>
              <li><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</li>
              <li><strong>Age:</strong> {selectedPatient.age}</li>
              <li><strong>Gender:</strong> {selectedPatient.gender}</li>
              <li><strong>Primary Diagnosis:</strong> {selectedPatient.primary_diagnosis}</li>
              <li><strong>Procedures:</strong> {selectedPatient.num_procedures}</li>
              <li><strong>Days in Hospital:</strong> {selectedPatient.days_in_hospital}</li>
              <li><strong>Comorbidity Score:</strong> {selectedPatient.comorbidity_score}</li>
              <li><strong>Discharge To:</strong> {selectedPatient.discharge_to}</li>
              <li>
                <strong>Readmitted:</strong>{" "}
                <span className={selectedPatient.readmitted ? "badge-red" : "badge-green"}>
                  {selectedPatient.readmitted ? "Yes" : "No"}
                </span>
              </li>
            </ul>
            <button
              className="predict-btn"
              onClick={() => navigate("/prediction")}
            >
              Run Prediction for Similar Patient →
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;