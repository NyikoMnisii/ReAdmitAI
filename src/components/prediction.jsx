import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle prediction submission
  const handlePredict = (e) => {
    e.preventDefault();

    // Simple validation
    if (
      !formData.age ||
      !formData.gender ||
      !formData.primary_diagnosis ||
      !formData.num_procedures ||
      !formData.days_in_hospital ||
      !formData.comorbidity_score ||
      !formData.discharge_to
    ) {
      alert("Please fill all fields.");
      return;
    }

    // Mock prediction logic (replace with API call)
    // For demo, probability > 0.5 => readmitted
    const mockProbability =
      (Number(formData.age) * 0.01 +
        Number(formData.num_procedures) * 0.1 +
        Number(formData.days_in_hospital) * 0.05 +
        Number(formData.comorbidity_score) * 0.2) %
      1;

    setPrediction({
      probability: mockProbability.toFixed(2),
      readmitted: mockProbability > 0.5 ? "Yes" : "No",
    });
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

        {/* Prediction Form */}
        <form className="patient-form" onSubmit={handlePredict}>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            min="0"
          />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="primary_diagnosis"
            placeholder="Primary Diagnosis"
            value={formData.primary_diagnosis}
            onChange={handleChange}
          />
          <input
            type="number"
            name="num_procedures"
            placeholder="Number of Procedures"
            value={formData.num_procedures}
            onChange={handleChange}
            min="0"
          />
          <input
            type="number"
            name="days_in_hospital"
            placeholder="Days in Hospital"
            value={formData.days_in_hospital}
            onChange={handleChange}
            min="0"
          />
          <input
            type="number"
            name="comorbidity_score"
            placeholder="Comorbidity Score"
            value={formData.comorbidity_score}
            onChange={handleChange}
            min="0"
          />
          <input
            type="text"
            name="discharge_to"
            placeholder="Discharge To"
            value={formData.discharge_to}
            onChange={handleChange}
          />

          <button type="submit">Predict</button>
        </form>

        {/* Prediction Result */}
        {prediction && (
          <div className="prediction-result">
            <h2>Prediction Result</h2>
            <p>
              <strong>Readmitted:</strong> {prediction.readmitted}
            </p>
            <p>
              <strong>Probability:</strong> {prediction.probability * 100}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediction;