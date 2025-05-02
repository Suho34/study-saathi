import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const askAI = async (question, language, studentLevel) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Role: You're StudySaathi, an AI tutor for Indian students. 
      Current Student Level: ${studentLevel.label}
      
      Core Instructions:
      1. Language: Respond in ${language} (${studentLevel.languageRatio})
      2. Complexity: ${studentLevel.complexityLevel}/5
      3. Focus Areas: ${studentLevel.focus}
      4. Taboos: ${studentLevel.taboos}

      Level-Specific Rules:
      ${studentLevel.prompt}

      Format Requirements:
      - Max 500 words
      - Use ${studentLevel.exampleType} examples
      - Follow: ${studentLevel.responseStructure}

      Student's Question: "${question}"
      
      Response Strategy:
      1. Diagnose knowledge gaps in question
      2. Apply ${studentLevel.teachingMethod} teaching method
      3. Include ${studentLevel.engagementElements}
      4. Add ${studentLevel.assessmentPrep} tips if relevant

      Final Output:`;

    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === "Hindi"
      ? "तकनीकी समस्या आई है। कृपया कुछ मिनट बाद पुनः प्रयास करें!"
      : "Technical issue encountered. Please try again in a few minutes!";
  }
};
