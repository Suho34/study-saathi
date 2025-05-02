import { jsPDF } from "jspdf";
import { useState } from "react";

export const StudyPlanResults = ({
  studyPlan,
  resetPlanner,
  responses,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState("schedule");

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title Page
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Study Saathi - Personalized Study Plan", 105, 20, {
      align: "center",
    });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated for: ${responses.subjects}`, 20, 40);
    doc.text(`Target Date: ${responses.targetDate}`, 20, 48);
    doc.text(`Daily Study Hours: ${responses.hoursPerDay}`, 20, 56);

    if (responses.additionalNotes) {
      doc.text("Additional Notes:", 20, 70);
      const wrappedNotes = doc.splitTextToSize(responses.additionalNotes, 170);
      doc.text(wrappedNotes, 20, 78);
    }

    // Weekly Schedule
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Weekly Study Schedule", 20, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    let y = 30;
    const maxHeight = 270;

    studyPlan.weekly_schedule.forEach((day) => {
      doc.setFont("helvetica", "bold");
      doc.text(day.day, 20, y);
      y += 6;
      doc.setFont("helvetica", "normal");

      day.slots.forEach((slot) => {
        if (y > maxHeight) {
          doc.addPage();
          y = 20;
        }
        const slotText = `• ${slot.time}: ${slot.subject} - ${slot.activity}`;
        const wrapped = doc.splitTextToSize(slotText, 170);
        doc.text(wrapped, 25, y);
        y += wrapped.length * 6;
      });

      y += 10;
    });

    // Resource Allocation (with links)
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Resource Allocation", 20, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    y = 30;

    studyPlan.resource_allocation?.forEach((allocation) => {
      if (y > maxHeight) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(allocation.subject, 20, y);
      y += 6;
      doc.setFont("helvetica", "normal");

      allocation.resources.forEach((res) => {
        if (y > maxHeight) {
          doc.addPage();
          y = 20;
        }

        const isURL = /^https?:\/\//.test(res);

        if (isURL) {
          const wrapped = doc.splitTextToSize(res, 160);
          wrapped.forEach((line) => {
            doc.setTextColor(0, 0, 255);
            doc.setFont(undefined, "underline");
            doc.textWithLink(line, 25, y, { url: res });
            y += 6;
          });
          doc.setTextColor(0, 0, 0);
          doc.setFont(undefined, "normal");
        } else {
          const wrapped = doc.splitTextToSize(`- ${res}`, 170);
          doc.text(wrapped, 25, y);
          y += wrapped.length * 6;
        }
      });

      const wrappedUsage = doc.splitTextToSize(
        `Usage Plan: ${allocation.usage_plan}`,
        170
      );
      doc.text(wrappedUsage, 25, y);
      y += wrappedUsage.length * 6 + 6;
    });

    // Focus Blocks
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Focus Blocks", 20, y);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    y += 10;

    studyPlan.focus_blocks?.forEach((block) => {
      if (y > maxHeight) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`• ${block.duration} Focus Sessions`, 20, y);
      y += 6;
      doc.setFont("helvetica", "normal");

      block.techniques.forEach((tech) => {
        const wrappedTech = doc.splitTextToSize(`- ${tech}`, 170);
        doc.text(wrappedTech, 25, y);
        y += wrappedTech.length * 6;
      });

      y += 6;
    });

    // Learning Strategies
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Learning Strategies", 20, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    y = 30;

    const renderList = (title, list) => {
      doc.setFont("helvetica", "bold");
      doc.text(title, 20, y);
      y += 8;
      doc.setFont("helvetica", "normal");

      list.forEach((item) => {
        if (y > maxHeight) {
          doc.addPage();
          y = 20;
        }

        const wrapped = doc.splitTextToSize(`• ${item}`, 170);
        doc.text(wrapped, 25, y);
        y += wrapped.length * 6;
      });

      y += 8;
    };

    renderList(
      "Distraction Management",
      studyPlan.distraction_management || []
    );
    renderList("Motivation Strategies", studyPlan.motivation_strategies || []);
    renderList(
      "Environment Recommendations",
      studyPlan.environment_recommendations || []
    );
    renderList("Review Schedule", studyPlan.review_schedule || []);

    // Save
    doc.save(`study-plan-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-lg">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Your Personalized Study Plan
          </h2>
          <p className="text-gray-600">
            Generated for {responses.subjects} with target date of{" "}
            {responses.targetDate}
          </p>
          {responses.additionalNotes && (
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <h4 className="font-medium text-blue-800">Your Notes:</h4>
              <p className="text-blue-700">{responses.additionalNotes}</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={resetPlanner}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            Create New Plan
          </button>
          <button
            onClick={handleExportPDF}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white p-2 rounded-xl shadow-lg">
        <nav className="flex space-x-4">
          {[
            { id: "schedule", label: "Weekly Schedule" },
            { id: "milestones", label: "Milestones" },
            { id: "resources", label: "Resources" },
            { id: "strategies", label: "Learning Strategies" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "schedule" && (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Weekly Study Schedule
          </h3>
          <div className="space-y-6">
            {studyPlan.weekly_schedule?.map((day, dayIndex) => (
              <div key={day.day} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {day.day}
                  </h4>
                </div>
                <div className="p-4 space-y-3">
                  {day.slots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className={`p-3 rounded-md relative ${
                        completedTasks[`${dayIndex}-${slotIndex}`]
                          ? "bg-green-50 border-l-4 border-green-400"
                          : slot.priority > 3
                          ? "bg-red-50 border-l-4 border-red-400"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-800">
                          {slot.time}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            slot.priority > 3
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {slot.subject}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{slot.activity}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {slot.resource && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {slot.resource}
                          </span>
                        )}
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          Energy: {slot.energy_level}/5
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          Priority: {slot.priority}/5
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "milestones" && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Progress Roadmap
          </h3>
          <div className="flex overflow-x-auto pb-4 gap-4">
            {studyPlan.milestones?.map((milestone, i) => (
              <div
                key={i}
                className="flex-none w-72 bg-blue-50 p-4 rounded-lg border border-blue-100"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">{i + 1}</span>
                  </div>
                  <div>
                    <div className="text-sm text-blue-600">
                      {milestone.date}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-gray-800 font-medium">
                  {milestone.goal}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Assessment:</span>{" "}
                  {milestone.assessment}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "resources" && (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Resource Allocation
            </h3>
            <div className="space-y-4">
              {studyPlan.resource_allocation?.map((allocation, i) => (
                <div
                  key={i}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <h4 className="font-medium text-gray-900 mb-2">
                    {allocation.subject}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {allocation.resources.map((resource, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                      >
                        {resource}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    {allocation.usage_plan}
                  </p>

                  {/* New Links Section */}
                  {allocation.links?.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-800 mb-2">
                        Recommended Resources:
                      </h5>
                      <ul className="space-y-2">
                        {allocation.links.map((link, k) => (
                          <li key={k} className="flex items-start">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-start"
                            >
                              <span className="mr-2">
                                {link.type === "video" && "🎥"}
                                {link.type === "article" && "📖"}
                                {link.type === "quiz" && "❓"}
                                {link.type === "course" && "🎓"}
                              </span>
                              <span>
                                {link.title}
                                <span className="text-xs text-gray-500 ml-2">
                                  (
                                  {new URL(link.url).hostname.replace(
                                    "www.",
                                    ""
                                  )}
                                  )
                                </span>
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "strategies" && (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Distraction Management
              </h3>
              <ul className="space-y-3">
                {studyPlan.distraction_management?.map((strategy, i) => (
                  <li key={i} className="flex items-start">
                    <div className="bg-purple-100 p-1 rounded-full mr-3 mt-1">
                      <svg
                        className="h-4 w-4 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Motivation Strategies
              </h3>
              <ul className="space-y-3">
                {studyPlan.motivation_strategies?.map((strategy, i) => (
                  <li key={i} className="flex items-start">
                    <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Environment Recommendations
              </h3>
              <ul className="space-y-3">
                {studyPlan.environment_recommendations?.map((rec, i) => (
                  <li key={i} className="flex items-start">
                    <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-1">
                      <svg
                        className="h-4 w-4 text-yellow-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Review Schedule
              </h3>
              <ul className="space-y-3">
                {studyPlan.review_schedule?.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                      <svg
                        className="h-4 w-4 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
