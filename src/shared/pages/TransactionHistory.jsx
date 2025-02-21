import { useState, useEffect } from "react";
import API from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookOpenCheck } from "lucide-react";

const TransactionHistory = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await API.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setUpdatedCategory(expense.category);
    setUpdatedAmount(expense.amount);
  };

  const handleUpdateExpense = async (id) => {
    setLoading(true);
    try {
      await API.put(`/expenses/${id}`, {
        category: updatedCategory,
        amount: updatedAmount,
      });
      toast.success("Transaction updated successfully");
      fetchExpenses();
      setEditingExpense(null);
    } catch (error) {
      toast.error("Error updating transaction.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await API.delete(`/expenses/${id}`);
        toast.success("Transaction deleted successfully");
        fetchExpenses();
      } catch (error) {
        toast.error("Error deleting transaction.");
      }
    }
  };

  const categories = {
    Food: "bg-green-100 text-green-800",
    Bills: "bg-blue-100 text-blue-800",
    Transport: "bg-orange-100 text-orange-800",
    Healthcare: "bg-red-100 text-red-800",
    Personal: "bg-purple-100 text-purple-800",
    Other: "bg-gray-100 text-gray-800",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-8">
      <ToastContainer position="top-center" />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
        <div className="p-3 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            Transaction History
          </h2>

          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No transactions found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {/* Desktop Table Header */}
              <div className="hidden sm:grid grid-cols-7 py-3 px-4 text-sm font-medium text-gray-500 bg-gray-50 rounded-t-lg">
                <div>ID</div>
                <div>Amount</div>
                <div>Time</div>
                <div>Date</div>
                <div>Category</div>
                <div>Mode</div>
                <div>Actions</div>
              </div>

              {/* Transactions List */}
              {expenses.map((expense) => {
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
                    className="flex flex-col sm:grid sm:grid-cols-7 py-4 px-4 items-start sm:items-center hover:bg-gray-50 text-gray-900 border-b sm:border-none"
                  >
                    {/* Mobile Layout - Top Row */}
                    <div className="flex justify-between w-full mb-2 sm:hidden">
                      <span className="text-gray-600 text-sm font-mono">
                        #{expense._id.slice(-6)}
                      </span>
                      <div
                        className={`font-medium ${
                          isIncome ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isIncome ? "+" : "-"} ₹
                        {Math.abs(expense.amount).toFixed(2)}
                      </div>
                    </div>

                    {/* Desktop Layout - ID & Amount */}
                    <div className="hidden sm:block text-gray-600 text-sm font-mono">
                      {expense._id.slice(-6)}
                    </div>
                    <div
                      className={`hidden sm:block font-medium ${
                        isIncome ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"} ₹
                      {Math.abs(expense.amount).toFixed(2)}
                    </div>

                    {/* Mobile Layout - Time & Date */}
                    <div className="flex gap-2 text-sm text-gray-500 mb-2 sm:hidden">
                      <span>{formattedTime}</span>
                      <span>•</span>
                      <span>{formattedDate}</span>
                    </div>

                    {/* Desktop Layout - Time & Date */}
                    <div className="hidden sm:block text-gray-500 text-sm">
                      {formattedTime}
                    </div>
                    <div className="hidden sm:block text-gray-500 text-sm">
                      {formattedDate}
                    </div>

                    {/* Mobile Layout - Category & Mode */}
                    <div className="flex justify-between w-full mb-2 sm:hidden">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          categories[expense.category]
                        }`}
                      >
                        {expense.category}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {expense.mode}
                      </span>
                    </div>

                    {/* Desktop Layout - Category & Mode */}
                    <div className="hidden sm:block">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          categories[expense.category]
                        }`}
                      >
                        {expense.category}
                      </span>
                    </div>
                    <div className="hidden sm:block text-gray-600 text-sm">
                      {expense.mode}
                    </div>

                    {/* Actions - Both Mobile & Desktop */}
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Edit Modal */}
          {editingExpense && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-[90%] sm:w-96 mx-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Edit Transaction
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={updatedCategory}
                      onChange={(e) => setUpdatedCategory(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={updatedAmount}
                      onChange={(e) => setUpdatedAmount(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setEditingExpense(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateExpense(editingExpense._id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
