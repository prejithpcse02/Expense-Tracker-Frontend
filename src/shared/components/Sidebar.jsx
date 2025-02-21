// Sidebar.jsx
import { Link, useLocation, useParams } from "react-router-dom";
import { Home, Banknote, History, Send, Plus, LogOut, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar({ onCloseMobile }) {
  const location = useLocation();
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://expense-tracker-backend-k1kb.onrender.com/api/auth/user/${userId}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const navLinks = [
    { path: ".", label: "Home", icon: <Home size={18} /> },
    {
      path: "history",
      label: "Transaction History",
      icon: <History size={18} />,
    },
    { path: "charts", label: "Charts", icon: <Banknote size={18} /> },
    { path: "reports", label: "Categories", icon: <Send size={18} /> },
    { path: "addExpense", label: "Add Expense", icon: <Plus size={18} /> },
  ];

  return (
    <nav className="w-[280px] h-full bg-white shadow-lg flex flex-col p-4 relative z-50">
      {/* Mobile Close Button */}
      <button
        onClick={onCloseMobile}
        className="lg:hidden absolute top-4 right-4"
      >
        <X size={24} />
      </button>

      {/* Logo Section */}
      <Link to="." className="flex items-center gap-2 mb-6 mt-2">
        <img src="/icons/Icon1.svg" alt="Logo" className="h-6 w-6" />
        <span className="text-2xl font-bold text-gray-800">
          Expense Tracker
        </span>
      </Link>

      {/* Search Input */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search"
          className="bg-gray-50 focus:border-2 focus:border-gray-50 text-gray-600"
        />
      </div>

      {/* Navigation Links */}
      <div className="space-y-2">
        {navLinks.map(({ path, label, icon }, index) => (
          <Link
            key={path}
            to={path}
            onClick={onCloseMobile}
            className={`flex items-center gap-3 p-2 rounded-lg transition ${
              location.pathname.includes(path) || index === 0
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100 border-2 border-gray-100"
            }`}
          >
            {icon}
            {label}
          </Link>
        ))}
      </div>

      {/* User Profile Section */}
      <div className="mt-auto flex items-center gap-3 p-2 border-t pt-4">
        <Avatar>
          <AvatarImage src="/images/user-avatar.png" />
          <AvatarFallback>{user?.name ? user.name[0] : "PP"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {user?.name || "Guest"}
          </p>
          <p className="text-xs text-gray-500">{user?.email || "No Email"}</p>
        </div>
        <LogOut
          className="ml-auto text-gray-500 cursor-pointer hover:text-gray-700"
          size={18}
          onClick={() => {
            document.cookie =
              "token=; expires=Thu, 01 Jan 2020 00:00:00 UTC; path=/;";
            window.location.href = "/login";
          }}
        />
      </div>
    </nav>
  );
}
