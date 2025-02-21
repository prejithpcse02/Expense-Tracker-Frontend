import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-center",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://expense-tracker-backend-k1kb.onrender.com/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status === 201) {
        toast.success("Registration successful! Redirecting to login...", {
          autoClose: 1500,
        });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen  bg-gray-950">
      <ToastContainer position="top-center" />

      <div className="w-full h-full md:w-2/3 bg-gray-950 text-white flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="flex gap-2 mb-6">
            <img src="/icons/Icon1.svg" alt="Logo" className="w-8 h-8" />
            <span className="text-2xl font-semibold">Expense Tracker</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold">Sign up</h2>
          <p className="text-gray-400 mb-4 md:mb-6">
            Please enter your details.
          </p>

          <Card className="bg-transparent border-none mt-4 md:mt-8">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-gray-300 text-sm">Full Name *</label>
                <div className="relative mt-1.5">
                  <User
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 bg-gray-800 text-gray-300 border-gray-700 placeholder:text-gray-600 focus:outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
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
                    className="pl-10 bg-gray-800 text-gray-300 border-gray-700 placeholder:text-gray-600 focus:outline-none"
                    placeholder="johndoe@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
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
                    className="pl-10 bg-gray-800 text-gray-300 border-gray-700 placeholder:text-gray-600 focus:outline-none"
                    placeholder="Enter your Password"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label className="text-gray-300 text-sm">
                  Confirm Password *
                </label>
                <div className="relative mt-1.5">
                  <Lock
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={18}
                  />
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 bg-gray-800 text-gray-300 border-gray-700 placeholder:text-gray-600 focus:outline-none"
                    placeholder="Re-enter Password"
                    required
                  />
                </div>
              </div>

              <Button
                onClick={handleRegister}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                disabled={loading}
              >
                {loading ? "Registering..." : "Get Started"}
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-3">
            <span className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-700">
                Login
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
