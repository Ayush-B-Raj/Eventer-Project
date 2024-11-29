import React, { useEffect, useState } from "react";
import axios from "axios";
import "./user_page.css"; // Create a CSS file for table styling

function UserPage() {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users"); // Adjust the endpoint as per your backend
        setUsers(response.data); // Set the fetched users to state
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading message while fetching data
  }

  if (error) {
    return <div>{error}</div>; // Display error message if there's an issue
  }

  return (
    <div className="user-page">
      <h1>Registered Users</h1>
      {users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.dob}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users registered yet.</p>
      )}
    </div>
  );
}

export default UserPage;
