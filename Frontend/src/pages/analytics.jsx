import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Analytics.css";

const readmissionTrend = [
  { month: "Jan", value: 12 },
  { month: "Feb", value: 18 },
  { month: "Mar", value: 10 },
  { month: "Apr", value: 22 },
  { month: "May", value: 15 },
  { month: "Jun", value: 25 },
];

const diagnosisData = [
  { name: "Heart Disease", count: 34 },
  { name: "Diabetes", count: 28 },
  { name: "COPD", count: 15 },
  { name: "Kidney Failure", count: 10 },
];

const readmissionSplit = [
  { name: "Readmitted", value: 40 },
  { name: "Not Readmitted", value: 60 },
];

const COLORS = ["#ef4444", "#22c55e"];

const highRiskPatients = [
  { id: 1, name: "John Smith", risk: "High", diagnosis: "Heart Failure" },
  { id: 2, name: "Mary Johnson", risk: "High", diagnosis: "Diabetes" },
  { id: 3, name: "Robert Brown", risk: "Medium", diagnosis: "COPD" },
];

const Analytics = () => {
  const navigate = useNavigate();

  const kpis = useMemo(() => {
    const totalPatients = 250;
    const readmitted = 100;
    const avgLOS = 6.4;
    const rate = ((readmitted / totalPatients) * 100).toFixed(1);

    return { totalPatients, readmitted, rate, avgLOS };
  }, []);

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
       <aside className="sidebar">
        <h2>ReAdmitAI</h2>

        <nav>
          <p  onClick={() => navigate("/dashboard")}>Dashboard</p>
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
          <p>AI-driven clinical insights</p>
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

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={readmissionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

          {/* DIAGNOSIS */}
          <div className="chart-card">
            <h2>Top Diagnoses</h2>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={diagnosisData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* PIE */}
          <div className="chart-card">
            <h2>Readmission Split</h2>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={readmissionSplit}
                  dataKey="value"
                  outerRadius={90}
                  label
                >
                  {readmissionSplit.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>

          {/* RISK ALERT */}
          <div className="chart-card">
            <h2>Risk Segmentation</h2>

            <div className="risk-box low">Low Risk: 120</div>
            <div className="risk-box medium">Medium Risk: 80</div>
            <div className="risk-box high">High Risk: 50</div>

          </div>

        </section>

        {/* HIGH RISK PATIENT TABLE */}
        <section className="patients-section">

          <h2>High Risk Patients</h2>

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
                  <td className="risk-high">{p.risk}</td>
                </tr>
              ))}

            </tbody>

          </table>

        </section>

      </main>
    </div>
  );
};

export default Analytics;