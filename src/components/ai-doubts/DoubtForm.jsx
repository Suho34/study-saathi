import { useState } from "react";
import { askAI } from "../../utilis/askAI";
import { useAuth } from "../../hooks/useAuth";

const studentLevels = [
  {
    id: "class_8",
    label: "Class 8",
    languageRatio: "80% Hindi, 20% English terms",
    complexityLevel: 1,
    focus: "Foundation building with real-world connections",
    taboos: ["Advanced terminology", "Abstract concepts"],
    exampleType: "Household items/School scenarios",
    responseStructure: "Concept → Story → Example → Summary",
    teachingMethod: "Graded concept introduction",
    engagementElements: "Fun comparisons, Simple quizzes",
    assessmentPrep: "Basic question patterns",
    prompt: `Teaching 13-year-olds:
    1. Use kitchen physics & playground math examples
    2. Follow "Show → Tell → Practice" format
    3. Add memory aids: "Yaad Rakho" boxes
    4. Include 1 practice question per concept`,
  },
  {
    id: "class_9",
    label: "Class 9",
    languageRatio: "60% Hindi, 40% English terms",
    complexityLevel: 2,
    focus: "Connecting concepts across subjects",
    taboos: ["Complex formulas", "Theoretical jargon"],
    exampleType: "Local market/Sports examples",
    responseStructure: "Why → How → Diagram → Application",
    teachingMethod: "Visual learning integration",
    engagementElements: "Mental imagery prompts, Quick checks",
    assessmentPrep: "NCERT exemplar patterns",
    prompt: `Intermediate concepts:
    1. Link to Class 8 foundations
    2. Use 2-color mental diagrams
    3. Add "Common Confusions" section
    4. Include 2 difficulty-level questions`,
  },
  {
    id: "class_10",
    label: "Class 10",
    languageRatio: "50% Hindi, 50% English",
    complexityLevel: 3,
    focus: "Board exam excellence",
    taboos: ["Out-of-syllabus content"],
    exampleType: "Previous year questions",
    responseStructure: "Definition → Formula → PYQ Solution → Exception",
    teachingMethod: "Marking scheme alignment",
    engagementElements: "Exam hacks, Time management tips",
    assessmentPrep: "CBSE marking patterns",
    prompt: `Board prep:
    1. Follow NCERT flow strictly
    2. Highlight 3-5 mark answer structures
    3. Add "Answer Presentation Tips"
    4. Include 1 solved & 1 practice PYQ`,
  },
  {
    id: "class_11",
    label: "Class 11",
    languageRatio: "40% Hindi, 60% English",
    complexityLevel: 4,
    focus: "Stream-specific fundamentals",
    taboos: ["Oversimplification"],
    exampleType: "Industry applications",
    responseStructure: "Theory → Derivation → Case Study → Limitations",
    teachingMethod: "Conceptual depth building",
    engagementElements: "Real-world relevance notes",
    assessmentPrep: "Practical exam guidance",
    prompt: `Senior secondary:
    1. Add stream-specific context (Science/Commerce/Arts)
    2. Include 1 research paper reference
    3. Compare with vocational applications
    4. Provide 2 difficulty-level problems`,
  },
  {
    id: "class_12",
    label: "Class 12",
    languageRatio: "30% Hindi, 70% English",
    complexityLevel: 4.5,
    focus: "Competitive exam bridge",
    taboos: ["Basic concept re-teaching"],
    exampleType: "JEE/NEET-style problems",
    responseStructure: "Concept → Formula → Competitive Q → Mistake Analysis",
    teachingMethod: "Dual prep (Board + Entrance)",
    engagementElements: "Shortcut alerts",
    assessmentPrep: "Negative marking strategies",
    prompt: `Advanced prep:
    1. Teach 2 solving methods (Traditional & Shortcut)
    2. Add "Silly Mistake Watchlist"
    3. Include 1 previous year competitive question
    4. Provide time-bound practice`,
  },
  {
    id: "college_ug",
    label: "College (UG)",
    languageRatio: "20% Hindi, 80% English",
    complexityLevel: 5,
    focus: "Industry-ready skills",
    taboos: ["Textbook-only content"],
    exampleType: "Case studies/Code samples",
    responseStructure:
      "Theory → Mathematical Proof → Implementation → Debugging",
    teachingMethod: "Project-based learning",
    engagementElements: "Code snippets, Whiteboard diagrams",
    assessmentPrep: "Viva preparation",
    prompt: `Undergrad focus:
    1. Link to industry tools (MATLAB/Python)
    2. Add 1 mini case study
    3. Include debugging exercises
    4. Provide 1 research paper reference`,
  },
  {
    id: "college_pg",
    label: "College (PG)",
    languageRatio: "10% Hindi, 90% English",
    complexityLevel: 5.5,
    focus: "Research methodology",
    taboos: ["Surface-level analysis"],
    exampleType: "Recent research papers",
    responseStructure: "Hypothesis → Methodology → Results → Future Work",
    teachingMethod: "Critical analysis",
    engagementElements: "Literature review prompts",
    assessmentPrep: "Thesis writing guidance",
    prompt: `Postgrad rigor:
    1. Compare 2+ research approaches
    2. Cite 2020+ papers
    3. Add "Ethical Considerations" section
    4. Include dataset analysis exercise`,
  },
  {
    id: "competitive_exam",
    label: "Competitive Exams",
    languageRatio: "Bilingual keywords",
    complexityLevel: 4,
    focus: "Speed & accuracy",
    taboos: ["Long theoretical explanations"],
    exampleType: "Previous year papers",
    responseStructure: "Problem → Shortcut → Similar Q → Time Save Tip",
    teachingMethod: "Pattern recognition",
    engagementElements: "Countdown timers",
    assessmentPrep: "Negative marking avoidance",
    prompt: `Exam crunch mode:
    1. Teach 30-second solutions
    2. Add 5 similar practice problems
    3. Highlight "Trap Options"
    4. Include 1 mock test section`,
  },
];

const DoubtForm = ({ onAnswer }) => {
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("Hinglish");
  const [studentLevel, setStudentLevel] = useState(studentLevels[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError("Please enter a valid question");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const selectedLevel = studentLevels.find(
        (level) => level.id === studentLevel
      );
      const answer = await askAI(question, language, selectedLevel);
      if (!answer) throw new Error("No response from AI");
      onAnswer({ question, answer, language });
      setQuestion("");
    } catch (err) {
      console.error("Error submitting doubt:", err);
      setError(err.message || "Could not get answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-purple-900 dark:to-pink-900 rounded-3xl shadow-lg">
      <div className="relative">
        <textarea
          className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md resize-none"
          rows={5}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            language === "Hindi"
              ? "प्रश्न पूछें..."
              : language === "English"
              ? "Ask your question..."
              : "Sawaal poochho..."
          }
          disabled={loading}
        />
        <div className="absolute bottom-4 left-4 flex space-x-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg text-slate-700 dark:text-white font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          >
            <option value="Hinglish">Hinglish</option>
            <option value="English">English</option>
            <option value="Hindi">हिन्दी</option>
          </select>
          <select
            value={studentLevel}
            onChange={(e) => setStudentLevel(e.target.value)}
            className="bg-white dark:bg-slate-800 px-3 py-2 rounded-lg text-slate-700 dark:text-white font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          >
            {studentLevels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p>{error}</p>
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading || !question.trim()}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
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
              <span>Processing...</span>
            </div>
          ) : (
            "Get Answer"
          )}
        </button>
      </div>
    </div>
  );
};

export default DoubtForm;
