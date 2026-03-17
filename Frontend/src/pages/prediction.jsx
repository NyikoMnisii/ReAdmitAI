import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Prediction.css";

const Prediction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    primary_diagnosis: "",
    num_procedures: "",
    days_in_hospital: "",
    comorbidity_score: "",
    discharge_to: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);
    setLoading(true);

    try {
      const payload = {
        age: parseInt(formData.age),
        gender: formData.gender,
        primary_diagnosis: formData.primary_diagnosis,
        num_procedures: parseInt(formData.num_procedures),
        days_in_hospital: parseInt(formData.days_in_hospital),
        comorbidity_score: parseInt(formData.comorbidity_score),
        discharge_to: formData.discharge_to,
      };

      const res = await api.post("/api/predict", payload);
      setPrediction(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    if (level === "Low")    return "#22c55e";
    if (level === "Medium") return "#f59e0b";
    if (level === "High")   return "#ef4444";
    return "#gray";
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>ReAdmitAI</h2>
        <nav>
          <p onClick={() => navigate("/dashboard")}>Dashboard</p>
          <p onClick={() => navigate("/patients")}>Patients</p>
          <p className="active" onClick={() => navigate("/prediction")}>Predictions</p>
          <p onClick={() => navigate("/analytics")}>Analytics</p>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="patients-container">
        <h1>Predict Patient Readmission</h1>

        <form className="patient-form" onSubmit={handlePredict}>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            min="18"
            max="95"
            required
          />

          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Dropdown matching model's trained values */}
          <select name="primary_diagnosis" value={formData.primary_diagnosis} onChange={handleChange} required>
            <option value="">Select Primary Diagnosis</option>
            <option value="Heart Disease">Heart Disease</option>
            <option value="Diabetes">Diabetes</option>
            <option value="COPD">COPD</option>
            <option value="Hypertension">Hypertension</option>
            <option value="Kidney Disease">Kidney Disease</option>
          </select>

          <input
            type="number"
            name="num_procedures"
            placeholder="Number of Procedures"
            value={formData.num_procedures}
            onChange={handleChange}
            min="0"
            max="20"
            required
          />

          <input
            type="number"
            name="days_in_hospital"
            placeholder="Days in Hospital"
            value={formData.days_in_hospital}
            onChange={handleChange}
            min="1"
            required
          />

          {/* Comorbidity score 0–4 */}
          <select name="comorbidity_score" value={formData.comorbidity_score} onChange={handleChange} required>
            <option value="">Comorbidity Score</option>
            <option value="0">0 — None</option>
            <option value="1">1 — Mild</option>
            <option value="2">2 — Moderate</option>
            <option value="3">3 — Severe</option>
            <option value="4">4 — Very Severe</option>
          </select>

          {/* Dropdown matching model's trained values */}
          <select name="discharge_to" value={formData.discharge_to} onChange={handleChange} required>
            <option value="">Select Discharge Destination</option>
            <option value="Home">Home</option>
            <option value="Home Health Care">Home Health Care</option>
            <option value="Rehabilitation Facility">Rehabilitation Facility</option>
            <option value="Skilled Nursing Facility">Skilled Nursing Facility</option>
          </select>

          {error && <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {/* Prediction Result */}
        {prediction && (
          <div className="prediction-result">
            <h2>Prediction Result</h2>
            <div
              className="risk-badge"
              style={{ backgroundColor: getRiskColor(prediction.risk_level) }}
            >
              {prediction.risk_level} Risk
            </div>
            <p><strong>Readmission Probability:</strong> {prediction.risk_percent}%</p>
            <p><strong>Readmitted:</strong> {prediction.prediction === 1 ? "Yes" : "No"}</p>
            <p><strong>Summary:</strong> {prediction.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediction;