import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import PetDetail from "./components/PetDetail";
import SearchPets from "./components/SearchPets";
import AddPet from "./components/AddPet";
import EditPet from "./components/EditPet";
import Applications from "./components/Applications";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pet/:id" element={<PetDetail />} />
          <Route path="/search" element={<SearchPets />} />
          <Route path="/add-pet" element={<AddPet />} />
          <Route path="/edit-pet/:id" element={<EditPet />} />
          <Route path="/applications" element={<Applications />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
