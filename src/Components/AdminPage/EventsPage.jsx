import React, { useState, useEffect } from "react";
import axios from "axios";
import './event_page.css';

const EventPage = () => {
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
        console.error(err);
      }
    };

    fetchEvents();
  }, []);

  // Handle deleting an event
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/events/${id}`);
      if (response.status === 200) {
        // Remove the deleted event from the list
        setEvents(events.filter((event) => event.id !== id));
      } else {
        console.error("Event deletion failed");
      }
    } catch (err) {
      setError("Error deleting event.");
      console.error(err);
    }
  };

  return (
    <div className="event-page">
      <h1>Event List</h1>
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
              <div className="event-actions">
                <button onClick={() => handleDelete(event.id)} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

export default EventPage;
