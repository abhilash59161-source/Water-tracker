/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Flame, 
  UtensilsCrossed, 
  Sparkles, 
  Activity, 
  HeartHandshake,
  TrendingUp,
  Apple,
  DownloadCloud
} from "lucide-react";
import { FoodItem, UserProfile } from "./types.js";
import Dashboard from "./components/Dashboard.tsx";
import FoodLogger from "./components/FoodLogger.tsx";
import PhotoRecognition from "./components/PhotoRecognition.tsx";
import Recommendations from "./components/Recommendations.tsx";
import TherapeuticDiets from "./components/TherapeuticDiets.tsx";
import OnboardingModal from "./components/OnboardingModal.tsx";
import InstallGuideModal from "./components/InstallGuideModal.tsx";

const DEFAULT_PROFILE: UserProfile = {
  age: 28,
  gender: "male",
  weight: 75,
  height: 178,
  activityLevel: "moderate",
  goal: "maintenance",
  targetCalories: 2150,
  targetProtein: 140,
  targetCarbs: 235,
  targetFat: 70,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "logger" | "photo" | "recommendations" | "disease">("dashboard");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
    return localStorage.getItem("has_onboarded") === "true";
  });

  const [showInstallGuide, setShowInstallGuide] = useState<boolean>(false);

  // Global food logs loaded from localStorage
  const [foodLogs, setFoodLogs] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem("food_logs");
    return saved ? JSON.parse(saved) : [];
  });

  // Global user profile loaded from localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("user_profile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  // Save food logs automatically
  useEffect(() => {
    localStorage.setItem("food_logs", JSON.stringify(foodLogs));
  }, [foodLogs]);

  // Save profile automatically
  useEffect(() => {
    localStorage.setItem("user_profile", JSON.stringify(profile));
  }, [profile]);

  const handleAddLog = (item: Omit<FoodItem, "id">) => {
    const newLog: FoodItem = {
      ...item,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setFoodLogs((prev) => [newLog, ...prev]);
  };

  const handleDeleteLog = (id: string) => {
    setFoodLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-800" id="main-container">
      
      {/* HEADER / NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo area */}
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
                <Apple className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-md font-black tracking-tight text-slate-900">NutriTrack</h1>
                <span className="text-[10px] text-emerald-600 font-bold tracking-wider uppercase block -mt-1">AI Food & Diet Suite</span>
              </div>
            </div>

            {/* Navigation Tabs - Desktop */}
            <nav className="hidden md:flex space-x-1" id="desktop-nav">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "dashboard"
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab("logger")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "logger"
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                <UtensilsCrossed className="h-4 w-4" />
                Food Diary
              </button>

              <button
                onClick={() => setActiveTab("photo")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "photo"
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                AI Photo Scanner
              </button>

              <button
                onClick={() => setActiveTab("recommendations")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "recommendations"
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                <Flame className="h-4 w-4" />
                AI Recommendations
              </button>

              <button
                onClick={() => setActiveTab("disease")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "disease"
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                <Activity className="h-4 w-4" />
                Therapeutic Diets
              </button>
            </nav>

            {/* Offline Install Guide */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setShowInstallGuide(true)}
                className="py-1.5 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <DownloadCloud className="h-4 w-4 text-emerald-400" />
                Offline Install Guide
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation - Scrollable Row */}
        <div className="md:hidden border-t border-slate-100 bg-white overflow-x-auto flex scrollbar-none px-2 py-2 gap-1.5" id="mobile-nav">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition-all ${
              activeTab === "dashboard"
                ? "bg-emerald-500 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("logger")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition-all ${
              activeTab === "logger"
                ? "bg-emerald-500 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Food Diary
          </button>
          <button
            onClick={() => setActiveTab("photo")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition-all ${
              activeTab === "photo"
                ? "bg-emerald-500 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            AI Scanner
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition-all ${
              activeTab === "recommendations"
                ? "bg-emerald-500 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            AI Goals
          </button>
          <button
            onClick={() => setActiveTab("disease")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition-all ${
              activeTab === "disease"
                ? "bg-emerald-500 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Therapeutic Diets
          </button>
          
          <button
            onClick={() => setShowInstallGuide(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-black flex-shrink-0 transition-all bg-slate-900 text-white flex items-center gap-1 cursor-pointer"
          >
            <DownloadCloud className="h-3.5 w-3.5 text-emerald-400" />
            No Store Install
          </button>
        </div>
      </header>

      {/* PRIMARY WORKSPACE CONTENT */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="workspace-main">
        
        {/* Render Active View Tab */}
        {activeTab === "dashboard" && (
          <Dashboard
            foodLogs={foodLogs}
            profile={profile}
            selectedDate={selectedDate}
            onSetSelectedDate={setSelectedDate}
          />
        )}

        {activeTab === "logger" && (
          <FoodLogger
            foodLogs={foodLogs}
            onAddLog={handleAddLog}
            onDeleteLog={handleDeleteLog}
            selectedDate={selectedDate}
          />
        )}

        {activeTab === "photo" && (
          <PhotoRecognition
            onAddLog={handleAddLog}
            selectedDate={selectedDate}
          />
        )}

        {activeTab === "recommendations" && (
          <Recommendations
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === "disease" && (
          <TherapeuticDiets />
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-12" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="flex items-center gap-1 font-medium">
            <HeartHandshake className="h-4 w-4 text-emerald-500" />
            NutriTrack: Your Ultimate Clinical Diet Companion
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            Powered by Google Gemini 3.5 & Medical Nutrition Therapy Guidelines
          </p>
        </div>
      </footer>

      {/* MODALS */}
      {!hasOnboarded && (
        <OnboardingModal 
          onComplete={(finalProfile) => {
            setProfile(finalProfile);
            setHasOnboarded(true);
            setActiveTab("recommendations");
          }} 
        />
      )}

      {showInstallGuide && (
        <InstallGuideModal 
          onClose={() => setShowInstallGuide(false)} 
        />
      )}

    </div>
  );
}
