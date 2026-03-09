import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Patients.css";

const initialPatients = [
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
];

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(initialPatients);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    primary_diagnosis: "",
    num_procedures: "",
    days_in_hospital: "",
    comorbidity_score: "",
    discharge_to: "",
    readmitted: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Add new patient
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (
      !formData.age ||
      !formData.gender ||
      !formData.primary_diagnosis ||
      !formData.num_procedures ||
      !formData.days_in_hospital ||
      !formData.comorbidity_score ||
      !formData.discharge_to ||
      formData.readmitted === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newPatient = {
      id: patients.length ? patients[patients.length - 1].id + 1 : 1,
      age: Number(formData.age),
      gender: formData.gender,
      primary_diagnosis: formData.primary_diagnosis,
      num_procedures: Number(formData.num_procedures),
      days_in_hospital: Number(formData.days_in_hospital),
      comorbidity_score: Number(formData.comorbidity_score),
      discharge_to: formData.discharge_to,
      readmitted: Number(formData.readmitted),
    };

    setPatients([...patients, newPatient]);
    setFormData({
      age: "",
      gender: "",
      primary_diagnosis: "",
      num_procedures: "",
      days_in_hospital: "",
      comorbidity_score: "",
      discharge_to: "",
      readmitted: "",
    });
  };

  // Filter patients based on search
  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.primary_diagnosis.toLowerCase().includes(term) ||
      p.gender.toLowerCase().includes(term) ||
      p.discharge_to.toLowerCase().includes(term)
    );
  });

  return (

     <div className="dashboard-container">
      {/* Sidebar */}
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

      {/* Form */}
      <form className="patient-form" onSubmit={handleSubmit}>
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
        <select name="readmitted" value={formData.readmitted} onChange={handleChange}>
          <option value="">Readmitted</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <button type="submit">Add Patient</button>
      </form>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by diagnosis, gender, or discharge..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Patients Table */}
      <table className="patients-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Diagnosis</th>
            <th>Procedures</th>
            <th>Days Hospital</th>
            <th>Comorbidity</th>
            <th>Discharge To</th>
            <th>Readmitted</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.age}</td>
              <td>{p.gender}</td>
              <td>{p.primary_diagnosis}</td>
              <td>{p.num_procedures}</td>
              <td>{p.days_in_hospital}</td>
              <td>{p.comorbidity_score}</td>
              <td>{p.discharge_to}</td>
              <td>{p.readmitted === 1 ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default Patients;