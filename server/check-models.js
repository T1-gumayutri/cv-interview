require('dotenv').config();

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No GEMINI_API_KEY found in .env file.");
    return;
  }

  console.log("Fetching available models for your API Key...");
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.error) {
      console.error("\nAPI Error:", data.error.message);
      return;
    }

    console.log("\n=== Models available for generateContent ===");
    data.models?.forEach(model => {
      if (model.supportedGenerationMethods?.includes('generateContent')) {
        console.log(`- ${model.name.replace('models/', '')}`);
      }
    });
  } catch (error) {
    console.error("Error fetching models:", error);
  }
}

checkModels();