import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./pages/auth/Login";
import GetOtp from "./pages/auth/GetOtp";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path='/mot-de-passe-oublie' element={ <GetOtp />} />
      <Route path='/modification-du-mot-de-passe' element={ <ResetPassword />} />

    </Routes>
  );
}

export default App;
