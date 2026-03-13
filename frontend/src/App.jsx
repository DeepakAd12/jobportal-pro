import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Jobs from "./pages/jobs";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Home from "./components/Home";
import JobDetails from "./components/JobDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
