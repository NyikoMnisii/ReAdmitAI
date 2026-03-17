import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Analytics.css";

const COLORS = ["#ef4444", "#22c55e"];

const Analytics = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── Fetch all patients ────────────────────────────────
  useEffect(() => {
    api.get("/api/patients/")
      .then((res) => setPatients(res.data))
      .catch(() => setError("Failed to load analytics data."))
      .finally(() => setLoading(false));
  }, []);

  // ── Compute KPIs from real data ───────────────────────
  const kpis = useMemo(() => {
    const totalPatients = patients.length;
    const readmitted    = patients.filter((p) => p.readmitted).length;
    const rate          = totalPatients ? ((readmitted / totalPatients) * 100).toFixed(1) : 0;
    const avgLOS        = totalPatients
      ? (patients.reduce((sum, p) => sum + p.days_in_hospital, 0) / totalPatients).toFixed(1)
      : 0;
    return { totalPatients, readmitted, rate, avgLOS };
  }, [patients]);

  // ── Readmission split for pie chart ───────────────────
  const readmissionSplit = useMemo(() => {
    const readmitted    = patients.filter((p) => p.readmitted).length;
    const notReadmitted = patients.length - readmitted;
    return [
      { name: "Readmitted",     value: readmitted },
      { name: "Not Readmitted", value: notReadmitted },
    ];
  }, [patients]);

  // ── Top diagnoses for bar chart ───────────────────────
  const diagnosisData = useMemo(() => {
    const counts = {};
    patients.forEach((p) => {
      counts[p.primary_diagnosis] = (counts[p.primary_diagnosis] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [patients]);

  // ── Readmission trend by month ─────────────────────────
  const readmissionTrend = useMemo(() => {
    const monthCounts = {};
    const monthNames  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    patients
      .filter((p) => p.readmitted && p.created_at)
      .forEach((p) => {
        const month = monthNames[new Date(p.created_at).getMonth()];
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      });
    return monthNames
      .filter((m) => monthCounts[m])
      .map((month) => ({ month, value: monthCounts[month] }));
  }, [patients]);

  // ── Risk segmentation ─────────────────────────────────
  const riskSegmentation = useMemo(() => {
    let low = 0, medium = 0, high = 0;
    patients.forEach((p) => {
      const score = p.comorbidity_score + (p.days_in_hospital > 7 ? 1 : 0);
      if (score <= 1)      low++;
      else if (score <= 3) medium++;
      else                 high++;
    });
    return { low, medium, high };
  }, [patients]);

  // ── High risk patients table ──────────────────────────
  const highRiskPatients = useMemo(() => {
    return patients
      .filter((p) => p.comorbidity_score >= 3 || p.days_in_hospital > 10)
      .slice(0, 10)
      .map((p) => ({
        id:        p.id,
        name:      `${p.first_name} ${p.last_name}`,
        diagnosis: p.primary_diagnosis,
        risk:      p.comorbidity_score >= 4 ? "High" : "Medium",
      }));
  }, [patients]);

  if (loading) return <div className="dashboard-container"><p style={{ padding: "2rem" }}>Loading analytics...</p></div>;
  if (error)   return <div className="dashboard-container"><p style={{ padding: "2rem", color: "red" }}>{error}</p></div>;

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>ReAdmitAI</h2>
        <nav>
          <p onClick={() => navigate("/dashboard")}>Dashboard</p>
          <p onClick={() => navigate("/patients")}>Patients</p>
          <p onClick={() => navigate("/prediction")}>Predictions</p>
          <p className="active" onClick={() => navigate("/analytics")}>Analytics</p>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="analytics-container">
        {/* HEADER */}
        <header className="analytics-header">
          <h1>Hospital Readmission Analytics</h1>
          <p>AI-driven clinical insights — live data</p>
        </header>

        {/* KPI SECTION */}
        <section className="kpi-grid">
          <div className="kpi-card">
            <h3>Total Patients</h3>
            <p>{kpis.totalPatients}</p>
          </div>
          <div className="kpi-card danger">
            <h3>Readmitted</h3>
            <p>{kpis.readmitted}</p>
          </div>
          <div className="kpi-card highlight">
            <h3>Readmission Rate</h3>
            <p>{kpis.rate}%</p>
          </div>
          <div className="kpi-card">
            <h3>Avg Length of Stay</h3>
            <p>{kpis.avgLOS} days</p>
          </div>
        </section>

        {/* CHART GRID */}
        <section className="chart-grid">
          {/* TREND */}
          <div className="chart-card">
            <h2>Readmission Trend</h2>
            {readmissionTrend.length === 0 ? (
              <p style={{ color: "#888", padding: "1rem" }}>No readmission data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={readmissionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* DIAGNOSIS */}
          <div className="chart-card">
            <h2>Top Diagnoses</h2>
            {diagnosisData.length === 0 ? (
              <p style={{ color: "#888", padding: "1rem" }}>No diagnosis data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={diagnosisData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* PIE */}
          <div className="chart-card">
            <h2>Readmission Split</h2>
            {patients.length === 0 ? (
              <p style={{ color: "#888", padding: "1rem" }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={readmissionSplit} dataKey="value" outerRadius={90} label>
                    {readmissionSplit.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* RISK SEGMENTATION */}
          <div className="chart-card">
            <h2>Risk Segmentation</h2>
            <div className="risk-box low">Low Risk: {riskSegmentation.low}</div>
            <div className="risk-box medium">Medium Risk: {riskSegmentation.medium}</div>
            <div className="risk-box high">High Risk: {riskSegmentation.high}</div>
          </div>
        </section>

        {/* HIGH RISK PATIENT TABLE */}
        <section className="patients-section">
          <h2>High Risk Patients</h2>
          {highRiskPatients.length === 0 ? (
            <p style={{ color: "#888" }}>No high risk patients found</p>
          ) : (
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Diagnosis</th>
                  <th>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {highRiskPatients.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.diagnosis}</td>
                    <td className={p.risk === "High" ? "risk-high" : "risk-medium"}>
                      {p.risk}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default Analytics;