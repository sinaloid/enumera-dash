import logo from "./logo.svg";
import "./App.css";
import Login from "./Login";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
