import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import "./admin_page.css"; // Customize this CSS file

function AdminPage() {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const location = useLocation(); // Get the current location/path

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
    <div className="admin-page">
      {/* Navigation Bar */}
      <nav className="admin-nav">
        <Link to="/admin" className="nav-link">Home</Link> {/* Link to Admin Dashboard */}
        <Link to="/admin/upload" className="nav-link">Upload</Link> {/* Link to Upload Page */}
        <Link to="/admin/events" className="nav-link">Events</Link> {/* Link to Events Page */}
      </nav>

      {/* Page Content */}
      <div className="content">
        {/* Conditionally render the list of users only when we're on the exact /admin route */}
        {location.pathname === "/admin" && (
          <>
            <h1>Admin Dashboard</h1>
            <h2>Registered Users</h2>
            {users.length > 0 ? (
              <table className="admin-table">
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
          </>
        )}

        {/* Render nested routes (UploadPage, EventsPage) here */}
        <Outlet /> {/* Nested route content will be rendered here */}
      </div>
    </div>
  );
}

export default AdminPage;
