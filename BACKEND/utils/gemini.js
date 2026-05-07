const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'api key');

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function urlToGenerativePart(url, mimeType) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    }
  };
}

const extractClinicalData = async (imagePath, mimeType) => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'api key') {
    console.log('GEMINI_API_KEY is mocked. Returning mock AI summary.');
    return {
      diagnoses: ['Type 2 Diabetes', 'Hypertension'],
      medications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'twice daily', duration: 'ongoing' },
        { name: 'Telmisartan', dosage: '40mg', frequency: 'once daily', duration: 'ongoing' }
      ],
      tests: ['HbA1c', 'Fasting Glucose', 'Lipid profile'],
      visitDate: new Date().toISOString(),
      notes: 'Follow up in 1 month',
      summary: 'Patient with T2DM and HTN. Medications: Metformin 500mg BD, Telmisartan 40mg OD. HbA1c 7.8%, Fasting Glucose 162. Consider intensifying therapy.',
      riskAlerts: ['Worsening diabetes trend', 'Elevated LDL'],
      missingData: ['Recent creatinine', 'Foot exam']
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `
      Analyze this medical prescription. Extract the following information in strict JSON format without any markdown wrappers or additional text:
      {
        "diagnoses": ["string array"],
        "medications": [
          { "name": "string", "dosage": "string", "frequency": "string", "duration": "string" }
        ],
        "tests": ["string array"],
        "visitDate": "ISO string",
        "notes": "string",
        "summary": "Create a concise, 2-sentence clinical summary for a doctor.",
        "riskAlerts": ["Detect any conflicting medications, abnormal trends, or missing essential tests based on standard guidelines. Keep them short."],
        "missingData": ["What standard tests or data are missing for these specific diagnoses?"]
      }
    `;

    let imagePart;
    if (imagePath.startsWith('http')) {
      imagePart = await urlToGenerativePart(imagePath, mimeType);
    } else {
      imagePart = fileToGenerativePart(imagePath, mimeType);
    }

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text().trim();
    
    // Clean up Markdown JSON wrappers if the model includes them despite instructions
    const cleanedJson = responseText.replace(/```json/i, '').replace(/```/g, '');
    const data = JSON.parse(cleanedJson);
    return data;
  } catch (error) {
    console.error('Gemini extraction error:', error);
    throw new Error('Failed to process image through Google AI.');
  }
};

module.exports = { extractClinicalData };
