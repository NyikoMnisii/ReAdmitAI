import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

// Example patients dataset
const patients = [
  {
    id: 1,
    age: 69,
    gender: "Male",
    primary_diagnosis: "Heart Disease",
    num_procedures: 1,
    days_in_hospital: 2,
    comorbidity_score: 1,
    discharge_to: "Home Health Care",
    readmitted: 0,
  },
  {
    id: 2,
    age: 58,
    gender: "Female",
    primary_diagnosis: "Diabetes",
    num_procedures: 2,
    days_in_hospital: 3,
    comorbidity_score: 2,
    discharge_to: "Skilled Nursing Facility",
    readmitted: 1,
  },
  {
    id: 3,
    age: 58,
    gender: "Male",
    primary_diagnosis: "Cancer",
    num_procedures: 4,
    days_in_hospital: 16,
    comorbidity_score: 6,
    discharge_to: "Skilled Nursing Facility",
    readmitted: 0,
  },
  {
    id: 4,
    age: 58,
    gender: "Female",
    primary_diagnosis: "Cancer",
    num_procedures: 2,
    days_in_hospital: 5,
    comorbidity_score: 2,
    discharge_to: "Skilled Nursing Facility",
    readmitted: 1,
  },
  {
    id: 5,
    age: 58,
    gender: "Female",
    primary_diagnosis: "Diabetes",
    num_procedures: 2,
    days_in_hospital: 3,
    comorbidity_score: 2,
    discharge_to: "Skilled Nursing Facility",
    readmitted: 0,
  },
];

const Dashboard = () => {

  const navigate = useNavigate(); 

  const [selectedPatient, setSelectedPatient] = useState(null);

  // Calculate overview stats
  const totalPatients = patients.length;

  const readmittedCount = patients.filter(
    (p) => p.readmitted === 1
  ).length;

  const readmissionRate = (
    (readmittedCount / totalPatients) * 100
  ).toFixed(1);

  const avgDays = (
    patients.reduce((sum, p) => sum + p.days_in_hospital, 0) /
    totalPatients
  ).toFixed(1);

  const avgComorbidity = (
    patients.reduce((sum, p) => sum + p.comorbidity_score, 0) /
    totalPatients
  ).toFixed(1);

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
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1>Patient Readmission Dashboard</h1>

        {/* Overview Cards */}
        <div className="card-grid">
          <div className="card">
            <h3>Total Patients</h3>
            <p>{totalPatients}</p>
          </div>

          <div className="card">
            <h3>Readmission Rate</h3>
            <p>{readmissionRate}%</p>
          </div>

          <div className="card">
            <h3>Avg. Days in Hospital</h3>
            <p>{avgDays}</p>
          </div>

          <div className="card">
            <h3>Avg. Comorbidity Score</h3>
            <p>{avgComorbidity}</p>
          </div>
        </div>

        {/* Patient List */}
        <div className="patients-section">
          <h2>Patients</h2>

          <table>
            <thead>
              <tr>
                <th>Age</th>
                <th>Gender</th>
                <th>Diagnosis</th>
                <th>Days in Hospital</th>
                <th>Readmitted</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={
                    selectedPatient?.id === p.id ? "selected" : ""
                  }
                >
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.primary_diagnosis}</td>
                  <td>{p.days_in_hospital}</td>
                  <td>{p.readmitted === 1 ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Selected Patient Details */}
        {selectedPatient && (
          <div className="patient-details">
            <h2>Patient Details</h2>

            <ul>
              <li><strong>Age:</strong> {selectedPatient.age}</li>
              <li><strong>Gender:</strong> {selectedPatient.gender}</li>
              <li><strong>Primary Diagnosis:</strong> {selectedPatient.primary_diagnosis}</li>
              <li><strong>Number of Procedures:</strong> {selectedPatient.num_procedures}</li>
              <li><strong>Days in Hospital:</strong> {selectedPatient.days_in_hospital}</li>
              <li><strong>Comorbidity Score:</strong> {selectedPatient.comorbidity_score}</li>
              <li><strong>Discharge To:</strong> {selectedPatient.discharge_to}</li>
              <li><strong>Readmitted:</strong> {selectedPatient.readmitted === 1 ? "Yes" : "No"}</li>
            </ul>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;