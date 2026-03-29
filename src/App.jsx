import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Welcome from "./components/Welcome/Welcome"   // ✅ أضفها
import Home from "./Pages/Home/Home"
import Register from "./components/Register/Register"
import Login from "./components/Login/Login"
import BeWorker from "./Pages/Beworker/Beworker"
import Profile from "./Pages/Profile/Profile"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/beworker" element={<BeWorker />} />
        <Route path="/profile" element={<Profile />} />
<Route path="*" element={<Navigate to="/welcome" replace />} />      </Routes>
    </BrowserRouter>
  )
}
export default App
