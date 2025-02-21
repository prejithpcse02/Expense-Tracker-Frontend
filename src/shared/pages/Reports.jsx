import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Search,
  Coffee,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Plane,
  Smartphone,
  Gift,
  Heart,
  BookOpen,
  Dumbbell,
} from "lucide-react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import API from "../../utils/api";

const categoryIcons = {
  Food: Utensils,
  Shopping: ShoppingCart,
  Salary: Wallet,
  Rent: Home,
  Transport: Car,
  Entertainment: Coffee,
  Healthcare: Heart,
  Travel: Plane,
  Education: BookOpen,
  Fitness: Dumbbell,
  Technology: Smartphone,
  Gifts: Gift,
};

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryTotals, setCategoryTotals] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await API.get("/expenses");
      setTransactions(response.data);
      setFilteredTransactions(response.data);
      calculateTotals(response.data);
      calculateCategoryTotals(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (transactions) => {
    let expenseTotal = 0;
    let incomeTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        expenseTotal += transaction.amount;
      } else {
        incomeTotal += transaction.amount;
      }
    });
    setTotalExpense(expenseTotal);
    setTotalIncome(incomeTotal);
    setNetBalance(incomeTotal - expenseTotal);
  };

  const calculateCategoryTotals = (transactions) => {
    const totals = {};
    transactions.forEach((transaction) => {
      if (!totals[transaction.category]) {
        totals[transaction.category] = 0;
      }
      totals[transaction.category] += transaction.amount;
    });
    setCategoryTotals(totals);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = transactions.filter((transaction) =>
      transaction.category.toLowerCase().includes(value)
    );
    setFilteredTransactions(filtered);
  };

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Total by Category",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#10B981",
          "#3B82F6",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#EC4899",
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
    responsive: true,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
          {/* Header */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-2">
            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
            Financial Dashboard
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Income Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-emerald-100">
              <div className="flex items-center justify-between">
                <h3 className="text-emerald-700 text-sm sm:text-base font-medium">
                  Total Income
                </h3>
                <ArrowUpCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-2">
                ₹{totalIncome.toLocaleString()}
              </p>
            </div>

            {/* Expense Card */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 sm:p-6 border border-red-100">
              <div className="flex items-center justify-between">
                <h3 className="text-red-700 text-sm sm:text-base font-medium">
                  Total Expense
                </h3>
                <ArrowDownCircle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-2">
                ₹{totalExpense.toLocaleString()}
              </p>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100 sm:col-span-2 md:col-span-1">
              <div className="flex items-center justify-between">
                <h3 className="text-blue-700 text-sm sm:text-base font-medium">
                  Net Balance
                </h3>
                <Wallet className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-2">
                ₹{netBalance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6 sm:mb-8">
            <input
              type="text"
              placeholder="Search by category..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-2 sm:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>

          {/* Charts and Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Pie Chart */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Transaction Distribution
              </h3>
              <div className="h-[250px] sm:h-[300px]">
                <Pie data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Categories Breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Categories Breakdown
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {Object.keys(categoryTotals).map((category, index) => {
                  const Icon = categoryIcons[category] || Wallet;
                  const colors = [
                    "bg-green-100 text-green-700",
                    "bg-blue-100 text-blue-700",
                    "bg-yellow-100 text-yellow-700",
                    "bg-red-100 text-red-700",
                    "bg-purple-100 text-purple-700",
                    "bg-pink-100 text-pink-700",
                    "bg-indigo-100 text-indigo-700",
                    "bg-teal-100 text-teal-700",
                  ];
                  const bgColor = colors[index % colors.length];

                  return (
                    <div
                      key={category}
                      className={`flex items-center p-3 sm:p-4 rounded-lg ${bgColor} shadow-sm`}
                    >
                      <div className="p-2 bg-white rounded-full">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm sm:text-md font-medium">
                          {category}
                        </h4>
                        <p className="text-base sm:text-lg font-semibold">
                          ₹{categoryTotals[category].toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
