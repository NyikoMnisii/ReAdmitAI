import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Patients.css";

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    first_name: "", last_name: "", age: "", gender: "",
    primary_diagnosis: "", num_procedures: "", days_in_hospital: "",
    comorbidity_score: "", discharge_to: "", readmitted: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch patients on mount ──────────────────────────
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get("/api/patients/");
      setPatients(res.data);
    } catch (err) {
      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Add patient ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        first_name:        formData.first_name,
        last_name:         formData.last_name,
        age:               parseInt(formData.age),
        gender:            formData.gender,
        primary_diagnosis: formData.primary_diagnosis,
        num_procedures:    parseInt(formData.num_procedures),
        days_in_hospital:  parseInt(formData.days_in_hospital),
        comorbidity_score: parseInt(formData.comorbidity_score),
        discharge_to:      formData.discharge_to,
        readmitted: formData.readmitted === "true",
      };
      const res = await api.post("/api/patients/", payload);
      setPatients((prev) => [res.data, ...prev]);
      setFormData({
        first_name: "", last_name: "", age: "", gender: "",
        primary_diagnosis: "", num_procedures: "", days_in_hospital: "",
        comorbidity_score: "", discharge_to: "", readmitted: "",
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add patient.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete patient ────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      await api.delete(`/api/patients/${id}`);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete patient.");
    }
  };

  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.primary_diagnosis.toLowerCase().includes(term) ||
      p.gender.toLowerCase().includes(term) ||
      p.discharge_to.toLowerCase().includes(term) ||
      p.first_name.toLowerCase().includes(term) ||
      p.last_name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>ReAdmitAI</h2>
        <nav>
          <p onClick={() => navigate("/dashboard")}>Dashboard</p>
          <p className="active" onClick={() => navigate("/patients")}>Patients</p>
          <p onClick={() => navigate("/prediction")}>Predictions</p>
          <p onClick={() => navigate("/analytics")}>Analytics</p>
        </nav>
      </aside>

      <div className="patients-container">
        <h1>Manage Patients</h1>

        {error && <p style={{ color: "#ef4444" }}>{error}</p>}

        {/* Form */}
        <form className="patient-form" onSubmit={handleSubmit}>
          <input type="text" name="first_name" placeholder="First Name"
            value={formData.first_name} onChange={handleChange} required />
          <input type="text" name="last_name" placeholder="Last Name"
            value={formData.last_name} onChange={handleChange} required />
          <input type="number" name="age" placeholder="Age"
            value={formData.age} onChange={handleChange} min="0" required />

          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select name="primary_diagnosis" value={formData.primary_diagnosis} onChange={handleChange} required>
            <option value="">Select Diagnosis</option>
            <option value="Heart Disease">Heart Disease</option>
            <option value="Diabetes">Diabetes</option>
            <option value="COPD">COPD</option>
            <option value="Hypertension">Hypertension</option>
            <option value="Kidney Disease">Kidney Disease</option>
          </select>

          <input type="number" name="num_procedures" placeholder="Number of Procedures"
            value={formData.num_procedures} onChange={handleChange} min="0" required />
          <input type="number" name="days_in_hospital" placeholder="Days in Hospital"
            value={formData.days_in_hospital} onChange={handleChange} min="1" required />

          <select name="comorbidity_score" value={formData.comorbidity_score} onChange={handleChange} required>
            <option value="">Comorbidity Score</option>
            <option value="0">0 — None</option>
            <option value="1">1 — Mild</option>
            <option value="2">2 — Moderate</option>
            <option value="3">3 — Severe</option>
            <option value="4">4 — Very Severe</option>
          </select>

          <select name="discharge_to" value={formData.discharge_to} onChange={handleChange} required>
            <option value="">Select Discharge Destination</option>
            <option value="Home">Home</option>
            <option value="Home Health Care">Home Health Care</option>
            <option value="Rehabilitation Facility">Rehabilitation Facility</option>
            <option value="Skilled Nursing Facility">Skilled Nursing Facility</option>
          </select>

          <select name="readmitted" value={formData.readmitted} onChange={handleChange} required>
  <option value="">Readmitted?</option>
  <option value="false">No</option>
  <option value="true">Yes</option>
</select>

          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Patient"}
          </button>
        </form>

        {/* Search */}
        <div className="search-bar">
          <input type="text" placeholder="Search by name, diagnosis, gender or discharge..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading patients...</p>
        ) : (
          <div className="table-wrapper">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Diagnosis</th>
                  <th>Procedures</th>
                  <th>Days in Hospital</th>
                  <th>Comorbidity</th>
                  <th>Discharge</th>
                  <th>Readmitted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr><td colSpan="11" style={{ textAlign: "center" }}>No patients found</td></tr>
                ) : (
                  filteredPatients.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.first_name} {p.last_name}</td>
                      <td>{p.age}</td>
                      <td>{p.gender}</td>
                      <td>{p.primary_diagnosis}</td>
                      <td>{p.num_procedures}</td>
                      <td>{p.days_in_hospital}</td>
                      <td>{p.comorbidity_score}</td>
                      <td>{p.discharge_to}</td>
                      <td>
                        <span className={p.readmitted ? "badge-red" : "badge-green"}>
                          {p.readmitted ? "Yes" : "No"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(p.id)}
                          style={{
                            background: "#ef4444", color: "white",
                            border: "none", borderRadius: "4px",
                            padding: "4px 10px", cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;