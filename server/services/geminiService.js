const Groq = require('groq-sdk');

// Khởi tạo Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Sử dụng Llama 3.3 70B: Rất thông minh, tuân thủ nghiêm ngặt instruction
const MODEL_NAME = 'llama-3.3-70b-versatile'; 

// Hàm dùng chung để gọi API và ép kiểu JSON
const callGroq = async (prompt) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL_NAME,
      temperature: 0.2, // Giảm tính ngẫu nhiên, giúp câu trả lời chuẩn xác hơn
      response_format: { type: 'json_object' }, // Ép buộc Llama 3 trả về định dạng JSON
    });
    
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw new Error("AI Processing failed");
  }
};

exports.analyzeGap = async (cvText, jobDescription, language = 'vi-VN') => {
  const targetLang = language === 'en-US' ? 'English' : 'VIETNAMESE';
  const prompt = `
  You are a brutally honest senior recruiter. Analyze this CV against the Job Description below.
  Identify real gaps.
  
  CV: ${cvText}
  Job Description: ${jobDescription}
  
  You MUST return ONLY valid JSON with this exact structure.
  IMPORTANT: You MUST generate ALL textual values in natural ${targetLang} language. However, the JSON keys MUST remain in English as shown below.
  {
    "candidateName": "string",
    "fitScore": number (0-100),
    "fitVerdict": "Strong Fit" | "Partial Fit" | "Not Ready Yet",
    "matchedSkills": ["string"],
    "missingSkills": ["string"],
    "overqualified": ["string"],
    "summary": "string (2 sentences, honest assessment in ${targetLang})"
  }
  `;
  return await callGroq(prompt);
};

exports.generateQuestions = async (gapAnalysisJSON, jobDescription, language = 'vi-VN') => {
  const targetLang = language === 'en-US' ? 'English' : 'VIETNAMESE';
  const prompt = `
  Based on this gap analysis, generate exactly 5 interview questions.
  Focus on missingSkills and JD responsibilities.
  Include 1 behavioral question and 1 reality check about their level.
  
  Gap Analysis: ${JSON.stringify(gapAnalysisJSON)}
  Job Description: ${jobDescription}
  
  You MUST return ONLY valid JSON with this exact structure.
  IMPORTANT: You MUST generate ALL textual values (especially 'text' and 'topic') in natural ${targetLang} language. The JSON keys MUST remain in English.
  {
    "questions": [
      {
        "id": number,
        "text": "string (Question in ${targetLang})",
        "topic": "string (Topic in ${targetLang})",
        "type": "gap_probe" | "behavioral" | "reality_check"
      }
    ]
  }
  `;
  return await callGroq(prompt);
};

exports.evaluateAnswer = async (jobDescription, questionText, questionType, transcript, language = 'vi-VN') => {
  const targetLang = language === 'en-US' ? 'English' : 'VIETNAMESE';
  const prompt = `
  You are a strict but fair interview coach. Evaluate this candidate's answer.
  
  Job Description: ${jobDescription}
  Question: ${questionText} (Type: ${questionType})
  Raw Candidate Answer: ${transcript}
  
  Task 1: Format the raw transcript. CRITICAL RULES FOR 'correctedTranscript':
   - RULE 1: If the raw transcript is gibberish, random numbers (e.g., '123'), too short, or nonsensical, YOU MUST NOT CHANGE IT. Return the EXACT raw transcript.
   - RULE 2: ONLY fix spelling and mixed English/Vietnamese IT jargon (e.g., 'rì ắc' -> 'React').
   - RULE 3: NEVER answer the question on behalf of the candidate. NEVER add meaning that wasn't explicitly spoken. DO NOT guess or fix phonetic misrecognitions if it changes the literal words.
   - Output this as 'correctedTranscript' in ${targetLang}.
  Task 2: Evaluate the answer and be direct about weaknesses.
  
  You MUST return ONLY valid JSON with this exact structure.
  IMPORTANT: You MUST generate ALL textual values in natural ${targetLang} language. The JSON keys MUST remain in English.
  {
    "correctedTranscript": "string (the grammar/spelling fixed version in ${targetLang})",
    "score": number (1-10),
    "strengths": "string (DETAILED analysis, 2-3 bullet points in ${targetLang})",
    "weaknesses": "string (DETAILED analysis, 2-3 bullet points in ${targetLang})",
    "modelAnswer": "string (in ${targetLang})",
    "tip": "string (in ${targetLang})"
  }
  `;
  return await callGroq(prompt);
};

exports.generateFinalReport = async (fitScore, fitVerdict, missingSkills, answersJSON, language = 'vi-VN') => {
  const targetLang = language === 'en-US' ? 'English' : 'VIETNAMESE';
  const prompt = `
  You are a senior recruiter writing a final assessment report.
  The candidate needs truth, not comfort.
  
  CV-JD Fit Score: ${fitScore}% (${fitVerdict})
  Missing Skills: ${missingSkills.join(', ')}
  All Q&A evaluations: ${JSON.stringify(answersJSON)}
  
  You MUST return ONLY valid JSON with this exact structure.
  IMPORTANT: You MUST generate ALL textual values in natural ${targetLang} language. The JSON keys MUST remain in English. (Except hiringRecommendation values should remain exactly as shown).
  {
    "overallFeedback": "string (HIGHLY DETAILED analysis, at least 2 long paragraphs detailing their technical depth and communication skills in ${targetLang})",
    "closingGaps": ["string (in ${targetLang})"],
    "hiringRecommendation": "Hire" | "Maybe" | "Not Yet"
  }
  `;
  return await callGroq(prompt);
};