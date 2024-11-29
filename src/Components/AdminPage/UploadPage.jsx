import React, { useState } from 'react';
import axios from 'axios';
import './upload_page.css'; // Optional: Add your own CSS styling for the page

const UploadPage = () => {
  const [eventName, setEventName] = useState('');
  const [eventPhoto, setEventPhoto] = useState(null);
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [contact, setContact] = useState('');
  const [Details, setDetails] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('eventName', eventName);
    formData.append('eventPhoto', eventPhoto);
    formData.append('price', price);
    formData.append('duration', duration);
    formData.append('contact', contact);
    formData.append('Details', Details);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file upload
        },
      });

      if (response.status === 200) {
        setSuccess('Event uploaded successfully!');
        setEventName('');
        setEventPhoto(null);
        setPrice('');
        setDuration('');
        setContact('');
        setDetails('');
      } else {
        setError('Error uploading event');
      }
    } catch (err) {
      setError('Error uploading event. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="upload-page">
      <h1>Upload Event</h1>
      <form onSubmit={handleSubmit}>
        {/* Event Name */}
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>

        {/* Event Photo */}
        <div className="form-group">
          <label>Event Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEventPhoto(e.target.files[0])}
            required
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <label>Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* Duration */}
        <div className="form-group">
          <label>Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        {/* Contact  */}
        <div className="form-group">
          <label>Contact</label>
          <textarea
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        {/* Details */}
        <div className="form-group">
          <label>Details</label>
          <textarea
            value={Details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Upload Event</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default UploadPage;
