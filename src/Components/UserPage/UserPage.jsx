import React, { useState, useEffect } from "react";
import axios from "axios";
import "./user_page.css";

const UserPage = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch events from the server
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/events");
        setEvents(response.data);
      } catch (err) {
        setError("Error fetching events.");
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const handleBook = async (id) => {
    // Optimistic UI Update: Immediately set the status as "Booked" in the UI
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, status: "Booked" } : event
      )
    );
  
    try {
      // Send the booking request to the backend
      const response = await axios.post(`http://localhost:5000/events/book/${id}`);
  
      if (response.status === 200) {
        console.log("Booking successful:", response.data);
        // Optionally, you can log the success response from the server to confirm
      } else {
        // If the response from the server is unexpected
        setError("Error booking the event. " + (response.data.message || ""));
        console.error("Unexpected response:", response);
      }
    } catch (err) {
      // If there was an error with the request (e.g., server error)
      setError("Error booking the event.");
      console.error("Error booking the event:", err.response ? err.response.data : err);
      
      // Revert the status back to "Not Booked" if the booking failed
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id ? { ...event, status: "Not Booked" } : event
        )
      );
    }
  };
  

  return (
    <div className="user-page">
      <nav className="navbar">
        <a href="/" className="nav-link">Home</a>
      </nav>

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
    </div>
  );
};

export default UserPage;
