/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Flame, 
  Droplet, 
  TrendingUp, 
  Calendar, 
  Trophy, 
  CheckCircle,
  Apple,
  Dumbbell,
  Scale
} from "lucide-react";
import { FoodItem, UserProfile } from "../types.js";

interface DashboardProps {
  foodLogs: FoodItem[];
  profile: UserProfile;
  selectedDate: string;
  onSetSelectedDate: (date: string) => void;
}

export default function Dashboard({
  foodLogs,
  profile,
  selectedDate,
  onSetSelectedDate,
}: DashboardProps) {
  const [waterCups, setWaterCups] = useState<number>(() => {
    const saved = localStorage.getItem(`water_${selectedDate}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleWaterChange = (amount: number) => {
    const next = Math.max(0, waterCups + amount);
    setWaterCups(next);
    localStorage.setItem(`water_${selectedDate}`, next.toString());
  };

  // Filter logs for the selected date
  const todayLogs = foodLogs.filter((log) => log.loggedAt === selectedDate);

  // Totals for today
  const totalCalories = todayLogs.reduce((sum, log) => sum + log.calories * log.servingAmount, 0);
  const totalProtein = todayLogs.reduce((sum, log) => sum + log.protein * log.servingAmount, 0);
  const totalCarbs = todayLogs.reduce((sum, log) => sum + log.carbs * log.servingAmount, 0);
  const totalFat = todayLogs.reduce((sum, log) => sum + log.fat * log.servingAmount, 0);

  // Percentages against target
  const calPercent = Math.min(100, Math.round((totalCalories / profile.targetCalories) * 100)) || 0;
  const proteinPercent = Math.min(100, Math.round((totalProtein / profile.targetProtein) * 100)) || 0;
  const carbsPercent = Math.min(100, Math.round((totalCarbs / profile.targetCarbs) * 100)) || 0;
  const fatPercent = Math.min(100, Math.round((totalFat / profile.targetFat) * 100)) || 0;

  // Last 7 days history calculation for the chart
  const getLast7Days = () => {
    const days = [];
    const date = new Date(selectedDate);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(date);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      days.push(`${year}-${month}-${day}`);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const dailyCaloriesList = last7Days.map((dayStr) => {
    const dateObj = new Date(dayStr);
    const label = dateObj.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
    const cals = foodLogs
      .filter((log) => log.loggedAt === dayStr)
      .reduce((sum, log) => sum + log.calories * log.servingAmount, 0);
    return { dayStr, label, calories: cals };
  });

  // Calculate coordinates for the SVG trend chart
  const maxCal = Math.max(...dailyCaloriesList.map((d) => d.calories), profile.targetCalories, 1000);
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 30;

  const getPoints = () => {
    return dailyCaloriesList.map((d, index) => {
      const x = padding + (index * (chartWidth - 2 * padding)) / 6;
      // Invert Y coordinate since SVG (0,0) is top-left
      const y = chartHeight - padding - (d.calories / maxCal) * (chartHeight - 2 * padding);
      return { x, y, label: d.label, val: d.calories };
    });
  };

  const points = getPoints();
  const pathData = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Area path data (goes down to baseline for gradient fill)
  const areaData = points.length > 0
    ? `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : "";

  // Helper for goal descriptions
  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case "weight_loss": return "Weight Loss (Caloric Deficit)";
      case "muscle_gain": return "Muscle Gain (Protein Rich)";
      case "low_carb": return "Low Carb / Keto Focus";
      case "clean_eating": return "Clean Eating & Whole Foods";
      default: return "Weight Maintenance";
    }
  };

  return (
    <div className="space-y-6" id="dashboard-tab">
      {/* Date selector header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-500" />
            Daily Summary Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tracking nutrition for: <span className="font-semibold text-slate-700">{new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) {
                onSetSelectedDate(e.target.value);
                // Reload water
                const saved = localStorage.getItem(`water_${e.target.value}`);
                setWaterCups(saved ? parseInt(saved, 10) : 0);
              }
            }}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <button
            onClick={() => {
              const today = new Date().toISOString().split("T")[0];
              onSetSelectedDate(today);
              const saved = localStorage.getItem(`water_${today}`);
              setWaterCups(saved ? parseInt(saved, 10) : 0);
            }}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Main Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Caloric Intake Circle */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-between min-h-[300px]">
          <div className="w-full">
            <h3 className="text-sm font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Flame className="h-4 w-4 text-orange-500" />
              Calories Today
            </h3>
          </div>

          <div className="relative flex items-center justify-center my-4">
            {/* SVG Progress Ring */}
            <svg className="w-40 h-40 transform -rotate-90">
              {/* Outer background ring */}
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-slate-100"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Foreground progress ring */}
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-emerald-500 transition-all duration-500"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * calPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-slate-800">{Math.round(totalCalories)}</span>
              <p className="text-xs text-slate-400 mt-0.5">/ {profile.targetCalories} kcal</p>
              <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${calPercent > 100 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {calPercent}% of limit
              </span>
            </div>
          </div>

          <div className="w-full text-center text-xs text-slate-500">
            {totalCalories < profile.targetCalories ? (
              <p>You have <strong className="text-emerald-600">{Math.round(profile.targetCalories - totalCalories)} kcal</strong> remaining for today.</p>
            ) : (
              <p className="text-red-500 font-medium">Caloric target exceeded by {Math.round(totalCalories - profile.targetCalories)} kcal!</p>
            )}
          </div>
        </div>

        {/* Macronutrients Progress */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Macronutrient Targets
            </h3>
          </div>

          <div className="space-y-5 my-2">
            {/* Protein */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                  Protein
                </span>
                <span className="text-slate-500">
                  <strong>{Math.round(totalProtein)}g</strong> / {profile.targetProtein}g ({proteinPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${proteinPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  Carbohydrates
                </span>
                <span className="text-slate-500">
                  <strong>{Math.round(totalCarbs)}g</strong> / {profile.targetCarbs}g ({carbsPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${carbsPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Fat */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  Fats
                </span>
                <span className="text-slate-500">
                  <strong>{Math.round(totalFat)}g</strong> / {profile.targetFat}g ({fatPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${fatPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-500 flex gap-2 items-center">
            <Trophy className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>Target calories calculated based on your goal: <strong>{getGoalLabel(profile.goal)}</strong></span>
          </div>
        </div>

        {/* Hydration / Water Tracker */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Droplet className="h-4 w-4 text-sky-500" />
              Hydration Tracker
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center my-2 space-y-4">
            <div className="flex gap-1.5 items-end justify-center min-h-[50px]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 rounded-t-md transition-all duration-500 ${
                    i < waterCups 
                      ? "bg-sky-400 h-12 shadow-sm shadow-sky-100" 
                      : "bg-slate-100 h-8 border border-dashed border-slate-200"
                  }`}
                />
              ))}
            </div>

            <div className="text-center">
              <span className="text-2xl font-black text-slate-800">{waterCups}</span>
              <span className="text-slate-400 text-sm"> / 8 Cups</span>
              <p className="text-xs text-slate-400 mt-0.5">Approx {waterCups * 250} ml of pure water logged</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleWaterChange(-1)}
                className="px-3 py-1 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                - 1 Cup
              </button>
              <button
                onClick={() => handleWaterChange(1)}
                className="px-4 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold shadow-sm shadow-sky-100 transition-colors"
              >
                + Log 1 Cup
              </button>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Drinking water speeds up lipolysis (fat metabolism) and cleanses toxic cellular byproducts.
          </div>
        </div>
      </div>

      {/* History Trend Charts */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              7-Day Caloric Trend
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Visualizing your caloric consistency over the past week</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Logged Calories
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-slate-300"></span>
              Goal Target
            </span>
          </div>
        </div>

        {/* Render SVG Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[500px] h-[180px] relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={padding} y1={(chartHeight) / 2} x2={chartWidth - padding} y2={(chartHeight) / 2} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#f1f5f9" strokeWidth="1" />

              {/* Target Goal Line */}
              {(() => {
                const targetY = chartHeight - padding - (profile.targetCalories / maxCal) * (chartHeight - 2 * padding);
                return (
                  <g>
                    <line
                      x1={padding}
                      y1={targetY}
                      x2={chartWidth - padding}
                      y2={targetY}
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="5 5"
                    />
                    <text
                      x={chartWidth - padding - 80}
                      y={targetY - 5}
                      fill="#64748b"
                      fontSize="9"
                      fontWeight="600"
                    >
                      Goal: {profile.targetCalories} kcal
                    </text>
                  </g>
                );
              })()}

              {/* Gradient Area under line */}
              {areaData && (
                <path d={areaData} fill="url(#chartGradient)" />
              )}

              {/* Polyline line connecting points */}
              {pathData && (
                <path
                  d={pathData}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}

              {/* Individual circles and tooltips */}
              {points.map((p, index) => (
                <g key={index}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="5"
                    className="fill-white stroke-emerald-500"
                    strokeWidth="3"
                  />
                  {/* Values text label */}
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    fill="#334155"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {p.val > 0 ? `${Math.round(p.val)}` : ""}
                  </text>
                  {/* X-Axis labels */}
                  <text
                    x={p.x}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9.5"
                    fontWeight="500"
                  >
                    {p.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Healthy items & recommendations quick promo */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
          <Apple className="h-6 w-6" />
        </div>
        <div className="text-center sm:text-left">
          <h4 className="text-sm font-semibold text-slate-800">Explore Nutritional Insights</h4>
          <p className="text-xs text-slate-500 mt-1">
            Need inspiration? Visit the <strong>Healthy Foods Directory</strong> or <strong>Personalized Recommendations</strong> tabs to unlock custom meals optimized by Gemini.
          </p>
        </div>
      </div>
    </div>
  );
}
