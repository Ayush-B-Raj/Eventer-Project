import React, { useState, useEffect } from "react";
import axios from "axios";
import "./user_page.css";

const UserPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [username, setUsername] = useState(""); // Store the logged-in user's name

  useEffect(() => {
    // Fetch events from the server
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/events");
        setEvents(response.data);

        // Fetch the logged-in user's name
        const userResponse = await axios.get("http://localhost:5000/user");
        setUsername(userResponse.data.username); // Assumes server sends logged-in user's name
      } catch (err) {
        setError("");
        console.error(err);
      }
    };

    fetchEvents();
  }, []);

  const handleBook = async (id) => {
    try {
      const username = localStorage.getItem("username"); // Retrieve the stored name
  
      if (!username) {
        alert("User not logged in");
        return;
      }

      // Optimistic UI update
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id ? { ...event, status: "Booked", booked_by: username } : event
        )
      );

      // Send booking request to the backend
      const response = await axios.post(`http://localhost:5000/events/book/${id}`, {
        username, // Include username in the body
      });
  
      if (response.status === 200) {
        console.log("Booking successful:", response.data);
      } else {
        throw new Error(response.data.message || "Booking failed");
      }
    } catch (err) {
      console.error("Error booking the event:", err);
  
      // Revert the optimistic UI update if booking fails
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id ? { ...event, status: "Not Booked", booked_by: null } : event
        )
      );
      alert("Failed to book the event");
    }
  };

  return (
    <div className="user-page">
      <nav className="navbar">
        <a href="/user" className="nav-link">Home</a> 
        <a href="/" className="nav-link logout">Log Out</a>
      </nav>
      <span className="welcome-message"> {username}</span>
      <h1>Available Events</h1>
      {error && <p className="error">{error}</p>}

      <div className="event-container">
        {events.length > 0 ? (
          events.map((event) => (
            <div className="event-card" key={event.id}>
              <h2 className="event-name">{event.event_name}</h2>
              <img
                src={`http://localhost:5000${event.event_photo}`}
                alt={event.event_name}
                className="event-photo"
              />
              <div className="event-details">
                <p><strong>Price:</strong> {event.price}</p>
                <p><strong>Duration:</strong> {event.duration}</p>
                <p><strong>Contact:</strong> {event.contact}</p>
                <p><strong>Details:</strong> {event.details}</p>
                <p><strong>Status:</strong> {event.status || "Not Booked"}</p>
              </div>
              <button
                onClick={() => handleBook(event.id)}
                disabled={event.status === "Booked"}
                className="book-button"
              >
                {event.status === "Booked" ? "Booked" : "Book"}
              </button>
            </div>
          ))
        ) : (
          <p>No events available.</p>
        )}
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
};

export default UserPage;
