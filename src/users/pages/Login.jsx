import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://expense-tracker-backend-k1kb.onrender.com/api/auth/login",
        formData
      );
      console.log("Login Response:", response.data);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate(`/dashboard/${response.data.user.id}/addExpense`);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed, please try again!!",
        {
          position: "top-center",
          autoClose: 2500,
        }
      );
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col  md:flex-row h-screen  bg-gray-950">
      <ToastContainer position="top-center" />
      <div className="w-full h-full md:w-2/3 bg-gray-950 text-white flex flex-col gap-6 md:gap-0 justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="flex gap-2 mb-6 md:mb-8">
            <img src="/icons/Icon1.svg" alt="Logo" className="w-8 h-8" />
            <span className="text-2xl font-semibold">Expense Tracker</span>
          </div>
          <h2 className="text-3xl font-semibold">Hi there,👋</h2>
          <p className="text-gray-400 mb-6">
            Get started with managing your expenses.
          </p>
          <Card className="bg-transparent border-none mt-6 md:mt-8">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-gray-300 text-sm">Email Address *</label>
                <div className="relative mt-1.5">
                  <Mail
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-gray-800 text-gray-300 border-gray-700 focus:border-2 focus:border-gray-600 placeholder:text-gray-600 focus:outline-none w-full"
                    placeholder="johndoe@gmail.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-gray-300 text-sm">Password *</label>
                <div className="relative mt-1.5">
                  <Lock
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-gray-800 text-gray-300 border-gray-700 focus:border-2 focus:border-gray-600 placeholder:text-gray-600 focus:outline-none w-full"
                    placeholder="Enter your Password"
                    required
                  />
                </div>
              </div>
              <Button
                onClick={handleLogin}
                className="w-full bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
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
                    Logging in...
                  </>
                ) : (
                  <>Get Started</>
                )}
              </Button>
            </CardContent>
          </Card>
          <div className="flex justify-center items-center mt-2">
            <span className="text-sm text-gray-400">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-700">
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>
      <div
        className="hidden md:block w-1/3 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/Login_cover.jpg')" }}
      ></div>
    </div>
  );
}
