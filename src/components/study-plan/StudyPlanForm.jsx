import { useState, useEffect } from "react";

export const StudyPlanForm = ({
  questions,
  responses,
  handleResponse,
  generatePlan,
  error,
  loading,
}) => {
  const [dynamicSubjects, setDynamicSubjects] = useState([]);

  useEffect(() => {
    if (responses.subjects) {
      setDynamicSubjects(
        responses.subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }
  }, [responses.subjects]);

  const renderInput = (question) => {
    switch (question.type) {
      case "text":
      case "number":
      case "date":
        return (
          <input
            type={question.type}
            onChange={(e) => handleResponse(e, question)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={question.placeholder}
            value={responses[question.key] || ""}
            disabled={loading}
            min={question.min}
            max={question.max}
            required={question.required}
          />
        );

      case "select":
        return (
          <select
            onChange={(e) => handleResponse(e, question)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={responses[question.key] || ""}
            disabled={loading}
            required={question.required}
          >
            <option value="">{question.placeholder}</option>
            {question.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "multi-select":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((option) => {
              const selectedOptions = responses[question.key] || [];
              const isSelected = selectedOptions.includes(option);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const updatedOptions = isSelected
                      ? selectedOptions.filter((o) => o !== option)
                      : [...selectedOptions, option];
                    handleResponse(
                      { target: { value: updatedOptions } },
                      question
                    );
                  }}
                  disabled={loading}
                  className={`p-3 rounded-md text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        );

      case "slider-group":
        return (
          <div className="space-y-4">
            {question.options.map((option) => (
              <div key={option} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {option}
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 w-20">
                    {question.labels[0]}
                  </span>
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    value={responses[question.key]?.[option] || 3}
                    onChange={(e) =>
                      handleResponse(
                        {
                          target: {
                            value: {
                              ...(responses[question.key] || {}),
                              [option]: parseInt(e.target.value),
                            },
                          },
                        },
                        question
                      )
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 w-20 text-right">
                    {question.labels[1]}
                  </span>
                  <span className="w-8 text-center text-sm font-medium">
                    {responses[question.key]?.[option] || 3}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );

      case "dynamic-slider-group":
        return (
          <div className="space-y-4">
            {dynamicSubjects.map((subject) => (
              <div key={subject} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {subject}
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 w-20">
                    {question.labels[0]}
                  </span>
                  <input
                    type="range"
                    min={question.min}
                    max={question.max}
                    value={responses[question.key]?.[subject] || 3}
                    onChange={(e) =>
                      handleResponse(
                        {
                          target: {
                            value: {
                              ...(responses[question.key] || {}),
                              [subject]: parseInt(e.target.value),
                            },
                          },
                        },
                        question
                      )
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 w-20 text-right">
                    {question.labels[1]}
                  </span>
                  <span className="w-8 text-center text-sm font-medium">
                    {responses[question.key]?.[subject] || 3}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );

      case "schedule-grid":
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-200 p-2 bg-gray-50"></th>
                  {question.columnOptions.map((col) => (
                    <th
                      key={col}
                      className="border border-gray-200 p-2 text-sm bg-gray-50"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.rowOptions.map((row) => (
                  <tr key={row}>
                    <td className="border border-gray-200 p-2 text-sm bg-gray-50">
                      {row}
                    </td>
                    {question.columnOptions.map((col) => {
                      const cellId = `${row}-${col}`;
                      return (
                        <td
                          key={cellId}
                          className="border border-gray-200 p-2 text-center"
                        >
                          <input
                            type="checkbox"
                            checked={
                              responses[question.key]?.includes(cellId) || false
                            }
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(responses[question.key] || []), cellId]
                                : (responses[question.key] || []).filter(
                                    (item) => item !== cellId
                                  );
                              handleResponse(
                                {
                                  target: {
                                    value: newValue,
                                  },
                                },
                                question
                              );
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">
              Mark times when you&apos;re unavailable due to commitments
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
        {questions.map((q) => (
          <div key={q.id} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              {q.question}
              {q.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {renderInput(q)}
          </div>
        ))}

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Anything else we should know about your study preferences?
          </h3>
          <textarea
            onChange={(e) => handleResponse(e)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Optional additional information..."
            rows={3}
            disabled={loading}
            value={responses.additionalNotes || ""}
          />
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          onClick={generatePlan}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 text-lg font-medium"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating Your Plan...
            </>
          ) : (
            <>
              Generate My Personalized Study Plan
              <svg
                className="h-5 w-5 ml-3"
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
            </>
          )}
        </button>
      </div>
    </div>
  );
};
