import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Settings,
  MoreVertical,
  ShoppingBag,
} from "lucide-react";
import API from "../../utils/api";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch"; // ✅ Import ShadCN Toggle Switch
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from "@emailjs/browser";

const Home = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [allTrx, setAllTrx] = useState([]);
  const [date, setDate] = useState(new Date());
  const EXPENSE_THRESHOLD = 15000;
  const [maxThreshold, setMaxThreshold] = useState(15000); // ✅ Default threshold
  const [alertEnabled, setAlertEnabled] = useState(false); // ✅ Alert toggle state
  const [editingThreshold, setEditingThreshold] = useState(false); // ✅ Editing mode
  const [newThreshold, setNewThreshold] = useState(maxThreshold);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://expense-tracker-backend-k1kb.onrender.com/api/auth/user/${userId}`
        );
        setUser(response.data);
        setMaxThreshold(response.data.maxThreshold);
        setAlertEnabled(response.data.alertEnabled);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  useEffect(() => {
    fetchTrx();
    fetchRecentExpenses();
  }, []);
  useEffect(() => {
    checkAlert();
  }, [totalExpenditure, maxThreshold]);

  const sendEmailFn = async (totalExpense, percentage) => {
    try {
      const templateParams = {
        to_name: user?.name,
        to_email: user?.email,
        total_expense: totalExpense.toLocaleString(),
        threshold: maxThreshold.toLocaleString(),
        percentage: percentage.toFixed(1),
      };

      const response = await emailjs.send(
        import.meta.env.VITE_PROCESS_ID, // Your service ID
        import.meta.env.VITE_TEMPLATE_ID, // Your template ID
        templateParams,
        import.meta.VITE_PUBLIC_ID // Your public key
      );
      console.log("Email response: ", response);

      if (response.status === 200) {
        toast.warning(
          `Alert: You have used ${percentage.toFixed(
            1
          )}% of your monthly expense limit!`,
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
        console.log("Email sent successfully!");
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("Failed to send alert email");
    }
  };

  const fetchTrx = async () => {
    try {
      const response = await API.get(`/expenses`);
      setAllTrx(response.data);
      let totalExp = 0;
      let totalInc = 0;
      const catTotals = {};

      response.data.forEach((expense) => {
        if (expense.type === "expense") {
          totalExp += expense.amount;
          if (!catTotals[expense.category]) {
            catTotals[expense.category] = 0;
          }
          catTotals[expense.category] += expense.amount;
        } else {
          totalInc += expense.amount;
        }
      });
      setTotalIncome(totalInc);
      setTotalExpenditure(totalExp);
      setCategoryTotals(catTotals);
      setNetBalance(totalInc - totalExp);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const checkAlert = async () => {
    if (user && alertEnabled) {
      const expensePercentage = (totalExpenditure / maxThreshold) * 100;
      console.log("Expense percentage:", expensePercentage);

      if (expensePercentage >= 90) {
        console.log("Threshold exceeded, sending alert...");
        await sendEmailFn(totalExpenditure, expensePercentage);
      }
    }
  };

  const fetchRecentExpenses = async () => {
    try {
      const res = await API.get(`/expenses?limit=4`);
      setRecentExpenses(res.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#60A8FB",
          "#BEDCFE",
          "#90C7FE",
          "#008E97",
          "#3B86F7",
          "#60A8FB",
          "#6366F1",
          "#14B8A6",
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  const expensePercentage = Math.min(
    (totalExpenditure / EXPENSE_THRESHOLD) * 100,
    100
  );
  //const progressBarColor =
  expensePercentage >= 90
    ? "bg-red-500"
    : expensePercentage >= 75
    ? "bg-orange-500"
    : "bg-blue-500";

  const progress = Math.min((totalExpenditure / maxThreshold) * 100, 100); // ✅ Expense Progress
  const progressBarColor =
    progress >= 90
      ? "bg-red-500"
      : progress >= 75
      ? "bg-orange-500"
      : "bg-blue-500";

  // ✅ Function to Update Max Threshold in Backend
  const handleUpdateThreshold = async () => {
    try {
      await API.put(`/auth/user/${userId}`, { maxThreshold: newThreshold });
      setMaxThreshold(newThreshold);
      setEditingThreshold(false);
      toast.success("Threshold updated successfully!", { autoClose: 1500 });
    } catch (error) {
      console.error("Error updating threshold:", error);
    }
  };

  // ✅ Toggle Alert Status in Backend
  const handleToggleAlert = async () => {
    try {
      const updatedStatus = !alertEnabled;
      await API.put(`/auth/user/${userId}`, { alertEnabled: updatedStatus });
      setAlertEnabled(updatedStatus);
      toast.info(`Alerts ${updatedStatus ? "Enabled" : "Disabled"}`, {
        autoClose: 1500,
      });
    } catch (error) {
      console.error("Error toggling alert:", error);
    }
  };

  const getTopCategories = () => {
    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: ((amount / totalExpenditure) * 100).toFixed(1),
        remaining: maxThreshold * (amount / totalExpenditure),
      }));
    return sortedCategories;
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "subscriptions":
        return <Monitor className="w-4 h-4 text-blue-500" />;
      case "food":
        return <ShoppingBag className="w-4 h-4 text-pink-500" />;
      case "savings":
        return <Banknote className="w-4 h-4 text-green-500" />;
      default:
        return <Wallet className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "subscriptions":
        return "bg-blue-500";
      case "food":
        return "bg-pink-500";
      case "savings":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="flex flex-col lg:flex-row min-h-screen">
      <ToastContainer position="top-center" />

      {/* Main Content */}
      <div className="w-full lg:w-[80%] bg-white flex flex-col border-l-2 border-l-gray-100 px-3 sm:px-6">
        {/* Header */}
        <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mt-4">
          Welcome,{" "}
          <span className="text-blue-600">{user?.name ? user.name : "PP"}</span>
        </h2>
        <p className="text-[#475467b2] text-sm sm:text-md">
          Access & manage your expenses and transactions efficiently.
        </p>

        {/* Expenditure Overview Section */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          {/* Total Expenditures Card */}
          <div className="w-full sm:w-[46%] flex flex-col gap-2">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 sm:p-6 border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-red-700 font-medium">Total Expenditures</h3>
                <ArrowDownCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                ₹{totalExpenditure.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">This Month</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-emerald-100">
              <div className="flex items-center justify-between">
                <h3 className="text-emerald-700 font-medium">Total Income</h3>
                <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                ₹{totalIncome.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">This Month</p>
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm w-full sm:w-[50%]">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Category Wise Distribution
            </h3>
            <div className="h-[180px]">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Mobile Alert Progress - Only visible on mobile */}
        <div className="block lg:hidden mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-blue-600 font-medium">Monthly Expense Limit</h3>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="text-xl font-bold">₹{totalExpenditure}</span>
                <span className="text-sm text-gray-500">
                  of ₹{maxThreshold.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-center items-center">
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-lg ${
                    progress >= 90
                      ? "bg-red-100 text-red-700"
                      : progress >= 75
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {progress.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-gray-100 rounded-full mt-2">
              <div
                className={`absolute top-0 left-0 h-full ${progressBarColor} rounded-full`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Alert Toggle & Update */}
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Enable Alerts</span>
                <Switch
                  checked={alertEnabled}
                  onCheckedChange={handleToggleAlert}
                />
              </div>

              {editingThreshold ? (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(Number(e.target.value))}
                    className="w-full"
                  />
                  <Button
                    onClick={handleUpdateThreshold}
                    className="bg-blue-500 text-white"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setEditingThreshold(true)}
                  className="w-full bg-blue-600 text-white"
                >
                  <Settings size={16} />
                  Edit Limit
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-white shadow-md rounded-lg border-2 border-gray-200 p-4 mt-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <Link to="history" className="text-sm text-blue-600">
              View All
            </Link>
          </div>

          {recentExpenses.length === 0 ? (
            <p className="text-gray-500">No recent transactions found.</p>
          ) : (
            <div className="hidden md:block divide-y divide-gray-100">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-6 py-3 px-4 text-sm font-medium text-gray-500">
                <div>ID</div>
                <div>Amount</div>
                <div>Time</div>
                <div>Date</div>
                <div>Category</div>
                <div>Mode</div>
              </div>

              {/* Transactions */}
              {recentExpenses.map((expense) => {
                const expenseDate = new Date(expense.date);
                const formattedTime = expenseDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });
                const formattedDate = expenseDate.toLocaleDateString("en-GB");
                const isIncome = expense.type === "income";

                return (
                  <div
                    key={expense._id}
                    className="flex flex-col sm:grid sm:grid-cols-6 py-4 px-4 gap-2 sm:gap-0 sm:items-center hover:bg-gray-50 text-gray-900"
                  >
                    <div className="text-gray-600 text-sm font-mono">
                      {expense._id.slice(-6)}
                    </div>
                    <div
                      className={`font-medium ${
                        isIncome ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"} ₹
                      {Math.abs(expense.amount).toFixed(2)}
                    </div>
                    <div className="text-gray-500 text-sm">{formattedTime}</div>
                    <div className="text-gray-500 text-sm">{formattedDate}</div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          expense.category === "Food"
                            ? "bg-green-100 text-green-800"
                            : expense.category === "Bills"
                            ? "bg-blue-100 text-blue-800"
                            : expense.category === "Transport"
                            ? "bg-orange-100 text-orange-800"
                            : expense.category === "Healthcare"
                            ? "bg-red-100 text-red-800"
                            : expense.category === "Personal"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {expense.category}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">{expense.mode}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex w-[20%] bg-blue-50 flex-col justify-between items-center">
        {/* Expense Threshold Tracker */}
        <div className="bg-white rounded-xl p-4 w-[90%] shadow mt-4">
          <h3 className="text-blue-600 font-medium">Monthly Expense Limit</h3>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">₹{totalExpenditure}</span>
              <span className="text-sm text-gray-500">
                of ₹{maxThreshold.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-center items-center">
              <span
                className={`text-sm font-medium px-2 py-1 rounded-lg ${
                  progress >= 90
                    ? "bg-red-100 text-red-700"
                    : progress >= 75
                    ? "bg-orange-100 text-orange-700"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {progress.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-gray-100 rounded-full mt-2">
            <div
              className={`absolute top-0 left-0 h-full ${progressBarColor} rounded-full`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Alert Toggle & Update */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Enable Alerts</span>
              <Switch
                checked={alertEnabled}
                onCheckedChange={handleToggleAlert}
              />
            </div>

            {editingThreshold ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(Number(e.target.value))}
                  className="w-full"
                />
                <Button
                  onClick={handleUpdateThreshold}
                  className="bg-blue-500 text-white"
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setEditingThreshold(true)}
                className="w-full bg-blue-600 text-white"
              >
                <Settings size={16} />
                Edit Limit
              </Button>
            )}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl p-4 w-[90%] shadow mt-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-blue-600 font-medium">Top Categories</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {getTopCategories().map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg ${
                        category.category === "Food"
                          ? "bg-green-100 text-green-800"
                          : category.category === "Bills"
                          ? "bg-blue-100 text-blue-800"
                          : category.category === "Transport"
                          ? "bg-orange-100 text-orange-800"
                          : category.category === "Healthcare"
                          ? "bg-red-100 text-red-800"
                          : category.category === "Personal"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {getCategoryIcon(category.category)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {category.category}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {category.percentage}%
                  </span>
                </div>
                <div className="relative w-full h-1.5 bg-gray-100 rounded-full">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full ${getCategoryColor(
                      category.category
                    )}`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar - Hidden on mobile */}
        <div className="w-[100%]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md shadow text-blue-600"
            classNames={{
              day_selected: "bg-blue-400 rounded-full",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
