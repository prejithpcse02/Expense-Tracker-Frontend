import React from "react";
import {
  ArrowRight,
  ChevronRight,
  LineChart,
  PieChart,
  Bell,
  Wallet,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0F15] relative overflow-hidden">
      {/* Main Content Container */}
      <div className="container mx-auto h-screen flex items-center relative z-10">
        {/* Left Content */}
        <div className="w-full lg:w-[60%] space-y-8 p-6 lg:p-10">
          <div className="inline-flex items-center space-x-2 bg-[#1A1F25] rounded-full px-4 py-2 border border-[#2A2F35]">
            <Wallet className="h-5 w-5 text-emerald-400" />
            <span className="text-gray-300 text-sm">
              Smart Expense Tracking
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Track expenses with
              <span className="text-emerald-400 block">
                intelligent insights
              </span>
            </h1>

            <p className="text-gray-400 text-base lg:text-lg max-w-xl">
              Get complete control over your expenses with real-time tracking,
              smart analytics, and automated insights to help you make better
              financial decisions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/login"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-medium rounded-xl flex items-center justify-center transform hover:scale-105 transition-all duration-200"
            >
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 pt-6">
            {[
              {
                icon: <LineChart className="h-4 w-4" />,
                text: "Real-time Analytics",
              },
              { icon: <Bell className="h-4 w-4" />, text: "Smart Alerts" },
              {
                icon: <PieChart className="h-4 w-4" />,
                text: "Budget Planning",
              },
              { icon: <Shield className="h-4 w-4" />, text: "Secure Data" },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-[#1A1F25] rounded-full px-4 py-2 border border-[#2A2F35]"
              >
                <span className="text-emerald-400">{feature.icon}</span>
                <span className="text-gray-400 text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image Section - Hidden on mobile, visible on large screens */}
        <div className="hidden lg:block absolute top-1/2 -right-1/4 transform -translate-y-1/2 w-2/3 h-3/4 z-0">
          <div className="relative w-full h-full">
            {/* Main Image Container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F15] via-transparent to-transparent z-10"></div>

              {/* Image */}
              <img
                src="/images/Mockup1.png"
                alt="Expense Tracker Dashboard"
                className="w-full h-full object-cover object-left"
              />

              <div className="absolute bottom-8 left-20 z-20 bg-[#1A1F25]/90 backdrop-blur-sm p-4 rounded-lg border border-[#2A2F35]">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-medium text-gray-200">
                    With Alert Features
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -z-10 bottom-1/4 left-1/4 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements - Adjusted for mobile */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-screen bg-gradient-to-b lg:bg-gradient-to-l from-emerald-900/10 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full lg:w-1/2 h-1/2 bg-gradient-to-t from-emerald-900/5 to-transparent"></div>
    </div>
  );
}

export default Landing;
