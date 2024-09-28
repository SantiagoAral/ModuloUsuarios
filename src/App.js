import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/authContext";
import UserProfile from "./components/UserProfile";
import UserDAO from "./components/UserDAO";
import UserService from "./components/UserService";

function App() {
  return (
    <div className="bg-slate-300 text-black h-screen flex text-white">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/userdao" element={<UserDAO/>} />
          <Route path="/userprofile" element={<UserProfile/>} />
          <Route path="/userservice" element={<UserService/>} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
