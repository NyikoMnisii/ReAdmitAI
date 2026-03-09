import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import doctorBg from "../assets/doctor-bg.jpg";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("Login success:", data);

      // redirect after successful login
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${doctorBg})` }}
    >

      <div className="login-overlay">

        {/* LEFT SIDE (AI branding) */}
        <div className="login-info">

          <h1>ReAdmitAI</h1>

          <p className="tagline">
            AI-Powered Patient Readmission Prediction
          </p>

          <div className="features">
            <p> Predict high-risk patient readmissions</p>
            <p> Clinical analytics & insights</p>
            <p> Machine learning risk scoring</p>
            <p> Decision support for healthcare teams</p>
          </div>

        </div>

        {/* RIGHT SIDE (LOGIN FORM) */}
        <form className="login-form" onSubmit={handleSubmit}>

          <h2>Clinical System Login</h2>

          <p className="subtitle">
            Secure access for healthcare professionals
          </p>

          <label>Email</label>
          <input
            type="email"
            placeholder="doctor@hospital.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Access Dashboard
          </button>

          <p className="security-note">
            🔒 HIPAA-compliant secure login
          </p>

        </form>

      </div>
    </div>
  );
};

export default Login;