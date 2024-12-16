import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom"; 
import axios from "axios";
import "./admin_page.css";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-page">
      {/* Navigation Bar */}
      <nav className="admin-nav">
        <Link to="/admin" className="nav-link">Home</Link>
        <Link to="/admin/upload" className="nav-link">Upload</Link>
        <Link to="/admin/events" className="nav-link">Events</Link>
        <Link to="/admin/booked" className="nav-link">Bookings</Link>
        <Link to="/" className="nav-link">Log Out</Link>
      </nav>

      {/* Page Content */}
      <div className="content">
        {location.pathname === "/admin" && (
          <>
            <h1 className="admin-title">Admin Dashboard</h1>
            <h2 className="section-title">Registered Users</h2>
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

        <Outlet />
      </div>

     {/* Footer Section */}
     <div className="footer">
        <div className="bar">
          <div>Contact Us</div>
          <div>Email: eventmanage@gmal.com</div>
          <div>Phone: +91 9996548367</div>
          <div>Address: Kothamangalam Bypass Rd</div>
        </div>
        <div className="copyright">
          © 2024 All rights reserved
        </div>
      </div>

    </div>
  );
}

export default AdminPage;
