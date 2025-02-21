import { useState } from "react";
import API from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaTag,
  FaCalendar,
  FaFileAlt,
  FaExchangeAlt,
} from "react-icons/fa";
import { Wallet, BookOpenCheck } from "lucide-react";

const AddExpense = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("");
  const [type, setType] = useState("expense");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  const categories = [
    "Food",
    "Bills",
    "Transport",
    "Healthcare",
    "Personal",
    "Other",
  ];

  const paymentModes = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "UPI",
    "Bank Transfer",
  ];

  const transactionTypes = ["income", "expense"];

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/expenses", {
        category,
        amount,
        mode,
        type,
        desc,
      });
      toast.success("Added successful👍", {
        position: "top-center",
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate(`/dashboard/${userId}`);
      }, 1500);
      setCategory("");
      setAmount("");
      setMode("");
      setType("expense");
      setDesc("");
    } catch (error) {
      toast.error("Error adding transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <ToastContainer position="top-center" />

      {/* Form Section - Full width on mobile, 50% on desktop */}
      <div className="w-full lg:w-1/2 p-4 lg:p-8">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8 flex items-center gap-2">
          <BookOpenCheck className="w-6 h-6 lg:w-7 lg:h-7 pt-1 text-blue-600" />
          Add Transaction
        </h1>

        <form onSubmit={handleSaveExpense} className="max-w-md mx-auto lg:mx-0">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              <FaExchangeAlt className="inline mr-2" />
              Transaction Type
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              {transactionTypes.map((transType) => (
                <option key={transType} value={transType}>
                  {transType.charAt(0).toUpperCase() + transType.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              <FaTag className="inline mr-2" />
              Category
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              <FaMoneyBillWave className="inline mr-2" />
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input
                type="number"
                className="w-full px-3 py-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              <FaShoppingCart className="inline mr-2" />
              Payment Mode
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              required
            >
              <option value="">Select Payment Mode</option>
              {paymentModes.map((paymentMode) => (
                <option key={paymentMode} value={paymentMode}>
                  {paymentMode}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              <FaFileAlt className="inline mr-2" />
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows="2"
            />
          </div>

          <button
            type="submit"
            className={`w-full cursor-pointer py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-white ${
              type === "income"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FaMoneyBillWave className="text-xl" />
                {type === "income" ? "Add Income" : "Add Expense"}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Image Section - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:flex w-1/2 justify-center items-center">
        <img
          src="/images/Add_Exp1.png"
          alt="Expense"
          className="w-[80%] h-auto"
        />
      </div>
    </div>
  );
};

export default AddExpense;
