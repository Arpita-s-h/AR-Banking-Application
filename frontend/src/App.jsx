import { useState } from "react";
import axios from "axios";

function App() {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    otherName: "",
    gender: "",
    address: "",
    stateOfOrigin: "",
    email: "",
    phoneNumber: "",
    alternativePhoneNumber: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const createAccount = async () => {

    try {

      const response = await axios.post(
        "http://localhost:8080/api/arbank/users",
        formData
      );

      alert(response.data.responseMessage);

      console.log(response.data);

    } catch (error) {

      console.error(error);

      alert("Failed to create account");

    }
  };

  return (

    <div className="container mt-5">

      <div className="card shadow p-4">

        <h1 className="text-center mb-4">
          AR Banking Application
        </h1>

        <div className="row">

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              name="firstName"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              name="lastName"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Other Name"
              name="otherName"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Gender"
              name="gender"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              name="address"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="State Of Origin"
              name="stateOfOrigin"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Phone Number"
              name="phoneNumber"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-12 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Alternative Phone Number"
              name="alternativePhoneNumber"
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="text-center">

          <button
            className="btn btn-primary"
            onClick={createAccount}
          >
            Create Account
          </button>

        </div>

      </div>

    </div>

  );
}

export default App;