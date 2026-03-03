import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Jobs from "./pages/jobs";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
