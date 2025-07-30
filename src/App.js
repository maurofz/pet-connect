import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import PetDetail from "./components/PetDetail";
import SearchPets from "./components/SearchPets";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pet/:id" element={<PetDetail />} />
          <Route path="/search" element={<SearchPets />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
