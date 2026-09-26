import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import BountyDetail from "./pages/BountyDetail";
import Admin from "./pages/Admin";
import FAQPage from "./pages/Faqs";
import WhitepaperPage from "./pages/WhitePaper";
import ContactUs from "./pages/ContactUs";
import Setting from "./pages/Setting";

import LoadingScreen from "./components/LoadingScreen";
import { useTheme } from "./context/ThemeContext";

function App() {
  const [loading, setLoading] = useState(true);
  const { dark } = useTheme();

  // Safety: ensure the "dark" class stays in sync with context
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark ? "bg-[#080908] text-white" : "bg-[#f6f5ef] text-[#111111]"
      }`}
    >
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<Create />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/whitepaper" element={<WhitepaperPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/bounty/:id" element={<BountyDetail />} />
          <Route path="/admin-224466" element={<Admin />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;