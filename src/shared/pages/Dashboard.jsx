// Dashboard.jsx
import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

import { Menu } from "lucide-react"; // Import hamburger icon
import { useState } from "react";

export default function Dashboard() {
  const { userId } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-white text-black">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 flex items-center px-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2"
        >
          <Menu size={24} />
        </button>
        <div className="flex gap-2 justify-center items-center">
          <img src="/icons/Icon1.svg" alt="Logo" className="h-6 w-6" />
          <span className="text-2xl font-bold text-gray-800">
            Expense Tracker
          </span>
        </div>
      </div>

      {/* Sidebar - Hidden on mobile by default */}
      <div
        className={`${
          isMobileMenuOpen ? "fixed inset-0 z-50" : "hidden"
        } lg:block lg:relative`}
      >
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area - Adjusted for mobile header */}
      <div className="flex-1 overflow-auto lg:pt-0 pt-16">
        <Outlet />
      </div>
    </div>
  );
}
