import { useState } from "react";
import { StudyPlanForm } from "./StudyPlanForm";
import { StudyPlanResults } from "./StudyPlanResults";
import { questions } from "./questions.jsx";

export const AIStudyPlanner = () => {
  const [responses, setResponses] = useState({});
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const REQUIREMENTS = `
REQUIREMENTS:
1. Weekly Study Schedule
   - Includes subject-wise time blocks, breaks, and buffer time
   - Adjusted for energy levels, commitments, and preferred study times

2. Resource Allocation Plan
   - Matches available resources (books, apps, videos) to each subject
   - Suggests usage strategy for each resource

3. Progress Milestones
   - Specific goals with deadlines to track study progress
   - Includes assessments or check-ins

4. Adaptive Learning Strategies
   - Based on user’s learning styles (visual, auditory, kinesthetic, etc.)
   - Adjusted to address personal learning challenges

5. Practice Test Schedule (if exam prep)
   - Timed mock tests and revision days for assessment readiness

6. Retention Techniques
   - Includes spaced repetition, active recall, summarization, and teaching-back

7. Focus Sessions & Efficiency Tips
   - Customized study blocks based on attention span
   - Techniques like Pomodoro, timeboxing, and focused deep work

8. Priority Ranking System
   - Each time block gets a priority rating (1–5) based on subject urgency/difficulty

9. Subject-Specific Strategies
   - Tailored approaches for subjects based on difficulty level and proficiency

10. Distraction Management Plan
    - Personalized techniques to eliminate or reduce distractions
    - Includes tools, environment tweaks, or digital detox ideas

11. Motivation Maintenance Plan
    - Encouragement tactics, vision reminders, and intrinsic motivators
    - Includes habit-tracking and visual progress boards

12. Reward System Integration
    - Smart reward system (mini-rewards after sessions, bigger rewards on milestones)

13. Environment Optimization Tips
    - Ideal lighting, noise control, desk setup, and digital organization tips

14. Custom Review Schedule
    - Based on preferred review methods and spaced intervals

15. Challenge-Specific Adjustments
    - Accommodations for learning difficulties, focus issues, or low confidence areas
`;

  const callGeminiAPI = async (apiKey, prompt) => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  const analyzeWithAI = async (userResponses) => {
    try {
      setLoading(true);
      setError("");

      // Validate required inputs
      const requiredQuestions = questions.filter((q) => q.required);
      const missingFields = requiredQuestions.filter(
        (q) =>
          !userResponses[q.key] ||
          (Array.isArray(userResponses[q.key]) &&
            userResponses[q.key].length === 0)
      );

      if (missingFields.length > 0) {
        throw new Error(
          `Please complete all required fields: ${missingFields
            .map((f) => f.question)
            .join(", ")}`
        );
      }

      // Safe array extractions
      const learningStyles = Array.isArray(userResponses.learningStyles)
        ? userResponses.learningStyles
        : [];

      const existingResources = Array.isArray(userResponses.existingResources)
        ? userResponses.existingResources
        : [];

      const studyTimes = Array.isArray(userResponses.studyTimes)
        ? userResponses.studyTimes
        : [];

      const distractions = Array.isArray(userResponses.distractions)
        ? userResponses.distractions
        : [];

      const progressTracking = Array.isArray(userResponses.progressTracking)
        ? userResponses.progressTracking
        : [];

      const motivations = Array.isArray(userResponses.motivations)
        ? userResponses.motivations
        : [];

      const learningChallenges = Array.isArray(userResponses.learningChallenges)
        ? userResponses.learningChallenges
        : [];

      const reviewMethods = Array.isArray(userResponses.reviewMethods)
        ? userResponses.reviewMethods
        : [];

      const rewards = Array.isArray(userResponses.rewards)
        ? userResponses.rewards
        : [];

      const environment = Array.isArray(userResponses.environment)
        ? userResponses.environment
        : [];

      const prompt = `
Create a comprehensive, personalized study plan with these details:

STUDENT PROFILE:
- Subjects: ${userResponses.subjects}
- Daily study capacity: ${userResponses.hoursPerDay} hours
- Weakest subject: ${userResponses.weakestSubject}
- Target date: ${userResponses.targetDate}
- Learning styles: ${learningStyles.join(", ")}
- Resources: ${existingResources.join(", ")}
- Preferred times: ${studyTimes.join(", ")}
- Main goal: ${userResponses.studyGoal}
- Energy levels: ${JSON.stringify(userResponses.energyLevels)}
- Subject proficiency: ${JSON.stringify(userResponses.subjectProficiency)}
- Commitments: ${userResponses.commitments?.length || 0} time blocks occupied
- Focus duration: ${userResponses.focusDuration}
- Distractions: ${distractions.join(", ")}
- Progress tracking: ${progressTracking.join(", ")}
- Motivations: ${motivations.join(", ")}
- Subject difficulty: ${JSON.stringify(userResponses.subjectDifficulty)}
- Challenges: ${learningChallenges.join(", ")}
- Review methods: ${reviewMethods.join(", ")}
- Rewards: ${rewards.join(", ")}
- Environment: ${environment.join(", ")}
- Additional notes: ${userResponses.additionalNotes || "None"}

${REQUIREMENTS}

Respond in this exact JSON format:
{
  "weekly_schedule": [{
    "day": "string",
    "slots": [{
      "time": "string",
      "subject": "string",
      "activity": "string",
      "resource": "string",
      "priority": number,
      "energy_level": number
    }]
  }],
  "milestones": [{
    "date": "YYYY-MM-DD",
    "goal": "string",
    "assessment": "string"
  }],
   "resource_allocation": [{
    "subject": "string",
    "resources": ["string"],
    "usage_plan": "string",
    "links": [{
      "title": "string",
      "url": "string",
      "type": "video/article/quiz/etc"
    }]
  }],
  "focus_blocks": [{
    "duration": "string",
    "techniques": ["string"]
  }],
  "distraction_management": ["string"],
  "motivation_strategies": ["string"],
  "environment_recommendations": ["string"],
  "reward_system": ["string"],
  "review_schedule": ["string"]
}
      `.trim();

      const plan = await callGeminiAPI(
        import.meta.env.VITE_GEMINI_API_KEY || "your_gemini_key",
        prompt
      );

      const cleaned = plan.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (!parsed.weekly_schedule) {
        throw new Error("Invalid plan format received from AI");
      }

      setStudyPlan(parsed);
    } catch (err) {
      setError(err.message || "Failed to generate plan. Please try again.");
      console.error("AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (e, question) => {
    const { value, checked, type } = e.target;
    const questionKey = question?.key || "additionalNotes";

    if (type === "checkbox") {
      setResponses((prev) => ({
        ...prev,
        [questionKey]: checked
          ? [...(prev[questionKey] || []), value]
          : prev[questionKey]?.filter((item) => item !== value) || [],
      }));
    } else {
      setResponses((prev) => ({
        ...prev,
        [questionKey]: value,
      }));
    }
  };

  const generatePlan = async () => {
    await analyzeWithAI(responses);
  };

  const resetPlanner = () => {
    setResponses({});
    setStudyPlan(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 pb-16">
      <div className="bg-blue-600 text-white py-12 px-4 shadow-md">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Study Saathi Planner</h1>
          <p className="text-xl opacity-90">
            Your personalized AI-powered study companion
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
              <h3 className="text-xl font-medium text-gray-800">
                Crafting Your Perfect Study Plan
              </h3>
              <p className="text-gray-600 mt-2">
                Analyzing all your preferences for optimal scheduling...
              </p>
            </div>
          </div>
        ) : studyPlan ? (
          <StudyPlanResults
            studyPlan={studyPlan}
            resetPlanner={resetPlanner}
            responses={responses}
            loading={loading}
          />
        ) : (
          <StudyPlanForm
            questions={questions}
            responses={responses}
            handleResponse={handleResponse}
            generatePlan={generatePlan}
            error={error}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default AIStudyPlanner;
