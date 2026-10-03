# 🥗 NutriTrack — AI Food Diary, Nutrition Tracker & Clinical Diet Suite

An intelligent nutrition tracking and dietary planning platform powered by Gemini AI. Scan meal photos to identify ingredients and breakdown nutrients, monitor daily caloric intake with dynamic dashboards, generate personalized therapeutic diets for health conditions (diabetes, hypertension, PCOS, etc.), and calculate family weekly ration estimates.

Built with **React 19**, **TypeScript**, **Tailwind CSS**, **Express**, and **Google Gemini API**.

---

## 🌟 Key Features

- 📸 **AI Photo Food Recognition**: Snap or upload any meal photo to identify ingredients and estimate calories, protein, carbs, and fats automatically.
- 🔍 **Global Food & Nutrition Search**: Search over thousands of everyday foods, branded items, and regional recipes with detailed macro and micronutrient breakdowns.
- 📊 **Daily Intake Dashboard**: Real-time visual tracking of calories, macronutrient distribution, water intake, and daily progress bars.
- 🎯 **Personalized Diet Planner**: Customized meal schedules tailored to individual targets (weight loss, muscle gain, keto, athletic performance).
- 🏥 **Clinical Condition Diet Support**: Medical nutrition therapy protocols for managing specific conditions such as Diabetes (Type 1 & 2), Hypertension, Fatty Liver, PCOS, GERD, and customizable illness queries.
- 👨‍👩‍👧‍👦 **Family Plan & Weekly Ration Calculator**: Calculate required pantry staples, grains, pulses, dairy, and produce for household members based on adult and child ratios.
- 📱 **Progressive Web App (PWA) Ready**: Works in browser and can be installed directly to home screens on Android, iOS, or Desktop without using app stores.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend / Proxy**: Express.js with Node.js / Vite Middleware
- **AI Engine**: Google Gemini API (`@google/genai`) for image analysis and personalized clinical meal planning
- **Build Tool**: Vite

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm
- A Google Gemini API key ([Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   cd YOUR_REPOSITORY_NAME
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory (based on `.env.example`):
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   PORT=3000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📦 Production Build

```bash
npm run build
npm start
```

---

## 📱 Installing on Mobile (Without App Store)

NutriTrack runs as an installable Progressive Web App (PWA):
1. **Android (Chrome)**: Tap the `⋮` menu button at top right → Select **"Add to Home Screen"** or **"Install app"**.
2. **iOS (Safari)**: Tap the **Share** button (box with upward arrow) at bottom → Scroll down and tap **"Add to Home Screen"**.

---

## 📄 License

This project is licensed under the Apache-2.0 License.
AquaFlow — A modern, interactive family hydration tracker built with React & Tailwind CSS featuring daily goal tracking, quick logging presets, liquid physics visuals, audio feedback, and JSON backup export.