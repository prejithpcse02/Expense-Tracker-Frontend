import { Progress } from "@/components/ui/progress"; // ✅ Import ShadCN Progress Bar
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";

export default function RightSidebar({ totalExpenditure }) {
  const [date, setDate] = useState(new Date());
  const maxThreshold = 15000; // ✅ Maximum spending limit
  const progress = Math.min((totalExpenditure / maxThreshold) * 100, 100); // ✅ Calculate percentage (capped at 100)

  return (
    <div className="w-[20%] bg-blue-100 flex flex-col p-4">
      {/* 🔹 Progress Tracker Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-sm font-medium text-gray-600">Expense Tracker</h3>
        <p className="text-lg font-semibold text-gray-800">
          ₹{totalExpenditure.toLocaleString()} / ₹{maxThreshold}
        </p>

        {/* 🔹 Progress Bar */}
        <Progress
          value={progress}
          className="h-3 mt-2 bg-gray-200 rounded-lg"
          indicatorClassName={`h-full rounded-lg transition-all duration-500 ${
            progress < 50
              ? "bg-green-500"
              : progress < 80
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        />
        <p className="text-sm text-gray-600 mt-1">
          {progress.toFixed(1)}% Spent
        </p>
      </div>
      {/* 🔹 Calendar Section (at the bottom) */}
      <div className="flex-grow"></div> {/* Pushes Calendar to Bottom */}
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border mt-auto w-40 h-40"
        classNames={{
          day_selected: "bg-blue-200 text-blue-900 font-bold rounded-full", // ✅ Light Blue Selected Date
          day_today: "border border-blue-500 font-bold", // ✅ Today's Date Highlight
          day: "hover:bg-gray-100 rounded-full transition",
        }}
      />
    </div>
  );
}
