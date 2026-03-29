import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Welcome from "./components/Welcome/Welcome"
import Home from "./Pages/Home/Home"
import Register from "./components/Register/Register"
import Login from "./components/Login/Login"
import BeWorker from "./Pages/Beworker/Beworker"
import Profile from "./Pages/Profile/Profile"

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "Cairo, sans-serif",
            direction: "rtl",
            borderRadius: "12px",
            padding: "12px 20px",
            fontSize: "14px",
          },
          success: {
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            },
            iconTheme: { primary: "#16a34a", secondary: "#f0fdf4" },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
            },
            iconTheme: { primary: "#dc2626", secondary: "#fef2f2" },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/beworker" element={<BeWorker />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App