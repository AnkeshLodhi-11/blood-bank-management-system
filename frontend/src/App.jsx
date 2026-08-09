import { useState } from "react";
import "./App.css";

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [registerData, setRegisterData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    bloodGroup: "",
    city: "",
    password: "",
  });

  const openLogin = () => {
    setShowAuth(true);
    setIsRegister(false);
  };

  const openRegister = () => {
    setShowAuth(true);
    setIsRegister(true);
  };

  // ================= REGISTER =================

 const handleRegister = async (e) => {
  e.preventDefault();

  if (
    !registerData.name ||
    !registerData.age ||
    !registerData.email ||
    !registerData.phone ||
    !registerData.bloodGroup ||
    !registerData.city ||
    !registerData.password
  ) {
    alert("Please fill all the fields.");
    return;
  }
    try {
      setLoading(true);

      const response = await fetch(
  "http://localhost:5000/api/donors",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name: registerData.name,
      age: Number(registerData.age),
      email: registerData.email,
      phone: registerData.phone,
      bloodGroup: registerData.bloodGroup,
      city: registerData.city,
      password: registerData.password,
    }),
  }
);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      alert(
        "✅ Registration Successful!\n\n" +
        "Donor details saved successfully."
      );

      setRegisterData({
        name: "",
        age: "",
        email: "",
        phone: "",
        bloodGroup: "",
        city: "",
        password: "",
      });

      setShowAuth(false);

    } catch (error) {
      console.error("Registration Error:", error);

      alert(
        "❌ Registration Failed!\n\n" +
        error.message
      );

    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const email = e.target.email.value.trim();
      const password = e.target.password.value;

      if (!email || !password) {
        alert("Please enter email and password.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/donors/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "donor",
        JSON.stringify(data.donor)
      );

      alert(
        `Welcome ${data.donor.name}! Login Successful ✅`
      );

      setShowAuth(false);

    } catch (error) {
      console.error("Login Error:", error);

      alert(
        "❌ Login Failed!\n\n" +
        error.message
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          <span className="logo-blood">🩸</span>
          <span>Veda Hospital</span>
        </div>

        <div className="nav-links">

          <a href="#home">Home</a>

          <a href="#donors">Donors</a>

          <a href="#blood">Blood Stock</a>

          <a href="#request">Request Blood</a>

          <button
            className="login-btn"
            onClick={openLogin}
          >
            Login
          </button>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero" id="home">

        <div className="hero-content">

          <span className="badge">
            🩸 24/7 Blood Support
          </span>

          <h1>
            Veda Hospital & <br />
            <span>Blood Care Center</span>
          </h1>

          <p>
            A modern blood management platform connecting
            donors, patients and hospitals when every second matters.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={openRegister}
            >
              🩸 Donate Blood
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                document
                  .getElementById("request")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Request Blood
            </button>

          </div>

          <div className="location">
            📍 C24, Vasant Vihar, Ujjain,
            Madhya Pradesh 456010
          </div>

        </div>


        <div className="hero-card">

          <div className="blood-drop">
            🩸
          </div>

          <h2>
            Every Drop Matters
          </h2>

          <p>
            Your one donation can help save lives.
          </p>

          <div className="mini-stats">

            <div>
              <strong>24/7</strong>
              <span>Support</span>
            </div>

            <div>
              <strong>8+</strong>
              <span>Blood Groups</span>
            </div>

          </div>

        </div>

      </section>


      {/* ================= STATS ================= */}

      <section className="stats">

        <div className="stat-card">
          <span>🩸</span>

          <div>
            <h2>1,250+</h2>
            <p>Registered Donors</p>
          </div>
        </div>


        <div className="stat-card">
          <span>🏥</span>

          <div>
            <h2>25+</h2>
            <p>Partner Hospitals</p>
          </div>
        </div>


        <div className="stat-card">
          <span>❤️</span>

          <div>
            <h2>3,800+</h2>
            <p>Lives Supported</p>
          </div>
        </div>


        <div className="stat-card">
          <span>⚡</span>

          <div>
            <h2>24/7</h2>
            <p>Emergency Service</p>
          </div>
        </div>

      </section>


      {/* ================= BLOOD STOCK ================= */}

      <section className="section" id="blood">

        <div className="section-heading">

          <span>
            LIVE INVENTORY
          </span>

          <h2>
            Blood Stock Availability
          </h2>

          <p>
            Current blood availability at Veda Hospital, Ujjain.
          </p>

        </div>


        <div className="blood-grid">

          {[
            ["A+", "Available", "24 Units"],
            ["A-", "Low Stock", "6 Units"],
            ["B+", "Available", "18 Units"],
            ["B-", "Critical", "2 Units"],
            ["O+", "Available", "32 Units"],
            ["O-", "Low Stock", "5 Units"],
            ["AB+", "Available", "12 Units"],
            ["AB-", "Critical", "1 Unit"],
          ].map(
            ([group, status, units]) => (

              <div
                className={`blood-card ${
                  status === "Critical"
                    ? "critical"
                    : status === "Low Stock"
                    ? "low"
                    : "available"
                }`}
                key={group}
              >

                <div className="blood-type">
                  {group}
                </div>

                <h3>
                  {status}
                </h3>

                <p>
                  {units}
                </p>

                <div className="progress">
                  <div></div>
                </div>

              </div>

            )
          )}

        </div>

      </section>


      {/* ================= DONOR ================= */}

      <section
        className="donor-section"
        id="donors"
      >

        <div>

          <span>
            BE A HERO
          </span>

          <h2>
            Become a Blood Donor
          </h2>

          <p>
            A small act of kindness can become someone's
            second chance at life. Register yourself as a donor today.
          </p>

          <button
            className="primary-btn"
            onClick={openRegister}
          >
            Register as Donor →
          </button>

        </div>


        <div className="donor-info">

          <div>
            <strong>01</strong>
            <p>Register</p>
          </div>

          <div>
            <strong>02</strong>
            <p>Donate</p>
          </div>

          <div>
            <strong>03</strong>
            <p>Save a Life</p>
          </div>

        </div>

      </section>


      {/* ================= EMERGENCY ================= */}

      <section
        className="emergency"
        id="request"
      >

        <div>

          <span>
            🚨 EMERGENCY BLOOD REQUEST
          </span>

          <h2>
            Need Blood Urgently?
          </h2>

          <p>
            Submit an emergency blood request and our team
            can help identify suitable blood availability.
          </p>

        </div>

        <button
          className="emergency-btn"
          onClick={openRegister}
        >
          Request Blood Now →
        </button>

      </section>


      {/* ================= LOCATION ================= */}

      <section className="location-section">

        <div className="location-icon">
          📍
        </div>

        <div>

          <span>
            OUR LOCATION
          </span>

          <h2>
            Veda Hospital, Ujjain
          </h2>

          <p>
            C24, Vasant Vihar, Ujjain,
            Madhya Pradesh 456010
          </p>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer>

        <div>

          <h2>
            🩸 Veda Hospital
          </h2>

          <p>
            Blood Care Center · Ujjain,
            Madhya Pradesh
          </p>

          <p>
            C24, Vasant Vihar,
            Ujjain - 456010
          </p>

        </div>


        <div>

          <p>
            📧 ankeshlodhi546@gmail.com
          </p>

          <p>
            🌐 Blood Bank Management System
          </p>

        </div>


        <div>

          <p>
            © 2026 Veda Hospital & Blood Care Center
          </p>

          <p className="developer-credit">
            Designed & Developed by{" "}
            <strong>Ankit Lodhi</strong>
          </p>

        </div>

      </footer>


      {/* ================= AUTH MODAL ================= */}

      {showAuth && (

        <div
          className="auth-overlay"
          onClick={(e) => {

            if (
              e.target.className ===
              "auth-overlay"
            ) {
              setShowAuth(false);
            }

          }}
        >

          <div className="auth-box">

            {/* CLOSE */}

            <button
              className="close-btn"
              onClick={() =>
                setShowAuth(false)
              }
            >
              ×
            </button>


            {/* HEADER */}

            <div className="auth-header">

              <div className="auth-icon">
                🩸
              </div>

              <h2>
                Veda Hospital
              </h2>

              <p>
                {isRegister
                  ? "Create your account"
                  : "Welcome back"}
              </p>

            </div>


            {/* ================= REGISTER ================= */}

            {isRegister ? (

              <form onSubmit={handleRegister}>

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      name: e.target.value,
                    })
                  }
                  required
                />


                <label>
                  Age
                </label>

                <input
                  type="number"
                  placeholder="Enter your age"
                  min="18"
                  max="100"
                  value={registerData.age}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      age: e.target.value,
                    })
                  }
                  required
                />


                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      email: e.target.value,
                    })
                  }
                  required
                />


                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={registerData.phone}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      phone: e.target.value,
                    })
                  }
                  required
                />


                <label>
                  Blood Group
                </label>

                <select
                  value={registerData.bloodGroup}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      bloodGroup: e.target.value,
                    })
                  }
                  required
                >

                  <option value="">
                    Select Blood Group
                  </option>

                  <option value="A+">
                    A+
                  </option>

                  <option value="A-">
                    A-
                  </option>

                  <option value="B+">
                    B+
                  </option>

                  <option value="B-">
                    B-
                  </option>

                  <option value="AB+">
                    AB+
                  </option>

                  <option value="AB-">
                    AB-
                  </option>

                  <option value="O+">
                    O+
                  </option>

                  <option value="O-">
                    O-
                  </option>

                </select>


                <label>
                  City
                </label>

                <input
                  type="text"
                  placeholder="Enter your city"
                  value={registerData.city}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      city: e.target.value,
                    })
                  }
                  required
                />


                <label>
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  required
                />


                <button
                  type="submit"
                  className="register-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>


                <p className="auth-footer">

                  Already have an account?

                  <span
                    onClick={() =>
                      setIsRegister(false)
                    }
                  >
                    Login
                  </span>

                </p>

              </form>

            ) : (

              /* ================= LOGIN ================= */

              <form onSubmit={handleLogin}>

                <label>
                  Email Address
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />


                <label>
                  Password
                </label>

                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />


                <button
                  type="submit"
                  className="register-btn"
                >
                  Login
                </button>


                <p className="auth-footer">

                  Don't have an account?

                  <span
                    onClick={() =>
                      setIsRegister(true)
                    }
                  >
                    Create Account
                  </span>

                </p>

              </form>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default App;