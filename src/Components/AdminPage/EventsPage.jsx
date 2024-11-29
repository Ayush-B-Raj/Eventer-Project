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
        setEvents(events.filter(event => event.id !== id));
      } else {
        console.error('Event deletion failed');
      }
    } catch (err) {
      setError('Error deleting event.');
      console.error(err);
    }
  };
  return (
    <div className="event-page">
      <h1>Event List</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Contact</th>
            <th>Details</th>
            <th>Event Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.id}>
                <td>{event.event_name}</td>
                <td>{event.price}</td>
                <td>{event.duration}</td>
                <td>{event.contact}</td>
                <td>{event.details}</td>
                <td>
                  <img
                    src={`http://localhost:5000${event.event_photo}`}
                    alt={event.event_name}
                    width="100"
                  />
                </td>
                <td>
                  <button onClick={() => handleDelete(event.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No events found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventPage;
