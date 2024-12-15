import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginRegister from "./Components/LoginRegister/LoginRegister";
import ReadInfo from "./Components/ReadInfo/ReadInfo";
import UserPage from "./Components/UserPage/UserPage"; // Import UserPage
import AdminPage from "./Components/AdminPage/AdminPage"; // Import AdminPage
import UploadPage from "./Components/AdminPage/UploadPage"; // Import UploadPage
import EventsPage from "./Components/AdminPage/EventsPage"; // Import EventsPage
import BookingPage from "./Components/AdminPage/BookingPage"; // Import EventsPage

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/register" element={<ReadInfo />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminPage />}>
            <Route path="upload" element={<UploadPage />} /> {/* Nested route for Upload */}
            <Route path="events" element={<EventsPage />} /> {/* Nested route for Events */}
            <Route path="booked" element={<BookingPage />} /> {/* Nested route for Events */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
