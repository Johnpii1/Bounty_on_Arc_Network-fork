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

function App() {
  const [loading, setLoading] = useState(true);

  // Remember the user's theme after refresh
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);

    // Save the current theme
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        dark
          ? "bg-[#080908] text-white"
          : "bg-[#f6f5ef] text-[#111111]"
      }`}
    >
      {loading && (
        <LoadingScreen onComplete={() => setLoading(false)} />
      )}

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<LandingPage dark={dark} setDark={setDark} />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard dark={dark} setDark={setDark} />}
          />

          <Route
            path="/profile"
            element={<Profile dark={dark} setDark={setDark} />}
          />

          <Route
            path="/create"
            element={<Create dark={dark} setDark={setDark} />}
          />

          <Route
            path="/faqs"
            element={<FAQPage dark={dark} setDark={setDark} />}
          />

          <Route
            path="/whitepaper"
            element={<WhitepaperPage dark={dark} setDark={setDark} />}
          />

          <Route
            path="/contact"
            element={<ContactUs dark={dark} setDark={setDark} />}
          />

          <Route
            path="/setting"
            element={<Setting dark={dark} setDark={setDark} />}
          />

          <Route
            path="/task/:id"
            element={<BountyDetail dark={dark} setDark={setDark} />}
          />

          <Route
            path="/admin-224466"
            element={<Admin dark={dark} setDark={setDark} />}
          />

          <Route
            path="*"
            element={<h1>404 Not Found</h1>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;