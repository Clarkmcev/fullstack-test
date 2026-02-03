import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import EventFormPage from "./pages/EventFormPage";
import EventListPage from "./pages/EventListPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<EventFormPage />} />
          <Route path="/events" element={<EventListPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
