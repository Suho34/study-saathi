# 🎓 Study Saathi – _Tera Apna Study Dost!_

**Smart bhi, Desi bhi!**

Study Saathi is your personalized Hinglish-speaking study companion, crafted with love for Indian students. Powered by AI, it helps you plan better, clear doubts, stay productive, and crush your academic goals—all in one friendly dashboard.

---

## ✨ Key Features

- 🧐 **AI-Powered Study Planner**
  Generate smart, personalized study plans based on your class, subjects, routine, and goals.

- 🤖 **Doubt Solver (AI)**
  Ask your study doubts in Hinglish or English and get instant, clear answers using Google Gemini AI.

- ✅ **Task Manager**
  Add tasks, mark them done, and stay on top of your to-do list with visual stats.

- 🎯 **Daily Goals Tracker**
  Set daily study targets and reflect on your progress.

- ⏱️ **Pomodoro Timer**
  Stay focused with the built-in Pomodoro-style productivity timer.

- 📝 **Quick Notes Section**
  Jot down notes and sync them with your account—never forget an important point.

- 💪 **Motivation & Focus Boosters**
  Get daily motivational tips and distraction-fighting techniques tailored for you.

---

## 🛠️ Tech Stack

| Layer         | Technologies Used                                              |
| ------------- | -------------------------------------------------------------- |
| **Frontend**  | React 19, Vite, TailwindCSS, Framer Motion, Chart.js, Three.js |
| **AI Layer**  | Google Gemini API (`@google/generative-ai`)                    |
| **Auth & DB** | Firebase Authentication & Firestore                            |
| **Routing**   | React Router DOM                                               |
| **Extras**    | jsPDF (PDF export), Lucide Icons, date-fns, uuid               |

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v18+)
- Firebase Project (for Auth and Firestore)
- Google Gemini API Key

### 🧹 Installation Steps

1. **Clone the repo**

   ```bash
   git clone https://github.com/yourusername/study-saathi.git
   cd study-saathi
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file and add your Firebase + Gemini API config:

   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_key
   ```

4. **Run the app**

   ```bash
   npm run dev
   ```

---

## 🧠 Why Study Saathi?

- Made with ❤️ in India 🇮🇳
- Hinglish interface that's fun and relatable
- AI superpowers without the complexity
- Built by students, for students

---

## 🤝 Contributing

We welcome contributions from the student community and developers!
If you’ve got ideas or features to suggest, open an issue or create a PR.
Let’s build India’s smartest study companion together! 🇮🇳💡

---

## 📄 License

MIT License
