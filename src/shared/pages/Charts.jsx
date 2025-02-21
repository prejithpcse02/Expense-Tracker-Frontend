import { useState, useEffect } from "react";
import API from "../../utils/api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Loader2 } from "lucide-react";

const Charts = () => {
  const [expenses, setExpenses] = useState([]);
  const [timeframe, setTimeframe] = useState("daily");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      processChartData();
    }
  }, [expenses, timeframe]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await API.get("/expenses");
      const onlyExpenses = response.data.filter(
        (trx) => trx.type === "expense"
      );
      setExpenses(onlyExpenses);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to load expenses. Please try again later.");
      setLoading(false);
    }
  };

  const processChartData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredData = [];
    let dateFormat = {};

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

    switch (timeframe) {
      case "daily":
        filteredData = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate.toDateString() === today.toDateString();
        });
        dateFormat = { hour: "2-digit", minute: "2-digit" };
        break;

      case "monthly":
        filteredData = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= firstDayOfMonth && expenseDate <= today;
        });
        dateFormat = { day: "2-digit", month: "short" };
        break;

      case "yearly":
        filteredData = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= firstDayOfYear && expenseDate <= today;
        });
        dateFormat = { month: "short" };
        break;

      default:
        break;
    }

    const groupedData = filteredData.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const dateKey = date.toLocaleString("en-GB", dateFormat);
      acc[dateKey] = (acc[dateKey] || 0) + expense.amount;
      return acc;
    }, {});

    const sortedDates = Object.keys(groupedData).sort((a, b) => {
      return (
        new Date(a.split(" ").reverse().join(" ")) -
        new Date(b.split(" ").reverse().join(" "))
      );
    });

    setChartData({
      labels: sortedDates,
      datasets: [
        {
          label: "Expenses",
          data: sortedDates.map((date) => groupedData[date]),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          tension: 0.4,
          fill: true,
          pointStyle: "circle",
          pointRadius: window.innerWidth < 768 ? 2 : 4,
          borderWidth: window.innerWidth < 768 ? 2 : 3,
        },
      ],
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.parsed.y.toFixed(2)}`,
        },
        padding: window.innerWidth < 768 ? 8 : 12,
        titleFont: {
          size: window.innerWidth < 768 ? 12 : 14,
        },
        bodyFont: {
          size: window.innerWidth < 768 ? 11 : 13,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          padding: window.innerWidth < 768 ? 5 : 10,
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
          padding: window.innerWidth < 768 ? 5 : 10,
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2 sm:p-4">
      <Card className="w-full h-full">
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Expense History
              </h2>
            </div>

            <div className="flex w-full sm:w-auto gap-1 sm:gap-2">
              {["daily", "monthly", "yearly"].map((period) => (
                <Button
                  key={period}
                  variant={timeframe === period ? "default" : "outline"}
                  onClick={() => setTimeframe(period)}
                  className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10 capitalize"
                >
                  {period === "daily"
                    ? "Today"
                    : period === "monthly"
                    ? "This Month"
                    : "This Year"}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-2 sm:p-6 sm:mt-20 mt-32">
          {loading ? (
            <div className="flex justify-center items-center h-[300px] sm:h-[400px]">
              <Loader2 className="animate-spin text-gray-500 h-6 w-6 sm:h-8 sm:w-8" />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-[300px] sm:h-[400px]">
              <p className="text-red-500 text-sm sm:text-base text-center px-4">
                {error}
              </p>
            </div>
          ) : chartData.labels.length === 0 ? (
            <div className="flex justify-center items-center h-[300px] sm:h-[400px]">
              <p className="text-gray-500 text-sm sm:text-base text-center px-4">
                No expenses recorded for this timeframe.
              </p>
            </div>
          ) : (
            <div className="relative h-[300px] sm:h-[400px] w-full">
              <Line
                data={chartData}
                options={chartOptions}
                className="max-w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
