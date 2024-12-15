// Booking_page.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import './Booking_page.css';

const BookingPage = () => {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookedEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/events");
        const booked = response.data.filter(event => event.status === "Booked");
        setBookedEvents(booked);
      } catch (err) {
        setError("Error fetching booked events.");
        console.error(err);
      }
    };
    fetchBookedEvents();
  }, []);

  return (
    <div className="booking-page">
      <h1>Booked Events</h1>
      {error && <p className="error">{error}</p>}

      <div className="event-container">
        {bookedEvents.length > 0 ? (
          bookedEvents.map(event => (
            <div className="event-card" key={event.id}>
              <h2 className="event-name">{event.event_name}</h2>
              <img 
                src={`http://localhost:5000${event.event_photo}`} 
                alt={event.event_name} 
                className="event-photo" 
              />
              <div className="event-details">
                <p><strong>Booked By:</strong> {event.booked_by}</p>
                <p><strong>Price:</strong> {event.price}</p>
                <p><strong>Duration:</strong> {event.duration}</p>
                <p><strong>Contact:</strong> {event.contact}</p>
                <p><strong>Details:</strong> {event.details}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No booked events found.</p>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
