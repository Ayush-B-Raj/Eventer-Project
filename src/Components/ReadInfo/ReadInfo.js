import React, { useState } from "react";
import axios from "axios";
import "./read_info.css";

function ReadInfo() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    dob: "",
    phone: "",
    email: "",
    password: "", // Added password field
  });

  const [submittedData, setSubmittedData] = useState(null); // State to store submitted data

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sending form data to the backend via API
      const response = await axios.post("http://localhost:5000/submit", formData);
      alert(response.data); // Display success message

      // Store the submitted data
      setSubmittedData(formData);
    } catch (error) {
      console.error("There was an error submitting the form!", error);
      alert("Error submitting the form.");
    }

    // Clear form after submission
    setFormData({
      name: "",
      address: "",
      dob: "",
      phone: "",
      email: "",
      password: "", // Clear password field
    });
  };

  return (
    <div className="form-container">
      <h1>Read User Information</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit phone number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {/* Display submitted data below the form */}
      {submittedData && (
        <div className="submitted-data">
          <h2>Submitted Details</h2>
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <td>{submittedData.name}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>{submittedData.address}</td>
              </tr>
              <tr>
                <th>Date of Birth</th>
                <td>{submittedData.dob}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{submittedData.phone}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{submittedData.email}</td>
              </tr>
              <tr>
                <th>Password</th>
                <td>{submittedData.password}</td> {/* Display password */}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReadInfo;